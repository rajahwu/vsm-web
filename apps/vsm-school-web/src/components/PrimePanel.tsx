import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress"; // shadcn

interface PrimePanelProps {
  card: {
    id: string;
    title: string;
    phases: string[];
    drill: {
      seconds: number;
      medium: string;
      prompt: string;
    };
  };
  onComplete: () => void;
}

export const PrimePanel: React.FC<PrimePanelProps> = ({ card, onComplete }) => {
  const [subPhase, setSubPhase] = useState<"instruction" | "active">("instruction");
  const [timeLeft, setTimeLeft] = useState(card.drill.seconds);

  // Dojo Timer Logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (subPhase === "active" && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      onComplete(); // Auto-advance to Forge
    }
    return () => clearInterval(timer);
  }, [subPhase, timeLeft, onComplete]);

  return (
    <div className="flex flex-col h-screen justify-center items-center p-6 text-center bg-zinc-950">
      {subPhase === "instruction" ? (
        <div className="space-y-6">
          <header className="space-y-2">
            <h1 className="text-4xl font-black uppercase italic text-emerald-500">
              PRIME: {card.title}
            </h1>
            <p className="text-muted-foreground uppercase tracking-widest text-sm">
              Medium: {card.drill.medium}
            </p>
          </header>
          
          <div className="bg-zinc-900 p-6 rounded-lg border border-emerald-900/50">
            <p className="text-xl leading-relaxed">
              {card.drill.prompt}
            </p>
          </div>

          <Button 
            onClick={() => setSubPhase("active")}
            className="w-full h-16 text-xl bg-white text-black hover:bg-emerald-500 transition-colors font-bold"
          >
            START {card.drill.seconds}S DRILL
          </Button>
        </div>
      ) : (
        <div className="space-y-12 w-full max-w-xs">
          {/* Active Dojo Timer */}
          <div className="relative flex items-center justify-center">
            <div className="text-8xl font-black font-mono text-white">
              {timeLeft}
            </div>
            <svg className="absolute w-64 h-64 -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-emerald-900/20"
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={753.9}
                strokeDashoffset={753.9 - (753.9 * timeLeft) / card.drill.seconds}
                className="text-emerald-500 transition-all duration-1000 ease-linear"
              />
            </svg>
          </div>
          <p className="text-emerald-400 font-bold animate-pulse uppercase tracking-tighter">
            Execute: {card.drill.prompt}
          </p>
        </div>
      )}
    </div>
  );
};
