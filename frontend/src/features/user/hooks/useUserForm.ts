import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../../../api/userApi';
import type { CreateUserRequest, UpdateUserRequest } from '../../../dto/user';
import toast from 'react-hot-toast';

export interface FormErrors {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
}

export function useUserForm() {
    const queryClient = useQueryClient();
    const [errors, setErrors] = useState<FormErrors>({});
    const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
    const [modalMode, setModalMode] = useState<string>('');
    const [formData, setFormData] = useState<CreateUserRequest>({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        isActive: true
    });

    const userEditQuery = useQuery({
        queryKey: ['users', selectedId],
        queryFn: () => userApi.getUserById(selectedId ?? ""),
        enabled: !!selectedId
    });

    const createMutation = useMutation({
        mutationFn: (user: CreateUserRequest) => userApi.create(user),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setModalMode('');
            setSelectedId(undefined);
            toast.success("User created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.errors || "Failed to create user");
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, user }: { id: string, user: UpdateUserRequest }) => userApi.update(id, user),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setModalMode('');
            setSelectedId(undefined);
            toast.success("User updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.errors || "Failed to update user");
        }
    });

    useEffect(() => {
        if (modalMode === 'edit' && userEditQuery.data) {
            setFormData({
                email: userEditQuery.data.email || '',
                password: '', // Don't fetch existing password
                firstName: userEditQuery.data.firstName || '',
                lastName: userEditQuery.data.lastName || '',
                isActive: userEditQuery.data.isActive ?? true
            });
        }
    }, [userEditQuery.data, modalMode]);

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
    };

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
    };

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
            if (modalMode === 'create') {
                createMutation.mutate(formData);
            } else {
                const updatedData: UpdateUserRequest = {
                    email: formData.email,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    isActive: formData.isActive
                };
                updateMutation.mutate({ id: selectedId ?? "", user: updatedData });
            }
        } else {
            setErrors(validateErrors);
        }
    };

    return {
        formData,
        setFormData,
        modalMode,
        setModalMode,
        errors,
        handleFormSubmit,
        handleOpenAddModal,
        handleOpenEditModal,
        isLoading: userEditQuery.isFetching,
        isSubmitting: createMutation.isPending || updateMutation.isPending
    };
}
