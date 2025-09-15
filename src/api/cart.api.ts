import { axiosInstance } from '../config/axios';
import { endpoints } from '../config/endpoint';
import { CartApiResponse, CartItem, SingleCartItemResponse } from '../@type/cart';

export const cartApi = {
  // Get cart items
  getCart: async (): Promise<CartApiResponse> => {
    try {
      const response = await axiosInstance.get(endpoints.getCart);
      return response.data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  },

  // Add item to cart
  addToCart: async (productId: number, quantity: number): Promise<CartApiResponse> => {
    try {
      const response = await axiosInstance.post(endpoints.addToCart, {
        productId,
        quantity
      });
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  // Update cart item quantity
  updateCartItem: async (cartItemId: number, quantity: number): Promise<SingleCartItemResponse> => {
    try {
      const response = await axiosInstance.put(
        endpoints.updateCartItem.replace('{id}', cartItemId.toString()),
        { quantity }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  },

  // Remove item from cart
  removeFromCart: async (cartItemId: number): Promise<CartApiResponse> => {
    try {
      const response = await axiosInstance.delete(
        endpoints.removeFromCart.replace('{id}', cartItemId.toString())
      );
      return response.data;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  // Clear entire cart
  clearCart: async (): Promise<CartApiResponse> => {
    try {
      const response = await axiosInstance.delete(endpoints.clearCart);
      return response.data;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
};
