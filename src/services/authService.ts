// src/services/authService.js
import  {authClient} from "./api.js";
import {LoginRequest, RegisterRequest, ResendOtpRequest, VerifyOtpRequest} from "../api/auth.api";


export const AuthService = {
    login: async ( {email, password }:LoginRequest) => {
            const response = await authClient.post(`/auth/login`, {email, password});
            return response.data;

    },

    register: async (data:RegisterRequest) => {
        const response = await authClient.post(`/auth/register/send-otp`, data);
        return response.data;
    },

    verifyOtp: async ({ email, otp }: VerifyOtpRequest) => {

            const response = await authClient.post(`/auth/register/verify`, { email, otp });
            return response.data;
    },

    resendOtp: async ({email}: ResendOtpRequest) => {

           const response = await authClient.post(`/auth/resend-otp`, { email });
           return response.data;
    }
};