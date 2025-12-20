'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MarkdownRenderer } from '@gttm/components';
import { FileText, Save, ArrowRight, PencilLine, Eye, Archive } from 'lucide-react';

/* =========================
   Props
   ========================= */

interface WorkSurfaceProps {
  card: {
    id: string;
    title: string;
    drill: { prompt: string };
    forgePrompt?: string;
  };
  onShip: (output: string) => Promise<void>;
  onCancel?: () => void;
  initialContent?: string;
}

const AUTOSAVE_INTERVAL_MS = 30000;

/* =========================
   WorkSurface
   ========================= */

export const WorkSurface: React.FC<WorkSurfaceProps> = ({
  card,
  onShip,
  onCancel,
  initialContent,
}) => {
  const draftKey = useMemo(() => `draft_${card.id}`, [card.id]);

  const [content, setContent] = useState('');
  const [isShipping, setIsShipping] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft) {
      setContent(savedDraft);
      return;
    }

    if (initialContent) {
      setContent(initialContent);
    }
  }, [draftKey, initialContent]);

  // Periodic autosave
  useEffect(() => {
    const interval = setInterval(() => {
      if (content.trim()) {
        localStorage.setItem(draftKey, content);
      }
    }, AUTOSAVE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [content, draftKey]);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isCmdOrCtrl = event.metaKey || event.ctrlKey;

      if (isCmdOrCtrl && event.key.toLowerCase() === 'enter') {
        event.preventDefault();
        handleShip();
      }

      if (isCmdOrCtrl && event.key.toLowerCase() === 'p') {
        event.preventDefault();
        setShowPreview(prev => !prev);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  async function handleShip() {
    if (!content.trim()) return;

    try {
      setIsShipping(true);
      await onShip(content);
      localStorage.removeItem(draftKey);
    } finally {
      setIsShipping(false);
    }
  }

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const charCount = content.length;

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100">
      {/* Sticky Header */}
      <header className="border-b border-zinc-800 px-6 py-4 bg-zinc-900/50">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2 text-teal-500">
            <FileText size={20} />
            <span className="text-xs uppercase tracking-widest font-bold">
              Work Surface
            </span>
          </div>
          <div className="text-xs text-zinc-500 uppercase tracking-wider">
            {card.title}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-emerald-400 font-semibold">
            Prompt: {card.drill.prompt}
          </p>
          <div className="text-xs text-zinc-600 space-x-4">
            <span>{wordCount} words</span>
            <span>{charCount} chars</span>
          </div>
        </div>
      </header>

      {/* Sticky Context Card */}
      <div className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur px-6 py-3">
        <div className="max-w-4xl mx-auto text-sm text-zinc-300">
          <span className="text-zinc-500 uppercase tracking-widest text-xs mr-2">
            Context
          </span>
          {card.forgePrompt || card.drill.prompt}
        </div>
      </div>

      {/* Workspace */}
      <div className="flex-1 flex flex-col p-6 gap-4">
        <div className="flex items-center justify-between">
          <div className="text-xs text-zinc-500 uppercase tracking-widest">
            {showPreview ? 'Preview' : 'Editor'}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="text-zinc-500 hover:text-zinc-200 flex items-center"
              onClick={() => setShowPreview(prev => !prev)}
            >
              {showPreview ? (
                <>
                  <PencilLine size={16} className="mr-2" />
                  Edit
                </>
              ) : (
                <>
                  <Eye size={16} className="mr-2" />
                  Preview
                </>
              )}
            </button>
            {onCancel && (
              <button
                type="button"
                className="text-zinc-500 hover:text-zinc-200"
                onClick={onCancel}
              >
                Exit
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 border border-zinc-800 rounded-lg bg-zinc-900">
          {showPreview ? (
            <div className="h-full overflow-y-auto p-6">
              <MarkdownRenderer content={content || '_Nothing to preview yet._'} />
            </div>
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Begin writing..."
              className="h-full w-full resize-none bg-zinc-900 border-0 focus:ring-0 text-lg leading-relaxed p-6 font-mono"
              autoFocus
            />
          )}
        </div>
      </div>

      {/* Archive Action */}
      <footer className="border-t border-zinc-800 px-6 py-4 bg-zinc-900/50">
        <button
          onClick={handleShip}
          disabled={!content.trim() || isShipping}
          className="w-full py-6 text-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-600 font-bold uppercase tracking-tighter flex items-center justify-center gap-2"
        >
          <Archive size={20} />
          {isShipping ? 'ARCHIVING...' : 'ARCHIVE OUTPUT'}
        </button>
      </footer>
    </div>
  );
};
