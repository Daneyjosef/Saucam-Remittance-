import { useState, useEffect } from 'react';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Chip, Typography, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Select, FormControl, InputLabel, CircularProgress,
} from '@mui/material';
import { Add, Edit, Delete, CloudUpload, TrendingUp, Refresh } from '@mui/icons-material';
import AppShell from './AppShell';
import { toast, Toaster } from 'sonner';
import { type ExchangeRate, getRates, persistRates, fetchLiveRates } from '../rateStore';

interface RateManagementTableProps { onBack?: () => void; onLogout?: () => void; userName?: string; userRoleLabel?: string; }

const CURRENCIES = ['USD', 'GBP', 'EUR', 'NGN', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY'];

const emptyForm = { currencyPair: '', baseCurrency: 'USD', quoteCurrency: 'NGN', buyRate: '', sellRate: '', status: 'Active' as const };

export default function RateManagementTable({ onBack, onLogout, userName, userRoleLabel }: RateManagementTableProps) {
  const [rates, setRates] = useState<ExchangeRate[]>(() => getRates());
  const [modalOpen, setModalOpen] = useState(false);
  const [editRate, setEditRate] = useState<ExchangeRate | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [fetching, setFetching] = useState(false);
  const [liveRates, setLiveRates] = useState<Record<string, number> | null>(null);

  useEffect(() => { persistRates(rates); }, [rates]);

  const save = (updated: ExchangeRate[]) => { setRates(updated); persistRates(updated); };

  const openAdd = () => {
    setEditRate(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (r: ExchangeRate) => {
    setEditRate(r);
    setForm({ currencyPair: r.currencyPair, baseCurrency: r.baseCurrency, quoteCurrency: r.quoteCurrency, buyRate: String(r.buyRate), sellRate: String(r.sellRate), status: r.status });
    setModalOpen(true);
  };

  const handleSave = () => {
    const buy = parseFloat(form.buyRate);
    const sell = parseFloat(form.sellRate);
    if (!form.baseCurrency || !form.quoteCurrency || isNaN(buy) || isNaN(sell)) {
      toast.error('All fields are required and rates must be numbers'); return;
    }
    if (buy <= 0 || sell <= 0) { toast.error('Rates must be greater than 0'); return; }
    if (sell < buy) { toast.error('Sell rate should be >= buy rate'); return; }
    const spread = ((sell - buy) / buy) * 100;
    const pair = `${form.baseCurrency}/${form.quoteCurrency}`;
    const now = new Date().toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' });
    const mid = liveRates ? (liveRates[form.quoteCurrency] / (liveRates[form.baseCurrency] || 1)) : ((buy + sell) / 2);
    if (editRate) {
      save(rates.map(r => r.id === editRate.id ? { ...r, currencyPair: pair, baseCurrency: form.baseCurrency, quoteCurrency: form.quoteCurrency, buyRate: buy, sellRate: sell, spread: parseFloat(spread.toFixed(2)), midMarketRate: mid, lastUpdated: now, status: form.status } : r));
      toast.success(`${pair} updated`);
    } else {
      const newRate: ExchangeRate = { id: `${Date.now()}`, currencyPair: pair, baseCurrency: form.baseCurrency, quoteCurrency: form.quoteCurrency, buyRate: buy, sellRate: sell, midMarketRate: mid, spread: parseFloat(spread.toFixed(2)), lastUpdated: now, status: form.status };
      save([...rates, newRate]);
      toast.success(`${pair} added`);
    }
    setModalOpen(false);
  };

  const handleDelete = (r: ExchangeRate) => {
    save(rates.filter(x => x.id !== r.id));
    toast.success(`${r.currencyPair} removed`);
  };

  const handleFetchLive = async () => {
    setFetching(true);
    const live = await fetchLiveRates();
    setFetching(false);
    if (!live) { toast.error('Could not fetch live rates — check your internet connection'); return; }
    setLiveRates(live);
    const now = new Date().toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' });
    // Update mid-market rates for all existing pairs
    const updated = rates.map(r => {
      const mid = live[r.quoteCurrency] / (live[r.baseCurrency] || 1);
      if (!mid) return r;
      return { ...r, midMarketRate: parseFloat(mid.toFixed(r.buyRate >= 100 ? 2 : 4)), lastUpdated: now };
    });
    save(updated);
    toast.success('Live mid-market rates refreshed', { description: 'Your buy/sell rates are unchanged. Adjust spreads as needed.' });
  };

  const handlePush = () => {
    toast.success('Rates pushed to all branches', { description: `${rates.filter(r => r.status === 'Active').length} active rates are now live for tellers.`, duration: 4000 });
  };

  return (
    <AppShell title="Exchange Rate Management" subtitle="Set and push rates to all branches" icon={<TrendingUp sx={{ fontSize: 18 }} />} userLabel={userName || 'Staff'} userRole={userRoleLabel || 'Staff'} onBack={onBack} onLogout={onLogout}>
      <Toaster position="top-right" richColors />
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Box sx={{ maxWidth: 'var(--container-2xl)', mx: 'auto' }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ mb: 1, color: 'var(--color-primary)', fontSize: { xs: 'var(--text-3xl)', md: 'var(--text-5xl)' } }}>Rate Management</Typography>
            <Typography variant="body2" color="text.secondary">Manage and push exchange rates to all branch locations</Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <Button variant="outlined" startIcon={fetching ? <CircularProgress size={16} /> : <Refresh />} onClick={handleFetchLive} disabled={fetching}
              sx={{ borderColor: 'var(--color-border)', color: 'var(--color-primary)', flex: { xs: '1 1 auto', sm: 'none' } }}>
              {fetching ? 'Fetching...' : 'Fetch Live Rates'}
            </Button>
            <Button variant="contained" startIcon={<Add />} onClick={openAdd}
              sx={{ bgcolor: 'var(--color-primary)', '&:hover': { bgcolor: 'var(--color-primary-hover)' }, px: 3, flex: { xs: '1 1 auto', sm: 'none' } }}>
              Add Rate
            </Button>
            <Button variant="contained" startIcon={<CloudUpload />} onClick={handlePush}
              sx={{ bgcolor: 'var(--color-accent)', '&:hover': { bgcolor: 'var(--color-accent-hover)' }, px: 3, flex: { xs: '1 1 auto', sm: 'none' } }}>
              Push to All Branches
            </Button>
          </Box>

          <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 900 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'var(--color-primary)' }}>
                    {['Currency Pair', 'Mid-Market', 'Buy Rate', 'Sell Rate', 'Spread (%)', 'Last Updated', 'Status', 'Actions'].map((h, i) => (
                      <TableCell key={h} align={i >= 1 && i <= 4 ? 'right' : i === 7 ? 'center' : 'left'}
                        sx={{ color: 'var(--color-text-inverse)', fontWeight: 'var(--weight-semibold)', whiteSpace: 'nowrap' }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rates.map((rate, index) => {
                    const decimals = rate.buyRate >= 100 ? 2 : 4;
                    return (
                      <TableRow key={rate.id} hover sx={{ bgcolor: index % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-subtle)', '&:hover': { bgcolor: 'var(--color-info-subtle) !important' } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: rate.status === 'Active' ? 'var(--color-accent)' : 'var(--color-text-4)' }} />
                            <Typography variant="body2" sx={{ fontWeight: 'var(--weight-semibold)', color: 'var(--color-primary)' }}>{rate.currencyPair}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right"><Typography variant="body2" color="text.secondary">{rate.midMarketRate.toFixed(decimals)}</Typography></TableCell>
                        <TableCell align="right"><Typography variant="body2" sx={{ fontWeight: 'var(--weight-medium)' }}>{rate.buyRate.toFixed(decimals)}</Typography></TableCell>
                        <TableCell align="right"><Typography variant="body2" sx={{ fontWeight: 'var(--weight-medium)' }}>{rate.sellRate.toFixed(decimals)}</Typography></TableCell>
                        <TableCell align="right">
                          <Chip label={`${rate.spread.toFixed(2)}%`} size="small"
                            sx={{ bgcolor: rate.spread > 1 ? 'var(--color-warning-bg)' : 'var(--color-success-bg)', color: rate.spread > 1 ? '#92400e' : '#166534', fontWeight: 'var(--weight-semibold)' }} />
                        </TableCell>
                        <TableCell><Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>{rate.lastUpdated}</Typography></TableCell>
                        <TableCell>
                          <Chip label={rate.status} size="small"
                            sx={{ bgcolor: rate.status === 'Active' ? 'var(--color-success-bg)' : 'var(--color-surface-muted)', color: rate.status === 'Active' ? 'var(--color-accent)' : 'var(--color-text-3)', fontWeight: 'var(--weight-semibold)', minWidth: 80 }} />
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                            <IconButton size="small" onClick={() => openEdit(rate)} sx={{ color: 'var(--color-primary)' }}><Edit fontSize="small" /></IconButton>
                            <IconButton size="small" onClick={() => handleDelete(rate)} sx={{ color: 'var(--color-danger)' }}><Delete fontSize="small" /></IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
            <Paper sx={{ flex: '1 1 140px', p: 2.5, borderLeft: '4px solid var(--color-primary)' }}>
              <Typography variant="caption" color="text.secondary">Total Pairs</Typography>
              <Typography variant="h4" sx={{ color: 'var(--color-primary)', mt: 0.5 }}>{rates.length}</Typography>
            </Paper>
            <Paper sx={{ flex: '1 1 140px', p: 2.5, borderLeft: '4px solid var(--color-accent)' }}>
              <Typography variant="caption" color="text.secondary">Active Rates</Typography>
              <Typography variant="h4" sx={{ color: 'var(--color-accent)', mt: 0.5 }}>{rates.filter(r => r.status === 'Active').length}</Typography>
            </Paper>
            <Paper sx={{ flex: '1 1 140px', p: 2.5, borderLeft: '4px solid var(--color-warning)' }}>
              <Typography variant="caption" color="text.secondary">Avg Spread</Typography>
              <Typography variant="h4" sx={{ color: 'var(--color-warning)', mt: 0.5 }}>{rates.length ? (rates.reduce((s, r) => s + r.spread, 0) / rates.length).toFixed(2) : '0.00'}%</Typography>
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Add / Edit Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ color: 'var(--color-primary)', fontWeight: 'var(--weight-semibold)' }}>
          {editRate ? 'Edit Exchange Rate' : 'Add Exchange Rate'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Base Currency</InputLabel>
              <Select value={form.baseCurrency} label="Base Currency" onChange={e => setForm(f => ({ ...f, baseCurrency: e.target.value }))}>
                {CURRENCIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Quote Currency</InputLabel>
              <Select value={form.quoteCurrency} label="Quote Currency" onChange={e => setForm(f => ({ ...f, quoteCurrency: e.target.value }))}>
                {CURRENCIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
          {liveRates && form.baseCurrency && form.quoteCurrency && (
            <Typography variant="caption" color="text.secondary">
              Live mid-market: {(liveRates[form.quoteCurrency] / (liveRates[form.baseCurrency] || 1)).toFixed(4)}
            </Typography>
          )}
          <TextField label="Buy Rate" size="small" type="number" value={form.buyRate} onChange={e => setForm(f => ({ ...f, buyRate: e.target.value }))} helperText="Rate you buy base currency from customer" />
          <TextField label="Sell Rate" size="small" type="number" value={form.sellRate} onChange={e => setForm(f => ({ ...f, sellRate: e.target.value }))} helperText="Rate you sell base currency to customer" />
          <FormControl size="small">
            <InputLabel>Status</InputLabel>
            <Select value={form.status} label="Status" onChange={e => setForm(f => ({ ...f, status: e.target.value as 'Active' | 'Inactive' }))}>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} sx={{ bgcolor: 'var(--color-primary)' }}>
            {editRate ? 'Update' : 'Add Rate'}
          </Button>
        </DialogActions>
      </Dialog>
    </AppShell>
  );
}
