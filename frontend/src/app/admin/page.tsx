import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCard } from '@/components/dashboard/metric-card';
import { Users, Shield, Server, Activity } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <AppShell userRole="ADMIN">
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Platform Administration</h1>
            <p className="text-muted-foreground">Manage platform security, system health, and user accounts.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Users"
              value={156}
              description="Candidates & Assessors"
              icon={Users}
              trend="up"
            />
            
            <MetricCard
              title="System Health"
              value="100%"
              description="All services operational"
              icon={Server}
              status="success"
            />
            
            <MetricCard
              title="Active Sessions"
              value={42}
              description="Ongoing engineering tasks"
              icon={Activity}
            />

            <MetricCard
              title="Security Alerts"
              value={1}
              description="Requires attention"
              icon={Shield}
              status="warning"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.03)]">
               <CardHeader>
                  <CardTitle>System Activity</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="space-y-4">
                     {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                           <div>
                              <div className="font-medium text-sm">System Update {i}</div>
                              <div className="text-xs text-muted-foreground">Automated platform task</div>
                           </div>
                           <div className="text-xs font-mono text-muted-foreground">Active</div>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>

            <Card className="border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.03)]">
               <CardHeader>
                  <CardTitle>Administration Links</CardTitle>
               </CardHeader>
               <CardContent className="space-y-3">
                 <Link href="/admin/users" className="flex items-center p-4 border border-border rounded-lg hover:bg-surface-elevated transition-colors group hover:border-red-500/50">
                    <div className="flex-1">
                       <h3 className="font-semibold text-sm group-hover:text-red-400 transition-colors">Manage Users</h3>
                       <p className="text-xs text-muted-foreground mt-1">Add, suspend, or modify user roles and permissions.</p>
                    </div>
                 </Link>
                 <Link href="/admin/security" className="flex items-center p-4 border border-border rounded-lg hover:bg-surface-elevated transition-colors group hover:border-red-500/50">
                    <div className="flex-1">
                       <h3 className="font-semibold text-sm group-hover:text-red-400 transition-colors">Security Settings</h3>
                       <p className="text-xs text-muted-foreground mt-1">Review security logs and configure LLM API keys.</p>
                    </div>
                 </Link>
               </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
