import { cva, VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { FaCircleExclamation, FaCircleInfo, FaCircleCheck, FaCircleXmark } from "react-icons/fa6"
import { ReactNode, forwardRef } from "react"

/**
 * Alert variants for different message types
 * @property info - Blue styling for informational messages
 * @property success - Green styling for success messages
 * @property warning - Amber styling for warning messages
 * @property error - Red styling for error messages
 */
const alertVariants = cva("relative flex items-start gap-3 rounded-lg p-4 border-l-12", {
  variants: {
    variant: {
      info: "bg-blue-50 border-blue-400 text-gray-900",
      success: "bg-green-50 border-green-400 text-gray-900",
      warning: "bg-amber-50 border-amber-400 text-gray-900",
      error: "bg-red-50 border-red-400 text-gray-900",
    },
    size: {
      standard: "min-h-[4rem]",
      slim: "min-h-[3rem]",
    },
  },
  defaultVariants: {
    variant: "info",
    size: "standard",
  },
})

const iconStyle = "h-6 w-6"
const iconMap = {
  info: <FaCircleInfo className={`${iconStyle} text-blue-400`} />,
  success: <FaCircleCheck className={`${iconStyle} text-green-400`} />,
  warning: <FaCircleExclamation className={`${iconStyle} text-amber-400`} />,
  error: <FaCircleXmark className={`${iconStyle} text-red-400`} />,
}

type VariantType = "info" | "success" | "warning" | "error"

/**
 * Alert component for displaying important messages with different severity levels.
 * @component
 * 
 * @param {Object} props - The alert props
 * @param {"info" | "success" | "warning" | "error"} [props.variant="info"] - The alert's severity level and visual style
 * @param {"standard" | "slim"} [props.size="standard"] - The alert's size
 * @param {string} [props.title] - Optional title text displayed above the main message
 * @param {ReactNode} props.children - The main content of the alert
 */
interface AlertProps extends VariantProps<typeof alertVariants> {
  variant?: VariantType
  title?: string
  children: ReactNode
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(({ variant = "info", size, title, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(alertVariants({ variant, size }))}
      role="alert"
      aria-label={`${variant} alert`}
    >
      <span aria-hidden="true">{iconMap[variant]}</span>
      <div className="flex-1">
        {title && (
          <h5 className="mb-1 font-medium leading-6">
            {title}
          </h5>
        )}
        <div className="text-sm">
          {children}
        </div>
      </div>
    </div>
  )
})

Alert.displayName = "Alert"

export default Alert
