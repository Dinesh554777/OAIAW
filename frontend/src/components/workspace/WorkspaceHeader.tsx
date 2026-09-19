import { Play, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function WorkspaceHeader({ taskTitle, timeLeft, onSubmit }: { taskTitle: string, timeLeft: string, onSubmit: () => void }) {
  const steps = ['UNDERSTAND', 'PLAN', 'BUILD', 'AI ASSIST', 'VERIFY', 'TEST', 'REFINE'];
  const currentStep = 3;

  return (
    <div className="h-14 bg-surface text-foreground flex items-center justify-between px-6 border-b border-border shadow-sm z-10 relative">
      <div className="flex items-center gap-6">
        <Link href="/" className="font-bold tracking-tight hover:text-accent transition-colors">
          OAIAW
        </Link>
        <div className="w-px h-6 bg-border"></div>
        <span className="font-semibold text-sm tracking-wide text-foreground">{taskTitle}</span>
      </div>
      
      <div className="hidden lg:flex flex-1 justify-center">
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-wider font-semibold">
          {steps.map((step, idx) => (
             <div key={step} className="flex items-center gap-2">
                <span className={idx === currentStep ? 'text-accent' : idx < currentStep ? 'text-muted-foreground' : 'text-muted-foreground/50'}>
                   {step}
                </span>
                {idx < steps.length - 1 && <span className="text-border">─</span>}
             </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-sm font-mono text-muted-foreground">
          <Clock size={14} />
          {timeLeft}
        </div>
        <Button onClick={onSubmit} size="sm" variant="default" className="gap-2 shadow-sm shadow-primary/20">
          <CheckCircle size={14} />
          Submit
        </Button>
      </div>
    </div>
  );
}
