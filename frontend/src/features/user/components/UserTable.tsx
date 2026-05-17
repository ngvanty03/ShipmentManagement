import { HiOutlineEye, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import type { UserDTO, SearchUserRequest } from '../../../dto/user';
import SortListHeader from '../../../components/SortListHeader';
import Badge from '../../../components/Badge';

interface UserTableProps {
    data?: UserDTO[];
    filterParam: SearchUserRequest;
    handleSortData: (field: string, direction: string) => void;
    handleOpenEditModal: (id: string) => void;
    handleDelete: (user: UserDTO) => void;
}

export function UserTable({
    data,
    filterParam,
    handleSortData,
    handleOpenEditModal,
    handleDelete
}: UserTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
                <thead>
                    <tr className="bg-gray-300">
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
                            title="First Name"
                            field="firstName"
                            sortBy={filterParam.sortBy || ''}
                            sortDirection={filterParam.sortDirection || 'asc'}
                            onSortChange={handleSortData}
                        />
                        <SortListHeader
                            title="Status"
                            field="isActive"
                            widthClassName="w-32"
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
                                {idx + 1}
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
                                        onClick={() => handleOpenEditModal(user.id)}
                                        className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                        title="View details"
                                    >
                                        <HiOutlineEye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleOpenEditModal(user.id)}
                                        className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                                        title="Edit"
                                    >
                                        <HiOutlinePencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user)}
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
    );
}
