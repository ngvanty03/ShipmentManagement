import type { PagedRequest } from "./common"

export interface UserDTO {
    id: string
    email: string
    firstName: string
    lastName: string
    isActive: boolean
}
export interface SearchUserRequest extends PagedRequest {
    email?: string
    isActive?: boolean
}
export interface CreateUserRequest {
    email: string
    password: string
    firstName: string
    lastName: string
    isActive?: boolean
}
export interface UpdateUserRequest {
    email: string
    firstName: string
    lastName: string
    isActive?: boolean
}