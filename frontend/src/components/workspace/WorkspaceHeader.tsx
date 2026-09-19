import { Play, CheckCircle } from 'lucide-react';

export default function WorkspaceHeader({ taskTitle, timeLeft, onSubmit }: { taskTitle: string, timeLeft: string, onSubmit: () => void }) {
  return (
    <div className="h-12 bg-gray-900 text-white flex items-center justify-between px-4 border-b border-gray-800">
      <div className="flex items-center gap-4">
        <span className="font-bold text-blue-400">OAIAW</span>
        <span className="text-gray-400">|</span>
        <span className="font-semibold text-sm">{taskTitle}</span>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-sm font-mono bg-gray-800 px-3 py-1 rounded">
          {timeLeft}
        </div>
        <button 
          onClick={onSubmit}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded text-sm font-semibold flex items-center gap-2"
        >
          <CheckCircle size={16} />
          Submit Task
        </button>
      </div>
    </div>
  );
}
