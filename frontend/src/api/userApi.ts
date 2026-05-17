import axiosInstance from "./axiosInstance";
import type { UserDTO, SearchUserRequest, CreateUserRequest, UpdateUserRequest } from "../dto/user";
import type { PagedResult } from "../types/PagedResult";

export const userApi = {
    searchUser: async (request: SearchUserRequest) => {
        //const queryString = new URLSearchParams(request as Record<string, string>).toString();
        console.log("Call search user API");
        var result = await axiosInstance.get<PagedResult<UserDTO>>('/Users', { params: request });
        return result.data;
    },
    getUserById: async (id: string) => {
        var result = await axiosInstance.get<UserDTO>(`/Users/${id}`);
        return result.data;
    },
    create: async (user: CreateUserRequest) => {
        var result = await axiosInstance.post<UserDTO>('/Users', user);
        return result.data;
    },
    update: async (id: string, user: UpdateUserRequest) => {
        var result = await axiosInstance.put<UserDTO>(`/Users/${id}`, user);
        return result.data;
    },
    delete: async (id: string) => {
        var result = await axiosInstance.delete(`/Users/${id}`);
        return result.data;
    }
}