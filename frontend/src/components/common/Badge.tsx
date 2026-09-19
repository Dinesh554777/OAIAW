import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "ai"
}

export function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
  let classes = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none "

  if (variant === "default") classes += "border-transparent bg-primary text-primary-foreground "
  if (variant === "secondary") classes += "border-transparent bg-muted text-muted-foreground "
  if (variant === "destructive") classes += "border-transparent bg-error text-white "
  if (variant === "success") classes += "border-transparent bg-success text-white "
  if (variant === "warning") classes += "border-transparent bg-warning text-white "
  if (variant === "ai") classes += "border-transparent bg-ai text-white "
  if (variant === "outline") classes += "text-foreground border-border "

  return (
    <div className={`${classes} ${className}`} {...props} />
  )
}
