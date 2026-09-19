'use client';
import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Shield, FileCode2, History, Settings, LogOut, PanelLeft } from "lucide-react"

interface AppShellProps {
  children: React.ReactNode
  userRole?: "ADMIN" | "ASSESSOR" | "CANDIDATE" | null
}

export function AppShell({ children, userRole }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true)
  const pathname = usePathname()

  const navItems = {
    ADMIN: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Security", href: "/admin/security", icon: Shield },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
    ASSESSOR: [
      { label: "Dashboard", href: "/assessor", icon: LayoutDashboard },
      { label: "Assessments", href: "/assessor/assessments", icon: FileCode2 },
      { label: "Reports", href: "/assessor/reports", icon: History },
      { label: "Security", href: "/assessor/security", icon: Shield },
    ],
    CANDIDATE: [
      { label: "Dashboard", href: "/candidate", icon: LayoutDashboard },
      { label: "My Assessments", href: "/candidate/assessments", icon: FileCode2 },
      { label: "History", href: "/candidate/history", icon: History },
    ]
  }

  const currentNav = userRole ? navItems[userRole] : []

  // If we are in the workspace, we might want a different shell, but let's keep it adaptable.
  const isWorkspace = pathname?.includes('/workspace/')

  if (isWorkspace) {
    return (
      <div className="flex h-screen flex-col bg-background text-foreground overflow-hidden">
        {children}
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className={`border-r border-border bg-surface transition-all duration-300 flex flex-col ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        <div className="h-14 flex items-center justify-between px-4 border-b border-border">
          {sidebarOpen && (
            <Link href="/" className="font-bold text-lg tracking-tight hover:text-accent transition-colors truncate">
              OAIAW
            </Link>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-md hover:bg-surface-elevated text-muted-foreground transition-colors"
          >
            <PanelLeft size={20} />
          </button>
        </div>
        
        <nav className="flex-1 py-4 flex flex-col gap-1 px-2 overflow-y-auto">
          {currentNav.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-surface-elevated hover:text-foreground'}`}
              >
                <item.icon size={18} className={isActive ? 'text-primary' : ''} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>
        
        {userRole && (
          <div className="p-4 border-t border-border">
             <Link 
                href="/login"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-muted-foreground hover:bg-surface-elevated hover:text-foreground ${sidebarOpen ? '' : 'justify-center'}`}
              >
                <LogOut size={18} />
                {sidebarOpen && <span>Logout</span>}
              </Link>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative min-w-0">
        <header className="h-14 flex items-center justify-between border-b border-border bg-surface/50 px-6 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-2">
            {!sidebarOpen && (
              <span className="font-bold text-lg tracking-tight mr-4">OAIAW</span>
            )}
            <span className="text-sm font-medium capitalize text-muted-foreground">
              {userRole?.toLowerCase()} Portal
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-surface-elevated border border-border flex items-center justify-center text-xs font-medium">
              {userRole ? userRole.charAt(0) : 'G'}
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto w-full animate-enter">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
