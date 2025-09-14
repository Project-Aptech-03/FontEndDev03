import { PagedResult } from "../@type/apiResponse"
import { ApiResponse } from "../@type/apiResponse";
import apiClient from "../services/api";
import { ProductsResponseDto } from "../@type/productsResponse";

export const getProducts = async (
    pageIndex: number,
    pageSize: number,
    keyword?: string,
    categoriesId?: number,
    manufacturerId?: number
) => {
    const res = await apiClient.get<ApiResponse<PagedResult<ProductsResponseDto>>>(
        "/Products",
        {
            params: {
                page: pageIndex,
                size: pageSize,
                keyword,
                categoriesId,
                manufacturerId
            }
        }
    );
    return res.data;
};


// Create new product (multipart/form-data + endpoint /Products/create)
export const createProduct = async (formData: FormData) => {
    const res = await apiClient.post<ApiResponse<ProductsResponseDto>>(
        "/Products/create",
        formData,
        {
            headers: { "Content-Type": "multipart/form-data" },
        }
    );
    return res.data;
};

// Update product (multipart/form-data)
export const updateProduct = async (id: number, formData: FormData) => {
    const res = await apiClient.put<ApiResponse<ProductsResponseDto>>(
        `/Products/${id}`,
        formData,
        {
            headers: { "Content-Type": "multipart/form-data" },
        }
    );
    return res.data;
};

// Delete product (single)
export const deleteProduct = async (id: number) => {
    const res = await apiClient.delete<ApiResponse<void>>(
        `/Products/${id}`
    );
    return res.data;
};

export const deleteProducts = async (ids: number[]) => {
    const res = await apiClient.delete<ApiResponse<void>>(
        "/Products/batch",
        {
            data: ids,
            headers: { "Content-Type": "application/json" },
        }
    );
    return res.data;
};

export const getProductById = async (id: number) => {
    const res = await apiClient.get<ApiResponse<ProductsResponseDto>>(
        `/Products/${id}`
    );
    return res.data;
};

export const generateProductCode = async (categoryId: number, manufacturerId: number) => {
    const res = await apiClient.get<ApiResponse<string>>(
        `/Products/generate-code`,
        {
            params: { categoryId, manufacturerId },
        }
    );
    return res.data;
};