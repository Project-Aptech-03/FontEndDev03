import apiClient from "../services/api";


interface LoginData {
    email: string;
    password: string;
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

// Login API
export const loginApi = async (data: LoginData) => {
    try {
        const response = await apiClient.post("/auth/login", data);

        // Lưu token vào localStorage để các API khác tự động dùng
        if (response.data?.token) {
            localStorage.setItem("accessToken", response.data.token);
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
