'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GENESIS_REQUIREMENTS } from '../data/GenesisCurriculum';
import { Download, Upload, RotateCcw, CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = 'vsm_genesis_progress';

export function GenesisTracker() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCompleted(new Set(parsed));
        }
      } catch (e) {
        console.error('Failed to parse genesis progress:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(completed)));
    }
  }, [completed, isLoaded]);

  const toggle = (id: string) => {
    const next = new Set(completed);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setCompleted(next);
  };

  const resetProgress = () => {
    if (confirm('Are you sure you want to reset all Genesis progress?')) {
      setCompleted(new Set());
    }
  };

  const exportData = () => {
    const data = JSON.stringify(Array.from(completed));
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vsm-genesis-progress-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          setCompleted(new Set(parsed));
          alert('Progress imported successfully.');
        }
      } catch (e) {
        alert('Failed to import progress. Invalid file format.');
      }
    };
    reader.readAsText(file);
  };

  const progress = Math.round((completed.size / GENESIS_REQUIREMENTS.length) * 100);

  if (!isLoaded) return null;

  return (
    <div className="space-y-8">
      {/* Literacy Bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-teal-500">
            <CheckCircle2 size={20} />
            <h2 className="text-xl font-bold tracking-tight uppercase">System Literacy</h2>
          </div>
          <div className="text-sm font-mono text-zinc-500">{progress}% LITERATE</div>
        </div>

        <div className="w-full bg-zinc-800 rounded-full h-3">
          <div 
            className="bg-teal-500 h-3 rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(20,184,166,0.5)]" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 mt-6">
          <button 
            onClick={exportData}
            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono rounded border border-zinc-700 transition-colors"
          >
            <Download size={14} /> EXPORT
          </button>
          
          <label className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono rounded border border-zinc-700 cursor-pointer transition-colors">
            <Upload size={14} /> IMPORT
            <input type="file" className="hidden" accept=".json" onChange={importData} />
          </label>

          <button 
            onClick={resetProgress}
            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-rose-900/30 hover:text-rose-400 text-zinc-500 text-xs font-mono rounded border border-zinc-700 hover:border-rose-900 transition-colors ml-auto"
          >
            <RotateCcw size={14} /> RESET
          </button>
        </div>
      </div>

      {/* Drill List */}
      <div className="grid gap-4">
        {GENESIS_REQUIREMENTS.map((req) => (
          <div 
            key={req.id}
            onClick={() => toggle(req.id)}
            className={`
              group flex items-start p-5 rounded-xl border cursor-pointer transition-all duration-200
              ${completed.has(req.id) 
                ? 'bg-teal-900/10 border-teal-500/30 shadow-[0_0_15px_rgba(20,184,166,0.05)]' 
                : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'}
            `}
          >
            <div className={`
              flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg font-mono text-xl font-bold mr-5 transition-colors
              ${completed.has(req.id) ? 'bg-teal-500 text-zinc-950 shadow-lg' : 'bg-zinc-800 text-zinc-500 group-hover:bg-zinc-700'}
            `}>
              {req.symbol}
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className={`font-bold tracking-tight ${completed.has(req.id) ? 'text-teal-400' : 'text-zinc-200'}`}>
                  {req.title}
                </h3>
                <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                  {req.category}
                </span>
              </div>
              <p className={`text-sm mt-2 leading-relaxed ${completed.has(req.id) ? 'text-zinc-300' : 'text-zinc-500'}`}>
                {req.drill}
              </p>
            </div>

            <div className="ml-4 flex h-6 w-6 items-center justify-center">
              <div className={`
                w-5 h-5 rounded border transition-all flex items-center justify-center
                ${completed.has(req.id) 
                  ? 'bg-teal-500 border-teal-500 text-zinc-950' 
                  : 'bg-transparent border-zinc-700 group-hover:border-zinc-500'}
              `}>
                {completed.has(req.id) && (
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                    <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
