import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "border border-border bg-background text-foreground",
        info: "border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        warning: "border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        success: "border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        error: "border-transparent bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        pending: "border-transparent bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}) {
  return (
    <div
      className={cn(badgeVariants({ variant }), className)}
      role="status"
      aria-live="polite"
      {...props}
    />
  );
}

export { Badge, badgeVariants }
