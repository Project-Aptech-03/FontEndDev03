import apiClient from "../services/api";
import { ApiResponse, PagedResult } from "../@type/apiResponse";
import {ManufacturerDto, ProductsResponseDto} from "../@type/productsResponse";
import Manufacturers from "../pages/admin/Manufacturers";

// Lấy danh sách manufacturer (có phân trang)
export const getManufacturers = async (pageIndex: number, pageSize: number) => {
    const res = await apiClient.get<ApiResponse<PagedResult<ProductsResponseDto>>>(
        "/manufacturers",
        { params: { pageIndex, pageSize } }
    );
    return res.data;
};

// Tạo mới manufacturer
export const createManufacturer = async (data: {
    manufacturerCode: string;
    manufacturerName: string;
}) => {
    const res = await apiClient.post<ApiResponse<ManufacturerDto>>(
        "/manufacturers",
        data
    );
    return res.data;
};

export const updateManufacturer = async (
    id: number,
    data: {
        manufacturerCode: string;
        manufacturerName: string;
    }
) => {
    const res = await apiClient.put<ApiResponse<ManufacturerDto>>(
        `/manufacturers/${id}`,
        data
    );
    return res.data;
};

export const deleteManufacturer = async (id: number) => {
    const res = await apiClient.delete<ApiResponse<ManufacturerDto>>(
        `/manufacturers/${id}`
    );
    return res.data;
};
