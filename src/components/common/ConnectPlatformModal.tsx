import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, Lock, ArrowRight, Loader2, X, AlertTriangle, ExternalLink } from 'lucide-react';
import { PlatformId } from '../../types';
import { PlatformBadge } from './PlatformBadge';
import { useApp } from '../../context/AppContext';
import { getShopifyStatus, initiateShopifyAuth } from '../../services/shopify';

interface ConnectPlatformModalProps {
  platformId: PlatformId;
  platformName: string;
  onClose: () => void;
}

export const ConnectPlatformModal: React.FC<ConnectPlatformModalProps> = ({
  platformId,
  platformName,
  onClose,
}) => {
  const { connectPlatform } = useApp();
  const [step, setStep] = useState<'auth' | 'importing' | 'completed'>('auth');
  const [importStep, setImportStep] = useState(0);

  // Shopify Real vs Demo state
  const isShopify = platformId === 'shopify';
  const [shopifyConfigured, setShopifyConfigured] = useState<boolean | null>(null);
  const [shopifyError, setShopifyError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    if (isShopify) {
      getShopifyStatus().then((status) => {
        setShopifyConfigured(status.configured);
      });
    }
  }, [isShopify]);

  const importItems = [
    'Connecting OAuth 2.0 token...',
    'Importing order history...',
    'Syncing payment gateways & UPI refs...',
    'Fetching refund policy & delivery status...',
  ];

  const handleRealShopifyAuth = async () => {
    setIsAuthenticating(true);
    setShopifyError(null);
    try {
      const authResult = await initiateShopifyAuth();
      if (authResult.error) {
        setShopifyError(authResult.error);
        setIsAuthenticating(false);
        return;
      }

      if (authResult.url) {
        // Listen for OAuth message from popup
        const handleMessage = async (event: MessageEvent) => {
          if (event.data?.type === 'OAUTH_AUTH_SUCCESS' && event.data?.provider === 'shopify') {
            window.removeEventListener('message', handleMessage);
            setIsAuthenticating(false);
            setStep('importing');
            for (let i = 0; i < importItems.length; i++) {
              setImportStep(i);
              await new Promise((r) => setTimeout(r, 400));
            }
            await connectPlatform('shopify');
            setStep('completed');
          }
        };

        window.addEventListener('message', handleMessage);

        // Open popup
        const width = 600;
        const height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        window.open(
          authResult.url,
          'ShopifyOAuth',
          `width=${width},height=${height},top=${top},left=${left}`
        );
      }
    } catch (err: any) {
      setShopifyError(err.message || 'Failed to initiate Shopify authentication.');
      setIsAuthenticating(false);
    }
  };

  const handleAuthorize = async () => {
    setStep('importing');
    for (let i = 0; i < importItems.length; i++) {
      setImportStep(i);
      await new Promise((r) => setTimeout(r, 600));
    }
    await connectPlatform(platformId);
    setStep('completed');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 text-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {step === 'auth' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <PlatformBadge platform={platformId} size="lg" />
              {isShopify && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Real Integration
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold text-slate-100">
              Connect {platformName} Account
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {isShopify
                ? 'Connect via official Shopify OAuth 2.0 to access your real customer profile, orders, and fulfillment tracking.'
                : `ResolveHub will connect to ${platformName} via secure OAuth simulation to inspect orders, verify charges, and automate resolutions.`}
            </p>

            {isShopify && shopifyConfigured === false && (
              <div className="my-4 p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-xs text-amber-200 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-amber-300">Shopify integration is not configured.</p>
                  <p className="text-[11px] text-amber-400/90">
                    Add the Shopify environment variables to enable the real connector. You can still test in Demo Mode below.
                  </p>
                </div>
              </div>
            )}

            {shopifyError && (
              <div className="my-3 p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-xs text-rose-300">
                {shopifyError}
              </div>
            )}

            <div className="my-4 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2 font-medium text-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Requested Permissions
              </div>
              <ul className="space-y-1.5 pl-6 list-disc text-slate-400 text-[11px]">
                <li>Read customer profile & contact details</li>
                <li>Read itemized order history & pricing</li>
                <li>Inspect fulfillment status & tracking URLs</li>
              </ul>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-6">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Encrypted OAuth credentials. No raw secrets saved.</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              {isShopify ? (
                <div className="w-full flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleRealShopifyAuth}
                    disabled={isAuthenticating}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-xs font-semibold text-white shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isAuthenticating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ExternalLink className="w-4 h-4" />
                    )}
                    <span>Connect Shopify (OAuth)</span>
                  </button>
                  <button
                    onClick={handleAuthorize}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Demo Mode
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAuthorize}
                  className="w-full sm:flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Authorize & Connect</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {step === 'importing' && (
          <div className="py-6 text-center space-y-4">
            <div className="inline-flex p-3 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Connecting {platformName}...
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Please wait while ResolveHub syncs your platform data.
              </p>
            </div>

            <div className="space-y-2 text-left bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono">
              {importItems.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 ${
                    idx <= importStep ? 'text-emerald-400' : 'text-slate-600'
                  }`}
                >
                  {idx <= importStep ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-700" />
                  )}
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'completed' && (
          <div className="py-6 text-center space-y-4">
            <div className="inline-flex p-3 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">
                ✓ {platformName} Connected Successfully!
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Imported orders, payment references, and refund history into your unified workspace.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-lg transition-all cursor-pointer"
            >
              Done & Return
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
