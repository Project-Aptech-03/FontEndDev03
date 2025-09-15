import apiClient from "../services/api";
import {ApiResponse, PagedResult} from "../@type/apiResponse";

import {Category} from "../@type/products";


export const getCategory = async (
    pageNumber: number,
    pageSize: number,
    keyword?: string
) => {
    const res = await apiClient.get<ApiResponse<PagedResult<Category>>>(
        "/categories",
        { params: { pageNumber, pageSize, keyword } }
    );
    return res.data;
};

export const createCategory = async (data: {
    categoryCode: string;
    categoryName: string;
}) => {
    const res = await apiClient.post<ApiResponse<Category>>("/categories", data);
    return res.data;
};

export const updateCategory = async (
    id: number,
    data: { categoryCode: string; categoryName: string }
) => {
    const res = await apiClient.put<ApiResponse<Category>>(
        `/categories/${id}`,
        data
    );
    return res.data;
};

// Xóa category
export const deleteCategory = async (id: number) => {
    const res = await apiClient.delete<ApiResponse<boolean>>(`/categories/${id}`);
    return res.data;
};