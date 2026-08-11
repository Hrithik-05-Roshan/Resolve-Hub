import React, { useState } from 'react';
import { History, Search, ArrowUpRight, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PlatformBadge } from '../components/common/PlatformBadge';

export const ResolutionHistoryPage: React.FC = () => {
  const { issues, setActiveIssue, navigate, searchQuery, setSearchQuery } = useApp();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredIssues = issues.filter((i) => {
    const matchesStatus = statusFilter === 'all' || i.status === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      !query ||
      i.issueId.toLowerCase().includes(query) ||
      i.description.toLowerCase().includes(query) ||
      i.platform.toLowerCase().includes(query);

    return matchesStatus && matchesQuery;
  });

  const handleOpenTimeline = (issue: any) => {
    setActiveIssue(issue);
    navigate('resolution_center');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <History className="w-5 h-5 text-indigo-400" />
            <h1 className="text-2xl font-bold text-slate-100">Resolution History</h1>
          </div>
          <p className="text-xs text-slate-400">
            Complete record of customer disputes handled by ResolveHub AI across all connected platforms.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        {['all', 'resolved', 'escalated', 'investigating'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl font-medium capitalize transition-all cursor-pointer ${
              statusFilter === st
                ? 'bg-indigo-600 text-white font-semibold'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Table / Cards List */}
      <div className="space-y-3">
        {filteredIssues.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800">
            No resolution history entries match your search query.
          </div>
        ) : (
          filteredIssues.map((issue) => (
            <div
              key={issue.issueId}
              onClick={() => handleOpenTimeline(issue)}
              className="p-5 rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all cursor-pointer shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="space-y-2 min-w-0 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-xs font-bold text-indigo-400">
                    #{issue.issueId}
                  </span>
                  <PlatformBadge platform={issue.platform} size="sm" />
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      issue.status === 'resolved'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : issue.status === 'escalated'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-indigo-950 text-indigo-400 border border-indigo-800'
                    }`}
                  >
                    {issue.status}
                  </span>
                  {issue.confidence && (
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      Confidence: {issue.confidence}%
                    </span>
                  )}
                </div>

                <p className="text-xs font-semibold text-slate-200 leading-snug">
                  {issue.description}
                </p>

                <p className="text-xs text-slate-400 line-clamp-2">
                  {issue.resolution}
                </p>

                <div className="text-[11px] text-slate-500 font-mono">
                  Submitted: {issue.createdAt}
                </div>
              </div>

              <div className="flex md:flex-col items-center md:items-end justify-between gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                {issue.refundAmount ? (
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                      Recovered
                    </span>
                    <span className="text-lg font-bold font-mono text-emerald-400">
                      ₹{issue.refundAmount}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-500 font-mono">No financial payout</span>
                )}

                <span className="text-xs text-indigo-400 font-semibold group-hover:underline flex items-center gap-1">
                  <span>View Timeline</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
