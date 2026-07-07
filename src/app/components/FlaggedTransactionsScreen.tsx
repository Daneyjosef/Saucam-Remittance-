import { useState } from 'react';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Typography, Chip,
  TextField, FormControl, InputLabel, Select, MenuItem,
  Menu, MenuItem as MenuItemComponent,
} from '@mui/material';
import { Flag, CheckCircle, Search, FileDownload, FilterList } from '@mui/icons-material';
import AppShell from './AppShell';
import { toast, Toaster } from 'sonner';

interface FlaggedTransaction {
  id: string; timestamp: string; branch: string; teller: string;
  customerName: string; amount: number; currency: string;
  flagReason: string; status: 'Pending' | 'Approved' | 'Under Investigation'; riskLevel: 'High' | 'Medium' | 'Low';
}

const mockTransactions: FlaggedTransaction[] = [
  { id: 'FTX-001', timestamp: '2026-06-03 14:32:15', branch: 'Downtown Main Office', teller: 'Jessica Martinez', customerName: 'Ahmed Hassan', amount: 12000, currency: 'USD', flagReason: 'Above CBN threshold (>$10,000)', status: 'Pending', riskLevel: 'High' },
  { id: 'FTX-002', timestamp: '2026-06-03 13:45:22', branch: 'Victoria Island Branch', teller: 'Emeka Okonkwo', customerName: 'Sarah Johnson', amount: 8500000, currency: 'NGN', flagReason: 'Multiple transactions within 1 hour', status: 'Pending', riskLevel: 'Medium' },
  { id: 'FTX-003', timestamp: '2026-06-03 12:18:45', branch: 'Lekki Branch', teller: 'Chioma Nwosu', customerName: 'John Adebayo', amount: 15000, currency: 'USD', flagReason: 'Above CBN threshold (>$10,000)', status: 'Pending', riskLevel: 'High' },
  { id: 'FTX-004', timestamp: '2026-06-03 11:52:30', branch: 'Downtown Main Office', teller: 'Jessica Martinez', customerName: 'Maria Garcia', amount: 4500, currency: 'GBP', flagReason: 'Unusual currency for customer profile', status: 'Pending', riskLevel: 'Low' },
  { id: 'FTX-005', timestamp: '2026-06-03 10:25:18', branch: 'Ikeja Branch', teller: 'Bolaji Adeyemi', customerName: 'Chen Wei', amount: 22000, currency: 'USD', flagReason: 'Above CBN threshold (>$10,000), New customer (<30 days)', status: 'Under Investigation', riskLevel: 'High' },
  { id: 'FTX-006', timestamp: '2026-06-03 09:15:42', branch: 'Victoria Island Branch', teller: 'Emeka Okonkwo', customerName: 'Abdul Rahman', amount: 6800000, currency: 'NGN', flagReason: 'Rapid succession of transactions', status: 'Approved', riskLevel: 'Medium' },
];

const branches = ['All Branches', 'Downtown Main Office', 'Victoria Island Branch', 'Lekki Branch', 'Ikeja Branch', 'Yaba Branch'];

interface FlaggedTransactionsScreenProps { onBack?: () => void; onLogout?: () => void; userName?: string; userRoleLabel?: string; }

