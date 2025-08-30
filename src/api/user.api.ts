import { Users } from "../@type/Users";
import apiClient from "../services/api";
import {ApiResponse, PageResponse, UserPageResponse} from "../@type/apiResponse";


export const getUsers = async (
    page: number,
    size: number
): Promise<PageResponse<Users>> => {
    const res = await apiClient.get<ApiResponse<UserPageResponse<Users>>>("/user", {
        params: { pageIndex: page, pageSize: size },
    });

    const pageData = res.data.result; // API wrapper trả về { code, message, result }

    return {
        ...pageData,
        items: pageData.items.map((u: any) => ({
            id: u.id,
            firstName: u.firstName || "",
            lastName: u.lastName || "",
            email: u.email,
            phoneNumber: u.phoneNumber,
            address: u.address,
            avataUrl: u.avataUrl,
            dateOfBirth: u.dateOfBirth,
            fullName: u.fullName,
        })),
    };
};

export const createUser = async (user: Users): Promise<Users> => {
    const res = await apiClient.post<ApiResponse<Users>>("/user", user);
    return res.data.result;
};

export const updateUser = async (
    id: number,
    user: Partial<Users>
): Promise<Users> => {
    const res = await apiClient.put<ApiResponse<Users>>(`/user/${id}`, user);
    return res.data.result;
};

export const deleteUser = async (id: number): Promise<void> => {
    await apiClient.delete<ApiResponse<null>>(`/user/${id}`);
};
