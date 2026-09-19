import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ElementType
  trend?: "up" | "down" | "neutral"
  status?: "default" | "success" | "warning" | "error"
  className?: string
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  status = "default",
  className,
}: MetricCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <Icon
            className={cn(
              "h-4 w-4",
              status === "success" && "text-success",
              status === "warning" && "text-warning",
              status === "error" && "text-error",
              status === "default" && "text-muted-foreground"
            )}
          />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {description && (
          <p
            className={cn(
              "mt-1 text-xs text-muted-foreground",
              trend === "up" && "text-success",
              trend === "down" && "text-error"
            )}
          >
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
