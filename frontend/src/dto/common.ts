import type { User } from "../stores/authStore"
export interface PagedRequest {
    pageNumber: number
    pageSize: number
    sortBy?: string
    sortDirection?: string
}
export interface LoginResponse {
    user: User;
    accessToken: string;
}