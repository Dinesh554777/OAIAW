import { Play, Terminal as TermIcon } from 'lucide-react';
import { useState } from 'react';

export default function TerminalPanel({ onRunTests }: { onRunTests: () => Promise<string> }) {
  const [output, setOutput] = useState<string>('OAIAW Workspace Terminal ready.\n');
  const [running, setRunning] = useState(false);

  const handleRun = async () => {
    if (running) return;
    setRunning(true);
    setOutput(prev => prev + '\n> npm run test\nRunning tests...\n');
    try {
      const result = await onRunTests();
      setOutput(prev => prev + '\n' + result + '\n');
    } catch (e) {
      setOutput(prev => prev + '\nError running tests.\n');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-black text-gray-300 font-mono text-sm border-t border-gray-800">
      <div className="h-8 bg-gray-900 flex items-center justify-between px-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <TermIcon size={14} className="text-gray-400" />
          <span className="text-xs uppercase tracking-wider text-gray-400 font-sans">Terminal & Output</span>
        </div>
        <button 
          onClick={handleRun}
          disabled={running}
          className="flex items-center gap-1 text-xs bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded text-white"
        >
          <Play size={12} className={running ? 'animate-pulse text-yellow-400' : 'text-green-400'} />
          Run Tests
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4 whitespace-pre-wrap">
        {output}
      </div>
    </div>
  );
}
