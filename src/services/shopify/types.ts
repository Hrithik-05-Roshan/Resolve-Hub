export interface ConnectedAccount {
  id: string;
  userId: string;
  provider: "shopify";
  providerAccountId?: string;
  storeDomain?: string;
  accessTokenEncrypted?: string;
  refreshTokenEncrypted?: string;
  scopes: string[];
  tokenExpiresAt?: string;
  status: "connected" | "expired" | "revoked" | "error";
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  country?: string;
  zip?: string;
}

export interface UnifiedCustomer {
  id: string;
  platform: "shopify";
  name?: string;
  email?: string;
  addresses?: Address[];
}

export interface OrderItem {
  id?: string;
  name: string;
  quantity: number;
  price: number;
}

export interface UnifiedOrder {
  id: string;
  platform: "shopify";
  orderNumber?: string;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  paymentStatus?: string;
  fulfillmentStatus?: string;
  createdAt: string;
  updatedAt?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  returnEligible?: boolean;
  refundEligible?: boolean;
  vendorName?: string;
}

export interface ShipmentStatus {
  orderId: string;
  status: string;
  carrier?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  milestones?: {
    time: string;
    description: string;
    location?: string;
  }[];
}

export interface ResolutionEligibility {
  eligible: boolean;
  reason?: string;
  maxRefundAmount?: number;
  requiresMerchantAuth?: boolean;
}

export interface ResolutionAction {
  orderId: string;
  actionType: "refund" | "return" | "replacement";
  amount?: number;
  reason?: string;
}

export interface ResolutionResult {
  success: boolean;
  actionId?: string;
  message: string;
  status: "completed" | "merchant_authorization_required" | "failed";
  refundAmount?: number;
}

export interface VerificationResult {
  actionId: string;
  verified: boolean;
  status: string;
  timestamp: string;
  details?: string;
}

export interface EcommerceConnector {
  getCustomer(): Promise<UnifiedCustomer>;
  getOrders(): Promise<UnifiedOrder[]>;
  getOrder(orderId: string): Promise<UnifiedOrder>;
  getShipment(orderId: string): Promise<ShipmentStatus>;
  checkResolutionEligibility(
    orderId: string,
    issueType: string
  ): Promise<ResolutionEligibility>;
  executeResolution(
    action: ResolutionAction
  ): Promise<ResolutionResult>;
  verifyAction(
    actionId: string
  ): Promise<VerificationResult>;
}
