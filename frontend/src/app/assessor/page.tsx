import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Users, FileCode2, Activity, ShieldAlert } from 'lucide-react';

export default function AssessorDashboard() {
  return (
    <AppShell userRole="ASSESSOR">
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Assessor Dashboard</h1>
            <p className="text-muted-foreground">Monitor candidate progress, verify AI interactions, and manage assessments.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Assessments</CardTitle>
                <FileCode2 size={16} className="text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">12</div>
                <p className="text-xs text-muted-foreground mt-1">+2 from last week</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Candidates Pending</CardTitle>
                <Users size={16} className="text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">24</div>
                <p className="text-xs text-muted-foreground mt-1">Requires manual review</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">AI Verification Rate</CardTitle>
                <Activity size={16} className="text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">87%</div>
                <p className="text-xs text-muted-foreground mt-1">Of AI claims verified</p>
              </CardContent>
            </Card>

            <Card className="border-error/20 bg-error/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-error">Security Events</CardTitle>
                <ShieldAlert size={16} className="text-error" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-error">3</div>
                <p className="text-xs text-error/80 mt-1">Blocked actions today</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
               <CardHeader>
                  <CardTitle>Recent Candidate Activity</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="space-y-4">
                     {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                           <div>
                              <div className="font-medium text-sm">John Doe</div>
                              <div className="text-xs text-muted-foreground">Backend Engineering Challenge</div>
                           </div>
                           <div className="text-xs font-mono text-muted-foreground">01:42:15 rem</div>
                           <Link href={`/assessor/sessions/${i}`} className="text-xs text-accent hover:underline">View Live</Link>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
               </CardHeader>
               <CardContent className="space-y-3">
                 <Link href="/assessor/assessments" className="flex items-center p-4 border border-border rounded-lg hover:bg-surface-elevated transition-colors group">
                    <div className="flex-1">
                       <h3 className="font-semibold text-sm group-hover:text-accent transition-colors">Manage Assessments</h3>
                       <p className="text-xs text-muted-foreground mt-1">Create and configure new engineering challenges</p>
                    </div>
                 </Link>
                 <Link href="/assessor/reports" className="flex items-center p-4 border border-border rounded-lg hover:bg-surface-elevated transition-colors group">
                    <div className="flex-1">
                       <h3 className="font-semibold text-sm group-hover:text-accent transition-colors">Candidate Reports</h3>
                       <p className="text-xs text-muted-foreground mt-1">Review verified evidence and final submissions</p>
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
