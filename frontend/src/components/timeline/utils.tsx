import React from 'react';
import { 
  FileCode2, Bot, Beaker, Bug, GitCommit, CheckCircle2, 
  TerminalSquare, Clock, FolderTree, FileEdit, AlertTriangle, Play
} from 'lucide-react';

export function getEventIcon(eventType: string) {
  if (eventType.startsWith('FILE_') || eventType === 'CODE_CHANGE' || eventType === 'PATCH_APPLIED') return <FileCode2 className="text-blue-400" size={16} />;
  if (eventType.startsWith('AI_')) return <Bot className="text-purple-400" size={16} />;
  if (eventType.startsWith('TEST_')) return <Beaker className="text-emerald-400" size={16} />;
  if (eventType.includes('DEBUG') || eventType.includes('ERROR')) return <Bug className="text-red-400" size={16} />;
  if (eventType.startsWith('GIT_')) return <GitCommit className="text-orange-400" size={16} />;
  if (eventType.startsWith('SESSION_') || eventType.startsWith('TASK_') || eventType.startsWith('SUBMISSION_')) return <CheckCircle2 className="text-gray-400" size={16} />;
  return <Clock className="text-gray-400" size={16} />;
}

export function formatTimestamp(timestamp: string) {
  const d = new Date(timestamp);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
