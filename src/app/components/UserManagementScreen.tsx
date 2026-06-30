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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  ArrowBack,
  People,
  PersonAdd,
  Edit,
  Block,
  CheckCircle,
  Close,
} from '@mui/icons-material';
import { toast, Toaster } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  assignedBranch: string;
  lastActive: string;
  status: 'Active' | 'Disabled';
}

interface UserManagementScreenProps {
  onBack?: () => void;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Jessica Martinez',
    email: 'jessica.m@saucampro.com',
    role: 'Teller',
    assignedBranch: 'Downtown Main Office',
    lastActive: '2 minutes ago',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Emeka Okonkwo',
    email: 'emeka.o@saucampro.com',
    role: 'Teller',
    assignedBranch: 'Victoria Island Branch',
    lastActive: '15 minutes ago',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Mary Okafor',
    email: 'mary.o@saucampro.com',
    role: 'Compliance Officer',
    assignedBranch: 'All Branches',
    lastActive: '1 hour ago',
    status: 'Active',
  },
  {
    id: '4',
    name: 'Chioma Nwosu',
    email: 'chioma.n@saucampro.com',
    role: 'Branch Manager',
    assignedBranch: 'Lekki Branch',
    lastActive: '3 hours ago',
    status: 'Active',
  },
  {
    id: '5',
    name: 'Bolaji Adeyemi',
    email: 'bolaji.a@saucampro.com',
    role: 'Teller',
    assignedBranch: 'Ikeja Branch',
    lastActive: '2 days ago',
    status: 'Disabled',
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

const roles = ['Teller', 'Branch Manager', 'Compliance Officer', 'System Administrator'];

export default function UserManagementScreen({ onBack }: UserManagementScreenProps) {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('');
  const [newUserBranch, setNewUserBranch] = useState('');

  const handleInviteUser = () => {
    if (!newUserName || !newUserEmail || !newUserRole || !newUserBranch) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newUser: User = {
      id: `${users.length + 1}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      assignedBranch: newUserBranch,
      lastActive: 'Never',
      status: 'Active',
    };

    setUsers([...users, newUser]);
    toast.success('User invited successfully', {
      description: `Invitation email sent to ${newUserEmail}`,
    });

    setIsInviteModalOpen(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserRole('');
    setNewUserBranch('');
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === 'Active' ? ('Disabled' as const) : ('Active' as const) }
          : user
      )
    );
    const user = users.find((u) => u.id === userId);
    toast.info(
      user?.status === 'Active' ? 'User disabled' : 'User activated',
      {
        description: `${user?.name} has been ${user?.status === 'Active' ? 'disabled' : 'activated'}`,
      }
    );
  };

  const getStatusColor = (status: string) => {
    return status === 'Active'
      ? { bgcolor: '#dcfce7', color: '#16a34a' }
      : { bgcolor: '#fee2e2', color: '#dc2626' };
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'System Administrator':
        return { bgcolor: '#dbeafe', color: '#1e3a8a' };
      case 'Branch Manager':
        return { bgcolor: '#fef3c7', color: '#f59e0b' };
      case 'Compliance Officer':
        return { bgcolor: '#f3e8ff', color: '#7c3aed' };
      default:
        return { bgcolor: '#f3f4f6', color: '#64748b' };
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
          <People sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            User Management
          </Typography>
          <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>Admin</Typography>
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
        <Box sx={{ maxWidth: 1600, mx: 'auto' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ mb: 1, color: '#1e3a8a', fontSize: { xs: '1.5rem', md: '2rem' } }}>
                User Administration
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage user accounts, roles, and branch permissions
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={() => setIsInviteModalOpen(true)}
              sx={{
                bgcolor: '#16a34a',
                '&:hover': { bgcolor: '#15803d' },
                px: 3,
              }}
            >
              Invite User
            </Button>
          </Box>

          {/* Stats */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 2,
              mb: 3,
            }}
          >
            <Paper sx={{ p: 2.5, borderLeft: '4px solid #1e3a8a' }}>
              <Typography variant="caption" color="text.secondary">
                Total Users
              </Typography>
              <Typography variant="h4" sx={{ color: '#1e3a8a', mt: 0.5 }}>
                {users.length}
              </Typography>
            </Paper>
            <Paper sx={{ p: 2.5, borderLeft: '4px solid #16a34a' }}>
              <Typography variant="caption" color="text.secondary">
                Active Users
              </Typography>
              <Typography variant="h4" sx={{ color: '#16a34a', mt: 0.5 }}>
                {users.filter((u) => u.status === 'Active').length}
              </Typography>
            </Paper>
            <Paper sx={{ p: 2.5, borderLeft: '4px solid #f59e0b' }}>
              <Typography variant="caption" color="text.secondary">
                Branch Managers
              </Typography>
              <Typography variant="h4" sx={{ color: '#f59e0b', mt: 0.5 }}>
                {users.filter((u) => u.role === 'Branch Manager').length}
              </Typography>
            </Paper>
            <Paper sx={{ p: 2.5, borderLeft: '4px solid #64748b' }}>
              <Typography variant="caption" color="text.secondary">
                Tellers
              </Typography>
              <Typography variant="h4" sx={{ color: '#64748b', mt: 0.5 }}>
                {users.filter((u) => u.role === 'Teller').length}
              </Typography>
            </Paper>
          </Box>

          {/* Users Table */}
          <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 900 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#1e3a8a' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Email</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Role</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Assigned Branch</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Last Active</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                    <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user, index) => (
                    <TableRow
                      key={user.id}
                      hover
                      sx={{
                        bgcolor: index % 2 === 0 ? '#ffffff' : '#f9fafb',
                        '&:hover': { bgcolor: '#f0f9ff !important' },
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {user.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {user.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          size="small"
                          sx={{
                            ...getRoleColor(user.role),
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{user.assignedBranch}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {user.lastActive}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.status}
                          size="small"
                          sx={{
                            ...getStatusColor(user.status),
                            fontWeight: 600,
                            minWidth: 80,
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                          <IconButton
                            size="small"
                            sx={{
                              color: '#1e3a8a',
                              '&:hover': { bgcolor: '#dbeafe' },
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleToggleStatus(user.id)}
                            sx={{
                              color: user.status === 'Active' ? '#dc2626' : '#16a34a',
                              '&:hover': {
                                bgcolor: user.status === 'Active' ? '#fee2e2' : '#dcfce7',
                              },
                            }}
                          >
                            {user.status === 'Active' ? (
                              <Block fontSize="small" />
                            ) : (
                              <CheckCircle fontSize="small" />
                            )}
                          </IconButton>
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

      {/* Invite User Modal */}
      <Dialog
        open={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            bgcolor: '#1e3a8a',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonAdd />
            <Typography variant="h6">Invite New User</Typography>
          </Box>
          <IconButton onClick={() => setIsInviteModalOpen(false)} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              fullWidth
              label="Full Name"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              required
            />
            <FormControl fullWidth required>
              <InputLabel>Role</InputLabel>
              <Select
                value={newUserRole}
                label="Role"
                onChange={(e) => setNewUserRole(e.target.value)}
              >
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel>Assigned Branch</InputLabel>
              <Select
                value={newUserBranch}
                label="Assigned Branch"
                onChange={(e) => setNewUserBranch(e.target.value)}
              >
                {branches.map((branch) => (
                  <MenuItem key={branch} value={branch}>
                    {branch}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() => setIsInviteModalOpen(false)}
            variant="outlined"
            sx={{
              borderColor: '#cbd5e1',
              color: '#64748b',
              '&:hover': { borderColor: '#94a3b8', bgcolor: '#f8fafc' },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleInviteUser}
            variant="contained"
            startIcon={<PersonAdd />}
            sx={{
              bgcolor: '#16a34a',
              '&:hover': { bgcolor: '#15803d' },
              px: 3,
            }}
          >
            Send Invitation
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
