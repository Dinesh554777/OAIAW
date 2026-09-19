import { Folder, FileCode, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function FileExplorer({ files, activeFile, onFileSelect }: { files: any, activeFile: string, onFileSelect: (path: string) => void }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ 'src': true, 'tests': true });

  const toggleDir = (dir: string) => setExpanded(prev => ({ ...prev, [dir]: !prev[dir] }));

  const renderTree = (node: any, path: string = '') => {
    return Object.entries(node).map(([key, value]) => {
      const currentPath = path ? `${path}/${key}` : key;
      const isDir = typeof value === 'object';
      
      if (isDir) {
        const isExpanded = expanded[currentPath];
        return (
          <div key={currentPath}>
            <div 
              className="flex items-center gap-1 py-1 px-2 hover:bg-gray-800 cursor-pointer text-gray-300 text-sm"
              onClick={() => toggleDir(currentPath)}
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <Folder size={14} className="text-blue-400" />
              <span>{key}</span>
            </div>
            {isExpanded && <div className="ml-4 border-l border-gray-700 pl-2">{renderTree(value, currentPath)}</div>}
          </div>
        );
      }
      
      return (
        <div 
          key={currentPath}
          className={`flex items-center gap-2 py-1 px-4 hover:bg-gray-800 cursor-pointer text-sm ${activeFile === currentPath ? 'bg-gray-800 text-white' : 'text-gray-400'}`}
          onClick={() => onFileSelect(currentPath)}
        >
          <FileCode size={14} className="text-gray-500" />
          <span>{key}</span>
        </div>
      );
    });
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-gray-300">
      <div className="p-2 text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-800">
        Explorer
      </div>
      <div className="flex-1 overflow-auto p-2">
        {files ? renderTree(files) : <div className="p-4 text-sm text-gray-500">Loading...</div>}
      </div>
    </div>
  );
}
