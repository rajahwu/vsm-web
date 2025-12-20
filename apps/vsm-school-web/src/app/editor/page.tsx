'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Save,
  Eye,
  Code,
  Layers,
  FileText,
  Trash2,
  Download,
  Upload
} from 'lucide-react';
import {
  Button,
  Label,
  Switch,
  Slider,
  cn
} from '@ritual/components';
import { MarkdownRenderer } from '@gttm/components';

/* =========================
   Mission Card Editor
   Purpose: Authoring training blocks and cards.
   ========================= */

interface DraftCard {
  id: string;
  title: string;
  front: string;
  back: string;
}

interface DraftBlock {
  id: string;
  title: string;
  theme: string;
  cards: DraftCard[];
}

export default function MissionEditor() {
  const [block, setBlock] = useState<DraftBlock>({
    id: 'new-block-001',
    title: 'Untitled Block',
    theme: 'Core focus area',
    cards: [
      { id: '1', title: 'Card 1', front: 'Scenario text...', back: 'Action protocol...' }
    ]
  });

  const [activeCardId, setActiveCardId] = useState<string>('1');
  const [showPreview, setShowPreview] = useState(false);

  const activeCard = block.cards.find(c => c.id === activeCardId) || block.cards[0];

  const updateActiveCard = (changes: Partial<DraftCard>) => {
    setBlock(prev => ({
      ...prev,
      cards: prev.cards.map(c => c.id === activeCardId ? { ...c, ...changes } : c)
    }));
  };

  const addCard = () => {
    const newId = (block.cards.length + 1).toString();
    const newCard: DraftCard = {
      id: newId,
      title: `Card ${newId}`,
      front: '',
      back: ''
    };
    setBlock(prev => ({
      ...prev,
      cards: [...prev.cards, newCard]
    }));
    setActiveCardId(newId);
  };

  const deleteCard = (id: string) => {
    if (block.cards.length <= 1) return;
    setBlock(prev => ({
      ...prev,
      cards: prev.cards.filter(c => c.id !== id)
    }));
    if (activeCardId === id) {
      setActiveCardId(block.cards[0].id);
    }
  };

  const exportBlock = () => {
    const data = JSON.stringify(block, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${block.id}.json`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Top Bar */}
      <header className="border-b border-zinc-900 px-6 py-4 flex items-center justify-between bg-zinc-900/50">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-teal-600 rounded flex items-center justify-center font-bold text-white">
            <FileText size={18} />
          </div>
          <div>
            <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-100">Card Editor</h1>
            <p className="text-[10px] text-zinc-500 font-mono">VSM_CONTENT_AUTHORING_v1</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setShowPreview(!showPreview)}>
            {showPreview ? <Code className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
            {showPreview ? 'Edit' : 'Preview'}
          </Button>
          <Button variant="outline" size="sm" onClick={exportBlock}>
            <Download className="mr-2 h-4 w-4" /> Export JSON
          </Button>
          <Button size="sm" className="bg-teal-600 hover:bg-teal-500">
            <Save className="mr-2 h-4 w-4" /> Save to Core
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar: Card List */}
        <aside className="w-64 border-r border-zinc-900 bg-zinc-950 flex flex-col">
          <div className="p-4 border-b border-zinc-900">
            <h2 className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-4">Cards</h2>
            <Button variant="outline" size="sm" className="w-full justify-start border-dashed" onClick={addCard}>
              <Plus className="mr-2 h-4 w-4" /> Add Card
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {block.cards.map(c => (
              <div 
                key={c.id}
                onClick={() => setActiveCardId(c.id)}
                className={cn(
                  "group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all",
                  activeCardId === c.id ? "bg-teal-900/20 border border-teal-900/50" : "hover:bg-zinc-900 border border-transparent"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    activeCardId === c.id ? "bg-teal-500" : "bg-zinc-800"
                  )} />
                  <span className={cn(
                    "text-xs truncate",
                    activeCardId === c.id ? "text-teal-400 font-bold" : "text-zinc-500"
                  )}>{c.title}</span>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteCard(c.id); }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-500 transition-all"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Editor */}
        <main className="flex-1 overflow-y-auto bg-zinc-900/20 p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Block Info */}
            <section className="space-y-4 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
              <h3 className="text-xs font-mono text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                <Layers size={14} /> Block Metadata
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs">Block Code</Label>
                  <input 
                    value={block.id}
                    onChange={(e) => setBlock(prev => ({ ...prev, id: e.target.value }))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm focus:border-teal-900 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Display Title</Label>
                  <input 
                    value={block.title}
                    onChange={(e) => setBlock(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm focus:border-teal-900 outline-none"
                  />
                </div>
              </div>
            </section>

            {/* Active Card Editor */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <h3 className="text-lg font-bold text-teal-500">Edit: {activeCard.title}</h3>
                <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                  Card_UID: {activeCard.id}
                </div>
              </div>

              {showPreview ? (
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <Label className="text-zinc-500 uppercase text-[10px] tracking-widest font-mono">Front (Scenario)</Label>
                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-8 min-h-[300px]">
                      <MarkdownRenderer content={activeCard.front || '_No content_'} />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Label className="text-zinc-500 uppercase text-[10px] tracking-widest font-mono">Back (Protocol)</Label>
                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-8 min-h-[300px]">
                      <MarkdownRenderer content={activeCard.back || '_No content_'} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-8">
                  <div className="space-y-3">
                    <Label className="text-xs">Card Title</Label>
                    <input 
                      value={activeCard.title}
                      onChange={(e) => updateActiveCard({ title: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm font-bold focus:border-teal-900 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-xs">Front (Scenario Markdown)</Label>
                      <textarea 
                        value={activeCard.front}
                        onChange={(e) => updateActiveCard({ front: e.target.value })}
                        rows={12}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-sm font-mono focus:border-teal-900 outline-none resize-none"
                        placeholder="# Heading\nScenario details..."
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs">Back (Action Protocol Markdown)</Label>
                      <textarea 
                        value={activeCard.back}
                        onChange={(e) => updateActiveCard({ back: e.target.value })}
                        rows={12}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-sm font-mono focus:border-teal-900 outline-none resize-none"
                        placeholder="1. Step one\n2. Step two..."
                      />
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
