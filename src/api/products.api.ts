import { PagedResult } from "../@type/apiResponse"
import { ApiResponse } from "../@type/apiResponse";
import apiClient from "../services/api";
import { ProductsResponseDto } from "../@type/productsResponse";

export const getProducts = async (pageIndex: number, pageSize: number) => {
    const res = await apiClient.get<ApiResponse<PagedResult<ProductsResponseDto>>>(
        "/Products",
        { params: { pageIndex, pageSize } }
    );
    return res.data;
}