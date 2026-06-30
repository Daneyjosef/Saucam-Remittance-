import { useState } from 'react';
import {
  Avatar, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, FormControl,
  InputLabel, Select, MenuItem, InputAdornment, Divider,
  Alert, Tooltip,
} from '@mui/material';
import {
  Dashboard, People, AccountBalance, TrendingUp, Flag, Settings,
  Shield, Logout, PersonAdd, Edit, Block, CheckCircle, Close,
  Lock, Person, Visibility, VisibilityOff, VpnKey,
  Add, Remove, CloudUpload, Delete, Calculate, Warning, Circle,
  FileDownload, FilterList, Search, Business, Notifications,
  ChevronLeft, ChevronRight, Assessment,
} from '@mui/icons-material';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { toast, Toaster } from 'sonner';
import AppButton from './ui/AppButton';
import AppBadge from './ui/AppBadge';
import AppStatCard from './ui/AppStatCard';

// ─── Types ─────────────────────────────────────────────────────────────────────
interface User { id: string; name: string; username: string; role: string; assignedBranch: string; lastActive: string; status: 'Active' | 'Disabled'; }
interface ExchangeRate { id: string; currencyPair: string; buyRate: number; sellRate: number; spread: number; lastUpdated: string; status: 'Active' | 'Inactive'; }
interface Branch { id: string; name: string; location: string; manager: string; status: 'Online' | 'Offline'; float: 'Normal' | 'Low' | 'Unknown'; staff: number; }
interface CurrencyFloat { code: string; name: string; flag: string; openingFloat: number; currentFloat: number; lowThreshold: number; physicalCount: string; }
interface FlaggedTransaction { id: string; timestamp: string; branch: string; teller: string; customerName: string; amount: number; currency: string; flagReason: string; status: 'Pending' | 'Approved' | 'Under Investigation'; riskLevel: 'High' | 'Medium' | 'Low'; }

// ─── Mock Data ──────────────────────────────────────────────────────────────────
const initUsers: User[] = [
  { id: '1', name: 'Jessica Martinez', username: 'jessica.m', role: 'Teller', assignedBranch: 'Downtown Main Office', lastActive: '2 minutes ago', status: 'Active' },
  { id: '2', name: 'Emeka Okonkwo', username: 'emeka.o', role: 'Teller', assignedBranch: 'Victoria Island Branch', lastActive: '15 minutes ago', status: 'Active' },
  { id: '3', name: 'Mary Okafor', username: 'mary.o', role: 'Compliance Officer', assignedBranch: 'All Branches', lastActive: '1 hour ago', status: 'Active' },
  { id: '4', name: 'Chioma Nwosu', username: 'chioma.n', role: 'Branch Manager', assignedBranch: 'Lekki Branch', lastActive: '3 hours ago', status: 'Active' },
  { id: '5', name: 'Bolaji Adeyemi', username: 'bolaji.a', role: 'Teller', assignedBranch: 'Ikeja Branch', lastActive: '2 days ago', status: 'Disabled' },
];
const initRates: ExchangeRate[] = [
  { id: '1', currencyPair: 'NGN/USD', buyRate: 1445, sellRate: 1455, spread: 0.69, lastUpdated: '2026-06-30 14:35', status: 'Active' },
  { id: '2', currencyPair: 'USD/EUR', buyRate: 0.915, sellRate: 0.925, spread: 1.09, lastUpdated: '2026-06-30 14:30', status: 'Active' },
  { id: '3', currencyPair: 'USD/GBP', buyRate: 0.785, sellRate: 0.795, spread: 1.27, lastUpdated: '2026-06-30 14:28', status: 'Active' },
  { id: '4', currencyPair: 'USD/JPY', buyRate: 148.5, sellRate: 150.5, spread: 1.35, lastUpdated: '2026-06-30 14:25', status: 'Active' },
  { id: '5', currencyPair: 'EUR/GBP', buyRate: 0.855, sellRate: 0.865, spread: 1.17, lastUpdated: '2026-06-30 14:20', status: 'Active' },
  { id: '6', currencyPair: 'NGN/GBP', buyRate: 1820, sellRate: 1840, spread: 1.10, lastUpdated: '2026-06-30 13:45', status: 'Inactive' },
];
const initBranches: Branch[] = [
  { id: '1', name: 'Downtown Main Office', location: 'Lagos Island', manager: 'Adebayo Tunde', status: 'Online', float: 'Normal', staff: 8 },
  { id: '2', name: 'Victoria Island Branch', location: 'Victoria Island', manager: 'Ngozi Eze', status: 'Online', float: 'Normal', staff: 6 },
  { id: '3', name: 'Lekki Branch', location: 'Lekki Phase 1', manager: 'Chioma Nwosu', status: 'Online', float: 'Low', staff: 5 },
  { id: '4', name: 'Ikeja Branch', location: 'Ikeja GRA', manager: 'Seun Adeleke', status: 'Online', float: 'Normal', staff: 7 },
  { id: '5', name: 'Yaba Branch', location: 'Yaba', manager: 'Unassigned', status: 'Offline', float: 'Unknown', staff: 0 },
];
const initFloats: CurrencyFloat[] = [
  { code: 'NGN', name: 'Nigerian Naira', flag: '🇳🇬', openingFloat: 500000, currentFloat: 387500, lowThreshold: 100000, physicalCount: '' },
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸', openingFloat: 10000, currentFloat: 7650, lowThreshold: 2000, physicalCount: '' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧', openingFloat: 5000, currentFloat: 1850, lowThreshold: 1000, physicalCount: '' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺', openingFloat: 8000, currentFloat: 5420, lowThreshold: 1500, physicalCount: '' },
];
const initTransactions: FlaggedTransaction[] = [
  { id: 'FTX-001', timestamp: '2026-06-30 14:32', branch: 'Downtown Main Office', teller: 'Jessica Martinez', customerName: 'Ahmed Hassan', amount: 12000, currency: 'USD', flagReason: 'Above CBN threshold (>$10,000)', status: 'Pending', riskLevel: 'High' },
  { id: 'FTX-002', timestamp: '2026-06-30 13:45', branch: 'Victoria Island Branch', teller: 'Emeka Okonkwo', customerName: 'Sarah Johnson', amount: 8500000, currency: 'NGN', flagReason: 'Multiple transactions within 1 hour', status: 'Pending', riskLevel: 'Medium' },
  { id: 'FTX-003', timestamp: '2026-06-30 12:18', branch: 'Lekki Branch', teller: 'Chioma Nwosu', customerName: 'John Adebayo', amount: 15000, currency: 'USD', flagReason: 'Above CBN threshold (>$10,000)', status: 'Pending', riskLevel: 'High' },
  { id: 'FTX-004', timestamp: '2026-06-30 11:52', branch: 'Downtown Main Office', teller: 'Jessica Martinez', customerName: 'Maria Garcia', amount: 4500, currency: 'GBP', flagReason: 'Unusual currency for customer profile', status: 'Under Investigation', riskLevel: 'Low' },
  { id: 'FTX-005', timestamp: '2026-06-30 10:25', branch: 'Ikeja Branch', teller: 'Bolaji Adeyemi', customerName: 'Chen Wei', amount: 22000, currency: 'USD', flagReason: 'Above CBN threshold, New customer (<30 days)', status: 'Pending', riskLevel: 'High' },
  { id: 'FTX-006', timestamp: '2026-06-30 09:15', branch: 'Victoria Island Branch', teller: 'Emeka Okonkwo', customerName: 'Abdul Rahman', amount: 6800000, currency: 'NGN', flagReason: 'Rapid succession of transactions', status: 'Approved', riskLevel: 'Medium' },
];
const branchRevenueData = [
  { branch: 'Downtown', revenue: 2450000 },
  { branch: 'Victoria Is.', revenue: 3120000 },
  { branch: 'Lekki', revenue: 1890000 },
  { branch: 'Ikeja', revenue: 2280000 },
  { branch: 'Yaba', revenue: 1650000 },
];
const volumeData = [
  { date: 'Jun 24', volume: 1250000, txns: 145 },
  { date: 'Jun 25', volume: 1580000, txns: 178 },
  { date: 'Jun 26', volume: 1420000, txns: 162 },
  { date: 'Jun 27', volume: 1890000, txns: 201 },
  { date: 'Jun 28', volume: 2120000, txns: 235 },
  { date: 'Jun 29', volume: 1760000, txns: 189 },
  { date: 'Jun 30', volume: 2340000, txns: 267 },
];
const roles = ['Teller', 'Branch Manager', 'Compliance Officer'];
const branchNames = ['All Branches', 'Downtown Main Office', 'Victoria Island Branch', 'Lekki Branch', 'Ikeja Branch', 'Yaba Branch'];
const avatarColors = ['#1e3a8a', '#0369a1', '#16a34a', '#7c3aed', '#b45309', '#dc2626'];
function getInitials(name: string) { return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2); }

