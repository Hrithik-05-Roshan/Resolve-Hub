import { ConnectedAccount } from './types';

export interface ShopifyStatusResponse {
  configured: boolean;
  connected: boolean;
  storeDomain?: string;
  account?: ConnectedAccount;
  customerName?: string;
  orderCount?: number;
  lastSynced?: string;
  missingVars?: string[];
}

export async function getShopifyStatus(): Promise<ShopifyStatusResponse> {
  try {
    const res = await fetch('/api/shopify/status');
    if (!res.ok) {
      throw new Error('Failed to fetch Shopify status');
    }
    return await res.json();
  } catch (err) {
    console.warn('Error checking Shopify status:', err);
    return { configured: false, connected: false };
  }
}

export async function initiateShopifyAuth(): Promise<{ url?: string; error?: string }> {
  try {
    const res = await fetch('/api/shopify/auth');
    const data = await res.json();
    if (!res.ok) {
      return { error: data.error || 'Failed to generate authorization URL' };
    }
    return { url: data.url };
  } catch (err: any) {
    return { error: err.message || 'Network error starting Shopify auth' };
  }
}

export async function disconnectShopify(): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch('/api/shopify/disconnect', { method: 'POST' });
    const data = await res.json();
    return { success: res.ok, message: data.message };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}
