import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const GeradorDeFaturas = () => {
    const [servicos, setServicos] = useState([
        { descricao: '', taxa: 0, horas: 0, valor: 0 }
    ]);
    const [numeroFatura, setNumeroFatura] = useState('FAT-001');
    const [dataFatura, setDataFatura] = useState('');
    const [dataVencimento, setDataVencimento] = useState('');
    const [cliente, setCliente] = useState('');
    const [taxaImposto, setTaxaImposto] = useState(0);
    const [condicoes, setCondicoes] = useState('');

    // Ref para capturar o conteúdo da fatura
    const faturaRef = useRef(null);

    const adicionarServico = () => {
        setServicos([...servicos, { descricao: '', taxa: 0, horas: 0, valor: 0 }]);
    };

    const removerServico = (index) => {
        const novosServicos = servicos.filter((_, i) => i !== index);
        setServicos(novosServicos);
    };

    const calcularValor = (taxa, horas, index) => {
        const novosServicos = [...servicos];
        novosServicos[index] = {
            ...novosServicos[index],
            taxa: parseFloat(taxa),
            horas: parseFloat(horas),
            valor: taxa * horas
        };
        setServicos(novosServicos);
    };

    const subtotal = servicos.reduce((soma, servico) => soma + servico.valor, 0);
    const imposto = subtotal * (taxaImposto / 100);
    const total = subtotal + imposto;

    // Função para gerar o PDF
    const gerarPDF = () => {
        const input = faturaRef.current;

        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4'); // Formato A4
            const imgWidth = 210; // Largura do A4 em mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`fatura_${numeroFatura}.pdf`); // Nome do arquivo PDF
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div ref={faturaRef} className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
                {/* Cabeçalho */}
                <div className="flex justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">DevFatura Pro</h1>
                        <p className="text-gray-600">Rua dos Devs, 123</p>
                        <p className="text-gray-600">Cidade Tech, SP 01234-567</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-semibold text-blue-600">Fatura</h2>
                        <div className="mt-2 space-y-1">
                            <p className="text-gray-600">Número da Fatura: <input
                                type="text"
                                value={numeroFatura}
                                onChange={(e) => setNumeroFatura(e.target.value)}
                                className="border-b border-gray-300 focus:outline-none focus:border-blue-500 text-black"
                            /></p>
                            <p className="text-gray-600">Data: <input
                                type="date"
                                value={dataFatura}
                                onChange={(e) => setDataFatura(e.target.value)}
                                className="border-b border-gray-300 focus:outline-none focus:border-blue-500 text-black"
                            /></p>
                            <p className="text-gray-600">Data de Vencimento: <input
                                type="date"
                                value={dataVencimento}
                                onChange={(e) => setDataVencimento(e.target.value)}
                                className="border-b border-gray-300 focus:outline-none focus:border-blue-500 text-black"
                            /></p>
                        </div>
                    </div>
                </div>

                {/* Cliente */}
                <div className="flex justify-between mb-8">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Cliente:</h3>
                        <input
                            type="text"
                            value={cliente}
                            onChange={(e) => setCliente(e.target.value)}
                            placeholder="Nome do Cliente/Empresa"
                            className="w-64 p-2 border rounded-lg text-black"
                        />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Taxa de Imposto (%):</h3>
                        <input
                            type="number"
                            value={taxaImposto}
                            onChange={(e) => setTaxaImposto(e.target.value)}
                            className="w-24 p-2 border rounded-lg text-black"
                        />
                    </div>
                </div>

                {/* Tabela de Serviços */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Serviços</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-4 py-2 text-left text-gray-600">Descrição</th>
                                    <th className="px-4 py-2 text-right text-gray-600">Taxa por Hora (R$)</th>
                                    <th className="px-4 py-2 text-right text-gray-600">Horas</th>
                                    <th className="px-4 py-2 text-right text-gray-600">Valor (R$)</th>
                                    <th className="px-4 py-2 text-right text-gray-600">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {servicos.map((servico, index) => (
                                    <tr key={index} className="border-b border-gray-200">
                                        <td className="px-4 py-3">
                                            <input
                                                type="text"
                                                placeholder="Descrição do serviço"
                                                className="w-full p-2 border rounded-lg text-black"
                                                value={servico.descricao}
                                                onChange={(e) => {
                                                    const novosServicos = [...servicos];
                                                    novosServicos[index].descricao = e.target.value;
                                                    setServicos(novosServicos);
                                                }}
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="number"
                                                className="w-full p-2 border rounded-lg text-right text-black"
                                                value={servico.taxa}
                                                onChange={(e) => calcularValor(e.target.value, servico.horas, index)}
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="number"
                                                className="w-full p-2 border rounded-lg text-right text-black"
                                                value={servico.horas}
                                                onChange={(e) => calcularValor(servico.taxa, e.target.value, index)}
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-right font-mono">
                                            R$ {servico.valor.toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => removerServico(index)}
                                                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                            >
                                                Remover
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <button
                        onClick={adicionarServico}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Adicionar Serviço
                    </button>
                </div>

                {/* Totais */}
                <div className="flex justify-end mb-8">
                    <div className="w-64">
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
                            <span className="font-mono">R$ {total.to