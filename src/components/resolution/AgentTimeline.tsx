import React from 'react';
import { CheckCircle2, Clock, Loader2, AlertTriangle, Terminal, Cpu } from 'lucide-react';
import { ActionStep } from '../../types';

interface AgentTimelineProps {
  steps: ActionStep[];
  isProcessing?: boolean;
}

export const AgentTimeline: React.FC<AgentTimelineProps> = ({ steps, isProcessing }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl h-full flex flex-col">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>AI Agent Execution Timeline</span>
              {isProcessing && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 animate-pulse">
                  Autonomous Mode
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">Real-time tool invocation & verification log</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <Terminal className="w-3.5 h-3.5 text-slate-500" />
          <span>{steps.length} Steps</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {steps.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            No agent actions recorded yet. Submit a complaint or run a demo scenario to see the timeline in action.
          </div>
        ) : (
          steps.map((step, idx) => {
            const isCompleted = step.status === 'completed';
            const isRunning = step.status === 'running';
            const isFailed = step.status === 'failed';

            return (
              <div
                key={step.actionId || idx}
                className={`relative pl-7 pb-2 group transition-all ${
                  idx < steps.length - 1 ? 'border-l-2 border-slate-800' : ''
                }`}
              >
                {/* Timeline Icon Node */}
                <div className="absolute -left-[9px] top-0 flex items-center justify-center">
                  {isCompleted ? (
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500 flex items-center justify-center shadow-sm shadow-emerald-900/50">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  ) : isRunning ? (
                    <div className="w-4 h-4 rounded-full bg-indigo-500/30 text-indigo-400 border border-indigo-500 flex items-center justify-center shadow-sm shadow-indigo-900/50">
                      <Loader2 className="w-3 h-3 animate-spin" />
                    </div>
                  ) : isFailed ? (
                    <div className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500 flex items-center justify-center">
                      <AlertTriangle className="w-3 h-3" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500">
                      <Clock className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>

                {/* Step Card Content */}
                <div
                  className={`p-3 rounded-xl border transition-all ${
                    isRunning
                      ? 'bg-indigo-950/30 border-indigo-500/40 shadow-lg shadow-indigo-950/40'
                      : isCompleted
                      ? 'bg-slate-950/80 border-slate-800/90 hover:border-slate-700'
                      : 'bg-slate-950/40 border-slate-800/50 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                      <span>{step.stepName}</span>
                    </span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-indigo-300 border border-slate-800">
                      {step.tool}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-1 leading-snug">{step.description}</p>

                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>{step.timestamp || 'Just now'}</span>
                    <span
                      className={`capitalize ${
                        isCompleted
                          ? 'text-emerald-400 font-medium'
                          : isRunning
                          ? 'text-indigo-400 font-medium'
                          : 'text-slate-500'
                      }`}
                    >
                      {step.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
