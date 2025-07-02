import {
  ColumnDef,
  flexRender,
  Table as TanStackTable,
} from '@tanstack/react-table';

import {
  ScrollableTableWrapper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DataTableToolbar } from './data-table-toolbar';
import { DataTablePagination } from './data-table-pagination';
import { DataTableColumnHeader } from './data-table-column-header';
import { NotFoundDataTable } from './not-found-data';
import { Skeleton } from '../skeleton';
import React from 'react';

// İki farklı prop seti
interface DataTableProps<TData> {
  table: TanStackTable<TData>;
  tableContainerRef?: React.RefObject<HTMLDivElement>;
  onScroll?: (e: any) => void;
  isLoading?: boolean;
  isFetching?: boolean;
  addItemComponent?: React.ReactNode;
  maxTableHeight?: number;
  onSearch?: (search: string) => void;
}

export function DataTable<TData>({
  table,
  tableContainerRef,
  onScroll,
  isLoading,
  isFetching,
  addItemComponent,
  maxTableHeight,
  onSearch,
}: DataTableProps<TData>) {
  return (
    <div className='space-y-4'>
      <DataTableToolbar
        table={table}
        addItemComponent={addItemComponent}
        onSearch={onSearch}
      />
      {!isLoading && table.getRowModel().rows?.length == 0 ? (
        <NotFoundDataTable />
      ) : (
        <div className='rounded-md border'>
          <ScrollableTableWrapper
            maxHeight={`${maxTableHeight ?? 60}vh`}
            ref={tableContainerRef}
            onScroll={onScroll}
          >
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              {isLoading ? (
                <TableBody>
                  {[...Array(7)].map((_, index) => (
                    <TableRow key={index}>
                      {table.getAllColumns().map((column) => (
                        <TableCell key={column.id} className='py-4'>
                          <Skeleton className='h-5 w-full' />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              ) : (
                <TableBody>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  {isFetching &&
                    [...Array(10)].map((_, index) => (
                      <TableRow key={index}>
                        {table.getAllColumns().map((column) => (
                          <TableCell key={column.id} className='py-4'>
                            <Skeleton className='h-5 w-full' />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                </TableBody>
              )}
            </Table>
          </ScrollableTableWrapper>
        </div>
      )}
      {/* <DataTablePagination table={table} /> */}
    </div>
  );
}

export type DefaultColmnType<T> = {
  headerTitle: string;
  tableKey: keyof T & string;
};

export const defaultColumn: <T>(option: DefaultColmnType<T>) => ColumnDef<T> = (
  option
) => ({
  accessorKey: option.tableKey,
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title={option.headerTitle} />
  ),
  cell: ({ row }) => (
    <div className='w-[80px]'>{row.getValue(option.tableKey)}</div>
  ),
  enableSorting: false,
  enableHiding: false,
});

export const defaultColumnWithSorting: <T>(
  option: DefaultColmnType<T>
) => ColumnDef<T> = (option) => ({
  accessorKey: option.tableKey,
  id: option.tableKey as string,
  title: option.headerTitle,
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title={option.headerTitle} />
  ),
  cell: ({ row }) => (
    <div className='w-[80px]'>{row.getValue(option.tableKey)}</div>
  ),
});
