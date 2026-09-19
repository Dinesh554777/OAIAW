import { CheckCircle2, ShieldAlert, Bot, Code, Terminal, GitCommit } from 'lucide-react';

export default function EvidenceGraph() {
  return (
    <div className="flex flex-col items-center justify-start p-4">
      <div className="w-full max-w-2xl bg-surface-elevated rounded-xl border border-border p-6 shadow-sm relative overflow-hidden">
        {/* Background visual element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-ai/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        
        <h3 className="text-foreground font-semibold text-sm mb-6 flex items-center gap-2 uppercase tracking-wide">
          <ShieldAlert size={16} className="text-ai" />
          Evidence Chain
        </h3>
        
        <div className="space-y-0 relative">
          {/* Vertical connecting line */}
          <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-border z-0"></div>

          {/* Node 1 */}
          <div className="relative z-10 flex gap-4 pb-8 group cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-surface border-2 border-ai flex items-center justify-center flex-shrink-0 shadow-[0_0_10px_rgba(139,92,246,0.3)] group-hover:scale-110 transition-transform">
              <Bot size={18} className="text-ai" />
            </div>
            <div className="flex-1 bg-surface border border-border rounded-lg p-3 group-hover:border-ai/50 transition-colors">
              <div className="text-xs text-muted-foreground mb-1">AI Interaction</div>
              <div className="text-sm font-medium text-foreground">Candidate asked AI for authentication fix</div>
            </div>
          </div>

          {/* Node 2 */}
          <div className="relative z-10 flex gap-4 pb-8 group cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-surface border-2 border-border flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform group-hover:border-accent">
              <Code size={18} className="text-accent" />
            </div>
            <div className="flex-1 bg-surface border border-border rounded-lg p-3 group-hover:border-accent/50 transition-colors">
              <div className="text-xs text-muted-foreground mb-1">Code Change</div>
              <div className="text-sm font-medium text-foreground">AI proposed patch to auth.py</div>
            </div>
          </div>

          {/* Node 3 */}
          <div className="relative z-10 flex gap-4 pb-8 group cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-surface border-2 border-border flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform group-hover:border-warning">
              <Terminal size={18} className="text-warning" />
            </div>
            <div className="flex-1 bg-surface border border-border rounded-lg p-3 group-hover:border-warning/50 transition-colors">
              <div className="text-xs text-muted-foreground mb-1">Test Execution</div>
              <div className="text-sm font-medium text-foreground">Candidate ran tests against patch</div>
            </div>
          </div>

          {/* Node 4 (Final) */}
          <div className="relative z-10 flex gap-4 group cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-surface border-2 border-success flex items-center justify-center flex-shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-transform">
              <CheckCircle2 size={18} className="text-success" />
            </div>
            <div className="flex-1 bg-surface border border-success/30 rounded-lg p-3 bg-success/5 group-hover:bg-success/10 transition-colors">
              <div className="text-xs text-success font-semibold mb-1 uppercase tracking-wider">Verification Complete</div>
              <div className="text-sm font-medium text-foreground">AI Claim "Tests Pass" VERIFIED (4/4 passed)</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
