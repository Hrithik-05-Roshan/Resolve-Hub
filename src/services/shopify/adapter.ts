import {
  EcommerceConnector,
  UnifiedCustomer,
  UnifiedOrder,
  ShipmentStatus,
  ResolutionEligibility,
  ResolutionAction,
  ResolutionResult,
  VerificationResult,
} from './types';
import { getCustomerProfile } from './customer';
import { getCustomerOrders, getCustomerOrder } from './orders';
import { getFulfillmentStatus } from './fulfillment';
import {
  checkResolutionEligibility,
  createRefund,
  createReturn,
  verifyAction as verifyAdminAction,
} from './admin';

export class ShopifyConnector implements EcommerceConnector {
  async getCustomer(): Promise<UnifiedCustomer> {
    return getCustomerProfile();
  }

  async getOrders(): Promise<UnifiedOrder[]> {
    return getCustomerOrders();
  }

  async getOrder(orderId: string): Promise<UnifiedOrder> {
    return getCustomerOrder(orderId);
  }

  async getShipment(orderId: string): Promise<ShipmentStatus> {
    return getFulfillmentStatus(orderId);
  }

  async checkResolutionEligibility(
    orderId: string,
    issueType: string
  ): Promise<ResolutionEligibility> {
    return checkResolutionEligibility(orderId, issueType);
  }

  async executeResolution(action: ResolutionAction): Promise<ResolutionResult> {
    if (action.actionType === 'refund') {
      return createRefund(action.orderId, action.amount, action.reason);
    } else if (action.actionType === 'return' || action.actionType === 'replacement') {
      return createReturn(action.orderId, action.reason);
    }
    return {
      success: false,
      status: 'merchant_authorization_required',
      message: 'Action requires merchant authorization.',
    };
  }

  async verifyAction(actionId: string): Promise<VerificationResult> {
    return verifyAdminAction(actionId);
  }
}

export class MockShopifyConnector implements EcommerceConnector {
  private mockCustomer: UnifiedCustomer = {
    id: 'cust_sh_demo_882',
    platform: 'shopify',
    name: 'Customer',
    email: 'customer@store.com',
    addresses: [
      {
        address1: '42 Tech Park Avenue',
        city: 'Bengaluru',
        province: 'Karnataka',
        country: 'India',
        zip: '560103',
      },
    ],
  };

  private mockOrders: UnifiedOrder[] = [
    {
      id: 'SHPF-1008',
      platform: 'shopify',
      orderNumber: '#1008',
      items: [{ id: 'it_1', name: 'Wireless Headphones', quantity: 1, price: 2499 }],
      totalAmount: 2499,
      currency: 'INR',
      paymentStatus: 'PAID',
      fulfillmentStatus: 'DELIVERED',
      createdAt: '2026-08-08T10:30:00Z',
      trackingNumber: 'TRK-SHPF-88210',
      trackingUrl: 'https://track.shopify.com/TRK-SHPF-88210',
      returnEligible: true,
      refundEligible: true,
      vendorName: 'AudioSound Official Store',
    },
    {
      id: 'SHPF-1009',
      platform: 'shopify',
      orderNumber: '#1009',
      items: [{ id: 'it_2', name: 'Mechanical Keyboard RGB', quantity: 1, price: 3299 }],
      totalAmount: 3299,
      currency: 'INR',
      paymentStatus: 'PAID',
      fulfillmentStatus: 'IN_TRANSIT',
      createdAt: '2026-08-09T14:15:00Z',
      trackingNumber: 'TRK-SHPF-88211',
      trackingUrl: 'https://track.shopify.com/TRK-SHPF-88211',
      returnEligible: false,
      refundEligible: false,
      vendorName: 'KeyboardsDirect',
    },
    {
      id: 'SHPF-1010',
      platform: 'shopify',
      orderNumber: '#1010',
      items: [{ id: 'it_3', name: 'USB-C Fast Charging Hub', quantity: 2, price: 899 }],
      totalAmount: 1798,
      currency: 'INR',
      paymentStatus: 'PAID',
      fulfillmentStatus: 'PROCESSING',
      createdAt: '2026-08-10T09:00:00Z',
      trackingNumber: 'TRK-SHPF-88212',
      trackingUrl: 'https://track.shopify.com/TRK-SHPF-88212',
      returnEligible: true,
      refundEligible: true,
      vendorName: 'TechGizmo Store',
    },
  ];

  async getCustomer(): Promise<UnifiedCustomer> {
    return this.mockCustomer;
  }

  async getOrders(): Promise<UnifiedOrder[]> {
    return this.mockOrders;
  }

  async getOrder(orderId: string): Promise<UnifiedOrder> {
    const order = this.mockOrders.find(
      (o) => o.id === orderId || o.orderNumber === orderId || o.id.includes(orderId)
    );
    if (!order) {
      throw new Error(`Order ${orderId} not found in Demo Mode`);
    }
    return order;
  }

  async getShipment(orderId: string): Promise<ShipmentStatus> {
    const order = await this.getOrder(orderId);
    return {
      orderId: order.id,
      status: order.fulfillmentStatus || 'DELIVERED',
      carrier: 'BlueDart Express',
      trackingNumber: order.trackingNumber || 'TRK-SHPF-88210',
      trackingUrl: order.trackingUrl || 'https://track.shopify.com/TRK-SHPF-88210',
      estimatedDelivery: '2026-08-11T18:00:00Z',
      milestones: [
        { time: '2026-08-08T11:00:00Z', description: 'Order confirmed by store' },
        { time: '2026-08-08T15:30:00Z', description: 'Dispatched from seller warehouse' },
        { time: '2026-08-09T08:00:00Z', description: 'Arrived at local distribution center' },
      ],
    };
  }

  async checkResolutionEligibility(
    orderId: string,
    issueType: string
  ): Promise<ResolutionEligibility> {
    const order = await this.getOrder(orderId);
    if (issueType === 'delayed_order' || issueType === 'missing_item') {
      return {
        eligible: true,
        maxRefundAmount: order.totalAmount,
        requiresMerchantAuth: false,
      };
    }
    return {
      eligible: true,
      maxRefundAmount: order.totalAmount,
      requiresMerchantAuth: true,
      reason: 'Replacement / Return requires merchant approval.',
    };
  }

  async executeResolution(action: ResolutionAction): Promise<ResolutionResult> {
    const order = await this.getOrder(action.orderId);
    if (action.actionType === 'refund') {
      return {
        success: true,
        actionId: `ACT-SHPF-REF-${Date.now().toString().slice(-5)}`,
        message: `Refund of ₹${action.amount || order.totalAmount} issued via Shopify Store Gateway.`,
        status: 'completed',
        refundAmount: action.amount || order.totalAmount,
      };
    }
    return {
      success: false,
      status: 'merchant_authorization_required',
      message: 'Action requires merchant authorization.',
    };
  }

  async verifyAction(actionId: string): Promise<VerificationResult> {
    return {
      actionId,
      verified: true,
      status: 'confirmed',
      timestamp: new Date().toISOString(),
      details: 'Transaction verified by Shopify Store API.',
    };
  }
}