export default function FlaggedTransactionsScreen({ onBack, onLogout, userName, userRoleLabel }: FlaggedTransactionsScreenProps) {
  const [transactions, setTransactions] = useState<FlaggedTransaction[]>(mockTransactions);
  const [selectedBranch, setSelectedBranch] = useState('All Branches');
  const [dateFrom, setDateFrom] = useState('2026-06-03');
  const [dateTo, setDateTo] = useState('2026-06-03');
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(null);

  const handleApprove = (id: string) => {
    setTransactions(transactions.map((txn) => txn.id === id ? { ...txn, status: 'Approved' as const } : txn));
    toast.success('Transaction approved', { description: `Transaction ${id} has been approved and cleared.` });
  };

  const handleInvestigate = (id: string) => {
    setTransactions(transactions.map((txn) => txn.id === id ? { ...txn, status: 'Under Investigation' as const } : txn));
    toast.info('Marked for investigation', { description: `Transaction ${id} has been flagged for detailed review.` });
  };

  const handleExportClick = (event: React.MouseEvent<HTMLElement>) => setExportMenuAnchor(event.currentTarget);
  const handleExportClose = () => setExportMenuAnchor(null);
  const handleExportPDF = () => { toast.success('Exporting to PDF', { description: 'Your report is being generated...' }); handleExportClose(); };
  const handleExportExcel = () => { toast.success('Exporting to Excel', { description: 'Your spreadsheet is being generated...' }); handleExportClose(); };

  const filteredTransactions = transactions.filter((txn) => selectedBranch === 'All Branches' || txn.branch === selectedBranch);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High':   return { bgcolor: 'var(--color-danger-bg)', color: 'var(--color-danger)' };
      case 'Medium': return { bgcolor: 'var(--color-warning-bg)', color: 'var(--color-warning)' };
      case 'Low':    return { bgcolor: 'var(--color-info-bg)', color: 'var(--color-info)' };
      default:       return { bgcolor: 'var(--color-surface-muted)', color: 'var(--color-text-3)' };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':            return { bgcolor: 'var(--color-warning-bg)', color: 'var(--color-warning)' };
      case 'Approved':           return { bgcolor: 'var(--color-success-bg)', color: 'var(--color-accent)' };
      case 'Under Investigation': return { bgcolor: 'var(--color-danger-bg)', color: 'var(--color-danger)' };
      default:                   return { bgcolor: 'var(--color-surface-muted)', color: 'var(--color-text-3)' };
    }
  };

  return (
    <AppShell title="Compliance Review" subtitle="Flagged transactions pending review" icon={<Flag sx={{ fontSize: 18 }} />} userLabel={userName || 'Mary Okafor'} userRole={userRoleLabel || 'Compliance Officer'} onBack={onBack} onLogout={onLogout}>
      <Toaster position="top-right" richColors />
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Box sx={{ maxWidth: 'var(--container-max)', mx: 'auto' }}>
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ mb: 1, color: 'var(--color-primary)', fontSize: { xs: 'var(--text-3xl)', md: 'var(--text-5xl)' } }}>
              Compliance Review Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">Review and manage flagged transactions for regulatory compliance</Typography>
          </Box>

          {/* Filters and Actions */}
          <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
              <TextField label="From Date" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ minWidth: { xs: '100%', sm: 180 }, flex: { xs: '1 1 100%', sm: 'none' } }} />
              <TextField label="To Date" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ minWidth: { xs: '100%', sm: 180 }, flex: { xs: '1 1 100%', sm: 'none' } }} />
              <FormControl sx={{ minWidth: { xs: '100%', sm: 220 }, flex: { xs: '1 1 100%', sm: 'none' } }}>
                <InputLabel>Branch</InputLabel>
                <Select value={selectedBranch} label="Branch" onChange={(e) => setSelectedBranch(e.target.value)}>
                  {branches.map((branch) => <MenuItem key={branch} value={branch}>{branch}</MenuItem>)}
                </Select>
              </FormControl>
              <Button variant="outlined" startIcon={<FilterList />}
                sx={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)', '&:hover': { borderColor: 'var(--color-primary-hover)', bgcolor: 'var(--color-info-subtle)' } }}>
                Apply Filters
              </Button>
              <Box sx={{ flex: 1 }} />
              <Button variant="contained" startIcon={<FileDownload />} onClick={handleExportClick}
                sx={{ bgcolor: 'var(--color-accent)', '&:hover': { bgcolor: 'var(--color-accent-hover)' } }}>
                Export Report
              </Button>
              <Menu anchorEl={exportMenuAnchor} open={Boolean(exportMenuAnchor)} onClose={handleExportClose}>
                <MenuItemComponent onClick={handleExportPDF}>Export to PDF</MenuItemComponent>
                <MenuItemComponent onClick={handleExportExcel}>Export to Excel</MenuItemComponent>
              </Menu>
            </Box>
          </Paper>

          {/* Summary Stats */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
            <Paper sx={{ p: 2.5, borderLeft: '4px solid var(--color-warning)' }}>
              <Typography variant="caption" color="text.secondary">Pending Review</Typography>
              <Typography variant="h4" sx={{ color: 'var(--color-warning)', mt: 0.5 }}>{transactions.filter((t) => t.status === 'Pending').length}</Typography>
            </Paper>
            <Paper sx={{ p: 2.5, borderLeft: '4px solid var(--color-danger)' }}>
              <Typography variant="caption" color="text.secondary">Under Investigation</Typography>
              <Typography variant="h4" sx={{ color: 'var(--color-danger)', mt: 0.5 }}>{transactions.filter((t) => t.status === 'Under Investigation').length}</Typography>
            </Paper>
            <Paper sx={{ p: 2.5, borderLeft: '4px solid var(--color-accent)' }}>
              <Typography variant="caption" color="text.secondary">Approved Today</Typography>
              <Typography variant="h4" sx={{ color: 'var(--color-accent)', mt: 0.5 }}>{transactions.filter((t) => t.status === 'Approved').length}</Typography>
            </Paper>
            <Paper sx={{ p: 2.5, borderLeft: '4px solid var(--color-primary)' }}>
              <Typography variant="caption" color="text.secondary">Total Flagged</Typography>
              <Typography variant="h4" sx={{ color: 'var(--color-primary)', mt: 0.5 }}>{transactions.length}</Typography>
            </Paper>
          </Box>

          {/* Transactions Table */}
          <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 1000 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'var(--color-primary)' }}>
                    {['Transaction ID', 'Timestamp', 'Branch', 'Teller', 'Customer Name', 'Amount', 'Currency', 'Flag Reason', 'Risk', 'Status', 'Actions'].map((h, i) => (
                      <TableCell key={h} align={i === 5 ? 'right' : i === 10 ? 'center' : 'left'}
                        sx={{ color: 'var(--color-text-inverse)', fontWeight: 'var(--weight-semibold)' }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTransactions.map((txn, index) => (
                    <TableRow key={txn.id} hover
                      sx={{ bgcolor: index % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-subtle)', '&:hover': { bgcolor: 'var(--color-info-subtle) !important' } }}>
                      <TableCell><Typography variant="body2" sx={{ fontWeight: 'var(--weight-semibold)', color: 'var(--color-primary)' }}>{txn.id}</Typography></TableCell>
                      <TableCell><Typography variant="body2" color="text.secondary">{txn.timestamp}</Typography></TableCell>
                      <TableCell><Typography variant="body2">{txn.branch}</Typography></TableCell>
                      <TableCell><Typography variant="body2">{txn.teller}</Typography></TableCell>
                      <TableCell><Typography variant="body2" sx={{ fontWeight: 'var(--weight-medium)' }}>{txn.customerName}</Typography></TableCell>
                      <TableCell align="right"><Typography variant="body2" sx={{ fontWeight: 'var(--weight-semibold)' }}>{txn.amount.toLocaleString()}</Typography></TableCell>
                      <TableCell><Chip label={txn.currency} size="small" sx={{ fontWeight: 'var(--weight-semibold)' }} /></TableCell>
                      <TableCell><Typography variant="body2" sx={{ maxWidth: 250 }}>{txn.flagReason}</Typography></TableCell>
                      <TableCell><Chip label={txn.riskLevel} size="small" sx={{ ...getRiskColor(txn.riskLevel), fontWeight: 'var(--weight-semibold)' }} /></TableCell>
                      <TableCell><Chip label={txn.status} size="small" sx={{ ...getStatusColor(txn.status), fontWeight: 'var(--weight-semibold)', minWidth: 100 }} /></TableCell>
                      <TableCell align="center">
                        {txn.status === 'Pending' && (
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Button size="small" variant="contained" startIcon={<CheckCircle />} onClick={() => handleApprove(txn.id)}
                              sx={{ bgcolor: 'var(--color-accent)', '&:hover': { bgcolor: 'var(--color-accent-hover)' } }}>
                              Approve
                            </Button>
                            <Button size="small" variant="outlined" startIcon={<Search />} onClick={() => handleInvestigate(txn.id)}
                              sx={{ borderColor: 'var(--color-warning)', color: 'var(--color-warning)', '&:hover': { borderColor: 'var(--color-warning-dark)', bgcolor: 'var(--color-warning-subtle)' } }}>
                              Investigate
                            </Button>
                          </Box>
                        )}
                        {txn.status !== 'Pending' && (
                          <Typography variant="caption" color="text.secondary">{txn.status === 'Approved' ? 'Cleared' : 'In Review'}</Typography>
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
    </AppShell>
  );
}
