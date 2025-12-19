'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase/client';
import styles from './training.module.css';
import { useAtoms } from '@/hooks/useAtoms';
import { missionRegistry, TrainingWindowId, TrainingBlock } from '@/lib/mission-registry';

// --- TYPES ---
type View = 'timeWindow' | 'block' | 'page' | 'completion';
type BlockItem = TrainingBlock;

export default function VSMTrainer() {
  const windows = missionRegistry.trainingWindows;
  const windowMap = useMemo(() => {
    return windows.reduce<Record<TrainingWindowId, { duration: number; items: TrainingBlock[] }>>((acc, win) => {
      acc[win.id] = { duration: win.durationMinutes, items: win.blocks };
      return acc;
    }, {} as Record<TrainingWindowId, { duration: number; items: TrainingBlock[] }>);
  }, [windows]);

  const [view, setView] = useState<View>('timeWindow');
  const [currentWindow, setCurrentWindow] = useState<TrainingWindowId | null>(null);
  const [currentBlock, setCurrentBlock] = useState<TrainingBlock | null>(null);
  const { atoms, refresh } = useAtoms('vsm_session');

  // Session State
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [isShipping, setIsShipping] = useState(false);

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

  const selectTimeWindow = (window: TrainingWindowId) => {
    setCurrentWindow(window);
    setTimeRemaining((windowMap[window]?.duration ?? 0) * 60);
    setView('block');
  };

  const selectBlock = (block: BlockItem) => { setCurrentBlock(block); };

  const confirmBlockSelection = () => {
    if (!currentBlock) return;
    setCurrentCardIndex(0);
    setCardFlipped(false);
    setSessionStartTime(Date.now());
    setIsActive(true);
    setView('page');
  };

  const flipCard = () => setCardFlipped(!cardFlipped);

  const nextCard = () => {
    if (currentBlock && currentCardIndex < currentBlock.cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setCardFlipped(false);
    }
  };

  const completeSession = () => { setIsActive(false); setView('completion'); };

  const restart = () => {
    setCurrentWindow(null); setCurrentBlock(null); setCurrentCardIndex(0);
    setCardFlipped(false); setIsActive(false); setView('timeWindow');
  };

  const shipToShell = async () => {
    if (!currentBlock || !currentWindow) return;
    setIsShipping(true);

    const activeCard = currentBlock.cards[currentCardIndex] ?? null;
    const logEntry = {
      trackId: currentWindow,
      cardId: `${currentBlock.id}-${currentCardIndex + 1}`,
      outputSummary: activeCard?.back ?? 'Session completed',
      block_id: currentBlock.id,
      block_title: currentBlock.title,
      window_type: currentWindow,
      cards_completed: currentCardIndex + 1,
      duration_seconds: sessionStartTime ? Math.floor((Date.now() - sessionStartTime) / 1000) : 0,
      timestamp: new Date().toISOString(),
      card_snapshot: activeCard
    };

    try {
      const { error } = await supabase.from('atoms').insert({
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

  return (
    <div className={styles.dojoContainer}>
      <div style={{ marginBottom: '2rem', color: 'var(--color-teal-500)', fontWeight: 'bold' }}>
        VSM TRAINING // {view.toUpperCase()}
      </div>

      {view === 'timeWindow' && (
        <div className={styles.selectionView}>
          <h1>Choose Your Intensity</h1>
          <div className={styles.windowGrid}>
            {(Object.keys(windowMap) as TrainingWindowId[]).map((key) => (
              <div key={key}
                className={`${styles.windowCard} ${currentWindow === key ? styles.selected : ''}`}
                onClick={() => selectTimeWindow(key)}
              >
                <h3>{key.toUpperCase()}</h3>
                <div className={styles.duration}>{windowMap[key]?.duration ?? 0} min</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'block' && currentWindow && (
        <div className={styles.blockView}>
          <h2>Select Drill Protocol</h2>
          <div id="blocksContainer">
            {windowMap[currentWindow]?.items.map((block) => (
              <div key={block.id}
                className={`${styles.blockDescription} ${currentBlock?.id === block.id ? styles.selected : ''}`}
                onClick={() => selectBlock(block)}
              >
                <h3>{block.title}</h3>
                <p>{block.theme}</p>
              </div>
            ))}
          </div>
          <button className={styles.primaryBtn} onClick={confirmBlockSelection} disabled={!currentBlock}>
            ENGAGE
          </button>
        </div>
      )}

      {view === 'page' && currentBlock && (
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
                  <p className={styles.scenario}>{currentBlock.cards[currentCardIndex].front}</p>
                </div>
              ) : (
                <div className={styles.cardBack}>
                  <h3>ACTION</h3>
                  <div className={styles.action}>{currentBlock.cards[currentCardIndex].back}</div>
                </div>
              )}
              <div className={styles.cardNav}>
                <button className={styles.secondaryBtn} onClick={flipCard}>FLIP</button>
                <span className={styles.cardCounter}>{currentCardIndex + 1} / {currentBlock.cards.length}</span>
                <button className={styles.secondaryBtn} onClick={nextCard} disabled={currentCardIndex === currentBlock.cards.length - 1}>
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
