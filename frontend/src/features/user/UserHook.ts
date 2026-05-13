import { useState } from 'react';
import type { UserDTO } from "../../dto/user"
import { userApi } from "../../api/userApi";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { SearchUserRequest } from "../../dto/user";
export function useUser() {
    const queryClient = useQueryClient();
    const [params, setParams] = useState<SearchUserRequest>({
        pageNumber: 1,
        pageSize: 10,
        isActive: true,
        email: "",
        sortDirection: "asc",
        sortBy: "id"
    })
    const listQuery = useQuery({
        queryKey: ['users', params],
        queryFn: () => userApi.searchUser(params),
    })
    const handleSortData = (field: string, direction: string) => {
        setParams({
            ...params,
            pageNumber: 1,
            sortBy: field,
            sortDirection: direction
        })
    }
    console.log(listQuery.data);
    return {
        filterParam: params,
        setParams,
        users: listQuery.data?.items ?? [],
        loading: listQuery.isLoading,
        handleSortData
    }
}