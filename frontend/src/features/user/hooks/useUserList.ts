import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userApi } from '../../../api/userApi';
import type { SearchUserRequest } from '../../../dto/user';

export function useUserList() {
    const [params, setParams] = useState<SearchUserRequest>({
        pageNumber: 1,
        pageSize: 5,
        isActive: true,
        email: "",
        sortDirection: "asc",
        sortBy: "id"
    });

    const listQuery = useQuery({
        queryKey: ['users', params],
        queryFn: () => userApi.searchUser(params),
    });

    const handleSortData = (field: string, direction: string) => {
        setParams({
            ...params,
            pageNumber: 1,
            sortBy: field,
            sortDirection: direction
        });
    };

    const handlePageChange = (selectedItem: { selected: number }) => {
        setParams({
            ...params,
            pageNumber: selectedItem.selected + 1
        });
    };

    return {
        filterParam: params,
        setParams,
        users: listQuery.data?.items ?? [],
        totalPages: listQuery.data?.totalPages ?? 0,
        loading: listQuery.isLoading,
        handleSortData,
        handlePageChange,
    };
}
