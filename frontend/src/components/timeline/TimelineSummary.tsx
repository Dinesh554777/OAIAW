import React from 'react';
import { 
  Clock, FileCode2, Bot, Beaker, GitCommit, ListOrdered
} from 'lucide-react';

interface SummaryData {
  duration_seconds: number;
  files_modified: number;
  ai_interactions: number;
  ai_tools_approved: number;
  ai_tools_rejected: number;
  test_runs: number;
  successful_test_runs: number;
  failed_test_runs: number;
  git_commits: number;
  total_events: number;
}

export function TimelineSummary({ summary }: { summary: SummaryData }) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  return (
    <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Session Summary</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        
        <div className="bg-[#252526] p-4 rounded-md border border-[#333]">
          <div className="flex items-center space-x-2 text-gray-400 mb-2">
            <Clock size={16} />
            <span className="text-sm">Duration</span>
          </div>
          <div className="text-2xl font-bold text-white">{formatDuration(summary.duration_seconds)}</div>
        </div>

        <div className="bg-[#252526] p-4 rounded-md border border-[#333]">
          <div className="flex items-center space-x-2 text-gray-400 mb-2">
            <FileCode2 size={16} className="text-blue-400" />
            <span className="text-sm">Files Modified</span>
          </div>
          <div className="text-2xl font-bold text-white">{summary.files_modified}</div>
        </div>

        <div className="bg-[#252526] p-4 rounded-md border border-[#333]">
          <div className="flex items-center space-x-2 text-gray-400 mb-2">
            <Bot size={16} className="text-purple-400" />
            <span className="text-sm">AI Interactions</span>
          </div>
          <div className="text-2xl font-bold text-white">{summary.ai_interactions}</div>
          <div className="text-xs text-gray-500 mt-1">
            {summary.ai_tools_approved} tools approved
          </div>
        </div>

        <div className="bg-[#252526] p-4 rounded-md border border-[#333]">
          <div className="flex items-center space-x-2 text-gray-400 mb-2">
            <Beaker size={16} className="text-emerald-400" />
            <span className="text-sm">Test Runs</span>
          </div>
          <div className="text-2xl font-bold text-white">{summary.test_runs}</div>
          <div className="text-xs text-gray-500 mt-1 flex space-x-2">
            <span className="text-emerald-500">{summary.successful_test_runs} pass</span>
            <span className="text-red-500">{summary.failed_test_runs} fail</span>
          </div>
        </div>

        <div className="bg-[#252526] p-4 rounded-md border border-[#333]">
          <div className="flex items-center space-x-2 text-gray-400 mb-2">
            <ListOrdered size={16} />
            <span className="text-sm">Total Events</span>
          </div>
          <div className="text-2xl font-bold text-white">{summary.total_events}</div>
        </div>

      </div>
    </div>
  );
}
