export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

type Sort = {
  direction: 'asc' | 'desc';
  property: string;
};
export interface PageResponse<T> {
  data: T[];
  totalPages: number;
  totalElements: number;
  page: number;
  size: number;
  sorts: Sort[];
}

export interface UserPageResponse<T> {
  items: T[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}

