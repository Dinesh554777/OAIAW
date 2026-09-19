import { LucideIcon, Inbox } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ 
  title, 
  description, 
  icon: Icon = Inbox, 
  actionLabel, 
  onAction 
}: EmptyStateProps) {
  return (
    <Card className="w-full h-full min-h-[300px] flex items-center justify-center border-dashed border-2 bg-transparent shadow-none">
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        <div className="rounded-full bg-surface-elevated p-4 mb-4">
          <Icon className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
          {description}
        </p>
        {actionLabel && onAction && (
          <Button onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
