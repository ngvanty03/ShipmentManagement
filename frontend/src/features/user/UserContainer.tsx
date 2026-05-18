import UserView from './UserView';
import { useUserList } from './hooks/useUserList';
import { useUserForm } from './hooks/useUserForm';
import { useUserDelete } from './hooks/useUserDelete';

export default function UserContainer() {
    const { loading, users, filterParam, setParams, handleSortData, handlePageChange, totalPages } = useUserList();
    const { formData, setFormData, modalMode, setModalMode, errors, handleFormSubmit,
        handleOpenAddModal, handleOpenEditModal, isSubmitting, isLoading: isLoadingDetail } = useUserForm();
    const { deleteTarget, handleDelete, onDeleteConfirm, onDeleteCancel } = useUserDelete();

    return (
        <UserView
            data={users}
            loading={loading}
            filterParam={filterParam}
            setFilterParam={setParams}
            handleSortData={handleSortData}
            handlePageChange={handlePageChange}
            totalPages={totalPages}
            formData={formData}
            setFormData={setFormData}
            modalMode={modalMode}
            setModalMode={setModalMode}
            errors={errors}
            //setErrors={setErrors}
            handleFormSubmit={handleFormSubmit}
            handleOpenAddModal={handleOpenAddModal}
            handleOpenEditModal={handleOpenEditModal}
            deleteTarget={deleteTarget}
            handleDelete={handleDelete}
            onDeleteConfirm={onDeleteConfirm}
            onDeleteCancel={onDeleteCancel}
            //selectedId={selectedId}
            //setSelectedId={setSelectedId}
            isSubmitting={isSubmitting}
            isLoadingDetail={isLoadingDetail}
        />
    )
}