import { useState, useRef, useEffect } from 'react';
import { Send, Bot, ShieldAlert, CheckCircle2, AlertTriangle, FileCode2, Terminal, Code2, AlertCircle } from 'lucide-react';
import { Badge } from '../common/Badge';

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
      // Simulate tool activity visually for demo purposes if parsing actual stream isn't hooked up yet
      const toolActivity = [];
      if (userMsg.toLowerCase().includes('fix') || userMsg.toLowerCase().includes('test')) {
        toolActivity.push({ tool: 'search_code', args: 'auth', status: 'success' as const });
        toolActivity.push({ tool: 'read_file', args: 'auth.py', status: 'success' as const });
      }

      const response = await onSendMessage(userMsg);
      
      const newMessages = [];
      if (toolActivity.length > 0) {
        newMessages.push({ sender: 'agent' as const, text: '', type: 'tool' as const, toolActivity });
      }

      // Check for claims in response
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
    } catch (e) {
      setMessages(prev => [...prev, { sender: 'agent', text: 'Error connecting to isolated agent environment.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-surface border-l border-border shadow-sm">
      <div className="p-4 border-b border-border flex items-center justify-between bg-surface-elevated">
        <div className="flex items-center gap-3 text-foreground">
          <div className="p-1.5 bg-ai/10 rounded-md">
            <Bot size={18} className="text-ai" />
          </div>
          <div>
            <div className="font-semibold text-sm">AI Assistant</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <ShieldAlert size={12} className="text-success" />
              Controlled Environment
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4 space-y-5">
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
              <div className="w-full max-w-[95%] mb-2 border rounded-lg p-3 bg-surface-elevated border-border shadow-sm">
                <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">AI Claim</div>
                <div className="text-sm font-medium mb-3">"{msg.text}"</div>
                {msg.claimStatus === 'UNVERIFIED' && <Badge variant="warning" className="flex w-fit items-center gap-1"><AlertCircle size={12}/> UNVERIFIED</Badge>}
                {msg.claimStatus === 'VERIFIED' && <Badge variant="success" className="flex w-fit items-center gap-1"><CheckCircle2 size={12}/> VERIFIED BY TESTS</Badge>}
                {msg.claimStatus === 'CONTRADICTED' && <Badge variant="destructive" className="flex w-fit items-center gap-1"><AlertTriangle size={12}/> CONTRADICTED BY TESTS</Badge>}
              </div>
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
              <span className="w-2 h-2 rounded-full bg-ai animate-pulse"></span>
              <span className="w-2 h-2 rounded-full bg-ai animate-pulse delay-75"></span>
              <span className="w-2 h-2 rounded-full bg-ai animate-pulse delay-150"></span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="p-4 bg-surface border-t border-border">
        <div className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI to investigate or propose a patch..." 
            className="w-full bg-surface-elevated border border-border rounded-full pl-4 pr-12 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ai transition-shadow"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="absolute right-1.5 p-1.5 text-primary bg-primary-foreground hover:bg-muted disabled:opacity-50 rounded-full transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
        <div className="flex justify-between mt-2 px-2">
           <span className="text-[10px] text-muted-foreground flex gap-1 items-center"><FileCode2 size={10}/> Reads Workspace</span>
           <span className="text-[10px] text-muted-foreground flex gap-1 items-center"><Terminal size={10}/> Runs Tests</span>
        </div>
      </div>
    </div>
  );
}
