'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Save, Download, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '@ritual/components';

// Mock Definitions (replacing external package for now)
const THEMES = {
  'Victor V': {
    name: 'Victor V',
    fontHeading: 'Inter, sans-serif',
    fontBody: 'Inter, sans-serif',
    primary: '#10b981', // Emerald
    text: '#18181b',    // Zinc 900 (for paper)
    paper: '#ffffff',
  },
  'Manifesto': {
    name: 'Manifesto',
    fontHeading: 'JetBrains Mono, monospace',
    fontBody: 'JetBrains Mono, monospace',
    primary: '#f43f5e', // Rose
    text: '#09090b',    // Zinc 950
    paper: '#f4f4f5',   // Zinc 100
  }
};

const PERSISTENCE_KEY = 'vsm_workbook_draft';

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

  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Restore State
  useEffect(() => {
    const saved = localStorage.getItem(PERSISTENCE_KEY);
    if (saved) {
      try {
        setDocState(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to restore workbook draft:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save State to local
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(docState));
    }
  }, [docState, isLoaded]);

  const saveArtifact = async () => {
    setIsSaving(true);
    try {
      const { error } = await (supabase.from('atoms') as any).insert({
        type: 'workbook_artifact',
        val: {
          ...docState,
          timestamp: new Date().toISOString()
        }
      });

      if (error) throw error;
      alert('✓ Artifact Saved to Core Memory');
    } catch (err) {
      console.error('Save Failed:', err);
      alert('⚠ Connection failure. Could not save artifact.');
    } finally {
      setIsSaving(false);
    }
  };

  const exportMarkdown = () => {
    const content = `# ${docState.title}\n\nCategory: ${docState.category}\nTheme: ${docState.theme}\n\n---\n\n${docState.body}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${docState.title.toLowerCase().replace(/\s+/g, '-')}.md`;
    link.click();
  };

  const activeTheme = THEMES[docState.theme as keyof typeof THEMES] || THEMES['Victor V'];

  // Dynamic Styles for the Preview Pane
  const previewStyles = {
    '--preview-font-heading': activeTheme.fontHeading,
    '--preview-font-body': activeTheme.fontBody,
    '--preview-color-primary': activeTheme.primary,
    '--preview-color-text': activeTheme.text,
    '--preview-bg-paper': activeTheme.paper,
  } as React.CSSProperties;

  if (!isLoaded) return null;

  return (
    <div className="h-screen flex flex-col p-6 gap-6 bg-zinc-950">
      
      {/* Header */}
      <header className="flex items-center justify-between border-b border-zinc-900 pb-4">
        <div className="flex items-center gap-3">
          <FileText className="text-emerald-500" size={24} />
          <h1 className="text-xl font-light tracking-tight text-white">Workbook <span className="text-zinc-600">/ Station</span></h1>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" size="sm" onClick={exportMarkdown} className="text-zinc-400 border-zinc-800 hover:text-zinc-100">
             <Download className="mr-2 h-4 w-4" /> Export MD
           </Button>
           <Button onClick={saveArtifact} disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-500">
             {isSaving ? 'Saving...' : 'Save Artifact'}
             <Save className="ml-2 h-4 w-4" />
           </Button>
        </div>
      </header>

      <div className="flex-1 flex gap-6 min-h-0">
        
        {/* --- LEFT PANEL: INPUT (The Terminal) --- */}
        <div className="w-1/2 flex flex-col gap-4">
          
          {/* Metadata Controls */}
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Theme Profile</label>
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
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Document Title</label>
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
          <div className="flex-1 bg-zinc-900 rounded-xl border border-zinc-800 p-1 flex flex-col relative group">
            <textarea
              className="flex-1 w-full bg-transparent p-6 text-zinc-300 font-mono text-sm leading-relaxed resize-none focus:outline-none"
              value={docState.body}
              onChange={(e) => setDocState({ ...docState, body: e.target.value })}
              spellCheck={false}
              placeholder="Start transmission..."
            />
            <div className="absolute bottom-4 right-6 text-[10px] font-mono text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity">
              CHARS: {docState.body.length} | WORDS: {docState.body.trim().split(/\s+/).filter(Boolean).length}
            </div>
          </div>
        </div>

        {/* --- RIGHT PANEL: PREVIEW (The Paper) --- */}
        <div className="w-1/2 bg-zinc-900/50 rounded-xl border border-zinc-800 overflow-hidden flex flex-col relative shadow-inner">
          
          {/* Chrome */}
          <div className="h-8 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 justify-between">
            <span className="text-[10px] font-mono text-zinc-600 tracking-widest">REALTIME_ARTIFACT_RENDER</span>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500/20"></div>
              <div className="w-2 h-2 rounded-full bg-emerald-500/40 animate-pulse"></div>
            </div>
          </div>

          {/* Scrollable Paper Container */}
          <div className="flex-1 overflow-y-auto p-8 lg:p-16 bg-zinc-950 flex justify-center custom-scrollbar">
            
            <div
              className="w-full max-w-[210mm] shadow-[0_20px_50px_rgba(0,0,0,0.5)] min-h-[297mm] p-16 transition-all duration-500 ease-in-out"
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
                className="text-4xl font-black mb-8 pb-6 tracking-tight uppercase"
              >
                {docState.title}
              </h1>

              {/* Meta */}
              <div
                style={{ fontFamily: 'var(--preview-font-body)' }}
                className="flex justify-between text-[10px] font-bold tracking-[0.2em] mb-16 uppercase opacity-40 border-b border-black/5 pb-2"
              >
                <span>CAT: {docState.category}</span>
                <span>ORIGIN: VSM_CORE</span>
              </div>

              {/* Body */}
              <div
                style={{ fontFamily: 'var(--preview-font-body)' }}
                className="whitespace-pre-wrap text-lg leading-relaxed antialiased"
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
