import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  AccountBalance,
} from '@mui/icons-material';

interface LoginScreenProps {
  onLogin: (email: string, password: string, role: string) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Teller');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password, role);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#1e3a8a',
        backgroundImage: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: '100%',
          maxWidth: 480,
          p: 5,
          borderRadius: 3,
          mx: 2,
        }}
      >
        {/* Logo and Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: '#1e3a8a',
              mb: 2,
            }}
          >
            <AccountBalance sx={{ fontSize: 48, color: 'white' }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e3a8a', mb: 1 }}>
            Saucam Pro
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Branch Operations Management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Sign in to access your workspace
          </Typography>
        </Box>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: '#1e3a8a' }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#1e3a8a' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <FormControl fullWidth required>
              <InputLabel>Role</InputLabel>
              <Select
                value={role}
                label="Role"
                onChange={(e) => setRole(e.target.value)}
              >
                <MenuItem key="teller" value="Teller">Teller</MenuItem>
                <MenuItem key="manager" value="Manager">Branch Manager</MenuItem>
                <MenuItem key="compliance" value="Compliance">Compliance Officer</MenuItem>
                <MenuItem key="admin" value="Admin">System Administrator</MenuItem>
              </Select>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 2,
                py: 1.5,
                bgcolor: '#1e3a8a',
                '&:hover': { bgcolor: '#1e40af' },
              }}
            >
              Sign In
            </Button>
          </Box>
        </form>

        <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            © 2026 Saucam Pro. All rights reserved.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
