'use client';

import { useState } from 'react';

// Mock Definitions (replacing external package for now)
const THEMES = {
  'Victor V': {
    fontHeading: 'Inter, sans-serif',
    fontBody: 'Inter, sans-serif',
    primary: '#10b981', // Emerald
    text: '#18181b',    // Zinc 900 (for paper)
    paper: '#ffffff',
  },
  'Manifesto': {
    fontHeading: 'JetBrains Mono, monospace',
    fontBody: 'JetBrains Mono, monospace',
    primary: '#f43f5e', // Rose
    text: '#09090b',    // Zinc 950
    paper: '#f4f4f5',   // Zinc 100
  }
};

export default function EditorPage() {
  const [docState, setDocState] = useState({
    title: 'The Drunk Text to Nobody',
    category: 'Manifesto',
    theme: 'Victor V',
    body: `1. THE REFUSAL
I wrote this for the world, but the world isn't there. It’s just a room full of mirrors and empty air.

2. THE SIGNAL
So I’m sending this to Nobody. Yeah, that’s you. The one who knows what’s fake and what’s true.

3. THE SNAP
I am tired of the doctoring. I am tired of the translation tax. Windows Up. Signal Clear.`,
  });

  const activeTheme = THEMES[docState.theme as keyof typeof THEMES];

  // Dynamic Styles for the Preview Pane
  const previewStyles = {
    '--preview-font-heading': activeTheme.fontHeading,
    '--preview-font-body': activeTheme.fontBody,
    '--preview-color-primary': activeTheme.primary,
    '--preview-color-text': activeTheme.text,
    '--preview-bg-paper': activeTheme.paper,
  } as React.CSSProperties;

  return (
    <div className="h-screen flex flex-col p-6 gap-6 bg-zinc-950">
      
      {/* Header */}
      <header className="flex items-center justify-between border-b border-zinc-900 pb-4">
        <div>
          <h1 className="text-xl font-light tracking-tight text-white">Editor <span className="text-zinc-600">/ V0</span></h1>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded transition-colors">
             Save Artifact
           </button>
        </div>
      </header>

      <div className="flex-1 flex gap-6 min-h-0">
        
        {/* --- LEFT PANEL: INPUT (The Terminal) --- */}
        <div className="w-1/2 flex flex-col gap-4">
          
          {/* Metadata Controls */}
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Mode</label>
                <select
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-sm text-zinc-300 focus:border-emerald-500/50 outline-none"
                  value={docState.theme}
                  onChange={(e) => setDocState({ ...docState, theme: e.target.value })}
                >
                  {Object.keys(THEMES).map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Title</label>
                <input
                  type="text"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-sm text-zinc-300 focus:border-emerald-500/50 outline-none"
                  value={docState.title}
                  onChange={(e) => setDocState({ ...docState, title: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Main Text Area */}
          <div className="flex-1 bg-zinc-900 rounded-xl border border-zinc-800 p-1 flex flex-col">
            <textarea
              className="flex-1 w-full bg-transparent p-6 text-zinc-300 font-mono text-sm leading-relaxed resize-none focus:outline-none"
              value={docState.body}
              onChange={(e) => setDocState({ ...docState, body: e.target.value })}
              spellCheck={false}
              placeholder="Start transmission..."
            />
          </div>
        </div>

        {/* --- RIGHT PANEL: PREVIEW (The Paper) --- */}
        <div className="w-1/2 bg-zinc-900/50 rounded-xl border border-zinc-800 overflow-hidden flex flex-col relative">
          
          {/* Chrome */}
          <div className="h-8 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 justify-between">
            <span className="text-[10px] font-mono text-zinc-600">LIVE RENDER</span>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
              <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
            </div>
          </div>

          {/* Scrollable Paper Container */}
          <div className="flex-1 overflow-y-auto p-8 lg:p-12 bg-zinc-900/50 flex justify-center">
            
            <div
              className="w-full max-w-[210mm] shadow-2xl min-h-[297mm] p-12 transition-all duration-300 ease-in-out"
              style={{
                ...previewStyles,
                backgroundColor: 'var(--preview-bg-paper)',
                color: 'var(--preview-color-text)'
              }}
            >
              {/* Document Header */}
              <h1
                style={{
                  fontFamily: 'var(--preview-font-heading)',
                  color: 'var(--preview-color-primary)',
                  borderBottom: '2px solid var(--preview-color-primary)',
                }}
                className="text-3xl font-bold mb-6 pb-4"
              >
                {docState.title}
              </h1>

              {/* Meta */}
              <div
                style={{ fontFamily: 'var(--preview-font-body)' }}
                className="flex justify-between text-xs font-bold tracking-widest mb-12 uppercase opacity-50"
              >
                <span>{docState.category}</span>
                <span>ORIGIN: VICTOR V</span>
              </div>

              {/* Body */}
              <div
                style={{ fontFamily: 'var(--preview-font-body)' }}
                className="whitespace-pre-wrap text-base leading-relaxed"
              >
                {docState.body}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
