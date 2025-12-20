'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Play, 
  RotateCcw, 
  ChevronRight, 
  Shield, 
  Zap, 
  Layers, 
  Timer,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

/* =========================
   Protocol: Blackjack
   Focus: Double Lift Mechanics + Splintering
   ========================= */

type BlackjackStage = 'ready' | 'active' | 'complete';

interface SplinterTask {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const SPLINTER_TASKS: SplinterTask[] = [
  { 
    id: 'tweet', 
    label: 'Micro (Tweet)', 
    description: 'Condense the atom into < 280 chars.',
    icon: <Zap size={16} /> 
  },
  { 
    id: 'visual', 
    label: 'Visual (IG/Slide)', 
    description: 'Define the visual hook or diagram.',
    icon: <Layers size={16} /> 
  },
  { 
    id: 'command', 
    label: 'Protocol (CLI)', 
    description: 'Turn the idea into a repeatable command.',
    icon: <Shield size={16} /> 
  }
];

export default function BlackjackProtocol() {
  const [stage, setStage] = useState<BlackjackStage>('ready');
  const [reps, setReps] = useState(0);
  const [targetReps] = useState(21); // The "Blackjack" target
  const [timeRemaining, setTimeRemaining] = useState(180); // 3 minutes
  const [isActive, setIsActive] = useState(false);
  const [currentSplinter, setCurrentSplinter] = useState<string>('');
  const [outputs, setOutputs] = useState<Record<string, string>>({});
  const [isShipping, setIsShipping] = useState(false);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsActive(false);
            setStage('complete');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  const handleRep = useCallback(() => {
    if (!isActive) return;
    setReps(prev => {
      const next = prev + 1;
      if (next >= targetReps) {
        // Target reached but keep going until time ends? 
        // Or finish? Protocol says "Between reps, splinter".
      }
      return next;
    });
  }, [isActive, targetReps]);

  const startProtocol = () => {
    setStage('active');
    setIsActive(true);
    setReps(0);
    setTimeRemaining(180);
  };

  const handleSplinterChange = (taskId: string, value: string) => {
    setOutputs(prev => ({ ...prev, [taskId]: value }));
  };

  const shipProtocol = async () => {
    setIsShipping(true);
    const logEntry = {
      protocol: 'blackjack',
      reps_completed: reps,
      target_reps: targetReps,
      duration_seconds: 180 - timeRemaining,
      outputs,
      timestamp: new Date().toISOString()
    };

    try {
      const { error } = await (supabase.from('atoms') as any).insert({
        type: 'blackjack_session',
        val: logEntry
      });

      if (error) throw error;
      alert('✓ Protocol Atom Archived');
      setStage('ready');
    } catch (err) {
      console.error('Shipment Failed:', err);
      alert('⚠ Connection failure. Protocol atom lost.');
    } finally {
      setIsShipping(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-zinc-100 flex items-center gap-3">
              <Shield className="text-red-500" size={32} />
              BLACKJACK PROTOCOL
            </h1>
            <p className="text-zinc-500 mt-2 font-mono text-sm uppercase tracking-widest">
              Mechanics: Double Lift • Splintering • 21 Reps
            </p>
          </div>
          {stage === 'active' && (
            <div className={`text-4xl font-mono font-bold tabular-nums ${timeRemaining < 30 ? 'text-red-500 animate-pulse' : 'text-teal-500'}`}>
              {formatTime(timeRemaining)}
            </div>
          )}
        </div>

        {stage === 'ready' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center space-y-8 shadow-2xl">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500 mb-6">
                <Play size={40} fill="currentColor" />
              </div>
              <h2 className="text-2xl font-bold">Initialize Protocol</h2>
              <p className="text-zinc-400 leading-relaxed">
                You have 3 minutes to execute 21 Double Lifts. 
                Between movements, splinter one core idea into three distinct assets.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-left max-w-2xl mx-auto pt-8 border-t border-zinc-800">
              <div className="space-y-2">
                <div className="text-teal-500 font-bold flex items-center gap-2">
                  <Zap size={16} /> PHASE 1
                </div>
                <p className="text-xs text-zinc-500">21 Controlled Reps</p>
              </div>
              <div className="space-y-2">
                <div className="text-teal-500 font-bold flex items-center gap-2">
                  <Layers size={16} /> PHASE 2
                </div>
                <p className="text-xs text-zinc-500">Real-time Splintering</p>
              </div>
              <div className="space-y-2">
                <div className="text-teal-500 font-bold flex items-center gap-2">
                  <Shield size={16} /> PHASE 3
                </div>
                <p className="text-xs text-zinc-500">Atom Archival</p>
              </div>
            </div>

            <button 
              onClick={startProtocol}
              className="w-full max-w-sm py-4 bg-teal-600 hover:bg-teal-500 text-white font-black uppercase tracking-tighter rounded-xl transition-all shadow-lg shadow-teal-900/20"
            >
              Engage Protocol
            </button>
          </div>
        )}

        {stage === 'active' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Left: Rep Counter */}
            <div className="space-y-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden group">
                <div className="absolute inset-0 bg-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                
                <h3 className="text-zinc-500 font-mono text-xs uppercase tracking-widest mb-12">Movement Counter</h3>
                <div className="text-[120px] font-black leading-none tracking-tighter text-zinc-100 mb-4 tabular-nums">
                  {reps}
                </div>
                <div className="text-zinc-600 font-mono text-sm uppercase">
                  of {targetReps} reps
                </div>

                <button 
                  onClick={handleRep}
                  className="mt-12 w-full py-8 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 font-bold uppercase rounded-xl transition-all active:scale-95 shadow-xl"
                >
                  Confirm Movement (DL)
                </button>
              </div>
            </div>

            {/* Right: Splintering Area */}
            <div className="space-y-4">
              <h3 className="text-zinc-500 font-mono text-xs uppercase tracking-widest px-2">Splintering Station</h3>
              {SPLINTER_TASKS.map(task => (
                <div key={task.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-teal-500 text-sm font-bold uppercase tracking-tight">
                      {task.icon}
                      {task.label}
                    </div>
                    {outputs[task.id] && <CheckCircle2 size={14} className="text-emerald-500" />}
                  </div>
                  <textarea
                    placeholder={task.description}
                    value={outputs[task.id] || ''}
                    onChange={(e) => handleSplinterChange(task.id, e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-teal-900 min-h-[80px] resize-none font-sans"
                  />
                </div>
              ))}
              
              <button 
                onClick={() => setStage('complete')}
                className="w-full py-4 mt-4 bg-zinc-800 hover:bg-red-900/20 hover:text-red-400 text-zinc-500 font-bold border border-zinc-800 transition-all rounded-xl"
              >
                Abort Protocol
              </button>
            </div>
          </div>
        )}

        {stage === 'complete' && (
          <div className="max-w-2xl mx-auto space-y-8 animate-in zoom-in-95 duration-300">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center shadow-2xl">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-500 mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-3xl font-bold mb-4">Protocol Completed</h2>
              <div className="flex justify-center gap-8 mb-12">
                <div className="text-center">
                  <div className="text-2xl font-black text-zinc-100">{reps}</div>
                  <div className="text-xs text-zinc-500 font-mono uppercase tracking-wider">Reps</div>
                </div>
                <div className="text-center border-x border-zinc-800 px-8">
                  <div className="text-2xl font-black text-zinc-100">{formatTime(180 - timeRemaining)}</div>
                  <div className="text-xs text-zinc-500 font-mono uppercase tracking-wider">Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-zinc-100">{Object.keys(outputs).length}</div>
                  <div className="text-xs text-zinc-500 font-mono uppercase tracking-wider">Splinters</div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStage('ready')}
                  className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl transition-all"
                >
                  Discard
                </button>
                <button 
                  onClick={shipProtocol}
                  disabled={isShipping}
                  className="flex-[2] py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-tighter rounded-xl transition-all shadow-lg shadow-emerald-900/20"
                >
                  {isShipping ? 'Shipping...' : 'Archive Protocol Atom'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
