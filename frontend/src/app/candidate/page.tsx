'use client';
import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AppShell } from '@/components/layout/AppShell';
import { Clock, Code2, ArrowRight, Play, Activity } from 'lucide-react';

export default function CandidateDashboard() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/assessments')
      .then(res => {
        setAssessments(res);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  return (
    <AppShell userRole="CANDIDATE">
      <div className="py-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
            Good afternoon
          </h1>
          <p className="text-muted-foreground">Here are your engineering assessments.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <Card className="bg-surface/50 border-primary/20 shadow-[0_0_15px_rgba(255,255,255,0.03)]">
              <CardHeader className="pb-2">
                 <div className="text-sm font-medium text-muted-foreground mb-1">Status</div>
                 <CardTitle className="text-2xl text-foreground">Active Candidate</CardTitle>
              </CardHeader>
           </Card>
           <Card className="bg-surface/50">
              <CardHeader className="pb-2">
                 <div className="text-sm font-medium text-muted-foreground mb-1">Completed</div>
                 <CardTitle className="text-2xl text-foreground">0</CardTitle>
              </CardHeader>
           </Card>
           <Card className="bg-surface/50">
              <CardHeader className="pb-2">
                 <div className="text-sm font-medium text-muted-foreground mb-1">AI Interactions</div>
                 <CardTitle className="text-2xl text-foreground">0</CardTitle>
              </CardHeader>
           </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Your Assessments</h2>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="h-48 animate-pulse bg-surface/50"></Card>
              <Card className="h-48 animate-pulse bg-surface/50"></Card>
            </div>
          ) : assessments.length === 0 ? (
            <Card className="bg-surface-elevated border-dashed border-border p-12 flex flex-col items-center justify-center text-center">
              <Code2 size={32} className="text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-foreground mb-2">No assessments assigned</h3>
              <p className="text-sm text-muted-foreground">You currently have no pending engineering tasks.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assessments.map((a: any) => (
                <Card key={a.id} className="group relative overflow-hidden border-border hover:border-primary/50 transition-all flex flex-col">
                  {/* Subtle gradient effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant={a.difficulty === 'HARD' ? 'destructive' : a.difficulty === 'MEDIUM' ? 'warning' : 'success'}>
                        {a.difficulty}
                      </Badge>
                      <Badge variant="outline" className="font-mono gap-1">
                        <Clock size={12} />
                        {a.duration_minutes}m
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-foreground mb-2">{a.title}</CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2">{a.description}</p>
                  </CardHeader>
                  
                  <CardContent className="mt-auto pt-4 flex items-center justify-between border-t border-border/50">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                       <Activity size={14} className="text-ai" />
                       <span>AI Assistant Enabled</span>
                    </div>
                    <Button variant="default" className="gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      Start Environment
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
