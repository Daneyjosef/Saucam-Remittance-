import { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Menu,
  MenuItem as MenuItemComponent,
} from '@mui/material';
import {
  ArrowBack,
  Flag,
  CheckCircle,
  Search,
  FileDownload,
  FilterList,
} from '@mui/icons-material';
import { toast, Toaster } from 'sonner';

interface FlaggedTransaction {
  id: string;
  timestamp: string;
  branch: string;
  teller: string;
  customerName: string;
  amount: number;
  currency: string;
  flagReason: string;
  status: 'Pending' | 'Approved' | 'Under Investigation';
  riskLevel: 'High' | 'Medium' | 'Low';
}

const mockTransactions: FlaggedTransaction[] = [
  {
    id: 'FTX-001',
    timestamp: '2026-06-03 14:32:15',
    branch: 'Downtown Main Office',
    teller: 'Jessica Martinez',
    customerName: 'Ahmed Hassan',
    amount: 12000,
    currency: 'USD',
    flagReason: 'Above CBN threshold (>$10,000)',
    status: 'Pending',
    riskLevel: 'High',
  },
  {
    id: 'FTX-002',
    timestamp: '2026-06-03 13:45:22',
    branch: 'Victoria Island Branch',
    teller: 'Emeka Okonkwo',
    customerName: 'Sarah Johnson',
    amount: 8500000,
    currency: 'NGN',
    flagReason: 'Multiple transactions within 1 hour',
    status: 'Pending',
    riskLevel: 'Medium',
  },
  {
    id: 'FTX-003',
    timestamp: '2026-06-03 12:18:45',
    branch: 'Lekki Branch',
    teller: 'Chioma Nwosu',
    customerName: 'John Adebayo',
    amount: 15000,
    currency: 'USD',
    flagReason: 'Above CBN threshold (>$10,000)',
    status: 'Pending',
    riskLevel: 'High',
  },
  {
    id: 'FTX-004',
    timestamp: '2026-06-03 11:52:30',
    branch: 'Downtown Main Office',
    teller: 'Jessica Martinez',
    customerName: 'Maria Garcia',
    amount: 4500,
    currency: 'GBP',
    flagReason: 'Unusual currency for customer profile',
    status: 'Pending',
    riskLevel: 'Low',
  },
  {
    id: 'FTX-005',
    timestamp: '2026-06-03 10:25:18',
    branch: 'Ikeja Branch',
    teller: 'Bolaji Adeyemi',
    customerName: 'Chen Wei',
    amount: 22000,
    currency: 'USD',
    flagReason: 'Above CBN threshold (>$10,000), New customer (<30 days)',
    status: 'Under Investigation',
    riskLevel: 'High',
  },
  {
    id: 'FTX-006',
    timestamp: '2026-06-03 09:15:42',
    branch: 'Victoria Island Branch',
    teller: 'Emeka Okonkwo',
    customerName: 'Abdul Rahman',
    amount: 6800000,
    currency: 'NGN',
    flagReason: 'Rapid succession of transactions',
    status: 'Approved',
    riskLevel: 'Medium',
  },
];

const branches = [
  'All Branches',
  'Downtown Main Office',
  'Victoria Island Branch',
  'Lekki Branch',
  'Ikeja Branch',
  'Yaba Branch',
];

interface FlaggedTransactionsScreenProps {
  onBack?: () => void;
}

