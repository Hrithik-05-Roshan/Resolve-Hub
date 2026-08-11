import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ConnectionsPage } from './pages/ConnectionsPage';
import { MyOrdersPage } from './pages/MyOrdersPage';
import { RaiseIssuePage } from './pages/RaiseIssuePage';
import { ResolutionCenterPage } from './pages/ResolutionCenterPage';
import { ResolutionHistoryPage } from './pages/ResolutionHistoryPage';
import { AuditLogPage } from './pages/AuditLogPage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const { activePage } = useApp();

  if (activePage === 'landing') {
    return <LandingPage />;
  }

  if (activePage === 'login') {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex font-sans antialiased">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <Header />

        {/* Page Container */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {activePage === 'dashboard' && <DashboardPage />}
          {activePage === 'connections' && <ConnectionsPage />}
          {activePage === 'orders' && <MyOrdersPage />}
          {activePage === 'raise_issue' && <RaiseIssuePage />}
          {activePage === 'resolution_center' && <ResolutionCenterPage />}
          {activePage === 'history' && <ResolutionHistoryPage />}
          {activePage === 'audit_log' && <AuditLogPage />}
          {activePage === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
