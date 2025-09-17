import axios, { AxiosInstance } from "axios";

const API_BASE_URL = "https://localhost:7275/api";

const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Response interceptor: auto refresh token
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("refreshToken") || sessionStorage.getItem("refreshToken");
            if (!refreshToken) {
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = "/login";
                return Promise.reject(error);
            }

            try {
                const res = await apiClient.post("/auth/refresh-token", { token: refreshToken });
                const newAccessToken = res.data.data.accessToken;
                const newRefreshToken = res.data.data.refreshToken;

                if (localStorage.getItem("accessToken")) {
                    localStorage.setItem("accessToken", newAccessToken);
                    localStorage.setItem("refreshToken", newRefreshToken);
                } else {
                    sessionStorage.setItem("accessToken", newAccessToken);
                    sessionStorage.setItem("refreshToken", newRefreshToken);
                }

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return apiClient(originalRequest);
            } catch {
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = "/login";
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
