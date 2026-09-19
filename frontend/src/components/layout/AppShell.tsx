import * as React from "react"
import Link from "next/link"

interface AppShellProps {
  children: React.ReactNode
  userRole?: "ADMIN" | "ASSESSOR" | "CANDIDATE" | null
}

export function AppShell({ children, userRole }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-surface px-6">
        <div className="flex items-center space-x-4">
          <Link href="/" className="font-bold text-lg tracking-tight hover:text-accent transition-colors">
            OAIAW
          </Link>
          <span className="text-muted-foreground text-sm font-mono border-l border-border pl-4">
            AI Engineering Assessment
          </span>
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {userRole === "ADMIN" && (
            <>
              <Link href="/admin/users" className="hover:text-accent">Users</Link>
              <Link href="/admin/security" className="hover:text-accent">Security</Link>
            </>
          )}
          {userRole === "ASSESSOR" && (
            <>
              <Link href="/assessor" className="hover:text-accent">Dashboard</Link>
              <Link href="/assessor/reports" className="hover:text-accent">Reports</Link>
            </>
          )}
          {userRole === "CANDIDATE" && (
            <>
              <Link href="/candidate" className="hover:text-accent">My Assessments</Link>
            </>
          )}
          {userRole ? (
            <Link href="/login" className="text-muted-foreground hover:text-foreground">Logout</Link>
          ) : (
            <Link href="/login" className="text-accent hover:text-white">Login</Link>
          )}
        </nav>
      </header>
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {children}
      </main>
    </div>
  )
}
