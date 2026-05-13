import { useState, useEffect } from 'react';
import { HiOutlineEye, HiOutlinePencil } from 'react-icons/hi'
import { HiOutlinePlus, HiOutlineSearch, HiOutlineTrash } from 'react-icons/hi'
import type { UserDTO, SearchUserRequest } from '../../dto/user';
import { Spinner } from '../../components/Spinner';
import SortListHeader from '../../components/SortListHeader';
import Badge from '../../components/Badge';
interface UserViewProps {
    filterParam: SearchUserRequest,
    setFilterParam: (filterParam: SearchUserRequest) => void,
    handleSortData: (field: string, direction: string) => void
    data?: UserDTO[],
    loading?: boolean
}
export default function UserView({ filterParam, setFilterParam, data, loading, handleSortData }: UserViewProps) {
    const [localFilter, setLocalFilter] = useState({
        email: filterParam.email,
        isActive: filterParam.isActive
    });

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
                            value={localFilter.isActive === null ? '' : localFilter.isActive ? 'true' : 'false'}
                            onChange={(e) => {
                                setLocalFilter({ ...localFilter, isActive: e.target.value === '' ? null : e.target.value === 'true' })
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
                                        sortBy={filterParam.sortBy}
                                        sortDirection={filterParam.sortDirection}
                                        onSortChange={handleSortData}
                                    />
                                    <SortListHeader
                                        title="firstName"
                                        field="firstName"
                                        sortBy={filterParam.sortBy}
                                        sortDirection={filterParam.sortDirection}
                                        onSortChange={handleSortData}
                                    />
                                    <SortListHeader
                                        title="Status"
                                        field="isActive"
                                        widthClassName='w-32'
                                        sortBy={filterParam.sortBy}
                                        sortDirection={filterParam.sortDirection}
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

                                                    }}
                                                    className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                                    title="View details"
                                                >
                                                    <HiOutlineEye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => {

                                                    }}
                                                    className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                                                    title="Edit"
                                                >
                                                    <HiOutlinePencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => {

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
                )}
            </div>
        </div>
    );
}