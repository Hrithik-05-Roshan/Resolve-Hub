import { ShipmentStatus } from './types';

export async function getFulfillmentStatus(orderId: string): Promise<ShipmentStatus> {
  const res = await fetch(`/api/shopify/orders/${encodeURIComponent(orderId)}/fulfillment`);
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Failed to fetch fulfillment status for ${orderId}`);
  }
  return await res.json();
}

export async function getTrackingInformation(orderId: string): Promise<ShipmentStatus> {
  return getFulfillmentStatus(orderId);
}
