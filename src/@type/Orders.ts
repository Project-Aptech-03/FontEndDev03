import { ApiResponse } from './apiResponse';

// ===========================================
// SHARED BASE INTERFACES
// ===========================================

// Common enums/types
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'COD' | 'BankTransfer';
export type DiscountType = 'percentage' | 'fixed';

// Base product interface (shared between cart and orders)
export interface BaseProduct {
  id: number;
  productName: string;
  price: number;
  stockQuantity?: number;
  photos?: Array<{
    id: number;
    photoUrl: string;
    isActive: boolean;
    createdDate: string;
  }>;
}

// Base address interface (can be extended for different use cases)
export interface BaseAddress {
  id: number;
  fullName: string;
  phoneNumber: string;
  fullAddress?: string;
  displayAddress?: string;
  district?: string;
  city?: string;
  province?: string;
  ward?: string;
  isDefault: boolean;
  isActive: boolean;
}

// Customer base interface
export interface BaseCustomer {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
}

// ===========================================
// API-SPECIFIC INTERFACES (From Backend)
// ===========================================

export interface ApiProduct extends BaseProduct {
  productCode: string;
  description: string;
  author: string;
  productType: string;
  pages: number;
  dimensions: string;
  weight: number;
  createdDate: string;
  category: any;
  manufacturer: any;
  publisher: any;
}

export interface ApiCustomer extends BaseCustomer {
  firstName: string;
  lastName: string;
  avataUrl: string | null;
  address: string;
  role: string | null;
  dateOfBirth: string;
}

export interface ApiAddress extends BaseAddress {
  userId: string;
  postalCode: string;
  distanceKm: number;
  createdDate: string;
  displayShippingFee: string;
  displayContactInfo: string;
  displayDistance: string;
}

export interface ApiOrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  discountAmount: number;
  totalPrice: number;
  notes: string;
  product: ApiProduct;

}
export interface TopProduct {
  productId: number;
  productName: string;
  totalQuantity: number;
}

export interface ApiOrder {
  id: number;
  orderNumber: string;
  customerId: string;
  deliveryAddressId: number;
  orderDate: string;
  subtotal: number;
  couponDiscountAmount: number;
  deliveryCharges: number;
  totalAmount: number;
  orderStatus: string;
  paymentType: string;
  paymentStatus: string;
  appliedCoupons: string;
  deliveryNotes: string;
  isActive: boolean;
  createdDate: string;
  updatedDate: string;
  customer: ApiCustomer;
  deliveryAddress: ApiAddress;
  orderItems: ApiOrderItem[];
  payments: any[];
}

// ===========================================
// UI/FRONTEND INTERFACES
// ===========================================

// Simplified interfaces for UI display
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: BaseCustomer & {
    address: string;
    city: string;
    district: string;
    ward: string;
  };
  orderDate: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  totalAmount: number;
  shippingFee: number;
  discountAmount: number;
  finalAmount: number;
  items: OrderItem[];
  notes: string;
  shippingAddress: string;
  estimatedDelivery: string;
}

// ===========================================
// CART & CHECKOUT INTERFACES
// ===========================================

export interface CartProduct {
  id: number;
  productId?: number;
  product?: BaseProduct & {
    image?: string;
  };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Unified address interface for checkout (combines different address sources)
export interface CheckoutAddress extends BaseAddress {
  _idx: number; // For compatibility with existing cart system
  addressLine?: string;
  addressName?: string;
  shippingFee?: number;
}

export interface AppliedCoupon {
  code: string;
  discountAmount: number;
  discountType: DiscountType;
}

export interface CheckoutData {
  orderCode: string;
  products: CartProduct[];
  address: CheckoutAddress;
  coupon: AppliedCoupon | null;
  orderNote: string;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
}

// ===========================================
// API REQUEST/RESPONSE INTERFACES
// ===========================================

export interface CheckoutRequest {
  deliveryAddressId: number;
  paymentType: string;
  deliveryCharges: number;
  deliveryNotes: string;
  couponCodes: string[];
  orderItems: {
    productId: number;
    quantity: number;
  }[];
}

export interface UpdateOrderRequest {
  orderStatus?: string;
  paymentStatus?: string;
}

export interface CancelOrderRequest {
  cancellationReason: string;
}

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

// Helper function to safely get image URL from photos array
export const getProductImageUrl = (photos?: Array<{ photoUrl: string; id: number; isActive: boolean; createdDate: string } | { imageUrl: string } | string>, fallback: string = '/api/placeholder/60/80'): string => {
  if (!photos || photos.length === 0) return fallback;
  
  const firstPhoto = photos[0];
  if (typeof firstPhoto === 'string') {
    return firstPhoto;
  } else if (firstPhoto && typeof firstPhoto === 'object') {
    // Check for photoUrl property (new structure)
    if ('photoUrl' in firstPhoto) {
      return firstPhoto.photoUrl;
    }
    // Check for imageUrl property (old structure)
    if ('imageUrl' in firstPhoto) {
      return firstPhoto.imageUrl;
    }
  }
  
  return fallback;
};

export type ApiToUiOrder = Omit<ApiOrder, 'customer' | 'deliveryAddress' | 'orderItems'> & {
  customer: BaseCustomer & {
    address: string;
    city: string;
    district: string;
    ward: string;
  };
  items: OrderItem[];
  shippingAddress: string;
};

export const isApiOrder = (order: any): order is ApiOrder => {
  return typeof order === 'object' && 
         typeof order.id === 'number' && 
         typeof order.orderNumber === 'string';
};

export const isUiOrder = (order: any): order is Order => {
  return typeof order === 'object' && 
         typeof order.id === 'string' && 
         typeof order.orderNumber === 'string';
};
