import { motion } from 'motion/react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow,
} from '@mui/material';
import { TrendingUp, AccountBalance, Assessment, Circle, Flag } from '@mui/icons-material';
import AppShell from './AppShell';
import AppStatCard from './ui/AppStatCard';
import AppBadge from './ui/AppBadge';
import AppButton from './ui/AppButton';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

interface ExecutiveDashboardProps {
  onBack?: () => void;
  onGoToCompliance?: () => void;
  onLogout?: () => void;
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
  { date: 'Jun 1',  volume: 2120000, transactions: 235 },
  { date: 'Jun 2',  volume: 1760000, transactions: 189 },
  { date: 'Jun 3',  volume: 2340000, transactions: 267 },
];

const flaggedTransactions = [
  { id: 'FTX-001', customer: 'Ahmed Hassan', amount: '12,000 USD', reason: 'Above CBN threshold', risk: 'High' as const },
  { id: 'FTX-002', customer: 'Sarah Johnson', amount: '8,500,000 NGN', reason: 'Multiple transactions', risk: 'Medium' as const },
  { id: 'FTX-003', customer: 'John Adebayo', amount: '15,000 USD', reason: 'Above CBN threshold', risk: 'High' as const },
];

const branchStatuses = [
  { branch: 'Downtown Main Office',    status: 'online',  float: 'Normal',  lastUpdate: '2 min ago' },
  { branch: 'Victoria Island Branch',  status: 'online',  float: 'Normal',  lastUpdate: '1 min ago' },
  { branch: 'Lekki Branch',            status: 'online',  float: 'Low',     lastUpdate: '5 min ago' },
  { branch: 'Ikeja Branch',            status: 'online',  float: 'Normal',  lastUpdate: '3 min ago' },
  { branch: 'Yaba Branch',             status: 'offline', float: 'Unknown', lastUpdate: '45 min ago' },
];

const thCell = 'font-semibold text-xs py-2.5 px-3 border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] text-[var(--color-text-3)]';
const tdCell = 'py-2.5 px-3 text-sm text-[var(--color-text-2)] border-b border-[var(--color-border)]';

export default function ExecutiveDashboard({ onBack, onGoToCompliance, onLogout }: ExecutiveDashboardProps) {
  return (
    <AppShell title="Executive Dashboard" subtitle="Real-time operations overview" userLabel="Branch Manager" userRole="Manager" onBack={onBack} onLogout={onLogout}>
      <div className="p-4 md:p-8">
        <div style={{ maxWidth: 1800, margin: '0 auto' }}>
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-6">
            <h1 className="m-0 mb-1 font-extrabold leading-tight" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', color: 'var(--color-primary)' }}>
              Real-Time Performance Overview
            </h1>
            <p className="m-0 text-sm" style={{ color: 'var(--color-text-3)' }}>June 3, 2026 • All Branches</p>
          </motion.div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <AppStatCard label="Total Transactions Today" value={267} sub="+12.5% from yesterday" color="primary" icon={<Assessment />} delay={0} />
            <AppStatCard label="Total Volume (NGN)" value="₦2.34M" sub="+8.3% from yesterday" color="accent" icon={<AccountBalance />} delay={0.08} />
            <AppStatCard label="Average Spread Earned" value="1.24%" sub="Across all currency pairs" color="warning" icon={<TrendingUp />} delay={0.16} />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5">
              <div className="font-bold mb-4" style={{ color: 'var(--color-primary)' }}>Revenue by Branch (Today)</div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={branchRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="branch" tick={{ fill: '#64748b', fontSize: 12 }} angle={-15} textAnchor="end" height={60} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(v) => `₦${(v/1000000).toFixed(1)}M`} />
                  <Tooltip formatter={(v: number) => [`₦${v.toLocaleString()}`, 'Revenue']} contentStyle={{ borderRadius: 8 }} />
                  <Bar dataKey="revenue" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5">
              <div className="font-bold mb-4" style={{ color: 'var(--color-primary)' }}>Transaction Volume (Last 7 Days)</div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={transactionVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(v) => `₦${(v/1000000).toFixed(1)}M`} />
                  <Tooltip formatter={(v: number, n: string) => n === 'volume' ? [`₦${v.toLocaleString()}`, 'Volume'] : [v, 'Transactions']} contentStyle={{ borderRadius: 8 }} />
                  <Legend />
                  <Line type="monotone" dataKey="volume" stroke="var(--color-primary)" strokeWidth={3} dot={{ r: 5 }} />
                  <Line type="monotone" dataKey="transactions" stroke="var(--color-accent)" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
            {/* Flagged Transactions */}
            <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <Flag style={{ color: 'var(--color-danger)' }} />
                  <span className="font-bold" style={{ color: 'var(--color-primary)' }}>Flagged Transactions Pending Review</span>
                </div>
                <AppButton variant="primary" size="sm" onClick={onGoToCompliance}>Go to Compliance</AppButton>
              </div>
              <TableContainer>
                <Table size="small" style={{ minWidth: 500 }}>
                  <TableHead>
                    <TableRow>
                      {['Transaction ID', 'Customer', 'Amount', 'Reason', 'Risk'].map((h) => (
                        <TableCell key={h} className={thCell}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {flaggedTransactions.map((txn) => (
                      <TableRow key={txn.id} className="hover:bg-[var(--color-surface-subtle)] transition-colors">
                        <TableCell className={tdCell}><span className="font-semibold" style={{ color: 'var(--color-primary)' }}>{txn.id}</span></TableCell>
                        <TableCell className={tdCell}>{txn.customer}</TableCell>
                        <TableCell className={tdCell}>{txn.amount}</TableCell>
                        <TableCell className={tdCell}>{txn.reason}</TableCell>
                        <TableCell className={tdCell}>
                          <AppBadge variant={txn.risk === 'High' ? 'danger' : txn.risk === 'Medium' ? 'warning' : 'info'} size="sm">{txn.risk}</AppBadge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>

            {/* Branch Status */}
            <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5">
              <div className="font-bold mb-4" style={{ color: 'var(--color-primary)' }}>Branch Status Monitor</div>
              <div className="flex flex-col gap-3">
                {branchStatuses.map((b) => (
                  <div
                    key={b.branch}
                    className="flex items-center justify-between p-3 rounded-[var(--radius-sm)] border"
                    style={{ background: 'var(--color-bg-subtle)', borderColor: 'var(--color-border)' }}
                  >
                    <div className="flex items-center gap-2">
                      <Circle style={{ fontSize: 16, color: b.status === 'online' ? 'var(--color-accent)' : 'var(--color-danger)' }} />
                      <div>
                        <div className="text-sm font-semibold" style={{ color: 'var(--color-text-1)' }}>{b.branch}</div>
                        <div className="text-xs" style={{ color: 'var(--color-text-3)' }}>Updated {b.lastUpdate}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <AppBadge variant={b.status === 'online' ? 'success' : 'danger'} size="sm">{b.status === 'online' ? 'Online' : 'Offline'}</AppBadge>
                      <AppBadge variant={b.float === 'Low' ? 'danger' : b.float === 'Normal' ? 'success' : 'neutral'} size="sm">Float: {b.float}</AppBadge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
