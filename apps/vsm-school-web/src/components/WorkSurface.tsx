'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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

  async function handleShip() {
    if (!content.trim()) return;

    try {
      setIsShipping(true);
      await onShip(content);
    } finally {
      setIsShipping(false);
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground p-4">
      {/* Sticky Hint Bar */}
      <header className="border-b pb-4 mb-4">
        <div className="flex justify-between items-center text-xs uppercase tracking-widest text-muted-foreground mb-2">
          <span>{card.title}</span>
        </div>
        <h2 className="text-sm font-bold text-emerald-400">
          HINT: {card.drill.prompt}
        </h2>
      </header>

      {/* The Workspace */}
      <div className="flex-1 flex flex-col gap-4">
        {card.forgePrompt && (
          <p className="text-sm italic text-muted-foreground">
            {card.forgePrompt}
          </p>
        )}

        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Begin the poetry..."
          className="flex-1 resize-none bg-zinc-900 border-zinc-800 focus:ring-emerald-500 text-lg leading-relaxed"
        />
      </div>

      {/* Archive Action */}
      <footer className="mt-4 pt-4 border-t">
        <Button
          onClick={handleShip}
          disabled={!content.trim() || isShipping}
          className="w-full py-6 text-lg bg-emerald-600 hover:bg-emerald-500 font-bold uppercase tracking-tighter"
        >
          {isShipping ? 'ARCHIVING…' : 'ARCHIVE OUTPUT'}
        </Button>
      </footer>
    </div>
  );
};
