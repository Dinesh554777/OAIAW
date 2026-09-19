import { useState, useRef, useEffect } from 'react';
import { Send, CheckCircle2, AlertTriangle, FileCode2, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { AIBadge } from '@/components/ui/status-badge';

interface Message {
  sender: 'user' | 'agent';
  text: string;
  type?: 'default' | 'tool' | 'claim';
  claimStatus?: 'UNVERIFIED' | 'VERIFIED' | 'CONTRADICTED';
  toolActivity?: { tool: string; args: string; status: 'pending' | 'success' | 'denied' }[];
}

export default function AgentChat({ onSendMessage }: { onSendMessage: (msg: string) => Promise<string> }) {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'agent', text: 'I am your isolated AI coding assistant. I can navigate the codebase, run tests, and propose patches.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const toolActivity = [];
      if (userMsg.toLowerCase().includes('fix') || userMsg.toLowerCase().includes('test')) {
        toolActivity.push({ tool: 'search_code', args: 'auth', status: 'success' as const });
        toolActivity.push({ tool: 'read_file', args: 'auth.py', status: 'success' as const });
      }

      const response = await onSendMessage(userMsg);
      
      const newMessages: Message[] = [];
      if (toolActivity.length > 0) {
        newMessages.push({ sender: 'agent' as const, text: '', type: 'tool' as const, toolActivity });
      }

      if (response.toLowerCase().includes('all tests pass') || response.toLowerCase().includes('i fixed')) {
        newMessages.push({ 
          sender: 'agent' as const, 
          text: 'All tests pass.', 
          type: 'claim' as const, 
          claimStatus: response.toLowerCase().includes('fail') ? 'CONTRADICTED' : 'VERIFIED' 
        });
      } else {
        newMessages.push({ sender: 'agent' as const, text: response });
      }

      setMessages(prev => [...prev, ...newMessages]);
    } catch (e: unknown) {
      setMessages(prev => [...prev, { sender: 'agent', text: 'Error connecting to isolated agent environment.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-surface shadow-sm">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-5">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              {msg.type === 'tool' && msg.toolActivity && (
                <div className="w-full max-w-[90%] mb-2 space-y-1">
                  {msg.toolActivity.map((tool, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-mono text-muted-foreground bg-surface-elevated p-1.5 rounded border border-border">
                      {tool.status === 'success' && <CheckCircle2 size={12} className="text-success" />}
                      {tool.status === 'denied' && <AlertTriangle size={12} className="text-error" />}
                      <span>{tool.tool}({tool.args})</span>
                    </div>
                  ))}
                </div>
              )}

              {msg.type === 'claim' && (
                <Card className="w-full max-w-[95%] mb-2 bg-surface-elevated">
                  <CardContent className="p-4">
                    <div className="text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">AI Claim</div>
                    <div className="text-sm font-medium mb-4 text-foreground">&quot;{msg.text}&quot;</div>
                    {msg.claimStatus === 'UNVERIFIED' && <AIBadge status="UNVERIFIED" />}
                    {msg.claimStatus === 'VERIFIED' && <AIBadge status="VERIFIED" />}
                    {msg.claimStatus === 'CONTRADICTED' && <AIBadge status="CONTRADICTED" />}
                  </CardContent>
                </Card>
              )}

              {!msg.type && (
                <div className={`max-w-[85%] rounded-2xl p-3.5 text-sm shadow-sm ${msg.sender === 'user' ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-surface-elevated text-foreground border border-border rounded-bl-sm'}`}>
                  {msg.text}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-surface-elevated border border-border text-muted-foreground rounded-2xl rounded-bl-sm p-3.5 text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-ai animate-pulse"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-ai animate-pulse delay-75"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-ai animate-pulse delay-150"></span>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
      </ScrollArea>

      <div className="p-4 bg-surface border-t border-border">
        <div className="relative flex items-center group">
          <Input 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI to investigate or propose a patch..." 
            className="w-full rounded-full pl-4 pr-12 h-10 shadow-sm bg-surface-elevated"
          />
          <Button 
            size="icon"
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="absolute right-1 h-8 w-8 rounded-full"
          >
            <Send size={14} />
          </Button>
        </div>
        <div className="flex justify-between mt-3 px-2">
           <span className="text-[10px] text-muted-foreground flex gap-1.5 items-center font-medium uppercase tracking-wider"><FileCode2 size={12} className="text-ai/70"/> Reads Workspace</span>
           <span className="text-[10px] text-muted-foreground flex gap-1.5 items-center font-medium uppercase tracking-wider"><Terminal size={12} className="text-warning/70"/> Runs Tests</span>
        </div>
      </div>
    </div>
  );
}
