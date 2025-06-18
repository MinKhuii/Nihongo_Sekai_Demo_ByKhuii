import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Button variants using CVA (Class Variance Authority)
const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      // Button styles
      variant: {
        // Primary - Main brand crimson gradient
        primary: [
          "bg-gradient-to-r from-nihongo-crimson-600 to-nihongo-crimson-700",
          "text-white shadow-lg",
          "hover:from-nihongo-crimson-700 hover:to-nihongo-crimson-800",
          "focus-visible:ring-nihongo-crimson-600",
          "active:scale-98",
        ],

        // Secondary - Sakura gradient
        secondary: [
          "bg-gradient-to-r from-nihongo-sakura-500 to-nihongo-sakura-600",
          "text-white shadow-lg",
          "hover:from-nihongo-sakura-600 hover:to-nihongo-sakura-700",
          "focus-visible:ring-nihongo-sakura-500",
          "active:scale-98",
        ],

        // Outline - Border with transparent background
        outline: [
          "border-2 border-nihongo-crimson-200 bg-transparent",
          "text-nihongo-crimson-700",
          "hover:bg-nihongo-crimson-50 hover:border-nihongo-crimson-300",
          "focus-visible:ring-nihongo-crimson-600",
        ],

        // Ghost - Transparent with hover
        ghost: [
          "bg-transparent text-nihongo-ink-700",
          "hover:bg-nihongo-ink-100 hover:text-nihongo-ink-900",
          "focus-visible:ring-nihongo-ink-400",
        ],

        // Link - Text-only button
        link: [
          "bg-transparent text-nihongo-crimson-600 underline-offset-4",
          "hover:underline hover:text-nihongo-crimson-700",
          "focus-visible:ring-nihongo-crimson-600",
        ],

        // Destructive - Error/danger actions
        destructive: [
          "bg-nihongo-accent-error-600 text-white shadow-lg",
          "hover:bg-nihongo-accent-error-700",
          "focus-visible:ring-nihongo-accent-error-600",
          "active:scale-98",
        ],

        // Success - Positive actions
        success: [
          "bg-nihongo-accent-success-600 text-white shadow-lg",
          "hover:bg-nihongo-accent-success-700",
          "focus-visible:ring-nihongo-accent-success-600",
          "active:scale-98",
        ],

        // Warning - Warning actions
        warning: [
          "bg-nihongo-accent-warning-600 text-white shadow-lg",
          "hover:bg-nihongo-accent-warning-700",
          "focus-visible:ring-nihongo-accent-warning-600",
          "active:scale-98",
        ],

        // Gold - Special/premium actions
        gold: [
          "bg-gradient-to-r from-nihongo-accent-gold-500 to-nihongo-accent-gold-600",
          "text-white shadow-lg",
          "hover:from-nihongo-accent-gold-600 hover:to-nihongo-accent-gold-700",
          "focus-visible:ring-nihongo-accent-gold-500",
          "active:scale-98",
        ],
      },

      // Button sizes
      size: {
        xs: "h-6 px-2 text-xs",
        sm: "h-8 px-3 text-xs",
        base: "h-10 px-4 text-sm", // Default
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",

        // Icon-only sizes
        iconXs: "h-6 w-6 p-0",
        iconSm: "h-8 w-8 p-0",
        icon: "h-10 w-10 p-0",
        iconLg: "h-12 w-12 p-0",
        iconXl: "h-14 w-14 p-0",
      },

      // Loading state
      loading: {
        true: "cursor-wait",
        false: "",
      },

      // Full width
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "base",
      loading: false,
      fullWidth: false,
    },
  },
);

// Button Props Interface
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loadingText?: string;
}

// Button Component
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      fullWidth,
      asChild = false,
      children,
      leftIcon,
      rightIcon,
      loadingText,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    const isDisabled = disabled || loading;

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, loading, fullWidth, className }),
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {loadingText || children}
          </>
        ) : (
          <>
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
          </>
        )}
      </Comp>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
