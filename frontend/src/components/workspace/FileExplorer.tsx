import { Folder, FileCode, ChevronDown, ChevronRight, Search, FileJson, FileText, File } from 'lucide-react';
import { useState } from 'react';

export default function FileExplorer({ files, activeFile, onFileSelect }: { files: any, activeFile: string, onFileSelect: (path: string) => void }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ 'src': true, 'tests': true });

  const toggleDir = (dir: string) => setExpanded(prev => ({ ...prev, [dir]: !prev[dir] }));

  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.ts') || filename.endsWith('.tsx') || filename.endsWith('.js') || filename.endsWith('.py')) return <FileCode size={14} className="text-accent" />;
    if (filename.endsWith('.json')) return <FileJson size={14} className="text-warning" />;
    if (filename.endsWith('.md')) return <FileText size={14} className="text-info" />;
    return <File size={14} className="text-muted-foreground" />;
  };

  const renderTree = (node: any, path: string = '') => {
    return Object.entries(node).map(([key, value]) => {
      const currentPath = path ? `${path}/${key}` : key;
      const isDir = typeof value === 'object';
      
      if (isDir) {
        const isExpanded = expanded[currentPath];
        return (
          <div key={currentPath}>
            <div 
              className="flex items-center gap-1.5 py-1 px-2 hover:bg-surface-elevated cursor-pointer text-foreground text-sm font-medium transition-colors rounded-sm mx-1 mt-0.5 select-none"
              onClick={() => toggleDir(currentPath)}
            >
              {isExpanded ? <ChevronDown size={14} className="text-muted-foreground" /> : <ChevronRight size={14} className="text-muted-foreground" />}
              <Folder size={14} className="text-muted-foreground" />
              <span>{key}</span>
            </div>
            {isExpanded && <div className="ml-4 border-l border-border/50 pl-1.5">{renderTree(value, currentPath)}</div>}
          </div>
        );
      }
      
      return (
        <div 
          key={currentPath}
          className={`flex items-center gap-2 py-1 px-4 cursor-pointer text-sm font-mono rounded-sm mx-1 mt-0.5 transition-colors select-none ${activeFile === currentPath ? 'bg-accent/10 text-accent font-medium' : 'text-muted-foreground hover:bg-surface-elevated hover:text-foreground'}`}
          onClick={() => onFileSelect(currentPath)}
        >
          {getFileIcon(key)}
          <span className="truncate">{key}</span>
        </div>
      );
    });
  };

  return (
    <div className="h-full flex flex-col bg-surface border-r border-border shadow-sm">
      <div className="p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border flex items-center justify-between">
        Explorer
      </div>
      <div className="p-2 border-b border-border bg-surface/50">
        <div className="relative group">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" />
          <input type="text" placeholder="Search files..." className="w-full bg-surface-elevated border border-transparent focus:border-border text-xs rounded pl-8 py-1.5 text-foreground placeholder:text-muted-foreground focus:outline-none transition-all shadow-sm" />
        </div>
      </div>
      <div className="flex-1 overflow-auto py-2 custom-scrollbar">
        {files ? renderTree(files) : (
          <div className="p-4 flex flex-col gap-2">
             <div className="w-full h-4 bg-surface-elevated animate-pulse rounded"></div>
             <div className="w-3/4 h-4 bg-surface-elevated animate-pulse rounded ml-4"></div>
             <div className="w-5/6 h-4 bg-surface-elevated animate-pulse rounded ml-4"></div>
          </div>
        )}
      </div>
    </div>
  );
}
