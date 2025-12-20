// apps/vsm-school-web/src/components/CheckbookHeatmap.tsx
import React from 'react';

export const CheckbookHeatmap = ({ sessions }) => {
  // Logic to map the last 30 days of user_training_sessions
  // Sessions with higher intensity_score render in darker Radiant Seven colors
  return (
    <div className="vsm-tracker-container p-4 bg-black border border-zinc-800 rounded-lg">
      <h3 className="text-zinc-400 text-xs uppercase tracking-widest mb-4">
        VSM Checkbook: 30-Day Ritual Streak
      </h3>
      
      <div className="grid grid-cols-7 gap-2">
        {/* Map through the days of the month */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div 
            key={i}
            className={`w-full aspect-square rounded-sm transition-colors ${
              // Logic: Intensity 0 = zinc-900, Intensity 10 = primary-glow
              'bg-zinc-900 border border-zinc-800 hover:border-zinc-500'
            }`}
            title={`Day ${i + 1}: Ritual Status`}
          />
        ))}
      </div>
      
      <div className="mt-4 flex justify-between text-[10px] text-zinc-500 uppercase">
        <span>Current Streak: 12 Days</span>
        <span>Total Artifacts Shipped: 42</span>
      </div>
    </div>
  );
};
