import ReactPaginate from 'react-paginate';

interface PaginationControlProps {
    totalPages: number;
    pageNumber: number;
    pageSize: number;
    onPageChange: (selectedItem: { selected: number }) => void;
    onPageSizeChange: (newSize: number) => void;
}

export function PaginationControl({
    totalPages,
    pageNumber,
    pageSize,
    onPageChange,
    onPageSizeChange
}: PaginationControlProps) {
    if (totalPages <= 0) return null;

    // Handle ES Module interop for react-paginate
    const Pagination = (ReactPaginate as any).default || ReactPaginate;

    return (
        <div className="flex justify-between items-center p-4 border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2" >
                <span className="text-sm text-gray-500">Items per page:</span>
                <select data-testid="pagination-pageSize"
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                    className="px-2 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
            </div>

            {totalPages > 1 && (
                <div data-testid="pagination-container">
                    <Pagination
                        breakLabel="..."
                        nextLabel="Next"
                        onPageChange={onPageChange}
                        pageRangeDisplayed={3}
                        marginPagesDisplayed={1}
                        pageCount={totalPages}
                        previousLabel="Previous"
                        forcePage={pageNumber - 1}
                        containerClassName="flex items-center gap-1.5"
                        pageClassName="flex"
                        pageLinkClassName="flex items-center justify-center w-8 h-8 rounded-lg text-sm font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer"
                        previousClassName="flex"
                        previousLinkClassName="flex items-center px-3 h-8 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        nextClassName="flex"
                        nextLinkClassName="flex items-center px-3 h-8 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        breakClassName="flex items-center justify-center w-8 h-8"
                        breakLinkClassName="text-slate-500"
                        activeClassName="bg-indigo-600 rounded-lg"
                        activeLinkClassName="!text-white hover:bg-indigo-600 hover:text-white"
                        disabledClassName="opacity-40 pointer-events-none"
                    />
                </div>
            )}
        </div>
    );
}
