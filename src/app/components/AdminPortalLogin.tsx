import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IconButton } from '@mui/material';
import { Lock, Visibility, VisibilityOff, Shield, ArrowBack } from '@mui/icons-material';
import AppSpinner from './ui/AppSpinner';

interface AdminPortalLoginProps {
  onAdminLogin: () => void;
  onBack: () => void;
}

export default function AdminPortalLogin({ onAdminLogin, onBack }: AdminPortalLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    if (username === 'sysadmin' && password === 'admin@saucam') {
      setLoading(false);
      onAdminLogin();
    } else {
      setError('Invalid administrator credentials.');
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'var(--grad-admin)', fontFamily: 'var(--font-body)' }}
    >
      {/* Blobs */}
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.12, 0.2, 0.12] }}
        transition={{ duration: 9, repeat: Infinity }}
        className="absolute pointer-events-none rounded-full"
        style={{ top: -100, right: -100, width: 500, height: 500, background: 'radial-gradient(circle, rgba(167,139,250,0.4), transparent 70%)' }}
      />
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.1, 0.16, 0.1] }}
        transition={{ duration: 11, repeat: Infinity, delay: 3 }}
        className="absolute pointer-events-none rounded-full"
        style={{ bottom: -150, left: -120, width: 520, height: 520, background: 'radial-gradient(circle, rgba(99,102,241,0.35), transparent 70%)' }}
      />

      <div className="w-full mx-4" style={{ maxWidth: 460 }}>
        {/* Back button */}
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
          <motion.button
            whileHover={{ x: -3 }}
            onClick={onBack}
            className="flex items-center gap-2 mb-6 bg-transparent border-none cursor-pointer transition-colors duration-150 font-medium text-base"
            style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-body)', padding: 0 }}
          >
            <ArrowBack style={{ fontSize: 18 }} />
            Back to Staff Login
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="rounded-[var(--radius-xl)] overflow-hidden border border-white/10"
            style={{ boxShadow: 'var(--shadow-xl)' }}
          >
            {/* Purple header */}
            <div
              className="p-8 text-center border-b border-white/10"
              style={{ background: 'var(--grad-card)', backdropFilter: 'blur(20px)' }}
            >
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                <div
                  className="inline-flex items-center justify-center w-[76px] h-[76px] rounded-full border-2 border-white/22 mb-5"
                  style={{ background: 'rgba(255,255,255,0.12)', boxShadow: 'var(--shadow-lg)' }}
                >
                  <Shield style={{ fontSize: 36, color: 'white' }} />
                </div>
              </motion.div>
              <h1
                className="m-0 text-white leading-tight"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-4xl)', letterSpacing: 'var(--tracking-tight)' }}
              >
                Admin Portal
              </h1>
              <p className="m-0 mt-2 text-white/65" style={{ fontSize: 'var(--text-base)' }}>
                System Administrator Access Only
              </p>
            </div>

            {/* Form */}
            <div className="p-8" style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)' }}>
              {/* Security notice */}
              <div
                className="flex gap-3 p-3 mb-6 rounded-[var(--radius-md)] border"
                style={{ background: 'var(--color-purple-subtle)', borderColor: 'var(--color-purple-border)' }}
              >
                <Lock style={{ color: 'var(--color-purple)', fontSize: 18, flexShrink: 0, marginTop: 1 }} />
                <span className="text-sm leading-relaxed" style={{ color: 'var(--color-purple-dark)' }}>
                  Restricted access. All login attempts are logged and monitored for security compliance.
                </span>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Admin Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      autoComplete="username"
                      className={`input-base input-admin pl-11 ${error ? 'input-error' : ''}`}
                      style={{ background: 'var(--color-purple-subtle)' }}
                    />
                    <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-purple)', fontSize: 20 }} />
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className={`input-base input-admin pl-11 pr-12 ${error ? 'input-error' : ''}`}
                      style={{ background: 'var(--color-purple-subtle)' }}
                    />
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-purple)', fontSize: 20 }} />
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      size="small"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      style={{ color: 'var(--color-text-3)' }}
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div
                          className="flex gap-2 p-3 rounded-[var(--radius-sm)] border"
                          style={{ background: 'var(--color-danger-subtle)', borderColor: 'var(--color-danger-border)' }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1" style={{ background: 'var(--color-danger)' }} />
                          <span className="text-sm font-medium" style={{ color: 'var(--color-danger)' }}>{error}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="submit"
                    whileHover={loading ? {} : { scale: 1.01 }}
                    whileTap={loading ? {} : { scale: 0.98 }}
                    disabled={loading}
                    className="btn-base btn-lg btn-admin w-full mt-1 justify-center"
                    style={{ borderRadius: 'var(--radius-pill)' }}
                  >
                    {loading ? (
                      <>
                        <AppSpinner size="sm" color="white" />
                        Verifying…
                      </>
                    ) : 'Access Admin Portal'}
                  </motion.button>
                </div>
              </form>

              <p className="m-0 mt-6 text-center text-sm" style={{ color: 'var(--color-text-4)' }}>
                © {new Date().getFullYear()} Saucam Pro · Restricted Access
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
