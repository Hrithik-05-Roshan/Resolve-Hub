import React, { useState } from 'react';
import { ShieldAlert, UserCheck, CheckCircle2, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface EscalationCardProps {
  issueId?: string;
  reason?: string;
  ticketNumber?: string;
  confidenceScore?: number;
}

export const EscalationCard: React.FC<EscalationCardProps> = ({
  issueId,
  reason = 'The requested resolution exceeds automatic threshold or requires merchant/driver activity.',
  ticketNumber = 'RH-82941',
  confidenceScore = 42,
}) => {
  const { escalateIssue } = useApp();
  const [isEscalated, setIsEscalated] = useState(!!ticketNumber);

  const handleEscalate = () => {
    if (issueId) {
      escalateIssue(issueId, reason);
      setIsEscalated(true);
    }
  };

  return (
    <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-5 shadow-xl text-amber-200">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-amber-500/20">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100">Manual Activity / Escalation Required</h4>
            <p className="text-xs text-amber-300/80">AI Confidence: {confidenceScore}%</p>
          </div>
        </div>
        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
          Discord Escalation
        </span>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed mb-4">{reason}</p>

      {isEscalated ? (
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between font-semibold text-emerald-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Dispatched to Discord Support Webhook
            </span>
            <span className="font-mono text-xs px-2 py-0.5 bg-slate-800 rounded border border-slate-700 text-indigo-300 font-bold">
              #{ticketNumber}
            </span>
          </div>
          <p className="text-slate-400 text-[11px]">
            Real-time alert posted to Discord Webhook. Merchant & support agent notified for manual activity.
          </p>
        </div>
      ) : (
        <button
          onClick={handleEscalate}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Escalate to Discord Support Webhook</span>
        </button>
      )}
    </div>
  );
};

