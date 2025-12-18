import type { Metadata } from 'next';
import { GenesisTracker } from '@/components/GenesisTracker';

export const metadata: Metadata = {
  title: 'Genesis Curriculum - GTTM Hub',
  description: 'Master the 10 foundational drills of the VSM Training System',
};

export default function GenesisPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-zinc-100 mb-2">
            Genesis Curriculum
          </h1>
          <p className="text-zinc-400 text-lg">
            Master these 10 foundational drills to build your velocity state machine.
          </p>
        </div>

        {/* Genesis Tracker Component */}
        <GenesisTracker />

        {/* Footer Info */}
        <div className="mt-12 p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
          <h2 className="text-sm font-mono text-zinc-400 uppercase tracking-widest mb-3">
            About Genesis
          </h2>
          <p className="text-zinc-300 leading-relaxed">
            The Genesis Curriculum represents the core training blocks that form the foundation 
            of the VSM (Velocity State Machine) methodology. Each drill combines physical and 
            mental components to build sustainable high-performance patterns.
          </p>
        </div>
      </div>
    </div>
  );
}
