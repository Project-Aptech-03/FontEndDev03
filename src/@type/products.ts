// export interface Category {
//   id: number;
//   categoryCode: string;
//   categoryName: string;
//   isActive: boolean;
//   createdDate: string;
//   productCount: number;
// }

export interface Category {
  id: number;
  categoryCode: string;
  categoryName: string;
  subCategories?: SubCategoryResponseDto[];
  isActive: boolean;
  createdDate: string;
  productCount: number;
}
export interface SubCategoryResponseDto {
    id: number;
    subCategoryCode: string;
    subCategoryName: string;
    isActive: boolean;
    createdDate: string;
    categoryId: number;

}
export interface Manufacturer {
  id: number;
  manufacturerCode: string;
  manufacturerName: string;
  isActive: boolean;
  createdDate: string;
  productCount: number;
}

export interface Publisher {
  id: number;
  publisherName: string;
  publisherAddress: string;
  contactInfo: string;
  isActive: boolean;
  createdDate: string;
  productCount: number;
}

export interface ProductPhoto {
  id: number;
  photoUrl: string;
  isActive: boolean;
  createdDate: string;
}

export interface Products {
  id: number;
  productCode: string;
  productName: string;
  description: string;
  author: string;
  productType: string;
  pages: number | null;
  dimensionLength?: number | null;
  dimensionWidth?: number | null;
  dimensionHeight?: number | null;
  weight?: number | null;
  price: number;
  stockQuantity: number;
  isActive: boolean;
  createdDate: string;

  category: Category | null;
  manufacturer: Manufacturer | null;
  publisher: Publisher | null;
  photos: ProductPhoto[];
}



export interface ProductFormData {
  productCode: string;
  productName: string;
  description: string;
  author: string;
  productType: string;
  pages?: number | null;
  dimensionLength?: number | null;
  dimensionWidth?: number | null;
  dimensionHeight?: number | null;
  weight?: number | null;
  price: number;
  stockQuantity: number;
  isActive: boolean;
  category?: string | null;
  manufacturer?: string | null;
  publisher?: string | null;
  photos?: string[] | string;
  categoryId?: number;
  manufacturerId?: number;
  image?: string;

  validateFields(): ProductFormData;
}

export const toFormData = (data: ProductFormData): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {

      value.forEach((file: any) => {
        if (file.originFileObj) {
          formData.append(key, file.originFileObj);
        } else {
          formData.append(key, file);
        }
      });
    } else {
      formData.append(key, value.toString());
    }
  });

  return formData;
};
