import {
  ResolutionEligibility,
  ResolutionResult,
  VerificationResult,
  UnifiedOrder,
} from './types';

export async function checkResolutionEligibility(
  orderId: string,
  issueType: string
): Promise<ResolutionEligibility> {
  const res = await fetch(
    `/api/shopify/orders/${encodeURIComponent(orderId)}/eligibility?issueType=${encodeURIComponent(issueType)}`
  );
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to check eligibility');
  }
  return await res.json();
}

export async function getAdminOrder(orderId: string): Promise<UnifiedOrder> {
  const res = await fetch(`/api/shopify/admin/orders/${encodeURIComponent(orderId)}`);
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Action requires merchant authorization.');
  }
  return await res.json();
}

export async function createReturn(
  orderId: string,
  reason?: string
): Promise<ResolutionResult> {
  const res = await fetch('/api/shopify/actions/return', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, reason }),
  });
  const data = await res.json();
  if (!res.ok || data.status === 'merchant_authorization_required') {
    return {
      success: false,
      status: 'merchant_authorization_required',
      message: data.message || 'Action requires merchant authorization.',
    };
  }
  return data;
}

export async function createRefund(
  orderId: string,
  amount?: number,
  reason?: string
): Promise<ResolutionResult> {
  const res = await fetch('/api/shopify/actions/refund', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, amount, reason }),
  });
  const data = await res.json();
  if (!res.ok || data.status === 'merchant_authorization_required') {
    return {
      success: false,
      status: 'merchant_authorization_required',
      message: data.message || 'Action requires merchant authorization.',
    };
  }
  return data;
}

export async function verifyAction(actionId: string): Promise<VerificationResult> {
  const res = await fetch(`/api/shopify/actions/verify?actionId=${encodeURIComponent(actionId)}`);
  if (!res.ok) {
    return {
      actionId,
      verified: false,
      status: 'unverified',
      timestamp: new Date().toISOString(),
      details: 'Action verification unconfirmed by store endpoint.',
    };
  }
  return await res.json();
}
