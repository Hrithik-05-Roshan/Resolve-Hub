import React from 'react';
import { Sparkles, ShieldCheck, Zap, ArrowRight, Layers, CheckCircle2, Bot, Cpu, Play } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DemoScenarioBar } from '../components/common/DemoScenarioBar';

export const LandingPage: React.FC = () => {
  const { navigate, loginAsDemo } = useApp();

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col font-sans">
      {/* Top Nav */}
      <header className="h-20 border-b border-slate-800/80 px-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/30">
            R
          </div>
          <span className="font-bold text-xl tracking-tight">
            Resolve<span className="text-indigo-400">Hub</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('login')}
            className="text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={loginAsDemo}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-2"
          >
            <span>Try ResolveHub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 lg:py-20 space-y-20">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Universal AI Resolution Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            AI that doesn't just answer.{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-violet-400 bg-clip-text text-transparent">
              It resolves.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Resolve customer issues across every platform with an autonomous AI resolution engine that investigates, acts, verifies, and closes the loop.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={loginAsDemo}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-sm font-bold text-white shadow-xl shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Explore Live Prototype</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                loginAsDemo();
                navigate('raise_issue');
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-sm font-semibold text-slate-200 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 text-indigo-400" />
              <span>See How It Works</span>
            </button>
          </div>
        </div>

        {/* Hero Visual Workflow Diagram */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-center text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold mb-8">
            Autonomous Agent Resolution Pipeline
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center text-xs relative">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col items-center">
              <span className="w-8 h-8 rounded-full bg-slate-900 text-slate-300 font-bold flex items-center justify-center mb-2 font-mono">1</span>
              <span className="font-bold text-slate-200">Customer Issue</span>
              <span className="text-[11px] text-slate-400 mt-1">Natural language text or screenshot</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col items-center">
              <span className="w-8 h-8 rounded-full bg-indigo-950 text-indigo-400 font-bold flex items-center justify-center mb-2 font-mono border border-indigo-800">2</span>
              <span className="font-bold text-slate-200">AI Investigation</span>
              <span className="text-[11px] text-slate-400 mt-1">Order lookup & eligibility policy check</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col items-center">
              <span className="w-8 h-8 rounded-full bg-purple-950 text-purple-400 font-bold flex items-center justify-center mb-2 font-mono border border-purple-800">3</span>
              <span className="font-bold text-slate-200">Tool Execution</span>
              <span className="text-[11px] text-slate-400 mt-1">API refund or replacement dispatch</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col items-center">
              <span className="w-8 h-8 rounded-full bg-emerald-950 text-emerald-400 font-bold flex items-center justify-center mb-2 font-mono border border-emerald-800">4</span>
              <span className="font-bold text-slate-200">Verification</span>
              <span className="text-[11px] text-slate-400 mt-1">Merchant gateway confirmation</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex flex-col items-center">
              <span className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center mb-2">✓</span>
              <span className="font-bold text-emerald-400">Issue Resolved</span>
              <span className="text-[11px] text-emerald-300/80 mt-1">Customer notified & audit logged</span>
            </div>
          </div>
        </div>

        {/* Demo Scenario Quick Access */}
        <DemoScenarioBar />

        {/* Supported Platforms Banner */}
        <div className="text-center space-y-4">
          <p className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Unified Integrations Supported
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-semibold text-slate-300">
            <span className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">Amazon</span>
            <span className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">Flipkart</span>
            <span className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">Swiggy</span>
            <span className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">Zomato</span>
            <span className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">Uber</span>
            <span className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">Myntra</span>
            <span className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">Meesho</span>
          </div>
        </div>

        {/* Features / Why ResolveHub */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 w-fit border border-indigo-500/20">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">One Inbox, Every Platform</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Connect food delivery, e-commerce, and mobility platforms. ResolveHub centralizes all transactions under a unified AI agent.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 w-fit border border-indigo-500/20">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Autonomous Tool Orchestration</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Gemini doesn't just reply—it selects system tools, executes refunds, requests replacements, and verifies API confirmations automatically.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 w-fit border border-indigo-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Audit Trail & Human Escalation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Complete technical logs of every action. If confidence is low or refund limits are exceeded, AI seamlessly escalates to human support.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-400">
        ResolveHub Universal AI Resolution Engine • Powered by Gemini 3.6 & AI Studio
      </footer>
    </div>
  );
};
