import apiClient from "../services/api";
import { ApiResponse, PagedResult } from "../@type/apiResponse";
import { ProductsResponseDto } from "../@type/productsResponse";
import {Publisher} from "../@type/products";


export const getPublishers = async (
    pageIndex: number,
    pageSize: number,
    keyword?: string
) => {
    const res = await apiClient.get<ApiResponse<PagedResult<Publisher>>>(
        "/publishers",
        { params: { pageNumber: pageIndex, pageSize, keyword } }
    );
    return res.data;
};
export const createPublisher = async (publisher: {
    publisherCode: string;
    publisherName: string;
    isActive: boolean;
}) => {
    const res = await apiClient.post<ApiResponse<ProductsResponseDto>>(
        "/publishers",
        publisher
    );
    return res.data;
};

export const updatePublisher = async (id: number, publisher: {
    publisherCode: string;
    publisherName: string;
    isActive: boolean;
}) => {
    const res = await apiClient.put<ApiResponse<ProductsResponseDto>>(
        `/publishers/${id}`,
        publisher
    );
    return res.data;
};

export const deletePublisher = async (id: number) => {
    const res = await apiClient.delete<ApiResponse<null>>(
        `/publishers/${id}`
    );
    return res.data;
};
