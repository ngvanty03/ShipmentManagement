import { useState, useEffect } from 'react';
import { userApi } from "../../api/userApi";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { SearchUserRequest, CreateUserRequest, UpdateUserRequest, UserDTO } from "../../dto/user";
import toast from 'react-hot-toast'
export interface FormErrors {
    email?: string,
    password?: string,
    firstName?: string,
    lastName?: string,
}
export function useUser() {
    const queryClient = useQueryClient()
    const [errors, setErrors] = useState<FormErrors>({});
    const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
    const [params, setParams] = useState<SearchUserRequest>({
        pageNumber: 1,
        pageSize: 5,
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
    const userEditQuery = useQuery({
        queryKey: ['users', selectedId],
        queryFn: () => userApi.getUserById(selectedId ?? ""),
        enabled: !!selectedId
    })
    const createMutation = useMutation({
        mutationFn: (user: CreateUserRequest) => userApi.create(user),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            setModalMode('');
            setSelectedId(undefined);
            toast.success("User created successfully")
        },
        onError: (error: any) => {
            toast.error(error.response?.data.errors || {});
        }
    })
    const updateMutation = useMutation({
        mutationFn: ({ id, user }: { id: string, user: UpdateUserRequest }) => userApi.update(id, user),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            setModalMode('');
            setSelectedId(undefined);
            toast.success("User updated successfully")
        },
        onError: (error: any) => {
            toast.error(error.response?.data.errors || {});
        }
    })
    useEffect(() => {
        if (modalMode === 'edit' && userEditQuery.data) {
            setFormData({
                email: userEditQuery.data.email || '',
                password: '', // We don't fetch or display the existing password
                firstName: userEditQuery.data.firstName || '',
                lastName: userEditQuery.data.lastName || '',
                isActive: userEditQuery.data.isActive ?? true
            });
        }
    }, [userEditQuery.data, modalMode]);
    const handleSortData = (field: string, direction: string) => {
        setParams({
            ...params,
            pageNumber: 1,
            sortBy: field,
            sortDirection: direction
        })
    }

    //console.log(listQuery.data);
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
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            isActive: true
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
        if (modalMode === 'create' && (!formData.password || formData.password.trim() === "")) {
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
            if (modalMode === 'create') {
                const data: CreateUserRequest = {
                    email: formData.email,
                    password: formData.password,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    isActive: formData.isActive
                }
                createMutation.mutate(data);
            } else {
                const updatedData: UpdateUserRequest = {
                    email: formData.email,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    isActive: formData.isActive
                }
                updateMutation.mutate({ id: selectedId ?? "", user: updatedData });
            }
        } else {
            setErrors(validateErrors);
        }
    }
    const [deleteTarget, setDeleteTarget] = useState<UserDTO | null>(null)
    const deleteMutation = useMutation({
        mutationFn: (id: string) => userApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            setDeleteTarget(null)
            toast.success("User deleted successfully")
        },
        onError: (error: any) => {
            toast.error(error.response?.data.errors || {});
        }
    })
    const handleDelete = (user: UserDTO) => {
        setDeleteTarget(user)
    }
    const onDeleteConfirm = () => {
        if (deleteTarget) {
            deleteMutation.mutate(deleteTarget.id)
        }
    }
    const onDeleteCancel = () => {
        setDeleteTarget(null)
    }
    const handlePageChange = (selectedItem: { selected: number }) => {
        setParams({
            ...params,
            pageNumber: selectedItem.selected + 1
        });
    }

    return {
        filterParam: params,
        setParams,
        users: listQuery.data?.items ?? [],
        totalPages: listQuery.data?.totalPages ?? 0,
        loading: listQuery.isLoading,
        handleSortData,
        handlePageChange,
        formData,
        setFormData,
        modalMode,
        setModalMode,
        errors,
        handleFormSubmit,
        handleOpenAddModal,
        handleOpenEditModal,
        deleteTarget,
        handleDelete,
        onDeleteConfirm,
        onDeleteCancel
        /*selectedId,
        setSelectedId*/
    }
}