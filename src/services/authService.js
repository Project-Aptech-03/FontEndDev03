// src/services/authService.js
import apiClient from "./api.js";

export const AuthService = {
    login: async ({ email, password }) => {
        try {
            const response = await apiClient.post(`/auth/login`, { email, password });
            return {
                success: true,
                data: response.data,
                status: response.status
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data || error.message,
                status: error.response?.status
            };
        }
    },

    register: async ({
                         firstName,
                         lastName,
                         phoneNumber,
                         address,
                         dateOfBirth,
                         email,
                         password,
                     }) => {
        try {
            const response = await apiClient.post(`/auth/register/send-otp`, {
                firstName,
                lastName,
                phoneNumber,
                address,
                dateOfBirth,
                email,
                password,
            });
            return {
                success: true,
                data: response.data,
                status: response.status
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data || error.message,
                status: error.response?.status
            };
        }
    },

    verifyOtp: async ({ email, otp }) => {
        try {
            const response = await apiClient.post(`/auth/register/verify`, { email, otp });
            return {
                success: true,
                data: response.data,
                status: response.status
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data || error.message,
                status: error.response?.status
            };
        }
    },

    resendOtp: async ({email}) => {
       try{
           const response = await apiClient.post(`/auth/resend-otp`, { email });
           return {
                success: true,
                data: response.data,
                status: response.status
           }
       }
       catch(error){
              return {
                success: false,
                error: error.response?.data || error.message,
                status: error.response?.status
              };
       }
    }
};