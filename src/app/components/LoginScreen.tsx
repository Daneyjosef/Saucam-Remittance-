import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Person, Lock, Visibility, VisibilityOff, AdminPanelSettings, Email, Close, CheckCircle } from '@mui/icons-material';
import AppButton from './ui/AppButton';
import AppSpinner from './ui/AppSpinner';
import { authenticateUser, getUsers } from '../userStore';

interface LoginScreenProps {
  onLogin: (username: string, password: string, role: string) => void;
  onAdminPortal: () => void;
}

const REMEMBER_KEY = 'saucam_remember_user';
const RESET_REQUESTS_KEY = 'saucam_pw_reset_requests';

export default function LoginScreen({ onLogin, onAdminPortal }: LoginScreenProps) {
  const [username, setUsername]       = useState('');
  const [password, setPassword]       = useState('');
  const [rememberMe, setRememberMe]   = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]             = useState('');
  const [loading, setLoading]         = useState(false);

  // Forgot-password modal state
  const [forgotOpen, setForgotOpen]   = useState(false);
  const [fpEmail, setFpEmail]         = useState('');
  const [fpSubmitted, setFpSubmitted] = useState(false);
  const [fpError, setFpError]         = useState('');
  const [fpLoading, setFpLoading]     = useState(false);

  // Restore remembered username on mount
  useEffect(() => {
    const saved = localStorage.getItem(REMEMBER_KEY);
    if (saved) { setUsername(saved); setRememberMe(true); }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const user = authenticateUser(username, password);
    if (!user) {
      setError('Invalid username or password.');
      setLoading(false);
      return;
    }
    if (rememberMe) localStorage.setItem(REMEMBER_KEY, username);
    else localStorage.removeItem(REMEMBER_KEY);
    setLoading(false);
    // Map role names to what App.tsx expects
    const roleMap: Record<string, string> = { 'Branch Manager': 'Manager', 'Compliance Officer': 'Compliance' };
    onLogin(username, password, roleMap[user.role] ?? user.role);
  };

  const handleForgotSubmit = async () => {
    setFpError('');
    const trimmed = fpEmail.trim().toLowerCase();
    if (!trimmed) { setFpError('Please enter your company email address.'); return; }
    if (!trimmed.endsWith('@saucam.com')) { setFpError('Please use your company email (e.g. name@saucam.com).'); return; }

    // Find matching staff account by email
    const allUsers = getUsers();
    const matchUser = allUsers.find((u) => u.email === trimmed);
    const match: [string, unknown] | undefined = matchUser ? [matchUser.username, matchUser] : undefined;
    if (!match) { setFpError('No staff account found with that email address.'); return; }

    setFpLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    // Save request to localStorage so AdminPortal can read it
    const existing: PasswordResetRequest[] = JSON.parse(localStorage.getItem(RESET_REQUESTS_KEY) || '[]');
    const already = existing.find((r) => r.email === trimmed && r.status === 'Pending');
    if (!already) {
      const req: PasswordResetRequest = {
        id: `PWR-${Date.now()}`,
        username: match[0],
        email: trimmed,
        requestedAt: new Date().toLocaleString('en-GB'),
        status: 'Pending',
      };
      localStorage.setItem(RESET_REQUESTS_KEY, JSON.stringify([req, ...existing]));
    }

    setFpLoading(false);
    setFpSubmitted(true);
  };

  const closeForgot = () => {
    setForgotOpen(false);
    setTimeout(() => { setFpEmail(''); setFpError(''); setFpSubmitted(false); setFpLoading(false); }, 300);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'var(--grad-primary)', fontFamily: 'var(--font-body)' }}
    >
      {/* Decorative blobs */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.15, 0.22, 0.15] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute pointer-events-none rounded-full"
        style={{ top: -120, right: -120, width: 480, height: 480, background: 'radial-gradient(circle, rgba(99,102,241,0.4), transparent 70%)' }}
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.18, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        className="absolute pointer-events-none rounded-full"
        style={{ bottom: -160, left: -160, width: 560, height: 560, background: 'radial-gradient(circle, rgba(22,163,74,0.35), transparent 70%)' }}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full mx-4"
        style={{ maxWidth: 460 }}
      >
        <div
          className="rounded-[var(--radius-xl)] overflow-hidden border border-white/12"
          style={{ boxShadow: 'var(--shadow-xl)' }}
        >
          {/* Header */}
          <div
            className="p-8 text-center border-b border-white/12"
            style={{ background: 'var(--grad-card)', backdropFilter: 'blur(20px)' }}
          >
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}>
              <div
                className="inline-flex items-center justify-center w-[88px] h-[88px] rounded-2xl mb-5"
                style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)', boxShadow: 'var(--shadow-lg)', padding: 10 }}
              >
                <img src="/logo.png" alt="Saucam Pro" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
            </motion.div>
            <h1
              className="m-0 text-white leading-tight"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-4xl)', letterSpacing: 'var(--tracking-tight)' }}
            >
              Saucam Pro
            </h1>
            <p className="m-0 mt-2 text-white/70" style={{ fontSize: 'var(--text-base)' }}>
              Remittance Operations Platform
            </p>
          </div>

          {/* Form body */}
          <div className="p-8" style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)' }}>
            <h2
              className="m-0 mb-1"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-2xl)', color: 'var(--color-text-1)' }}
            >
              Welcome back
            </h2>
            <p className="m-0 mb-6 text-sm" style={{ color: 'var(--color-text-3)' }}>
              Sign in with your staff credentials to continue
            </p>

            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4">
                {/* Username */}
                <div className="relative">
                  <span className="pointer-events-none" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', zIndex: 1 }}>
                    <Person style={{ color: 'var(--color-primary)', fontSize: 20 }} />
                  </span>
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                    className={`input-base ${error ? 'input-error' : ''}`}
                    style={{ paddingLeft: 44 }}
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <span className="pointer-events-none" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', zIndex: 1 }}>
                    <Lock style={{ color: 'var(--color-primary)', fontSize: 20 }} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className={`input-base ${error ? 'input-error' : ''}`}
                    style={{ paddingLeft: 44, paddingRight: 48 }}
                  />
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    size="small"
                    style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-3)' }}
                  >
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </div>

                {/* Remember me + Forgot password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded cursor-pointer accent-[var(--color-primary)]"
                    />
                    <span className="text-sm" style={{ color: 'var(--color-text-2)' }}>Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotOpen(true)}
                    className="text-sm font-semibold bg-transparent border-none cursor-pointer p-0 transition-colors duration-150"
                    style={{ color: 'var(--color-primary)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary-hover)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -8, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div
                        className="flex items-center gap-2 p-3 rounded-[var(--radius-sm)] border"
                        style={{ background: 'var(--color-danger-subtle)', borderColor: 'var(--color-danger-border)' }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--color-danger)' }} />
                        <span className="text-sm font-medium" style={{ color: 'var(--color-danger)' }}>{error}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <motion.button
                  type="submit"
                  whileHover={loading ? {} : { scale: 1.01 }}
                  whileTap={loading ? {} : { scale: 0.98 }}
                  disabled={loading}
                  className="btn-base btn-lg btn-primary w-full mt-1 rounded-[var(--radius-pill)] justify-center"
                  style={{ letterSpacing: 'var(--tracking-wide)' }}
                >
                  {loading ? (
                    <>
                      <AppSpinner size="sm" color="white" />
                      Signing in…
                    </>
                  ) : 'Sign In'}
                </motion.button>
              </div>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
              <span className="text-xs px-2" style={{ color: 'var(--color-text-4)' }}>OR</span>
              <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
            </div>

            {/* Admin portal */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={onAdminPortal}
              className="btn-base btn-secondary btn-lg w-full justify-center"
              style={{ borderRadius: 'var(--radius-pill)' }}
            >
              <AdminPanelSettings style={{ fontSize: 20 }} />
              Admin Portal
            </motion.button>

            <p className="m-0 mt-5 text-center text-sm" style={{ color: 'var(--color-text-4)' }}>
              © {new Date().getFullYear()} Saucam Pro · All rights reserved
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Forgot Password Modal ── */}
      <Dialog
        open={forgotOpen}
        onClose={closeForgot}
        maxWidth="xs"
        fullWidth
        PaperProps={{ style: { borderRadius: 'var(--radius-xl)', overflow: 'hidden' } }}
      >
        <DialogTitle style={{ padding: 0 }}>
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ background: 'linear-gradient(135deg, var(--color-primary), #1e40af)' }}
          >
            <div className="flex items-center gap-3">
              <Lock style={{ color: 'white', fontSize: 20 }} />
              <div>
                <div className="text-white font-bold text-base leading-none">Forgot Password</div>
                <div className="text-white/70 text-xs mt-0.5">Request a reset via your company email</div>
              </div>
            </div>
            <IconButton onClick={closeForgot} size="small" style={{ color: 'white' }}>
              <Close fontSize="small" />
            </IconButton>
          </div>
        </DialogTitle>

        <DialogContent style={{ padding: '28px 24px 8px' }}>
          <AnimatePresence mode="wait">
            {!fpSubmitted ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="m-0 mb-5 text-sm" style={{ color: 'var(--color-text-3)', lineHeight: 1.6 }}>
                  Enter your company email address. A password reset request will be sent directly to the
                  <strong style={{ color: 'var(--color-admin)' }}> System Administrator</strong> for approval.
                </p>

                <div className="relative mb-3">
                  <span className="pointer-events-none" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', zIndex: 1 }}>
                    <Email style={{ color: 'var(--color-primary)', fontSize: 20 }} />
                  </span>
                  <input
                    type="email"
                    placeholder="yourname@saucam.com"
                    value={fpEmail}
                    onChange={(e) => { setFpEmail(e.target.value); setFpError(''); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleForgotSubmit()}
                    className="input-base"
                    style={{ paddingLeft: 44, width: '100%' }}
                    autoFocus
                  />
                </div>

                <AnimatePresence>
                  {fpError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <div
                        className="flex items-center gap-2 p-2.5 rounded-[var(--radius-sm)] border mb-3"
                        style={{ background: 'var(--color-danger-subtle)', borderColor: 'var(--color-danger-border)' }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--color-danger)' }} />
                        <span className="text-sm" style={{ color: 'var(--color-danger)' }}>{fpError}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div
                  className="flex items-start gap-2 p-3 rounded-[var(--radius-sm)] text-xs"
                  style={{ background: 'var(--color-info-subtle)', color: 'var(--color-text-3)' }}
                >
                  <span style={{ color: 'var(--color-info)', marginTop: 1 }}>ℹ</span>
                  Your request will appear in the Admin Portal. The administrator will reset your password and notify you.
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center text-center py-4"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                  style={{ background: 'var(--color-success-bg)' }}
                >
                  <CheckCircle style={{ color: 'var(--color-accent)', fontSize: 36 }} />
                </div>
                <div className="font-bold text-lg mb-2" style={{ color: 'var(--color-text-1)' }}>Request Sent</div>
                <p className="m-0 text-sm" style={{ color: 'var(--color-text-3)', lineHeight: 1.6 }}>
                  Your password reset request has been forwarded to the System Administrator. Please wait for them to contact you with your new credentials.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>

        <DialogActions style={{ padding: '16px 24px 24px', gap: 10 }}>
          {!fpSubmitted ? (
            <>
              <AppButton variant="secondary" onClick={closeForgot}>Cancel</AppButton>
              <AppButton variant="primary" loading={fpLoading} onClick={handleForgotSubmit}>
                Send Reset Request
              </AppButton>
            </>
          ) : (
            <AppButton variant="primary" fullWidth onClick={closeForgot}>Done</AppButton>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}

// Exported type so AdminPortal can share the same shape
export interface PasswordResetRequest {
  id: string;
  username: string;
  email: string;
  requestedAt: string;
  status: 'Pending' | 'Resolved';
}

export { RESET_REQUESTS_KEY };
