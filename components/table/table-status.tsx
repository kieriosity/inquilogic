import { forwardRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const statusVariants = cva("px-3 py-1 rounded-full text-sm inline-block font-medium", {
  variants: {
    variant: {
      success: "bg-green-100 text-green-800",
      warning: "bg-yellow-100 text-yellow-800",
      error: "bg-red-100 text-red-800",
      default: "bg-gray-100 text-gray-800",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export interface TableStatusProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof statusVariants> {
  label: string
}

const TableStatus = forwardRef<HTMLSpanElement, TableStatusProps>(({ className, variant, label, ...props }, ref) => {
  return (
    <span ref={ref} className={cn(statusVariants({ variant }), className)} {...props}>
      {label}
    </span>
  )
})

TableStatus.displayName = "TableStatus"

export default TableStatus
