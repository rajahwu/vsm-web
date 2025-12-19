'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Archive, FileText } from "lucide-react";

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
}

/* =========================
   WorkSurface
   ========================= */

export const WorkSurface: React.FC<WorkSurfaceProps> = ({
  card,
  onShip,
}) => {
  const [content, setContent] = useState('');
  const [isShipping, setIsShipping] = useState(false);

  // Auto-save to localStorage as draft
  useEffect(() => {
    const draftKey = `draft_${card.id}`;
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft) {
      setContent(savedDraft);
    }

    return () => {
      if (content.trim()) {
        localStorage.setItem(draftKey, content);
      }
    };
  }, [card.id, content]);

  async function handleShip() {
    if (!content.trim()) return;

    try {
      setIsShipping(true);
      await onShip(content);
      // Clear draft after successful ship
      localStorage.removeItem(`draft_${card.id}`);
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

      {/* The Workspace */}
      <div className="flex-1 flex flex-col p-6">
        {card.forgePrompt && (
          <div className="mb-4 p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
            <p className="text-sm text-zinc-300 leading-relaxed">
              {card.forgePrompt}
            </p>
          </div>
        )}

        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Begin writing..."
          className="flex-1 resize-none bg-zinc-900 border-zinc-800 focus:ring-teal-500 focus:border-teal-500 text-lg leading-relaxed p-6 font-mono"
          autoFocus
        />
      </div>

      {/* Archive Action */}
      <footer className="border-t border-zinc-800 px-6 py-4 bg-zinc-900/50">
        <Button
          onClick={handleShip}
          disabled={!content.trim() || isShipping}
          className="w-full py-6 text-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-600 font-bold uppercase tracking-tighter flex items-center justify-center gap-2"
        >
          <Archive size={20} />
          {isShipping ? 'ARCHIVING…' : 'ARCHIVE OUTPUT'}
        </Button>
      </footer>
    </div>
  );
};
