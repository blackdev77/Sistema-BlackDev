import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "default", ...props }, ref) => {
    
    let classes = "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-50 "
    
    if (variant === 'primary') classes += "bg-white text-black hover:bg-gray-200 "
    if (variant === 'secondary') classes += "bg-surface text-white hover:bg-surface/80 "
    if (variant === 'ghost') classes += "hover:bg-surface hover:text-white text-muted-foreground "
    if (variant === 'outline') classes += "border border-border bg-transparent hover:bg-surface text-white "
    
    if (size === 'default') classes += "h-9 px-4 py-2 "
    if (size === 'sm') classes += "h-8 px-3 text-xs "
    if (size === 'lg') classes += "h-10 px-8 "
    if (size === 'icon') classes += "h-9 w-9 "
    
    classes += className

    return (
      <button
        className={classes}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
