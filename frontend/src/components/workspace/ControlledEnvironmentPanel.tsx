import { ShieldCheck, ServerOff, Lock, Code, EyeOff, ShieldAlert, Cpu } from 'lucide-react';

export default function ControlledEnvironmentPanel() {
  return (
    <div className="bg-surface-elevated border-b border-border p-3 text-sm flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-xs tracking-wider uppercase text-muted-foreground flex items-center gap-2">
          <ShieldAlert size={14} className="text-ai" />
          Controlled Environment
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-success">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          Active
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center justify-between bg-surface p-2 rounded border border-border">
          <span className="flex items-center gap-1.5 text-muted-foreground"><Code size={12}/> Workspace</span>
          <span className="font-mono text-[10px] text-info">ISOLATED</span>
        </div>
        <div className="flex items-center justify-between bg-surface p-2 rounded border border-border">
          <span className="flex items-center gap-1.5 text-muted-foreground"><ServerOff size={12}/> Network</span>
          <span className="font-mono text-[10px] text-warning">DISABLED</span>
        </div>
        <div className="flex items-center justify-between bg-surface p-2 rounded border border-border">
          <span className="flex items-center gap-1.5 text-muted-foreground"><Lock size={12}/> Secrets</span>
          <span className="font-mono text-[10px] text-success">PROTECTED</span>
        </div>
        <div className="flex items-center justify-between bg-surface p-2 rounded border border-border">
          <span className="flex items-center gap-1.5 text-muted-foreground"><EyeOff size={12}/> Hidden Tests</span>
          <span className="font-mono text-[10px] text-success">PROTECTED</span>
        </div>
        <div className="flex items-center justify-between bg-surface p-2 rounded border border-border col-span-2">
          <span className="flex items-center gap-1.5 text-muted-foreground"><Cpu size={12}/> AI Execution</span>
          <span className="font-mono text-[10px] text-info">SANDBOXED</span>
        </div>
      </div>
    </div>
  );
}
