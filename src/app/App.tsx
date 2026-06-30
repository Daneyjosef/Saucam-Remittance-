import { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import BranchSelectionScreen from './components/BranchSelectionScreen';
import TransactionScreen from './components/TransactionScreen';
import RateManagementTable from './components/RateManagementTable';
import CashFloatDashboard from './components/CashFloatDashboard';
import FlaggedTransactionsScreen from './components/FlaggedTransactionsScreen';
import ExecutiveDashboard from './components/ExecutiveDashboard';
import UserManagementScreen from './components/UserManagementScreen';
import { Box, SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import { TrendingUp, AccountBalance, Flag, Dashboard, People } from '@mui/icons-material';

type UserRole = 'Teller' | 'Manager' | 'Compliance' | 'Admin' | null;
type View = 'login' | 'branchSelection' | 'transaction' | 'rates' | 'float' | 'flagged' | 'executive' | 'users';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('login');
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userName] = useState('John Doe');
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  const handleLogin = (email: string, password: string, role: string) => {
    setUserRole(role as UserRole);

    // Teller goes directly to transaction screen
    if (role === 'Teller') {
      setCurrentView('transaction');
    }
    // Manager and Admin need to select a branch
    else if (role === 'Manager' || role === 'Admin') {
      setCurrentView('branchSelection');
    }
    // Compliance goes to flagged transactions
    else if (role === 'Compliance') {
      setCurrentView('flagged');
    }
  };

  const handleSelectBranch = (branchId: string) => {
    setSelectedBranch(branchId);

    // Manager goes to executive dashboard
    if (userRole === 'Manager') {
      setCurrentView('executive');
    }
    // Admin goes to rates management
    else if (userRole === 'Admin') {
      setCurrentView('rates');
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setSelectedBranch(null);
    setCurrentView('login');
  };

  // Show login screen
  if (currentView === 'login') {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Show branch selection for Manager/Admin
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

  // Role-based navigation
  const getSpeedDialActions = () => {
    const actions = [];

    if (userRole === 'Admin') {
      actions.push(
        <SpeedDialAction
          key="users"
          icon={<People />}
          tooltipTitle="User Management"
          onClick={() => setCurrentView('users')}
        />
      );
      actions.push(
        <SpeedDialAction
          key="rates"
          icon={<TrendingUp />}
          tooltipTitle="Rate Management"
          onClick={() => setCurrentView('rates')}
        />
      );
    }

    if (userRole === 'Manager' || userRole === 'Admin') {
      actions.push(
        <SpeedDialAction
          key="executive"
          icon={<Dashboard />}
          tooltipTitle="Executive Dashboard"
          onClick={() => setCurrentView('executive')}
        />
      );
      actions.push(
        <SpeedDialAction
          key="float"
          icon={<AccountBalance />}
          tooltipTitle="Cash Float"
          onClick={() => setCurrentView('float')}
        />
      );
    }

    if (userRole === 'Compliance' || userRole === 'Manager' || userRole === 'Admin') {
      actions.push(
        <SpeedDialAction
          key="flagged"
          icon={<Flag />}
          tooltipTitle="Flagged Transactions"
          onClick={() => setCurrentView('flagged')}
        />
      );
    }

    return actions;
  };

  // Render current view
  const renderView = () => {
    switch (currentView) {
      case 'executive':
        return (
          <ExecutiveDashboard
            onBack={userRole === 'Manager' ? () => setCurrentView('branchSelection') : undefined}
            onGoToCompliance={() => setCurrentView('flagged')}
          />
        );
      case 'rates':
        return <RateManagementTable onBack={() => setCurrentView('branchSelection')} />;
      case 'float':
        return <CashFloatDashboard onBack={() => setCurrentView('executive')} />;
      case 'flagged':
        return <FlaggedTransactionsScreen onBack={() => setCurrentView('executive')} />;
      case 'users':
        return <UserManagementScreen onBack={() => setCurrentView('rates')} />;
      case 'transaction':
      default:
        return <TransactionScreen />;
    }
  };

  return (
    <Box sx={{ position: 'relative', height: '100vh' }}>
      {renderView()}
      {getSpeedDialActions().length > 0 && (
        <SpeedDial
          ariaLabel="Navigation menu"
          sx={{ position: 'fixed', bottom: 24, right: 24 }}
          icon={<SpeedDialIcon />}
        >
          {getSpeedDialActions()}
        </SpeedDial>
      )}
    </Box>
  );
}