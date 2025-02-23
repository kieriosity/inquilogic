"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
  forwardRef,
  memo,
  useState,
} from "react";
import type { IconType } from "react-icons";
import { FaSpinner } from "react-icons/fa";

// Helper to darken a hex color (for custom variant hover effect)
function darkenColor(hex: string, percent: number): string {
  let color = hex.replace(/^#/, "");
  if (color.length === 3) {
    color = color.split("").map((c) => c + c).join("");
  }
  const num = parseInt(color, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;

  r = Math.max(0, Math.min(255, Math.floor(r * (100 - percent) / 100)));
  g = Math.max(0, Math.min(255, Math.floor(g * (100 - percent) / 100)));
  b = Math.max(0, Math.min(255, Math.floor(b * (100 - percent) / 100)));

  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

const buttonStyles = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 gap-2",
  {
    variants: {
      variant: {
        primary: "bg-blue-600 text-white hover:bg-blue-900 focus:ring-blue-600",
        secondary:
          "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
        danger: "bg-red-600 text-white hover:bg-red-900 focus:ring-red-600",
        custom: "text-white", // Custom variant: styling via inline style and hover logic
        link: "underline text-blue-600 hover:text-blue-800 focus:ring-transparent p-0", // Link variant: no border, no background
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

type ButtonVariantProps = VariantProps<typeof buttonStyles>;

type ButtonBaseProps = {
  leadingIcon?: IconType;
  trailingIcon?: IconType;
  backgroundColor?: string;
  hoverBackgroundColor?: string;
  loading?: boolean;
} & ButtonVariantProps;

interface ButtonAsButton
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonBaseProps {
  href?: never;
}

interface ButtonAsLink
  extends AnchorHTMLAttributes<HTMLAnchorElement>,
    ButtonBaseProps {
  href: string;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * A versatile button component supporting multiple variants, sizes, and states.
 * Renders as either a button or a link based on the presence of the href prop.
 */
const Button = memo(
  forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>((props, ref) => {
    const {
      className,
      variant,
      size,
      leadingIcon: LeadingIcon,
      trailingIcon: TrailingIcon,
      backgroundColor,
      hoverBackgroundColor,
      loading,
      ...rest
    } = props;

    // For custom variant, handle hover state to swap background color.
    const [isHovered, setIsHovered] = useState(false);

    // Inline style for custom variant.
    let finalStyle = props.style || {};
    if (backgroundColor && variant === "custom") {
      const defaultHover = hoverBackgroundColor || darkenColor(backgroundColor, 10);
      finalStyle = {
        ...finalStyle,
        backgroundColor: isHovered ? defaultHover : backgroundColor,
      };
    } else {
      finalStyle = props.style || {};
    }

    const commonProps = {
      className: cn(buttonStyles({ variant, size, className })),
      style: finalStyle,
      onMouseEnter: variant === "custom" ? () => setIsHovered(true) : undefined,
      onMouseLeave: variant === "custom" ? () => setIsHovered(false) : undefined,
    };

    if ("href" in props) {
      return (
        <a
          {...commonProps}
          {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
          ref={ref as React.Ref<HTMLAnchorElement>}
        >
          {loading ? (
            <FaSpinner className="animate-spin h-4 w-4" aria-hidden="true" />
          ) : (
            <>
              {LeadingIcon && <LeadingIcon className="h-4 w-4" aria-hidden="true" />}
              {props.children}
              {TrailingIcon && <TrailingIcon className="h-4 w-4" aria-hidden="true" />}
            </>
          )}
        </a>
      );
    }

    return (
      <button
        {...commonProps}
        {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
        type={(rest as ButtonHTMLAttributes<HTMLButtonElement>).type ?? "button"}
        ref={ref as React.Ref<HTMLButtonElement>}
      >
        {loading ? (
          <FaSpinner className="animate-spin h-4 w-4" aria-hidden="true" />
        ) : (
          <>
            {LeadingIcon && <LeadingIcon className="h-4 w-4" aria-hidden="true" />}
            {props.children}
            {TrailingIcon && <TrailingIcon className="h-4 w-4" aria-hidden="true" />}
          </>
        )}
      </button>
    );
  })
);

Button.displayName = "Button";

export default Button;
export { Button, buttonStyles };