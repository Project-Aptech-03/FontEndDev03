
import { endpoints } from '../config/endpoint';
import {
  CreateCouponRequest,
  CouponApiResponse, 
  CouponsApiResponse,
  ApplyCouponRequest,
  ApplyCouponResponse
} from '../@type/coupon';
import apiClient from "../services/api";

export const couponApi = {
  // Get all coupons
  getCoupons: async (): Promise<CouponsApiResponse> => {
    try {
      const response = await apiClient.get(endpoints.getCoupons);
      return response.data;
    } catch (error) {
      console.error('Error fetching coupons:', error);
      throw error;
    }
  },

  // Get coupon by ID
  getCouponById: async (id: number): Promise<CouponApiResponse> => {
    try {
      const response = await apiClient.get(
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
      const response = await apiClient.post(endpoints.createCoupon, couponData);
      return response.data;
    } catch (error) {
      console.error('Error creating coupon:', error);
      throw error;
    }
  },

  // Update coupon
  updateCoupon: async (id: number, couponData: CreateCouponRequest): Promise<CouponApiResponse> => {
    try {
      const response = await apiClient.put(
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
      const response = await apiClient.delete(
        endpoints.deleteCoupon.replace('{id}', id.toString())
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting coupon:', error);
      throw error;
    }
  },

  applyCoupon: async (request: ApplyCouponRequest): Promise<ApplyCouponResponse> => {
    try {
      const response = await apiClient.post(endpoints.applyCoupon, request);
      return response.data;
    } catch (error) {
      console.error('Error applying coupon:', error);
      throw error;
    }
  }
};
