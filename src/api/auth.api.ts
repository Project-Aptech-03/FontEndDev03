import apiClient from "../services/api";
import {LoginForm} from "../@type/login";



export interface TokenDto {
    token: string;
    refreshToken: string;
    expiresAt: string;
    expiresIn: number;
}

export interface LoginData {
    success: boolean;
    userId: string;
    email: string;
    fullName: string;
    role: string;
    errorMessage?: string | null;
    token: TokenDto;
    refreshToken: string;
}

export interface LoginResultDto {
    success: boolean;
    message: string;
    data: LoginData;
    errors?: any;
    statusCode: number;
}


interface ResetPasswordDto {
    email: string;
    token: string;
    newPassword: string;
    confirmPassword: string;
}


export const loginApi = async (data: LoginForm): Promise<{ success: boolean; data: LoginResultDto; errors?: any }> => {
    try {
        const res = await apiClient.post("/auth/login", data);
        return res.data;
    } catch (err: any) {
        return {
            success: false,
            data: {} as LoginResultDto,
            errors: err?.response?.data?.errors || { message: err?.message },
        };
    }
};


export const forgotPasswordApi = async (email: string) => {
    const response = await apiClient.post("/auth/forgot-password", { email });
    return response.data;
}

export const resetPasswordApi = async (data: ResetPasswordDto) => {
    const response = await apiClient.post("/auth/reset-password", data);
    return response.data;
};

