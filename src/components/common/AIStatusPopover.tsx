import React, { useState } from 'react';
import { Cpu, CheckCircle2, ShieldCheck, Zap, Activity, Wrench, Globe } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AIStatusPopover: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { platforms, issues } = useApp();

  const connectedCount = platforms.filter((p) => p.connected).length;
  const resolvedToday = issues.filter((i) => i.status === 'resolved').length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-medium hover:bg-emerald-900/40 transition-all cursor-pointer shadow-sm shadow-emerald-950/50"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span>AI Agent Online</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 text-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-100">ResolveHub Engine</h4>
                  <p className="text-xs text-slate-400">Gemini 3.6 Flash Autonomous Agent</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
                Active
              </span>
            </div>

            <div className="py-3 space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-indigo-400" /> System Status
                </span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Operational
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-blue-400" /> Tools Available
                </span>
                <span className="font-mono font-semibold text-slate-200">14 Active Tools</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-purple-400" /> Connected Platforms
                </span>
                <span className="font-mono font-semibold text-slate-200">{connectedCount} Platforms</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Issues Resolved Today
                </span>
                <span className="font-mono font-semibold text-slate-200">{resolvedToday} Resolved</span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Average Confidence
                </span>
                <span className="font-mono font-semibold text-emerald-400">93.8%</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Auto-execute threshold:</span>
              <span className="font-mono text-indigo-300 font-medium">₹1,000 INR</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
