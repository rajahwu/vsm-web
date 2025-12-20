import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, X, Clock, ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import { PHASES } from '../phases';

// --- INTEGRATED DEPENDENCIES (THEME) ---

const THEME = {
  base: {
    background: 'zinc-950',
    text: 'zinc-100',
    muted: 'zinc-500',
    border: 'zinc-800'
  }
};

// --- SOUND ENGINE ---

const useRitualSound = (phaseId: string, isRunning: boolean) => {
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  const playTone = useCallback((freq: number, type: 'sine' | 'triangle' = 'sine') => {
    if (isMuted || !audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 2);
  }, [isMuted]);

  useEffect(() => {
    if (isRunning && !isMuted) {
      initAudio();
      playTone(440); 
      setTimeout(() => playTone(554.37), 200); 
    }
  }, [phaseId, isRunning, isMuted, playTone]);

  return { isMuted, setIsMuted };
};

// --- MAIN COMPONENT ---

interface CaptureItem {
  id: string;
  text: string;
  timestamp: string;
  phaseContext: string;
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatDuration(seconds: number) {
  if (seconds >= 3600) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
  }
  return `${Math.floor(seconds / 60)}m`;
}

export function RitualCycleTracker() {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(PHASES[0].duration);
  const [sessionData, setSessionData] = useState<Record<string, string>>({});
  const [completedSessions, setCompletedSessions] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // THE NET STATE
  const [captures, setCaptures] = useState<CaptureItem[]>([]);
  const [captureInput, setCaptureInput] = useState('');
  const [showCaptures, setShowCaptures] = useState(true);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const currentPhase = PHASES[currentPhaseIndex];
  const { isMuted, setIsMuted } = useRitualSound(currentPhase.id, isRunning);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => setTimeRemaining(t => t - 1), 1000);
    } else if (timeRemaining === 0 && isRunning) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeRemaining]);

  // Focus
  useEffect(() => {
    if (textareaRef.current) textareaRef.current.focus();
  }, [currentPhaseIndex]);

  const handleCaptureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!captureInput.trim()) return;
    const newCapture: CaptureItem = {
      id: crypto.randomUUID(),
      text: captureInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      phaseContext: currentPhase.name
    };
    setCaptures(prev => [newCapture, ...prev]);
    setCaptureInput('');
  };

  const nextPhase = () => {
    if (currentPhaseIndex < PHASES.length - 1) {
      const nextIndex = currentPhaseIndex + 1;
      setCurrentPhaseIndex(nextIndex);
      setTimeRemaining(PHASES[nextIndex].duration);
      setIsRunning(false);
    } else {
      setCompletedSessions(prev => [...prev, { ...sessionData, completedAt: new Date().toISOString() }]);
      setSessionData({});
      setCurrentPhaseIndex(0);
      setTimeRemaining(PHASES[0].duration);
      setIsRunning(false);
    }
  };

  const prevPhase = () => {
    if (currentPhaseIndex > 0) {
      const prevIndex = currentPhaseIndex - 1;
      setCurrentPhaseIndex(prevIndex);
      setTimeRemaining(PHASES[prevIndex].duration);
      setIsRunning(false);
    }
  };

  const progress = ((currentPhase.duration - timeRemaining) / currentPhase.duration) * 100;

 return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row">
      <div className="max-w-container mx-auto w-full min-w-[360px] px-4 md:px-8 flex flex-col md:flex-row gap-8">
  
        {/* LEFT COLUMN (ENGINE)
          CRITICAL FIX: 'min-w-0' prevents the flex item from overflowing/crushing when the sidebar is open.
          We separate the flex behavior (here) from the width constraint (inner div).
        */}
        <div className="flex-1 min-w-0 flex flex-col overflow-y-auto custom-scrollbar p-4 md:p-8">
  
          {/* INNER CONTENT WRAPPER
            This applies your 'max-w-2xl' constraint to center the content nicely,
            independent of the flex container's shrinking.
          */}
          <div className="max-w-2xl mx-auto w-full flex-col flex min-h-0">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-light tracking-tight flex items-center gap-2">
                <Activity className="w-5 h-5 text-zinc-500" />
                Ritual Cycle
              </h1>
              <p className={`text-${THEME.base.muted} text-sm mt-1`}>In, through, out, done.</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className={`text-xs px-3 py-1.5 border rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
                      isMuted 
                      ? `border-${THEME.base.border} text-${THEME.base.muted}` 
                      : `border-emerald-500/30 text-emerald-500 bg-emerald-500/5`
                  }`}
              >
                  {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                  <span className="hidden sm:inline">{isMuted ? 'Silent' : 'Sound'}</span>
              </button>

              <button
                onClick={() => setShowCaptures(!showCaptures)}
                className={`md:hidden text-${THEME.base.muted} hover:text-zinc-300 text-sm px-3 py-1.5 border border-${THEME.base.border} rounded-lg`}
              >
                {showCaptures ? 'Hide Net' : `Net (${captures.length})`}
              </button>
              
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`text-${THEME.base.muted} hover:text-zinc-300 text-sm px-3 py-1.5 border border-${THEME.base.border} rounded-lg whitespace-nowrap`}
              >
                {showHistory ? 'Back' : `History (${completedSessions.length})`}
              </button>
            </div>
          </div>

          {showHistory ? (
            <div className="space-y-4 animate-in fade-in duration-300">
              {completedSessions.length === 0 ? (
                <div className={`text-center py-16 text-${THEME.base.muted}`}>
                  <p>No completed sessions yet.</p>
                </div>
              ) : (
                completedSessions.map((session, idx) => (
                  <div key={idx} className={`bg-zinc-900 border border-${THEME.base.border} rounded-xl p-4 space-y-2`}>
                    <div className={`text-${THEME.base.muted} text-xs`}>{session.date || 'Today'}</div>
                    <div className="space-y-1 text-sm">
                      {PHASES.map(p => (
                        <div key={p.id} className="flex justify-between">
                          <span className={`${p.textColor} text-xs uppercase`}>{p.name}</span>
                          <span className="text-zinc-300 truncate max-w-[200px]">{session[p.id] || '—'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1 flex flex-col min-h-0">
              
              {/* Phase Tabs */}
              <div className="flex gap-1 mb-8 overflow-x-auto pb-2 no-scrollbar">
                {PHASES.map((phase, idx) => (
                  <div
                    key={phase.id}
                    className={`h-1 flex-1 min-w-[2rem] rounded-full transition-all duration-300 ${
                      idx < currentPhaseIndex ? phase.color : 
                      idx === currentPhaseIndex ? `${phase.color} opacity-100` : 'bg-zinc-800'
                    }`}
                  />
                ))}
              </div>

              {/* Current Phase Card */}
              <div className={`flex-shrink-0 bg-zinc-900 border ${currentPhase.borderColor} border-opacity-30 rounded-2xl p-6 md:p-8 mb-6 transition-colors duration-500 shadow-2xl shadow-zinc-950/50 flex flex-col relative overflow-hidden`}>
                
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div>
                    <div className={`text-xs font-medium ${currentPhase.textColor} uppercase tracking-wider mb-1`}>
                      Phase {currentPhaseIndex + 1} of {PHASES.length}
                    </div>
                    <h2 className="text-3xl md:text-3xl font-light text-white">{currentPhase.name}</h2>
                  </div>
                  <div className={`text-xs ${currentPhase.textColor} bg-zinc-950/50 px-3 py-1.5 rounded font-mono border border-white/5`}>
                    {formatDuration(currentPhase.duration)}
                  </div>
                </div>

                {/* Gesture */}
                <p className="text-zinc-400 mb-6 text-sm leading-relaxed relative z-10">
                  {currentPhase.gesture}
                </p>

                {/* Timer & Controls */}
                <div className="mb-6 relative z-10">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                    <div className={`text-5xl md:text-6xl font-mono font-light tabular-nums tracking-tighter leading-none ${isRunning ? 'text-zinc-100' : 'text-zinc-500'}`}>
                      {formatTime(timeRemaining)}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsRunning(!isRunning)}
                        className={`h-10 px-6 rounded-lg text-sm font-medium transition-all active:scale-95 ${
                          isRunning
                            ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                            : `${currentPhase.color} text-white hover:opacity-90 shadow-lg shadow-${currentPhase.color}/20`
                        }`}
                      >
                        {isRunning ? 'Pause' : 'Start'}
                      </button>
                      <button
                        onClick={() => { setTimeRemaining(currentPhase.duration); setIsRunning(false); }}
                        className="h-10 px-3 flex items-center justify-center rounded-lg text-sm text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
                      >
                        Reset
                      </button>
                      <button
                        onClick={() => { setTimeRemaining(0); setIsRunning(false); }}
                        className="h-10 px-3 flex items-center justify-center rounded-lg text-sm text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
                      >
                        Skip
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${currentPhase.color} transition-all duration-1000 ease-linear`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Input Area */}
                <div className="flex-1 flex flex-col relative z-10">
                  <label className={`block ${THEME.base.muted} text-sm mb-2`}>
                    {currentPhase.prompt}
                  </label>
                  <textarea
                    ref={textareaRef}
                    value={sessionData[currentPhase.id] || ''}
                    onChange={(e) => setSessionData(prev => ({ ...prev, [currentPhase.id]: e.target.value }))}
                    placeholder="Input stream..."
                    rows={3}
                    className={`w-full bg-zinc-950/50 border ${THEME.base.border} rounded-xl p-4 text-${THEME.base.text} placeholder-zinc-700 focus:outline-none focus:border-zinc-600 resize-none transition-colors font-sans`}
                  />
                </div>

              </div>

              {/* Navigation Footer */}
              <div className="flex justify-between items-center pb-8">
                <button
                  onClick={prevPhase}
                  disabled={currentPhaseIndex === 0}
                  className={`flex items-center gap-2 px-4 py-2 text-sm text-${THEME.base.muted} hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors`}
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>

                <button
                  onClick={nextPhase}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium ${currentPhase.color} text-white hover:opacity-90 transition-opacity shadow-lg shadow-${currentPhase.color}/20`}
                >
                  {currentPhaseIndex === PHASES.length - 1 ? 'Complete' : 'Next Phase'} <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: THE NET */}
      <div className={`
        fixed inset-y-0 right-0 z-50 bg-zinc-950 shadow-2xl md:shadow-none md:static md:z-auto
        w-80 border-l border-zinc-900 flex flex-col
        transition-transform duration-300 ease-in-out
        ${showCaptures ? 'translate-x-0' : 'translate-x-full md:translate-x-0 md:w-0 md:border-none md:overflow-hidden'}
      `}>
        <div className="flex-1 flex flex-col min-h-0 w-80">
            <div className="p-6 pb-0 flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-light tracking-tight text-zinc-400">The Net</h2>
                  <p className="text-zinc-600 text-xs mt-0.5">Capture stream.</p>
                </div>
                <button onClick={() => setShowCaptures(false)} className="md:hidden text-zinc-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
            </div>

            <div className="px-6 mb-6">
                <form onSubmit={handleCaptureSubmit}>
                <input
                    type="text"
                    value={captureInput}
                    onChange={(e) => setCaptureInput(e.target.value)}
                    placeholder="Add to net..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors"
                />
                </form>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3 custom-scrollbar">
                {captures.length === 0 ? (
                <div className="text-center py-8 text-zinc-700 text-sm italic border-t border-zinc-900/50 pt-12">
                    Net is empty.
                </div>
                ) : (
                captures.map((cap) => (
                    <div key={cap.id} className="group bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700 rounded-lg p-3 transition-all">
                      <div className="text-zinc-300 text-sm mb-2 break-words leading-relaxed">{cap.text}</div>
                      <div className="flex items-center justify-between text-[10px] text-zinc-600 font-mono">
                          <span>{cap.timestamp}</span>
                          <span className="uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity text-[9px] border border-zinc-800 px-1 rounded">{cap.phaseContext}</span>
                      </div>
                    </div>
                ))
                )}
            </div>
            
            {captures.length > 0 && (
                <div className="p-4 border-t border-zinc-900 text-center">
                    <button onClick={() => setCaptures([])} className="text-xs text-zinc-600 hover:text-rose-500 transition-colors">
                        Clear Net
                    </button>
                </div>
            )}
        </div>
      </div>

    </div>
    </div>
  );
}