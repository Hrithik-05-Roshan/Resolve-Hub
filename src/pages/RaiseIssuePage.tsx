import React, { useState } from 'react';
import { Sparkles, ArrowRight, Upload, Package, MessageSquare, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PlatformId } from '../types';
import { DemoScenarioBar } from '../components/common/DemoScenarioBar';

export const RaiseIssuePage: React.FC = () => {
  const { orders, submitIssue, navigate, isProcessingAI } = useApp();
  const [description, setDescription] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId | ''>('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const presets = [
    { label: '⚠️ High Risk Claim (₹10,000)', text: 'I received an empty package for my high-value order #SHPF-1008 and request an immediate refund of ₹10,000.' },
    { label: 'Shopify Order #1008', text: 'My Shopify order #1008 Wireless Headphones has not arrived yet. I want a refund.' },
    { label: 'Missing Item', text: 'My Swiggy order arrived but the Coke was missing.' },
    { label: 'Damaged Product', text: 'My Amazon package arrived damaged with broken packaging.' },
    { label: 'Duplicate Charge', text: 'I was charged twice on my Zomato account for the same order.' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    navigate('resolution_center');
    await submitIssue({
      description,
      platform: (selectedPlatform as PlatformId) || undefined,
      orderId: selectedOrderId || undefined,
    });
  };

  const handleSelectPreset = (text: string) => {
    setDescription(text);
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const orderId = e.target.value;
    setSelectedOrderId(orderId);
    const matched = orders.find((o) => o.orderId === orderId);
    if (matched) {
      setSelectedPlatform(matched.platform);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Page Title */}
      <div className="text-center space-y-2 py-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Autonomous AI Resolution</span>
        </div>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight">
          What went wrong?
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Describe your problem in plain English. ResolveHub will investigate, select system tools, execute actions, and verify results.
        </p>
      </div>

      {/* Main Issue Form Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Textarea */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
              Describe Your Complaint
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="“Describe your problem in your own words, e.g. My Swiggy order arrived but the Coke was missing...”"
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-500 text-sm p-4 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none shadow-inner"
              required
            />
          </div>

          {/* Prompt Presets */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Quick Prompt Examples
            </span>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(preset.text)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 text-xs text-slate-300 transition-all cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Order Selection & Image Upload */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Order Picker */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Link Specific Order (Optional)
              </label>
              <div className="relative">
                <select
                  value={selectedOrderId}
                  onChange={handleOrderChange}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs py-2.5 px-3 rounded-xl focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                >
                  <option value="">Auto-detect from prompt</option>
                  {orders.map((o) => (
                    <option key={o.orderId} value={o.orderId}>
                      #{o.orderId} - {o.platformName} ({o.currency}{o.amount})
                    </option>
                  ))}
                </select>
                <Package className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>
            </div>

            {/* Screenshot Upload Simulation */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Attach Photo / Invoice (Optional)
              </label>
              <label className="w-full bg-slate-950 border border-dashed border-slate-800 hover:border-indigo-500 text-slate-400 text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5 text-indigo-400" />
                <span>{uploadedImage ? 'Photo Attached ✓' : 'Upload Screenshot'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadedImage(e.target.files[0].name);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {/* Action Submit Button */}
          <button
            type="submit"
            disabled={!description.trim() || isProcessingAI}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
          >
            <span>Let ResolveHub handle it</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Demo Scenarios Section */}
      <DemoScenarioBar />
    </div>
  );
};
