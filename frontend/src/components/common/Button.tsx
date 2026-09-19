import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    let classes = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none "
    
    if (variant === "default") classes += "bg-primary text-primary-foreground hover:bg-primary/90 "
    if (variant === "outline") classes += "border border-border bg-transparent hover:bg-muted text-foreground "
    if (variant === "ghost") classes += "bg-transparent hover:bg-muted text-foreground "
    if (variant === "destructive") classes += "bg-error text-white hover:bg-error/90 "

    if (size === "default") classes += "h-9 px-4 py-2 "
    if (size === "sm") classes += "h-8 px-3 rounded-md text-xs "
    if (size === "lg") classes += "h-10 px-8 rounded-md "
    if (size === "icon") classes += "h-9 w-9 "

    return (
      <button
        ref={ref}
        className={`${classes} ${className}`}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
