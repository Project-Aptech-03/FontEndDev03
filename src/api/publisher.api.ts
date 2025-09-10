import apiClient from "../services/api";
import {ApiResponse, PagedResult} from "../@type/apiResponse";
import {ProductsResponseDto} from "../@type/productsResponse";

export const getPublishers = async (pageIndex: number, pageSize: number) => {
    const res = await apiClient.get<ApiResponse<PagedResult<ProductsResponseDto>>>(
        "/publishers",
        { params: { pageIndex, pageSize } }
    );
    return res.data;
};