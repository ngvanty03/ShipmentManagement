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