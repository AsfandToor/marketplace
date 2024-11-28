export type Pagination<T> = {
    page: number;
    limit: number;
    count: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    data: T[]
}