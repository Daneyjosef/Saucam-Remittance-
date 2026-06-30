import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IconButton } from '@mui/material';
import { Person, Lock, Visibility, VisibilityOff, AdminPanelSettings } from '@mui/icons-material';
import AppButton from './ui/AppButton';
import AppSpinner from './ui/AppSpinner';

interface LoginScreenProps {
  onLogin: (username: string, password: string, role: string) => void;
  onAdminPortal: () => void;
}

const mockUsers: Record<string, { password: string; role: string }> = {
  'jessica.m': { password: 'teller123', role: 'Teller' },
  'emeka.o':   { password: 'teller123', role: 'Teller' },
  'mary.o':    { password: 'comply123', role: 'Compliance' },
  'chioma.n':  { password: 'manage123', role: 'Manager' },
};

const defaultCreds = [
  { user: 'jessica.m', pass: 'teller123', role: 'Teller',     color: 'var(--color-info)' },
  { user: 'emeka.o',   pass: 'teller123', role: 'Teller',     color: 'var(--color-info)' },
  { user: 'mary.o',    pass: 'comply123', role: 'Compliance', color: 'var(--color-purple)' },
  { user: 'chioma.n',  pass: 'manage123', role: 'Manager',    color: 'var(--color-warning-dark)' },
];

export default function LoginScreen({ onLogin, onAdminPortal }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const user = mockUsers[username.toLowerCase()];
    if (!user || user.password !== password) {
      setError('Invalid username or password.');
      setLoading(false);
      return;
    }
    setLoading(false);
    onLogin(username, password, user.role);
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
                className="inline-flex items-center justify-center w-[76px] h-[76px] rounded-full border-2 border-white/25 mb-5"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', boxShadow: 'var(--shadow-lg)' }}
              >
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
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
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                    className={`input-base pl-11 ${error ? 'input-error' : ''}`}
                  />
                  <Person className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-primary)', fontSize: 20 }} />
                </div>

                {/* Password */}
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className={`input-base pl-11 pr-12 ${error ? 'input-error' : ''}`}
                  />
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-primary)', fontSize: 20 }} />
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    size="small"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--color-text-3)' }}
                  >
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
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

            {/* Default creds helper */}
            <div
              className="mt-5 p-4 rounded-[var(--radius-md)] border"
              style={{ background: 'var(--color-bg-subtle)', borderColor: 'var(--color-primary-subtle)' }}
            >
              <p
                className="m-0 mb-3 text-xs font-bold uppercase"
                style={{ color: 'var(--color-admin)', letterSpacing: 'var(--tracking-wider)' }}
              >
                Default Staff Credentials
              </p>
              <div className="grid grid-cols-2 gap-2">
                {defaultCreds.map((c) => (
                  <motion.div
                    key={c.user}
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { setUsername(c.user); setPassword(c.pass); setError(''); }}
                    className="p-2.5 rounded-[var(--radius-sm)] cursor-pointer transition-all duration-150"
                    style={{ background: 'var(--color-surface)', border: `1.5px solid var(--color-primary-subtle)` }}
                  >
                    <span className="block font-mono font-bold text-xs leading-snug" style={{ color: 'var(--color-text-1)', fontSize: '0.8rem' }}>{c.user}</span>
                    <span className="block font-mono text-xs leading-snug" style={{ color: 'var(--color-text-3)', fontSize: 'var(--text-sm)' }}>{c.pass}</span>
                    <span
                      className="inline-block mt-1 px-2 py-0.5 rounded-[var(--radius-pill)] text-[10px] font-bold"
                      style={{ background: `${c.color}18`, color: c.color }}
                    >
                      {c.role}
                    </span>
                  </motion.div>
                ))}
              </div>
              <p className="m-0 mt-3 text-center" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-4)' }}>
                Click any card to auto-fill · Remove before production
              </p>
            </div>

            <p className="m-0 mt-5 text-center text-sm" style={{ color: 'var(--color-text-4)' }}>
              © {new Date().getFullYear()} Saucam Pro · All rights reserved
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
