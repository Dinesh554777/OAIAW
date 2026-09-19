'use client';
import { AppShell } from '@/components/layout/AppShell';

export default function CandidateHistory() {
  return (
    <AppShell userRole="CANDIDATE">
      <div className="py-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">History</h1>
          <p className="text-muted-foreground">Review your past engineering assessments and AI interactions.</p>
        </div>
        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border rounded-lg bg-surface/30">
          <h2 className="text-xl font-medium mb-2">No history found</h2>
          <p className="text-muted-foreground text-center max-w-sm">
            You haven't completed any assessments yet. Once you finish an assessment, your performance history will appear here.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
