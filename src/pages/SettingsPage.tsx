import React, { useState } from 'react';
import { Settings, Shield, Bell, Cpu, Save, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsPage: React.FC = () => {
  const { currentUser, updateSettings, resetToInitialData } = useApp();
  const [threshold, setThreshold] = useState(currentUser.autoRefundThreshold || 1000);
  const [notificationsEnabled, setNotificationsEnabled] = useState(currentUser.notificationsEnabled);
  const [autoExecuteEnabled, setAutoExecuteEnabled] = useState(currentUser.autoExecuteEnabled);
  const [humanEscalationEnabled, setHumanEscalationEnabled] = useState(currentUser.humanEscalationEnabled);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      autoRefundThreshold: Number(threshold),
      notificationsEnabled,
      autoExecuteEnabled,
      humanEscalationEnabled,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <Settings className="w-5 h-5 text-indigo-400" />
          <h1 className="text-2xl font-bold text-slate-100">Settings & AI Safety Permissions</h1>
        </div>
        <p className="text-xs text-slate-400">
          Configure security bounds, automatic refund limits, and notifications for the autonomous AI agent.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* User Profile Info */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" /> User Profile
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium font-sans">Name</label>
              <input
                type="text"
                value={currentUser.name}
                disabled
                className="w-full bg-slate-950 border border-slate-800 text-slate-300 p-2.5 rounded-xl cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium font-sans">Email Address</label>
              <input
                type="text"
                value={currentUser.email}
                disabled
                className="w-full bg-slate-950 border border-slate-800 text-slate-300 p-2.5 rounded-xl cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* AI Agent Safety & Limits */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" /> AI Safety Bounds & Limits
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-200 font-semibold">Auto-Execute Refund Limit (INR)</label>
                <span className="font-mono text-emerald-400 font-bold text-sm">₹{threshold}</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2">
                Refunds equal to or below this limit will be automatically approved and executed by the AI. Higher amounts trigger human review.
              </p>
              <input
                type="range"
                min={100}
                max={5000}
                step={100}
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-950 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-200 block">Autonomous Tool Execution</span>
                  <span className="text-[11px] text-slate-400">Allow AI to call merchant refund & replacement APIs directly.</span>
                </div>
                <input
                  type="checkbox"
                  checked={autoExecuteEnabled}
                  onChange={(e) => setAutoExecuteEnabled(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-200 block">Automatic Human Escalation</span>
                  <span className="text-[11px] text-slate-400">Escalate cases to senior human agents when AI confidence is &lt; 85%.</span>
                </div>
                <input
                  type="checkbox"
                  checked={humanEscalationEnabled}
                  onChange={(e) => setHumanEscalationEnabled(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Notifications Toggles */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Bell className="w-4 h-4 text-purple-400" /> Notifications & Alerts
          </h3>

          <label className="flex items-center justify-between cursor-pointer text-xs">
            <div>
              <span className="font-semibold text-slate-200 block">Real-time In-App & SMS Alerts</span>
              <span className="text-[11px] text-slate-400">Receive instant updates as refunds and replacements execute.</span>
            </div>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
            />
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={resetToInitialData}
            className="py-3 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-rose-400 border border-slate-800 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" /> Reset Demo Data
          </button>

          <button
            type="submit"
            className="py-3 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{savedSuccess ? 'Saved Successfully! ✓' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
