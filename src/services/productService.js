
import apiClient from "./api.js";

export const ProductService = {
    getAll: () => apiClient.get("/products"),
    getById: (id) => apiClient.get(`/products/${id}`),

    create: (formData) =>
        apiClient.post("/products", formData, {
            headers: {
                "Content-Type": "multipart/form-data", // ✅ upload file cần multipart/form-data
            },
        }),

    update: (id, formData) =>
        apiClient.put(`/products/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data", // ✅ nếu có ảnh update
            },
        }),

    delete: (id) => apiClient.delete(`/products/${id}`),
};
