import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'outline'
}

export function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
  let classes = "inline-flex items-center px-2 py-0.5 text-[10px] font-mono tracking-wider uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 "
  
  if (variant === 'default') classes += "bg-surface text-white border border-border "
  if (variant === 'success') classes += "bg-green-950/30 text-green-400 border border-green-900/50 "
  if (variant === 'warning') classes += "bg-yellow-950/30 text-yellow-500 border border-yellow-900/50 "
  if (variant === 'destructive') classes += "bg-red-950/30 text-red-400 border border-red-900/50 "
  if (variant === 'outline') classes += "text-foreground border border-border "

  classes += className

  return (
    <div className={classes} {...props} />
  )
}
