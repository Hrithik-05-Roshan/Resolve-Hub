import React from 'react';
import { Play, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DEMO_SCENARIOS } from '../../data/mockData';
import { PlatformBadge } from './PlatformBadge';

export const DemoScenarioBar: React.FC = () => {
  const { triggerDemoScenario, isProcessingAI } = useApp();

  return (
    <div className="bg-gradient-to-r from-indigo-50/90 via-slate-50 to-violet-50/90 dark:from-indigo-950/40 dark:via-slate-900 dark:to-violet-950/40 border border-indigo-200 dark:border-indigo-500/20 rounded-2xl p-4 shadow-sm dark:shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Interactive Demo Scenarios</span>
              <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                1-Click Execution
              </span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
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
            className="group relative text-left p-3.5 rounded-xl bg-white dark:bg-slate-900/90 hover:bg-indigo-50/50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between h-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <PlatformBadge platform={scenario.platform} size="sm" />
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-slate-700">
                  {scenario.badge}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                {scenario.title}
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-tight">
                "{scenario.query}"
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors font-semibold">
              <span>Run Scenario</span>
              <Play className="w-3 h-3 fill-indigo-600 dark:fill-indigo-400 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
