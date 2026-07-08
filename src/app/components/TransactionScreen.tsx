import { useState, useEffect } from 'react';
import {
  Typography, Box, Paper, TextField, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  MenuItem, Select, FormControl, InputLabel, InputAdornment,
  Autocomplete, Card, CardContent, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Divider,
} from '@mui/material';
import { SwapHoriz, Send, GetApp, Person, Print, CheckCircle, PersonAdd } from '@mui/icons-material';
import AppShell from './AppShell';
import AddCustomerModal, { NewCustomer } from './AddCustomerModal';
import ReceiptModal from './ReceiptModal';
import { toast, Toaster } from 'sonner';
import { getRates } from '../rateStore';
import { addTransaction, generateTxId, shouldFlag, getTransactions, type StoredTransaction } from '../transactionStore';

interface Customer {
  id: string;
  name: string;
  idNumber: string;
}

interface Transaction {
  id: string;
  time: string;
  type: string;
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  customer: string;
  status: string;
}

const currencies = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
  { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
  { code: 'NGN', name: 'Nigerian Naira', flag: '🇳🇬' },
];

const mockCustomers: Customer[] = [
  { id: '1', name: 'John Anderson', idNumber: 'ID-2024-001' },
  { id: '2', name: 'Maria Garcia', idNumber: 'ID-2024-002' },
  { id: '3', name: 'Chen Wei', idNumber: 'ID-2024-003' },
  { id: '4', name: 'Sarah Johnson', idNumber: 'ID-2024-004' },
  { id: '5', name: 'Ahmed Hassan', idNumber: 'ID-2024-005' },
];

const mockExchangeRates: { [key: string]: number } = {
  'USD-EUR': 0.92,
  'USD-GBP': 0.79,
  'USD-JPY': 149.50,
  'EUR-USD': 1.09,
  'GBP-USD': 1.27,
  'JPY-USD': 0.0067,
  'USD-CAD': 1.36,
  'USD-AUD': 1.52,
  'USD-CHF': 0.88,
  'USD-CNY': 7.24,
  'USD-NGN': 1450.00,
  'NGN-USD': 0.00069,
};

const mockTransactions: Transaction[] = [
  { id: 'TXN-001', time: '14:32', type: 'Exchange', fromCurrency: 'USD', toCurrency: 'EUR', amount: 1000, customer: 'John Anderson', status: 'Completed' },
  { id: 'TXN-002', time: '14:18', type: 'Transfer Out', fromCurrency: 'EUR', toCurrency: 'GBP', amount: 500, customer: 'Maria Garcia', status: 'Completed' },
  { id: 'TXN-003', time: '13:55', type: 'Remittance In', fromCurrency: 'JPY', toCurrency: 'USD', amount: 50000, customer: 'Chen Wei', status: 'Completed' },
];

interface TransactionScreenProps { onLogout?: () => void; userName?: string; userRoleLabel?: string; }

