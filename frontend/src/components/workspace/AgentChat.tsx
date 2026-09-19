import { useState } from 'react';
import { Send, Bot } from 'lucide-react';

export default function AgentChat({ onSendMessage }: { onSendMessage: (msg: string) => Promise<string> }) {
  const [messages, setMessages] = useState<{sender: 'user' | 'agent', text: string}[]>([
    { sender: 'agent', text: 'Hello! I am your AI coding assistant. How can I help you with this task?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const response = await onSendMessage(userMsg);
      setMessages(prev => [...prev, { sender: 'agent', text: response }]);
    } catch (e) {
      setMessages(prev => [...prev, { sender: 'agent', text: 'Error connecting to agent.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 border-l border-gray-800">
      <div className="p-3 border-b border-gray-800 flex items-center gap-2 text-white">
        <Bot size={18} className="text-blue-400" />
        <span className="font-semibold text-sm">AI Agent</span>
      </div>
      
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-lg p-3 text-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-400 rounded-lg rounded-bl-none p-3 text-sm animate-pulse">
              Agent is typing...
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-800">
        <div className="flex bg-gray-800 rounded-md overflow-hidden">
          <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI for help..." 
            className="flex-1 bg-transparent px-3 py-2 text-sm text-white focus:outline-none"
          />
          <button 
            onClick={handleSend}
            className="px-3 text-blue-400 hover:bg-gray-700 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
