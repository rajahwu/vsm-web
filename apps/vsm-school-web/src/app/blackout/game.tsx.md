import { useState, useCallback } from 'react';
import { GameState, EntityId } from './types/game';
import { storyNodes, initialEntities, initialDeck } from './data/story';
import { EntityPanel } from './components/EntityPanel';
import { Card } from './components/Card';
import { NarrativePanel } from './components/NarrativePanel';

function App() {
  const [gameState, setGameState] = useState<GameState>(() => ({
    currentNodeId: 'opening',
    entities: { ...initialEntities },
    shellIntegrity: 60,
    deck: [...initialDeck],
    hand: initialDeck.slice(0, 4),
    discard: [],
    history: ['opening'],
  }));

  const currentNode = storyNodes[gameState.currentNodeId];

  const handleChoice = useCallback((choiceId: string) => {
    const choice = currentNode.choices?.find(c => c.id === choiceId);
    if (!choice) return;

    const nextNode = storyNodes[choice.nextNodeId];
    
    setGameState(prev => {
      const newEntities = { ...prev.entities };
      
      // Apply status updates from the next node
      if (nextNode.statusUpdates) {
        for (const [entityId, updates] of Object.entries(nextNode.statusUpdates)) {
          if (newEntities[entityId as EntityId]) {
            newEntities[entityId as EntityId] = {
              ...newEntities[entityId as EntityId],
              ...updates,
            };
          }
        }
      }

      return {
        ...prev,
        currentNodeId: choice.nextNodeId,
        entities: newEntities,
        history: [...prev.history, choice.nextNodeId],
      };
    });
  }, [currentNode]);

  const handleRestart = useCallback(() => {
    setGameState({
      currentNodeId: 'opening',
      entities: { ...initialEntities },
      shellIntegrity: 60,
      deck: [...initialDeck],
      hand: initialDeck.slice(0, 4),
      discard: [],
      history: ['opening'],
    });
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #0f0f1a 50%, #0a0a0f 100%)',
      padding: '20px',
    }}>
      {/* Header */}
      <header style={{
        textAlign: 'center',
        marginBottom: '24px',
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#ef4444',
          letterSpacing: '4px',
          margin: 0,
        }}>
          PROTOCOL: BLACKOUT
        </h1>
        <div style={{
          fontSize: '0.7rem',
          color: '#666',
          letterSpacing: '2px',
          marginTop: '4px',
        }}>
          RADIANT SEVEN INTERACTIVE FICTION
        </div>
      </header>

      {/* Main layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '200px 1fr 200px',
        gap: '20px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        {/* Left panel - Entities */}
        <aside>
          <div style={{
            fontSize: '0.7rem',
            color: '#666',
            letterSpacing: '2px',
            marginBottom: '12px',
          }}>
            ENTITY STATUS
          </div>
          {Object.values(gameState.entities).map(entity => (
            <EntityPanel key={entity.id} entity={entity} />
          ))}
          
          {/* Shell integrity */}
          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: '#1a1a2e',
            border: '1px solid #333',
            borderRadius: '8px',
          }}>
            <div style={{
              fontSize: '0.7rem',
              color: '#666',
              letterSpacing: '1px',
              marginBottom: '8px',
            }}>
              SHELL INTEGRITY
            </div>
            <div style={{
              height: '8px',
              background: '#333',
              borderRadius: '4px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${gameState.shellIntegrity}%`,
                background: gameState.shellIntegrity > 30 ? '#60a5fa' : '#ef4444',
                transition: 'width 0.5s ease',
              }} />
            </div>
            <div style={{
              textAlign: 'right',
              fontSize: '0.8rem',
              color: gameState.shellIntegrity > 30 ? '#60a5fa' : '#ef4444',
              marginTop: '4px',
            }}>
              {gameState.shellIntegrity}%
            </div>
          </div>
        </aside>

        {/* Center - Narrative */}
        <main>
          <NarrativePanel
            node={currentNode}
            onChoice={handleChoice}
            onRestart={handleRestart}
          />
        </main>

        {/* Right panel - Cards */}
        <aside>
          <div style={{
            fontSize: '0.7rem',
            color: '#666',
            letterSpacing: '2px',
            marginBottom: '12px',
          }}>
            HAND
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            {gameState.hand.map(card => (
              <Card key={card.id} card={card} />
            ))}
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        marginTop: '40px',
        padding: '20px',
        borderTop: '1px solid #222',
      }}>
        <div style={{
          fontSize: '0.65rem',
          color: '#444',
          letterSpacing: '1px',
        }}>
          THE SOURCE REMAINS HIDDEN • THE COMMUNION HOLDS
        </div>
      </footer>
    </div>
  );
}

export default App;
