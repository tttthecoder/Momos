export interface PaginationRequest {
  page: number;

  limit: number;

  order?: { [field: string]: "ASC" | "DESC" };

  filter?: { [field: string]: string | null };
}

export interface PaginationResponseDto<T> {
  currentPage: number;
  skippedRecords: number;
  totalPages: number;
  hasNext: boolean;
  content: T[];
  payloadSize: number;
  totalRecords: number;
}
