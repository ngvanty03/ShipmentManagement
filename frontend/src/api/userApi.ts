import axiosInstance from "./axiosInstance";
import type { UserDTO, SearchUserRequest } from "../dto/user";
import type { PagedResult } from "../types/PagedResult";

export const userApi = {
    searchUser: async (request: SearchUserRequest) => {
        var result = await axiosInstance.get<PagedResult<UserDTO>>('/users', { params: request });
        return result.data;
    },
    getUserById: async (id: string) => {
        var result = await axiosInstance.get(`/users/${id}`);
        return result.data;
    },
    create: async (user: UserDTO) => {
        var result = await axiosInstance.post('/users', user);
        return result.data;
    },
    update: async (user: UserDTO) => {
        var result = await axiosInstance.put(`/users/${user.id}`, user);
        return result.data;
    },
    delete: async (id: string) => {
        var result = await axiosInstance.delete(`/users/${id}`);
        return result.data;
    }
}