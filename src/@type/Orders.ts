export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CustomerInfo {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerInfo;
  orderDate: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'cash' | 'credit_card' | 'bank_transfer' | 'e_wallet';
  totalAmount: number;
  shippingFee: number;
  discountAmount: number;
  finalAmount: number;
  items: OrderItem[];
  notes: string;
  shippingAddress: string;
  estimatedDelivery: string;
}
