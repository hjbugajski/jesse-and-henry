export interface PayloadCollectionsGetApi<T> {
  docs: T[];
  errors?: { message: string }[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  nextPage: string | null;
  page: number;
  pagingCounter: number;
  prevPage: string | null;
  totalDocs: number;
  totalPages: number;
}

export interface PayloadCollectionsPatchApi<T> {
  doc: T;
  errors?: { message: string }[];
  message: string;
}
