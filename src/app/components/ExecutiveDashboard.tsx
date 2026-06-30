import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
} from '@mui/material';
import {
  ArrowBack,
  Dashboard,
  TrendingUp,
  AccountBalance,
  Assessment,
  Circle,
  Flag,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ExecutiveDashboardProps {
  onBack?: () => void;
  onGoToCompliance?: () => void;
}

const branchRevenueData = [
  { branch: 'Downtown Main', revenue: 2450000 },
  { branch: 'Victoria Island', revenue: 3120000 },
  { branch: 'Lekki', revenue: 1890000 },
  { branch: 'Ikeja', revenue: 2280000 },
  { branch: 'Yaba', revenue: 1650000 },
];

const transactionVolumeData = [
  { date: 'May 28', volume: 1250000, transactions: 145 },
  { date: 'May 29', volume: 1580000, transactions: 178 },
  { date: 'May 30', volume: 1420000, transactions: 162 },
  { date: 'May 31', volume: 1890000, transactions: 201 },
  { date: 'Jun 1', volume: 2120000, transactions: 235 },
  { date: 'Jun 2', volume: 1760000, transactions: 189 },
  { date: 'Jun 3', volume: 2340000, transactions: 267 },
];

const flaggedTransactions = [
  {
    id: 'FTX-001',
    customer: 'Ahmed Hassan',
    amount: '12,000 USD',
    reason: 'Above CBN threshold',
    risk: 'High',
  },
  {
    id: 'FTX-002',
    customer: 'Sarah Johnson',
    amount: '8,500,000 NGN',
    reason: 'Multiple transactions',
    risk: 'Medium',
  },
  {
    id: 'FTX-003',
    customer: 'John Adebayo',
    amount: '15,000 USD',
    reason: 'Above CBN threshold',
    risk: 'High',
  },
];

const branchStatuses = [
  { branch: 'Downtown Main Office', status: 'online', float: 'Normal', lastUpdate: '2 min ago' },
  { branch: 'Victoria Island Branch', status: 'online', float: 'Normal', lastUpdate: '1 min ago' },
  { branch: 'Lekki Branch', status: 'online', float: 'Low', lastUpdate: '5 min ago' },
  { branch: 'Ikeja Branch', status: 'online', float: 'Normal', lastUpdate: '3 min ago' },
  { branch: 'Yaba Branch', status: 'offline', float: 'Unknown', lastUpdate: '45 min ago' },
];

export default function ExecutiveDashboard({ onBack, onGoToCompliance }: ExecutiveDashboardProps) {
  const totalTransactionsToday = 267;
  const totalVolumeNGN = 2340000;
  const averageSpread = 1.24;

  const getStatusColor = (status: string) => {
    return status === 'online' ? '#16a34a' : '#dc2626';
  };

  const getFloatColor = (float: string) => {
    switch (float) {
      case 'Normal':
        return { bgcolor: '#dcfce7', color: '#16a34a' };
      case 'Low':
        return { bgcolor: '#fee2e2', color: '#dc2626' };
      default:
        return { bgcolor: '#f3f4f6', color: '#6b7280' };
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High':
        return { bgcolor: '#fee2e2', color: '#dc2626' };
      case 'Medium':
        return { bgcolor: '#fef3c7', color: '#f59e0b' };
      default:
        return { bgcolor: '#dbeafe', color: '#2563eb' };
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f5f7fa' }}>
      {/* Top Bar */}
      <AppBar position="static" sx={{ bgcolor: '#1e3a8a' }}>
        <Toolbar>
          {onBack && (
            <IconButton onClick={onBack} sx={{ color: 'white', mr: 2 }}>
              <ArrowBack />
            </IconButton>
          )}
          <Dashboard sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Executive Dashboard
          </Typography>
          <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>Company</Typography>
              <Typography variant="body2">Saucam Pro</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>Last Updated</Typography>
              <Typography variant="body2">Just now</Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: { xs: 2, md: 4 } }}>
        <Box sx={{ maxWidth: 1800, mx: 'auto' }}>
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ mb: 1, color: '#1e3a8a', fontSize: { xs: '1.5rem', md: '2rem' } }}>
              Real-Time Performance Overview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              June 3, 2026 • All Branches
            </Typography>
          </Box>

          {/* KPI Cards */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 3,
              mb: 4,
            }}
          >
            <Card sx={{ bgcolor: '#1e3a8a', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    Total Transactions Today
                  </Typography>
                  <Assessment sx={{ opacity: 0.7 }} />
                </Box>
                <Typography variant="h3" sx={{ mb: 0.5 }}>
                  {totalTransactionsToday}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  <TrendingUp sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                  +12.5% from yesterday
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ bgcolor: '#16a34a', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    Total Volume (NGN)
                  </Typography>
                  <AccountBalance sx={{ opacity: 0.7 }} />
                </Box>
                <Typography variant="h3" sx={{ mb: 0.5 }}>
                  ₦{(totalVolumeNGN / 1000000).toFixed(2)}M
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  <TrendingUp sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                  +8.3% from yesterday
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ bgcolor: '#f59e0b', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    Average Spread Earned
                  </Typography>
                  <TrendingUp sx={{ opacity: 0.7 }} />
                </Box>
                <Typography variant="h3" sx={{ mb: 0.5 }}>
                  {averageSpread}%
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Across all currency pairs
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Charts Row */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' },
              gap: 3,
              mb: 4,
            }}
          >
            {/* Branch Revenue Chart */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, color: '#1e3a8a' }}>
                Revenue by Branch (Today)
              </Typography>
              <ResponsiveContainer width="100%" height={{ xs: 250, md: 300 }}>
                <BarChart data={branchRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="branch"
                    tick={{ fill: '#64748b', fontSize: { xs: 10, md: 12 } }}
                    angle={-15}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={(value) => `₦${(value / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip
                    formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Revenue']}
                    contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }}
                  />
                  <Bar key="revenue-bar" dataKey="revenue" fill="#1e3a8a" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>

            {/* Transaction Volume Chart */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, color: '#1e3a8a' }}>
                Transaction Volume (Last 7 Days)
              </Typography>
              <ResponsiveContainer width="100%" height={{ xs: 250, md: 300 }}>
                <LineChart data={transactionVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: { xs: 10, md: 12 } }} />
                  <YAxis
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={(value) => `₦${(value / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      if (name === 'volume') return [`₦${value.toLocaleString()}`, 'Volume'];
                      return [value, 'Transactions'];
                    }}
                    contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }}
                  />
                  <Legend />
                  <Line
                    key="volume-line"
                    type="monotone"
                    dataKey="volume"
                    stroke="#1e3a8a"
                    strokeWidth={3}
                    dot={{ fill: '#1e3a8a', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                  <Line
                    key="transactions-line"
                    type="monotone"
                    dataKey="transactions"
                    stroke="#16a34a"
                    strokeWidth={2}
                    dot={{ fill: '#16a34a', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Box>

          {/* Bottom Section */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '1.5fr 1fr' },
              gap: 3,
            }}
          >
            {/* Flagged Transactions */}
            <Paper sx={{ p: { xs: 2, md: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Flag sx={{ color: '#dc2626' }} />
                  <Typography variant="h6" sx={{ color: '#1e3a8a', fontSize: { xs: '1rem', md: '1.25rem' } }}>
                    Flagged Transactions Pending Review
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  size="small"
                  onClick={onGoToCompliance}
                  sx={{
                    bgcolor: '#1e3a8a',
                    '&:hover': { bgcolor: '#1e40af' },
                  }}
                >
                  Go to Compliance
                </Button>
              </Box>
              <TableContainer sx={{ overflowX: 'auto' }}>
                <Table size="small" sx={{ minWidth: 500 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f9fafb' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Transaction ID</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Reason</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Risk</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {flaggedTransactions.map((txn) => (
                      <TableRow key={txn.id} hover>
                        <TableCell sx={{ color: '#1e3a8a', fontWeight: 600 }}>
                          {txn.id}
                        </TableCell>
                        <TableCell>{txn.customer}</TableCell>
                        <TableCell>{txn.amount}</TableCell>
                        <TableCell>{txn.reason}</TableCell>
                        <TableCell>
                          <Chip
                            label={txn.risk}
                            size="small"
                            sx={{
                              ...getRiskColor(txn.risk),
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Branch Status */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#1e3a8a' }}>
                Branch Status Monitor
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {branchStatuses.map((branch) => (
                  <Box
                    key={branch.branch}
                    sx={{
                      p: 2,
                      bgcolor: '#f9fafb',
                      borderRadius: 1,
                      border: '1px solid #e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Circle
                        sx={{
                          fontSize: 16,
                          color: getStatusColor(branch.status),
                        }}
                      />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {branch.branch}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Updated {branch.lastUpdate}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Chip
                        label={branch.status === 'online' ? 'Online' : 'Offline'}
                        size="small"
                        sx={{
                          bgcolor: branch.status === 'online' ? '#dcfce7' : '#fee2e2',
                          color: branch.status === 'online' ? '#16a34a' : '#dc2626',
                          fontWeight: 600,
                        }}
                      />
                      <Chip
                        label={`Float: ${branch.float}`}
                        size="small"
                        sx={{
                          ...getFloatColor(branch.float),
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
