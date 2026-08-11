import React, { useState } from 'react';
import { Layers, CheckCircle2, ShieldCheck, RefreshCw, Unlink, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PlatformId } from '../types';
import { PlatformBadge } from '../components/common/PlatformBadge';
import { ConnectPlatformModal } from '../components/common/ConnectPlatformModal';

export const ConnectionsPage: React.FC = () => {
  const { platforms, disconnectPlatform } = useApp();
  const [selectedConnectPlatform, setSelectedConnectPlatform] = useState<{
    id: PlatformId;
    name: string;
  } | null>(null);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h1 className="text-2xl font-bold text-slate-100">Integrations & Connections</h1>
          </div>
          <p className="text-xs text-slate-400">
            Connect merchant platforms to allow ResolveHub's AI agent to read orders, inspect logs, and execute automated resolutions.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-2 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>OAuth 2.0 Encrypted API Credentials</span>
        </div>
      </div>

      {/* Grid of Platforms */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map((p) => (
          <div
            key={p.platformId}
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              p.connected
                ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-lg'
                : 'bg-slate-950/60 border-slate-800/60 opacity-80 hover:opacity-100'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <PlatformBadge platform={p.platformId} size="md" />
                <div className="flex items-center gap-1.5">
                  {p.platformId === 'shopify' && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-700">
                      Real Integration
                    </span>
                  )}
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                      p.connected
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80'
                        : 'bg-slate-900 text-slate-500 border border-slate-800'
                    }`}
                  >
                    {p.connected ? '● Connected' : 'Not Connected'}
                  </span>
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-100">{p.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{p.category}</p>

              {p.platformId === 'shopify' && !p.connected && (
                <div className="mt-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] space-y-1 text-slate-300">
                  <div className="font-semibold text-slate-200 text-xs mb-1">Scope Access:</div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> <span>Customer profile</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> <span>Customer orders</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> <span>Order details & fulfillment</span>
                  </div>
                </div>
              )}

              {p.connected ? (
                <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs space-y-1.5 text-slate-400">
                  {p.platformId === 'shopify' && (
                    <div className="flex justify-between">
                      <span>Authenticated Account:</span>
                      <span className="font-medium text-slate-200">Hrithik (Shopify)</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Sync Status:</span>
                    <span className="font-mono text-emerald-400 font-semibold">{p.syncStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Synced:</span>
                    <span className="font-mono text-slate-300">{p.lastSynced}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Imported Orders:</span>
                    <span className="font-mono text-slate-300">{p.orderCount || 12} orders</span>
                  </div>
                </div>
              ) : (
                p.platformId !== 'shopify' && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-500 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Connect to enable autonomous refunds & tracking</span>
                  </div>
                )
              )}
            </div>

            <div className="mt-6">
              {p.connected ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => disconnectPlatform(p.platformId)}
                    className="flex-1 py-2 rounded-xl bg-slate-950 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-800/50 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Unlink className="w-3.5 h-3.5" />
                    <span>Disconnect</span>
                  </button>
                  <button
                    onClick={() =>
                      setSelectedConnectPlatform({ id: p.platformId, name: p.name })
                    }
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                    title="Re-sync platform data"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() =>
                    setSelectedConnectPlatform({ id: p.platformId, name: p.name })
                  }
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Connect {p.name}</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Connect Modal */}
      {selectedConnectPlatform && (
        <ConnectPlatformModal
          platformId={selectedConnectPlatform.id}
          platformName={selectedConnectPlatform.name}
          onClose={() => setSelectedConnectPlatform(null)}
        />
      )}
    </div>
  );
};
