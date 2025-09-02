// src/services/authService.js
import apiClient from "./api.js";
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

export const AuthService = {
    login: async ( {email, password }:LoginRequest) => {
            const response = await apiClient.post(`/auth/login`, {email, password});
            return response.data;

    },

    register: async (data:RegisterRequest) => {
        const response = await apiClient.post(`/auth/register/send-otp`, data);
        return response.data;
    },

    verifyOtp: async ({ email, otp }: VerifyOtpRequest) => {

            const response = await apiClient.post(`/auth/register/verify`, { email, otp });
            return response.data;
    },

    resendOtp: async ({email}: ResendOtpRequest) => {

           const response = await apiClient.post(`/auth/resend-otp`, { email });
           return response.data;
    }
};