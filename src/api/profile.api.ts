import apiClient from "../services/api";
import {ApiResponse} from "../@type/apiResponse";
import {UsersResponseDto} from "../@type/UserResponseDto";


export const getProfile = async () => {
    const res = await apiClient.get<ApiResponse<UsersResponseDto>>("user/profile");
    return res.data;
};

export const updateProfile = async (data: Partial<UsersResponseDto>) => {
    const res = await apiClient.put<ApiResponse<UsersResponseDto>>("user/profile", data);
    return res.data;
};

export const changePassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    const res = await apiClient.post<ApiResponse<null>>("user/change-password", {
        currentPassword,
        newPassword,
        confirmPassword,
    });
    return res.data;
};


export const uploadAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderName", "avatars");

    const res = await apiClient.post("/upload/single?folderName=avatars", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return res.data; // { url: ... }
};



