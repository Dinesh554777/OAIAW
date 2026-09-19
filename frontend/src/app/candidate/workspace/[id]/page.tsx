"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';
import { Editor } from '@monaco-editor/react';
import { 
  Play, 
  TerminalSquare, 
  FolderTree, 
  Bot,
  FileCode2,
  Save,
  Send,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';

type Message = {
  id: string;
  role: 'USER' | 'AGENT';
  content: string;
};

export default function CandidateWorkspace() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;
  
  const [files, setFiles] = useState<any>({});
  const [activeFile, setActiveFile] = useState<string>('');
  const [fileContents, setFileContents] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  
  const [chatHistory, setChatHistory] = useState<Message[]>([
    { id: '1', role: 'AGENT', content: 'Hello! I am your AI Engineer. How can I assist you with this task?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [terminalOutput, setTerminalOutput] = useState<string>('Ready. Click "Run Tests" to execute the test suite.\n');
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 mins mock

  // Fetch initial files
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/workspace/${taskId}/files`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setFiles(data);
          
          // Flatten mock files for the editor
          const flattened: Record<string, string> = {};
          Object.keys(data).forEach(dirOrFile => {
            if (typeof data[dirOrFile] === 'string') {
              flattened[dirOrFile] = data[dirOrFile];
            } else {
              Object.keys(data[dirOrFile]).forEach(file => {
                flattened[`${dirOrFile}/${file}`] = data[dirOrFile][file];
              });
            }
          });
          setFileContents(flattened);
          if (Object.keys(flattened).length > 0) {
            setActiveFile(Object.keys(flattened)[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch files", err);
      }
    };
    fetchFiles();
    
    const initSession = async () => {
        const token = localStorage.getItem('token');
        await fetch(`${API_BASE_URL}/agent/session`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task_id: parseInt(taskId) })
        });
    };
    initSession();

  }, [taskId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isAiTyping]);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(prev => prev > 0 ? prev - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setFileContents(prev => ({ ...prev, [activeFile]: value }));
    }
  };

  const saveFile = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE_URL}/workspace/${taskId}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          path: activeFile,
          content: fileContents[activeFile]
        })
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const runTests = async () => {
    setIsRunningTests(true);
    setTerminalOutput(prev => prev + '\n> npm run test\nRunning tests...\n');
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE_URL}/workspace/${taskId}/run-tests`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      // Mock test output
      setTimeout(() => {
        setTerminalOutput(prev => prev + '\n✓ src/utils.js: add() works perfectly.\n\nTest Suites: 1 passed, 1 total\nTests:       1 passed, 1 total\nTime:        1.2s\n');
        setIsRunningTests(false);
      }, 1500);
    } catch (err) {
      setTerminalOutput(prev => prev + '\nError running tests.\n');
      setIsRunningTests(false);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const msg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'USER', content: msg }]);
    setIsAiTyping(true);

    try {
      const token = localStorage.getItem('token');
      // Fetch the actual session id, for prototype we can fetch it again or store it
      // Let's assume we can get it from /agent/session
      const sessionRes = await fetch(`${API_BASE_URL}/agent/session`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: parseInt(taskId) })
      });
      const sessionData = await sessionRes.json();

      const res = await fetch(`${API_BASE_URL}/agent/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          session_id: sessionData.id,
          message: msg
        })
      });
      const data = await res.json();
      setChatHistory(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'AGENT', 
        content: data.response 
      }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { id: Date.now().toString(), role: 'AGENT', content: 'Sorry, I encountered an error.' }]);
    } finally {
      setIsAiTyping(false);
    }
  };
  
  const submitAssessment = async () => {
      // For prototype, we redirect to dashboard
      router.push('/');
  }

  return (
    <div className="flex flex-col h-screen bg-[#1e1e1e] text-gray-300 font-sans overflow-hidden">
      {/* TOP NAVIGATION BAR */}
      <div className="flex items-center justify-between px-6 py-2 bg-[#252526] border-b border-[#333]">
        <div className="flex items-center space-x-4">
          <span className="text-xl font-bold text-white tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            OAIAW
          </span>
          <div className="h-4 w-px bg-gray-600"></div>
          <span className="text-sm font-medium text-gray-300">Task {taskId} - Backend Debugging</span>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center text-emerald-400 space-x-2 bg-emerald-400/10 px-3 py-1 rounded-full">
            <Clock size={16} />
            <span className="font-mono text-sm">{formatTime(timeLeft)}</span>
          </div>
          <button onClick={submitAssessment} className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-1.5 rounded shadow-[0_0_10px_rgba(37,99,235,0.4)] transition-all">
            Submit Assessment
          </button>
        </div>
      </div>

      {/* MAIN 3-COLUMN GRID */}
      <div className="flex flex-1 min-h-0">
        
        {/* LEFT: FILE EXPLORER */}
        <div className="w-64 bg-[#181818] border-r border-[#333] flex flex-col min-h-0">
          <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center space-x-2 border-b border-[#333]">
            <FolderTree size={14} />
            <span>Files</span>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {Object.keys(fileContents).map((path) => (
              <div 
                key={path}
                onClick={() => setActiveFile(path)}
                className={`flex items-center space-x-2 px-2 py-1.5 cursor-pointer text-sm rounded ${
                  activeFile === path ? 'bg-[#37373d] text-white' : 'text-gray-400 hover:bg-[#2a2d2e] hover:text-gray-300'
                }`}
              >
                <FileCode2 size={14} className={activeFile === path ? 'text-blue-400' : 'text-gray-500'} />
                <span className="truncate">{path}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER: EDITOR + TERMINAL */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-[#333]">
          
          {/* EDITOR TAB */}
          <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e] border-b border-[#333]">
             <div className="flex items-center space-x-2 text-sm text-gray-300">
               <span className="italic">{activeFile || 'No file selected'}</span>
             </div>
             <button 
               onClick={saveFile}
               className="flex items-center space-x-1 text-xs text-gray-400 hover:text-white bg-[#2d2d2d] hover:bg-[#3d3d3d] px-2 py-1 rounded transition-colors"
             >
               <Save size={14} />
               <span>{isSaving ? 'Saving...' : 'Save'}</span>
             </button>
          </div>

          {/* MONACO EDITOR */}
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              theme="vs-dark"
              language={activeFile.endsWith('.js') ? 'javascript' : activeFile.endsWith('.py') ? 'python' : 'json'}
              value={fileContents[activeFile] || ''}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                lineHeight: 24,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
              }}
            />
          </div>

          {/* BOTTOM TERMINAL PANE */}
          <div className="h-64 bg-[#181818] border-t border-[#333] flex flex-col min-h-0">
             <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-[#333]">
                <div className="flex items-center space-x-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <TerminalSquare size={14} />
                  <span>Terminal / Test Output</span>
                </div>
                <button 
                  onClick={runTests}
                  disabled={isRunningTests}
                  className="flex items-center space-x-1 text-xs text-emerald-400 hover:text-white bg-emerald-400/10 hover:bg-emerald-500/30 px-3 py-1 rounded transition-colors border border-emerald-400/20"
                >
                  <Play size={12} fill="currentColor" />
                  <span>{isRunningTests ? 'Running...' : 'Run Tests'}</span>
                </button>
             </div>
             <div className="flex-1 p-4 font-mono text-sm text-gray-300 overflow-y-auto whitespace-pre-wrap">
                {terminalOutput}
             </div>
          </div>

        </div>

        {/* RIGHT: AI ENGINEER CHAT */}
        <div className="w-96 bg-[#252526] flex flex-col min-w-0">
           <div className="px-4 py-3 text-sm font-semibold text-white uppercase tracking-wider flex items-center space-x-2 border-b border-[#333] shadow-sm">
              <Bot size={18} className="text-blue-400" />
              <span>AI Engineer</span>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {chatHistory.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.role === 'USER' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] uppercase text-gray-500 mb-1 ml-1 font-semibold tracking-wider">
                    {msg.role === 'USER' ? 'You' : 'Agent'}
                  </span>
                  <div className={`p-3 rounded-lg text-sm max-w-[90%] shadow-md leading-relaxed ${
                    msg.role === 'USER' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-[#37373d] text-gray-200 rounded-tl-none border border-[#444]'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isAiTyping && (
                <div className="flex flex-col items-start">
                  <span className="text-[10px] uppercase text-gray-500 mb-1 ml-1 font-semibold tracking-wider">Agent</span>
                  <div className="p-3 rounded-lg text-sm bg-[#37373d] text-gray-400 rounded-tl-none border border-[#444] flex items-center space-x-2 shadow-md">
                    <Bot size={14} className="animate-pulse" />
                    <span>Inspecting code...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
           </div>

           <div className="p-4 border-t border-[#333] bg-[#1e1e1e]">
              <div className="relative">
                <textarea
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendChatMessage();
                    }
                  }}
                  placeholder="Ask for help or request a code change..."
                  className="w-full bg-[#2d2d2d] text-white text-sm rounded-lg pl-3 pr-10 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none border border-[#444] shadow-inner"
                  rows={2}
                />
                <button 
                  onClick={sendChatMessage}
                  disabled={!chatInput.trim() || isAiTyping}
                  className="absolute right-2 bottom-2 p-1.5 text-blue-400 hover:text-white bg-blue-500/10 hover:bg-blue-500/40 rounded transition-colors disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
