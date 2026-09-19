import { Play, Terminal as TermIcon, GitBranch, ShieldCheck } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import EvidenceGraph from '../evidence/EvidenceGraph';

export default function TerminalPanel({ onRunTests }: { onRunTests: () => Promise<string> }) {
  const [output, setOutput] = useState<string>('OAIAW Controlled Sandbox ready.\nType commands or use shortcuts to interact.\n\n$ ');
  const [running, setRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'terminal' | 'tests' | 'git' | 'evidence'>('terminal');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  const handleRun = async () => {
    if (running) return;
    setRunning(true);
    setActiveTab('terminal');
    setOutput(prev => prev + 'npm run test\nRunning tests in isolated environment...\n');
    try {
      const result = await onRunTests();
      setOutput(prev => prev + result + '\n\n$ ');
    } catch (e) {
      setOutput(prev => prev + '\n[ERROR] Test execution failed.\n\n$ ');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background text-foreground font-mono text-sm border-t border-border">
      <div className="h-10 flex items-center justify-between border-b border-border bg-surface pl-0">
        <div className="flex h-full">
          <button onClick={() => setActiveTab('terminal')} className={`flex items-center gap-2 px-5 text-xs tracking-wide transition-colors font-sans font-medium border-r border-border ${activeTab === 'terminal' ? 'bg-background text-foreground border-t-2 border-t-info' : 'text-muted-foreground hover:bg-surface-elevated hover:text-foreground'}`}>
            <TermIcon size={14} className={activeTab === 'terminal' ? 'text-info' : ''} />
            TERMINAL
          </button>
          <button onClick={() => setActiveTab('git')} className={`flex items-center gap-2 px-5 text-xs tracking-wide transition-colors font-sans font-medium border-r border-border ${activeTab === 'git' ? 'bg-background text-foreground border-t-2 border-t-warning' : 'text-muted-foreground hover:bg-surface-elevated hover:text-foreground'}`}>
            <GitBranch size={14} className={activeTab === 'git' ? 'text-warning' : ''} />
            GIT
          </button>
          <button onClick={() => setActiveTab('evidence')} className={`flex items-center gap-2 px-5 text-xs tracking-wide transition-colors font-sans font-medium border-r border-border ${activeTab === 'evidence' ? 'bg-background text-foreground border-t-2 border-t-success' : 'text-muted-foreground hover:bg-surface-elevated hover:text-foreground'}`}>
            <ShieldCheck size={14} className={activeTab === 'evidence' ? 'text-success' : ''} />
            EVIDENCE
          </button>
        </div>
        <div className="pr-4">
          <button 
            onClick={handleRun}
            disabled={running}
            className="flex items-center gap-2 text-xs font-sans font-medium bg-primary/10 hover:bg-primary/20 text-foreground px-3 py-1.5 rounded-md transition-all active:scale-95 border border-primary/10"
          >
            <Play size={12} className={running ? 'animate-pulse text-warning' : 'text-success'} />
            Run Tests
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 whitespace-pre-wrap text-muted-foreground text-[13px] leading-relaxed custom-scrollbar">
        {activeTab === 'terminal' && (
           <>
             {output}
             <div ref={bottomRef} />
           </>
        )}
        {activeTab === 'git' && (
           <div className="font-sans max-w-2xl">
             <div className="mb-4">
                <div className="text-foreground font-semibold text-sm mb-4">Recent Commits</div>
                <div className="border-l-2 border-border pl-4 space-y-6">
                   <div className="relative">
                      <div className="absolute w-2.5 h-2.5 rounded-full bg-border -left-[21px] top-1.5"></div>
                      <div className="text-xs text-muted-foreground font-mono mb-1">09:42</div>
                      <div className="text-sm text-foreground bg-surface-elevated p-3 rounded-lg border border-border shadow-sm">
                        <div className="font-medium mb-1">Initial workspace setup</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <span className="font-mono">a82f91c</span>
                          <span>•</span>
                          <span>system</span>
                        </div>
                      </div>
                   </div>
                </div>
             </div>
           </div>
        )}
        {activeTab === 'evidence' && (
           <div className="font-sans">
             <EvidenceGraph />
           </div>
        )}
      </div>
    </div>
  );
}
