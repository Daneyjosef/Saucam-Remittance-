import { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import AdminPortalLogin from './components/AdminPortalLogin';
import BranchSelectionScreen from './components/BranchSelectionScreen';
import TransactionScreen from './components/TransactionScreen';
import RateManagementTable from './components/RateManagementTable';
import CashFloatDashboard from './components/CashFloatDashboard';
import FlaggedTransactionsScreen from './components/FlaggedTransactionsScreen';
import ExecutiveDashboard from './components/ExecutiveDashboard';
import AdminPortal from './components/AdminPortal';
import { Box, SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import { TrendingUp, AccountBalance, Flag, Dashboard } from '@mui/icons-material';

type UserRole = 'Teller' | 'Manager' | 'Compliance' | null;
type View = 'login' | 'adminLogin' | 'adminPortal' | 'branchSelection' | 'transaction' | 'rates' | 'float' | 'flagged' | 'executive';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('login');
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userName] = useState('John Doe');
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  const handleLogin = (_username: string, _password: string, role: string) => {
    setUserRole(role as UserRole);
    if (role === 'Teller') {
      setCurrentView('transaction');
    } else if (role === 'Manager') {
      setCurrentView('branchSelection');
    } else if (role === 'Compliance') {
      setCurrentView('flagged');
    }
  };

  const handleSelectBranch = (branchId: string) => {
    setSelectedBranch(branchId);
    if (userRole === 'Manager') {
      setCurrentView('executive');
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setSelectedBranch(null);
    setCurrentView('login');
  };

  // --- Admin Portal flow ---
  if (currentView === 'login') {
    return (
      <LoginScreen
        onLogin={handleLogin}
        onAdminPortal={() => setCurrentView('adminLogin')}
      />
    );
  }

  if (currentView === 'adminLogin') {
    return (
      <AdminPortalLogin
        onAdminLogin={() => setCurrentView('adminPortal')}
        onBack={() => setCurrentView('login')}
      />
    );
  }

  if (currentView === 'adminPortal') {
    return <AdminPortal onLogout={() => setCurrentView('login')} />;
  }

  // --- Staff flow ---
  if (currentView === 'branchSelection') {
    return (
      <BranchSelectionScreen
        userRole={userRole || ''}
        userName={userName}
        onSelectBranch={handleSelectBranch}
        onLogout={handleLogout}
      />
    );
  }

  const getSpeedDialActions = () => {
    const actions = [];
    if (userRole === 'Manager') {
      actions.push(
        <SpeedDialAction key="executive" icon={<Dashboard />} tooltipTitle="Executive Dashboard" onClick={() => setCurrentView('executive')} />,
        <SpeedDialAction key="float" icon={<AccountBalance />} tooltipTitle="Cash Float" onClick={() => setCurrentView('float')} />,
        <SpeedDialAction key="rates" icon={<TrendingUp />} tooltipTitle="Rate Management" onClick={() => setCurrentView('rates')} />,
      );
    }
    if (userRole === 'Compliance' || userRole === 'Manager') {
      actions.push(
        <SpeedDialAction key="flagged" icon={<Flag />} tooltipTitle="Flagged Transactions" onClick={() => setCurrentView('flagged')} />
      );
    }
    return actions;
  };

  const renderView = () => {
    switch (currentView) {
      case 'executive':
        return <ExecutiveDashboard onBack={() => setCurrentView('branchSelection')} onGoToCompliance={() => setCurrentView('flagged')} onLogout={handleLogout} />;
      case 'rates':
        return <RateManagementTable onBack={() => setCurrentView('executive')} onLogout={handleLogout} />;
      case 'float':
        return <CashFloatDashboard onBack={() => setCurrentView('executive')} onLogout={handleLogout} />;
      case 'flagged':
        return <FlaggedTransactionsScreen onBack={() => setCurrentView('executive')} onLogout={handleLogout} />;
      case 'transaction':
      default:
        return <TransactionScreen onLogout={handleLogout} />;
    }
  };

  return (
    <Box sx={{ position: 'relative', height: '100vh' }}>
      {renderView()}
      {getSpeedDialActions().length > 0 && (
        <SpeedDial ariaLabel="Navigation menu" sx={{ position: 'fixed', bottom: 24, right: 24 }} icon={<SpeedDialIcon />}>
          {getSpeedDialActions()}
        </SpeedDial>
      )}
    </Box>
  );
}
