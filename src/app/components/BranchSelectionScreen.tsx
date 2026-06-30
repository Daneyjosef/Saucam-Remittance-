import { motion } from 'motion/react';
import { Store, TrendingUp, People, CheckCircle, Warning, Logout, LocationOn } from '@mui/icons-material';
import AppBadge from './ui/AppBadge';

interface Branch {
  id: string; name: string; location: string;
  status: 'Active' | 'Low Float' | 'Offline';
  todayTransactions: number; todayVolume: number; staff: number;
}

interface BranchSelectionScreenProps {
  userRole: string; userName: string;
  onSelectBranch: (branchId: string) => void;
  onLogout: () => void;
}

const branches: Branch[] = [
  { id: 'main',  name: 'Downtown Main Office',    location: 'Victoria Island, Lagos',    status: 'Active',    todayTransactions: 145, todayVolume: 2450000, staff: 12 },
  { id: 'vi',    name: 'Victoria Island Branch',  location: 'Adeola Odeku Street',       status: 'Active',    todayTransactions: 178, todayVolume: 3120000, staff: 10 },
  { id: 'lekki', name: 'Lekki Branch',            location: 'Admiralty Way',             status: 'Low Float', todayTransactions: 98,  todayVolume: 1890000, staff: 8  },
  { id: 'ikeja', name: 'Ikeja Branch',            location: 'Allen Avenue',              status: 'Active',    todayTransactions: 132, todayVolume: 2280000, staff: 9  },
  { id: 'yaba',  name: 'Yaba Branch',             location: 'Herbert Macaulay Way',      status: 'Offline',   todayTransactions: 0,   todayVolume: 0,       staff: 7  },
];

const statusBadge = {
  Active:      { variant: 'success' as const, icon: <CheckCircle style={{ fontSize: 12 }} /> },
  'Low Float': { variant: 'warning' as const, icon: <Warning style={{ fontSize: 12 }} /> },
  Offline:     { variant: 'danger' as const,  icon: <Warning style={{ fontSize: 12 }} /> },
};

