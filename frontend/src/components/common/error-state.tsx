import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ 
  title = "Something went wrong", 
  message = "An error occurred while loading this content.", 
  onRetry 
}: ErrorStateProps) {
  return (
    <Card className="w-full max-w-md mx-auto mt-8 border-error/20 bg-error/5 shadow-sm">
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        <div className="rounded-full bg-error/10 p-3 mb-4">
          <AlertCircle className="h-6 w-6 text-error" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-[250px]">
          {message}
        </p>
        {onRetry && (
          <Button variant="outline" onClick={onRetry} className="border-error/20 text-error hover:bg-error/10">
            Retry
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