export default function FlaggedTransactionsScreen({ onBack }: FlaggedTransactionsScreenProps) {
  const [transactions, setTransactions] = useState<FlaggedTransaction[]>(mockTransactions);
  const [selectedBranch, setSelectedBranch] = useState('All Branches');
  const [dateFrom, setDateFrom] = useState('2026-06-03');
  const [dateTo, setDateTo] = useState('2026-06-03');
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(null);

  const handleApprove = (id: string) => {
    setTransactions(
      transactions.map((txn) =>
        txn.id === id ? { ...txn, status: 'Approved' as const } : txn
      )
    );
    toast.success('Transaction approved', {
      description: `Transaction ${id} has been approved and cleared.`,
    });
  };

  const handleInvestigate = (id: string) => {
    setTransactions(
      transactions.map((txn) =>
        txn.id === id ? { ...txn, status: 'Under Investigation' as const } : txn
      )
    );
    toast.info('Marked for investigation', {
      description: `Transaction ${id} has been flagged for detailed review.`,
    });
  };

  const handleExportClick = (event: React.MouseEvent<HTMLElement>) => {
    setExportMenuAnchor(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportMenuAnchor(null);
  };

  const handleExportPDF = () => {
    toast.success('Exporting to PDF', {
      description: 'Your report is being generated...',
    });
    handleExportClose();
  };

  const handleExportExcel = () => {
    toast.success('Exporting to Excel', {
      description: 'Your spreadsheet is being generated...',
    });
    handleExportClose();
  };

  const filteredTransactions = transactions.filter((txn) => {
    if (selectedBranch !== 'All Branches' && txn.branch !== selectedBranch) {
      return false;
    }
    return true;
  });

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High':
        return { bgcolor: '#fee2e2', color: '#dc2626' };
      case 'Medium':
        return { bgcolor: '#fef3c7', color: '#f59e0b' };
      case 'Low':
        return { bgcolor: '#dbeafe', color: '#2563eb' };
      default:
        return { bgcolor: '#f3f4f6', color: '#6b7280' };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return { bgcolor: '#fef3c7', color: '#f59e0b' };
      case 'Approved':
        return { bgcolor: '#dcfce7', color: '#16a34a' };
      case 'Under Investigation':
        return { bgcolor: '#fee2e2', color: '#dc2626' };
      default:
        return { bgcolor: '#f3f4f6', color: '#6b7280' };
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f5f7fa' }}>
      <Toaster position="top-right" richColors />

      {/* Top Bar */}
      <AppBar position="static" sx={{ bgcolor: '#1e3a8a' }}>
        <Toolbar>
          {onBack && (
            <IconButton onClick={onBack} sx={{ color: 'white', mr: 2 }}>
              <ArrowBack />
            </IconButton>
          )}
          <Flag sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Flagged Transactions Review
          </Typography>
          <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>Compliance Officer</Typography>
              <Typography variant="body2">Mary Okafor</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>Date</Typography>
              <Typography variant="body2">June 3, 2026</Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: { xs: 2, md: 4 } }}>
        <Box sx={{ maxWidth: 1600, mx: 'auto' }}>
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ mb: 1, color: '#1e3a8a', fontSize: { xs: '1.5rem', md: '2rem' } }}>
              Compliance Review Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Review and manage flagged transactions for regulatory compliance
            </Typography>
          </Box>

          {/* Filters and Actions */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
              <TextField
                label="From Date"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 180 }}
              />
              <TextField
                label="To Date"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 180 }}
              />
              <FormControl sx={{ minWidth: 220 }}>
                <InputLabel>Branch</InputLabel>
                <Select
                  value={selectedBranch}
                  label="Branch"
                  onChange={(e) => setSelectedBranch(e.target.value)}
                >
                  {branches.map((branch) => (
                    <MenuItem key={branch} value={branch}>
                      {branch}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                sx={{
                  borderColor: '#1e3a8a',
                  color: '#1e3a8a',
                  '&:hover': { borderColor: '#1e40af', bgcolor: '#f0f9ff' },
                }}
              >
                Apply Filters
              </Button>
              <Box sx={{ flex: 1 }} />
              <Button
                variant="contained"
                startIcon={<FileDownload />}
                onClick={handleExportClick}
                sx={{
                  bgcolor: '#16a34a',
                  '&:hover': { bgcolor: '#15803d' },
                }}
              >
                Export Report
              </Button>
              <Menu
                anchorEl={exportMenuAnchor}
                open={Boolean(exportMenuAnchor)}
                onClose={handleExportClose}
              >
                <MenuItemComponent onClick={handleExportPDF}>Export to PDF</MenuItemComponent>
                <MenuItemComponent onClick={handleExportExcel}>Export to Excel</MenuItemComponent>
              </Menu>
            </Box>
          </Paper>

          {/* Summary Stats */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 2,
              mb: 3,
            }}
          >
            <Paper sx={{ p: 2.5, borderLeft: '4px solid #f59e0b' }}>
              <Typography variant="caption" color="text.secondary">
                Pending Review
              </Typography>
              <Typography variant="h4" sx={{ color: '#f59e0b', mt: 0.5 }}>
                {transactions.filter((t) => t.status === 'Pending').length}
              </Typography>
            </Paper>
            <Paper sx={{ p: 2.5, borderLeft: '4px solid #dc2626' }}>
              <Typography variant="caption" color="text.secondary">
                Under Investigation
              </Typography>
              <Typography variant="h4" sx={{ color: '#dc2626', mt: 0.5 }}>
                {transactions.filter((t) => t.status === 'Under Investigation').length}
              </Typography>
            </Paper>
            <Paper sx={{ p: 2.5, borderLeft: '4px solid #16a34a' }}>
              <Typography variant="caption" color="text.secondary">
                Approved Today
              </Typography>
              <Typography variant="h4" sx={{ color: '#16a34a', mt: 0.5 }}>
                {transactions.filter((t) => t.status === 'Approved').length}
              </Typography>
            </Paper>
            <Paper sx={{ p: 2.5, borderLeft: '4px solid #1e3a8a' }}>
              <Typography variant="caption" color="text.secondary">
                Total Flagged
              </Typography>
              <Typography variant="h4" sx={{ color: '#1e3a8a', mt: 0.5 }}>
                {transactions.length}
              </Typography>
            </Paper>
          </Box>

          {/* Transactions Table */}
          <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 1000 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#1e3a8a' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                      Transaction ID
                    </TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                      Timestamp
                    </TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                      Branch
                    </TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                      Teller
                    </TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                      Customer Name
                    </TableCell>
                    <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>
                      Amount
                    </TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                      Currency
                    </TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                      Flag Reason
                    </TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                      Risk
                    </TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                      Status
                    </TableCell>
                    <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTransactions.map((txn, index) => (
                    <TableRow
                      key={txn.id}
                      hover
                      sx={{
                        bgcolor: index % 2 === 0 ? '#ffffff' : '#f9fafb',
                        '&:hover': { bgcolor: '#f0f9ff !important' },
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                          {txn.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {txn.timestamp}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{txn.branch}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{txn.teller}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {txn.customerName}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {txn.amount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={txn.currency} size="small" sx={{ fontWeight: 600 }} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 250 }}>
                          {txn.flagReason}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={txn.riskLevel}
                          size="small"
                          sx={{
                            ...getRiskColor(txn.riskLevel),
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={txn.status}
                          size="small"
                          sx={{
                            ...getStatusColor(txn.status),
                            fontWeight: 600,
                            minWidth: 100,
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        {txn.status === 'Pending' && (
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Button
                              size="small"
                              variant="contained"
                              startIcon={<CheckCircle />}
                              onClick={() => handleApprove(txn.id)}
                              sx={{
                                bgcolor: '#16a34a',
                                '&:hover': { bgcolor: '#15803d' },
                              }}
                            >
                              Approve
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<Search />}
                              onClick={() => handleInvestigate(txn.id)}
                              sx={{
                                borderColor: '#f59e0b',
                                color: '#f59e0b',
                                '&:hover': {
                                  borderColor: '#d97706',
                                  bgcolor: '#fef3c7',
                                },
                              }}
                            >
                              Investigate
                            </Button>
                          </Box>
                        )}
                        {txn.status !== 'Pending' && (
                          <Typography variant="caption" color="text.secondary">
                            {txn.status === 'Approved' ? 'Cleared' : 'In Review'}
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
