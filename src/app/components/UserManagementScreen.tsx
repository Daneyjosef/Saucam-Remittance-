import { useState } from 'react';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Typography, AppBar, Toolbar, IconButton, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, FormControl, InputLabel, Select,
  MenuItem, InputAdornment, Avatar,
} from '@mui/material';
import {
  People, PersonAdd, Edit, Block, CheckCircle, Close, Shield,
  Lock, Person, AccountTree, Visibility, VisibilityOff, VpnKey,
} from '@mui/icons-material';
import { toast, Toaster } from 'sonner';

interface User {
  id: string; name: string; username: string; role: string;
  assignedBranch: string; lastActive: string; status: 'Active' | 'Disabled';
}

interface UserManagementScreenProps { onLogout?: () => void; }

const mockUsers: User[] = [
  { id: '1', name: 'Jessica Martinez', username: 'jessica.m', role: 'Teller', assignedBranch: 'Downtown Main Office', lastActive: '2 minutes ago', status: 'Active' },
  { id: '2', name: 'Emeka Okonkwo', username: 'emeka.o', role: 'Teller', assignedBranch: 'Victoria Island Branch', lastActive: '15 minutes ago', status: 'Active' },
  { id: '3', name: 'Mary Okafor', username: 'mary.o', role: 'Compliance Officer', assignedBranch: 'All Branches', lastActive: '1 hour ago', status: 'Active' },
  { id: '4', name: 'Chioma Nwosu', username: 'chioma.n', role: 'Branch Manager', assignedBranch: 'Lekki Branch', lastActive: '3 hours ago', status: 'Active' },
  { id: '5', name: 'Bolaji Adeyemi', username: 'bolaji.a', role: 'Teller', assignedBranch: 'Ikeja Branch', lastActive: '2 days ago', status: 'Disabled' },
];

const branches = ['All Branches', 'Downtown Main Office', 'Victoria Island Branch', 'Lekki Branch', 'Ikeja Branch', 'Yaba Branch'];
const roles = ['Teller', 'Branch Manager', 'Compliance Officer'];

const roleColors: Record<string, { bgcolor: string; color: string }> = {
  'Branch Manager': { bgcolor: 'var(--color-warning-bg)', color: 'var(--color-warning-dark)' },
  'Compliance Officer': { bgcolor: 'var(--color-purple-bg)', color: 'var(--color-purple)' },
  'Teller': { bgcolor: 'var(--color-accent-subtle)', color: 'var(--color-accent)' },
};

