'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import styles from './blackjack.module.css'; // We keep the CSS file for now

// --- TYPES ---
type VSMCard = { front: string; back: string; };
type Skill = { name: string; description: string; };
type BlockItem = {
  id: string; title: string; theme: string;
  skills: { physical: Skill; mental: Skill; };
  cards: VSMCard[];
};
type WindowType = 'sprint' | 'standard' | 'grind';

// --- DATA (The Curriculum) ---
const blocks: Record<WindowType, { duration: number; items: BlockItem[] }> = {
  sprint: {
    duration: 10,
    items: [
      {
        id: 'control-001',
        title: 'Control the Deck, Release the Draft',
        theme: 'Hands + Brain Sync',
        skills: {
          physical: { name: 'Overhand Shuffle Control', description: 'Keep top card intact.' },
          mental: { name: 'Ugly First Draft (TUFD)', description: 'Embrace imperfect output.' }
        },
        cards: [
          { front: 'Scenario: Describe this room as a crime scene.', back: 'Action: Shuffle 3x. Write 3 min.' },
          { front: 'Scenario: Describe it as a sanctuary.', back: 'Action: Palm card. Write 3 min.' },
          { front: 'Scenario: Combine both perspectives.', back: 'Action: Riffle shuffle. Synthesize.' }
        ]
      }
    ]
  },
  standard: {
    duration: 25,
    items: [
      {
        id: 'interlock-002',
        title: 'The Interlock: Plan Before You Ink',
        theme: 'Structure + Clarity',
        skills: {
          physical: { name: 'Riffle Shuffle', description: 'Perfect distribution.' },
          mental: { name: 'Outlining', description: 'Structure before flesh.' }
        },
        cards: [
          { front: 'Scenario: Explain Drop Frame to a novice.', back: 'Action: Write headers only.' },
          { front: 'Scenario: Single most important thing?', back: 'Action: Thesis statement.' },
          { front: 'Scenario: How to teach this?', back: 'Action: Numbered steps 1-5.' }
        ]
      }
    ]
  },
  grind: {
    duration: 45,
    items: [
      {
        id: 'hidden-003',
        title: 'The Hidden Move',
        theme: 'Subtlety',
        skills: {
          physical: { name: 'The Glide', description: 'Invisible control.' },
          mental: { name: 'You-Focused Writing', description: 'Hide the ego.' }
        },
        cards: [
          { front: 'Scenario: Selling to a skeptical prospect.', back: 'Action: Rewrite from THEIR perspective.' },
          { front: 'Scenario: 5 Value Props.', back: 'Action: Deal bottom card. Replace "We" with "You".' },
          { front: 'Scenario: Pick the strongest.', back: 'Action: Circle it. Copy the pattern.' }
        ]
      }
    ]
  }
};

type View = 'timeWindow' | 'block' | 'page' | 'completion';

export default function VSMTrainer() {
  const [view, setView] = useState<View>('timeWindow');
  const [currentWindow, setCurrentWindow] = useState<WindowType | null>(null);
  const [currentBlock, setCurrentBlock] = useState<BlockItem | null>(null);
  
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

  // --- NAVIGATION ---
  const selectTimeWindow = (window: WindowType) => {
    setCurrentWindow(window);
    setTimeRemaining(blocks[window].duration * 60);
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

  // --- DATABASE WRITE (The Memory) ---
  const shipToShell = async () => {
    if (!currentBlock || !currentWindow) return;
    setIsShipping(true);

    const logEntry = {
      block_id: currentBlock.id,
      block_title: currentBlock.title,
      window_type: currentWindow,
      cards_completed: currentCardIndex + 1,
      duration_seconds: sessionStartTime ? Math.floor((Date.now() - sessionStartTime) / 1000) : 0,
      timestamp: new Date().toISOString()
    };

    try {
      // 1. Write to Supabase
      const { error } = await supabase.from('atoms').insert({
        type: 'vsm_session',
        val: logEntry
      });

      if (error) throw error;

      // 2. Feedback
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
      {/* HEADER */}
      <div style={{position: 'absolute', top: 20, left: 20, color: 'var(--color-teal-500)', fontWeight: 'bold'}}>
        VSM TRAINING // {view.toUpperCase()}
      </div>

      {/* VIEW 1: TIME WINDOW */}
      {view === 'timeWindow' && (
        <div className={styles.selectionView}>
          <h1>Choose Your Intensity</h1>
          <div className={styles.windowGrid}>
            {(Object.keys(blocks) as WindowType[]).map((key) => (
              <div key={key} 
                className={`${styles.windowCard} ${currentWindow === key ? styles.selected : ''}`}
                onClick={() => selectTimeWindow(key)}
              >
                <h3>{key.toUpperCase()}</h3>
                <div className={styles.duration}>{blocks[key].duration} min</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: BLOCK SELECT */}
      {view === 'block' && currentWindow && (
        <div className={styles.blockView}>
          <h2>Select Drill Protocol</h2>
          <div id="blocksContainer">
            {blocks[currentWindow].items.map((block) => (
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

      {/* VIEW 3: ACTIVE DRILL */}
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

      {/* VIEW 4: COMPLETION */}
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
    </div>
  );
}
