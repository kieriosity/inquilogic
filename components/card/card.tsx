import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { HTMLAttributes, forwardRef } from "react"
import Button from "@/components/button/button"

const cardVariants = cva(
  "rounded-lg border border-gray-200 bg-card text-card-foreground shadow-sm",
  {
    variants: {
      width: {
        default: "w-full max-w-sm",
        double: "w-full max-w-2xl",
        full: "w-full",
      },
      layout: {
        default: "flex flex-col gap-4 p-6",
        "media-top": "flex flex-col gap-4",
        "media-header": "flex flex-col gap-4",
      },
    },
    defaultVariants: {
      width: "default",
      layout: "default",
    },
  }
)

const mediaVariants = cva("", {
  variants: {
    layout: {
      "media-top": "h-48 w-full bg-muted rounded-t-lg",
      "media-header": "h-64 w-full bg-muted",
    },
  },
})

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  title?: string
  children?: React.ReactNode
  buttonText?: string
  onButtonClick?: () => void
  imageUrl?: string
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, width, layout, title, children, buttonText, onButtonClick, imageUrl, ...props }, ref) => {
    const showMedia = layout === "media-top" || layout === "media-header"
    const contentClass = "p-6"
    const isHeaderLayout = layout === "media-header"

    return (
      <div
        ref={ref}
        className={cn(cardVariants({ width, layout, className }))}
        {...props}
      >
        {isHeaderLayout && title && (
          <h3 className="text-lg font-bold leading-none tracking-tight p-6 pb-4">
            {title}
          </h3>
        )}
        {showMedia && (
          <div className={cn(mediaVariants({ layout }))} aria-hidden="true">
            {imageUrl && (
              <img
                src={imageUrl}
                alt={title || "Card image"}
                className={cn("h-full w-full object-cover", !isHeaderLayout && "rounded-t-lg")}
              />
            )}
          </div>
        )}
        <div className={contentClass}>
          {!isHeaderLayout && title && (
            <h3 className="text-lg font-semibold leading-none tracking-tight mb-4">
              {title}
            </h3>
          )}
          {children}
          {buttonText && onButtonClick && (
            <div className="mt-4">
              <Button onClick={onButtonClick}>{buttonText}</Button>
            </div>
          )}
        </div>
      </div>
    )
  }
)

Card.displayName = "Card"

export default Card
