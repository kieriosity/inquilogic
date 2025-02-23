import { v4 as uuidv4 } from "uuid"
import classnames from "classnames"
import { cva, type VariantProps } from "class-variance-authority"
import { FaCheck } from "react-icons/fa6"
import { InputHTMLAttributes, forwardRef, useMemo } from "react"

const checkboxVariants = cva(
  "peer h-4 w-4 shrink-0 rounded-sm border border-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-white text-blue-600",
        error: "border-red-500 bg-white text-blue-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const labelVariants = cva("text-sm font-medium leading-none", {
  variants: {
    variant: {
      default: "text-gray-900",
      error: "text-red-500",
      disabled: "text-gray-400",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

const descriptionVariants = cva("text-sm", {
  variants: {
    variant: {
      default: "text-gray-500",
      error: "text-red-500",
      disabled: "text-gray-400",
    },
    layout: {
      block: "mt-2 block",
      inline: "ml-2 inline",
    },
  },
  defaultVariants: {
    variant: "default",
    layout: "block",
  },
})

/**
 * Props for the Checkbox component.
 */
export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "role">,
    VariantProps<typeof checkboxVariants> {
  /**
   * The label text for the checkbox.
   */
  label?: string
  /**
   * Additional descriptive text.
   */
  description?: string
  /**
   * Whether to show the checkbox in an error state.
   */
  error?: boolean
  /**
   * How to layout the description text.
   */
  descriptionLayout?: "block" | "inline"
  /**
   * Error message to display when in error state.
   */
  errorMessage?: string
}

/**
 * Props for the CheckIcon component.
 */
export interface CheckIconProps {
  disabled?: boolean
}

/**
 * A check icon component.
 */
export const CheckIcon = ({ disabled }: CheckIconProps) => (
  <FaCheck
    className={classnames(
      "pointer-events-none absolute top-1/2 left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 text-current opacity-0 peer-checked:opacity-100",
      disabled && "text-gray-400"
    )}
    aria-hidden="true"
  />
)

/**
 * A checkbox component with a label and optional description.
 */
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      variant,
      label,
      description,
      error,
      errorMessage,
      descriptionLayout = "block",
      disabled,
      required,
      checked,
      ...props
    },
    ref
  ) => {
    const id = useMemo(() => props.id || props.name || uuidv4(), [props.id, props.name])
    const descriptionId = useMemo(() => `${id}-description`, [id])
    const errorId = useMemo(() => `${id}-error`, [id])

    // Determine variants based on state
    const checkboxVariant = error ? "error" : "default"
    const textVariant = disabled ? "disabled" : error ? "error" : "default"

    return (
      <div className="flex items-start" role="group" aria-labelledby={label ? id : undefined}>
        <div className="relative flex items-center">
          <input
            type="checkbox"
            className={classnames(checkboxVariants({ variant: checkboxVariant }), "appearance-none", className)}
            ref={ref}
            disabled={disabled}
            id={id}
            checked={checked}
            required={required}
            aria-checked={checked}
            aria-required={required}
            aria-invalid={error}
            aria-describedby={[description && descriptionId, error && errorMessage && errorId]
              .filter(Boolean)
              .join(" ")}
            {...props}
          />
          <CheckIcon disabled={disabled} />
        </div>
        {(label || description || (error && errorMessage)) && (
          <div className={classnames("flex", descriptionLayout === "inline" ? "ml-2 items-center" : "ml-3 flex-col")}>
            {label && (
              <label
                id={id}
                htmlFor={id}
                className={classnames(
                  labelVariants({ variant: textVariant }),
                  "cursor-pointer",
                  disabled && "cursor-not-allowed"
                )}
              >
                {label}
                {required && (
                  <span className="ml-1 text-red-500" aria-hidden="true">
                    *
                  </span>
                )}
              </label>
            )}
            {description && (
              <span
                id={descriptionId}
                className={classnames(descriptionVariants({ variant: textVariant, layout: descriptionLayout }))}
              >
                {description}
              </span>
            )}
            {error && errorMessage && (
              <span
                id={errorId}
                className={classnames(descriptionVariants({ variant: "error", layout: "block" }), "mt-1")}
                role="alert"
              >
                {errorMessage}
              </span>
            )}
          </div>
        )}
      </div>
    )
  }
)

Checkbox.displayName = "Checkbox"

export default Checkbox
