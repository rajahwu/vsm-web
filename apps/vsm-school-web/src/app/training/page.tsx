'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import styles from './training.module.css';
import { useAtoms } from '@/hooks/useAtoms';
import { useTrainingWindows, useTrainingBlocks, useTrainingCards, TrainingBlockRow, TrainingCardRow } from '@gttm/mission';
import type { TypedSupabaseClient } from '@rsys-os/data';

// Cast for type safety if needed, though client.ts should already return it
const db = supabase as TypedSupabaseClient;

// --- TYPES ---
type View = 'timeWindow' | 'block' | 'page' | 'completion';

export default function VSMTrainer() {
  // Data Hooks
  const { data: windows, isLoading: windowsLoading } = useTrainingWindows(supabase);
  const [currentWindowId, setCurrentWindowId] = useState<string | null>(null);
  
  // Fetch blocks only when window is selected
  const { data: blocks, isLoading: blocksLoading } = useTrainingBlocks(supabase, currentWindowId ?? undefined);
  
  const [currentBlock, setCurrentBlock] = useState<TrainingBlockRow | null>(null);
  
  // Fetch cards only when block is selected
  const { data: cards, isLoading: cardsLoading } = useTrainingCards(supabase, currentBlock?.id);

  const [view, setView] = useState<View>('timeWindow');
  const { atoms, refresh } = useAtoms('vsm_session');

  // Session State
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [isShipping, setIsShipping] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Persistence Key
  const PERSISTENCE_KEY = 'vsm_trainer_session';

  // Restore State
  useEffect(() => {
    const saved = localStorage.getItem(PERSISTENCE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.currentWindowId) setCurrentWindowId(data.currentWindowId);
        if (data.currentBlock) setCurrentBlock(data.currentBlock);
        if (data.view) setView(data.view);
        if (data.currentCardIndex) setCurrentCardIndex(data.currentCardIndex);
        if (data.timeRemaining) setTimeRemaining(data.timeRemaining);
        if (data.isActive) setIsActive(data.isActive);
        if (data.sessionStartTime) setSessionStartTime(data.sessionStartTime);
      } catch (e) {
        console.error('Failed to restore trainer session:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save State
  useEffect(() => {
    if (isLoaded) {
      const stateToSave = {
        currentWindowId,
        currentBlock,
        view,
        currentCardIndex,
        timeRemaining,
        isActive,
        sessionStartTime
      };
      localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(stateToSave));
    }
  }, [isLoaded, currentWindowId, currentBlock, view, currentCardIndex, timeRemaining, isActive, sessionStartTime]);

  // Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) { completeSession(); return 0; }
          return prev - 1;
        });
      }, 1000);
    } else if (timeRemaining === 0 && isActive) { completeSession(); }
    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  const selectTimeWindow = (windowId: string, duration: number) => {
    setCurrentWindowId(windowId);
    setTimeRemaining(duration * 60);
    setView('block');
  };

  const selectBlock = (block: TrainingBlockRow) => { setCurrentBlock(block); };

  const confirmBlockSelection = () => {
    if (!currentBlock) return;
    // Wait for cards to load? They should be loading as soon as block is set.
    // We might need a check here or disable the button until cards are ready.
    if (cardsLoading || !cards || cards.length === 0) return;
    
    setCurrentCardIndex(0);
    setCardFlipped(false);
    setSessionStartTime(Date.now());
    setIsActive(true);
    setView('page');
  };

  const flipCard = () => setCardFlipped(!cardFlipped);

  const nextCard = () => {
    if (cards && currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setCardFlipped(false);
    }
  };

  const completeSession = () => { setIsActive(false); setView('completion'); };

  const restart = () => {
    localStorage.removeItem(PERSISTENCE_KEY);
    setCurrentWindowId(null); setCurrentBlock(null); setCurrentCardIndex(0);
    setCardFlipped(false); setIsActive(false); setView('timeWindow');
  };

  const shipToShell = async () => {
    if (!currentBlock || !currentWindowId || !cards) return;
    setIsShipping(true);

    const activeCard = cards[currentCardIndex] ?? null;
    const logEntry = {
      trackId: currentWindowId,
      cardId: activeCard ? activeCard.id : 'unknown',
      outputSummary: activeCard?.back_text ?? 'Session completed',
      block_id: currentBlock.id,
      block_title: currentBlock.title,
      window_type: currentWindowId, // This is technically the window_type string (e.g. 'sprint')
      cards_completed: currentCardIndex + 1,
      duration_seconds: sessionStartTime ? Math.floor((Date.now() - sessionStartTime) / 1000) : 0,
      timestamp: new Date().toISOString(),
      card_snapshot: activeCard
    };

    try {
      const { error } = await (db.from('atoms') as any).insert({
        type: 'vsm_session',
        val: logEntry
      });

      if (error) throw error;

      await refresh(); // Refresh list AFTER successful insert
      alert('✓ Atom Locked in Core Memory');
      restart();
    } catch (err) {
      console.error('Shipment Failed:', err);
      alert('⚠ Connection Lost. Could not ship atom.');
    } finally {
      setIsShipping(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (windowsLoading) {
    return <div className="flex h-screen items-center justify-center text-teal-500">Initializing VSM Protocols...</div>;
  }

  return (
    <div className={styles.dojoContainer}>
      <div style={{ marginBottom: '2rem', color: 'var(--color-teal-500)', fontWeight: 'bold' }}>
        VSM TRAINING // {view.toUpperCase()}
      </div>

      {view === 'timeWindow' && windows && (
        <div className={styles.selectionView}>
          <h1>Choose Your Intensity</h1>
          <div className={styles.windowGrid}>
            {windows.map((win) => (
              <div key={win.id}
                className={`${styles.windowCard} ${currentWindowId === win.window_type ? styles.selected : ''}`}
                onClick={() => selectTimeWindow(win.window_type, win.duration_minutes)}
              >
                <h3>{win.display_name.toUpperCase()}</h3>
                <div className={styles.duration}>{win.duration_minutes} min</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'block' && currentWindowId && (
        <div className={styles.blockView}>
          <h2>Select Drill Protocol</h2>
          {blocksLoading ? <p>Loading Blocks...</p> : (
            <div id="blocksContainer">
              {blocks?.map((block) => (
                <div key={block.id}
                  className={`${styles.blockDescription} ${currentBlock?.id === block.id ? styles.selected : ''}`}
                  onClick={() => selectBlock(block)}
                >
                  <h3>{block.title}</h3>
                  <p>{block.theme}</p>
                </div>
              ))}
            </div>
          )}
          <button 
            className={styles.primaryBtn} 
            onClick={confirmBlockSelection} 
            disabled={!currentBlock || cardsLoading || !cards || cards.length === 0}
          >
            {cardsLoading ? 'LOADING CARDS...' : 'ENGAGE'}
          </button>
        </div>
      )}

      {view === 'page' && currentBlock && cards && (
        <div className={styles.pageView}>
          <div className={styles.pageHeader}>
            <span>{currentBlock.title}</span>
            <div className={styles.timer}>{formatTime(timeRemaining)}</div>
          </div>
          <div className={styles.pageBody}>
            <div className={styles.cardContent}>
              {!cardFlipped ? (
                <div className={styles.cardFront}>
                  <h3>SCENARIO</h3>
                  <p className={styles.scenario}>{cards[currentCardIndex].front_text}</p>
                </div>
              ) : (
                <div className={styles.cardBack}>
                  <h3>ACTION</h3>
                  <div className={styles.action}>{cards[currentCardIndex].back_text}</div>
                </div>
              )}
              <div className={styles.cardNav}>
                <button className={styles.secondaryBtn} onClick={flipCard}>FLIP</button>
                <span className={styles.cardCounter}>{currentCardIndex + 1} / {cards.length}</span>
                <button className={styles.secondaryBtn} onClick={nextCard} disabled={currentCardIndex === cards.length - 1}>
                  NEXT
                </button>
              </div>
            </div>
          </div>
          <button className={styles.primaryBtn} onClick={completeSession}>COMPLETE</button>
        </div>
      )}

      {view === 'completion' && (
        <div className={styles.completionView}>
          <div className={styles.completionCheck}>✓</div>
          <h2>Protocol Complete</h2>
          <div className={styles.completionButtons}>
            <button className={styles.secondaryBtn} onClick={restart}>DISCARD</button>
            <button className={styles.primaryBtn} onClick={shipToShell} disabled={isShipping}>
              {isShipping ? 'SHIPPING...' : 'SHIP TO SHELL'}
            </button>
          </div>
        </div>
      )}

      {/* SESSION HISTORY (Added to the bottom of the container) */}
      <div className="mt-12 pt-12 border-t border-zinc-800 w-full max-w-4xl">
        <h3 className="text-xl font-bold text-zinc-500 mb-6">Session History (Atoms)</h3>
        <div className="space-y-4">
          {atoms.map((atom) => (
            <div key={atom.id} className="p-4 bg-zinc-900/50 border border-zinc-800 rounded flex justify-between items-center">
              <div>
                <div className="text-teal-400 font-mono text-sm">{atom.val.block_title}</div>
                <div className="text-zinc-500 text-xs mt-1">
                  {new Date(atom.created_at).toLocaleDateString()} • {atom.val.cards_completed} Cards • {atom.val.duration_seconds}s
                </div>
              </div>
              <div className="text-zinc-600 font-mono text-xs tracking-widest uppercase">
                {atom.val.window_type}
              </div>
            </div>
          ))}
          {atoms.length === 0 && <div className="text-zinc-600 italic">No atoms in core memory.</div>}
        </div>
      </div>
    </div>
  );
}
