'use client';

import { useState, useEffect } from 'react';
import { MarkdownRenderer } from '@gttm/components';
import { ArrowRight, SkipForward, BookOpen } from 'lucide-react';

interface CodexViewerProps {
  slug?: string;
  onContinue: () => void;
  onSkip?: () => void;
  getEntry: (slug: string) => string;
}

export function CodexViewer({ slug, onContinue, onSkip, getEntry }: CodexViewerProps) {
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    try {
      const entry = getEntry(slug);
      setContent(entry);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load codex entry');
      setContent(null);
    } finally {
      setLoading(false);
    }
  }, [slug, getEntry]);

  if (loading) {
    return (
      <div className="flex flex-col h-screen justify-center items-center bg-zinc-950 text-zinc-400">
        <BookOpen className="animate-pulse mb-4" size={48} />
        <p className="text-sm uppercase tracking-wider">Loading Codex Entry...</p>
      </div>
    );
  }

  if (!slug || error) {
    return (
      <div className="flex flex-col h-screen justify-center items-center bg-zinc-950 p-6">
        <div className="max-w-md text-center space-y-4">
          <p className="text-zinc-400 text-sm uppercase tracking-wider">
            {error || 'No codex entry for this phase'}
          </p>
          <button
            onClick={onContinue}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md"
          >
            Continue Anyway <ArrowRight size={16} className="ml-2 inline" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="flex flex-col h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="flex items-center gap-2 text-teal-500">
          <BookOpen size={20} />
          <h2 className="text-sm uppercase tracking-widest font-bold">Codex Entry</h2>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <MarkdownRenderer content={content || ''} />
        </div>
      </div>

      {/* Footer Actions */}
      <footer className="border-t border-zinc-800 px-6 py-4 bg-zinc-900/50">
        <div className="max-w-3xl mx-auto flex justify-between items-center gap-4">
          {onSkip && (
            <button
              onClick={onSkip}
              className="text-zinc-500 hover:text-zinc-300 flex items-center"
            >
              <SkipForward size={16} className="mr-2" />
              Skip
            </button>
          )}
          <button
            onClick={onContinue}
            className="ml-auto bg-teal-600 hover:bg-teal-700 text-white px-8 py-2 rounded-md"
          >
            Continue <ArrowRight size={16} className="ml-2 inline" />
          </button>
        </div>
      </footer>
    </section>
  );
}
