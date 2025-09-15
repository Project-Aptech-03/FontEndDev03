import apiClient from '../services/api';
import { ApiResponse } from '../@type/apiResponse';
import { 
  CustomerAddress, 
  CreateCustomerAddressDto, 
  UpdateCustomerAddressDto,
  CustomerAddressResponse,
  SingleCustomerAddressResponse 
} from '../@type/customerAddress';

// Customer Address API methods
export const customerAddressApi = {
  // Get all customer addresses
  getAddresses: async (): Promise<CustomerAddressResponse> => {
    try {
      const response = await apiClient.get<CustomerAddressResponse>('/CustomerAddress');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching customer addresses:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch addresses',
        data: [],
        errors: error.response?.data?.errors || null,
        statusCode: error.response?.status || 500
      };
    }
  },

  // Create new customer address
  createAddress: async (addressData: CreateCustomerAddressDto): Promise<SingleCustomerAddressResponse> => {
    try {
      const response = await apiClient.post<SingleCustomerAddressResponse>('/CustomerAddress', addressData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating customer address:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create address',
        data: {} as CustomerAddress,
        errors: error.response?.data?.errors || null,
        statusCode: error.response?.status || 500
      };
    }
  },

  // Update customer address
  updateAddress: async (id: number, addressData: UpdateCustomerAddressDto): Promise<SingleCustomerAddressResponse> => {
    try {
      const response = await apiClient.put<SingleCustomerAddressResponse>(`/CustomerAddress/${id}`, addressData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating customer address:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update address',
        data: {} as CustomerAddress,
        errors: error.response?.data?.errors || null,
        statusCode: error.response?.status || 500
      };
    }
  },

  // Set default address
  setDefaultAddress: async (id: number): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.put<ApiResponse<any>>(`/CustomerAddress/${id}/set-default`);
      return response.data;
    } catch (error: any) {
      console.error('Error setting default address:', error);
      return {
        success: false,
        statusCode: error.response?.status || 500,
        message: error.response?.data?.message || 'Failed to set default address',
        data: null
      };
    }
  },

  // Delete address (set IsActive = false)
  deleteAddress: async (id: number): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.delete<ApiResponse<any>>(`/CustomerAddress/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting customer address:', error);
      return {
        success: false,
        statusCode: error.response?.status || 500,
        message: error.response?.data?.message || 'Failed to delete address',
        data: null
      };
    }
  }
};
