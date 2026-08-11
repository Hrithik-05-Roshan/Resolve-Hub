import { UnifiedOrder } from './types';

export async function getCustomerOrders(): Promise<UnifiedOrder[]> {
  const res = await fetch('/api/shopify/orders');
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to fetch Shopify orders');
  }
  const data = await res.json();
  return data.orders || [];
}

export async function getCustomerOrder(orderId: string): Promise<UnifiedOrder> {
  const res = await fetch(`/api/shopify/orders/${encodeURIComponent(orderId)}`);
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Failed to fetch Shopify order ${orderId}`);
  }
  return await res.json();
}
