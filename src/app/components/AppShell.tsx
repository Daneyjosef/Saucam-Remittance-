import { motion } from 'motion/react';
import { ArrowBack, Logout } from '@mui/icons-material';

interface AppShellProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  userLabel?: string;
  userRole?: string;
  onBack?: () => void;
  onLogout?: () => void;
  accent?: string;
  children: React.ReactNode;
}

export default function AppShell({
  icon,
  title,
  subtitle,
  userLabel,
  userRole,
  onBack,
  onLogout,
  accent = 'var(--color-primary)',
  children,
}: AppShellProps) {
  const initials = userLabel ? userLabel.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : '??';

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--grad-surface)', fontFamily: 'var(--font-body)' }}
    >
      {/* Sticky topbar */}
      <motion.div
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 flex items-center gap-3 px-4 md:px-8 py-3 border-b border-white/14"
        style={{
          zIndex: 'var(--z-sticky)',
          background: accent,
          boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
        }}
      >
        {/* Back */}
        {onBack && (
          <motion.button
            whileHover={{ x: -2 }}
            onClick={onBack}
            className="flex items-center justify-center w-9 h-9 rounded-[var(--radius-sm)] border-none cursor-pointer text-white flex-shrink-0 transition-colors duration-150"
            style={{ background: 'rgba(255,255,255,0.12)' }}
          >
            <ArrowBack style={{ fontSize: 18 }} />
          </motion.button>
        )}

        {/* Logo / icon + title */}
        <div className="flex items-center gap-3">
          {icon && (
            <div
              className="w-[34px] h-[34px] rounded-[var(--radius-sm)] flex items-center justify-center text-white"
              style={{ background: 'rgba(255,255,255,0.14)' }}
            >
              {icon}
            </div>
          )}
          <div>
            <span
              className="block leading-tight text-white"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-lg)' }}
            >
              {title}
            </span>
            {subtitle && (
              <span className="block text-[10px] text-white/60" style={{ lineHeight: 'var(--leading-normal)' }}>
                {subtitle}
              </span>
            )}
          </div>
        </div>

        <div className="flex-1" />

        {/* User info */}
        {userLabel && (
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-display)' }}
            >
              {initials}
            </div>
            <div className="text-right hidden sm:block">
              <span className="block text-white font-semibold leading-tight" style={{ fontSize: 'var(--text-base)' }}>{userLabel}</span>
              {userRole && <span className="block text-white/60 text-[10px]">{userRole}</span>}
            </div>
          </div>
        )}

        {/* Date */}
        <div className="hidden md:flex flex-col items-end border-l border-white/15 pl-4 ml-1">
          <span className="text-white/55 text-[10px] leading-tight">Today</span>
          <span className="text-white font-semibold leading-normal" style={{ fontSize: '0.8rem' }}>
            {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        </div>

        {/* Logout */}
        {onLogout && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-pill)] border border-white/25 bg-transparent cursor-pointer text-white font-semibold text-sm transition-colors duration-150"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <Logout style={{ fontSize: 15 }} />
            <span className="hidden sm:inline">Logout</span>
          </motion.button>
        )}
      </motion.div>

      {/* Page content */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex-1 overflow-auto"
      >
        {children}
      </motion.div>
    </div>
  );
}
