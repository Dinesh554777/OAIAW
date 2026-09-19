import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "ai"
}

export function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
  let classes = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none "

  if (variant === "default") classes += "border-transparent bg-primary text-primary-foreground shadow-sm "
  if (variant === "secondary") classes += "border-transparent bg-surface-elevated text-muted-foreground hover:bg-muted/80 "
  if (variant === "destructive") classes += "border-error/30 bg-error/10 text-error "
  if (variant === "success") classes += "border-success/30 bg-success/10 text-success "
  if (variant === "warning") classes += "border-warning/30 bg-warning/10 text-warning "
  if (variant === "ai") classes += "border-ai/30 bg-ai/10 text-ai "
  if (variant === "outline") classes += "text-foreground border-border "

  return (
    <div className={`${classes} ${className}`} {...props} />
  )
}
