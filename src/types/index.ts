export type PlatformId = 'shopify' | 'amazon' | 'swiggy' | 'zomato' | 'flipkart' | 'uber' | 'myntra' | 'meesho';

export interface Platform {
  platformId: PlatformId;
  name: string;
  category: 'E-commerce' | 'Food Delivery' | 'Mobility' | 'Fashion' | 'Quick Commerce';
  icon: string;
  connected: boolean;
  syncStatus?: 'Synced' | 'Syncing' | 'Disconnected' | 'Error';
  lastSynced?: string;
  orderCount?: number;
  totalSpent?: number;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  status?: 'Delivered' | 'Missing' | 'Damaged' | 'Pending';
}

export interface Order {
  orderId: string;
  platform: PlatformId;
  platformName: string;
  items: OrderItem[];
  amount: number;
  currency: string;
  paymentStatus: 'Paid' | 'Duplicate Charge' | 'Pending' | 'Refunded';
  paymentMethod: string;
  deliveryStatus: 'Delivered' | 'In Transit' | 'Delayed' | 'Cancelled';
  date: string;
  refundEligible: boolean;
  returnEligible: boolean;
  trackingNumber?: string;
  deliveryTimeMinutes?: number;
  vendorName?: string;
}

export type IssueType =
  | 'missing_item'
  | 'damaged_product'
  | 'duplicate_payment'
  | 'delayed_order'
  | 'wrong_product'
  | 'refund_request'
  | 'other';

export type IssueStatus =
  | 'open'
  | 'investigating'
  | 'action_pending'
  | 'resolved'
  | 'escalated'
  | 'failed';

export interface ConfidenceBreakdown {
  classification: number;
  orderId: number;
  policy: number;
  decision: number;
}

export interface Issue {
  issueId: string;
  userId: string;
  platform: PlatformId;
  orderId?: string;
  description: string;
  issueType: IssueType;
  status: IssueStatus;
  resolution?: string;
  confidence: number;
  confidenceBreakdown?: ConfidenceBreakdown;
  refundAmount?: number;
  requiresHuman?: boolean;
  escalationReason?: string;
  escalationTicket?: string;
  createdAt: string;
  resolvedAt?: string;
  actions?: ActionStep[];
}

export interface ActionStep {
  actionId: string;
  issueId: string;
  stepName: string;
  description: string;
  tool: string;
  input?: any;
  output?: any;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'requires_confirmation' | 'warning';
  timestamp: string;
  durationMs?: number;
}

export interface AuditLogEntry {
  id: string;
  issueId?: string;
  timestamp: string;
  actor: 'USER' | 'GEMINI' | 'TOOL' | 'SYSTEM';
  action: string;
  input?: string;
  output?: string;
  status: 'success' | 'warning' | 'error' | 'info';
  details?: any;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  timestamp: string;
  read: boolean;
  issueId?: string;
  amount?: number;
}

export interface DemoScenario {
  id: string;
  title: string;
  query: string;
  platform: PlatformId;
  description: string;
  orderId: string;
  expectedAction: string;
  sampleRefund?: number;
  badge: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  authProvider?: 'google' | 'email' | 'demo';
  connectedPlatformsCount: number;
  autoRefundThreshold: number; // e.g. 1000 INR
  notificationsEnabled: boolean;
  autoExecuteEnabled: boolean;
  humanEscalationEnabled: boolean;
}
