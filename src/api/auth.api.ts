import {LoginForm} from "../@type/login";
import {authClient} from "../services/api";
import {ApiResponse} from "../@type/apiResponse";
import {message} from "antd";



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
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    address?: string;
    dateOfBirth?: string;
    confirmPassword: string,
}

export interface VerifyOtpRequest {
    email: string;
    otp: string;
}

export interface ResendOtpRequest {
    email: string;
}
export const loginApi = async (data: LoginForm): Promise<LoginResultDto> => {
    try {
        const res = await authClient.post("/auth/login", data);
        return res.data as LoginResultDto;
    } catch (err: any) {
        const apiError = err?.response?.data as ApiResponse<string>;
        if (apiError?.errors) {
            Object.values(apiError.errors).flat().forEach((msg: string) => message.error(msg));
        } else {
            message.error(apiError?.message || "Lỗi hệ thống ");
        }
    }
};



export const forgotPasswordApi = async (email: string) => {
    const response = await authClient.post("/auth/forgot-password", { email });
    return response.data;
}

export const resetPasswordApi = async (data: ResetPasswordDto) => {
    const response = await authClient.post("/auth/reset-password", data);
    return response.data;
};

