export interface CustomerAddress {
  id: number;
  addressName: string;
  fullName: string;
  phoneNumber: string;
  fullAddress: string;
  isDefault: boolean;
  isActive: boolean;
  shippingFee?: number;
  distance?: number;
  displayDistance?: string;
  displayShippingFee?: string;
  _idx?: number; // For internal indexing in UI
}

export interface CreateAddressRequest {
  addressName: string;
  fullName: string;
  phoneNumber: string;
  fullAddress: string;
  isDefault?: boolean;
}

export interface UpdateAddressRequest {
  addressName?: string;
  fullName?: string;
  phoneNumber?: string;
  fullAddress?: string;
  isDefault?: boolean;
}

export interface AddressApiResponse {
  success: boolean;
  message?: string;
  data?: CustomerAddress;
}

export interface AddressListApiResponse {
  success: boolean;
  message?: string;
  data?: CustomerAddress[];
}
