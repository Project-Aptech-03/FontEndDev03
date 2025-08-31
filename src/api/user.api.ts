// services/userApi.ts

import apiClient from "../services/api";
import {ApiResponse, PagedResult} from "../@type/apiResponse";
import {UsersResponseDto} from "../@type/UserResponseDto";

export const getAllUsers = async (pageIndex = 1, pageSize = 10) => {
    const res = await apiClient.get<ApiResponse<PagedResult<UsersResponseDto>>>(
        "/User",
        { params: { pageIndex, pageSize } }
    );
    return res.data;
};

export const getUserById = async (id: string) => {
    const res = await apiClient.get<UsersResponseDto>(`/User/${id}`);
    return res.data;
};

// Tạo mới user
export const createUser = async (data: Partial<UsersResponseDto>) => {
    const res = await apiClient.post<ApiResponse<UsersResponseDto>>(
        "/User",
        data
    );
    if (!res.data.success) {
        throw new Error(res.data.message || "Tạo user thất bại");
    }
    return res.data;
};

export const updateUser = async (id: string, data: Partial<UsersResponseDto>) => {
    const res = await apiClient.put<ApiResponse<UsersResponseDto>>(
        `/User/${id}`,
        data
    );
    return res.data;
};

// Xóa user
export const deleteUser = async (id: string) => {
    const res = await apiClient.delete<ApiResponse<null>>(`/User/${id}`);
    return res.data;
};