export default function BranchSelectionScreen({ userRole, userName, onSelectBranch, onLogout }: BranchSelectionScreenProps) {
  const totalVolume = branches.reduce((s, b) => s + b.todayVolume, 0);
  const activeBranches = branches.filter((b) => b.status === 'Active').length;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--grad-surface)', fontFamily: 'var(--font-body)' }}>
      {/* Topbar */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 flex items-center gap-3 px-4 md:px-8 py-3 border-b border-white/12"
        style={{ zIndex: 'var(--z-sticky)', background: 'rgba(30,58,138,0.96)', backdropFilter: 'blur(20px)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-[34px] h-[34px] rounded-[var(--radius-sm)] flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.12)' }}
          >
            <Store style={{ fontSize: 18, color: 'white' }} />
          </div>
          <span
            className="font-bold text-white"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)' }}
          >
            Branch Selection
          </span>
        </div>
        <div className="flex-1" />
        <div className="hidden sm:flex flex-col items-end mr-2">
          <span className="text-white/55 text-[10px] leading-tight">Signed in as</span>
          <span className="text-white font-semibold text-sm">{userName} · {userRole}</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-pill)] border border-white/25 bg-transparent cursor-pointer text-white font-semibold text-sm"
        >
          <Logout style={{ fontSize: 16 }} />
          Logout
        </motion.button>
      </motion.div>

      {/* Hero */}
      <div className="px-4 md:px-8 pt-10 pb-6 w-full max-w-[var(--container-2xl)] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <h1
            className="m-0 leading-tight"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.875rem, 4vw, 2.25rem)', color: 'var(--color-primary)', letterSpacing: 'var(--tracking-tight)' }}
          >
            Select a Branch
          </h1>
          <p className="m-0 mt-2 text-base" style={{ color: 'var(--color-text-3)' }}>
            Choose a location to access its operations dashboard
          </p>
        </motion.div>

        {/* Summary stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6"
        >
          {[
            { label: 'Total Branches',     value: branches.length,                            color: 'var(--color-primary)',      bg: 'var(--color-primary-subtle)', icon: <Store style={{ fontSize: 18 }} /> },
            { label: 'Active Branches',    value: activeBranches,                             color: 'var(--color-accent)',       bg: 'var(--color-accent-subtle)',  icon: <CheckCircle style={{ fontSize: 18 }} /> },
            { label: 'Total Volume Today', value: `₦${(totalVolume/1000000).toFixed(1)}M`,   color: 'var(--color-warning-dark)', bg: 'var(--color-warning-subtle)', icon: <TrendingUp style={{ fontSize: 18 }} /> },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.08 }}
              whileHover={{ y: -2 }}
              className="flex items-center gap-3 p-4 rounded-[var(--radius-md)] border"
              style={{ background: s.bg, borderColor: `${s.color}22` }}
            >
              <span style={{ color: s.color, opacity: 0.7 }}>{s.icon}</span>
              <div>
                <span
                  className="block text-xs font-bold uppercase"
                  style={{ color: 'var(--color-text-3)', letterSpacing: 'var(--tracking-wider)' }}
                >
                  {s.label}
                </span>
                <span
                  className="block font-extrabold leading-tight mt-0.5"
                  style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', color: s.color }}
                >
                  {s.value}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Branch cards grid */}
      <div className="px-4 md:px-8 pb-12 w-full max-w-[var(--container-2xl)] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch, i) => {
            const cfg = statusBadge[branch.status];
            const isOffline = branch.status === 'Offline';
            return (
              <motion.div
                key={branch.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.3 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={isOffline ? {} : { y: -5, boxShadow: '0 20px 48px rgba(30,58,138,0.18)' }}
                onClick={() => !isOffline && onSelectBranch(branch.id)}
                className="rounded-[var(--radius-lg)] overflow-hidden border transition-all duration-200"
                style={{
                  background: 'var(--color-surface)',
                  borderColor: isOffline ? 'var(--color-danger-border)' : 'var(--color-border)',
                  boxShadow: 'var(--shadow-sm)',
                  cursor: isOffline ? 'not-allowed' : 'pointer',
                  opacity: isOffline ? 0.6 : 1,
                }}
              >
                {/* Card top accent */}
                <div
                  className="h-1"
                  style={{
                    background: isOffline
                      ? 'var(--color-danger-border)'
                      : branch.status === 'Low Float'
                      ? 'var(--color-warning-border)'
                      : 'linear-gradient(90deg, var(--color-primary), var(--color-info))',
                  }}
                />

                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex gap-3 items-start">
                      <div
                        className="w-[42px] h-[42px] rounded-[var(--radius-sm)] flex items-center justify-center flex-shrink-0"
                        style={{ background: isOffline ? 'var(--color-danger-bg)' : 'var(--color-primary-subtle)' }}
                      >
                        <Store style={{ fontSize: 22, color: isOffline ? 'var(--color-danger)' : 'var(--color-primary)' }} />
                      </div>
                      <div>
                        <h3
                          className="m-0 leading-snug"
                          style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--color-text-1)' }}
                        >
                          {branch.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-1">
                          <LocationOn style={{ fontSize: 13, color: 'var(--color-text-4)' }} />
                          <span className="text-xs" style={{ color: 'var(--color-text-3)' }}>{branch.location}</span>
                        </div>
                      </div>
                    </div>
                    <AppBadge variant={cfg.variant} dot size="sm">
                      {branch.status}
                    </AppBadge>
                  </div>

                  {/* Stats */}
                  <div
                    className="grid grid-cols-3 gap-2 p-3 rounded-[var(--radius-sm)] border"
                    style={{ background: 'var(--color-bg-subtle)', borderColor: 'var(--color-primary-subtle)' }}
                  >
                    {[
                      { label: 'Transactions', value: branch.todayTransactions, color: 'var(--color-primary)' },
                      { label: 'Volume', value: branch.todayVolume > 0 ? `₦${(branch.todayVolume/1000000).toFixed(1)}M` : '—', color: 'var(--color-accent)' },
                      { label: 'Staff', value: branch.staff, color: 'var(--color-text-2)' },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center">
                        <span
                          className="block font-extrabold leading-tight"
                          style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', color: stat.color }}
                        >
                          {stat.value}
                        </span>
                        <span className="block text-[10px] mt-1 font-medium" style={{ color: 'var(--color-text-4)' }}>{stat.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="mt-4 flex items-center gap-2">
                    <People style={{ fontSize: 14, color: 'var(--color-text-4)' }} />
                    <span className="text-xs flex-1" style={{ color: 'var(--color-text-3)' }}>
                      {isOffline ? 'Branch is currently offline' : `${branch.staff} staff active today`}
                    </span>
                    {!isOffline && (
                      <span className="text-xs font-bold" style={{ color: 'var(--color-primary)' }}>
                        Open →
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
