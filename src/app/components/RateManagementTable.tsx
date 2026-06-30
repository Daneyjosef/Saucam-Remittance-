import { useState } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, Typography, IconButton } from '@mui/material';
import { Add, Edit, Delete, CloudUpload, TrendingUp } from '@mui/icons-material';
import AppShell from './AppShell';
import { toast, Toaster } from 'sonner';

interface ExchangeRate {
  id: string; currencyPair: string; buyRate: number; sellRate: number;
  spread: number; lastUpdated: string; status: 'Active' | 'Inactive';
}

const mockRates: ExchangeRate[] = [
  { id: '1', currencyPair: 'NGN/USD', buyRate: 1445.00, sellRate: 1455.00, spread: 0.69, lastUpdated: '2026-06-03 14:35', status: 'Active' },
  { id: '2', currencyPair: 'USD/EUR', buyRate: 0.9150, sellRate: 0.9250, spread: 1.09, lastUpdated: '2026-06-03 14:30', status: 'Active' },
  { id: '3', currencyPair: 'USD/GBP', buyRate: 0.7850, sellRate: 0.7950, spread: 1.27, lastUpdated: '2026-06-03 14:28', status: 'Active' },
  { id: '4', currencyPair: 'USD/JPY', buyRate: 148.50, sellRate: 150.50, spread: 1.35, lastUpdated: '2026-06-03 14:25', status: 'Active' },
  { id: '5', currencyPair: 'EUR/GBP', buyRate: 0.8550, sellRate: 0.8650, spread: 1.17, lastUpdated: '2026-06-03 14:20', status: 'Active' },
  { id: '6', currencyPair: 'NGN/GBP', buyRate: 1820.00, sellRate: 1840.00, spread: 1.10, lastUpdated: '2026-06-03 13:45', status: 'Inactive' },
];

interface RateManagementTableProps { onBack?: () => void; onLogout?: () => void; }

export default function RateManagementTable({ onBack, onLogout }: RateManagementTableProps) {
  const [rates] = useState<ExchangeRate[]>(mockRates);

  const handleAddNewRate = () => toast.info('Add new rate dialog will open');
  const handlePushRates = () => toast.success('Rates updated successfully', { description: 'All branches have been notified with the latest exchange rates.', duration: 4000 });
  const handleEditRate = (id: string) => toast.info(`Editing rate ${id}`);
  const handleDeleteRate = (id: string) => toast.error(`Rate ${id} deleted`);

  return (
    <AppShell title="Exchange Rate Management" subtitle="Set and push rates to all branches" icon={<TrendingUp sx={{ fontSize: 18 }} />} userLabel="System Admin" userRole="Administrator" onBack={onBack} onLogout={onLogout}>
      <Toaster position="top-right" richColors />
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Box sx={{ maxWidth: 'var(--container-2xl)', mx: 'auto' }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ mb: 1, color: 'var(--color-primary)', fontSize: { xs: 'var(--text-3xl)', md: 'var(--text-5xl)' } }}>
              Rate Management
            </Typography>
            <Typography variant="body2" color="text.secondary">Manage and push exchange rates to all branch locations</Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <Button variant="contained" startIcon={<Add />} onClick={handleAddNewRate}
              sx={{ bgcolor: 'var(--color-primary)', '&:hover': { bgcolor: 'var(--color-primary-hover)' }, px: 3 }}>
              Add New Rate
            </Button>
            <Button variant="contained" startIcon={<CloudUpload />} onClick={handlePushRates}
              sx={{ bgcolor: 'var(--color-accent)', '&:hover': { bgcolor: 'var(--color-accent-hover)' }, px: 3 }}>
              Push Rates to All Branches
            </Button>
          </Box>

          <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'var(--color-primary)' }}>
                    {['Currency Pair', 'Buy Rate', 'Sell Rate', 'Spread (%)', 'Last Updated', 'Status', 'Actions'].map((h, i) => (
                      <TableCell key={h} align={i >= 1 && i <= 3 ? 'right' : i === 6 ? 'center' : 'left'}
                        sx={{ color: 'var(--color-text-inverse)', fontWeight: 'var(--weight-semibold)' }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rates.map((rate, index) => (
                    <TableRow key={rate.id} hover
                      sx={{ bgcolor: index % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-subtle)', '&:hover': { bgcolor: 'var(--color-info-subtle) !important' } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: rate.status === 'Active' ? 'var(--color-accent)' : 'var(--color-text-4)' }} />
                          <Typography variant="body2" sx={{ fontWeight: 'var(--weight-semibold)', color: 'var(--color-primary)' }}>{rate.currencyPair}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right"><Typography variant="body2" sx={{ fontWeight: 'var(--weight-medium)' }}>{rate.buyRate.toFixed(rate.buyRate >= 100 ? 2 : 4)}</Typography></TableCell>
                      <TableCell align="right"><Typography variant="body2" sx={{ fontWeight: 'var(--weight-medium)' }}>{rate.sellRate.toFixed(rate.sellRate >= 100 ? 2 : 4)}</Typography></TableCell>
                      <TableCell align="right">
                        <Chip label={`${rate.spread.toFixed(2)}%`} size="small"
                          sx={{ bgcolor: rate.spread > 1 ? 'var(--color-warning-bg)' : 'var(--color-success-bg)', color: rate.spread > 1 ? '#92400e' : '#166534', fontWeight: 'var(--weight-semibold)' }} />
                      </TableCell>
                      <TableCell><Typography variant="body2" color="text.secondary">{rate.lastUpdated}</Typography></TableCell>
                      <TableCell>
                        <Chip label={rate.status} size="small"
                          sx={{ bgcolor: rate.status === 'Active' ? 'var(--color-success-bg)' : 'var(--color-surface-muted)', color: rate.status === 'Active' ? 'var(--color-accent)' : 'var(--color-text-3)', fontWeight: 'var(--weight-semibold)', minWidth: 80 }} />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                          <IconButton size="small" onClick={() => handleEditRate(rate.id)}
                            sx={{ color: 'var(--color-primary)', '&:hover': { bgcolor: 'var(--color-info-bg)' } }}>
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDeleteRate(rate.id)}
                            sx={{ color: 'var(--color-danger)', '&:hover': { bgcolor: 'var(--color-danger-bg)' } }}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Paper sx={{ flex: 1, p: 2.5, borderLeft: '4px solid var(--color-primary)' }}>
              <Typography variant="caption" color="text.secondary">Total Currency Pairs</Typography>
              <Typography variant="h4" sx={{ color: 'var(--color-primary)', mt: 0.5 }}>{rates.length}</Typography>
            </Paper>
            <Paper sx={{ flex: 1, p: 2.5, borderLeft: '4px solid var(--color-accent)' }}>
              <Typography variant="caption" color="text.secondary">Active Rates</Typography>
              <Typography variant="h4" sx={{ color: 'var(--color-accent)', mt: 0.5 }}>{rates.filter((r) => r.status === 'Active').length}</Typography>
            </Paper>
            <Paper sx={{ flex: 1, p: 2.5, borderLeft: '4px solid var(--color-warning)' }}>
              <Typography variant="caption" color="text.secondary">Average Spread</Typography>
              <Typography variant="h4" sx={{ color: 'var(--color-warning)', mt: 0.5 }}>{(rates.reduce((sum, r) => sum + r.spread, 0) / rates.length).toFixed(2)}%</Typography>
            </Paper>
          </Box>
        </Box>
      </Box>
    </AppShell>
  );
}
