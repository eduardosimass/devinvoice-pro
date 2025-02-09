import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const GeradorDeFaturas = () => {
    // Estados
    const [servicos, setServicos] = useState([{ descricao: '', taxa: 0, horas: 0, valor: 0 }]);
    const [numeroFatura, setNumeroFatura] = useState('FAT-001');
    const [dataFatura, setDataFatura] = useState(new Date().toISOString().split('T')[0]);
    const [dataVencimento, setDataVencimento] = useState(() => {
        const data = new Date();
        data.setDate(data.getDate() + 7);
        return data.toISOString().split('T')[0];
    });
    const [cliente, setCliente] = useState('');
    const [taxaImposto, setTaxaImposto] = useState(0);
    const [condicoes, setCondicoes] = useState('');
    const [modoEdicao, setModoEdicao] = useState(true);
    const [telefone, setTelefone] = useState('');

    const faturaRef = useRef(null);

    // Adiciona um novo serviço
    const adicionarServico = () => {
        setServicos([...servicos, { descricao: '', taxa: 0, horas: 0, valor: 0 }]);
    };

    // Remove um serviço da lista
    const removerServico = (index) => {
        setServicos(servicos.filter((_, i) => i !== index));
    };

    // Calcula o valor do serviço a partir da taxa e quantidade de horas
    const calcularValor = (taxa, horas, index) => {
        const novosServicos = [...servicos];
        const parsedTaxa = parseFloat(taxa) || 0;
        const parsedHoras = parseFloat(horas) || 0;
        novosServicos[index] = {
            ...novosServicos[index],
            taxa: parsedTaxa,
            horas: parsedHoras,
            valor: parsedTaxa * parsedHoras,
        };
        setServicos(novosServicos);
    };

    const subtotal = servicos.reduce((soma, servico) => soma + servico.valor, 0);
    const imposto = subtotal * (taxaImposto / 100);
    const total = subtotal + imposto;

    // Função para gerar o PDF a partir do HTML renderizado
    const gerarPDF = async () => {
        try {
            setModoEdicao(false);
            await new Promise((resolve) => setTimeout(resolve, 100));

            const input = faturaRef.current;
            const canvas = await html2canvas(input, {
                scale: 2,
                useCORS: true,
                onclone: (clonedDoc) => {
                    const elements = clonedDoc.body.querySelectorAll('*');
                    elements.forEach((el) => {
                        const computedStyle = window.getComputedStyle(el);
                        ['background-color', 'color', 'border-color'].forEach((prop) => {
                            const value = computedStyle.getPropertyValue(prop);
                            if (value && value.includes('oklch')) {
                                if (prop === 'background-color') el.style.backgroundColor = '#ffffff';
                                if (prop === 'color') el.style.color = '#000000';
                                if (prop === 'border-color') el.style.borderColor = '#000000';
                            }
                        });
                    });
                },
            });

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const scale = canvasWidth / pdfWidth;
            const pageHeightPx = pdfHeight * scale;
            const totalPages = Math.ceil(canvasHeight / pageHeightPx);

            for (let page = 0; page < totalPages; page++) {
                const pageCanvas = document.createElement('canvas');
                pageCanvas.width = canvasWidth;
                pageCanvas.height = pageHeightPx;
                const pageCtx = pageCanvas.getContext('2d');
                pageCtx.drawImage(
                    canvas,
                    0,
                    page * pageHeightPx,
                    canvasWidth,
                    pageHeightPx,
                    0,
                    0,
                    canvasWidth,
                    pageHeightPx
                );
                const pageData = pageCanvas.toDataURL('image/png');
                if (page > 0) pdf.addPage();
                pdf.addImage(pageData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            }

            pdf.save(`fatura_${numeroFatura}.pdf`);
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
        } finally {
            setModoEdicao(true);
        }
    };

    // Função para compartilhar a fatura via WhatsApp
    const compartilharViaWhatsApp = async () => {
        try {
            setModoEdicao(false);
            await new Promise((resolve) => setTimeout(resolve, 100));

            const input = faturaRef.current;
            const canvas = await html2canvas(input, {
                scale: 2,
                useCORS: true,
                onclone: (clonedDoc) => {
                    const elements = clonedDoc.body.querySelectorAll('*');
                    elements.forEach((el) => {
                        const computedStyle = window.getComputedStyle(el);
                        ['background-color', 'color', 'border-color'].forEach((prop) => {
                            const value = computedStyle.getPropertyValue(prop);
                            if (value && value.includes('oklch')) {
                                if (prop === 'background-color') el.style.backgroundColor = '#ffffff';
                                if (prop === 'color') el.style.color = '#000000';
                                if (prop === 'border-color') el.style.borderColor = '#000000';
                            }
                        });
                    });
                },
            });
            const imgData = canvas.toDataURL('image/png');

            // Cria um link para download da imagem (opcional)
            const link = document.createElement('a');
            link.href = imgData;
            link.download = `fatura_${numeroFatura}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            const mensagem = `Olá, segue a fatura ${numeroFatura} no valor de R$ ${total.toFixed(2)}.`;
            const urlWhatsApp = telefone.trim()
                ? `https://wa.me/${telefone.trim()}?text=${encodeURIComponent(mensagem)}`
                : `https://wa.me/?text=${encodeURIComponent(mensagem)}`;

            window.open(urlWhatsApp, '_blank');
        } catch (error) {
            console.error('Erro ao compartilhar via WhatsApp:', error);
        } finally {
            setModoEdicao(true);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 p-8">
            {/* Campo de Telefone para WhatsApp */}
            {modoEdicao && (
                <div className="flex justify-center mb-4">
                    <input
                        type="text"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        placeholder="Digite o número do WhatsApp (ex: 5511999998888)"
                        className="w-72 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                </div>
            )}

            <div ref={faturaRef} className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
                {/* Cabeçalho */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b pb-6">
                    <div className="mb-4 md:mb-0">
                        <h1 className="text-4xl font-extrabold text-blue-700">DevFatura Pro</h1>
                        <p className="text-gray-600">Rua dos Devs, 123</p>
                        <p className="text-gray-600">Cidade Tech, SP 01234-567</p>
                    </div>
                    <div className="text-center md:text-right">
                        <h2 className="text-2xl font-semibold text-gray-800">Fatura</h2>
                        <div className="mt-2 space-y-2">
                            {modoEdicao ? (
                                <div className="flex items-center justify-end space-x-2">
                                    <span className="text-gray-600">Número:</span>
                                    <input
                                        type="text"
                                        value={numeroFatura}
                                        onChange={(e) => setNumeroFatura(e.target.value)}
                                        className="w-32 p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            ) : (
                                <p className="text-gray-600">
                                    Número da Fatura: <span className="font-semibold">{numeroFatura}</span>
                                </p>
                            )}
                            <div className="flex items-center justify-end space-x-2">
                                <span className="text-gray-600">Data:</span>
                                {modoEdicao ? (
                                    <input
                                        type="date"
                                        value={dataFatura}
                                        onChange={(e) => setDataFatura(e.target.value)}
                                        className="p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                ) : (
                                    <span className="font-semibold">{dataFatura}</span>
                                )}
                            </div>
                            <div className="flex items-center justify-end space-x-2">
                                <span className="text-gray-600">Vencimento:</span>
                                {modoEdicao ? (
                                    <input
                                        type="date"
                                        value={dataVencimento}
                                        onChange={(e) => setDataVencimento(e.target.value)}
                                        className="p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                ) : (
                                    <span className="font-semibold">{dataVencimento}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dados do Cliente */}
                <div className="mb-8 border-b pb-6">
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Cliente:</h3>
                    {modoEdicao ? (
                        <input
                            type="text"
                            value={cliente}
                            onChange={(e) => setCliente(e.target.value)}
                            placeholder="Nome do Cliente/Empresa"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        />
                    ) : (
                        <p className="p-3 text-gray-800">{cliente}</p>
                    )}
                </div>

                {/* Tabela de Serviços */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Serviços</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-4 py-2 text-left text-gray-600">Descrição</th>
                                    <th className="px-4 py-2 text-right text-gray-600">Taxa por Hora (R$)</th>
                                    <th className="px-4 py-2 text-right text-gray-600">Horas</th>
                                    <th className="px-4 py-2 text-right text-gray-600">Valor (R$)</th>
                                    {modoEdicao && <th className="px-4 py-2 text-right text-gray-600">Ações</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {servicos.map((servico, index) => (
                                    <tr key={index} className="border-b border-gray-200">
                                        <td className="px-4 py-3">
                                            {modoEdicao ? (
                                                <input
                                                    type="text"
                                                    placeholder="Descrição do serviço"
                                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                                    value={servico.descricao}
                                                    onChange={(e) => {
                                                        const novosServicos = [...servicos];
                                                        novosServicos[index].descricao = e.target.value;
                                                        setServicos(novosServicos);
                                                    }}
                                                />
                                            ) : (
                                                <p>{servico.descricao}</p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {modoEdicao ? (
                                                <input
                                                    type="number"
                                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-right text-black"
                                                    value={servico.taxa}
                                                    onChange={(e) => calcularValor(e.target.value, servico.horas, index)}
                                                />
                                            ) : (
                                                <p className="text-right">{servico.taxa}</p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {modoEdicao ? (
                                                <input
                                                    type="number"
                                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-right text-black"
                                                    value={servico.horas}
                                                    onChange={(e) => calcularValor(servico.taxa, e.target.value, index)}
                                                />
                                            ) : (
                                                <p className="text-right">{servico.horas}</p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right font-mono">
                                            R$ {servico.valor.toFixed(2)}
                                        </td>
                                        {modoEdicao && (
                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    onClick={() => removerServico(index)}
                                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                                >
                                                    Remover
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {modoEdicao && (
                        <button
                            onClick={adicionarServico}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Adicionar Serviço
                        </button>
                    )}
                </div>

                {/* Totais */}
                <div className="flex justify-end mb-8 border-b pb-6">
                    <div className="w-72">
                        <div className="flex justify-between mb-2">
                            <span className="font-semibold">Subtotal:</span>
                            <span className="font-mono">R$ {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="font-semibold">Imposto ({taxaImposto}%):</span>
                            <span className="font-mono">R$ {imposto.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                            <span className="font-semibold">Total:</span>
                            <span className="font-mono">R$ {total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Condições de Pagamento */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Condições de Pagamento</h3>
                    {modoEdicao ? (
                        <textarea
                            value={condicoes}
                            onChange={(e) => setCondicoes(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            placeholder="Condições de pagamento, notas, etc..."
                            rows="3"
                        />
                    ) : (
                        <p className="p-3 text-gray-800">{condicoes}</p>
                    )}
                </div>
            </div>

            {/* Botões de Ação */}
            {modoEdicao && (
                <div className="flex flex-col sm:flex-row justify-center mt-8 space-y-4 sm:space-y-0 sm:space-x-4">
                    <button
                        onClick={gerarPDF}
                        className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Baixar Fatura em PDF
                    </button>
                    <button
                        onClick={compartilharViaWhatsApp}
                        className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Compartilhar via WhatsApp
                    </button>
                </div>
            )}
        </div>
    );
};

export default GeradorDeFaturas;
