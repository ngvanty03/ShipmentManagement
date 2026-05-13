export interface PagedResult<T> {
    items: T[];           // C# 'Items' usually serializes to lowercase 'items'
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}
