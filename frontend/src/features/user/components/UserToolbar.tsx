import { useState, useEffect } from 'react';
import { HiOutlineSearch, HiOutlineTrash } from 'react-icons/hi';
import type { SearchUserRequest } from '../../../dto/user';

interface UserToolbarProps {
    filterParam: SearchUserRequest;
    onSearch: (email: string, isActive?: boolean) => void;
    onClear: () => void;
}

export function UserToolbar({ filterParam, onSearch, onClear }: UserToolbarProps) {
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
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="relative">
                <div className="flex gap-3 flex-1">
                    <div className="relative flex-1">
                        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            value={localFilter.email}
                            onChange={(e) => {
                                setLocalFilter({ ...localFilter, email: e.target.value })
                            }}
                            type="text"
                            data-testid="search-email"
                            placeholder="Search by email..."
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                    <select
                        value={localFilter.isActive === undefined ? '' : localFilter.isActive ? 'true' : 'false'}
                        onChange={(e) => {
                            setLocalFilter({ ...localFilter, isActive: e.target.value === '' ? undefined : e.target.value === 'true' })
                        }}
                        data-testid="search-isactive"
                        className="px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                    >
                        <option value="">All Status</option>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </div>
            </div>
            <button
                onClick={() => onSearch(localFilter.email || '', localFilter.isActive)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md transition-colors"
            >
                <HiOutlineSearch className="w-4 h-4" />
                Search
            </button>
            <button
                onClick={onClear}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-400 hover:bg-red-500 text-white text-sm font-semibold rounded-xl shadow-md transition-colors"
            >
                <HiOutlineTrash className="w-4 h-4" />
                Clear
            </button>
        </div>
    );
}
