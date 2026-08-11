import React, { useState } from 'react';
import { Bell, Check, Trash2, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationsPopover: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, markNotificationRead, clearNotifications, navigate, issues, setActiveIssue } = useApp();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (issueId?: string) => {
    if (issueId) {
      const issue = issues.find((i) => i.issueId === issueId);
      if (issue) {
        setActiveIssue(issue);
        navigate('resolution_center');
      } else {
        navigate('history');
      }
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-slate-100 transition-colors border border-slate-700/50 cursor-pointer"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow-sm">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl z-50 overflow-hidden text-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-400" />
                <h4 className="font-semibold text-sm">Notifications</h4>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-xs font-mono bg-indigo-950 text-indigo-400 border border-indigo-800">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {notifications.length > 0 && (
                <button
                  onClick={clearNotifications}
                  className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  No notifications yet.
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationRead(n.id);
                      handleNotificationClick(n.issueId);
                    }}
                    className={`p-3 text-xs transition-colors cursor-pointer hover:bg-slate-800/60 flex items-start gap-3 ${
                      !n.read ? 'bg-indigo-950/20' : ''
                    }`}
                  >
                    <div
                      className={`mt-0.5 p-1.5 rounded-full border ${
                        n.type === 'success'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                          : n.type === 'warning'
                          ? 'bg-amber-950 text-amber-400 border-amber-800'
                          : 'bg-indigo-950 text-indigo-400 border-indigo-800'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200 truncate">
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {n.timestamp}
                        </span>
                      </div>
                      <p className="text-slate-400 mt-0.5 line-clamp-2">
                        {n.message}
                      </p>
                      {n.amount && (
                        <div className="mt-1 inline-block text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                          +₹{n.amount} Recovered
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-2.5 bg-slate-900 border-t border-slate-800 text-center">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('history');
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1 cursor-pointer"
              >
                View full resolution history <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
