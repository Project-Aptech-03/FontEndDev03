import { axiosInstance } from '../config/axios';
import { endpoints } from '../config/endpoint';
import { 
  Coupon, 
  CreateCouponRequest, 
  UpdateCouponRequest, 
  CouponApiResponse, 
  CouponsApiResponse,
  ApplyCouponRequest,
  ApplyCouponResponse
} from '../@type/coupon';

export const couponApi = {
  // Get all coupons
  getCoupons: async (): Promise<CouponsApiResponse> => {
    try {
      const response = await axiosInstance.get(endpoints.getCoupons);
      return response.data;
    } catch (error) {
      console.error('Error fetching coupons:', error);
      throw error;
    }
  },

  // Get coupon by ID
  getCouponById: async (id: number): Promise<CouponApiResponse> => {
    try {
      const response = await axiosInstance.get(
        endpoints.getCouponById.replace('{id}', id.toString())
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching coupon:', error);
      throw error;
    }
  },

  // Create new coupon
  createCoupon: async (couponData: CreateCouponRequest): Promise<CouponApiResponse> => {
    try {
      const response = await axiosInstance.post(endpoints.createCoupon, couponData);
      return response.data;
    } catch (error) {
      console.error('Error creating coupon:', error);
      throw error;
    }
  },

  // Update coupon
  updateCoupon: async (id: number, couponData: CreateCouponRequest): Promise<CouponApiResponse> => {
    try {
      const response = await axiosInstance.put(
        endpoints.updateCoupon.replace('{id}', id.toString()),
        couponData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating coupon:', error);
      throw error;
    }
  },

  // Delete coupon
  deleteCoupon: async (id: number): Promise<CouponApiResponse> => {
    try {
      const response = await axiosInstance.delete(
        endpoints.deleteCoupon.replace('{id}', id.toString())
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting coupon:', error);
      throw error;
    }
  },

  // Apply coupon
  applyCoupon: async (request: ApplyCouponRequest): Promise<ApplyCouponResponse> => {
    try {
      const response = await axiosInstance.post(endpoints.applyCoupon, request);
      return response.data;
    } catch (error) {
      console.error('Error applying coupon:', error);
      throw error;
    }
  }
};
