import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Cabeçalho da fatura
const InvoiceHeader = ({
    modoEdicao,
    numeroFatura,
    setNumeroFatura,
    dataFatura,
    setDataFatura,
    dataVencimento,
    setDataVencimento,
}) => (
    <div className="flex flex-col md:flex-row justify-between items-center border-b pb-6 mb-6">
        <div>
            <h1 className="text-4xl font-extrabold text-gray-900">DevInvoice Pro</h1>
            <p className="text-lg text-gray-500">Invoice Generator</p>
        </div>
        <div className="text-center md:text-right">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Invoice Details</h2>
            <div className="space-y-2">
                {modoEdicao ? (
                    <div className="flex items-center justify-end space-x-2">
                        <span className="text-gray-600 font-medium">Number:</span>
                        <input
                            type="text"
                            value={numeroFatura}
                            onChange={(e) => setNumeroFatura(e.target.value)}
                            className="w-28 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                    </div>
                ) : (
                    <p className="text-gray-600">
                        Invoice Number: <span className="font-semibold">{numeroFatura}</span>
                    </p>
                )}
                <div className="flex items-center justify-end space-x-2">
                    <span className="text-gray-600 font-medium">Date:</span>
                    {modoEdicao ? (
                        <input
                            type="date"
                            value={dataFatura}
                            onChange={(e) => setDataFatura(e.target.value)}
                            className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                    ) : (
                        <span className="font-semibold text-gray-800">{dataFatura}</span>
                    )}
                </div>
                <div className="flex items-center justify-end space-x-2">
                    <span className="text-gray-600 font-medium">Due Date:</span>
                    {modoEdicao ? (
                        <input
                            type="date"
                            value={dataVencimento}
                            onChange={(e) => setDataVencimento(e.target.value)}
                            className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                    ) : (
                        <span className="font-semibold text-gray-800">{dataVencimento}</span>
                    )}
                </div>
            </div>
        </div>
    </div>
);

// Seção de dados do cliente
const ClientInfo = ({ modoEdicao, cliente, setCliente }) => (
    <div className="mb-6 border-b pb-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-3">Client Information</h3>
        {modoEdicao ? (
            <input
                type="text"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                placeholder="Client/Company Name"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
        ) : (
            <p className="p-3 text-gray-700">{cliente}</p>
        )}
    </div>
);

// Campo para inserir a Tax Rate (taxa de imposto)
const TaxRateInput = ({ modoEdicao, taxaImposto, setTaxaImposto }) => (
    <div className="mb-6 border-b pb-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-3">Tax Rate (%)</h3>
        {modoEdicao ? (
            <input
                type="number"
                value={taxaImposto}
                onChange={(e) => setTaxaImposto(e.target.value)}
                placeholder="Enter tax rate"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
        ) : (
            <p className="p-3 text-gray-700">{taxaImposto}%</p>
        )}
    </div>
);

