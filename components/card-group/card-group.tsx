import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { HTMLAttributes, forwardRef } from "react"

const cardGroupVariants = cva("grid gap-6", {
  variants: {
    columns: {
      "1": "grid-cols-1",
      "2": "grid-cols-1 md:grid-cols-2",
      "3": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      "4": "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    },
  },
  defaultVariants: {
    columns: "3",
  },
})

export interface CardGroupProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardGroupVariants> {
  children: React.ReactNode
}

const CardGroup = forwardRef<HTMLDivElement, CardGroupProps>(
  ({ className, columns, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardGroupVariants({ columns, className }))}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardGroup.displayName = "CardGroup"

export default CardGroup
