import { useState, useEffect } from 'react';
import { HiOutlineEye, HiOutlinePencil } from 'react-icons/hi'
import { HiOutlinePlus, HiOutlineSearch, HiOutlineTrash } from 'react-icons/hi'
import type { UserDTO, SearchUserRequest, CreateUserRequest } from '../../dto/user';
import { Spinner } from '../../components/Spinner';
import SortListHeader from '../../components/SortListHeader';
import Badge from '../../components/Badge';
import { PopupFormModal } from '../../components/PopupFormModal';
import { PaginationControl } from '../../components/PaginationControl';
import type { FormErrors } from './UserHook';
import { ConfirmModal } from '../../components/ConfirmModal';
interface UserViewProps {
    filterParam: SearchUserRequest,
    setFilterParam: (filterParam: SearchUserRequest) => void,
    handleSortData: (field: string, direction: string) => void,
    handlePageChange: (selectedItem: { selected: number }) => void,
    totalPages: number,
    data?: UserDTO[],
    loading?: boolean,
    formData: CreateUserRequest,
    setFormData: (formData: CreateUserRequest) => void,
    modalMode: string,
    setModalMode: (modalMode: string) => void,
    errors: FormErrors,
    handleFormSubmit: () => void,
    handleOpenAddModal: () => void,
    handleOpenEditModal: (id: string) => void,
    handleDelete: (user: UserDTO) => void,
    deleteTarget: UserDTO | null,
    onDeleteConfirm: () => void,
    onDeleteCancel: () => void
    /*selectedId: string | undefined,
    setSelectedId: (id: string | undefined) => void*/
}
export default function UserView({ filterParam, setFilterParam, data, loading,
    handleSortData, handlePageChange, totalPages, formData, setFormData, modalMode, setModalMode,
    errors, handleFormSubmit, handleOpenAddModal, handleOpenEditModal, deleteTarget, handleDelete, onDeleteConfirm, onDeleteCancel /*, selectedId, setSelectedId */ }: UserViewProps) {
    const [localFilter, setLocalFilter] = useState({
        email: filterParam.email,
        isActive: filterParam.isActive
    });
    //setErrors({});
    // selectedId === undefined;
    // setSelectedId(undefined);

    useEffect(() => {
        setLocalFilter({
            email: filterParam.email,
            isActive: filterParam.isActive
        });
    }, [filterParam.email, filterParam.isActive]);

    return (
        <div>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        User Management
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">

                    </p>
                </div>
                <button
                    onClick={() => {
                        handleOpenAddModal();
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md transition-colors"
                >
                    <HiOutlinePlus className="w-4 h-4" />
                    Add new
                </button>
            </div>
            {/* Toolbar */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <div className="relative ">
                    <div className="flex gap-3 flex-1">
                        <div className="relative flex-1">
                            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                value={localFilter.email}
                                onChange={(e) => {
                                    setLocalFilter({ ...localFilter, email: e.target.value })
                                }}
                                type="text"
                                data-testid='search-email'
                                placeholder="Search by email..."
                                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>
                        <select
                            value={localFilter.isActive === undefined ? '' : localFilter.isActive ? 'true' : 'false'}
                            onChange={(e) => {
                                setLocalFilter({ ...localFilter, isActive: e.target.value === '' ? undefined : e.target.value === 'true' })
                            }}
                            data-testid='search-isactive'
                            className="px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                        >
                            <option value="">All Status</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>
                </div>
                <button
                    onClick={() => {
                        setFilterParam({ ...filterParam, email: localFilter.email, isActive: localFilter.isActive });
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md transition-colors"
                >
                    <HiOutlineSearch className="w-4 h-4" />
                    Search
                </button>
                <button
                    onClick={() => {
                        setLocalFilter({ email: '', isActive: true });
                        setFilterParam({ ...filterParam, email: '', isActive: true });
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-400 hover:bg-red-500 text-white text-sm font-semibold rounded-xl shadow-md transition-colors"
                >
                    <HiOutlineTrash className="w-4 h-4" />
                    Clear
                </button>
            </div>


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
                            Try adjusting your search or add a new data.
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
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="bg-gray-300 ">
                                        <th className="w-24 text-center px-5 py-3.5 font-semibold text-gray-600 border border-gray-300">
                                            #
                                        </th>
                                        <SortListHeader
                                            title="Email"
                                            field="email"
                                            sortBy={filterParam.sortBy || ''}
                                            sortDirection={filterParam.sortDirection || 'asc'}
                                            onSortChange={handleSortData}
                                        />
                                        <SortListHeader
                                            title="firstName"
                                            field="firstName"
                                            sortBy={filterParam.sortBy || ''}
                                            sortDirection={filterParam.sortDirection || 'asc'}
                                            onSortChange={handleSortData}
                                        />
                                        <SortListHeader
                                            title="Status"
                                            field="isActive"
                                            widthClassName='w-32'
                                            sortBy={filterParam.sortBy || ''}
                                            sortDirection={filterParam.sortDirection || 'asc'}
                                            onSortChange={handleSortData}
                                        />
                                        <th className="text-center px-5 py-3.5 font-semibold text-gray-600 border border-gray-300 w-32">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-300">
                                    {data?.map((user, idx) => (
                                        <tr
                                            key={user.id}
                                            className="hover:bg-indigo-50/30 transition-colors group"
                                        >
                                            <td className="text-center px-5 py-4 text-gray-400 font-mono text-xs border border-gray-200">
                                                {(idx + 1)}
                                            </td>
                                            <td className="px-5 py-4 border border-gray-200">
                                                <p className="font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors">
                                                    {user.email}
                                                </p>
                                            </td>
                                            <td className="px-5 py-4 border border-gray-200">
                                                <p className="font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors">
                                                    {user.firstName} {user.lastName}
                                                </p>
                                            </td>
                                            <td className="px-5 py-4 text-center hidden sm:table-cell border border-gray-200">
                                                <Badge active={user.isActive} />
                                            </td>
                                            <td className="px-5 py-4 border border-gray-200">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button
                                                        onClick={() => {
                                                            handleOpenEditModal(user.id);
                                                        }}
                                                        className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                                        title="View details"
                                                    >
                                                        <HiOutlineEye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            handleOpenEditModal(user.id);
                                                        }}
                                                        className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <HiOutlinePencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            handleDelete(user)
                                                        }}
                                                        className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <HiOutlineTrash className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Bottom Pagination */}
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
            {/* Create/Edit Modal */}
            <PopupFormModal
                title={modalMode === 'create' ? 'New User' : 'Edit User'}
                isOpen={modalMode !== ''}
                onClose={() => {
                    setModalMode('')
                }}
                onSubmit={() => { handleFormSubmit() }}
                isSubmitting={false}
            >
                <div className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
                            Email <span className="text-red-400">*</span>
                        </label>
                        <input
                            id="email"
                            type="text"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="Enter your email"
                            className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                        />
                        {errors.email && (
                            <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                        )}
                    </div>
                    {modalMode === 'create' && (
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">
                                Password <span className="text-red-400">*</span>
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Enter your password"
                                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                            />
                        </div>
                    )}
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-slate-300 mb-1.5">
                            First Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            id="firstName"
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            placeholder="Enter your first name"
                            className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-slate-300 mb-1.5">
                            Last Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            id="lastName"
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            placeholder="Enter your last name"
                            className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            id="user-isactive-toggle"
                            type="button"
                            onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                            className={`relative w-10 h-5 rounded-full transition-colors ${formData.isActive ? 'bg-indigo-600' : 'bg-slate-600'}`}
                            role="switch"
                            aria-checked={formData.isActive}
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${formData.isActive ? 'translate-x-5' : ''}`}
                            />
                        </button>
                        <span className="text-sm text-slate-600">Active</span>
                    </div>
                </div>
            </PopupFormModal>
            {/* Delete Confirm */}
            <ConfirmModal
                isOpen={!!deleteTarget}
                title="Delete User"
                message={`Are you sure you want to delete "${deleteTarget?.firstName} ${deleteTarget?.lastName}"? This action cannot be undone.`}
                confirmLabel='Delete'
                isLoading={false}
                onConfirm={onDeleteConfirm}
                onCancel={onDeleteCancel}
            />
        </div>
    );
}