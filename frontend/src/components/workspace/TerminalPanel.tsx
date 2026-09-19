import { Play, Terminal as TermIcon, GitBranch, ShieldCheck } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

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
    <div className="h-full flex flex-col bg-[#0a0a0b] text-foreground font-mono text-sm border-t border-border border-r">
      <div className="h-9 flex items-center justify-between border-b border-border bg-surface-elevated pl-0">
        <div className="flex h-full">
          <button onClick={() => setActiveTab('terminal')} className={`flex items-center gap-2 px-4 text-xs tracking-wide transition-colors font-sans font-medium border-r border-border ${activeTab === 'terminal' ? 'bg-[#0a0a0b] text-foreground border-t-2 border-t-info' : 'text-muted-foreground hover:bg-surface'}`}>
            <TermIcon size={14} className={activeTab === 'terminal' ? 'text-info' : ''} />
            TERMINAL
          </button>
          <button onClick={() => setActiveTab('git')} className={`flex items-center gap-2 px-4 text-xs tracking-wide transition-colors font-sans font-medium border-r border-border ${activeTab === 'git' ? 'bg-[#0a0a0b] text-foreground border-t-2 border-t-warning' : 'text-muted-foreground hover:bg-surface'}`}>
            <GitBranch size={14} className={activeTab === 'git' ? 'text-warning' : ''} />
            GIT
          </button>
          <button onClick={() => setActiveTab('evidence')} className={`flex items-center gap-2 px-4 text-xs tracking-wide transition-colors font-sans font-medium border-r border-border ${activeTab === 'evidence' ? 'bg-[#0a0a0b] text-foreground border-t-2 border-t-success' : 'text-muted-foreground hover:bg-surface'}`}>
            <ShieldCheck size={14} className={activeTab === 'evidence' ? 'text-success' : ''} />
            EVIDENCE
          </button>
        </div>
        <div className="pr-3">
          <button 
            onClick={handleRun}
            disabled={running}
            className="flex items-center gap-1.5 text-xs font-sans font-medium bg-primary/10 hover:bg-primary/20 text-accent px-2 py-1 rounded transition-colors"
          >
            <Play size={12} className={running ? 'animate-pulse text-warning' : 'text-success'} />
            Run Tests
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 whitespace-pre-wrap text-muted-foreground text-[13px] leading-relaxed">
        {activeTab === 'terminal' && (
           <>
             {output}
             <div ref={bottomRef} />
           </>
        )}
        {activeTab === 'git' && (
           <div className="font-sans">
             <div className="mb-4">
                <div className="text-foreground font-semibold text-sm mb-2">Recent Commits</div>
                <div className="border-l-2 border-border pl-4 space-y-4">
                   <div className="relative">
                      <div className="absolute w-2.5 h-2.5 rounded-full bg-border -left-[21px] top-1"></div>
                      <div className="text-xs text-muted-foreground">09:42</div>
                      <div className="text-sm text-foreground">Initial workspace setup</div>
                   </div>
                </div>
             </div>
           </div>
        )}
        {activeTab === 'evidence' && (
           <div className="font-sans">
             <div className="mb-4">
                <div className="text-foreground font-semibold text-sm mb-2">Engineering Activity Timeline</div>
                <div className="border-l-2 border-border pl-4 space-y-4">
                   <div className="relative">
                      <div className="absolute w-2.5 h-2.5 rounded-full bg-success -left-[21px] top-1 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                      <div className="text-xs text-muted-foreground">09:42</div>
                      <div className="text-sm text-foreground">Assessment Started</div>
                   </div>
                </div>
             </div>
           </div>
        )}
      </div>
    </div>
  );
}
