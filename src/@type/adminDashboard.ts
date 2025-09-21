
type ProductDto = {
    id: number;
    productCode?: string;
    productName: string;
    description?: string;
    author?: string;
    productType?: string;
    pages?: number | null;
    weight?: number | null;
    price?: number;
    stockQuantity: number;
    isActive?: boolean;
    createdDate?: string;
    category?: {
        id: number;
        categoryCode?: string;
        categoryName: string;
        productCount?: number;
        subCategories?: any[];
    } | null;
    manufacturer?: {
        id: number;
        manufacturerName?: string;
    } | null;
    photos?: Array<{ id: number; photoUrl: string }>;
};

type PagedResultProducts = {
    items: ProductDto[];
    totalCount: number;
    pageIndex: number;
    pageSize: number;
    totalPages: number;
};

type UserDto = {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    role?: string;
    phoneNumber?: string;
    dateOfBirth?: string | null;
    avatarUrl?: string | null;
    address?: string;
};

type PagedResultUsers = {
    items: UserDto[];
    totalCount: number;
    pageIndex: number;
    pageSize: number;
    totalPages: number;
};

// Order types based on the document
type ApiOrder = {
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
    appliedCoupons?: any;
    deliveryNotes?: string;
    cancellationReason?: string | null;
    cancelledDate?: string | null;
    isActive: boolean;
    createdDate: string;
    updatedDate: string;
    customer: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        fullName: string;
    };
    orderItems: Array<{
        id: number;
        orderId: number;
        productId: number;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
        product: {
            id: number;
            productName: string;
            category?: {
                categoryName: string;
            };
        };
    }>;
};
