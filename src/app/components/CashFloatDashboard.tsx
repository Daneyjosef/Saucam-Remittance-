import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  Button,
  TextField,
  Divider,
  IconButton,
  Chip,
  Alert,
} from '@mui/material';
import {
  AccountBalance,
  ArrowBack,
  Add,
  Remove,
  Warning,
  CheckCircle,
  Calculate,
} from '@mui/icons-material';
import { toast, Toaster } from 'sonner';

interface CurrencyFloat {
  code: string;
  name: string;
  flag: string;
  openingFloat: number;
  currentFloat: number;
  lowThreshold: number;
  physicalCount: string;
}

interface CashFloatDashboardProps {
  onBack?: () => void;
}

export default function CashFloatDashboard({ onBack }: CashFloatDashboardProps) {
  const [floats, setFloats] = useState<CurrencyFloat[]>([
    {
      code: 'NGN',
      name: 'Nigerian Naira',
      flag: '🇳🇬',
      openingFloat: 500000,
      currentFloat: 387500,
      lowThreshold: 100000,
      physicalCount: '',
    },
    {
      code: 'USD',
      name: 'US Dollar',
      flag: '🇺🇸',
      openingFloat: 10000,
      currentFloat: 7650,
      lowThreshold: 2000,
      physicalCount: '',
    },
    {
      code: 'GBP',
      name: 'British Pound',
      flag: '🇬🇧',
      openingFloat: 5000,
      currentFloat: 1850,
      lowThreshold: 1000,
      physicalCount: '',
    },
    {
      code: 'EUR',
      name: 'Euro',
      flag: '🇪🇺',
      openingFloat: 8000,
      currentFloat: 5420,
      lowThreshold: 1500,
      physicalCount: '',
    },
  ]);

  const [cashInAmount, setCashInAmount] = useState<{ [key: string]: string }>({});
  const [cashOutAmount, setCashOutAmount] = useState<{ [key: string]: string }>({});

  const handleCashIn = (code: string) => {
    const amount = parseFloat(cashInAmount[code] || '0');
    if (amount > 0) {
      setFloats(
        floats.map((f) =>
          f.code === code ? { ...f, currentFloat: f.currentFloat + amount } : f
        )
      );
      setCashInAmount({ ...cashInAmount, [code]: '' });
      toast.success(`Added ${amount.toLocaleString()} ${code} to float`);
    }
  };

  const handleCashOut = (code: string) => {
    const amount = parseFloat(cashOutAmount[code] || '0');
    if (amount > 0) {
      setFloats(
        floats.map((f) =>
          f.code === code ? { ...f, currentFloat: f.currentFloat - amount } : f
        )
      );
      setCashOutAmount({ ...cashOutAmount, [code]: '' });
      toast.success(`Removed ${amount.toLocaleString()} ${code} from float`);
    }
  };

  const handlePhysicalCountChange = (code: string, value: string) => {
    setFloats(
      floats.map((f) => (f.code === code ? { ...f, physicalCount: value } : f))
    );
  };

  const calculateDifference = (currency: CurrencyFloat) => {
    const physical = parseFloat(currency.physicalCount) || 0;
    return physical - currency.currentFloat;
  };

  const isLowFloat = (currency: CurrencyFloat) => {
    return currency.currentFloat < currency.lowThreshold;
  };

  const handleReconcile = () => {
    const hasAllCounts = floats.every((f) => f.physicalCount && parseFloat(f.physicalCount) >= 0);
    if (!hasAllCounts) {
      toast.error('Please enter physical count for all currencies');
      return;
    }
    toast.success('End of day reconciliation completed', {
      description: 'Float report has been generated and submitted.',
    });
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
          <AccountBalance sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Cash Float Dashboard
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
      <Box sx={{ flex: 1, overflow: 'auto', p: { xs: 2, md: 4 } }}>
        <Box sx={{ maxWidth: 1600, mx: 'auto' }}>
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ mb: 1, color: '#1e3a8a', fontSize: { xs: '1.5rem', md: '2rem' } }}>
              Branch Cash Float Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Monitor and manage cash float levels across all currencies
            </Typography>
          </Box>

          {/* Currency Float Cards */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 3,
            }}
          >
            {floats.map((currency) => (
              <Card
                key={currency.code}
                sx={{
                  border: isLowFloat(currency) ? '2px solid #dc2626' : '1px solid #e5e7eb',
                  boxShadow: isLowFloat(currency) ? '0 4px 12px rgba(220, 38, 38, 0.15)' : 2,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                    {/* Currency Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography variant="h3">{currency.flag}</Typography>
                        <Box>
                          <Typography variant="h6" sx={{ color: '#1e3a8a' }}>
                            {currency.code}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {currency.name}
                          </Typography>
                        </Box>
                      </Box>
                      {isLowFloat(currency) && (
                        <Chip
                          icon={<Warning />}
                          label="LOW FLOAT"
                          color="error"
                          sx={{ fontWeight: 600 }}
                        />
                      )}
                    </Box>

                    {/* Float Information */}
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 2,
                        mb: 3,
                        p: 2,
                        bgcolor: isLowFloat(currency) ? '#fee2e2' : '#f0f9ff',
                        borderRadius: 1,
                      }}
                    >
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Opening Float
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#64748b' }}>
                          {currency.openingFloat.toLocaleString()}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Current Float
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ color: isLowFloat(currency) ? '#dc2626' : '#16a34a' }}
                        >
                          {currency.currentFloat.toLocaleString()}
                        </Typography>
                      </Box>
                      <Box sx={{ gridColumn: 'span 2' }}>
                        <Typography variant="caption" color="text.secondary">
                          Low Threshold
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#f59e0b' }}>
                          {currency.lowThreshold.toLocaleString()} {currency.code}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Low Float Alert */}
                    {isLowFloat(currency) && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        Current float is below threshold. Consider adding cash.
                      </Alert>
                    )}

                    {/* Cash In/Out Section */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1.5, color: '#1e3a8a' }}>
                        Cash Operations
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <TextField
                          size="small"
                          fullWidth
                          type="number"
                          label="Cash In Amount"
                          value={cashInAmount[currency.code] || ''}
                          onChange={(e) =>
                            setCashInAmount({ ...cashInAmount, [currency.code]: e.target.value })
                          }
                        />
                        <Button
                          variant="contained"
                          startIcon={<Add />}
                          onClick={() => handleCashIn(currency.code)}
                          sx={{
                            bgcolor: '#16a34a',
                            '&:hover': { bgcolor: '#15803d' },
                            minWidth: 120,
                          }}
                        >
                          Cash In
                        </Button>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                          size="small"
                          fullWidth
                          type="number"
                          label="Cash Out Amount"
                          value={cashOutAmount[currency.code] || ''}
                          onChange={(e) =>
                            setCashOutAmount({ ...cashOutAmount, [currency.code]: e.target.value })
                          }
                        />
                        <Button
                          variant="contained"
                          startIcon={<Remove />}
                          onClick={() => handleCashOut(currency.code)}
                          sx={{
                            bgcolor: '#dc2626',
                            '&:hover': { bgcolor: '#b91c1c' },
                            minWidth: 120,
                          }}
                        >
                          Cash Out
                        </Button>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* End of Day Reconciliation */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1.5, color: '#1e3a8a' }}>
                        End of Day Reconciliation
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <TextField
                          size="small"
                          fullWidth
                          type="number"
                          label="Physical Cash Count"
                          value={currency.physicalCount}
                          onChange={(e) =>
                            handlePhysicalCountChange(currency.code, e.target.value)
                          }
                          InputProps={{
                            startAdornment: (
                              <Typography variant="body2" sx={{ mr: 1, color: '#64748b' }}>
                                {currency.code}
                              </Typography>
                            ),
                          }}
                        />
                        <Box
                          sx={{
                            minWidth: 140,
                            p: 1.5,
                            bgcolor: '#f8fafc',
                            borderRadius: 1,
                            border: '1px solid #e2e8f0',
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            Difference
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{
                              color:
                                currency.physicalCount && calculateDifference(currency) !== 0
                                  ? calculateDifference(currency) > 0
                                    ? '#16a34a'
                                    : '#dc2626'
                                  : '#64748b',
                            }}
                          >
                            {currency.physicalCount
                              ? calculateDifference(currency) > 0
                                ? `+${calculateDifference(currency).toLocaleString()}`
                                : calculateDifference(currency).toLocaleString()
                              : '—'}
                          </Typography>
                        </Box>
                      </Box>
                      {currency.physicalCount && calculateDifference(currency) !== 0 && (
                        <Alert
                          severity={calculateDifference(currency) > 0 ? 'success' : 'error'}
                          sx={{ mt: 1.5 }}
                        >
                          {calculateDifference(currency) > 0 ? 'Surplus: ' : 'Shortage: '}
                          {Math.abs(calculateDifference(currency)).toLocaleString()} {currency.code}
                        </Alert>
                      )}
                      {currency.physicalCount && calculateDifference(currency) === 0 && (
                        <Alert severity="success" icon={<CheckCircle />} sx={{ mt: 1.5 }}>
                          Balanced - No discrepancy
                        </Alert>
                      )}
                    </Box>
                  </CardContent>
                </Card>
            ))}
          </Box>

          {/* Reconciliation Action Button */}
          <Paper sx={{ mt: 4, p: 3, bgcolor: '#1e3a8a', color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6" sx={{ mb: 0.5 }}>
                  Complete End of Day Reconciliation
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Ensure all physical counts are entered before submitting
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="large"
                startIcon={<Calculate />}
                onClick={handleReconcile}
                sx={{
                  bgcolor: '#16a34a',
                  '&:hover': { bgcolor: '#15803d' },
                  px: 4,
                  py: 1.5,
                }}
              >
                Submit Reconciliation
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
