import React from 'react';
import { ShieldCheck, BarChart3, AlertCircle } from 'lucide-react';
import { ConfidenceBreakdown as ConfidenceType } from '../../types';

interface ConfidenceProps {
  score: number;
  breakdown?: ConfidenceType;
}

export const ConfidenceBreakdownCard: React.FC<ConfidenceProps> = ({
  score = 94,
  breakdown = {
    classification: 98,
    orderId: 96,
    policy: 92,
    decision: 94,
  },
}) => {
  const isHighConfidence = score >= 85;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-slate-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className={`w-4 h-4 ${isHighConfidence ? 'text-emerald-400' : 'text-amber-400'}`} />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            AI Agent Confidence Score
          </h4>
        </div>
        <span
          className={`font-mono text-sm font-bold px-2 py-0.5 rounded ${
            isHighConfidence
              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
              : 'bg-amber-950 text-amber-400 border border-amber-800'
          }`}
        >
          {score}%
        </span>
      </div>

      {/* Main Bar */}
      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800 mb-4">
        <div
          className={`h-full transition-all duration-500 ${
            isHighConfidence
              ? 'bg-gradient-to-r from-emerald-500 to-indigo-500'
              : 'bg-gradient-to-r from-amber-500 to-rose-500'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Breakdown Metrics */}
      <div className="space-y-2 text-xs">
        <div>
          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
            <span>Issue classification</span>
            <span className="font-mono text-slate-200 font-semibold">{breakdown.classification}%</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1 overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${breakdown.classification}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
            <span>Order identification</span>
            <span className="font-mono text-slate-200 font-semibold">{breakdown.orderId}%</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1 overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${breakdown.orderId}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
            <span>Policy interpretation</span>
            <span className="font-mono text-slate-200 font-semibold">{breakdown.policy}%</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1 overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${breakdown.policy}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
            <span>Resolution decision</span>
            <span className="font-mono text-slate-200 font-semibold">{breakdown.decision}%</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1 overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${breakdown.decision}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};
