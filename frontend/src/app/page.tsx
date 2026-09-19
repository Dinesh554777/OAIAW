import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code2, Bot, ShieldCheck } from 'lucide-react';

export default function Home() {
  const workflowSteps = ['Understand', 'Plan', 'Build', 'AI Assist', 'Verify', 'Test', 'Refine'];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground relative overflow-hidden">
      {/* Background visual effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ai/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="z-10 text-center max-w-4xl px-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-elevated border border-border text-xs font-medium text-muted-foreground mb-8">
          <span className="w-2 h-2 rounded-full bg-ai animate-pulse"></span>
          Next-Generation Evaluation
        </div>
        
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-4 text-primary bg-clip-text text-transparent bg-gradient-to-b from-primary to-primary/60">
          OAIAW
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6 text-muted-foreground uppercase">
          Online Assessment in the AI World
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-light leading-relaxed">
          Evaluate how engineers work when AI is part of the workflow. Move beyond algorithms and assess real-world software engineering with integrated AI assistants.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link href="/login">
            <Button size="lg" className="w-full sm:w-auto gap-2 text-base px-8 h-12">
              Sign In <ArrowRight size={18} />
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 text-base px-8 h-12">
              Create Account
            </Button>
          </Link>
        </div>

        {/* Workflow Visualization */}
        <div className="hidden md:flex flex-wrap items-center justify-center gap-2 font-mono text-sm">
          {workflowSteps.map((step, idx) => (
             <div key={step} className="flex items-center gap-2">
                <span className={`px-3 py-1.5 rounded bg-surface border border-border ${step === 'AI Assist' ? 'text-ai border-ai/30 shadow-[0_0_10px_rgba(139,92,246,0.15)]' : step === 'Verify' ? 'text-success border-success/30' : 'text-muted-foreground'}`}>
                   {step}
                </span>
                {idx < workflowSteps.length - 1 && <span className="text-border">→</span>}
             </div>
          ))}
        </div>
      </div>
    </main>
  );
}
