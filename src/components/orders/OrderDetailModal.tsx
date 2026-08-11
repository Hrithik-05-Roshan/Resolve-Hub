import React from 'react';
import { X, Calendar, CreditCard, Clock, Truck, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { Order } from '../../types';
import { PlatformBadge } from '../common/PlatformBadge';
import { useApp } from '../../context/AppContext';

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose }) => {
  const { navigate, submitIssue } = useApp();

  const handleRaiseIssueForOrder = () => {
    onClose();
    navigate('raise_issue');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 text-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <PlatformBadge platform={order.platform} size="sm" />
              <span className="font-mono text-xs font-semibold text-slate-400">
                #{order.orderId}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-100">{order.vendorName || order.platformName}</h3>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold font-mono text-emerald-400">
              {order.currency}{order.amount}
            </div>
            <span
              className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                order.paymentStatus === 'Paid'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : order.paymentStatus === 'Duplicate Charge'
                  ? 'bg-rose-950 text-rose-400 border border-rose-800'
                  : 'bg-amber-950 text-amber-400 border border-amber-800'
              }`}
            >
              {order.paymentStatus}
            </span>
          </div>
        </div>

        {/* Order Details Metadata Grid */}
        <div className="grid grid-cols-2 gap-3 py-4 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
            <span className="text-slate-500 text-[10px] uppercase flex items-center gap-1 font-semibold">
              <Calendar className="w-3 h-3 text-indigo-400" /> Order Date
            </span>
            <span className="text-slate-200 font-medium block mt-0.5">{order.date}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
            <span className="text-slate-500 text-[10px] uppercase flex items-center gap-1 font-semibold">
              <CreditCard className="w-3 h-3 text-indigo-400" /> Payment
            </span>
            <span className="text-slate-200 font-medium block mt-0.5">{order.paymentMethod}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
            <span className="text-slate-500 text-[10px] uppercase flex items-center gap-1 font-semibold">
              <Truck className="w-3 h-3 text-indigo-400" /> Delivery Status
            </span>
            <span className="text-slate-200 font-medium block mt-0.5">{order.deliveryStatus}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
            <span className="text-slate-500 text-[10px] uppercase flex items-center gap-1 font-semibold">
              <Clock className="w-3 h-3 text-indigo-400" /> Resolution Policy
            </span>
            <span className="text-emerald-400 font-medium block mt-0.5">
              {order.refundEligible ? '✓ Refund Eligible' : 'Ineligible'}
            </span>
          </div>
        </div>

        {/* Line Items */}
        <div className="py-3">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Items Ordered ({order.items.length})
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-200">{item.name}</div>
                  <div className="text-[11px] text-slate-400">Qty: {item.quantity}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-semibold text-slate-200">
                    {order.currency}{item.price}
                  </div>
                  {item.status && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        item.status === 'Missing'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : item.status === 'Damaged'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handleRaiseIssueForOrder}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Raise Issue with AI</span>
          </button>
        </div>
      </div>
    </div>
  );
};
