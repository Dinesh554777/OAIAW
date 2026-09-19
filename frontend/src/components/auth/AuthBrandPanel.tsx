import React from 'react';

export function AuthBrandPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between p-12 bg-background border-r border-border relative overflow-hidden">
      {/* Subtle Background Effects */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-ai/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10">
        <h1 className="text-4xl font-bold tracking-tighter mb-2 text-foreground">OAIAW</h1>
        <h2 className="text-xl text-muted-foreground font-medium mb-12 uppercase tracking-widest">
          Online Assessment<br />in the AI World
        </h2>
        
        <p className="text-lg text-slate-300 font-medium mb-8 max-w-sm leading-relaxed">
          Engineering assessment for the AI-assisted era.
        </p>

        <div className="space-y-4 font-mono text-sm tracking-wide text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="text-accent/50">01</span>
            <span className="text-foreground font-medium">Understand</span>
          </div>
          <div className="w-px h-4 bg-border ml-2" />
          <div className="flex items-center gap-3">
            <span className="text-accent/50">02</span>
            <span className="text-foreground font-medium">Build</span>
          </div>
          <div className="w-px h-4 bg-border ml-2" />
          <div className="flex items-center gap-3">
            <span className="text-accent/50">03</span>
            <span className="text-foreground font-medium">AI Assist</span>
          </div>
          <div className="w-px h-4 bg-border ml-2" />
          <div className="flex items-center gap-3">
            <span className="text-accent/50">04</span>
            <span className="text-foreground font-medium">Verify</span>
          </div>
          <div className="w-px h-4 bg-border ml-2" />
          <div className="flex items-center gap-3">
            <span className="text-accent/50">05</span>
            <span className="text-foreground font-medium">Test</span>
          </div>
          <div className="w-px h-4 bg-border ml-2" />
          <div className="flex items-center gap-3">
            <span className="text-accent/50">06</span>
            <span className="text-foreground font-medium">Refine</span>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 mt-12 text-xs font-mono text-muted-foreground">
        &copy; {new Date().getFullYear()} OAIAW Platform. All rights reserved.
      </div>
    </div>
  );
}
