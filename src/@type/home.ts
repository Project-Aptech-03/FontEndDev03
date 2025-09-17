
interface Book {
    id: number;
    productCode: string;
    productName: string;
    description: string;
    author: string;
    productType: string;
    pages: number;
    dimensionLength: number;
    dimensionWidth: number;
    dimensionHeight: number;
    weight: number;
    price: number;
    stockQuantity: number;
    isActive: boolean;
    createdDate: string;
    category: {
        id: number;
        categoryCode: string;
        categoryName: string;
        isActive: boolean;
        createdDate: string;
        productCount: number;
    } | null;
    manufacturer: {
        id: number;
        manufacturerCode: string;
        manufacturerName: string;
        isActive: boolean;
        createdDate: string;
        productCount: number;
    } | null;
    publisher: {
        id: number;
        publisherName: string;
        publisherAddress: string;
        contactInfo: string;
        isActive: boolean;
        createdDate: string;
        productCount: number;
    } | null;
    photos: Array<{
        id: number;
        photoUrl: string;
        isActive: boolean;
        createdDate: string;
    }>;
    // Additional display fields
    rating?: number;
    reviewCount?: number;
    originalPrice?: number;
    totalQuantity?: number;
}
