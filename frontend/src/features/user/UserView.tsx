import { HiOutlinePlus, HiOutlineSearch } from 'react-icons/hi';
import type { UserDTO, SearchUserRequest, CreateUserRequest } from '../../dto/user';
import { Spinner } from '../../components/Spinner';
import { PaginationControl } from '../../components/PaginationControl';
import { ConfirmModal } from '../../components/ConfirmModal';
import type { FormErrors } from './hooks/useUserForm';

import { UserToolbar } from './components/UserToolbar';
import { UserTable } from './components/UserTable';
import { UserFormModal } from './components/UserFormModal';

interface UserViewProps {
    filterParam: SearchUserRequest;
    setFilterParam: (filterParam: SearchUserRequest) => void;
    handleSortData: (field: string, direction: string) => void;
    handlePageChange: (selectedItem: { selected: number }) => void;
    totalPages: number;
    data?: UserDTO[];
    loading?: boolean;
    formData: CreateUserRequest;
    setFormData: (formData: CreateUserRequest) => void;
    modalMode: string;
    setModalMode: (modalMode: string) => void;
    errors: FormErrors;
    handleFormSubmit: () => void;
    handleOpenAddModal: () => void;
    handleOpenEditModal: (id: string) => void;
    handleDelete: (user: UserDTO) => void;
    deleteTarget: UserDTO | null;
    onDeleteConfirm: () => void;
    onDeleteCancel: () => void;
    isSubmitting: boolean;
    isLoadingDetail: boolean;
}

export default function UserView({
    filterParam, setFilterParam, data, loading,
    handleSortData, handlePageChange, totalPages,
    formData, setFormData, modalMode, setModalMode,
    errors, handleFormSubmit, handleOpenAddModal, handleOpenEditModal,
    deleteTarget, handleDelete, onDeleteConfirm, onDeleteCancel, isSubmitting, isLoadingDetail
}: UserViewProps) {
    return (
        <div>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                </div>
                <button data-testid="btn-add-user"
                    onClick={handleOpenAddModal}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md transition-colors"
                >
                    <HiOutlinePlus className="w-4 h-4" />
                    Add new
                </button>
            </div>

            <UserToolbar
                filterParam={filterParam}
                onSearch={(email, isActive) => setFilterParam({ ...filterParam, email, isActive, pageNumber: 1 })}
                onClear={() => setFilterParam({ ...filterParam, email: '', isActive: true, pageNumber: 1 })}
            />

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Spinner size="lg" />
                    </div>
                ) : data?.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <HiOutlineSearch className="w-7 h-7 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">No data found</p>
                        <p className="text-sm text-gray-400 mt-1">
                            Try adjusting your search or add new data.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        <div className="border-b border-gray-200">
                            <PaginationControl
                                totalPages={totalPages}
                                pageNumber={filterParam.pageNumber}
                                pageSize={filterParam.pageSize ?? 10}
                                onPageChange={handlePageChange}
                                onPageSizeChange={(newSize) => setFilterParam({ ...filterParam, pageSize: newSize, pageNumber: 1 })}
                            />
                        </div>

                        <UserTable
                            data={data}
                            filterParam={filterParam}
                            handleSortData={handleSortData}
                            handleOpenEditModal={handleOpenEditModal}
                            handleDelete={handleDelete}
                        />

                        <div className="border-t border-gray-200">
                            <PaginationControl
                                totalPages={totalPages}
                                pageNumber={filterParam.pageNumber}
                                pageSize={filterParam.pageSize ?? 10}
                                onPageChange={handlePageChange}
                                onPageSizeChange={(newSize) => setFilterParam({ ...filterParam, pageSize: newSize, pageNumber: 1 })}
                            />
                        </div>
                    </div>
                )}
            </div>

            <UserFormModal
                modalMode={modalMode}
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                onClose={() => setModalMode('')}
                onSubmit={handleFormSubmit}
                isSubmitting={isSubmitting}
                isLoading={isLoadingDetail}
            />

            <ConfirmModal
                isOpen={!!deleteTarget}
                title="Delete User"
                message={`Are you sure you want to delete "${deleteTarget?.firstName} ${deleteTarget?.lastName}"? This action cannot be undone.`}
                confirmLabel="Delete"
                isLoading={false}
                onConfirm={onDeleteConfirm}
                onCancel={onDeleteCancel}
            />
        </div>
    );
}