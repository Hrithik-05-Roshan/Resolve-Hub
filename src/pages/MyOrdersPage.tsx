import React, { useState } from 'react';
import { ShoppingBag, Search, Filter, Calendar, Sparkles, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order, PlatformId } from '../types';
import { PlatformBadge } from '../components/common/PlatformBadge';
import { OrderDetailModal } from '../components/orders/OrderDetailModal';

export const MyOrdersPage: React.FC = () => {
  const { orders, activeFilterPlatform, setActiveFilterPlatform, searchQuery, setSearchQuery } = useApp();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const platformsList = [
    { id: 'all', label: 'All Platforms' },
    { id: 'amazon', label: 'Amazon' },
    { id: 'flipkart', label: 'Flipkart' },
    { id: 'swiggy', label: 'Swiggy' },
    { id: 'zomato', label: 'Zomato' },
    { id: 'uber', label: 'Uber' },
  ];

  const filteredOrders = orders.filter((o) => {
    const matchesPlatform =
      activeFilterPlatform === 'all' || o.platform === activeFilterPlatform;
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      !query ||
      o.orderId.toLowerCase().includes(query) ||
      o.platformName.toLowerCase().includes(query) ||
      (o.vendorName && o.vendorName.toLowerCase().includes(query)) ||
      o.items.some((i) => i.name.toLowerCase().includes(query));

    return matchesPlatform && matchesQuery;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShoppingBag className="w-5 h-5 text-indigo-400" />
            <h1 className="text-2xl font-bold text-slate-100">Unified Orders Database</h1>
          </div>
          <p className="text-xs text-slate-400">
            Real-time feed of transactions imported across all your connected platform accounts.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search orders, items, or IDs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/80 text-xs">
        {platformsList.map((tab) => {
          const isActive = activeFilterPlatform === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilterPlatform(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800">
            No orders found matching the selected filter.
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.orderId}
              onClick={() => setSelectedOrder(order)}
              className="p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-start sm:items-center gap-4 min-w-0">
                <PlatformBadge platform={order.platform} size="md" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-slate-100">
                      #{order.orderId}
                    </span>
                    <span className="text-xs font-semibold text-slate-300">
                      • {order.vendorName || order.platformName}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        order.refundEligible
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {order.refundEligible ? 'Refund Eligible' : 'Standard Policy'}
                    </span>
                  </div>

                  {/* Line Items Preview */}
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                    {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {order.date}
                    </span>
                    <span>• {order.paymentMethod}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
                <div className="text-left sm:text-right">
                  <div className="text-base font-bold font-mono text-slate-100">
                    {order.currency}{order.amount}
                  </div>
                  <span
                    className={`text-[10px] font-mono font-semibold uppercase ${
                      order.paymentStatus === 'Paid'
                        ? 'text-emerald-400'
                        : order.paymentStatus === 'Duplicate Charge'
                        ? 'text-rose-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-slate-800 text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};
