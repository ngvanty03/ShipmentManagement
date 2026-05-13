import React from 'react'
import { HiOutlineChevronUp, HiOutlineChevronDown } from 'react-icons/hi'

const SortListHeader: React.FC<{
    title: string
    field: string
    sortBy: string
    sortDirection: string
    widthClassName?: string
    onSortChange: (field: string, direction: string) => void
}> = ({ title, field, sortBy, sortDirection, widthClassName, onSortChange }) => {

    const handleSort = () => {
        let direction: string = 'asc'

        if (sortBy === field && sortDirection === 'asc') {
            direction = 'desc'
        }

        onSortChange(field, direction)
    }
    return (
        <th
            onClick={handleSort}
            className={`text-center px-5 py-3.5 font-semibold text-gray-600 border border-gray-300 cursor-pointer ${widthClassName || ''}`}
        >
            <div className="flex items-center gap-1 text-center justify-center">
                {title}

                <div className="flex flex-col">
                    <HiOutlineChevronUp
                        className={`w-3 h-3 ${sortBy === field && sortDirection === 'asc'
                                ? 'text-indigo-600'
                                : 'text-gray-400'
                            }`}
                    />

                    <HiOutlineChevronDown
                        className={`w-3 h-3 -mt-1 ${sortBy === field && sortDirection === 'desc'
                                ? 'text-indigo-600'
                                : 'text-gray-400'
                            }`}
                    />
                </div>
            </div>
        </th>
    )
}

export default SortListHeader