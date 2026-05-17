import { useUser } from './UserHook'
import UserView from './UserView';

export default function UserContainer() {
    const { loading, users, filterParam, setParams, handleSortData, handlePageChange, totalPages,
        formData, setFormData, modalMode, setModalMode,
        errors, handleFormSubmit,
        handleOpenAddModal, handleOpenEditModal,
        deleteTarget, handleDelete, onDeleteConfirm, onDeleteCancel
    } = useUser();
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
        />
    )
}