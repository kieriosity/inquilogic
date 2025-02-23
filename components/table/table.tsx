import React, { forwardRef, type ChangeEvent } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import Checkbox from "../checkbox/checkbox"
import TableHeader from "./table-header"
import { cn } from "../../lib/utils"

const tableVariants = cva("w-full border border-gray-300 rounded-md", {
  variants: {
    variant: {
      default: "bg-white",
      error: "border-red-500 bg-white",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export interface TableColumn {
  id: string
  label: string
  sortable?: boolean
}

export interface TableRow {
  id: string
  [key: string]: any
}

export interface TableProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof tableVariants> {
  columns: TableColumn[]
  data: TableRow[]
  selectedRows?: string[]
  onSelectAll?: (checked: boolean) => void
  onRowSelect?: (rowId: string, checked: boolean) => void
  onSort?: (columnId: string) => void
  sortConfig?: {
    key: string
    direction: "asc" | "desc"
  } | null
  itemsPerPage?: number // For future pagination implementation
}

class TableErrorBoundary extends React.Component<{ children: React.ReactNode }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <div className="p-4 text-red-500">Error loading table. Please try again.</div>
    }
    return this.props.children
  }
}

const Table = forwardRef<HTMLDivElement, TableProps>(
  (
    {
      className,
      variant,
      columns,
      data,
      selectedRows = [],
      onSelectAll,
      onRowSelect,
      onSort,
      sortConfig,
      itemsPerPage = 10, // Not used yet, but reserved for future pagination
      ...props
    },
    ref
  ) => {
    const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
      onSelectAll?.(e.target.checked)
    }

    const handleRowSelect = (rowId: string) => (e: ChangeEvent<HTMLInputElement>) => {
      onRowSelect?.(rowId, e.target.checked)
    }

    const isAllSelected = data.length > 0 && data.every((row) => selectedRows.includes(row.id))

    return (
      <TableErrorBoundary>
        <div ref={ref} className={cn(tableVariants({ variant }), className)} {...props}>
          <div className="flex border-b border-gray-300 bg-gray-50 p-3">
            <div className="flex-[0.5] px-2">
              <Checkbox checked={isAllSelected} onChange={handleSelectAll} aria-label="Select all rows" />
            </div>
            {columns.map((column) => (
              <TableHeader key={column.id} column={column} onSort={onSort} sortConfig={sortConfig} />
            ))}
          </div>
          <div>
            {data.map((row) => (
              <div key={row.id} className="flex border-b border-gray-300 p-3 last:border-0 hover:bg-gray-50">
                <div className="flex-[0.5] px-2">
                  <Checkbox
                    checked={selectedRows.includes(row.id)}
                    onChange={handleRowSelect(row.id)}
                    aria-label={`Select row ${row.id}`}
                  />
                </div>
                {columns.map((column) => (
                  <div key={`${row.id}-${column.id}`} className="flex-1 px-2 text-sm text-gray-900">
                    {row[column.id]}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </TableErrorBoundary>
    )
  }
)

Table.displayName = "Table"

export default Table
