import { BaseInfiniteTableReturnType } from '@/hooks/use-infinite-tanstack-table';
import { ReactNode } from 'react';
import { DataTable } from './data-table';

type Props<T> = {
  tableProperties: BaseInfiniteTableReturnType<T>;
  addItemComponent?: ReactNode;
};

export const BaseManagementTable = <T,>({
  tableProperties,
  addItemComponent,
}: Props<T>) => {
  return (
    <DataTable
      table={tableProperties.table}
      tableContainerRef={tableProperties.tableContainerRef}
      onScroll={(e) =>
        tableProperties.fetchMoreOnBottomReached(e.target as HTMLDivElement)
      }
      isFetching={tableProperties.isFetching}
      isLoading={tableProperties.isLoading}
      addItemComponent={addItemComponent}
      onSearch={tableProperties.onSearch}
    />
  );
};
