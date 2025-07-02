import { ColumnDef as TanStackColumnDef } from '@tanstack/react-table'

export type ColumnDef<TData, TValue = unknown> = TanStackColumnDef<
  TData,
  TValue
> & {
  title?: string
}
