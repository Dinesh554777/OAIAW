import { Play, Terminal as TermIcon, GitBranch, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import EvidenceGraph from '../evidence/EvidenceGraph';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function TerminalPanel({ onRunTests }: { onRunTests: () => Promise<string> }) {
  const [output, setOutput] = useState<string>('OAIAW Controlled Sandbox ready.\nType commands or use shortcuts to interact.\n\n$ ');
  const [running, setRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('terminal');
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
    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col bg-background border-t border-border">
      <div className="h-10 flex items-center justify-between border-b border-border bg-surface px-2">
        <TabsList className="bg-transparent h-9 p-0 border-b-0 space-x-1">
          <TabsTrigger value="terminal" className="data-[state=active]:bg-surface-elevated data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-info rounded-none h-full px-4 gap-2">
            <TermIcon size={14} className="text-info" />
            <span className="text-xs uppercase tracking-wider">Terminal</span>
          </TabsTrigger>
          <TabsTrigger value="tests" className="data-[state=active]:bg-surface-elevated data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-success rounded-none h-full px-4 gap-2">
            <CheckCircle2 size={14} className="text-success" />
            <span className="text-xs uppercase tracking-wider">Tests</span>
          </TabsTrigger>
          <TabsTrigger value="git" className="data-[state=active]:bg-surface-elevated data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-warning rounded-none h-full px-4 gap-2">
            <GitBranch size={14} className="text-warning" />
            <span className="text-xs uppercase tracking-wider">Git</span>
          </TabsTrigger>
          <TabsTrigger value="evidence" className="data-[state=active]:bg-surface-elevated data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-4 gap-2">
            <ShieldCheck size={14} className="text-primary" />
            <span className="text-xs uppercase tracking-wider">Evidence</span>
          </TabsTrigger>
        </TabsList>
        <div className="pr-2">
          <Button 
            onClick={handleRun}
            disabled={running}
            variant="outline"
            size="sm"
            className="h-7 text-xs font-medium"
          >
            <Play size={12} className={running ? 'animate-pulse text-warning mr-1' : 'text-success mr-1'} />
            Run Tests
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <TabsContent value="terminal" className="p-4 m-0 h-full font-mono text-[13px] leading-relaxed text-muted-foreground whitespace-pre-wrap outline-none">
          {output}
          <div ref={bottomRef} />
        </TabsContent>
        
        <TabsContent value="tests" className="p-4 m-0 h-full outline-none">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Test Results</h3>
              <div className="flex gap-2">
                <Badge variant="success">3 passed</Badge>
                <Badge variant="destructive">1 failed</Badge>
              </div>
            </div>
            <Card className="border-border shadow-sm">
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  <div className="p-3 flex items-center justify-between text-sm hover:bg-surface-elevated transition-colors">
                    <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-success" /> <span>test_login_success</span></div>
                    <span className="text-xs text-muted-foreground">12ms</span>
                  </div>
                  <div className="p-3 flex items-center justify-between text-sm hover:bg-surface-elevated transition-colors">
                    <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-success" /> <span>test_invalid_password</span></div>
                    <span className="text-xs text-muted-foreground">8ms</span>
                  </div>
                  <div className="p-3 flex flex-col justify-center text-sm hover:bg-surface-elevated transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2"><XCircle size={16} className="text-error" /> <span className="font-semibold text-error">test_expired_token</span></div>
                      <span className="text-xs text-muted-foreground">15ms</span>
                    </div>
                    <div className="mt-2 bg-background p-3 rounded border border-error/20 font-mono text-xs text-muted-foreground">
                      AssertionError: Expected 401 Unauthorized, got 200 OK.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="git" className="p-4 m-0 h-full outline-none">
           <div className="max-w-2xl">
             <div className="text-foreground font-semibold text-sm mb-4">Git Activity</div>
             <div className="border-l-2 border-border pl-4 space-y-6">
                <div className="relative">
                   <div className="absolute w-2.5 h-2.5 rounded-full bg-border -left-[21px] top-1.5 ring-4 ring-background"></div>
                   <div className="text-xs text-muted-foreground font-mono mb-1">09:42</div>
                   <Card>
                     <CardContent className="p-3">
                       <div className="font-medium text-sm mb-1">Initial workspace setup</div>
                       <div className="text-xs text-muted-foreground flex items-center gap-2">
                         <Badge variant="secondary" className="font-mono px-1.5 h-5 rounded-md">a82f91c</Badge>
                         <span>•</span>
                         <span>system</span>
                       </div>
                     </CardContent>
                   </Card>
                </div>
             </div>
           </div>
        </TabsContent>

        <TabsContent value="evidence" className="p-4 m-0 h-full outline-none">
           <EvidenceGraph />
        </TabsContent>
      </ScrollArea>
    </Tabs>
  );
}
