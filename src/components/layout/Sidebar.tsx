import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  ShoppingBag,
  Layers,
  History,
  Terminal,
  Settings,
  PlusCircle,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const { activePage, navigate } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'resolution_center', label: 'AI Resolution', icon: Sparkles, highlight: true },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'connections', label: 'Connections', icon: Layers },
    { id: 'history', label: 'Resolution History', icon: History },
    { id: 'audit_log', label: 'Audit Logs', icon: Terminal },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-950 border-r border-slate-800/80 p-4 sticky top-0 h-screen overflow-y-auto">
        {/* Brand Logo Header */}
        <div className="flex items-center gap-3 px-3 py-2 mb-6 cursor-pointer" onClick={() => navigate('dashboard')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">
            R
          </div>
          <div>
            <h1 className="font-bold text-slate-100 tracking-tight text-lg leading-none">
              Resolve<span className="text-indigo-400">Hub</span>
            </h1>
            <p className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold mt-0.5">
              Universal Resolution AI
            </p>
          </div>
        </div>

        {/* Quick CTA */}
        <button
          onClick={() => navigate('raise_issue')}
          className="w-full mb-6 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all cursor-pointer active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Raise New Issue</span>
        </button>

        {/* Navigation Section */}
        <div className="space-y-1 flex-1">
          <p className="px-3 text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-2">
            Main Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-indigo-400' : 'text-slate-400'
                  }`}
                />
                <span className="flex-1 text-left">{item.label}</span>
                {item.highlight && (
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="pt-4 border-t border-slate-800/80 space-y-1">
          <button
            onClick={() => navigate('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              activePage === 'settings'
                ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Settings & Safety</span>
          </button>

          {/* Engine Status footer badge */}
          <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800/80 text-[11px] text-slate-400">
            <div className="flex items-center justify-between font-medium text-slate-300 mb-1">
              <span>Agent Mode</span>
              <span className="text-emerald-400 font-mono text-[10px]">Autonomous</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Investigate → Decide → Execute → Verify
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 flex items-center justify-around text-[10px]">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition-colors ${
                isActive ? 'text-indigo-400 font-semibold' : 'text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
