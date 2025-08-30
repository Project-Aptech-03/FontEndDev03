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

interface RegisterData {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    email: string;
    password: string;
    dateOfBirth: string;
}
export const loginApi = async (data: LoginData): Promise<{ success: boolean; result?: LoginResponse; error?: any }> => {
    try {
        const response = await apiClient.post<LoginResponse>("/auth/login", data);

        if (response.data?.data?.token?.token) {
            localStorage.setItem("accessToken", response.data.data.token.token);
        }

        return { success: true, result: response.data };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data || { message: "Lỗi không xác định" },
        };
    }
};


// Register API
export const registerApi = async (data: RegisterData) => {
    try {
        const response = await apiClient.post("/auth/register", data);
        return { success: true, result: response.data };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data || { message: "Lỗi không xác định" },
        };
    }
};
