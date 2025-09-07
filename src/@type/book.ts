export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;

  description: string;
  inStock: boolean;

  category?: string;
  manufacturer?: string;
  publisher?: string;

  image: string;
  photos: string[];

  // Thêm các field khác từ API
  productCode?: string;
  productType?: string;
  pages?: number | null;
  dimensions?: string | null;
  weight?: number | null;
  stockQuantity?: number;
  createdDate?: string;
}


export interface FilterState {
  selectedCategories: string[];
  selectedPriceRange: string;
  selectedManufacturers: string[];
  sortBy: string; 
}

export interface PaginationState {
  currentPage: number;
  booksPerPage: number;
}
