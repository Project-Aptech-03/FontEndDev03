export interface Coupon {
  id: number;
  couponCode: string;
  couponName: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number;
  quantity: number;
  startDate: string;
  endDate: string;
  isAutoApply: boolean;
  isActive: boolean;
  createdDate: string;
  isValid: boolean;
  isExpired: boolean;
  status: string;
  discountDisplay: string;
}

export interface CreateCouponRequest {
  couponCode: string;
  couponName: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number;
  quantity: number;
  startDate: string;
  endDate: string;
  isAutoApply: boolean;
  isActive: boolean;
}

export interface UpdateCouponRequest extends CreateCouponRequest {
  id: number;
}

export interface CouponApiResponse {
  success: boolean;
  message: string;
  data: Coupon;
  errors: any;
  statusCode: number;
}

export interface ApplyCouponRequest {
  couponCode: string;
  orderAmount: number;
}

export interface ApplyCouponResponse {
  success: boolean;
  message: string;
  data: {
    couponCode: string;
    discountAmount: number;
    discountType: 'percentage' | 'fixed';
    finalAmount: number;
  };
  errors: any;
  statusCode: number;
}

export interface CouponsApiResponse {
  success: boolean;
  message: string;
  data: Coupon[];
  errors: any;
  statusCode: number;
}