type Section = 'overview' | 'users' | 'branches' | 'rates' | 'float' | 'compliance' | 'settings';
interface NavItem { id: Section; label: string; icon: React.ReactNode; badge?: number }

const thCell = 'font-bold text-xs uppercase tracking-wider py-3 px-3 border-b-2 whitespace-nowrap';
const tdCell = 'py-3 px-3 text-sm border-b';

// ─── Main ───────────────────────────────────────────────────────────────────────

interface AdminPortalProps { onLogout: () => void }

export default function AdminPortal({ onLogout }: AdminPortalProps) {
  const [section, setSection] = useState<Section>('overview');
  const [collapsed, setCollapsed] = useState(false);
  const [users, setUsers] = useState<User[]>(initUsers);
  const [rates, setRates] = useState<ExchangeRate[]>(initRates);
  const [branches, setBranches] = useState<Branch[]>(initBranches);
  const [floats, setFloats] = useState<CurrencyFloat[]>(initFloats);
  const [transactions, setTransactions] = useState<FlaggedTransaction[]>(initTransactions);
  const pendingFlags = transactions.filter((t) => t.status === 'Pending').length;

  const navItems: NavItem[] = [
    { id: 'overview',   label: 'Overview',          icon: <Dashboard /> },
    { id: 'users',      label: 'User Management',   icon: <People /> },
    { id: 'branches',   label: 'Branch Management', icon: <Business /> },
    { id: 'rates',      label: 'Exchange Rates',    icon: <TrendingUp /> },
    { id: 'float',      label: 'Cash Float',        icon: <AccountBalance /> },
    { id: 'compliance', label: 'Compliance',        icon: <Flag />, badge: pendingFlags },
    { id: 'settings',   label: 'System Settings',   icon: <Settings /> },
  ];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f0f2f8' }}>
      <Toaster position="top-right" richColors />

      {/* Sidebar */}
      <div
        className="flex flex-col overflow-hidden flex-shrink-0"
        style={{
          width: collapsed ? 68 : 240,
          transition: 'width 0.25s ease',
          background: 'linear-gradient(180deg,#1e1b4b 0%,#312e81 60%,#4c1d95 100%)',
          boxShadow: '4px 0 20px rgba(0,0,0,0.25)',
          zIndex: 10,
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 border-b border-white/10"
          style={{ padding: collapsed ? '20px 16px 16px' : '20px 20px 16px' }}
        >
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <Shield style={{ color: 'white', fontSize: 20 }} />
          </div>
          {!collapsed && (
            <div>
              <div className="text-white font-extrabold text-base leading-none">Saucam Pro</div>
              <div className="text-white/55 text-[10px] uppercase tracking-widest mt-0.5">Admin Portal</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <div className="flex-1 py-3 overflow-hidden">
          {navItems.map((item) => {
            const active = section === item.id;
            return (
              <Tooltip key={item.id} title={collapsed ? item.label : ''} placement="right">
                <div
                  onClick={() => setSection(item.id)}
                  className="flex items-center mx-2 mb-1 rounded-lg cursor-pointer transition-all duration-150 relative"
                  style={{
                    gap: 10,
                    padding: collapsed ? '10px 0' : '10px 14px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    background: active ? 'rgba(255,255,255,0.18)' : 'transparent',
                    borderLeft: active ? '3px solid #a78bfa' : '3px solid transparent',
                  }}
                >
                  <span style={{ color: active ? '#c4b5fd' : 'rgba(255,255,255,0.65)', display: 'flex', flexShrink: 0 }}>{item.icon}</span>
                  {!collapsed && (
                    <span className="flex-1 text-sm" style={{ color: active ? 'white' : 'rgba(255,255,255,0.75)', fontWeight: active ? 700 : 500 }}>{item.label}</span>
                  )}
                  {item.badge && item.badge > 0 && (
                    <span
                      className="flex items-center justify-center text-white rounded-full text-[10px] font-bold"
                      style={{ background: '#ef4444', minWidth: 18, height: 18, padding: '0 4px', position: collapsed ? 'absolute' : 'static', top: collapsed ? 4 : 'auto', right: collapsed ? 4 : 'auto' }}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              </Tooltip>
            );
          })}
        </div>

        {/* Bottom */}
        <div className="p-3 border-t border-white/10">
          <div
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center px-2 py-1 cursor-pointer mb-2 text-white/50 hover:text-white transition-colors duration-150"
            style={{ justifyContent: collapsed ? 'center' : 'flex-end' }}
          >
            {collapsed ? <ChevronRight /> : <><span className="text-xs mr-1">Collapse</span><ChevronLeft /></>}
          </div>
          <Tooltip title={collapsed ? 'Logout' : ''} placement="right">
            <div
              onClick={onLogout}
              className="flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer transition-colors duration-150 hover:bg-red-500/20"
              style={{ justifyContent: collapsed ? 'center' : 'flex-start', color: 'rgba(255,255,255,0.6)' }}
            >
              <Logout style={{ fontSize: 20 }} />
              {!collapsed && <span className="text-sm font-medium">Sign Out</span>}
            </div>
          </Tooltip>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="bg-white px-6 py-3 flex items-center justify-between flex-shrink-0 border-b border-[var(--color-border)]" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <div>
            <div className="font-extrabold text-[#1e1b4b] text-xl leading-none">{navItems.find((n) => n.id === section)?.label}</div>
            <div className="text-xs text-[var(--color-text-3)] mt-0.5">{new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
          <div className="flex items-center gap-3">
            <IconButton size="small"><Notifications style={{ fontSize: 18, color: 'var(--color-text-3)' }} /></IconButton>
            <div className="flex items-center gap-2">
              <Avatar style={{ width: 34, height: 34, background: '#312e81', fontSize: 13, fontWeight: 700 }}>SA</Avatar>
              <div>
                <div className="text-sm font-bold leading-none text-[#1e1b4b]">System Admin</div>
                <div className="text-xs font-semibold text-[var(--color-admin)]">Administrator</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {section === 'overview'   && <OverviewSection users={users} transactions={transactions} branches={branches} onNavigate={setSection} />}
          {section === 'users'      && <UsersSection users={users} setUsers={setUsers} />}
          {section === 'branches'   && <BranchesSection branches={branches} setBranches={setBranches} />}
          {section === 'rates'      && <RatesSection rates={rates} setRates={setRates} />}
          {section === 'float'      && <FloatSection floats={floats} setFloats={setFloats} />}
          {section === 'compliance' && <ComplianceSection transactions={transactions} setTransactions={setTransactions} />}
          {section === 'settings'   && <SettingsSection />}
        </div>
      </div>
    </div>
  );
}

// ─── Overview ───────────────────────────────────────────────────────────────────

function OverviewSection({ users, transactions, branches, onNavigate }: { users: User[]; transactions: FlaggedTransaction[]; branches: Branch[]; onNavigate: (s: Section) => void }) {
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-6">
        <AppStatCard label="Transactions Today" value={267} sub="+12.5% from yesterday" color="admin" icon={<Assessment />} delay={0} />
        <AppStatCard label="Total Volume (NGN)" value="₦2.34M" sub="+8.3% from yesterday" color="accent" icon={<AccountBalance />} delay={0.08} />
        <AppStatCard label="Avg. Spread Earned" value="1.24%" sub="Across all pairs" color="warning" icon={<TrendingUp />} delay={0.16} />
        <AppStatCard label="Active Staff" value={users.filter((u) => u.status === 'Active').length} sub={`${users.length} total accounts`} color="primary" icon={<People />} delay={0.24} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5">
          <div className="font-bold text-[#1e1b4b] mb-4">Revenue by Branch (Today)</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={branchRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="branch" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => `₦${(v/1000000).toFixed(1)}M`} />
              <RechartsTooltip formatter={(v: number) => [`₦${v.toLocaleString()}`, 'Revenue']} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="revenue" fill="#312e81" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5">
          <div className="font-bold text-[#1e1b4b] mb-4">Transaction Volume (Last 7 Days)</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={volumeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => `₦${(v/1000000).toFixed(1)}M`} />
              <RechartsTooltip formatter={(v: number, n: string) => n === 'volume' ? [`₦${v.toLocaleString()}`, 'Volume'] : [v, 'Transactions']} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Legend />
              <Line type="monotone" dataKey="volume" stroke="#312e81" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="txns" stroke="#16a34a" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flag style={{ color: 'var(--color-danger)', fontSize: 20 }} />
              <span className="font-bold text-[#1e1b4b]">Pending Compliance Reviews</span>
              <AppBadge variant="danger">{transactions.filter((t) => t.status === 'Pending').length}</AppBadge>
            </div>
            <AppButton variant="secondary" size="sm" onClick={() => onNavigate('compliance')}>View All</AppButton>
          </div>
          {transactions.filter((t) => t.status === 'Pending').slice(0, 3).map((t) => (
            <div key={t.id} className="flex items-center justify-between py-3 border-b border-[var(--color-surface-muted)] last:border-0">
              <div>
                <div className="text-sm font-semibold text-[var(--color-text-1)]">{t.customerName}</div>
                <div className="text-xs text-[var(--color-text-3)]">{t.flagReason}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">{t.amount.toLocaleString()} {t.currency}</div>
                <AppBadge variant={t.riskLevel === 'High' ? 'danger' : 'warning'} size="sm">{t.riskLevel}</AppBadge>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="font-bold text-[#1e1b4b]">Branch Status</span>
            <AppButton variant="secondary" size="sm" onClick={() => onNavigate('branches')}>Manage</AppButton>
          </div>
          {branches.map((b) => (
            <div key={b.id} className="flex items-center justify-between py-3 border-b border-[var(--color-surface-muted)] last:border-0">
              <div className="flex items-center gap-2">
                <Circle style={{ fontSize: 10, color: b.status === 'Online' ? 'var(--color-accent)' : 'var(--color-danger)' }} />
                <span className="text-sm font-semibold text-[var(--color-text-1)]">{b.name}</span>
              </div>
              <AppBadge variant={b.float === 'Low' ? 'danger' : b.float === 'Normal' ? 'success' : 'neutral'} size="sm">Float: {b.float}</AppBadge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Users ──────────────────────────────────────────────────────────────────────

function UsersSection({ users, setUsers }: { users: User[]; setUsers: React.Dispatch<React.SetStateAction<User[]>> }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ name: '', username: '', password: '', role: '', branch: '' });
  const reset = () => { setForm({ name: '', username: '', password: '', role: '', branch: '' }); setEditUser(null); setShowPw(false); };
  const openEdit = (u: User) => { setEditUser(u); setForm({ name: u.name, username: u.username, password: '', role: u.role, branch: u.assignedBranch }); setModalOpen(true); };
  const save = () => {
    if (!form.name || !form.username || !form.role || !form.branch) return toast.error('Fill all required fields');
    if (!editUser && !form.password) return toast.error('Password is required');
    if (editUser) {
      setUsers(users.map((u) => u.id === editUser.id ? { ...u, name: form.name, username: form.username, role: form.role, assignedBranch: form.branch } : u));
      toast.success('User updated');
    } else {
      setUsers([...users, { id: `${Date.now()}`, name: form.name, username: form.username, role: form.role, assignedBranch: form.branch, lastActive: 'Never', status: 'Active' }]);
      toast.success(`${form.name} created`);
    }
    setModalOpen(false); reset();
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 className="m-0 font-extrabold text-[#1e1b4b] text-xl">Staff Accounts</h2>
          <p className="m-0 mt-0.5 text-sm text-[var(--color-text-3)]">Create and manage login credentials, roles, and branch access</p>
        </div>
        <AppButton variant="admin" leftIcon={<PersonAdd style={{ fontSize: 18 }} />} onClick={() => { reset(); setModalOpen(true); }}>Create User</AppButton>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <AppStatCard label="Total Staff"     value={users.length}                                              color="admin"   delay={0} />
        <AppStatCard label="Active"          value={users.filter((u) => u.status === 'Active').length}         color="accent"  delay={0.06} />
        <AppStatCard label="Branch Managers" value={users.filter((u) => u.role === 'Branch Manager').length}   color="warning" delay={0.12} />
        <AppStatCard label="Tellers"         value={users.filter((u) => u.role === 'Teller').length}           color="primary" delay={0.18} />
      </div>
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden">
        <TableContainer>
          <Table style={{ minWidth: 780 }}>
            <TableHead>
              <TableRow>
                {['Staff Member', 'Username', 'Role', 'Branch', 'Last Active', 'Status', 'Actions'].map((h, i) => (
                  <TableCell key={h} align={i === 6 ? 'center' : 'left'} className={thCell} style={{ color: 'var(--color-text-3)', borderColor: 'var(--color-border)', background: 'var(--color-bg-subtle)' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u, i) => (
                <TableRow key={u.id} className="hover:bg-[var(--color-surface-subtle)] transition-colors">
                  <TableCell className={tdCell} style={{ borderColor: 'var(--color-border)' }}>
                    <div className="flex items-center gap-3">
                      <Avatar style={{ width: 34, height: 34, fontSize: 12, fontWeight: 700, background: avatarColors[i % avatarColors.length] }}>{getInitials(u.name)}</Avatar>
                      <span className="font-semibold text-[var(--color-text-1)]">{u.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className={tdCell} style={{ borderColor: 'var(--color-border)' }}><span className="font-mono text-[var(--color-text-3)]">{u.username}</span></TableCell>
                  <TableCell className={tdCell} style={{ borderColor: 'var(--color-border)' }}>
                    <AppBadge variant={u.role === 'Teller' ? 'success' : u.role === 'Branch Manager' ? 'warning' : 'admin'} size="sm">{u.role}</AppBadge>
                  </TableCell>
                  <TableCell className={tdCell} style={{ borderColor: 'var(--color-border)' }}>{u.assignedBranch}</TableCell>
                  <TableCell className={tdCell} style={{ borderColor: 'var(--color-border)' }}>{u.lastActive}</TableCell>
                  <TableCell className={tdCell} style={{ borderColor: 'var(--color-border)' }}>
                    <AppBadge variant={u.status === 'Active' ? 'success' : 'danger'} dot size="sm">{u.status}</AppBadge>
                  </TableCell>
                  <TableCell className={tdCell} style={{ borderColor: 'var(--color-border)' }} align="center">
                    <div className="flex gap-1 justify-center">
                      <IconButton size="small" onClick={() => openEdit(u)} style={{ color: '#4f46e5' }}><Edit fontSize="small" /></IconButton>
                      <IconButton size="small" onClick={() => { setUsers(users.map((x) => x.id === u.id ? { ...x, status: x.status === 'Active' ? 'Disabled' : 'Active' } : x)); toast.info(`${u.name} ${u.status === 'Active' ? 'disabled' : 'activated'}`); }} style={{ color: u.status === 'Active' ? 'var(--color-danger)' : 'var(--color-accent)' }}>
                        {u.status === 'Active' ? <Block fontSize="small" /> : <CheckCircle fontSize="small" />}
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Dialog open={modalOpen} onClose={() => { setModalOpen(false); reset(); }} maxWidth="sm" fullWidth PaperProps={{ style: { borderRadius: 'var(--radius-xl)', overflow: 'hidden' } }}>
        <DialogTitle style={{ padding: 0 }}>
          <div className="flex items-center justify-between px-6 py-4" style={{ background: 'linear-gradient(135deg,#312e81,#4c1d95)' }}>
            <div className="flex items-center gap-3">
              {editUser ? <VpnKey style={{ color: 'white' }} /> : <PersonAdd style={{ color: 'white' }} />}
              <div>
                <div className="text-white font-bold text-base leading-none">{editUser ? 'Edit User' : 'Create New User'}</div>
                <div className="text-white/70 text-xs mt-0.5">{editUser ? `Editing ${editUser.name}` : 'Set up staff login credentials'}</div>
              </div>
            </div>
            <IconButton onClick={() => { setModalOpen(false); reset(); }} style={{ color: 'white' }}><Close /></IconButton>
          </div>
        </DialogTitle>
        <DialogContent style={{ padding: '24px' }}>
          <div className="flex flex-col gap-5 mt-2">
            {[
              { label: 'Full Name', key: 'name', icon: <Person style={{ color: '#7c3aed', fontSize: 20 }} />, helper: undefined as string | undefined },
              { label: 'Username', key: 'username', icon: <Person style={{ color: '#7c3aed', fontSize: 20 }} />, helper: 'e.g. john.doe — used to sign in' },
            ].map((f) => (
              <TextField key={f.key} fullWidth label={f.label} value={(form as Record<string, string>)[f.key]}
                onChange={(e) => setForm({ ...form, [f.key]: f.key === 'username' ? e.target.value.toLowerCase().replace(/\s/g, '.') : e.target.value })}
                required helperText={f.helper}
                InputProps={{ startAdornment: <InputAdornment position="start">{f.icon}</InputAdornment> }}
              />
            ))}
            <TextField fullWidth label={editUser ? 'New Password (blank to keep current)' : 'Password'} type={showPw ? 'text' : 'password'}
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editUser}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock style={{ color: '#7c3aed', fontSize: 20 }} /></InputAdornment>,
                endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPw(!showPw)} size="small">{showPw ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}</IconButton></InputAdornment>,
              }}
            />
            {[{ label: 'Role', key: 'role', options: roles }, { label: 'Assigned Branch', key: 'branch', options: branchNames }].map((f) => (
              <FormControl key={f.key} fullWidth required>
                <InputLabel>{f.label}</InputLabel>
                <Select value={(form as Record<string, string>)[f.key]} label={f.label} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}>
                  {f.options.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </Select>
              </FormControl>
            ))}
          </div>
        </DialogContent>
        <DialogActions style={{ padding: '16px 24px 24px', gap: 12 }}>
          <AppButton variant="secondary" onClick={() => { setModalOpen(false); reset(); }}>Cancel</AppButton>
          <AppButton variant="admin" leftIcon={editUser ? <Edit style={{ fontSize: 16 }} /> : <PersonAdd style={{ fontSize: 16 }} />} onClick={save}>{editUser ? 'Save Changes' : 'Create User'}</AppButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

// ─── Branches ───────────────────────────────────────────────────────────────────

function BranchesSection({ branches, setBranches }: { branches: Branch[]; setBranches: React.Dispatch<React.SetStateAction<Branch[]>> }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editBranch, setEditBranch] = useState<Branch | null>(null);
  const [form, setForm] = useState({ name: '', location: '', manager: '' });
  const reset = () => { setForm({ name: '', location: '', manager: '' }); setEditBranch(null); };
  const save = () => {
    if (!form.name || !form.location) return toast.error('Fill all required fields');
    if (editBranch) {
      setBranches(branches.map((b) => b.id === editBranch.id ? { ...b, ...form } : b));
      toast.success('Branch updated');
    } else {
      setBranches([...branches, { id: `${Date.now()}`, ...form, manager: form.manager || 'Unassigned', status: 'Offline', float: 'Unknown', staff: 0 }]);
      toast.success('Branch created');
    }
    setModalOpen(false); reset();
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 className="m-0 font-extrabold text-[#1e1b4b] text-xl">Branch Management</h2>
          <p className="m-0 mt-0.5 text-sm text-[var(--color-text-3)]">Manage all company branch locations</p>
        </div>
        <AppButton variant="primary" leftIcon={<Add style={{ fontSize: 18 }} />} onClick={() => { reset(); setModalOpen(true); }}>Add Branch</AppButton>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {branches.map((b) => (
          <div key={b.id} className="bg-white rounded-[var(--radius-lg)] border p-5 transition-all duration-200 hover:-translate-y-0.5" style={{ borderColor: b.status === 'Online' ? 'var(--color-success-border)' : 'var(--color-danger-border)' }}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: b.status === 'Online' ? 'var(--color-success-bg)' : 'var(--color-danger-bg)' }}>
                  <Business style={{ color: b.status === 'Online' ? 'var(--color-accent)' : 'var(--color-danger)', fontSize: 22 }} />
                </div>
                <div>
                  <div className="font-bold text-[#1e1b4b] text-sm leading-snug">{b.name}</div>
                  <div className="text-xs text-[var(--color-text-3)]">{b.location}</div>
                </div>
              </div>
              <IconButton size="small" onClick={() => { setEditBranch(b); setForm({ name: b.name, location: b.location, manager: b.manager }); setModalOpen(true); }} style={{ color: '#4f46e5' }}><Edit fontSize="small" /></IconButton>
            </div>
            <div className="flex gap-2 flex-wrap mb-4">
              <AppBadge variant={b.status === 'Online' ? 'success' : 'danger'} dot size="sm">{b.status}</AppBadge>
              <AppBadge variant={b.float === 'Low' ? 'danger' : b.float === 'Normal' ? 'success' : 'neutral'} size="sm">Float: {b.float}</AppBadge>
            </div>
            <Divider style={{ margin: '12px 0' }} />
            <div className="flex justify-between">
              <div><div className="text-xs text-[var(--color-text-3)]">Manager</div><div className="text-sm font-semibold">{b.manager}</div></div>
              <div className="text-right"><div className="text-xs text-[var(--color-text-3)]">Staff</div><div className="text-sm font-semibold">{b.staff} members</div></div>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={modalOpen} onClose={() => { setModalOpen(false); reset(); }} maxWidth="sm" fullWidth PaperProps={{ style: { borderRadius: 'var(--radius-xl)', overflow: 'hidden' } }}>
        <DialogTitle style={{ padding: 0 }}>
          <div className="flex items-center justify-between px-6 py-4" style={{ background: 'linear-gradient(135deg,#0369a1,#0284c7)' }}>
            <div className="flex items-center gap-2"><Business style={{ color: 'white' }} /><span className="text-white font-bold text-base">{editBranch ? 'Edit Branch' : 'Add New Branch'}</span></div>
            <IconButton onClick={() => { setModalOpen(false); reset(); }} style={{ color: 'white' }}><Close /></IconButton>
          </div>
        </DialogTitle>
        <DialogContent style={{ padding: '24px' }}>
          <div className="flex flex-col gap-5 mt-2">
            {[{ label: 'Branch Name', key: 'name', required: true }, { label: 'Location / Address', key: 'location', required: true }, { label: 'Branch Manager (optional)', key: 'manager', required: false }].map((f) => (
              <TextField key={f.key} fullWidth label={f.label} value={(form as Record<string, string>)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} required={f.required} />
            ))}
          </div>
        </DialogContent>
        <DialogActions style={{ padding: '16px 24px 24px', gap: 12 }}>
          <AppButton variant="secondary" onClick={() => { setModalOpen(false); reset(); }}>Cancel</AppButton>
          <AppButton variant="primary" onClick={save}>{editBranch ? 'Save Changes' : 'Create Branch'}</AppButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

// ─── Exchange Rates ─────────────────────────────────────────────────────────────

function RatesSection({ rates, setRates }: { rates: ExchangeRate[]; setRates: React.Dispatch<React.SetStateAction<ExchangeRate[]>> }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ pair: '', buy: '', sell: '' });
  const addRate = () => {
    if (!form.pair || !form.buy || !form.sell) return toast.error('Fill all fields');
    const buy = parseFloat(form.buy), sell = parseFloat(form.sell);
    setRates([...rates, { id: `${Date.now()}`, currencyPair: form.pair.toUpperCase(), buyRate: buy, sellRate: sell, spread: parseFloat(((sell - buy) / buy * 100).toFixed(2)), lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' '), status: 'Active' }]);
    toast.success('Rate added'); setModalOpen(false); setForm({ pair: '', buy: '', sell: '' });
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 className="m-0 font-extrabold text-[#1e1b4b] text-xl">Exchange Rate Management</h2>
          <p className="m-0 mt-0.5 text-sm text-[var(--color-text-3)]">Set and push rates to all branch locations</p>
        </div>
        <div className="flex gap-3">
          <AppButton variant="secondary" leftIcon={<Add style={{ fontSize: 18 }} />} onClick={() => setModalOpen(true)}>Add Rate</AppButton>
          <AppButton variant="accent" leftIcon={<CloudUpload style={{ fontSize: 18 }} />} onClick={() => toast.success('Rates pushed to all branches')}>Push to Branches</AppButton>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <AppStatCard label="Total Pairs" value={rates.length} color="admin" delay={0} />
        <AppStatCard label="Active" value={rates.filter((r) => r.status === 'Active').length} color="accent" delay={0.06} />
        <AppStatCard label="Avg Spread" value={`${(rates.reduce((s, r) => s + r.spread, 0) / rates.length).toFixed(2)}%`} color="warning" delay={0.12} />
      </div>
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden">
        <TableContainer>
          <Table style={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                {['Currency Pair', 'Buy Rate', 'Sell Rate', 'Spread', 'Last Updated', 'Status', 'Actions'].map((h, i) => (
                  <TableCell key={h} align={i >= 1 && i <= 3 ? 'right' : i === 6 ? 'center' : 'left'} className={thCell} style={{ color: 'var(--color-text-3)', borderColor: 'var(--color-border)', background: 'var(--color-bg-subtle)' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rates.map((r) => (
                <TableRow key={r.id} className="hover:bg-[var(--color-surface-subtle)] transition-colors">
                  <TableCell className={tdCell} style={{ borderColor: 'var(--color-border)' }}>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: r.status === 'Active' ? 'var(--color-accent)' : 'var(--color-text-4)' }} />
                      <span className="font-bold font-mono" style={{ color: '#312e81' }}>{r.currencyPair}</span>
                    </div>
                  </TableCell>
                  <TableCell className={tdCell} style={{ borderColor: 'var(--color-border)' }} align="right">{r.buyRate.toFixed(r.buyRate >= 100 ? 2 : 4)}</TableCell>
                  <TableCell className={tdCell} style={{ borderColor: 'var(--color-border)' }} align="right">{r.sellRate.toFixed(r.sellRate >= 100 ? 2 : 4)}</TableCell>
                  <TableCell className={tdCell} style={{ borderColor: 'var(--color-border)' }} align="right"><AppBadge variant={r.spread > 1 ? 'warning' : 'success'} size="sm">{r.spread.toFixed(2)}%</AppBadge></TableCell>
                  <TableCell className={tdCell} style={{ borderColor: 'var(--color-border)' }}>{r.lastUpdated}</TableCell>
                  <TableCell className={tdCell} style={{ borderColor: 'var(--color-border)' }}><AppBadge variant={r.status === 'Active' ? 'success' : 'neutral'} dot size="sm">{r.status}</AppBadge></TableCell>
                  <TableCell className={tdCell} style={{ borderColor: 'var(--color-border)' }} align="center">
                    <div className="flex gap-1 justify-center">
                      <IconButton size="small" onClick={() => toast.info(`Edit ${r.currencyPair}`)} style={{ color: '#4f46e5' }}><Edit fontSize="small" /></IconButton>
                      <IconButton size="small" onClick={() => { setRates(rates.filter((x) => x.id !== r.id)); toast.info('Rate removed'); }} style={{ color: 'var(--color-danger)' }}><Delete fontSize="small" /></IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="xs" fullWidth PaperProps={{ style: { borderRadius: 'var(--radius-xl)', overflow: 'hidden' } }}>
        <DialogTitle style={{ padding: 0 }}>
          <div className="flex items-center justify-between px-6 py-4" style={{ background: 'linear-gradient(135deg,#16a34a,#15803d)' }}>
            <div className="flex items-center gap-2"><TrendingUp style={{ color: 'white' }} /><span className="text-white font-bold text-base">Add Exchange Rate</span></div>
            <IconButton onClick={() => setModalOpen(false)} style={{ color: 'white' }}><Close /></IconButton>
          </div>
        </DialogTitle>
        <DialogContent style={{ padding: '24px' }}>
          <div className="flex flex-col gap-5 mt-2">
            <TextField fullWidth label="Currency Pair" placeholder="e.g. USD/CAD" value={form.pair} onChange={(e) => setForm({ ...form, pair: e.target.value })} required />
            <TextField fullWidth label="Buy Rate" type="number" value={form.buy} onChange={(e) => setForm({ ...form, buy: e.target.value })} required />
            <TextField fullWidth label="Sell Rate" type="number" value={form.sell} onChange={(e) => setForm({ ...form, sell: e.target.value })} required />
          </div>
        </DialogContent>
        <DialogActions style={{ padding: '16px 24px 24px', gap: 12 }}>
          <AppButton variant="secondary" onClick={() => setModalOpen(false)}>Cancel</AppButton>
          <AppButton variant="accent" onClick={addRate}>Add Rate</AppButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

// ─── Cash Float ─────────────────────────────────────────────────────────────────

function FloatSection({ floats, setFloats }: { floats: CurrencyFloat[]; setFloats: React.Dispatch<React.SetStateAction<CurrencyFloat[]>> }) {
  const [cashIn, setCashIn] = useState<Record<string, string>>({});
  const [cashOut, setCashOut] = useState<Record<string, string>>({});
  const doIn = (code: string) => { const amt = parseFloat(cashIn[code] || '0'); if (amt > 0) { setFloats(floats.map((f) => f.code === code ? { ...f, currentFloat: f.currentFloat + amt } : f)); setCashIn({ ...cashIn, [code]: '' }); toast.success(`Added ${amt.toLocaleString()} ${code}`); } };
  const doOut = (code: string) => { const amt = parseFloat(cashOut[code] || '0'); if (amt > 0) { setFloats(floats.map((f) => f.code === code ? { ...f, currentFloat: f.currentFloat - amt } : f)); setCashOut({ ...cashOut, [code]: '' }); toast.success(`Removed ${amt.toLocaleString()} ${code}`); } };
  const diff = (f: CurrencyFloat) => parseFloat(f.physicalCount) - f.currentFloat;
  return (
    <div>
      <div className="mb-6">
        <h2 className="m-0 font-extrabold text-[#1e1b4b] text-xl">Cash Float Management</h2>
        <p className="m-0 mt-0.5 text-sm text-[var(--color-text-3)]">Monitor and adjust cash float levels across all currencies</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {floats.map((f) => {
          const low = f.currentFloat < f.lowThreshold;
          return (
            <div key={f.code} className="bg-white rounded-[var(--radius-lg)] border p-5" style={{ borderColor: low ? 'var(--color-danger-border)' : 'var(--color-border)', boxShadow: low ? '0 4px 12px rgba(220,38,38,0.1)' : 'none' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{f.flag}</span>
                  <div>
                    <div className="font-bold text-[#1e1b4b] text-base leading-none">{f.code}</div>
                    <div className="text-xs text-[var(--color-text-3)]">{f.name}</div>
                  </div>
                </div>
                {low && <AppBadge variant="danger" dot><Warning style={{ fontSize: 12 }} /> LOW FLOAT</AppBadge>}
              </div>
              <div className="grid grid-cols-3 gap-3 mb-5 p-3 rounded-[var(--radius-sm)]" style={{ background: low ? 'var(--color-danger-subtle)' : 'var(--color-bg-subtle)' }}>
                {[['Opening', f.openingFloat, 'var(--color-text-3)'], ['Current', f.currentFloat, low ? 'var(--color-danger)' : 'var(--color-accent)'], ['Threshold', f.lowThreshold, 'var(--color-warning-dark)']].map(([lbl, val, col]) => (
                  <div key={lbl as string}>
                    <div className="text-xs text-[var(--color-text-3)]">{lbl}</div>
                    <div className="text-sm font-bold mt-0.5" style={{ color: col as string }}>{(val as number).toLocaleString()}</div>
                  </div>
                ))}
              </div>
              {low && <Alert severity="error" style={{ marginBottom: 12, borderRadius: 'var(--radius-sm)' }}>Float below threshold. Add cash immediately.</Alert>}
              <div className="flex gap-2 mb-2">
                <input type="number" placeholder="Amount" value={cashIn[f.code] || ''} onChange={(e) => setCashIn({ ...cashIn, [f.code]: e.target.value })} className="input-base flex-1 py-2" />
                <AppButton variant="accent" size="sm" leftIcon={<Add style={{ fontSize: 16 }} />} onClick={() => doIn(f.code)}>Cash In</AppButton>
              </div>
              <div className="flex gap-2 mb-4">
                <input type="number" placeholder="Amount" value={cashOut[f.code] || ''} onChange={(e) => setCashOut({ ...cashOut, [f.code]: e.target.value })} className="input-base flex-1 py-2" />
                <AppButton variant="danger" size="sm" leftIcon={<Remove style={{ fontSize: 16 }} />} onClick={() => doOut(f.code)}>Cash Out</AppButton>
              </div>
              <Divider style={{ marginBottom: 12 }} />
              <div className="text-xs font-bold text-[var(--color-text-1)] mb-2">End of Day Reconciliation</div>
              <div className="flex gap-3 items-start">
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--color-text-4)]">{f.code}</span>
                  <input type="number" placeholder="Physical Count" value={f.physicalCount} onChange={(e) => setFloats(floats.map((x) => x.code === f.code ? { ...x, physicalCount: e.target.value } : x))} className="input-base py-2 pl-12" />
                </div>
                <div className="min-w-[100px] p-3 rounded-[var(--radius-sm)] border text-center" style={{ background: 'var(--color-bg-subtle)', borderColor: 'var(--color-border)' }}>
                  <div className="text-xs text-[var(--color-text-3)]">Difference</div>
                  <div className="text-sm font-bold mt-0.5" style={{ color: f.physicalCount ? (diff(f) >= 0 ? 'var(--color-accent)' : 'var(--color-danger)') : 'var(--color-text-4)' }}>
                    {f.physicalCount ? (diff(f) >= 0 ? `+${diff(f).toLocaleString()}` : diff(f).toLocaleString()) : '—'}
                  </div>
                </div>
              </div>
              {f.physicalCount && diff(f) !== 0 && <Alert severity={diff(f) > 0 ? 'success' : 'error'} style={{ marginTop: 8, borderRadius: 'var(--radius-sm)' }}>{diff(f) > 0 ? 'Surplus' : 'Shortage'}: {Math.abs(diff(f)).toLocaleString()} {f.code}</Alert>}
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between flex-wrap gap-4 p-5 rounded-[var(--radius-lg)] text-white" style={{ background: 'linear-gradient(135deg,#1e1b4b,#312e81)' }}>
        <div>
          <div className="font-bold text-lg">Submit End of Day Reconciliation</div>
          <div className="text-white/80 text-sm mt-0.5">Ensure all physical counts are entered before submitting</div>
        </div>
        <AppButton variant="accent" size="lg" leftIcon={<Calculate style={{ fontSize: 20 }} />} onClick={() => { if (floats.every((f) => f.physicalCount)) toast.success('Reconciliation submitted'); else toast.error('Enter all physical counts first'); }}>
          Submit Reconciliation
        </AppButton>
      </div>
    </div>
  );
}

// ─── Compliance ─────────────────────────────────────────────────────────────────

function ComplianceSection({ transactions, setTransactions }: { transactions: FlaggedTransaction[]; setTransactions: React.Dispatch<React.SetStateAction<FlaggedTransaction[]>> }) {
  const [branch, setBranch] = useState('All Branches');
  const filtered = branch === 'All Branches' ? transactions : transactions.filter((t) => t.branch === branch);
  return (
    <div>
      <div className="mb-6">
        <h2 className="m-0 font-extrabold text-[#1e1b4b] text-xl">Compliance Review</h2>
        <p className="m-0 mt-0.5 text-sm text-[var(--color-text-3)]">Review and manage flagged transactions for regulatory compliance</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <AppStatCard label="Pending Review"      value={transactions.filter((t) => t.status === 'Pending').length}             color="warning" delay={0} />
        <AppStatCard label="Under Investigation" value={transactions.filter((t) => t.status === 'Under Investigation').length}  color="danger"  delay={0.06} />
        <AppStatCard label="Approved"            value={transactions.filter((t) => t.status === 'Approved').length}            color="accent"  delay={0.12} />
        <AppStatCard label="Total Flagged"       value={transactions.length}                                                   color="admin"   delay={0.18} />
      </div>
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4 mb-4 flex gap-3 items-center flex-wrap">
        <FormControl size="small" style={{ minWidth: 200 }}>
          <InputLabel>Branch Filter</InputLabel>
          <Select value={branch} label="Branch Filter" onChange={(e) => setBranch(e.target.value)}>
            {branchNames.map((b) => <MenuItem key={b} value={b}>{b}</MenuItem>)}
          </Select>
        </FormControl>
        <AppButton variant="secondary" size="sm" leftIcon={<FilterList style={{ fontSize: 16 }} />}>Apply Filters</AppButton>
        <div className="flex-1" />
        <AppButton variant="accent" size="sm" leftIcon={<FileDownload style={{ fontSize: 16 }} />} onClick={() => toast.success('Generating compliance report...')}>Export Report</AppButton>
      </div>
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden">
        <TableContainer>
          <Table style={{ minWidth: 1000 }}>
            <TableHead>
              <TableRow>
                {['ID', 'Time', 'Branch', 'Teller', 'Customer', 'Amount', 'Ccy', 'Flag Reason', 'Risk', 'Status', 'Actions'].map((h, i) => (
                  <TableCell key={h} align={i === 5 ? 'right' : i === 10 ? 'center' : 'left'} className={thCell} style={{ color: 'var(--color-text-3)', borderColor: 'var(--color-border)', background: 'var(--color-bg-subtle)' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t.id} className="hover:bg-[var(--color-surface-subtle)] transition-colors">
                  <TableCell className={tdCell} style={{ borderColor: 'var(--color-border)' }}><span className="font-bold font-mono text-[var(--color-admin)]">{t.id}</span></TableCell>
                  <TableCell className={tdCell} style={{ borderColor: 'var(--color-border)' }}><span className="text-xs text-[var(--color-text-3)]">{t.timestamp}</span></TableCell>
                  <TableCell className={tdCell} style={{ borderColor: 'var(--color-border)' }}>{t.branch}</TableCell>
                  <TableCell className={tdCell} style={{ borderColor: 'var(--color-border)' }}>{t.teller}</TableCell>
                  <TableCell className={tdCell} style={{ borderColor: 'var(--color-border)' }}><span className="font-semibold">{t.customerName}</span></TableCell>
                  <TableCell className={tdCell} style={{ borderColor: 'var(--color-border)' }} align="right"><span className="font-bold">{t.amount.toLocaleString()}</span></TableCell>
                  <TableCell className={tdCell} style={{ borderColor: 'var(--color-border)' }}><AppBadge variant="neutral" size="sm">{t.currency}</AppBadge></TableCell>
                  <TableCell className={tdCell} style={{ borderColor: 'var(--color-border)' }}><span className="text-xs max-w-[200px] block">{t.flagReason}</span></TableCell>
                  <TableCell className={tdCell} style={{ borderColor: 'var(--color-border)' }}><AppBadge variant={t.riskLevel === 'High' ? 'danger' : t.riskLevel === 'Medium' ? 'warning' : 'info'} size="sm">{t.riskLevel}</AppBadge></TableCell>
                  <TableCell className={tdCell} style={{ borderColor: 'var(--color-border)' }}><AppBadge variant={t.status === 'Pending' ? 'warning' : t.status === 'Approved' ? 'success' : 'danger'} dot size="sm">{t.status}</AppBadge></TableCell>
                  <TableCell className={tdCell} style={{ borderColor: 'var(--color-border)' }} align="center">
                    {t.status === 'Pending' ? (
                      <div className="flex gap-1 justify-center">
                        <AppButton variant="accent" size="sm" onClick={() => { setTransactions(transactions.map((x) => x.id === t.id ? { ...x, status: 'Approved' } : x)); toast.success(`${t.id} approved`); }}>Approve</AppButton>
                        <AppButton variant="secondary" size="sm" onClick={() => { setTransactions(transactions.map((x) => x.id === t.id ? { ...x, status: 'Under Investigation' } : x)); toast.info(`${t.id} under investigation`); }}>Investigate</AppButton>
                      </div>
                    ) : <span className="text-xs text-[var(--color-text-3)]">{t.status === 'Approved' ? 'Cleared' : 'In Review'}</span>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

// ─── Settings ───────────────────────────────────────────────────────────────────

function SettingsSection() {
  const [settings, setSettings] = useState({ companyName: 'Saucam Pro', cbnThreshold: '10000', sessionTimeout: '30', maintenanceMode: false, twoFactor: true, auditLogs: true });
  return (
    <div>
      <div className="mb-6">
        <h2 className="m-0 font-extrabold text-[#1e1b4b] text-xl">System Settings</h2>
        <p className="m-0 mt-0.5 text-sm text-[var(--color-text-3)]">Configure global system parameters and security settings</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5">
          <div className="flex items-center gap-2 mb-5 font-bold text-[#1e1b4b]"><Business style={{ color: 'var(--color-primary)', fontSize: 20 }} /> Company Information</div>
          <div className="flex flex-col gap-4">
            <TextField fullWidth label="Company Name" value={settings.companyName} onChange={(e) => setSettings({ ...settings, companyName: e.target.value })} />
            <TextField fullWidth label="CBN Reporting Threshold (USD)" type="number" value={settings.cbnThreshold} onChange={(e) => setSettings({ ...settings, cbnThreshold: e.target.value })} helperText="Transactions above this amount are auto-flagged" />
            <TextField fullWidth label="Session Timeout (minutes)" type="number" value={settings.sessionTimeout} onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })} />
          </div>
        </div>
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5">
          <div className="flex items-center gap-2 mb-5 font-bold text-[#1e1b4b]"><Shield style={{ color: 'var(--color-primary)', fontSize: 20 }} /> Security & Access</div>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Maintenance Mode', sub: 'Temporarily disable staff login access', key: 'maintenanceMode', danger: true },
              { label: 'Two-Factor Authentication', sub: 'Require 2FA for admin portal access', key: 'twoFactor', danger: false },
              { label: 'Audit Logs', sub: 'Log all admin actions for compliance', key: 'auditLogs', danger: false },
            ].map((toggle) => {
              const on = settings[toggle.key as keyof typeof settings] as boolean;
              return (
                <div key={toggle.key} className="flex items-center justify-between p-3 rounded-[var(--radius-sm)] border" style={{ borderColor: toggle.danger && on ? 'var(--color-danger-border)' : 'var(--color-border)', background: toggle.danger && on ? 'var(--color-danger-subtle)' : 'var(--color-bg-subtle)' }}>
                  <div>
                    <div className="text-sm font-bold" style={{ color: toggle.danger && on ? 'var(--color-danger)' : 'var(--color-text-1)' }}>{toggle.label}</div>
                    <div className="text-xs text-[var(--color-text-3)]">{toggle.sub}</div>
                  </div>
                  <div onClick={() => setSettings({ ...settings, [toggle.key]: !on })} className="w-11 h-6 rounded-full cursor-pointer relative transition-colors duration-200 flex-shrink-0" style={{ background: on ? (toggle.danger ? 'var(--color-danger)' : 'var(--color-primary)') : 'var(--color-border-strong)' }}>
                    <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-200" style={{ left: on ? 22 : 2, boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5">
          <div className="flex items-center gap-2 mb-5 font-bold text-[#1e1b4b]"><VpnKey style={{ color: 'var(--color-primary)', fontSize: 20 }} /> Change Admin Password</div>
          <div className="flex flex-col gap-4">
            <TextField fullWidth type="password" label="Current Password" />
            <TextField fullWidth type="password" label="New Password" />
            <TextField fullWidth type="password" label="Confirm New Password" />
            <AppButton variant="admin" fullWidth onClick={() => toast.success('Admin password updated')}>Update Password</AppButton>
          </div>
        </div>
        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 flex flex-col justify-between">
          <div>
            <div className="font-bold text-[#1e1b4b] mb-2">Save Configuration</div>
            <p className="text-sm text-[var(--color-text-3)] mb-4">All changes are applied company-wide immediately upon saving.</p>
            <Alert severity="info" style={{ borderRadius: 'var(--radius-sm)', marginBottom: 16 }}>Changes to company settings take effect across all branches.</Alert>
          </div>
          <AppButton variant="accent" size="lg" fullWidth onClick={() => toast.success('Settings saved successfully')}>Save All Settings</AppButton>
        </div>
      </div>
    </div>
  );
}
