// api/books.api.ts
import apiClient from "../services/api";
import { ApiResponse, PagedResult } from "../@type/apiResponse";
import { Book } from "../@type/book";

interface BooksFilterParams {
    pageNumber: number;
    pageSize: number;
    categories?: string; // comma-separated category names
    priceRange?: string; // e.g., "0-50", "50-100", "100-200"
    manufacturers?: string; // comma-separated manufacturer names
    sortBy?: string; // e.g., "name", "price", "date", "popularity"
    keyword?: string; // search keyword
}

// Get books with filters and pagination
export const getBooksWithFilters = async (params: BooksFilterParams) => {
    // Filter out empty/undefined params
    const filteredParams = Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            acc[key] = value;
        }
        return acc;
    }, {} as any);

    const response = await apiClient.get<ApiResponse<PagedResult<Book>>>(
        "/books",
        { params: filteredParams }
    );
    return response.data;
};

// Get single book by ID
export const getBookById = async (id: number) => {
    const response = await apiClient.get<ApiResponse<Book>>(`/books/${id}`);
    return response.data;
};

// Create new book (admin only)
export const createBook = async (bookData: Omit<Book, 'id'>) => {
    const response = await apiClient.post<ApiResponse<Book>>('/books', bookData);
    return response.data;
};

// Update book (admin only)
export const updateBook = async (id: number, bookData: Partial<Book>) => {
    const response = await apiClient.put<ApiResponse<Book>>(`/books/${id}`, bookData);
    return response.data;
};

// Delete book (admin only)
export const deleteBook = async (id: number) => {
    const response = await apiClient.delete<ApiResponse<boolean>>(`/books/${id}`);
    return response.data;
};

// Get featured/popular books
export const getFeaturedBooks = async (limit: number = 10) => {
    const response = await apiClient.get<ApiResponse<Book[]>>("/books/featured", {
        params: { limit }
    });
    return response.data;
};

// Get books by category
export const getBooksByCategory = async (categoryId: number, pageNumber: number = 1, pageSize: number = 20) => {
    const response = await apiClient.get<ApiResponse<PagedResult<Book>>>(
        `/books/category/${categoryId}`,
        { params: { pageNumber, pageSize } }
    );
    return response.data;
};

// Get books by manufacturer
export const getBooksByManufacturer = async (manufacturerId: number, pageNumber: number = 1, pageSize: number = 20) => {
    const response = await apiClient.get<ApiResponse<PagedResult<Book>>>(
        `/books/manufacturer/${manufacturerId}`,
        { params: { pageNumber, pageSize } }
    );
    return response.data;
};

// Search books
export const searchBooks = async (keyword: string, pageNumber: number = 1, pageSize: number = 20) => {
    const response = await apiClient.get<ApiResponse<PagedResult<Book>>>(
        "/books/search",
        { params: { keyword, pageNumber, pageSize } }
    );
    return response.data;
};

// Get all categories (for filter dropdown)
export const getBookCategories = async () => {
    const response = await apiClient.get<ApiResponse<{ id: number; name: string }[]>>("/books/categories");
    return response.data;
};

// Get all manufacturers (for filter dropdown)
export const getBookManufacturers = async () => {
    const response = await apiClient.get<ApiResponse<{ id: number; name: string }[]>>("/books/manufacturers");
    return response.data;
};

// Get price range stats
export const getPriceRangeStats = async () => {
    const response = await apiClient.get<ApiResponse<{
        minPrice: number;
        maxPrice: number;
        avgPrice: number;
    }>>("/books/price-stats");
    return response.data;
};

// Bulk operations (admin only)
export const bulkUpdateBooks = async (bookIds: number[], updateData: Partial<Book>) => {
    const response = await apiClient.patch<ApiResponse<Book[]>>("/books/bulk-update", {
        bookIds,
        updateData
    });
    return response.data;
};

export const bulkDeleteBooks = async (bookIds: number[]) => {
    const response = await apiClient.post<ApiResponse<boolean>>("/books/bulk-delete", {
        bookIds
    });
    return response.data;
};