import { Badge } from "@/components/ui/badge"

export type StatusVariant =
  | "ACTIVE"
  | "DRAFT"
  | "COMPLETED"
  | "SUBMITTED"
  | "EVALUATING"
  | "EVALUATED"
  | "VERIFIED"
  | "UNVERIFIED"
  | "CONTRADICTED"
  | "BLOCKED"
  | "ALLOWED"
  | "FAILED"
  | "PASSED"

interface StatusBadgeProps {
  status: StatusVariant | string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  let variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "ai" = "default"

  const normalizedStatus = status.toUpperCase()

  if (["COMPLETED", "VERIFIED", "ALLOWED", "PASSED"].includes(normalizedStatus)) variant = "success"
  else if (["ACTIVE", "EVALUATING"].includes(normalizedStatus)) variant = "default"
  else if (["FAILED", "BLOCKED", "CONTRADICTED"].includes(normalizedStatus)) variant = "destructive"
  else if (["UNVERIFIED", "DRAFT"].includes(normalizedStatus)) variant = "warning"
  else if (["SUBMITTED", "EVALUATED"].includes(normalizedStatus)) variant = "secondary"

  return (
    <Badge variant={variant} className={className}>
      {status}
    </Badge>
  )
}

export type AIStatusVariant =
  | "ACTIVE"
  | "THINKING"
  | "READING"
  | "TESTING"
  | "VERIFIED"
  | "UNVERIFIED"
  | "CONTRADICTED"

interface AIBadgeProps {
  status: AIStatusVariant | string
  className?: string
}

export function AIBadge({ status, className }: AIBadgeProps) {
  let indicator = "●"
  let colorClass = "text-ai"

  const normalizedStatus = status.toUpperCase()

  if (normalizedStatus === "VERIFIED") {
    indicator = "✓"
    colorClass = "text-success"
  } else if (normalizedStatus === "UNVERIFIED") {
    indicator = "⚠"
    colorClass = "text-warning"
  } else if (normalizedStatus === "CONTRADICTED") {
    indicator = "✕"
    colorClass = "text-destructive"
  } else if (["THINKING", "READING", "TESTING"].includes(normalizedStatus)) {
    // Add subtle animation for active states
    indicator = "●"
    colorClass = "text-ai animate-pulse"
  }

  return (
    <Badge variant="outline" className={`border-border gap-1.5 font-mono text-xs ${className}`}>
      <span className={colorClass}>{indicator}</span>
      <span className="text-foreground tracking-wider">AI {status}</span>
    </Badge>
  )
}