export default function TransactionScreen({ onLogout, userName, userRoleLabel }: TransactionScreenProps) {
  const [selectedType, setSelectedType] = useState<string>('exchange');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('NGN');
  const [amount, setAmount] = useState<string>('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [idNumber, setIdNumber] = useState<string>('');
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [recentTxns, setRecentTxns] = useState<StoredTransaction[]>(() => getTransactions().slice(0, 20));

  useEffect(() => { setRecentTxns(getTransactions().slice(0, 20)); }, []);

  const getExchangeRate = (): number => {
    const rates = getRates();
    const active = rates.filter(r => r.status === 'Active');
    const direct = active.find(r => r.baseCurrency === fromCurrency && r.quoteCurrency === toCurrency);
    if (direct) return direct.sellRate;
    const inverse = active.find(r => r.baseCurrency === toCurrency && r.quoteCurrency === fromCurrency);
    if (inverse) return parseFloat((1 / inverse.buyRate).toFixed(6));
    // Fallback to mock
    const key = `${fromCurrency}-${toCurrency}`;
    return mockExchangeRates[key] || 1.0;
  };

  const calculateTotal = () => {
    const numAmount = parseFloat(amount) || 0;
    return (numAmount * getExchangeRate()).toFixed(2);
  };

  const handleCustomerSelect = (_event: any, value: Customer | null) => {
    setSelectedCustomer(value);
    setIdNumber(value?.idNumber || '');
  };

  const handleConfirmTransaction = () => {
    const numAmount = parseFloat(amount) || 0;
    if (!numAmount) { toast.error('Please enter an amount'); return; }
    if (!selectedCustomer && !idNumber) { toast.error('Please select or add a customer'); return; }
    const rate = getExchangeRate();
    const total = numAmount * rate;
    const charges = numAmount * 0.005;
    const now = new Date();
    const txId = generateTxId();
    const typeLabel = selectedType === 'exchange' ? 'Exchange' : selectedType === 'transfer' ? 'Transfer Out' : 'Remittance In';
    const flagCheck = shouldFlag({ amountGiven: numAmount, fromCurrency } as StoredTransaction);

    const tx: StoredTransaction = {
      id: txId,
      timestamp: now.toISOString(),
      date: now.toISOString().slice(0, 10),
      time: now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      type: typeLabel as StoredTransaction['type'],
      fromCurrency, toCurrency,
      amountGiven: numAmount,
      amountReceived: parseFloat(total.toFixed(2)),
      rateUsed: rate,
      customerName: selectedCustomer?.name || 'Walk-in Customer',
      customerId: selectedCustomer?.idNumber || idNumber || 'WALK-IN',
      tellerUsername: userName?.toLowerCase().replace(' ', '.') || 'teller',
      tellerName: userName || 'Teller',
      branch: 'Downtown Main Office',
      status: flagCheck.flag ? 'Flagged' : 'Completed',
      ...(flagCheck.flag ? { flagReason: flagCheck.reason, flagRisk: flagCheck.risk } : {}),
    };
    addTransaction(tx);
    setRecentTxns(getTransactions().slice(0, 20));

    if (flagCheck.flag) toast.warning(`Transaction flagged: ${flagCheck.reason}`, { duration: 5000 });
    else toast.success(`Transaction ${txId} completed`);

    const receipt = {
      transactionRef: txId,
      branchName: 'Downtown Main Office',
      dateTime: now.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      teller: userName || 'Teller',
      customerName: selectedCustomer?.name || 'Walk-in Customer',
      transactionType: selectedType === 'exchange' ? 'Currency Exchange' : selectedType === 'transfer' ? 'Outbound Transfer' : 'Inbound Remittance',
      fromCurrency, fromAmount: numAmount, exchangeRate: rate, toCurrency, toAmount: parseFloat(total.toFixed(2)), charges, paymentMethod: 'Cash',
    };
    setReceiptData(receipt);
    setIsReceiptModalOpen(true);
    setAmount('');
    setSelectedCustomer(null);
    setIdNumber('');
  };

  const handlePrintReceipt = () => { if (receiptData) setIsReceiptModalOpen(true); };

  const handleSaveCustomer = (newCustomer: NewCustomer) => {
    const customer: Customer = { id: `${customers.length + 1}`, name: newCustomer.fullName, idNumber: newCustomer.idNumber };
    setCustomers([...customers, customer]);
    setSelectedCustomer(customer);
    setIdNumber(customer.idNumber);
  };

  const txTypes = [
    { type: 'exchange',   icon: <SwapHoriz fontSize="small" />, label: 'Exchange' },
    { type: 'transfer',   icon: <Send fontSize="small" />,      label: 'Transfer Out' },
    { type: 'remittance', icon: <GetApp fontSize="small" />,    label: 'Remittance In' },
  ];

  const rateInfo = getRates().find(r => r.status === 'Active' && (
    (r.baseCurrency === fromCurrency && r.quoteCurrency === toCurrency) ||
    (r.baseCurrency === toCurrency && r.quoteCurrency === fromCurrency)
  ));

  return (
    <AppShell title="Saucam Pro" subtitle="Downtown Main Office" userLabel={userName || 'Staff'} userRole={userRoleLabel || 'Teller'} onLogout={onLogout}>
      <Toaster position="top-right" richColors />
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', flexDirection: { xs: 'column', md: 'row' } }}>

        {/* ── Desktop sidebar ── */}
        <Paper sx={{
          display: { xs: 'none', md: 'block' },
          width: 260, borderRadius: 0, flexShrink: 0,
          bgcolor: 'var(--color-surface)',
          borderRight: '1px solid var(--color-border)',
        }}>
          <Box sx={{ p: 2, borderBottom: '1px solid var(--color-border)' }}>
            <Typography variant="h6">Transaction Type</Typography>
          </Box>
          <List>
            {[
              { type: 'exchange',   icon: <SwapHoriz sx={{ color: 'var(--color-primary)' }} />, primary: 'Currency Exchange',  secondary: 'Buy or sell currency' },
              { type: 'transfer',   icon: <Send sx={{ color: 'var(--color-primary)' }} />,      primary: 'Outbound Transfer',  secondary: 'Send money abroad' },
              { type: 'remittance', icon: <GetApp sx={{ color: 'var(--color-primary)' }} />,    primary: 'Inbound Remittance', secondary: 'Receive money transfer' },
            ].map((item) => (
              <ListItem key={item.type} disablePadding>
                <ListItemButton selected={selectedType === item.type} onClick={() => setSelectedType(item.type)}
                  sx={{ '&.Mui-selected': { bgcolor: 'var(--color-info-bg)', borderLeft: '4px solid var(--color-primary)' } }}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.primary} secondary={item.secondary} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* ── Mobile tab bar ── */}
        <Box sx={{
          display: { xs: 'flex', md: 'none' },
          borderBottom: '1px solid var(--color-border)',
          bgcolor: 'var(--color-surface)',
          overflowX: 'auto',
          '&::-webkit-scrollbar': { display: 'none' },
        }}>
          {txTypes.map((item) => (
            <Box key={item.type} onClick={() => setSelectedType(item.type)}
              sx={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5,
                py: 1.5, px: 1, cursor: 'pointer', minWidth: 80,
                borderBottom: selectedType === item.type ? '3px solid var(--color-primary)' : '3px solid transparent',
                color: selectedType === item.type ? 'var(--color-primary)' : 'var(--color-text-3)',
                transition: 'all 0.15s',
              }}>
              {item.icon}
              <Typography variant="caption" sx={{ fontWeight: selectedType === item.type ? 700 : 400, fontSize: '0.65rem', whiteSpace: 'nowrap' }}>
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Center and Right Content */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', p: { xs: 1.5, md: 3 }, gap: { xs: 2, md: 3 } }}>

          {/* ── Mobile rate strip ── */}
          <Box sx={{
            display: { xs: 'flex', lg: 'none' },
            gap: 2, p: 1.5, borderRadius: 1,
            bgcolor: 'var(--color-info-subtle)',
            alignItems: 'center', justifyContent: 'space-between',
          }}>
            <Box>
              <Typography variant="caption" color="text.secondary">Rate</Typography>
              <Typography sx={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '1rem' }}>
                1 {fromCurrency} = {getExchangeRate().toFixed(4)} {toCurrency}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" color="text.secondary">Receives</Typography>
              <Typography sx={{ fontWeight: 700, color: 'var(--color-accent)', fontSize: '1.1rem' }}>
                {calculateTotal()} {toCurrency}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', flexDirection: { xs: 'column', lg: 'row' } }}>
            {/* Central Form */}
            <Paper sx={{ flex: 1, minWidth: { xs: '100%', md: 400 }, p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Transaction Details</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Currency row — stacks on xs */}
                <Box sx={{ display: 'flex', gap: 1.5, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>From Currency</InputLabel>
                    <Select value={fromCurrency} label="From Currency" onChange={(e) => setFromCurrency(e.target.value)}>
                      {currencies.map((curr) => <MenuItem key={curr.code} value={curr.code}>{curr.flag} {curr.code}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth size="small">
                    <InputLabel>To Currency</InputLabel>
                    <Select value={toCurrency} label="To Currency" onChange={(e) => setToCurrency(e.target.value)}>
                      {currencies.map((curr) => <MenuItem key={curr.code} value={curr.code}>{curr.flag} {curr.code}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Box>

                <TextField fullWidth label="Amount" type="number" size="small" value={amount} onChange={(e) => setAmount(e.target.value)}
                  inputMode="decimal"
                  InputProps={{ startAdornment: <InputAdornment position="start">{fromCurrency}</InputAdornment> }} />

                <Divider />

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Autocomplete fullWidth options={customers} getOptionLabel={(option) => option.name} value={selectedCustomer} onChange={handleCustomerSelect}
                    renderInput={(params) => (
                      <TextField {...params} label="Customer Name" size="small" placeholder="Search..."
                        InputProps={{ ...params.InputProps, startAdornment: <><InputAdornment position="start"><Person /></InputAdornment>{params.InputProps.startAdornment}</> }} />
                    )} />
                  <Button variant="outlined" onClick={() => setIsAddCustomerModalOpen(true)}
                    sx={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)', minWidth: 48, px: 1.5 }}>
                    <PersonAdd />
                  </Button>
                </Box>

                <TextField fullWidth size="small" label="ID Number" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} />

                {/* Action buttons — stack on mobile */}
                <Box sx={{ display: 'flex', gap: 1.5, mt: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <Button fullWidth variant="contained" size="large" startIcon={<CheckCircle />} onClick={handleConfirmTransaction}
                    sx={{ bgcolor: 'var(--color-accent)', '&:hover': { bgcolor: 'var(--color-accent-hover)' }, py: 1.5, fontSize: { xs: '0.9rem', md: '1rem' } }}>
                    Confirm Transaction
                  </Button>
                  <Button fullWidth variant="outlined" size="large" startIcon={<Print />} onClick={handlePrintReceipt}
                    sx={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)', py: 1.5 }}>
                    Print Receipt
                  </Button>
                </Box>
              </Box>
            </Paper>

            {/* Right Panel - Exchange Rate + Today's Stats (desktop only) */}
            <Box sx={{ display: { xs: 'none', lg: 'flex' }, flexDirection: 'column', gap: 2, width: 320, flexShrink: 0 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Exchange Rate</Typography>
                  <Box sx={{ bgcolor: 'var(--color-info-subtle)', p: 2, borderRadius: 1, mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">Current Rate</Typography>
                    <Typography variant="h4" sx={{ color: 'var(--color-primary)', my: 0.5, fontSize: '1.6rem' }}>{getExchangeRate().toFixed(4)}</Typography>
                    <Typography variant="body2" color="text.secondary">1 {fromCurrency} = {getExchangeRate().toFixed(4)} {toCurrency}</Typography>
                  </Box>
                  <Box sx={{ bgcolor: 'var(--color-accent-subtle)', p: 2, borderRadius: 1, mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">Customer Receives</Typography>
                    <Typography variant="h4" sx={{ color: 'var(--color-accent)', my: 0.5, fontSize: '1.6rem' }}>{calculateTotal()}</Typography>
                    <Typography variant="body2" color="text.secondary">{toCurrency}</Typography>
                  </Box>
                  <Box sx={{ p: 1.5, bgcolor: 'var(--color-warning-subtle)', borderRadius: 1 }}>
                    <Typography variant="caption">{rateInfo ? `Rate set: ${rateInfo.lastUpdated}` : 'Using fallback rate — manager should set rates'}</Typography>
                  </Box>
                </CardContent>
              </Card>
              {/* Today's Stats */}
              <Card>
                <CardContent sx={{ pb: '12px !important' }}>
                  <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, color: 'var(--color-text-1)' }}>Today's Activity</Typography>
                  {(() => {
                    const todayStr = new Date().toISOString().slice(0, 10);
                    const todayTxns = getTransactions().filter(t => t.date === todayStr);
                    const totalVol = todayTxns.reduce((s, t) => s + t.amountGiven, 0);
                    const flagged = todayTxns.filter(t => t.status === 'Flagged' || t.status === 'Pending').length;
                    return (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {[
                          { label: 'Transactions', value: todayTxns.length, color: 'var(--color-primary)' },
                          { label: 'Total Volume', value: totalVol > 0 ? `${(totalVol / 1000).toFixed(1)}K` : '0', color: 'var(--color-accent)' },
                          { label: 'Flagged', value: flagged, color: flagged > 0 ? 'var(--color-danger)' : 'var(--color-text-3)' },
                        ].map(s => (
                          <Box key={s.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, borderRadius: 1, bgcolor: 'var(--color-bg-subtle)' }}>
                            <Typography variant="body2" color="text.secondary">{s.label}</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 700, color: s.color }}>{s.value}</Typography>
                          </Box>
                        ))}
                      </Box>
                    );
                  })()}
                </CardContent>
              </Card>
              {/* Active Rates quick view */}
              <Card>
                <CardContent sx={{ pb: '12px !important' }}>
                  <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, color: 'var(--color-text-1)' }}>Active Rates</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {getRates().filter(r => r.status === 'Active').slice(0, 5).map(r => (
                      <Box key={r.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.75, borderBottom: '1px solid var(--color-border)', '&:last-child': { borderBottom: 'none' } }}>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-primary)' }}>{r.currencyPair}</Typography>
                        <Typography variant="caption" color="text.secondary">{r.sellRate.toFixed(r.sellRate >= 100 ? 2 : 4)}</Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>

          {/* Recent Transactions */}
          <Paper sx={{ p: { xs: 1.5, md: 3 } }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Recent Transactions</Typography>
            {recentTxns.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>No transactions yet — complete one above to see it here.</Typography>
            ) : (
              <>
                {/* Mobile cards */}
                <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 1 }}>
                  {recentTxns.map((txn) => (
                    <Box key={txn.id} sx={{ p: 1.5, borderRadius: 1, border: '1px solid var(--color-border)', bgcolor: 'var(--color-surface)' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography sx={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.8rem' }}>{txn.id}</Typography>
                        <Box component="span" sx={{ px: 1.5, py: 0.25, borderRadius: 1, fontSize: '0.7rem', fontWeight: 700,
                          bgcolor: txn.status === 'Flagged' ? 'var(--color-danger-bg)' : 'var(--color-success-bg)',
                          color: txn.status === 'Flagged' ? 'var(--color-danger)' : 'var(--color-accent)' }}>
                          {txn.status}
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">{txn.customerName}</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{txn.amountGiven.toLocaleString()} {txn.fromCurrency} → {txn.toCurrency}</Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">{txn.type} · {txn.time}</Typography>
                    </Box>
                  ))}
                </Box>
                {/* Desktop table */}
                <TableContainer sx={{ display: { xs: 'none', md: 'block' }, overflowX: 'auto' }}>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'var(--color-bg-subtle)' }}>
                        <TableCell>Transaction ID</TableCell><TableCell>Time</TableCell><TableCell>Type</TableCell>
                        <TableCell>From</TableCell><TableCell>To</TableCell><TableCell align="right">Amount</TableCell>
                        <TableCell>Customer</TableCell><TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentTxns.map((txn) => (
                        <TableRow key={txn.id} hover>
                          <TableCell sx={{ color: 'var(--color-primary)', fontWeight: 'var(--weight-semibold)' }}>{txn.id}</TableCell>
                          <TableCell>{txn.time}</TableCell><TableCell>{txn.type}</TableCell>
                          <TableCell>{txn.fromCurrency}</TableCell><TableCell>{txn.toCurrency}</TableCell>
                          <TableCell align="right">{txn.amountGiven.toLocaleString()}</TableCell>
                          <TableCell>{txn.customerName}</TableCell>
                          <TableCell>
                            <Box component="span" sx={{ px: 2, py: 0.5, borderRadius: 1,
                              bgcolor: txn.status === 'Flagged' ? 'var(--color-danger-bg)' : 'var(--color-success-bg)',
                              color: txn.status === 'Flagged' ? 'var(--color-danger)' : 'var(--color-accent)', fontSize: 'var(--text-base)' }}>
                              {txn.status}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Paper>
        </Box>
      </Box>

      <AddCustomerModal open={isAddCustomerModalOpen} onClose={() => setIsAddCustomerModalOpen(false)} onSave={handleSaveCustomer} />
      <ReceiptModal open={isReceiptModalOpen} onClose={() => setIsReceiptModalOpen(false)} receiptData={receiptData} />
    </AppShell>
  );
}
