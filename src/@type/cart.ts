export interface Category {
  id: number;
  categoryCode: string;
  categoryName: string;
  isActive: boolean;
  createdDate: string;
  productCount: number;
}

export interface Manufacturer {
  id: number;
  manufacturerCode: string;
  manufacturerName: string;
  isActive: boolean;
  createdDate: string;
  productCount: number;
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
  category: Category;
  manufacturer: Manufacturer;
  publisher: any;
  photos: any[];
}

export interface CartItem {
  id: number;
  userId: string;
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  addedDate: string;
  updatedDate: string;
  product: Product;
}

export interface CartApiResponse {
  success: boolean;
  message: string;
  data: CartItem[];
  errors: any;
  statusCode: number;
}

export interface SingleCartItemResponse {
  success: boolean;
  message: string;
  data: CartItem;
  errors: any;
  statusCode: number;
}
