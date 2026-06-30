import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  AppBar,
  Toolbar,
  Button,
  Chip,
} from '@mui/material';
import {
  Store,
  TrendingUp,
  People,
  CheckCircle,
  Warning,
  Logout,
} from '@mui/icons-material';

interface Branch {
  id: string;
  name: string;
  location: string;
  status: 'Active' | 'Low Float' | 'Offline';
  todayTransactions: number;
  todayVolume: number;
  staff: number;
}

interface BranchSelectionScreenProps {
  userRole: string;
  userName: string;
  onSelectBranch: (branchId: string) => void;
  onLogout: () => void;
}

const branches: Branch[] = [
  {
    id: 'main',
    name: 'Downtown Main Office',
    location: 'Victoria Island, Lagos',
    status: 'Active',
    todayTransactions: 145,
    todayVolume: 2450000,
    staff: 12,
  },
  {
    id: 'vi',
    name: 'Victoria Island Branch',
    location: 'Adeola Odeku Street',
    status: 'Active',
    todayTransactions: 178,
    todayVolume: 3120000,
    staff: 10,
  },
  {
    id: 'lekki',
    name: 'Lekki Branch',
    location: 'Admiralty Way',
    status: 'Low Float',
    todayTransactions: 98,
    todayVolume: 1890000,
    staff: 8,
  },
  {
    id: 'ikeja',
    name: 'Ikeja Branch',
    location: 'Allen Avenue',
    status: 'Active',
    todayTransactions: 132,
    todayVolume: 2280000,
    staff: 9,
  },
  {
    id: 'yaba',
    name: 'Yaba Branch',
    location: 'Herbert Macaulay Way',
    status: 'Offline',
    todayTransactions: 0,
    todayVolume: 0,
    staff: 7,
  },
];

export default function BranchSelectionScreen({
  userRole,
  userName,
  onSelectBranch,
  onLogout,
}: BranchSelectionScreenProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return { bgcolor: '#dcfce7', color: '#16a34a' };
      case 'Low Float':
        return { bgcolor: '#fef3c7', color: '#f59e0b' };
      case 'Offline':
        return { bgcolor: '#fee2e2', color: '#dc2626' };
      default:
        return { bgcolor: '#f3f4f6', color: '#6b7280' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle sx={{ fontSize: 20 }} />;
      case 'Low Float':
      case 'Offline':
        return <Warning sx={{ fontSize: 20 }} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f5f7fa' }}>
      {/* Top Bar */}
      <AppBar position="static" sx={{ bgcolor: '#1e3a8a' }}>
        <Toolbar>
          <Store sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Select Branch
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>Logged in as</Typography>
              <Typography variant="body2">{userName} ({userRole})</Typography>
            </Box>
            <Button
              startIcon={<Logout />}
              onClick={onLogout}
              sx={{ color: 'white' }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 4 }}>
        <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
          <Typography variant="h4" sx={{ mb: 1, color: '#1e3a8a' }}>
            Select a Branch to Manage
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Choose a location to view its operations dashboard
          </Typography>

          {/* Branch Cards Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
              gap: 3,
            }}
          >
            {branches.map((branch) => (
              <Card
                key={branch.id}
                sx={{
                  border: '2px solid',
                  borderColor: branch.status === 'Offline' ? '#fee2e2' : '#e5e7eb',
                  '&:hover': {
                    borderColor: '#1e3a8a',
                    boxShadow: 4,
                  },
                }}
              >
                <CardActionArea onClick={() => onSelectBranch(branch.id)} disabled={branch.status === 'Offline'}>
                  <CardContent sx={{ p: 3 }}>
                    {/* Branch Header */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ color: '#1e3a8a', mb: 0.5 }}>
                          {branch.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {branch.location}
                        </Typography>
                      </Box>
                      <Chip
                        icon={getStatusIcon(branch.status)}
                        label={branch.status}
                        size="small"
                        sx={{
                          ...getStatusColor(branch.status),
                          fontWeight: 600,
                        }}
                      />
                    </Box>

                    {/* Branch Stats */}
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 2,
                        mt: 3,
                        pt: 2,
                        borderTop: '1px solid #e5e7eb',
                      }}
                    >
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Transactions
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#1e3a8a' }}>
                          {branch.todayTransactions}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Volume
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#16a34a' }}>
                          ₦{(branch.todayVolume / 1000000).toFixed(1)}M
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Staff
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#64748b' }}>
                          {branch.staff}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>

          {/* Summary Stats */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
              gap: 2,
              mt: 4,
            }}
          >
            <Paper sx={{ p: 2.5, borderLeft: '4px solid #1e3a8a' }}>
              <Typography variant="caption" color="text.secondary">
                Total Branches
              </Typography>
              <Typography variant="h4" sx={{ color: '#1e3a8a', mt: 0.5 }}>
                {branches.length}
              </Typography>
            </Paper>
            <Paper sx={{ p: 2.5, borderLeft: '4px solid #16a34a' }}>
              <Typography variant="caption" color="text.secondary">
                Active Branches
              </Typography>
              <Typography variant="h4" sx={{ color: '#16a34a', mt: 0.5 }}>
                {branches.filter((b) => b.status === 'Active').length}
              </Typography>
            </Paper>
            <Paper sx={{ p: 2.5, borderLeft: '4px solid #f59e0b' }}>
              <Typography variant="caption" color="text.secondary">
                Total Staff
              </Typography>
              <Typography variant="h4" sx={{ color: '#f59e0b', mt: 0.5 }}>
                {branches.reduce((sum, b) => sum + b.staff, 0)}
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
