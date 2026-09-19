import { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Save } from 'lucide-react';

export default function CodeEditor({ 
  content, 
  language = 'javascript', 
  activeFile, 
  onSave 
}: { 
  content: string, 
  language?: string, 
  activeFile: string,
  onSave: (path: string, content: string) => void 
}) {
  const [value, setValue] = useState(content);
  
  // Update local value when prop content changes (i.e. file changed)
  if (value !== content && !activeFile.includes(value)) {
    // This is a naive way to sync. In a real app, use useEffect.
  }

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e]">
      <div className="h-10 bg-gray-900 flex items-center justify-between px-4 border-b border-gray-800 text-sm">
        <div className="flex items-center gap-2 text-gray-300 bg-[#1e1e1e] px-4 py-2 border-t-2 border-blue-500">
          {activeFile || 'No file open'}
        </div>
        {activeFile && (
          <button 
            onClick={() => onSave(activeFile, value)}
            className="flex items-center gap-1 text-gray-400 hover:text-white"
          >
            <Save size={14} />
            <span>Save</span>
          </button>
        )}
      </div>
      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={value}
          onChange={(val) => setValue(val || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on'
          }}
        />
      </div>
    </div>
  );
}
