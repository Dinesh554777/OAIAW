import { ShieldCheck, ServerOff, Lock, Code, EyeOff, ShieldAlert, Cpu } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ControlledEnvironmentPanel() {
  return (
    <Card className="rounded-none border-x-0 border-t-0 bg-surface-elevated shadow-sm">
      <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xs tracking-wider uppercase text-muted-foreground flex items-center gap-2">
          <ShieldAlert size={14} className="text-ai" />
          Controlled Environment
        </CardTitle>
        <Badge variant="outline" className="h-5 text-[10px] font-mono text-success gap-1.5 border-success/30 bg-success/10 px-1.5 rounded-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          ACTIVE
        </Badge>
      </CardHeader>
      <CardContent className="p-3 pt-0">
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
      </CardContent>
    </Card>
  );
}
