import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
  Autocomplete,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  SwapHoriz,
  Send,
  GetApp,
  Person,
  Print,
  CheckCircle,
  PersonAdd,
} from '@mui/icons-material';
import AddCustomerModal, { NewCustomer } from './AddCustomerModal';
import ReceiptModal from './ReceiptModal';

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
  {
    id: 'TXN-001',
    time: '14:32',
    type: 'Exchange',
    fromCurrency: 'USD',
    toCurrency: 'EUR',
    amount: 1000,
    customer: 'John Anderson',
    status: 'Completed',
  },
  {
    id: 'TXN-002',
    time: '14:18',
    type: 'Transfer Out',
    fromCurrency: 'EUR',
    toCurrency: 'GBP',
    amount: 500,
    customer: 'Maria Garcia',
    status: 'Completed',
  },
  {
    id: 'TXN-003',
    time: '13:55',
    type: 'Remittance In',
    fromCurrency: 'JPY',
    toCurrency: 'USD',
    amount: 50000,
    customer: 'Chen Wei',
    status: 'Completed',
  },
];

export default function TransactionScreen() {
  const [selectedType, setSelectedType] = useState<string>('exchange');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [amount, setAmount] = useState<string>('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [idNumber, setIdNumber] = useState<string>('');
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  const getExchangeRate = () => {
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
    const total = parseFloat(calculateTotal());
    const charges = numAmount * 0.005;

    const receipt = {
      transactionRef: `TXN-${Date.now().toString().slice(-8)}`,
      branchName: 'Downtown Main Office',
      dateTime: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      teller: 'Jessica Martinez',
      customerName: selectedCustomer?.name || 'Walk-in Customer',
      transactionType: selectedType === 'exchange' ? 'Currency Exchange' : selectedType === 'transfer' ? 'Outbound Transfer' : 'Inbound Remittance',
      fromCurrency,
      fromAmount: numAmount,
      exchangeRate: getExchangeRate(),
      toCurrency,
      toAmount: total,
      charges,
      paymentMethod: 'Cash',
    };

    setReceiptData(receipt);
    setIsReceiptModalOpen(true);
  };

  const handlePrintReceipt = () => {
    if (receiptData) {
      setIsReceiptModalOpen(true);
    }
  };

  const handleSaveCustomer = (newCustomer: NewCustomer) => {
    const customer: Customer = {
      id: `${customers.length + 1}`,
      name: newCustomer.fullName,
      idNumber: newCustomer.idNumber,
    };
    setCustomers([...customers, customer]);
    setSelectedCustomer(customer);
    setIdNumber(customer.idNumber);
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f5f7fa' }}>
      {/* Top Bar */}
      <AppBar position="static" sx={{ bgcolor: '#1e3a8a' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Saucam Pro
          </Typography>
          <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>Branch</Typography>
              <Typography variant="body2">Downtown Main Office</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>Teller</Typography>
              <Typography variant="body2">Jessica Martinez</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>Date</Typography>
              <Typography variant="body2">June 3, 2026</Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Left Panel - Transaction Types */}
        <Paper
          sx={{
            width: { xs: '100%', md: 280 },
            borderRadius: 0,
            bgcolor: '#ffffff',
            borderRight: { xs: 'none', md: '1px solid #e5e7eb' },
            borderBottom: { xs: '1px solid #e5e7eb', md: 'none' },
          }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid #e5e7eb' }}>
            <Typography variant="h6">Transaction Type</Typography>
          </Box>
          <List>
            <ListItem disablePadding>
              <ListItemButton
                selected={selectedType === 'exchange'}
                onClick={() => setSelectedType('exchange')}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: '#dbeafe',
                    borderLeft: '4px solid #1e3a8a',
                  },
                }}
              >
                <ListItemIcon>
                  <SwapHoriz sx={{ color: '#1e3a8a' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Currency Exchange"
                  secondary="Buy or sell currency"
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                selected={selectedType === 'transfer'}
                onClick={() => setSelectedType('transfer')}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: '#dbeafe',
                    borderLeft: '4px solid #1e3a8a',
                  },
                }}
              >
                <ListItemIcon>
                  <Send sx={{ color: '#1e3a8a' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Outbound Transfer"
                  secondary="Send money abroad"
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                selected={selectedType === 'remittance'}
                onClick={() => setSelectedType('remittance')}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: '#dbeafe',
                    borderLeft: '4px solid #1e3a8a',
                  },
                }}
              >
                <ListItemIcon>
                  <GetApp sx={{ color: '#1e3a8a' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Inbound Remittance"
                  secondary="Receive money transfer"
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Paper>

        {/* Center and Right Content */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', p: { xs: 2, md: 3 }, gap: 3 }}>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', flexDirection: { xs: 'column', lg: 'row' } }}>
            {/* Central Form */}
            <Paper sx={{ flex: 1, minWidth: { xs: '100%', md: 400 }, p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Transaction Details
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel>From Currency</InputLabel>
                    <Select
                      value={fromCurrency}
                      label="From Currency"
                      onChange={(e) => setFromCurrency(e.target.value)}
                    >
                      {currencies.map((curr) => (
                        <MenuItem key={curr.code} value={curr.code}>
                          {curr.flag} {curr.code} - {curr.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>To Currency</InputLabel>
                    <Select
                      value={toCurrency}
                      label="To Currency"
                      onChange={(e) => setToCurrency(e.target.value)}
                    >
                      {currencies.map((curr) => (
                        <MenuItem key={curr.code} value={curr.code}>
                          {curr.flag} {curr.code} - {curr.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">{fromCurrency}</InputAdornment>
                    ),
                  }}
                />

                <Divider />

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Autocomplete
                    fullWidth
                    options={customers}
                    getOptionLabel={(option) => option.name}
                    value={selectedCustomer}
                    onChange={handleCustomerSelect}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Customer Name"
                        placeholder="Search customer..."
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <>
                              <InputAdornment position="start">
                                <Person />
                              </InputAdornment>
                              {params.InputProps.startAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                  <Button
                    variant="outlined"
                    onClick={() => setIsAddCustomerModalOpen(true)}
                    sx={{
                      borderColor: '#1e3a8a',
                      color: '#1e3a8a',
                      '&:hover': {
                        borderColor: '#1e40af',
                        bgcolor: '#f0f9ff',
                      },
                      minWidth: 'auto',
                      px: 2,
                    }}
                  >
                    <PersonAdd />
                  </Button>
                </Box>

                <TextField
                  fullWidth
                  label="ID Number"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                />

                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={<CheckCircle />}
                    onClick={handleConfirmTransaction}
                    sx={{
                      bgcolor: '#16a34a',
                      '&:hover': { bgcolor: '#15803d' },
                      py: 1.5,
                    }}
                  >
                    Confirm Transaction
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<Print />}
                    onClick={handlePrintReceipt}
                    sx={{
                      borderColor: '#1e3a8a',
                      color: '#1e3a8a',
                      '&:hover': { borderColor: '#1e40af', bgcolor: '#f0f9ff' },
                      py: 1.5,
                      minWidth: 180,
                    }}
                  >
                    Print Receipt
                  </Button>
                </Box>
              </Box>
            </Paper>

            {/* Right Panel - Exchange Rate */}
            <Card sx={{ width: { xs: '100%', lg: 320 } }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Exchange Rate
                </Typography>
                <Box sx={{ bgcolor: '#f0f9ff', p: 2, borderRadius: 1, mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Current Rate
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#1e3a8a', my: 1 }}>
                    {getExchangeRate().toFixed(4)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    1 {fromCurrency} = {getExchangeRate().toFixed(4)} {toCurrency}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ bgcolor: '#dcfce7', p: 2, borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Customer Receives
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#16a34a', my: 1 }}>
                    {calculateTotal()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {toCurrency}
                  </Typography>
                </Box>

                <Box sx={{ mt: 2, p: 2, bgcolor: '#fef3c7', borderRadius: 1 }}>
                  <Typography variant="caption">
                    Rate updated: 14:35 UTC
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Recent Transactions Table */}
          <Paper sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Recent Transactions
            </Typography>
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f9fafb' }}>
                    <TableCell>Transaction ID</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>From</TableCell>
                    <TableCell>To</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockTransactions.map((txn) => (
                    <TableRow key={txn.id} hover>
                      <TableCell sx={{ color: '#1e3a8a' }}>{txn.id}</TableCell>
                      <TableCell>{txn.time}</TableCell>
                      <TableCell>{txn.type}</TableCell>
                      <TableCell>{txn.fromCurrency}</TableCell>
                      <TableCell>{txn.toCurrency}</TableCell>
                      <TableCell align="right">
                        {txn.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{txn.customer}</TableCell>
                      <TableCell>
                        <Box
                          component="span"
                          sx={{
                            px: 2,
                            py: 0.5,
                            borderRadius: 1,
                            bgcolor: '#dcfce7',
                            color: '#16a34a',
                            fontSize: '0.875rem',
                          }}
                        >
                          {txn.status}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Box>

      <AddCustomerModal
        open={isAddCustomerModalOpen}
        onClose={() => setIsAddCustomerModalOpen(false)}
        onSave={handleSaveCustomer}
      />

      <ReceiptModal
        open={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        receiptData={receiptData}
      />
    </Box>
  );
}
