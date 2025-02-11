import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Grid,
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CssBaseline,
    InputAdornment,
    CircularProgress,
    Chip,
    Switch,
    FormControlLabel,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    Download,
    Share,
    AddCircleOutline,
    Delete,
    Person,
    Payment,
    Phone,
    Description,
    Event,
    MonetizationOn,
    CheckCircle,
    Info
} from '@mui/icons-material';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#4CAF50', // Verde
            contrastText: '#fff',
        },
        secondary: {
            main: '#9C27B0', // Roxo
        },
        background: {
            default: '#1E1E1E', // Fundo escuro
            paper: '#2D2D2D', // Cards escuros
        },
        text: {
            primary: '#FFFFFF', // Texto branco
            secondary: '#B0B0B0', // Texto cinza claro
        },
    },
    typography: {
        fontFamily: 'Inter, sans-serif',
        h4: {
            fontWeight: 700,
            letterSpacing: '-0.5px',
        },
        subtitle1: {
            color: '#B0B0B0',
        },
    },
    components: {
        MuiTableCell: {
            styleOverrides: {
                root: {
                    padding: '12px 16px',
                },
            },
        },
    },
});


const InvoiceHeader = ({
    modoEdicao,
    numeroFatura,
    setNumeroFatura,
    dataFatura,
    setDataFatura,
    dataVencimento,
    setDataVencimento,
}) => (
    <Box
        mb={4}
        sx={{
            background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
            color: 'white',
            borderRadius: 2,
            p: 3,
            boxShadow: 3,
        }}
    >
        <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <Description sx={{ fontSize: 40 }} />
                    <Typography variant="h4" component="h1">
                        DevInvoice Pro
                    </Typography>
                </Box>
                <Typography variant="subtitle1">
                    Professional Invoice Generator
                </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{
                    bgcolor: 'rgba(255,255,255,0.1)',
                    p: 2,
                    borderRadius: 2,
                    backdropFilter: 'blur(4px)',
                }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={12}>
                            {modoEdicao ? (
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    label="Invoice Number"
                                    value={numeroFatura}
                                    onChange={(e) => setNumeroFatura(e.target.value)}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">#</InputAdornment>,
                                        sx: { color: 'white' }
                                    }}
                                    sx={{
                                        '& .MuiInputBase-root': { backgroundColor: 'rgba(255,255,255,0.15)' },
                                        '& .MuiFormLabel-root': { color: 'rgba(255,255,255,0.8)' }
                                    }}
                                />
                            ) : (
                                <Box>
                                    <Typography variant="body2">Invoice Number</Typography>
                                    <Typography variant="h6">#{numeroFatura}</Typography>
                                </Box>
                            )}
                        </Grid>

                        <Grid item xs={6} sm={3} md={6}>
                            {modoEdicao ? (
                                <TextField
                                    fullWidth
                                    type="date"
                                    variant="filled"
                                    label="Issue Date"
                                    value={dataFatura}
                                    onChange={(e) => setDataFatura(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    sx={{
                                        '& .MuiInputBase-root': { backgroundColor: 'rgba(255,255,255,0.15)' },
                                        '& .MuiFormLabel-root': { color: 'rgba(255,255,255,0.8)' }
                                    }}
                                />
                            ) : (
                                <Box>
                                    <Typography variant="body2">Issue Date</Typography>
                                    <Typography variant="body1">{dataFatura}</Typography>
                                </Box>
                            )}
                        </Grid>

                        <Grid item xs={6} sm={3} md={6}>
                            {modoEdicao ? (
                                <TextField
                                    fullWidth
                                    type="date"
                                    variant="filled"
                                    label="Due Date"
                                    value={dataVencimento}
                                    onChange={(e) => setDataVencimento(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    sx={{
                                        '& .MuiInputBase-root': { backgroundColor: 'rgba(255,255,255,0.15)' },
                                        '& .MuiFormLabel-root': { color: 'rgba(255,255,255,0.8)' }
                                    }}
                                />
                            ) : (
                                <Box>
                                    <Typography variant="body2">Due Date</Typography>
                                    <Typography variant="body1">{dataVencimento}</Typography>
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    </Box>
);

const ClientInfo = ({ modoEdicao, cliente, setCliente }) => (
    <Box mb={4} sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Person fontSize="small" /> Client Information
        </Typography>
        {modoEdicao ? (
            <TextField
                fullWidth
                variant="filled"
                label="Client / Company Name"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                required
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Person color="action" />
                        </InputAdornment>
                    ),
                }}
            />
        ) : (
            <Typography variant="body1" sx={{ p: 1.5 }}>
                {cliente}
            </Typography>
        )}
    </Box>
);

const TaxRateInput = ({ modoEdicao, taxaImposto, setTaxaImposto }) => (
    <Box mb={4} sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Payment fontSize="small" /> Tax Information
        </Typography>
        {modoEdicao ? (
            <TextField
                fullWidth
                variant="filled"
                label="Tax Rate (%)"
                type="number"
                value={taxaImposto}
                onChange={(e) => setTaxaImposto(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <MonetizationOn color="action" />
                        </InputAdornment>
                    ),
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
            />
        ) : (
            <Typography variant="body1" sx={{ p: 1.5 }}>
                {taxaImposto}%
            </Typography>
        )}
    </Box>
);

const ServicesTable = ({
    modoEdicao,
    servicos,
    calcularValor,
    adicionarServico,
    removerServico,
    setServicos,
}) => (
    <Box mb={4} sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Description fontSize="small" /> Services
            </Typography>

            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'action.hover' }}>
                            <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>Rate</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>Hours</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>Amount</TableCell>
                            {modoEdicao && <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {servicos.map((servico, index) => (
                            <TableRow
                                key={index}
                                hover
                                sx={{ '&:hover td': { bgcolor: 'action.hover' } }}
                            >
                                <TableCell>
                                    {modoEdicao ? (
                                        <TextField
                                            fullWidth
                                            variant="standard"
                                            placeholder="Service description"
                                            value={servico.descricao}
                                            onChange={(e) => {
                                                const novosServicos = [...servicos];
                                                novosServicos[index].descricao = e.target.value;
                                                setServicos(novosServicos);
                                            }}
                                        />
                                    ) : (
                                        servico.descricao
                                    )}
                                </TableCell>

                                <TableCell align="right">
                                    {modoEdicao ? (
                                        <TextField
                                            type="number"
                                            variant="standard"
                                            value={servico.taxa}
                                            onChange={(e) => calcularValor(e.target.value, servico.horas, index)}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                            }}
                                            sx={{ maxWidth: 100 }}
                                        />
                                    ) : (
                                        `$${servico.taxa}`
                                    )}
                                </TableCell>

                                <TableCell align="right">
                                    {modoEdicao ? (
                                        <TextField
                                            type="number"
                                            variant="standard"
                                            value={servico.horas}
                                            onChange={(e) => calcularValor(servico.taxa, e.target.value, index)}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">hrs</InputAdornment>,
                                            }}
                                            sx={{ maxWidth: 100 }}
                                        />
                                    ) : (
                                        `${servico.horas} hrs`
                                    )}
                                </TableCell>

                                <TableCell align="right" sx={{ fontWeight: 500 }}>
                                    ${servico.valor.toFixed(2)}
                                </TableCell>

                                {modoEdicao && (
                                    <TableCell align="right">
                                        <IconButton
                                            color="error"
                                            onClick={() => removerServico(index)}
                                            size="small"
                                        >
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {modoEdicao && (
                <Box mt={2} textAlign="right">
                    <Button
                        variant="contained"
                        onClick={adicionarServico}
                        startIcon={<AddCircleOutline />}
                        sx={{ borderRadius: 2 }}
                    >
                        Add Service
                    </Button>
                </Box>
            )}
        </Box>
    </Box>
);

const InvoiceTotals = ({ subtotal, imposto, total, taxaImposto }) => (
    <Box mb={4} sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 2, boxShadow: 1 }}>
        <Grid container spacing={2} justifyContent="flex-end">
            <Grid item xs={6} sm={4} md={3}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">Subtotal:</Typography>
                    <Typography variant="body1" fontWeight="500">
                        ${subtotal.toFixed(2)}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">Tax ({taxaImposto}%):</Typography>
                    <Typography variant="body1" fontWeight="500">
                        ${imposto.toFixed(2)}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1" fontWeight="600">
                        Total:
                    </Typography>
                    <Typography variant="body1" fontWeight="600" color="primary.main">
                        ${total.toFixed(2)}
                    </Typography>
                </Box>
            </Grid>
        </Grid>
    </Box>
);

const PaymentTerms = ({ modoEdicao, condicoes, setCondicoes }) => (
    <Box mb={4} sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Info fontSize="small" /> Payment Terms & Notes
        </Typography>
        {modoEdicao ? (
            <TextField
                fullWidth
                variant="filled"
                multiline
                rows={3}
                value={condicoes}
                onChange={(e) => setCondicoes(e.target.value)}
                placeholder="Payment instructions, terms, or additional notes..."
            />
        ) : (
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {condicoes}
            </Typography>
        )}
    </Box>
);

const GeradorDeFaturas = () => {
    const [servicos, setServicos] = useState([{ descricao: '', taxa: 0, horas: 0, valor: 0 }]);
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
    const [isGenerating, setIsGenerating] = useState(false);

    const faturaRef = useRef(null);

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

    const gerarPDF = async () => {
        try {
            setIsGenerating(true);
            setModoEdicao(false);
            await new Promise((resolve) => setTimeout(resolve, 100));

            const input = faturaRef.current;
            const canvas = await html2canvas(input, { scale: 2 });

            const pdf = new jsPDF('p', 'cm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const imgData = canvas.toDataURL('image/png');
            const imgWidth = pdfWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`invoice_${numeroFatura}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
        } finally {
            setIsGenerating(false);
            setModoEdicao(true);
        }
    };

    const compartilharViaWhatsApp = async () => {
        try {
            setIsGenerating(true);
            setModoEdicao(false);
            await new Promise((resolve) => setTimeout(resolve, 100));

            const input = faturaRef.current;
            const canvas = await html2canvas(input, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');

            const link = document.createElement('a');
            link.href = imgData;
            link.download = `invoice_${numeroFatura}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            const mensagem = `Invoice #${numeroFatura}\nAmount Due: $${total.toFixed(2)}\nDue Date: ${dataVencimento}`;
            const urlWhatsApp = `https://wa.me/${telefone.trim()}?text=${encodeURIComponent(mensagem)}`;
            window.open(urlWhatsApp, '_blank');
        } catch (error) {
            console.error('Error sharing via WhatsApp:', error);
        } finally {
            setIsGenerating(false);
            setModoEdicao(true);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="md" sx={{ py: 6 }}>
                <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
                    <FormControlLabel
                        control={
                            <Switch
                                checked={modoEdicao}
                                onChange={() => setModoEdicao(!modoEdicao)}
                                color="primary"
                            />
                        }
                        label="Edit Mode"
                    />
                </Box>

                {modoEdicao && (
                    <Box mb={4} sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 2, boxShadow: 1 }}>
                        <TextField
                            fullWidth
                            variant="filled"
                            label="WhatsApp Number"
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
                            placeholder="Country code + number (e.g. 5511999999999)"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Phone color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                )}

                <Paper ref={faturaRef} elevation={0} sx={{ p: 4, mb: 4, borderRadius: 4 }}>
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
                </Paper>

                {modoEdicao && (
                    <Box sx={{
                        position: 'sticky',
                        bottom: 20,
                        bgcolor: 'background.paper',
                        p: 2,
                        borderRadius: 4,
                        boxShadow: 3,
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 2
                    }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={gerarPDF}
                            disabled={isGenerating}
                            startIcon={isGenerating ? <CircularProgress size={20} /> : <Download />}
                            sx={{ borderRadius: 2, px: 4 }}
                        >
                            {isGenerating ? 'Generating...' : 'Download PDF'}
                        </Button>

                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={compartilharViaWhatsApp}
                            disabled={isGenerating || !telefone}
                            startIcon={<Share />}
                            sx={{ borderRadius: 2, px: 4 }}
                        >
                            Share via WhatsApp
                        </Button>
                    </Box>
                )}
            </Container>
        </ThemeProvider>
    );
};

export default GeradorDeFaturas;