import React, { useState } from 'react';

// --- Types ---
export interface CaptureItem {
  id: string;
  text: string;
  timestamp: string;
  phaseContext: string;
}

interface TheNetProps {
  captures: CaptureItem[];
  onCapture: (text: string, phaseContext: string) => void;
  onClear: () => void;
  currentPhase: string;
  isVisible?: boolean;
  onClose?: () => void;
  className?: string;
}

// --- Component ---
export function TheNet({
  captures,
  onCapture,
  onClear,
  currentPhase,
  isVisible = true,
  onClose,
  className = '',
}: TheNetProps) {
  const [captureInput, setCaptureInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!captureInput.trim()) return;
    
    onCapture(captureInput.trim(), currentPhase);
    setCaptureInput('');
  };

  if (!isVisible) return null;

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-light tracking-tight text-zinc-400">
            The Net
          </h2>
          <p className="text-zinc-600 text-xs mt-0.5">
            Expansion stream. {captures.length > 0 && `${captures.length} captured`}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors"
            aria-label="Close net"
          >
            ✕
          </button>
        )}
      </div>

      {/* Quick Capture Input */}
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          value={captureInput}
          onChange={(e) => setCaptureInput(e.target.value)}
          placeholder="Add to net..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors"
        />
        <p className="text-zinc-700 text-[10px] mt-1 pl-1">
          Press Enter to capture without stopping timer
        </p>
      </form>

      {/* Capture List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-zinc-800">
        {captures.length === 0 ? (
          <div className="text-center py-8 text-zinc-700 text-sm italic">
            Net is empty.
            <p className="text-[10px] mt-2 text-zinc-800">
              Thoughts captured here won't interrupt your flow.
            </p>
          </div>
        ) : (
          captures.map((cap) => (
            <CaptureCard key={cap.id} capture={cap} />
          ))
        )}
      </div>

      {/* Footer */}
      {captures.length > 0 && (
        <div className="mt-4 pt-4 border-t border-zinc-900 text-center">
          <button
            onClick={onClear}
            className="text-xs text-zinc-700 hover:text-rose-500 transition-colors"
          >
            Clear Net
          </button>
        </div>
      )}
    </div>
  );
}

// --- Subcomponent ---
function CaptureCard({ capture }: { capture: CaptureItem }) {
  return (
    <div className="group bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700 rounded-lg p-3 transition-all animate-in fade-in slide-in-from-top-2">
      <div className="text-zinc-300 text-sm mb-1.5 break-words leading-relaxed">
        {capture.text}
      </div>
      <div className="flex items-center justify-between text-[10px] text-zinc-600 font-mono">
        <span>{capture.timestamp}</span>
        <span className="uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">
          {capture.phaseContext}
        </span>
      </div>
    </div>
  );
}

// --- Context for shared state ---
import { createContext, useContext, useCallback, ReactNode } from 'react';

interface NetContextValue {
  captures: CaptureItem[];
  addCapture: (text: string, phaseContext: string) => void;
  clearCaptures: () => void;
  exportCaptures: () => string;
}

const NetContext = createContext<NetContextValue | null>(null);

export function NetProvider({ children }: { children: ReactNode }) {
  const [captures, setCaptures] = useState<CaptureItem[]>([]);

  const addCapture = useCallback((text: string, phaseContext: string) => {
    const newCapture: CaptureItem = {
      id: crypto.randomUUID(),
      text,
      timestamp: new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      phaseContext,
    };
    setCaptures(prev => [newCapture, ...prev]);
  }, []);

  const clearCaptures = useCallback(() => {
    setCaptures([]);
  }, []);

  const exportCaptures = useCallback(() => {
    return captures
      .map(c => `[${c.timestamp}] (${c.phaseContext}) ${c.text}`)
      .join('\n');
  }, [captures]);

  return (
    <NetContext.Provider value={{ captures, addCapture, clearCaptures, exportCaptures }}>
      {children}
    </NetContext.Provider>
  );
}

export function useNet() {
  const context = useContext(NetContext);
  if (!context) {
    throw new Error('useNet must be used within a NetProvider');
  }
  return context;
}

// --- Hook for localStorage persistence ---
export function useNetPersistence(storageKey = 'ritual-net-captures') {
  const { captures, addCapture, clearCaptures } = useNet();

  // Load from localStorage on mount
  React.useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as CaptureItem[];
        // Note: This would need the context to support bulk loading
        // For now, this is a placeholder for the persistence pattern
        console.log('Loaded captures from storage:', parsed.length);
      } catch (e) {
        console.error('Failed to parse stored captures:', e);
      }
    }
  }, [storageKey]);

  // Save to localStorage on changes
  React.useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(captures));
  }, [captures, storageKey]);

  return { captures, addCapture, clearCaptures };
}
