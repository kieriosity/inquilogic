"use client"

import { useMemo } from "react"
import { FaChevronLeft, FaChevronRight, FaAnglesLeft, FaAnglesRight } from "react-icons/fa6"
import Button from "../button/button"
import { cn } from "@/lib/utils"

interface PaginationProps {
  totalItems: number
  itemsPerPage: number
  currentPage: number
  onPageChange: (page: number) => void
  className?: string
}

export default function Pagination({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  className,
}: PaginationProps) {
  // Guard against itemsPerPage <= 0
  const safeItemsPerPage = itemsPerPage > 0 ? itemsPerPage : 1
  const totalPages = Math.ceil(totalItems / safeItemsPerPage)

  // Fixed sibling count: number of pages to show on each side of the current page
  const siblingCount = 4

  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = []
    if (totalPages <= 1) return [1]

    // Always show the first page.
    pages.push(1)

    // Determine the sliding window bounds.
    const startPage = Math.max(2, currentPage - siblingCount)
    const endPage = Math.min(totalPages - 1, currentPage + siblingCount)

    // Add ellipsis if there's a gap between first page and window start.
    if (startPage > 2) {
      pages.push("...")
    }

    // Add the window of pages.
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    // Add ellipsis if there's a gap between window end and last page.
    if (endPage < totalPages - 1) {
      pages.push("...")
    }

    // Always show the last page.
    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }, [currentPage, totalPages])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page)
    }
  }

  return (
    <nav className={cn("flex items-center justify-between", className)} aria-label="Pagination">
      <div className="flex items-center gap-1">
        <span className="text-sm text-gray-700">
          {currentPage} of {totalPages} Pages
        </span>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          leadingIcon={FaAnglesLeft}
          aria-label="First page"
        />
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          leadingIcon={FaChevronLeft}
          aria-label="Previous page"
        />
        {pageNumbers.map((page, index) =>
          typeof page === "number" ? (
            <Button
              key={`page-${page}`}
              variant={currentPage === page ? "primary" : "secondary"}
              size="sm"
              onClick={() => handlePageChange(page)}
              className={cn("min-w-[32px]", currentPage === page && "pointer-events-none")}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </Button>
          ) : (
            <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
              {page}
            </span>
          )
        )}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          leadingIcon={FaChevronRight}
          aria-label="Next page"
        />
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          leadingIcon={FaAnglesRight}
          aria-label="Last page"
        />
      </div>
    </nav>
  )
}
