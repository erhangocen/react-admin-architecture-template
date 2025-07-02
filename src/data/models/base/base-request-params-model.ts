import { SortingState } from '@tanstack/react-table';

export type BaseRequestParams = {
  page?: number;
  pageSize?: number;
  sorting?: SortingState;
  searchName?: string;
  orderBy?: string;
  orderDirection?: string;
};
