import { FC } from "react"
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa"
import { TableColumn } from "./table"

interface TableHeaderProps {
  column: TableColumn
  onSort?: (columnId: string) => void
  sortConfig?: {
    key: string
    direction: "asc" | "desc"
  } | null
}

export const TableHeader: FC<TableHeaderProps> = ({ column, onSort, sortConfig }) => {
  const handleSort = () => {
    if (column.sortable) {
      onSort?.(column.id)
    }
  }

  const getSortIcon = () => {
    if (!column.sortable) return null

    if (sortConfig?.key === column.id) {
      return sortConfig.direction === "asc" ? (
        <FaSortUp className="h-3 w-3" aria-hidden="true" />
      ) : (
        <FaSortDown className="h-3 w-3" aria-hidden="true" />
      )
    }

    return <FaSort className="h-3 w-3" aria-hidden="true" />
  }

  return (
    <div className="flex-1 px-2">
      <div className="flex items-center text-sm font-medium text-gray-900">
        <span>{column.label}</span>
        {column.sortable && (
          <button
            type="button"
            onClick={handleSort}
            className="ml-1 text-gray-500 hover:text-gray-700"
            aria-label={`Sort by ${column.label}`}
          >
            {getSortIcon()}
          </button>
        )}
      </div>
    </div>
  )
}

export default TableHeader
