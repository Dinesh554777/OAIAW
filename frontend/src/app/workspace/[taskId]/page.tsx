'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { fetchApi } from '@/lib/api';

import WorkspaceHeader from '@/components/workspace/WorkspaceHeader';
import FileExplorer from '@/components/workspace/FileExplorer';
import CodeEditor from '@/components/workspace/CodeEditor';
import AgentChat from '@/components/workspace/AgentChat';
import TerminalPanel from '@/components/workspace/TerminalPanel';
import ControlledEnvironmentPanel from '@/components/workspace/ControlledEnvironmentPanel';

export default function Workspace() {
  const params = useParams();
  const taskId = params.taskId as string;
  
  const [files, setFiles] = useState<Record<string, any> | null>(null);
  const [activeFile, setActiveFile] = useState<string>('');
  const [fileContents, setFileContents] = useState<Record<string, string>>({});
  const [agentSessionId, setAgentSessionId] = useState<number | null>(null);

  useEffect(() => {
    // Init Agent Session
    fetchApi('/agent/session', { method: 'POST', body: JSON.stringify({ task_id: parseInt(taskId) }) })
      .then(res => setAgentSessionId(res.id))
      .catch(console.error);

    // Fetch mock file system
    fetchApi(`/workspace/${taskId}/files`)
      .then(res => {
        setFiles(res);
        const flatten = (node: Record<string, any>, path = '') => {
          const result: Record<string, string> = {};
          for (const key in node) {
            const curPath = path ? `${path}/${key}` : key;
            if (typeof node[key] === 'object' && node[key] !== null) {
              Object.assign(result, flatten(node[key], curPath));
            } else {
              result[curPath] = String(node[key]);
            }
          }
          return result;
        };
        const flat = flatten(res);
        setFileContents(flat);
        if (Object.keys(flat).length > 0) setActiveFile(Object.keys(flat)[0]);
      })
      .catch(console.error);
  }, [taskId]);

  const handleSave = async (path: string, content: string) => {
    setFileContents(prev => ({ ...prev, [path]: content }));
    try {
      await fetchApi(`/workspace/${taskId}/save`, {
        method: 'POST',
        body: JSON.stringify({ path, content })
      });
    } catch (e) { console.error('Save failed', e); }
  };

  const handleRunTests = async () => {
    try {
      const res = await fetchApi(`/workspace/${taskId}/run-tests`, { method: 'POST' });
      return JSON.parse(res.payload).output || 'Tests finished.';
    } catch (e: unknown) {
      return 'Test execution failed.';
    }
  };

  const handleAgentChat = async (msg: string) => {
    if (!agentSessionId) return 'Agent is offline.';
    try {
      const res = await fetchApi(`/agent/chat`, {
        method: 'POST',
        body: JSON.stringify({ session_id: agentSessionId, message: msg })
      });
      return res.response;
    } catch (e: unknown) {
      return 'Agent encountered an error.';
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background text-foreground font-sans">
      <WorkspaceHeader 
        taskTitle="Implement Authentication Logic" 
        timeLeft="01:42:15" 
        onSubmit={() => alert('Task submitted!')} 
      />

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Panel: File Explorer */}
        <div className="w-64 flex-shrink-0 border-r border-border bg-surface flex flex-col">
          <div className="flex-1 overflow-hidden">
            <FileExplorer 
              files={files} 
              activeFile={activeFile} 
              onFileSelect={setActiveFile} 
            />
          </div>
        </div>

        {/* Center Panel: Editor + Terminal */}
        <div className="flex-1 flex flex-col min-w-0 bg-background">
          <div className="flex-1 relative border-b border-border shadow-sm">
            {activeFile ? (
              <CodeEditor 
                activeFile={activeFile}
                content={fileContents[activeFile] || ''}
                language={activeFile.endsWith('.json') ? 'json' : activeFile.endsWith('.py') ? 'python' : 'javascript'}
                onSave={handleSave}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground bg-[#1e1e1e]">
                Select a file to edit
              </div>
            )}
          </div>
          <div className="h-72 flex-shrink-0 relative bg-surface-elevated">
            <TerminalPanel onRunTests={handleRunTests} />
          </div>
        </div>

        {/* Right Panel: AI Agent & Env Info */}
        <div className="w-96 flex-shrink-0 flex flex-col border-l border-border bg-surface shadow-[-4px_0_15px_rgba(0,0,0,0.1)]">
          <ControlledEnvironmentPanel />
          <div className="flex-1 overflow-hidden">
             <AgentChat onSendMessage={handleAgentChat} />
          </div>
        </div>

      </div>
    </div>
  );
}

