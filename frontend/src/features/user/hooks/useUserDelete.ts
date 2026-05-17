import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../../../api/userApi';
import type { UserDTO } from '../../../dto/user';
import toast from 'react-hot-toast';

export function useUserDelete() {
    const queryClient = useQueryClient();
    const [deleteTarget, setDeleteTarget] = useState<UserDTO | null>(null);

    const deleteMutation = useMutation({
        mutationFn: (id: string) => userApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setDeleteTarget(null);
            toast.success("User deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.errors || "Failed to delete user");
        }
    });

    const handleDelete = (user: UserDTO) => {
        setDeleteTarget(user);
    };

    const onDeleteConfirm = () => {
        if (deleteTarget) {
            deleteMutation.mutate(deleteTarget.id);
        }
    };

    const onDeleteCancel = () => {
        setDeleteTarget(null);
    };

    return {
        deleteTarget,
        handleDelete,
        onDeleteConfirm,
        onDeleteCancel,
    };
}
