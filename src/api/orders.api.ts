import apiClient from "../services/api";

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    errors: any;
    statusCode: number;
}

export interface DeliveryAddress {
    id: number;
    userId: string;
    fullAddress: string;
    district: string;
    city: string;
    postalCode: string;
    distanceKm: number;
    isDefault: boolean;
    isActive: boolean;
    createdDate: string;
    displayAddress: string;
}

export interface Product {
    id: number;
    productCode: string;
    productName: string;
    description: string;
    author: string;
    productType: string;
    pages: number;
    dimensions: string;
    weight: number;
    price: number;
    stockQuantity: number;
    isActive: boolean;
    createdDate: string;
    category: any;
    manufacturer: any;
    publisher: any;
    photos: any[];
}

export interface OrderItem {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    discountPercent: number;
    discountAmount: number;
    totalPrice: number;
    notes: string;
    product: Product;
}

export interface Customer {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avataUrl: string | null;
    fullName: string;
    address: string;
    role: string | null;
    phoneNumber: string;
    dateOfBirth: string;
}

export interface Order {
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
    customer: Customer;
    deliveryAddress: DeliveryAddress;
    orderItems: OrderItem[];
    payments: any[];
}

export const getMyOrders = async (): Promise<{ success: boolean; result?: ApiResponse<Order[]>; error?: any }> => {
    try {
        const response = await apiClient.get<ApiResponse<Order[]>>("/orders/my-orders");
        return { success: true, result: response.data };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data || { message: "Unknown error" },
        };
    }
};

// Admin APIs
export const getAllOrders = async (): Promise<{ success: boolean; result?: ApiResponse<Order[]>; error?: any }> => {
    try {
        const response = await apiClient.get<ApiResponse<Order[]>>("/orders");
        return { success: true, result: response.data };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data || { message: "Unknown error" },
        };
    }
};

export interface UpdateOrderRequest {
    orderStatus?: string;
    paymentStatus?: string;
}

export const updateOrder = async (orderId: number, data: UpdateOrderRequest): Promise<{ success: boolean; result?: ApiResponse<Order>; error?: any }> => {
    try {
        const response = await apiClient.put<ApiResponse<Order>>(`/orders/${orderId}/status`, data);
        return { success: true, result: response.data };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data || { message: "Unknown error" },
        };
    }
};

export interface CancelOrderRequest {
    cancellationReason: string;
}

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
