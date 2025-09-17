import apiClient from "../services/api";
import { ApiResponse } from "../@type/apiResponse";
import { 
  ApiOrder, 
  CheckoutRequest, 
  UpdateOrderRequest, 
  CancelOrderRequest 
} from "../@type/Orders";

export const getMyOrders = async (): Promise<{ success: boolean; result?: ApiResponse<ApiOrder[]>; error?: any }> => {
    try {
        const response = await apiClient.get<ApiResponse<ApiOrder[]>>("/orders/my-orders");
        return { success: true, result: response.data };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data || { message: "Unknown error" },
        };
    }
};

export const getAllOrders = async (): Promise<{ success: boolean; result?: ApiResponse<ApiOrder[]>; error?: any }> => {
    try {
        const response = await apiClient.get<ApiResponse<ApiOrder[]>>("/orders");
        return { success: true, result: response.data };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data || { message: "Unknown error" },
        };
    }
};

export const updateOrder = async (orderId: number, data: UpdateOrderRequest): Promise<{ success: boolean; result?: ApiResponse<ApiOrder>; error?: any }> => {
    try {
        const response = await apiClient.put<ApiResponse<ApiOrder>>(`/orders/${orderId}/status`, data);
        return { success: true, result: response.data };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data || { message: "Unknown error" },
        };
    }
};

export const cancelOrder = async (orderId: number, data: CancelOrderRequest): Promise<{ success: boolean; result?: ApiResponse<boolean>; error?: any }> => {
    try {
        console.log(`Calling cancel API for order ${orderId} with data:`, data);
        const response = await apiClient.post<ApiResponse<boolean>>(`/orders/${orderId}/cancel`, data);
        console.log('Cancel API response:', response.data);
        return { success: true, result: response.data };
    } catch (error: any) {
        console.error('Cancel API error:', error);
        const errorData = error.response?.data || { message: error.message || "Unknown error" };
        return {
            success: false,
            error: errorData,
        };
    }
};

export const getNextOrderCode = async (): Promise<{ success: boolean; result?: ApiResponse<string>; error?: any }> => {
    try {
        const response = await apiClient.get<ApiResponse<string>>('/orders/next-order-code');
        return { success: true, result: response.data };
    } catch (error: any) {
        console.error('Get next order code error:', error);
        const errorData = error.response?.data || { message: error.message || "Unknown error" };
        return {
            success: false,
            error: errorData,
        };
    }
};

export const checkoutOrder = async (data: CheckoutRequest): Promise<{ success: boolean; result?: ApiResponse<any>; error?: any }> => {
    try {
        const response = await apiClient.post<ApiResponse<any>>('/orders/checkout', data);
        return { success: true, result: response.data };
    } catch (error: any) {
        console.error('Checkout order error:', error);
        const errorData = error.response?.data || { message: error.message || "Unknown error" };
        return {
            success: false,
            error: errorData,
        };
    }
};
