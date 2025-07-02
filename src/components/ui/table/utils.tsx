import { ColumnDef, Row, Table } from '@tanstack/react-table'
import { Checkbox } from '../checkbox'

export const tableHeadSelectColumn = <T,>(): ColumnDef<T> => ({
  id: 'select',
  header: ({ table }) =>
    table.options.enableRowSelection && (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
  cell: ({ row }) =>
    row.getCanSelect() && (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
  enableSorting: false,
  enableHiding: false,
})
