import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Bot,
  User,
  ArrowLeft,
  RotateCcw,
  IndianRupee,
  Package,
  ShieldAlert,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AgentTimeline } from '../components/resolution/AgentTimeline';
import { ConfidenceBreakdownCard } from '../components/resolution/ConfidenceBreakdown';
import { EscalationCard } from '../components/resolution/EscalationCard';
import { PlatformBadge } from '../components/common/PlatformBadge';

export const ResolutionCenterPage: React.FC = () => {
  const { activeIssue, navigate, submitIssue, isProcessingAI, processingStepIndex } = useApp();
  const [followupText, setFollowupText] = useState('');

  if (!activeIssue) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <div className="p-4 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 w-fit mx-auto">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-100">AI Resolution Center</h2>
        <p className="text-xs text-slate-400">
          No active issue session loaded. Submit a new complaint or choose a demo scenario.
        </p>
        <button
          onClick={() => navigate('raise_issue')}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg cursor-pointer"
        >
          Raise an Issue Now
        </button>
      </div>
    );
  }

  const isHighRisk =
    activeIssue.requiresHuman ||
    activeIssue.status === 'escalated' ||
    (activeIssue.refundAmount && activeIssue.refundAmount >= 5000);

  const handleSendFollowup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followupText.trim()) return;

    const query = followupText;
    setFollowupText('');
    await submitIssue({
      description: query,
      platform: activeIssue.platform,
      orderId: activeIssue.orderId,
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('history')}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-indigo-400">
                #{activeIssue.issueId}
              </span>
              <PlatformBadge platform={activeIssue.platform} size="sm" />
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  activeIssue.status === 'resolved'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : isHighRisk
                    ? 'bg-red-950 text-red-400 border border-red-700 font-extrabold animate-pulse'
                    : 'bg-indigo-950 text-indigo-400 border border-indigo-800'
                }`}
              >
                {isHighRisk ? 'Manual Review Required' : activeIssue.status}
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-100 mt-0.5">
              {activeIssue.description}
            </h1>
          </div>
        </div>

        <button
          onClick={() => navigate('raise_issue')}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition-colors cursor-pointer flex items-center gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
          <span>New Resolution Session</span>
        </button>
      </div>

      {/* HIGH-RISK TRANSACTION & MANUAL REVIEW REQUIRED BANNER */}
      {isHighRisk && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-red-950 via-slate-900 to-red-950 border-2 border-red-600/80 shadow-2xl shadow-red-950/60 space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-xl bg-red-600/20 text-red-400 border border-red-500/40 shrink-0">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold uppercase bg-red-600 text-white shadow-md flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Manual Review Required
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-red-950 text-red-300 border border-red-800">
                    High-Risk Transaction Flagged
                  </span>
                  {activeIssue.escalationTicket && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 text-indigo-300 border border-slate-700">
                      Ticket #{activeIssue.escalationTicket}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-extrabold text-red-100 mt-1.5">
                  High-Risk Claim Flagged for Manual Investigation
                </h3>
                <p className="text-xs text-red-200/90 mt-0.5 max-w-2xl leading-relaxed">
                  {activeIssue.escalationReason ||
                    'Financial Risk Engine blocked automatic approval because claim amount exceeds standard ₹5,000 safety threshold.'}
                </p>
              </div>
            </div>

            {activeIssue.refundAmount ? (
              <div className="px-4 py-3 rounded-xl bg-red-950/90 border border-red-600/80 text-right shrink-0 shadow-lg">
                <span className="text-[10px] font-mono uppercase text-red-300 block font-semibold">
                  Flagged Transaction
                </span>
                <span className="text-xl font-black text-red-400 font-mono">
                  ₹{activeIssue.refundAmount.toLocaleString()} INR
                </span>
              </div>
            ) : null}
          </div>

          <div className="pt-3 border-t border-red-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-red-300/90">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="font-medium">
                Escalation service triggered: Alert dispatched to Discord Webhook for manual merchant review.
              </span>
            </div>
            <span className="font-mono text-[11px] text-red-400 font-bold">
              Escalation Status: DISPATCHED
            </span>
          </div>
        </div>
      )}

      {/* Hero Split Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT SIDE (Col 7): Conversation with ResolveHub AI */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col h-[650px]">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">ResolveHub Agent Chat</h3>
                <p className="text-[11px] text-slate-400">Gemini 3.6 Flash • Autonomous Session</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified Session</span>
            </div>
          </div>

          {/* Conversation Body */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 text-xs">
            {/* User Message */}
            <div className="flex items-start gap-3 justify-end">
              <div className="bg-indigo-600 text-white p-4 rounded-2xl rounded-tr-none max-w-md shadow-md">
                <div className="font-semibold text-[11px] text-indigo-200 mb-1 flex items-center gap-1">
                  <User className="w-3 h-3" /> You
                </div>
                <p className="text-xs leading-relaxed">{activeIssue.description}</p>
              </div>
            </div>

            {/* AI Agent Message */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 shadow-md">
                R
              </div>
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl rounded-tl-none max-w-lg space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> ResolveHub AI
                  </span>
                  {activeIssue.orderId && (
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      Order #{activeIssue.orderId}
                    </span>
                  )}
                </div>

                <p className="text-slate-200 leading-relaxed text-xs">
                  I investigated your {activeIssue.platform.toUpperCase()} account and located order{' '}
                  <strong className="text-indigo-300 font-mono">#{activeIssue.orderId || 'SWG-1284'}</strong>.
                </p>

                {/* Structured Resolution Box */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-indigo-400" /> Resolution Analysis
                  </div>
                  <p className="text-slate-300 leading-relaxed text-xs">
                    {activeIssue.resolution ||
                      'Evaluating policy guidelines and gateway charges...'}
                  </p>

                  {activeIssue.refundAmount && (
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between font-mono">
                      <span className="text-slate-400 text-[11px]">Eligible Amount:</span>
                      <span className="text-emerald-400 font-bold text-sm">
                        ₹{activeIssue.refundAmount} INR
                      </span>
                    </div>
                  )}
                </div>

                {activeIssue.status === 'resolved' && (
                  <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>✓ Action executed & verified with merchant API.</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Follow-up Prompt Input Bar */}
          <form onSubmit={handleSendFollowup} className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask a follow-up or request additional action..."
              value={followupText}
              onChange={(e) => setFollowupText(e.target.value)}
              disabled={isProcessingAI}
              className="flex-1 bg-slate-950 border border-slate-800 text-xs text-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!followupText.trim() || isProcessingAI}
              className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* RIGHT SIDE (Col 5): AI Action Execution Timeline & Metrics */}
        <div className="lg:col-span-5 space-y-6">
          {/* Agent Timeline */}
          <AgentTimeline
            steps={activeIssue.actions || []}
            isProcessing={isProcessingAI}
          />

          {/* Confidence Breakdown Card */}
          <ConfidenceBreakdownCard
            score={activeIssue.confidence || 94}
            breakdown={activeIssue.confidenceBreakdown}
          />

          {/* Escalation Card */}
          {activeIssue.requiresHuman || activeIssue.status === 'escalated' || isHighRisk ? (
            <EscalationCard
              issueId={activeIssue.issueId}
              reason={activeIssue.escalationReason}
              ticketNumber={activeIssue.escalationTicket}
              confidenceScore={activeIssue.confidence}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};
