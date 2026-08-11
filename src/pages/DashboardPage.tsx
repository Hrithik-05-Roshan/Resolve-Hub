import React from 'react';
import {
  Sparkles,
  PlusCircle,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  IndianRupee,
  Zap,
  Layers,
  ArrowRight,
  ShieldCheck,
  Bot,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DemoScenarioBar } from '../components/common/DemoScenarioBar';
import { PlatformBadge } from '../components/common/PlatformBadge';

export const DashboardPage: React.FC = () => {
  const { currentUser, platforms, issues, navigate, setActiveIssue } = useApp();

  const totalIssues = issues.length + 20; // 24 total
  const resolvedCount = issues.filter((i) => i.status === 'resolved').length + 18; // 21
  const inProgressCount = 2;
  const escalatedCount = issues.filter((i) => i.status === 'escalated').length; // 1

  const moneyRecovered = issues.reduce((acc, i) => acc + (i.refundAmount || 0), 0) + 1240; // ₹4,280 total

  const connectedPlatforms = platforms.filter((p) => p.connected);

  const handleOpenIssue = (issue: any) => {
    setActiveIssue(issue);
    navigate('resolution_center');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-100/90 via-slate-50 to-violet-100/90 dark:from-indigo-950/80 dark:via-slate-900 dark:to-violet-950/80 border border-indigo-200 dark:border-indigo-500/30 shadow-sm dark:shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-500/30 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping" />
            <span>AI Resolution Engine Operational</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Good morning, {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            Your AI resolution agent is ready to investigate, execute, and verify customer disputes automatically.
          </p>
        </div>

        <button
          onClick={() => navigate('raise_issue')}
          className="py-3 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Raise a new issue</span>
        </button>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-md">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
            Total Issues
          </span>
          <span className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono mt-1 block">
            {totalIssues}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-md">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Resolved
          </span>
          <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono mt-1 block">
            {resolvedCount}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-md">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 block flex items-center gap-1">
            <Clock className="w-3 h-3" /> In Progress
          </span>
          <span className="text-2xl font-black text-indigo-700 dark:text-indigo-400 font-mono mt-1 block">
            {inProgressCount}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-md">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Escalated
          </span>
          <span className="text-2xl font-black text-amber-700 dark:text-amber-400 font-mono mt-1 block">
            {escalatedCount}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-md">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
            AI Resolution
          </span>
          <span className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono mt-1 block">
            87.5%
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-md">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
            Avg Time
          </span>
          <span className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono mt-1 block">
            42 sec
          </span>
        </div>

        <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 shadow-sm dark:shadow-md">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block flex items-center gap-1">
            <IndianRupee className="w-3 h-3" /> Recovered
          </span>
          <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono mt-1 block">
            ₹{moneyRecovered.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Interactive Demo Scenarios Bar */}
      <DemoScenarioBar />

      {/* Main Grid: AI Activity Feed & Connected Platforms */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: AI Activity Feed */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Autonomous AI Activity Feed</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Live stream of tool executions & verified resolutions</p>
              </div>
            </div>
            <button
              onClick={() => navigate('audit_log')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View Audit Trail</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {issues.map((issue) => (
              <div
                key={issue.issueId}
                onClick={() => handleOpenIssue(issue)}
                className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-950/80 hover:bg-indigo-50/70 dark:hover:bg-slate-950 border border-slate-200 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-indigo-500/40 transition-all cursor-pointer flex items-center justify-between gap-4 group shadow-2xs"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      issue.requiresHuman || issue.status === 'escalated'
                        ? 'bg-red-500 animate-pulse shadow-sm shadow-red-500/50'
                        : issue.status === 'resolved'
                        ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50'
                        : 'bg-indigo-500 animate-ping'
                    }`}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`font-bold text-xs transition-colors ${
                          issue.requiresHuman || issue.status === 'escalated'
                            ? 'text-red-700 dark:text-red-300 group-hover:text-red-800 dark:group-hover:text-red-200'
                            : 'text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-300'
                        }`}
                      >
                        {issue.requiresHuman || issue.status === 'escalated'
                          ? '⚠️ Manual Review Required'
                          : issue.issueType === 'missing_item'
                          ? 'Refund Initiated'
                          : issue.issueType === 'damaged_product'
                          ? 'Replacement Requested'
                          : issue.issueType === 'duplicate_payment'
                          ? 'Duplicate Charge Reversed'
                          : 'Order Investigated'}
                      </span>
                      <PlatformBadge platform={issue.platform} size="sm" />
                      {issue.refundAmount ? (
                        <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60">
                          ₹{issue.refundAmount.toLocaleString('en-IN')}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-1">
                      {issue.description}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block font-medium">
                    {issue.resolvedAt || issue.createdAt}
                  </span>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold group-hover:underline">
                    Inspect Trace →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Connected Platforms & AI Insights */}
        <div className="space-y-6">
          {/* Connected Platforms Widget */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">CONNECTED PLATFORMS</h3>
              </div>
              <button
                onClick={() => navigate('connections')}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
              >
                Manage
              </button>
            </div>

            <div className="space-y-2.5">
              {platforms.map((p) => (
                <div
                  key={p.platformId}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <PlatformBadge platform={p.platformId} size="sm" />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">{p.name}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">{p.category}</span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      p.connected
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                        : 'bg-slate-100 dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {p.connected ? 'Connected' : 'Not Connected'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights Widget */}
          <div className="bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/80 dark:from-indigo-950/40 dark:to-slate-900 border border-indigo-200 dark:border-indigo-500/20 rounded-3xl p-6 shadow-md dark:shadow-xl space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-bold text-sm">
                <div className="p-1.5 rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                  <Bot className="w-4 h-4" />
                </div>
                <span>AI AGENT INSIGHTS</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60">
                99.2% Accuracy
              </span>
            </div>

            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              You recovered <strong className="text-emerald-700 dark:text-emerald-400 font-mono font-bold text-sm">₹4,280</strong> through automatic resolutions this month across 4 connected platforms.
            </p>

            <div className="space-y-2.5 pt-3 border-t border-indigo-100 dark:border-slate-800">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Most Common Issue:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Missing Items (34%)</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Avg Resolution Time:</span>
                <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300">42 seconds</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Human Escalation Rate:</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">8.3%</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Auto-Approved Refunds:</span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">88.5%</span>
              </div>
            </div>

            {/* Issue Breakdown progress bars */}
            <div className="pt-3 space-y-2 border-t border-indigo-100 dark:border-slate-800">
              <div className="text-[11px] font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider mb-2">
                Top Issue Breakdown
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                  <span>Missing Item</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-300">34%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-950 rounded-full h-1.5 mt-1 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full" style={{ width: '34%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                  <span>Refund Request</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-300">26%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-950 rounded-full h-1.5 mt-1 overflow-hidden">
                  <div className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full rounded-full" style={{ width: '26%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                  <span>Damaged Product</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-300">18%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-950 rounded-full h-1.5 mt-1 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full" style={{ width: '18%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
