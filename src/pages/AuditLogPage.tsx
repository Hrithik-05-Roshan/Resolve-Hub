import React from 'react';
import { Terminal, Search, ShieldCheck, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuditLogPage: React.FC = () => {
  const { auditLogs, searchQuery, setSearchQuery } = useApp();

  const filteredLogs = auditLogs.filter((log) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      log.action.toLowerCase().includes(q) ||
      log.actor.toLowerCase().includes(q) ||
      (log.input && log.input.toLowerCase().includes(q)) ||
      (log.output && log.output.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Terminal className="w-5 h-5 text-indigo-400" />
            <h1 className="text-2xl font-bold text-slate-100">System Audit Trail</h1>
          </div>
          <p className="text-xs text-slate-400">
            Immutable technical action log recording every AI tool call, policy evaluation, and merchant API response.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter audit entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={() => {
              const headers = ['Timestamp', 'Actor', 'Action', 'Input', 'Output', 'Status'];
              const rows = filteredLogs.map((l) => [
                `"${l.timestamp}"`,
                `"${l.actor}"`,
                `"${l.action.replace(/"/g, '""')}"`,
                `"${(l.input || '').replace(/"/g, '""')}"`,
                `"${(l.output || '').replace(/"/g, '""')}"`,
                `"${l.status}"`,
              ]);
              const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement('a');
              link.setAttribute('href', encodedUri);
              link.setAttribute('download', `ResolveHub_AuditLog_${Date.now()}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3.5 pl-5">Timestamp</th>
                <th className="p-3.5">Actor</th>
                <th className="p-3.5">Action & Tool Invocation</th>
                <th className="p-3.5">Output / Result</th>
                <th className="p-3.5 pr-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No audit log entries found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 pl-5 text-slate-400 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.actor === 'GEMINI'
                            ? 'bg-purple-950 text-purple-400 border border-purple-800'
                            : log.actor === 'TOOL'
                            ? 'bg-blue-950 text-blue-400 border border-blue-800'
                            : log.actor === 'USER'
                            ? 'bg-indigo-950 text-indigo-400 border border-indigo-800'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {log.actor}
                      </span>
                    </td>
                    <td className="p-3.5 font-semibold text-slate-200 max-w-xs truncate">
                      {log.action}
                      {log.input && (
                        <span className="block font-normal text-[10px] text-slate-400 truncate mt-0.5">
                          In: {log.input}
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-slate-400 max-w-sm truncate">
                      {log.output || '—'}
                    </td>
                    <td className="p-3.5 pr-5 text-right">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          log.status === 'success'
                            ? 'bg-emerald-950 text-emerald-400'
                            : log.status === 'warning'
                            ? 'bg-amber-950 text-amber-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
