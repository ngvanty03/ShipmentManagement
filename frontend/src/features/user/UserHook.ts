import { useState } from 'react';
import { userApi } from "../../api/userApi";
import { useQuery } from '@tanstack/react-query';
import type { SearchUserRequest, CreateUserRequest } from "../../dto/user";
export interface FormErrors {
    email?: string,
    password?: string,
    firstName?: string,
    lastName?: string,
}
export function useUser() {
    const [errors, setErrors] = useState<FormErrors>({});
    const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
    const [params, setParams] = useState<SearchUserRequest>({
        pageNumber: 1,
        pageSize: 10,
        isActive: true,
        email: "",
        sortDirection: "asc",
        sortBy: "id"
    })
    const [formData, setFormData] = useState<CreateUserRequest>({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        isActive: true
    })
    const [modalMode, setModalMode] = useState<string>('');
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
    const handleOpenAddModal = () => {
        setSelectedId(undefined);
        setModalMode('create');
        setFormData({
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            isActive: true
        });
        setErrors({});
    }
    const handleOpenEditModal = (id: string) => {
        setSelectedId(id);
        setModalMode('edit');
        setFormData({
            email: 'ngvanty03@gmail.com',
            password: '1233',
            firstName: 'Ty',
            lastName: 'Nguyen',
            isActive: false
        });
        setErrors({});
    }
    const handleFormSubmit = () => {
        const validateErrors: FormErrors = {};
        setErrors(validateErrors);
        if (!formData.email || formData.email.trim() === "") {
            validateErrors.email = "Email is required";
            setErrors(validateErrors);
            return;
        }
        if (!formData.email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
            validateErrors.email = "Email is not valid";
            setErrors(validateErrors);
            return;
        }
        if (!formData.password || formData.password.trim() === "") {
            validateErrors.password = "Password is required";
            setErrors(validateErrors);
            return;
        }
        if (!formData.firstName || formData.firstName.trim() === "") {
            validateErrors.firstName = "First name is required";
            setErrors(validateErrors);
            return;
        }
        if (!formData.lastName || formData.lastName.trim() === "") {
            validateErrors.lastName = "Last name is required";
            setErrors(validateErrors);
            return;
        }
        if (Object.keys(validateErrors).length === 0) {
            // Call API
        } else {
            setErrors(validateErrors);
        }
    }
    return {
        filterParam: params,
        setParams,
        users: listQuery.data?.items ?? [],
        loading: listQuery.isLoading,
        handleSortData,
        formData,
        setFormData,
        modalMode,
        setModalMode,
        errors,
        setErrors,
        handleFormSubmit,
        handleOpenAddModal,
        handleOpenEditModal,
        selectedId,
        setSelectedId
    }
}