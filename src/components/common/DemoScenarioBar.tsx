import React from 'react';
import { Play, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DEMO_SCENARIOS } from '../../data/mockData';
import { PlatformBadge } from './PlatformBadge';

export const DemoScenarioBar: React.FC = () => {
  const { triggerDemoScenario, isProcessingAI } = useApp();

  return (
    <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900 to-violet-950/40 border border-indigo-500/20 rounded-2xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <span>Interactive Demo Scenarios</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                1-Click Execution
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Click any scenario to watch the AI Agent investigate, decide, execute tools, and verify live.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {DEMO_SCENARIOS.map((scenario) => (
          <button
            key={scenario.id}
            disabled={isProcessingAI}
            onClick={() => triggerDemoScenario(scenario.id)}
            className="group relative text-left p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer shadow-md flex flex-col justify-between h-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <PlatformBadge platform={scenario.platform} size="sm" />
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                  {scenario.badge}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-200 line-clamp-1 group-hover:text-indigo-300 transition-colors">
                {scenario.title}
              </p>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                "{scenario.query}"
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 group-hover:text-indigo-400 transition-colors font-medium">
              <span>Run Scenario</span>
              <Play className="w-3 h-3 fill-indigo-400 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
