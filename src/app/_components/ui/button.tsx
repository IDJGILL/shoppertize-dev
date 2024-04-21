import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "~/lib/utils/functions/ui"

const buttonVariants = cva(
  "inline-flex relative items-center justify-center select-none rounded font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 whitespace-nowrap focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:opacity-90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border text-foreground border-input bg-transparent font-normal hover:text-primary hover:bg-gray-50",
        secondary: "bg-secondary text-white hover:opacity-90",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        icon: "",
      },
      size: {
        default: "h-12 px-4 py-2",
        lg: "h-12 px-8 text-sm",
        sm: "h-11 px-6 text-sm",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={props.loading === "true"}
        {...props}
      >
        {props.loading !== "true" ? (
          props.children
        ) : (
          <svg
            className={cn("h-5 w-5 animate-spin text-white", {
              "text-primary": variant === "outline",
            })}
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
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
      </Comp>
    )
  },
)

Button.displayName = "Button"

export { Button, buttonVariants }