const avatarColors = ['var(--color-primary)', 'var(--color-info)', 'var(--color-accent)', 'var(--color-purple)', 'var(--color-warning-dark)', 'var(--color-danger)'];

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function UserManagementScreen({ onLogout }: UserManagementScreenProps) {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', username: '', password: '', role: '', branch: '' });

  const resetForm = () => { setForm({ name: '', username: '', password: '', role: '', branch: '' }); setShowPassword(false); setEditUser(null); };
  const openCreate = () => { resetForm(); setModalOpen(true); };
  const openEdit = (user: User) => { setEditUser(user); setForm({ name: user.name, username: user.username, password: '', role: user.role, branch: user.assignedBranch }); setModalOpen(true); };

  const handleSave = () => {
    if (!form.name || !form.username || !form.role || !form.branch) { toast.error('Please fill in all required fields'); return; }
    if (!editUser && !form.password) { toast.error('Password is required for new users'); return; }
    if (editUser) {
      setUsers(users.map((u) => u.id === editUser.id ? { ...u, name: form.name, username: form.username, role: form.role, assignedBranch: form.branch } : u));
      toast.success('User updated successfully');
    } else {
      setUsers([...users, { id: `${Date.now()}`, name: form.name, username: form.username, role: form.role, assignedBranch: form.branch, lastActive: 'Never', status: 'Active' }]);
      toast.success('User created successfully', { description: `${form.name} can now log in with their credentials` });
    }
    setModalOpen(false); resetForm();
  };

  const handleToggleStatus = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    setUsers(users.map((u) => u.id === userId ? { ...u, status: u.status === 'Active' ? 'Disabled' : 'Active' } : u));
    toast.info(user?.status === 'Active' ? `${user?.name} has been disabled` : `${user?.name} has been activated`);
  };

  const activeCount = users.filter((u) => u.status === 'Active').length;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'var(--color-bg-subtle)', display: 'flex', flexDirection: 'column' }}>
      <Toaster position="top-right" richColors />

      <AppBar position="static" elevation={0}
        sx={{ background: 'linear-gradient(135deg, var(--color-admin), var(--color-admin-deep))', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
          <Shield sx={{ mr: 1.5, fontSize: 22 }} />
          <Typography variant="h6" sx={{ fontWeight: 'var(--weight-bold)', flexGrow: 1, letterSpacing: 0.3 }}>Admin Portal</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="caption" sx={{ opacity: 0.7, display: 'block' }}>Signed in as</Typography>
              <Typography variant="body2" sx={{ fontWeight: 'var(--weight-semibold)' }}>System Administrator</Typography>
            </Box>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.15)', width: 36, height: 36, fontSize: 14 }}>SA</Avatar>
            {onLogout && (
              <Button onClick={onLogout} size="small"
                sx={{ color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 2, px: 2, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                Logout
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, p: { xs: 2, md: 4 }, maxWidth: 'var(--container-2xl)', mx: 'auto', width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'var(--weight-extrabold)', color: 'var(--color-admin)', mb: 0.5 }}>User Management</Typography>
            <Typography variant="body2" color="text.secondary">Create and manage staff accounts, roles, and branch assignments</Typography>
          </Box>
          <Button variant="contained" startIcon={<PersonAdd />} onClick={openCreate}
            sx={{ background: 'linear-gradient(135deg, var(--color-admin), var(--color-admin-deep))', borderRadius: 2.5, px: 3, py: 1.2, fontWeight: 'var(--weight-bold)', boxShadow: 'var(--shadow-glow-admin)', '&:hover': { background: 'linear-gradient(135deg, var(--color-admin-hover), var(--color-purple-dark))', boxShadow: 'var(--shadow-glow-admin)' } }}>
            Create User
          </Button>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2.5, mb: 4 }}>
          {[
            { label: 'Total Staff', value: users.length, color: 'var(--color-admin)', bg: 'var(--color-primary-subtle)' },
            { label: 'Active', value: activeCount, color: 'var(--color-accent)', bg: 'var(--color-accent-subtle)' },
            { label: 'Branch Managers', value: users.filter((u) => u.role === 'Branch Manager').length, color: 'var(--color-warning-dark)', bg: 'var(--color-warning-subtle)' },
            { label: 'Tellers', value: users.filter((u) => u.role === 'Teller').length, color: 'var(--color-info)', bg: 'var(--color-info-subtle)' },
          ].map((s) => (
            <Paper key={s.label} elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: s.bg, border: `1px solid ${s.color}22`, transition: 'transform var(--duration-base)', '&:hover': { transform: 'translateY(-2px)' } }}>
              <Typography variant="caption" sx={{ color: s.color, fontWeight: 'var(--weight-semibold)', textTransform: 'uppercase', letterSpacing: 0.8 }}>{s.label}</Typography>
              <Typography variant="h3" sx={{ color: s.color, fontWeight: 'var(--weight-extrabold)', mt: 0.5, lineHeight: 'var(--leading-tight)' }}>{s.value}</Typography>
            </Paper>
          ))}
        </Box>

        <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <Box sx={{ p: 2.5, borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 1 }}>
            <People sx={{ color: 'var(--color-text-3)', fontSize: 20 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 'var(--weight-bold)', color: 'var(--color-text-1)' }}>Staff Accounts</Typography>
            <Chip label={`${users.length} users`} size="small" sx={{ ml: 1, bgcolor: 'var(--color-surface-muted)', color: 'var(--color-text-3)', fontWeight: 'var(--weight-semibold)' }} />
          </Box>
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: 'var(--color-bg-subtle)' }}>
                  {['Staff Member', 'Username', 'Role', 'Branch', 'Last Active', 'Status', 'Actions'].map((h, i) => (
                    <TableCell key={h} align={i === 6 ? 'center' : 'left'}
                      sx={{ fontWeight: 'var(--weight-bold)', color: 'var(--color-text-2)', fontSize: 'var(--text-sm)', textTransform: 'uppercase', letterSpacing: 0.8, borderBottom: '2px solid var(--color-border)', py: 1.5 }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow key={user.id} hover sx={{ '&:hover': { bgcolor: 'var(--color-bg-subtle)' }, bgcolor: index % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-subtle)' }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 36, height: 36, fontSize: 13, fontWeight: 'var(--weight-bold)', bgcolor: avatarColors[index % avatarColors.length] }}>{getInitials(user.name)}</Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 'var(--weight-semibold)', color: 'var(--color-text-1)' }}>{user.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <Person sx={{ fontSize: 14, color: 'var(--color-text-4)' }} />
                        <Typography variant="body2" sx={{ color: 'var(--color-text-2)', fontFamily: 'monospace' }}>{user.username}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell><Chip label={user.role} size="small" sx={{ ...(roleColors[user.role] || { bgcolor: 'var(--color-surface-muted)', color: 'var(--color-text-3)' }), fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-xs)' }} /></TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <AccountTree sx={{ fontSize: 14, color: 'var(--color-text-4)' }} />
                        <Typography variant="body2" color="text.secondary">{user.assignedBranch}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell><Typography variant="body2" color="text.secondary">{user.lastActive}</Typography></TableCell>
                    <TableCell>
                      <Chip label={user.status} size="small" sx={{ fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-xs)', minWidth: 72, ...(user.status === 'Active' ? { bgcolor: 'var(--color-success-bg)', color: 'var(--color-accent)' } : { bgcolor: 'var(--color-danger-bg)', color: 'var(--color-danger)' }) }} />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        <IconButton size="small" onClick={() => openEdit(user)} sx={{ color: 'var(--color-purple)', '&:hover': { bgcolor: 'var(--color-primary-subtle)' }, borderRadius: 1.5 }}><Edit fontSize="small" /></IconButton>
                        <IconButton size="small" onClick={() => handleToggleStatus(user.id)}
                          sx={{ color: user.status === 'Active' ? 'var(--color-danger)' : 'var(--color-accent)', '&:hover': { bgcolor: user.status === 'Active' ? 'var(--color-danger-bg)' : 'var(--color-success-bg)' }, borderRadius: 1.5 }}>
                          {user.status === 'Active' ? <Block fontSize="small" /> : <CheckCircle fontSize="small" />}
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

      <Dialog open={modalOpen} onClose={() => { setModalOpen(false); resetForm(); }} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ background: 'linear-gradient(135deg, var(--color-admin), var(--color-admin-deep))', color: 'var(--color-text-inverse)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2.5, px: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {editUser ? <VpnKey /> : <PersonAdd />}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'var(--weight-bold)', lineHeight: 'var(--leading-tight)' }}>{editUser ? 'Edit User' : 'Create New User'}</Typography>
              <Typography variant="caption" sx={{ opacity: 0.75 }}>{editUser ? `Editing ${editUser.name}` : 'Set up staff login credentials'}</Typography>
            </Box>
          </Box>
          <IconButton onClick={() => { setModalOpen(false); resetForm(); }} sx={{ color: 'var(--color-text-inverse)' }}><Close /></IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3, pt: '24px !important' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField fullWidth label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
              InputProps={{ startAdornment: <InputAdornment position="start"><Person sx={{ color: 'var(--color-purple)', fontSize: 20 }} /></InputAdornment> }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, '&.Mui-focused fieldset': { borderColor: 'var(--color-purple)' } }, '& label.Mui-focused': { color: 'var(--color-purple)' } }} />

            <TextField fullWidth label="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/\s/g, '.') })} required helperText="e.g. john.doe — used to sign in"
              InputProps={{ startAdornment: <InputAdornment position="start"><Person sx={{ color: 'var(--color-purple)', fontSize: 20 }} /></InputAdornment> }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, '&.Mui-focused fieldset': { borderColor: 'var(--color-purple)' } }, '& label.Mui-focused': { color: 'var(--color-purple)' } }} />

            <TextField fullWidth label={editUser ? 'New Password (leave blank to keep current)' : 'Password'} type={showPassword ? 'text' : 'password'}
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editUser}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock sx={{ color: 'var(--color-purple)', fontSize: 20 }} /></InputAdornment>,
                endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">{showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}</IconButton></InputAdornment>,
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, '&.Mui-focused fieldset': { borderColor: 'var(--color-purple)' } }, '& label.Mui-focused': { color: 'var(--color-purple)' } }} />

            <FormControl fullWidth required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
              <InputLabel sx={{ '&.Mui-focused': { color: 'var(--color-purple)' } }}>Role</InputLabel>
              <Select value={form.role} label="Role" onChange={(e) => setForm({ ...form, role: e.target.value })}
                startAdornment={<InputAdornment position="start"><Shield sx={{ color: 'var(--color-purple)', fontSize: 20, ml: 0.5 }} /></InputAdornment>}
                sx={{ '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-purple)' } }}>
                {roles.map((r) => <MenuItem key={r} value={r}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Chip label={r} size="small" sx={{ ...(roleColors[r] || {}), fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-xs)' }} /></Box></MenuItem>)}
              </Select>
            </FormControl>

            <FormControl fullWidth required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
              <InputLabel sx={{ '&.Mui-focused': { color: 'var(--color-purple)' } }}>Assigned Branch</InputLabel>
              <Select value={form.branch} label="Assigned Branch" onChange={(e) => setForm({ ...form, branch: e.target.value })}
                startAdornment={<InputAdornment position="start"><AccountTree sx={{ color: 'var(--color-purple)', fontSize: 20, ml: 0.5 }} /></InputAdornment>}
                sx={{ '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-purple)' } }}>
                {branches.map((b) => <MenuItem key={b} value={b}>{b}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
          <Button onClick={() => { setModalOpen(false); resetForm(); }} variant="outlined"
            sx={{ borderRadius: 2, borderColor: 'var(--color-border)', color: 'var(--color-text-3)', fontWeight: 'var(--weight-semibold)', px: 3, '&:hover': { borderColor: 'var(--color-border-strong)' } }}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" startIcon={editUser ? <Edit /> : <PersonAdd />}
            sx={{ borderRadius: 2, background: 'linear-gradient(135deg, var(--color-admin), var(--color-admin-deep))', fontWeight: 'var(--weight-bold)', px: 3, boxShadow: 'var(--shadow-glow-admin)', '&:hover': { background: 'linear-gradient(135deg, var(--color-admin-hover), var(--color-purple-dark))' } }}>
            {editUser ? 'Save Changes' : 'Create User'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
