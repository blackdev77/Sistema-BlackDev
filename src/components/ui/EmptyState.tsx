import { LucideIcon } from "lucide-react";
import { Button } from "./Button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center p-12 text-center border border-dashed border-border/50 rounded-sm bg-surface/20">
      <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mb-6 shadow-sm border border-border/50">
        <Icon className="w-8 h-8 text-muted-foreground stroke-[1.5]" />
      </div>
      <h3 className="text-xl font-serif font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-8 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
