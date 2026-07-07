import { useState, useEffect } from 'react';
import { type PasswordResetRequest, RESET_REQUESTS_KEY } from './LoginScreen';
import { type StaffUser, getUsers, persistUsers } from '../userStore';
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
  Lock, Person, Email, Visibility, VisibilityOff, VpnKey,
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
type User = StaffUser;
interface ExchangeRate { id: string; currencyPair: string; buyRate: number; sellRate: number; spread: number; lastUpdated: string; status: 'Active' | 'Inactive'; }
interface Branch { id: string; name: string; location: string; manager: string; status: 'Online' | 'Offline'; float: 'Normal' | 'Low' | 'Unknown'; staff: number; }
interface CurrencyFloat { code: string; name: string; flag: string; openingFloat: number; currentFloat: number; lowThreshold: number; physicalCount: string; }
interface FlaggedTransaction { id: string; timestamp: string; branch: string; teller: string; customerName: string; amount: number; currency: string; flagReason: string; status: 'Pending' | 'Approved' | 'Under Investigation'; riskLevel: 'High' | 'Medium' | 'Low'; }

// ─── Mock Data ──────────────────────────────────────────────────────────────────
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [users, setUsers] = useState<User[]>(() => getUsers());
  const [rates, setRates] = useState<ExchangeRate[]>(initRates);
  const [branches, setBranches] = useState<Branch[]>(initBranches);
  const [floats, setFloats] = useState<CurrencyFloat[]>(initFloats);
  const [transactions, setTransactions] = useState<FlaggedTransaction[]>(initTransactions);
  const [countries, setCountries] = useState<Country[]>(() => {
    try {
      const raw = localStorage.getItem('saucam_countries_v1');
      if (raw) return JSON.parse(raw) as Country[];
    } catch {}
    return initCountries;
  });
  const [resetRequests, setResetRequests] = useState<PasswordResetRequest[]>([]);
  const pendingFlags = transactions.filter((t) => t.status === 'Pending').length;
  const pendingResets = resetRequests.filter((r) => r.status === 'Pending').length;

  // Persist users and countries to localStorage whenever they change
  useEffect(() => { persistUsers(users); }, [users]);
  useEffect(() => { localStorage.setItem('saucam_countries_v1', JSON.stringify(countries)); }, [countries]);

  // Load reset requests from localStorage on mount and whenever the tab becomes visible
  useEffect(() => {
    const load = () => {
      const raw = localStorage.getItem(RESET_REQUESTS_KEY);
      if (raw) setResetRequests(JSON.parse(raw));
    };
    load();
    window.addEventListener('focus', load);
    return () => window.removeEventListener('focus', load);
  }, []);

  const navItems: NavItem[] = [
    { id: 'overview',   label: 'Overview',          icon: <Dashboard /> },
    { id: 'users',      label: 'User Management',   icon: <People /> },
    { id: 'branches',   label: 'Countries & Agents', icon: <Business /> },
    { id: 'rates',      label: 'Exchange Rates',    icon: <TrendingUp /> },
    { id: 'float',      label: 'Cash Float',        icon: <AccountBalance /> },
    { id: 'compliance', label: 'Compliance',        icon: <Flag />, badge: pendingFlags },
    { id: 'settings',   label: 'System Settings',   icon: <Settings /> },
  ];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f0f2f8' }}>
      <Toaster position="top-right" richColors />

      {/* Mobile nav overlay */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-40 flex md:hidden"
          onClick={() => setMobileNavOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative flex flex-col w-64 h-full overflow-hidden"
            style={{ background: 'linear-gradient(180deg,#1e1b4b 0%,#312e81 60%,#4c1d95 100%)', zIndex: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile nav logo */}
            <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <Shield style={{ color: 'white', fontSize: 20 }} />
              </div>
              <div>
                <div className="text-white font-extrabold text-base leading-none">Saucam Pro</div>
                <div className="text-white/55 text-[10px] uppercase tracking-widest mt-0.5">Admin Portal</div>
              </div>
            </div>
            {/* Mobile nav items */}
            <div className="flex-1 py-3 overflow-y-auto">
              {navItems.map((item) => {
                const active = section === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => { setSection(item.id); setMobileNavOpen(false); }}
                    className="flex items-center mx-2 mb-1 rounded-lg cursor-pointer transition-all duration-150 relative"
                    style={{ gap: 10, padding: '10px 14px', background: active ? 'rgba(255,255,255,0.18)' : 'transparent', borderLeft: active ? '3px solid #a78bfa' : '3px solid transparent' }}
                  >
                    <span style={{ color: active ? '#c4b5fd' : 'rgba(255,255,255,0.65)', display: 'flex', flexShrink: 0 }}>{item.icon}</span>
                    <span className="flex-1 text-sm" style={{ color: active ? 'white' : 'rgba(255,255,255,0.75)', fontWeight: active ? 700 : 500 }}>{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="flex items-center justify-center text-white rounded-full text-[10px] font-bold" style={{ background: '#ef4444', minWidth: 18, height: 18, padding: '0 4px' }}>{item.badge}</span>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="p-3 border-t border-white/10">
              <div onClick={onLogout} className="flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer transition-colors duration-150 hover:bg-red-500/20" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <Logout style={{ fontSize: 20 }} />
                <span className="text-sm font-medium">Sign Out</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div
        className="hidden md:flex flex-col overflow-hidden flex-shrink-0"
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
        <div className="bg-white px-3 md:px-6 py-3 flex items-center justify-between flex-shrink-0 border-b border-[var(--color-border)]" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <div className="flex items-center gap-2 min-w-0">
            {/* Mobile hamburger */}
            <IconButton
              size="small"
              className="flex md:hidden"
              onClick={() => setMobileNavOpen(true)}
              style={{ color: '#1e1b4b', flexShrink: 0 }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </IconButton>
            <div className="min-w-0">
              <div className="font-extrabold text-[#1e1b4b] text-base md:text-xl leading-none truncate">{navItems.find((n) => n.id === section)?.label}</div>
              <div className="text-xs text-[var(--color-text-3)] mt-0.5 hidden sm:block">{new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <div className="relative" onClick={() => setSection('users')} style={{ cursor: 'pointer' }}>
              <IconButton size="small"><Notifications style={{ fontSize: 18, color: pendingResets > 0 ? 'var(--color-admin)' : 'var(--color-text-3)' }} /></IconButton>
              {pendingResets > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center text-white rounded-full text-[9px] font-bold" style={{ background: '#ef4444', minWidth: 16, height: 16, padding: '0 3px' }}>{pendingResets}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Avatar style={{ width: 34, height: 34, background: '#312e81', fontSize: 13, fontWeight: 700 }}>SA</Avatar>
              <div className="hidden sm:block">
                <div className="text-sm font-bold leading-none text-[#1e1b4b]">System Admin</div>
                <div className="text-xs font-semibold text-[var(--color-admin)]">Administrator</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-3 md:p-6">
          {section === 'overview'   && <OverviewSection users={users} transactions={transactions} branches={branches} onNavigate={setSection} />}
          {section === 'users'      && <UsersSection users={users} setUsers={setUsers} resetRequests={resetRequests} setResetRequests={setResetRequests} countries={countries} />}
          {section === 'branches'   && <BranchesSection branches={branches} setBranches={setBranches} countries={countries} setCountries={setCountries} />}
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
          <ResponsiveContainer width="100%" height={180} className="md:!h-[220px]">
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
          <ResponsiveContainer width="100%" height={180} className="md:!h-[220px]">
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

function UsersSection({ users, setUsers, resetRequests, setResetRequests, countries }: {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  resetRequests: PasswordResetRequest[];
  setResetRequests: React.Dispatch<React.SetStateAction<PasswordResetRequest[]>>;
  countries: Country[];
}) {
  const resolveReset = (id: string) => {
    const updated = resetRequests.map((r) => r.id === id ? { ...r, status: 'Resolved' as const } : r);
    setResetRequests(updated);
    localStorage.setItem(RESET_REQUESTS_KEY, JSON.stringify(updated));
    toast.success('Request marked as resolved. Contact the staff member with their new password.');
  };
  const dismissReset = (id: string) => {
    const updated = resetRequests.filter((r) => r.id !== id);
    setResetRequests(updated);
    localStorage.setItem(RESET_REQUESTS_KEY, JSON.stringify(updated));
    toast.info('Request dismissed');
  };
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', role: '', country: '', branch: '' });
  const reset = () => { setForm({ name: '', username: '', email: '', password: '', role: '', country: '', branch: '' }); setEditUser(null); setShowPw(false); };
  const openEdit = (u: User) => {
    setEditUser(u);
    setForm({ name: u.name, username: u.username, email: u.email, password: '', role: u.role, country: u.assignedCountry, branch: u.assignedBranch });
    setModalOpen(true);
  };
  const countryBranches = (countryName: string): string[] => {
    if (countryName === 'All Countries') return ['All Branches'];
    const c = countries.find((x) => x.name === countryName);
    const branches = c ? c.agents.map((a) => a.name) : [];
    return ['All Branches', ...branches];
  };
  const save = () => {
    if (!form.name || !form.username || !form.role) return toast.error('Name, username and role are required');
    if (!editUser && !form.password) return toast.error('Password is required for new users');
    if (editUser) {
      setUsers(users.map((u) => u.id === editUser.id ? {
        ...u,
        name: form.name,
        username: form.username,
        email: form.email,
        role: form.role as User['role'],
        assignedCountry: form.country,
        assignedBranch: form.branch,
        ...(form.password ? { password: form.password } : {}),
      } : u));
      toast.success('User updated');
    } else {
      const newUser: User = {
        id: `${Date.now()}`,
        name: form.name,
        username: form.username,
        email: form.email || `${form.username}@saucam.com`,
        password: form.password,
        role: form.role as User['role'],
        assignedCountry: form.country || 'All Countries',
        assignedBranch: form.branch || 'All Branches',
        lastActive: 'Never',
        status: 'Active',
      };
      setUsers([...users, newUser]);
      toast.success(`${form.name} created — can now log in with username "${form.username}"`);
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
        <TableContainer sx={{ overflowX: 'auto' }}>
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
      {/* Password Reset Requests */}
      {resetRequests.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <Lock style={{ color: 'var(--color-danger)', fontSize: 20 }} />
            <span className="font-bold text-[#1e1b4b] text-base">Password Reset Requests</span>
            {resetRequests.filter((r) => r.status === 'Pending').length > 0 && (
              <AppBadge variant="danger">{resetRequests.filter((r) => r.status === 'Pending').length} Pending</AppBadge>
            )}
          </div>
          <div className="flex flex-col gap-3">
            {resetRequests.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between gap-4 p-4 rounded-[var(--radius-lg)] border"
                style={{
                  background: req.status === 'Pending' ? 'var(--color-danger-subtle)' : 'var(--color-bg-subtle)',
                  borderColor: req.status === 'Pending' ? 'var(--color-danger-border)' : 'var(--color-border)',
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: req.status === 'Pending' ? 'var(--color-danger-bg)' : 'var(--color-surface-muted)' }}>
                    <Lock style={{ fontSize: 16, color: req.status === 'Pending' ? 'var(--color-danger)' : 'var(--color-text-3)' }} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm truncate" style={{ color: 'var(--color-text-1)' }}>
                      <span className="font-mono">{req.username}</span> — <span className="font-normal">{req.email}</span>
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-3)' }}>Requested: {req.requestedAt} · {req.id}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <AppBadge variant={req.status === 'Pending' ? 'danger' : 'success'} dot size="sm">{req.status}</AppBadge>
                  {req.status === 'Pending' && (
                    <>
                      <AppButton variant="accent" size="sm" leftIcon={<CheckCircle style={{ fontSize: 14 }} />} onClick={() => resolveReset(req.id)}>Resolve</AppButton>
                      <AppButton variant="secondary" size="sm" onClick={() => dismissReset(req.id)}>Dismiss</AppButton>
                    </>
                  )}
                  {req.status === 'Resolved' && (
                    <AppButton variant="secondary" size="sm" onClick={() => dismissReset(req.id)}>Clear</AppButton>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
          <div className="flex flex-col gap-4 mt-2">
            <TextField fullWidth label="Full Name" value={form.name} required
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              InputProps={{ startAdornment: <InputAdornment position="start"><Person style={{ color: '#7c3aed', fontSize: 20 }} /></InputAdornment> }}
            />
            <TextField fullWidth label="Username" value={form.username} required
              helperText="e.g. john.doe — used to sign in"
              onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/\s/g, '.') })}
              InputProps={{ startAdornment: <InputAdornment position="start"><Person style={{ color: '#7c3aed', fontSize: 20 }} /></InputAdornment> }}
            />
            <TextField fullWidth label="Email Address" value={form.email} type="email"
              helperText="Leave blank to auto-generate @saucam.com"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              InputProps={{ startAdornment: <InputAdornment position="start"><Email style={{ color: '#7c3aed', fontSize: 20 }} /></InputAdornment> }}
            />
            <TextField fullWidth label={editUser ? 'New Password (blank to keep current)' : 'Password'} type={showPw ? 'text' : 'password'}
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editUser}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock style={{ color: '#7c3aed', fontSize: 20 }} /></InputAdornment>,
                endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPw(!showPw)} size="small">{showPw ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}</IconButton></InputAdornment>,
              }}
            />
            <FormControl fullWidth required>
              <InputLabel>Role</InputLabel>
              <Select value={form.role} label="Role" onChange={(e) => setForm({ ...form, role: e.target.value })}>
                {roles.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel>Assigned Country</InputLabel>
              <Select value={form.country} label="Assigned Country" onChange={(e) => setForm({ ...form, country: e.target.value, branch: '' })}>
                <MenuItem value="All Countries">All Countries</MenuItem>
                {ALL_COUNTRIES.map((c) => (
                  <MenuItem key={c.code} value={c.name}>
                    <span className="flex items-center gap-2">
                      <img src={`https://flagcdn.com/w20/${c.code.toLowerCase()}.png`} alt="" style={{ width: 20, height: 14, objectFit: 'cover', borderRadius: 2 }} />
                      {c.name}
                    </span>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel>Assigned Branch / Agent</InputLabel>
              <Select value={form.branch} label="Assigned Branch / Agent" onChange={(e) => setForm({ ...form, branch: e.target.value })} disabled={!form.country}>
                {countryBranches(form.country).map((b) => <MenuItem key={b} value={b}>{b}</MenuItem>)}
              </Select>
            </FormControl>
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

// ─── Countries & Agents ─────────────────────────────────────────────────────────

interface Agent { id: string; name: string; type: 'Branch' | 'Agent'; address: string; manager: string; status: 'Active' | 'Inactive'; float: 'Normal' | 'Low' | 'Unknown'; staff: number; }
interface Country { code: string; name: string; flag: string; agents: Agent[]; }

const ALL_COUNTRIES: { code: string; name: string; flag: string }[] = [
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' }, { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'US', name: 'United States', flag: '🇺🇸' }, { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' }, { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' }, { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' }, { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' }, { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' }, { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮' }, { code: 'PL', name: 'Poland', flag: '🇵🇱' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' }, { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' }, { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' }, { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'IN', name: 'India', flag: '🇮🇳' }, { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰' }, { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' }, { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦' }, { code: 'KW', name: 'Kuwait', flag: '🇰🇼' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' }, { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪' }, { code: 'ET', name: 'Ethiopia', flag: '🇪🇹' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿' }, { code: 'UG', name: 'Uganda', flag: '🇺🇬' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳' }, { code: 'CI', name: "Côte d'Ivoire", flag: '🇨🇮' },
  { code: 'CM', name: 'Cameroon', flag: '🇨🇲' }, { code: 'BJ', name: 'Benin', flag: '🇧🇯' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬' }, { code: 'NE', name: 'Niger', flag: '🇳🇪' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱' }, { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' }, { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' }, { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱' }, { code: 'PE', name: 'Peru', flag: '🇵🇪' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' }, { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' }, { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' }, { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩' }, { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰' },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵' }, { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦' }, { code: 'DZ', name: 'Algeria', flag: '🇩🇿' },
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳' }, { code: 'LY', name: 'Libya', flag: '🇱🇾' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺' }, { code: 'UA', name: 'Ukraine', flag: '🇺🇦' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷' }, { code: 'GR', name: 'Greece', flag: '🇬🇷' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹' }, { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺' }, { code: 'RO', name: 'Romania', flag: '🇷🇴' },
];

const initCountries: Country[] = [
  {
    code: 'NG', name: 'Nigeria', flag: '🇳🇬',
    agents: [
      { id: 'ng1', name: 'Downtown Main Office', type: 'Branch', address: 'Lagos Island, Lagos', manager: 'Adebayo Tunde', status: 'Active', float: 'Normal', staff: 8 },
      { id: 'ng2', name: 'Victoria Island Branch', type: 'Branch', address: 'Adeola Odeku St, VI', manager: 'Ngozi Eze', status: 'Active', float: 'Normal', staff: 6 },
      { id: 'ng3', name: 'Lekki Branch', type: 'Branch', address: 'Admiralty Way, Lekki', manager: 'Chioma Nwosu', status: 'Active', float: 'Low', staff: 5 },
    ],
  },
  {
    code: 'GB', name: 'United Kingdom', flag: '🇬🇧',
    agents: [
      { id: 'gb1', name: 'London Agent', type: 'Agent', address: 'Peckham High St, London SE15', manager: 'Taiwo Adeleke', status: 'Active', float: 'Normal', staff: 3 },
    ],
  },
];

function BranchesSection({ branches: _b, setBranches: _sb, countries, setCountries }: { branches: Branch[]; setBranches: React.Dispatch<React.SetStateAction<Branch[]>>; countries: Country[]; setCountries: React.Dispatch<React.SetStateAction<Country[]>> }) {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editAgent, setEditAgent] = useState<Agent | null>(null);
  const [addCountryOpen, setAddCountryOpen] = useState(false);
  const [selectedNewCountry, setSelectedNewCountry] = useState('');
  const [form, setForm] = useState({ name: '', type: 'Branch' as 'Branch' | 'Agent', address: '', manager: '' });
  const resetForm = () => { setForm({ name: '', type: 'Branch', address: '', manager: '' }); setEditAgent(null); };

  const filteredCountries = ALL_COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase())
  );
  const activeCountries = countries.filter((c) => c.agents.length > 0);
  const totalAgents = countries.reduce((s, c) => s + c.agents.length, 0);

  const openAddAgent = () => { resetForm(); setModalOpen(true); };
  const openEditAgent = (a: Agent) => { setEditAgent(a); setForm({ name: a.name, type: a.type, address: a.address, manager: a.manager }); setModalOpen(true); };

  const saveAgent = () => {
    if (!form.name || !form.address) return toast.error('Fill all required fields');
    if (!selectedCountry) return;
    if (editAgent) {
      setCountries(countries.map((c) => c.code === selectedCountry.code
        ? { ...c, agents: c.agents.map((a) => a.id === editAgent.id ? { ...a, ...form } : a) }
        : c));
      setSelectedCountry((prev) => prev ? { ...prev, agents: prev.agents.map((a) => a.id === editAgent!.id ? { ...a, ...form } : a) } : prev);
      toast.success('Updated successfully');
    } else {
      const newAgent: Agent = { id: `${Date.now()}`, ...form, status: 'Active', float: 'Unknown', staff: 0 };
      setCountries(countries.map((c) => c.code === selectedCountry.code ? { ...c, agents: [...c.agents, newAgent] } : c));
      setSelectedCountry((prev) => prev ? { ...prev, agents: [...prev.agents, newAgent] } : prev);
      toast.success(`${form.type} added to ${selectedCountry.name}`);
    }
    setModalOpen(false); resetForm();
  };

  const deleteAgent = (agentId: string) => {
    if (!selectedCountry) return;
    setCountries(countries.map((c) => c.code === selectedCountry.code ? { ...c, agents: c.agents.filter((a) => a.id !== agentId) } : c));
    setSelectedCountry((prev) => prev ? { ...prev, agents: prev.agents.filter((a) => a.id !== agentId) } : prev);
    toast.info('Removed');
  };

  const addCountry = () => {
    if (!selectedNewCountry) return toast.error('Select a country');
    if (countries.find((c) => c.code === selectedNewCountry)) return toast.error('Country already added');
    const meta = ALL_COUNTRIES.find((c) => c.code === selectedNewCountry)!;
    setCountries([...countries, { ...meta, agents: [] }]);
    toast.success(`${meta.name} added`);
    setAddCountryOpen(false); setSelectedNewCountry('');
  };

  // ── Country detail view ──
  if (selectedCountry) {
    const live = countries.find((c) => c.code === selectedCountry.code) ?? selectedCountry;
    return (
      <div>
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <button onClick={() => setSelectedCountry(null)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] border bg-white cursor-pointer text-sm font-semibold transition-all hover:-translate-x-0.5" style={{ borderColor: 'var(--color-border)', color: 'var(--color-primary)' }}>
            <ChevronLeft style={{ fontSize: 18 }} /> All Countries
          </button>
          <div className="flex items-center gap-2">
            <img src={`https://flagcdn.com/w40/${live.code.toLowerCase()}.png`} alt={live.name} style={{ width: 40, height: 27, objectFit: 'cover', borderRadius: 4, boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }} />
            <div>
              <h2 className="m-0 font-extrabold text-[#1e1b4b] text-xl leading-none">{live.name}</h2>
              <p className="m-0 mt-0.5 text-sm text-[var(--color-text-3)]">{live.agents.length} branch{live.agents.length !== 1 ? 'es' : ''} / agent{live.agents.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className="ml-auto">
            <AppButton variant="primary" leftIcon={<Add style={{ fontSize: 18 }} />} onClick={openAddAgent}>Add Branch / Agent</AppButton>
          </div>
        </div>

        {live.agents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <img src={`https://flagcdn.com/w80/${live.code.toLowerCase()}.png`} alt={live.name} style={{ width: 80, height: 54, objectFit: 'cover', borderRadius: 8, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }} />
            <div className="font-bold text-[#1e1b4b] text-lg mb-1">No branches or agents yet</div>
            <p className="text-sm text-[var(--color-text-3)] mb-4">Add your first branch or agent in {live.name}</p>
            <AppButton variant="primary" leftIcon={<Add style={{ fontSize: 18 }} />} onClick={openAddAgent}>Add Branch / Agent</AppButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {live.agents.map((a) => (
              <div key={a.id} className="bg-white rounded-[var(--radius-lg)] border p-5 transition-all duration-200 hover:-translate-y-0.5" style={{ borderColor: a.status === 'Active' ? 'var(--color-success-border)' : 'var(--color-danger-border)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: a.type === 'Branch' ? 'var(--color-primary-subtle)' : 'var(--color-admin-subtle)' }}>
                      <Business style={{ fontSize: 20, color: a.type === 'Branch' ? 'var(--color-primary)' : 'var(--color-admin)' }} />
                    </div>
                    <div>
                      <div className="font-bold text-[#1e1b4b] text-sm leading-snug">{a.name}</div>
                      <div className="text-xs text-[var(--color-text-3)] mt-0.5">{a.address}</div>
                    </div>
                  </div>
                  <div className="flex gap-0.5 flex-shrink-0">
                    <IconButton size="small" onClick={() => openEditAgent(a)} style={{ color: '#4f46e5' }}><Edit fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => deleteAgent(a.id)} style={{ color: 'var(--color-danger)' }}><Delete fontSize="small" /></IconButton>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap mb-3">
                  <AppBadge variant={a.type === 'Branch' ? 'primary' : 'admin'} size="sm">{a.type}</AppBadge>
                  <AppBadge variant={a.status === 'Active' ? 'success' : 'danger'} dot size="sm">{a.status}</AppBadge>
                  {a.float === 'Low' && <AppBadge variant="warning" size="sm">Low Float</AppBadge>}
                </div>
                <Divider style={{ margin: '10px 0' }} />
                <div className="flex justify-between text-sm">
                  <div><div className="text-xs text-[var(--color-text-3)]">Manager</div><div className="font-semibold">{a.manager || 'Unassigned'}</div></div>
                  <div className="text-right"><div className="text-xs text-[var(--color-text-3)]">Staff</div><div className="font-semibold">{a.staff} members</div></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Agent Modal */}
        <Dialog open={modalOpen} onClose={() => { setModalOpen(false); resetForm(); }} maxWidth="sm" fullWidth PaperProps={{ style: { borderRadius: 'var(--radius-xl)', overflow: 'hidden' } }}>
          <DialogTitle style={{ padding: 0 }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ background: 'linear-gradient(135deg,#1e3a8a,#1e40af)' }}>
              <div className="flex items-center gap-2">
                <img src={`https://flagcdn.com/w20/${live.code.toLowerCase()}.png`} alt={live.name} style={{ width: 28, height: 19, objectFit: 'cover', borderRadius: 3 }} />
                <div>
                  <div className="text-white font-bold text-base leading-none">{editAgent ? 'Edit' : 'Add'} Branch / Agent</div>
                  <div className="text-white/70 text-xs mt-0.5">{live.name}</div>
                </div>
              </div>
              <IconButton onClick={() => { setModalOpen(false); resetForm(); }} style={{ color: 'white' }}><Close /></IconButton>
            </div>
          </DialogTitle>
          <DialogContent style={{ padding: '24px' }}>
            <div className="flex flex-col gap-4 mt-2">
              <FormControl fullWidth required>
                <InputLabel>Type</InputLabel>
                <Select value={form.type} label="Type" onChange={(e) => setForm({ ...form, type: e.target.value as 'Branch' | 'Agent' })}>
                  <MenuItem value="Branch">Branch</MenuItem>
                  <MenuItem value="Agent">Agent</MenuItem>
                </Select>
              </FormControl>
              <TextField fullWidth required label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. London Peckham Branch" />
              <TextField fullWidth required label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Full street address" />
              <TextField fullWidth label="Manager (optional)" value={form.manager} onChange={(e) => setForm({ ...form, manager: e.target.value })} />
            </div>
          </DialogContent>
          <DialogActions style={{ padding: '16px 24px 24px', gap: 10 }}>
            <AppButton variant="secondary" onClick={() => { setModalOpen(false); resetForm(); }}>Cancel</AppButton>
            <AppButton variant="primary" onClick={saveAgent}>{editAgent ? 'Save Changes' : `Add ${form.type}`}</AppButton>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  // ── Countries list view ──
  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 className="m-0 font-extrabold text-[#1e1b4b] text-xl">Countries & Agents</h2>
          <p className="m-0 mt-0.5 text-sm text-[var(--color-text-3)]">Manage branches and agents by country</p>
        </div>
        <AppButton variant="primary" leftIcon={<Add style={{ fontSize: 18 }} />} onClick={() => setAddCountryOpen(true)}>Add Country</AppButton>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <AppStatCard label="Active Countries" value={activeCountries.length} color="primary" delay={0} />
        <AppStatCard label="Total Branches/Agents" value={totalAgents} color="accent" delay={0.06} />
        <AppStatCard label="Countries Available" value={ALL_COUNTRIES.length} color="admin" delay={0.12} />
      </div>

      {/* Active countries with agents */}
      {activeCountries.length > 0 && (
        <div className="mb-8">
          <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-3)' }}>Active Countries ({activeCountries.length})</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeCountries.map((c) => (
              <div
                key={c.code}
                onClick={() => setSelectedCountry(c)}
                className="bg-white rounded-[var(--radius-lg)] border p-4 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                style={{ borderColor: 'var(--color-primary-subtle)', boxShadow: 'var(--shadow-sm)' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <img src={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png`} alt={c.name} style={{ width: 36, height: 24, objectFit: 'cover', borderRadius: 4, flexShrink: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }} />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[#1e1b4b] truncate">{c.name}</div>
                    <div className="text-xs text-[var(--color-text-3)]">{c.code}</div>
                  </div>
                  <ChevronRight style={{ fontSize: 18, color: 'var(--color-text-4)' }} />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <AppBadge variant="success" dot size="sm">{c.agents.length} location{c.agents.length !== 1 ? 's' : ''}</AppBadge>
                  <AppBadge variant="primary" size="sm">{c.agents.filter((a) => a.type === 'Branch').length} branch{c.agents.filter((a) => a.type === 'Branch').length !== 1 ? 'es' : ''}</AppBadge>
                  {c.agents.filter((a) => a.type === 'Agent').length > 0 && <AppBadge variant="admin" size="sm">{c.agents.filter((a) => a.type === 'Agent').length} agent{c.agents.filter((a) => a.type === 'Agent').length !== 1 ? 's' : ''}</AppBadge>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All countries searchable list */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-3)' }}>All Countries — Click to Set Up</div>
        <div className="relative mb-4">
          <span className="pointer-events-none" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', zIndex: 1 }}>
            <Search style={{ fontSize: 18, color: 'var(--color-text-4)' }} />
          </span>
          <input
            type="text"
            placeholder="Search countries…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-base w-full"
            style={{ paddingLeft: 40 }}
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {filteredCountries.map((c) => {
            const existing = countries.find((x) => x.code === c.code);
            const count = existing?.agents.length ?? 0;
            return (
              <div
                key={c.code}
                onClick={() => {
                  if (existing) { setSelectedCountry(existing); }
                  else { setCountries([...countries, { ...c, agents: [] }]); setSelectedCountry({ ...c, agents: [] }); }
                }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-[var(--radius-md)] border cursor-pointer transition-all duration-150 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-subtle)]"
                style={{ borderColor: count > 0 ? 'var(--color-primary-subtle)' : 'var(--color-border)', background: count > 0 ? 'var(--color-primary-subtle)' : 'white' }}
              >
                <img src={`https://flagcdn.com/w20/${c.code.toLowerCase()}.png`} alt={c.name} style={{ width: 24, height: 16, objectFit: 'cover', borderRadius: 2, flexShrink: 0 }} />
                <div className="min-w-0">
                  <div className="text-xs font-semibold truncate" style={{ color: count > 0 ? 'var(--color-primary)' : 'var(--color-text-1)' }}>{c.name}</div>
                  {count > 0 && <div className="text-[10px]" style={{ color: 'var(--color-accent)' }}>{count} set up</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Country Modal */}
      <Dialog open={addCountryOpen} onClose={() => setAddCountryOpen(false)} maxWidth="xs" fullWidth PaperProps={{ style: { borderRadius: 'var(--radius-xl)', overflow: 'hidden' } }}>
        <DialogTitle style={{ padding: 0 }}>
          <div className="flex items-center justify-between px-6 py-4" style={{ background: 'linear-gradient(135deg,#1e3a8a,#1e40af)' }}>
            <div className="flex items-center gap-2"><Business style={{ color: 'white' }} /><span className="text-white font-bold text-base">Add Country</span></div>
            <IconButton onClick={() => setAddCountryOpen(false)} style={{ color: 'white' }}><Close /></IconButton>
          </div>
        </DialogTitle>
        <DialogContent style={{ padding: '24px' }}>
          <div className="mt-2">
            <FormControl fullWidth required>
              <InputLabel>Select Country</InputLabel>
              <Select value={selectedNewCountry} label="Select Country" onChange={(e) => setSelectedNewCountry(e.target.value)}>
                {ALL_COUNTRIES.filter((c) => !countries.find((x) => x.code === c.code)).map((c) => (
                  <MenuItem key={c.code} value={c.code}>
                    <span className="flex items-center gap-2">
                      <img src={`https://flagcdn.com/w20/${c.code.toLowerCase()}.png`} alt="" style={{ width: 20, height: 14, objectFit: 'cover', borderRadius: 2 }} />
                      {c.name}
                    </span>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions style={{ padding: '16px 24px 24px', gap: 10 }}>
          <AppButton variant="secondary" onClick={() => setAddCountryOpen(false)}>Cancel</AppButton>
          <AppButton variant="primary" onClick={addCountry}>Add Country</AppButton>
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <AppStatCard label="Total Pairs" value={rates.length} color="admin" delay={0} />
        <AppStatCard label="Active" value={rates.filter((r) => r.status === 'Active').length} color="accent" delay={0.06} />
        <AppStatCard label="Avg Spread" value={`${(rates.reduce((s, r) => s + r.spread, 0) / rates.length).toFixed(2)}%`} color="warning" delay={0.12} />
      </div>
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden">
        <TableContainer sx={{ overflowX: 'auto' }}>
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 md:p-5 rounded-[var(--radius-lg)] text-white" style={{ background: 'linear-gradient(135deg,#1e1b4b,#312e81)' }}>
        <div>
          <div className="font-bold text-base md:text-lg">Submit End of Day Reconciliation</div>
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
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] p-3 md:p-4 mb-4 flex gap-3 items-center flex-wrap">
        <FormControl size="small" style={{ minWidth: 160 }}>
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
        <TableContainer sx={{ overflowX: 'auto' }}>
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
