import {ProductFormData, ProductPhoto} from "./products";

export interface CategoryDto {
    id: number;
    categoryCode: string;
    categoryName: string;
    isActive: boolean;
    createdDate: string;
    productCount: number;
}

export interface ManufacturerDto {
    id: number;
    manufacturerCode: string;
    manufacturerName: string;
    isActive: boolean;
    createdDate: string;
    productCount: number;
}

export interface PublisherDto {
    id: number;
    publisherName: string;
    publisherAddress: string;
    contactInfo: string;
    isActive: boolean;
    createdDate: string;
    productCount: number;
}

export interface ProductsResponseDto {
    id: number;
    productCode: string;
    productName: string;
    description: string;
    author: string;
    productType: string;
    pages: number;
    dimensionLength: number;
    dimensionWidth: number ;
    dimensionHeight: number;
    weight: number;
    price: number;
    stockQuantity: number;
    isActive: boolean;
    createdDate: string;
    category: CategoryDto | null;
    manufacturer: ManufacturerDto | null;
    publisher: PublisherDto | null;
    photos: ProductPhoto[];
}
