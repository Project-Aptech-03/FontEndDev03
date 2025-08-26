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
  content: T[];
  totalPages: number;
  totalElements: number;
  page: number;
  size: number;
  sorts: Sort[];
}
