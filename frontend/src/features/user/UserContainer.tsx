import { useUser } from './UserHook'
import UserView from './UserView';

export default function UserContainer() {
    const { loading, users, filterParam, setParams, handleSortData,
        formData, setFormData, modalMode, setModalMode,
        errors, setErrors, handleFormSubmit,
        handleOpenAddModal, handleOpenEditModal, selectedId, setSelectedId
    } = useUser();
    return (
        <UserView
            data={users}
            loading={loading}
            filterParam={filterParam}
            setFilterParam={setParams}
            handleSortData={handleSortData}
            formData={formData}
            setFormData={setFormData}
            modalMode={modalMode}
            setModalMode={setModalMode}
            errors={errors}
            setErrors={setErrors}
            handleFormSubmit={handleFormSubmit}
            handleOpenAddModal={handleOpenAddModal}
            handleOpenEditModal={handleOpenEditModal}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
        />
    )
}