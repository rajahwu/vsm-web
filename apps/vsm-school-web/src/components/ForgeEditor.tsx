import React, { useState } from 'react';
import { Button } from "@/components/ui/button"; // Standardized shadcn
import { Textarea } from "@/components/ui/textarea";

interface ForgeEditorProps {
  card: {
    id: string;
    title: string;
    drill: { prompt: string };
    forgePrompt: string; // "In 5-8 sentences, describe..."
  };
  sessionId: string;
  remainingTime: string; // Passed from the Pulse timer
  onShip: (output: string) => Promise<void>;
}

export const ForgeEditor: React.FC<ForgeEditorProps> = ({ 
  card, 
  sessionId, 
  remainingTime, 
  onShip 
}) => {
  const [content, setContent] = useState("");
  const [isShipping, setIsShipping] = useState(false);

  const handleShip = async () => {
    setIsShipping(true);
    await onShip(content);
    setIsShipping(false);
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground p-4">
      {/* Sticky Hint Bar */}
      <header className="border-b pb-4 mb-4">
        <div className="flex justify-between items-center text-xs uppercase tracking-widest text-muted-foreground mb-2">
          <span>{card.title}</span>
          <span className="text-emerald-500 font-mono">{remainingTime}</span>
        </div>
        <h2 className="text-sm font-bold text-emerald-400">
          HINT: {card.drill.prompt}
        </h2>
      </header>

      {/* The Workspace */}
      <div className="flex-1 flex flex-col gap-4">
        <p className="text-sm italic text-muted-foreground">
          {card.forgePrompt}
        </p>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Begin the poetry..."
          className="flex-1 resize-none bg-zinc-900 border-zinc-800 focus:ring-emerald-500 text-lg leading-relaxed"
        />
      </div>

      {/* Ship Action */}
      <footer className="mt-4 pt-4 border-t">
        <Button 
          onClick={handleShip} 
          disabled={!content || isShipping}
          className="w-full py-6 text-lg bg-emerald-600 hover:bg-emerald-500 font-bold uppercase tracking-tighter"
        >
          {isShipping ? "SHIPPING..." : "SHIP TO SHELL"}
        </Button>
      </footer>
    </div>
  );
};
