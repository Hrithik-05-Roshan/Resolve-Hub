import { UnifiedCustomer } from './types';

export async function getCustomerProfile(): Promise<UnifiedCustomer> {
  const res = await fetch('/api/shopify/customer');
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to fetch Shopify customer profile');
  }
  return await res.json();
}
