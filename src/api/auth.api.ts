import apiClient from "../services/api";


interface LoginData {
    email: string;
    password: string;
}
interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        success: boolean;
        userId: string;
        email: string;
        fullName: string;
        role: string;
        token: {
            token: string;
            expiresAt: string;
            expiresIn: number;
        };
    };
    errors: any;
    statusCode: number;
}

interface ResetPasswordDto {
    email: string;
    token: string;
    newPassword: string;
    confirmPassword: string;
}

export const loginApi = async (data: LoginData): Promise<{ success: boolean; result?: LoginResponse; error?: any }> => {
        const response = await apiClient.post<LoginResponse>("/auth/login", data);
        return { success: true, result: response.data };
};

export const forgotPasswordApi = async (email: string) => {
    const response = await apiClient.post("/auth/forgot-password", { email });
    return response.data;
}

export const resetPasswordApi = async (data: ResetPasswordDto) => {
    const response = await apiClient.post("/auth/reset-password", data);
    return response.data;
};

