import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Save, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const [isDirty, setIsDirty] = useState(false);
  const [prevActiveFile, setPrevActiveFile] = useState(activeFile);
  
  if (activeFile !== prevActiveFile) {
    setValue(content);
    setIsDirty(false);
    setPrevActiveFile(activeFile);
  }

  const handleSave = () => {
    onSave(activeFile, value);
    setIsDirty(false);
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] border-r border-border">
      <div className="h-10 bg-surface flex items-center justify-between pl-0 pr-2 border-b border-border text-sm">
        <div className="flex h-full">
          <div className="flex items-center h-full gap-2 text-foreground bg-[#1e1e1e] px-4 border-t-2 border-accent border-r border-r-border/50 font-mono text-xs">
            <Code2 size={14} className="text-accent" />
            {activeFile || 'No file open'}
            {isDirty && <span className="w-2 h-2 rounded-full bg-warning ml-1"></span>}
          </div>
        </div>
        {activeFile && (
          <Button 
            onClick={handleSave}
            disabled={!isDirty}
            size="sm"
            variant="default"
            className="h-7 text-xs px-3"
          >
            <Save size={14} className="mr-1" />
            Save
          </Button>
        )}
      </div>
      <div className="flex-1 relative">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={value}
          onChange={(val) => {
             setValue(val || '');
             if (val !== content) setIsDirty(true);
          }}
          options={{
            minimap: { enabled: true, scale: 0.75 },
            fontSize: 13,
            fontFamily: "var(--font-mono)",
            wordWrap: 'on',
            lineHeight: 22,
            padding: { top: 16 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on"
          }}
          loading={<div className="h-full w-full flex items-center justify-center text-muted-foreground font-mono text-sm">Loading editor...</div>}
        />
      </div>
    </div>
  );
}
