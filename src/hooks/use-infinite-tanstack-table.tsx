import { successToast } from '@/components/custom/error-toast';
import { BaseRequestParams } from '@/data/models/base/base-request-params-model';
import {
  InfiniteData,
  keepPreviousData,
  QueryObserverResult,
  RefetchOptions,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  OnChangeFn,
  SortingState,
  Table,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { useVirtualizer, Virtualizer } from '@tanstack/react-virtual';
import React from 'react';

import { useEffect } from 'react';

// T => List Type
// K => Request Params Type

export type BaseInfiniteTableReturnType<T> = {
  tableContainerRef: React.RefObject<HTMLDivElement>;
  table: Table<T>;
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
  isFetching: boolean;
  isLoading: boolean;
  fetchMoreOnBottomReached: (
    containerRefElement?: HTMLDivElement | null
  ) => void;
  onScroll: (e: React.UIEvent<HTMLDivElement, UIEvent>) => void;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<InfiniteData<T[], unknown>, Error>>;
  editItem: (updatedItem: T) => void;
  deleteItem: (id: string) => void;
  addItem: (newItem: T) => void;
  onSearch: (searchText: string) => void;
};

type BaseInfiniteTableProps<
  T,
  K extends BaseRequestParams = BaseRequestParams,
> = {
  columns: ColumnDef<T>[];
  pageSize?: number;
  page?: number;
  requestParams?: K;
  dataFetcher: (params: K) => Promise<T[]>;
  enableRowSelection?: boolean;
  queryKey: string;
  idKeyOfList: keyof T;
  setRequestParams?: React.Dispatch<React.SetStateAction<K>>;
};

export const useBaseInfiniteTable: <
  T,
  K extends BaseRequestParams = BaseRequestParams,
>({
  columns,
  pageSize,
  dataFetcher,
  requestParams,
  enableRowSelection,
  queryKey,
  idKeyOfList,
  setRequestParams,
}: BaseInfiniteTableProps<T, K>) => BaseInfiniteTableReturnType<T> = <
  T,
  K extends BaseRequestParams = BaseRequestParams,
>({
  columns,
  pageSize = 10,
  dataFetcher,
  requestParams,
  enableRowSelection = false,
  queryKey,
  idKeyOfList,
  setRequestParams,
}: BaseInfiniteTableProps<T, K>) => {
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const queryClient = useQueryClient();

  const { data, fetchNextPage, isFetching, isLoading, refetch } =
    useInfiniteQuery<T[]>({
      queryKey: [queryKey, sorting, requestParams],
      queryFn: async ({ pageParam = 1 }) => {
        const start = ((pageParam as number) - 1) * pageSize;
        const fetchedData = await dataFetcher({
          ...requestParams,
          pageSize,
          page: pageParam,
          orderBy: sorting[0]?.id,
          orderDirection: sorting[0]?.desc ? 'desc' : 'asc',
        } as K);
        return fetchedData;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === pageSize ? allPages.length + 1 : undefined;
      },
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
    });

  const flatData = React.useMemo(
    () => data?.pages?.flatMap((page) => page) ?? [],
    [data]
  ); //All data

  const lastDataCount = data?.pages.at(-1)?.length ?? 0;

  const fetchMoreOnBottomReached = React.useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        if (
          scrollHeight - scrollTop - clientHeight < 200 &&
          !isFetching &&
          lastDataCount === pageSize
        ) {
          fetchNextPage();
        }
      }
    },
    [pageSize, isFetching, lastDataCount, fetchNextPage]
  );

  React.useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  const table = useReactTable({
    data: flatData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: enableRowSelection,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: (e) => {
      if (
        table
          .getAllColumns()
          .filter(
            (column) =>
              column.getIsVisible() &&
              typeof column.accessorFn !== 'undefined' &&
              column.getCanHide()
          ).length === 1 &&
        Object.values((e as CallableFunction)())[0] === false
      ) {
        return;
      } else {
        setColumnVisibility(e);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    setSorting(updater);
    setRowSelection({});
    if (table.getRowModel().rows.length) {
      rowVirtualizer.scrollToIndex?.(0);
    }
  };

  table.setOptions((prev) => ({
    ...prev,
    onSortingChange: handleSortingChange,
  }));

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 33,
    getScrollElement: () => tableContainerRef.current,
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  useEffect(() => {
    setRowSelection({});
    if (table.getRowModel().rows.length) {
      rowVirtualizer.scrollToIndex?.(0);
    }
  }, [requestParams, rowVirtualizer, table]);

  const onScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    fetchMoreOnBottomReached(e.target as HTMLDivElement);
  };

  const addMutation = (newItem: T) => {
    queryClient.setQueryData(
      [queryKey, sorting, requestParams],
      (oldData: InfiniteData<T[]> | undefined) => {
        if (!oldData) {
          return {
            pages: [[newItem]],
            pageParams: [1],
          };
        }

        const newPages = [...oldData.pages];

        if (newPages[0]) {
          newPages[0] = [newItem, ...newPages[0]];
        } else {
          newPages[0] = [newItem];
        }

        return { ...oldData, pages: newPages };
      }
    );

    successToast({ message: 'Data added successfully!' });
  };

  const editMutation = (updatedItem: T) => {
    queryClient.setQueryData(
      [queryKey, sorting, requestParams],
      (oldData: InfiniteData<T[]> | undefined) => {
        if (!oldData) return oldData;
        const newPages = oldData.pages.map((page) =>
          page.map((item) =>
            (item[idKeyOfList] as string) === updatedItem[idKeyOfList]
              ? updatedItem
              : item
          )
        );

        successToast({ message: 'Data updated successfully!' });

        return { ...oldData, pages: newPages };
      }
    );
  };

  const deleteMutation = (id: string) => {
    queryClient.setQueryData(
      [queryKey, sorting, requestParams],
      (oldData: InfiniteData<T[]> | undefined) => {
        if (!oldData) return oldData;

        const newPages = oldData.pages.map((page) =>
          page.filter((item) => item[idKeyOfList] !== id)
        );

        return { ...oldData, pages: newPages };
      }
    );
  };

  const onSearch = (searchText: string) => {
    setRequestParams?.((prev) => ({ ...prev, searchName: searchText }));
  };

  return {
    tableContainerRef,
    table,
    rowVirtualizer,
    isFetching,
    isLoading,
    fetchMoreOnBottomReached,
    onScroll,
    refetch,
    editItem: editMutation,
    deleteItem: deleteMutation,
    addItem: addMutation,
    onSearch,
  };
};
