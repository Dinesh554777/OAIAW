'use client';
import { AppShell } from '@/components/layout/AppShell';

export default function CandidateAssessments() {
  return (
    <AppShell userRole="CANDIDATE">
      <div className="py-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">My Assessments</h1>
          <p className="text-muted-foreground">View and manage your assigned engineering assessments.</p>
        </div>
        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border rounded-lg bg-surface/30">
          <h2 className="text-xl font-medium mb-2">No active assessments</h2>
          <p className="text-muted-foreground text-center max-w-sm">
            You don't have any assessments assigned yet. When an assessor assigns one to you, it will appear here.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