// Tabela de serviços
const ServicesTable = ({
    modoEdicao,
    servicos,
    calcularValor,
    adicionarServico,
    removerServico,
    setServicos,
}) => (
    <div className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Services</h3>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-3 text-left text-gray-600">Description</th>
                        <th className="px-4 py-3 text-right text-gray-600">Hourly Rate ($)</th>
                        <th className="px-4 py-3 text-right text-gray-600">Hours</th>
                        <th className="px-4 py-3 text-right text-gray-600">Amount ($)</th>
                        {modoEdicao && (
                            <th className="px-4 py-3 text-right text-gray-600">Actions</th>
                        )}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {servicos.map((servico, index) => (
                        <tr key={index}>
                            <td className="px-4 py-3">
                                {modoEdicao ? (
                                    <input
                                        type="text"
                                        placeholder="Service description"
                                        value={servico.descricao}
                                        onChange={(e) => {
                                            const novosServicos = [...servicos];
                                            novosServicos[index].descricao = e.target.value;
                                            setServicos(novosServicos);
                                        }}
                                        className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                                    />
                                ) : (
                                    <p className="text-gray-700">{servico.descricao}</p>
                                )}
                            </td>
                            <td className="px-4 py-3 text-right">
                                {modoEdicao ? (
                                    <input
                                        type="number"
                                        value={servico.taxa}
                                        onChange={(e) => calcularValor(e.target.value, servico.horas, index)}
                                        className="w-full p-2 border border-gray-300 rounded-lg shadow-sm text-right focus:outline-none focus:ring-2 focus:ring-gray-400"
                                    />
                                ) : (
                                    <p className="text-gray-700">{servico.taxa}</p>
                                )}
                            </td>
                            <td className="px-4 py-3 text-right">
                                {modoEdicao ? (
                                    <input
                                        type="number"
                                        value={servico.horas}
                                        onChange={(e) => calcularValor(servico.taxa, e.target.value, index)}
                                        className="w-full p-2 border border-gray-300 rounded-lg shadow-sm text-right focus:outline-none focus:ring-2 focus:ring-gray-400"
                                    />
                                ) : (
                                    <p className="text-gray-700">{servico.horas}</p>
                                )}
                            </td>
                            <td className="px-4 py-3 text-right font-mono text-gray-700">
                                $ {servico.valor.toFixed(2)}
                            </td>
                            {modoEdicao && (
                                <td className="px-4 py-3 text-right">
                                    <button
                                        onClick={() => removerServico(index)}
                                        className="px-3 py-1 bg-gray-700 text-white rounded-lg shadow-sm hover:bg-gray-800 focus:outline-none"
                                    >
                                        Remove
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        {modoEdicao && (
            <div className="mt-4 text-right">
                <button
                    onClick={adicionarServico}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg shadow-sm hover:bg-gray-800 focus:outline-none"
                >
                    Add Service
                </button>
            </div>
        )}
    </div>
);

// Seção de totais da fatura
const InvoiceTotals = ({ subtotal, imposto, total, taxaImposto }) => (
    <div className="flex justify-end mb-6 border-t pt-4">
        <div className="w-72">
            <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-700">Subtotal:</span>
                <span className="font-mono text-gray-700">$ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-700">Tax ({taxaImposto}%):</span>
                <span className="font-mono text-gray-700">$ {imposto.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
                <span className="font-semibold text-gray-700">Total:</span>
                <span className="font-mono text-gray-700">$ {total.toFixed(2)}</span>
            </div>
        </div>
    </div>
);

// Seção de condições de pagamento
const PaymentTerms = ({ modoEdicao, condicoes, setCondicoes }) => (
    <div className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-3">Payment Terms</h3>
        {modoEdicao ? (
            <textarea
                value={condicoes}
                onChange={(e) => setCondicoes(e.target.value)}
                placeholder="Payment terms, notes, etc..."
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            ></textarea>
        ) : (
            <p className="p-3 text-gray-700">{condicoes}</p>
        )}
    </div>
);

// Botões de ação (download e compartilhamento)
const ActionButtons = ({ modoEdicao, gerarPDF, compartilharViaWhatsApp }) =>
    modoEdicao && (
        <div className="flex flex-col sm:flex-row justify-center mt-8 gap-4">
            <button
                onClick={gerarPDF}
                className="px-6 py-3 bg-gray-800 text-white rounded-lg shadow-sm hover:bg-gray-900 focus:outline-none"
            >
                Download Invoice PDF
            </button>
            <button
                onClick={compartilharViaWhatsApp}
                className="px-6 py-3 bg-gray-800 text-white rounded-lg shadow-sm hover:bg-gray-900 focus:outline-none"
            >
                Share via WhatsApp
            </button>
        </div>
    );

const GeradorDeFaturas = () => {
    // Estados
    const [servicos, setServicos] = useState([
        { descricao: '', taxa: 0, horas: 0, valor: 0 },
    ]);
    const [numeroFatura, setNumeroFatura] = useState('INV-001');
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

    // Handlers para serviços
    const adicionarServico = () => {
        setServicos([...servicos, { descricao: '', taxa: 0, horas: 0, valor: 0 }]);
    };

    const removerServico = (index) => {
        setServicos(servicos.filter((_, i) => i !== index));
    };

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

    // Geração do PDF (mantida inalterada)
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

            pdf.save(`invoice_${numeroFatura}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
        } finally {
            setModoEdicao(true);
        }
    };

    // Compartilhamento via WhatsApp (mantido inalterado)
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

            const link = document.createElement('a');
            link.href = imgData;
            link.download = `invoice_${numeroFatura}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            const mensagem = `Hello, please find invoice ${numeroFatura} with the amount $${total.toFixed(2)}.`;
            const urlWhatsApp = telefone.trim()
                ? `https://wa.me/${telefone.trim()}?text=${encodeURIComponent(mensagem)}`
                : `https://wa.me/?text=${encodeURIComponent(mensagem)}`;

            window.open(urlWhatsApp, '_blank');
        } catch (error) {
            console.error('Error sharing via WhatsApp:', error);
        } finally {
            setModoEdicao(true);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            {modoEdicao && (
                <div className="flex justify-center mb-6">
                    <input
                        type="text"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        placeholder="Enter WhatsApp number (e.g. 15551234567)"
                        className="w-72 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                </div>
            )}

            <div ref={faturaRef} className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8 border border-gray-200">
                <InvoiceHeader
                    modoEdicao={modoEdicao}
                    numeroFatura={numeroFatura}
                    setNumeroFatura={setNumeroFatura}
                    dataFatura={dataFatura}
                    setDataFatura={setDataFatura}
                    dataVencimento={dataVencimento}
                    setDataVencimento={setDataVencimento}
                />
                <ClientInfo modoEdicao={modoEdicao} cliente={cliente} setCliente={setCliente} />
                <TaxRateInput modoEdicao={modoEdicao} taxaImposto={taxaImposto} setTaxaImposto={setTaxaImposto} />
                <ServicesTable
                    modoEdicao={modoEdicao}
                    servicos={servicos}
                    calcularValor={calcularValor}
                    adicionarServico={adicionarServico}
                    removerServico={removerServico}
                    setServicos={setServicos}
                />
                <InvoiceTotals subtotal={subtotal} imposto={imposto} total={total} taxaImposto={taxaImposto} />
                <PaymentTerms modoEdicao={modoEdicao} condicoes={condicoes} setCondicoes={setCondicoes} />
            </div>

            <ActionButtons modoEdicao={modoEdicao} gerarPDF={gerarPDF} compartilharViaWhatsApp={compartilharViaWhatsApp} />
        </div>
    );
};

export default GeradorDeFaturas;
