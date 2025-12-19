import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react"; //

interface MissionSuccessProps {
  cardTitle: string;
  literacyGain: number; // e.g., 25
  newTotalLiteracy: number; // e.g., 50
  nextCardTitle?: string;
  onContinue: () => void;
}

export const MissionSuccess: React.FC<MissionSuccessProps> = ({
  cardTitle,
  literacyGain,
  newTotalLiteracy,
  nextCardTitle,
  onContinue
}) => {
  return (
    <div className="flex flex-col h-screen justify-center items-center p-8 bg-black text-white text-center">
      {/* Celebration Icon */}
      <div className="mb-6 text-emerald-500 animate-bounce">
        <CheckCircle2 size={80} strokeWidth={1.5} />
      </div>

      <header className="space-y-2 mb-12">
        <h1 className="text-3xl font-black uppercase tracking-tighter italic">
          ATOM SHIPPED
        </h1>
        <p className="text-zinc-500 uppercase tracking-widest text-sm">
          Mission: {cardTitle} Complete
        </p>
      </header>

      {/* Progress Metrics */}
      <div className="w-full max-w-xs space-y-6 mb-12">
        <div className="flex justify-between items-end">
          <span className="text-zinc-500 text-xs uppercase">Literacy Gain</span>
          <span className="text-emerald-400 font-mono">+{literacyGain}%</span>
        </div>
        <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-1000 ease-out"
            style={{ width: `${newTotalLiteracy}%` }}
          />
        </div>
        <p className="text-xs text-zinc-500 uppercase">
          Total Track Literacy: {newTotalLiteracy}%
        </p>
      </div>

      {/* Next Mission Call-to-Action */}
      {nextCardTitle && (
        <div className="space-y-4 w-full max-w-xs">
          <p className="text-xs text-zinc-400 uppercase tracking-widest">Next Mission Unlocked</p>
          <Button 
            onClick={onContinue}
            className="w-full py-8 text-lg bg-white text-black hover:bg-emerald-500 font-bold flex gap-2"
          >
            START: {nextCardTitle} <ArrowRight size={20} />
          </Button>
        </div>
      )}
    </div>
  );
};
