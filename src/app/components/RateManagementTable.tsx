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
  Chip,
  Typography,
  IconButton,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  CloudUpload,
  TrendingUp,
  ArrowBack,
} from '@mui/icons-material';
import { toast, Toaster } from 'sonner';

interface ExchangeRate {
  id: string;
  currencyPair: string;
  buyRate: number;
  sellRate: number;
  spread: number;
  lastUpdated: string;
  status: 'Active' | 'Inactive';
}

const mockRates: ExchangeRate[] = [
  {
    id: '1',
    currencyPair: 'NGN/USD',
    buyRate: 1445.00,
    sellRate: 1455.00,
    spread: 0.69,
    lastUpdated: '2026-06-03 14:35',
    status: 'Active',
  },
  {
    id: '2',
    currencyPair: 'USD/EUR',
    buyRate: 0.9150,
    sellRate: 0.9250,
    spread: 1.09,
    lastUpdated: '2026-06-03 14:30',
    status: 'Active',
  },
  {
    id: '3',
    currencyPair: 'USD/GBP',
    buyRate: 0.7850,
    sellRate: 0.7950,
    spread: 1.27,
    lastUpdated: '2026-06-03 14:28',
    status: 'Active',
  },
  {
    id: '4',
    currencyPair: 'USD/JPY',
    buyRate: 148.50,
    sellRate: 150.50,
    spread: 1.35,
    lastUpdated: '2026-06-03 14:25',
    status: 'Active',
  },
  {
    id: '5',
    currencyPair: 'EUR/GBP',
    buyRate: 0.8550,
    sellRate: 0.8650,
    spread: 1.17,
    lastUpdated: '2026-06-03 14:20',
    status: 'Active',
  },
  {
    id: '6',
    currencyPair: 'NGN/GBP',
    buyRate: 1820.00,
    sellRate: 1840.00,
    spread: 1.10,
    lastUpdated: '2026-06-03 13:45',
    status: 'Inactive',
  },
];

interface RateManagementTableProps {
  onBack?: () => void;
}

export default function RateManagementTable({ onBack }: RateManagementTableProps) {
  const [rates] = useState<ExchangeRate[]>(mockRates);

  const handleAddNewRate = () => {
    toast.info('Add new rate dialog will open');
  };

  const handlePushRates = () => {
    toast.success('Rates updated successfully', {
      description: 'All branches have been notified with the latest exchange rates.',
      duration: 4000,
    });
  };

  const handleEditRate = (id: string) => {
    toast.info(`Editing rate ${id}`);
  };

  const handleDeleteRate = (id: string) => {
    toast.error(`Rate ${id} deleted`);
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
          <TrendingUp sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Exchange Rate Management
          </Typography>
          <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>Admin User</Typography>
              <Typography variant="body2">System Administrator</Typography>
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
        <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
          {/* Header Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ mb: 1, color: '#1e3a8a', fontSize: { xs: '1.5rem', md: '2rem' } }}>
              Rate Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage and push exchange rates to all branch locations
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddNewRate}
              sx={{
                bgcolor: '#1e3a8a',
                '&:hover': { bgcolor: '#1e40af' },
                px: 3,
              }}
            >
              Add New Rate
            </Button>
            <Button
              variant="contained"
              startIcon={<CloudUpload />}
              onClick={handlePushRates}
              sx={{
                bgcolor: '#16a34a',
                '&:hover': { bgcolor: '#15803d' },
                px: 3,
              }}
            >
              Push Rates to All Branches
            </Button>
          </Box>

          {/* Rates Table */}
          <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#1e3a8a' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                      Currency Pair
                    </TableCell>
                    <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>
                      Buy Rate
                    </TableCell>
                    <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>
                      Sell Rate
                    </TableCell>
                    <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>
                      Spread (%)
                    </TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                      Last Updated
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
                  {rates.map((rate, index) => (
                    <TableRow
                      key={rate.id}
                      hover
                      sx={{
                        bgcolor: index % 2 === 0 ? '#ffffff' : '#f9fafb',
                        '&:hover': { bgcolor: '#f0f9ff !important' },
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: rate.status === 'Active' ? '#16a34a' : '#94a3b8',
                            }}
                          />
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                            {rate.currencyPair}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {rate.buyRate.toFixed(rate.buyRate >= 100 ? 2 : 4)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {rate.sellRate.toFixed(rate.sellRate >= 100 ? 2 : 4)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={`${rate.spread.toFixed(2)}%`}
                          size="small"
                          sx={{
                            bgcolor: rate.spread > 1 ? '#fef3c7' : '#dcfce7',
                            color: rate.spread > 1 ? '#92400e' : '#166534',
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {rate.lastUpdated}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={rate.status}
                          size="small"
                          sx={{
                            bgcolor: rate.status === 'Active' ? '#dcfce7' : '#f1f5f9',
                            color: rate.status === 'Active' ? '#16a34a' : '#64748b',
                            fontWeight: 600,
                            minWidth: 80,
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                          <IconButton
                            size="small"
                            onClick={() => handleEditRate(rate.id)}
                            sx={{
                              color: '#1e3a8a',
                              '&:hover': { bgcolor: '#dbeafe' },
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteRate(rate.id)}
                            sx={{
                              color: '#dc2626',
                              '&:hover': { bgcolor: '#fee2e2' },
                            }}
                          >
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

          {/* Summary Stats */}
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Paper sx={{ flex: 1, p: 2.5, borderLeft: '4px solid #1e3a8a' }}>
              <Typography variant="caption" color="text.secondary">
                Total Currency Pairs
              </Typography>
              <Typography variant="h4" sx={{ color: '#1e3a8a', mt: 0.5 }}>
                {rates.length}
              </Typography>
            </Paper>
            <Paper sx={{ flex: 1, p: 2.5, borderLeft: '4px solid #16a34a' }}>
              <Typography variant="caption" color="text.secondary">
                Active Rates
              </Typography>
              <Typography variant="h4" sx={{ color: '#16a34a', mt: 0.5 }}>
                {rates.filter((r) => r.status === 'Active').length}
              </Typography>
            </Paper>
            <Paper sx={{ flex: 1, p: 2.5, borderLeft: '4px solid #f59e0b' }}>
              <Typography variant="caption" color="text.secondary">
                Average Spread
              </Typography>
              <Typography variant="h4" sx={{ color: '#f59e0b', mt: 0.5 }}>
                {(rates.reduce((sum, r) => sum + r.spread, 0) / rates.length).toFixed(2)}%
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
