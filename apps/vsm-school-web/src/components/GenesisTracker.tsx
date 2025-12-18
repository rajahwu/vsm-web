'use client';

import React, { useState } from 'react';
import { GENESIS_REQUIREMENTS } from '../data/GenesisCurriculum';

export function GenesisTracker() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    const next = new Set(completed);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setCompleted(next);
  };

  const progress = Math.round((completed.size / GENESIS_REQUIREMENTS.length) * 100);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8 bg-black/5 rounded-xl border border-black/10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Genesis Curriculum</h2>
        <div className="text-sm font-mono text-gray-500">{progress}% LITERATE</div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="grid gap-4">
        {GENESIS_REQUIREMENTS.map((req) => (
          <div 
            key={req.id}
            onClick={() => toggle(req.id)}
            className={`
              group flex items-start p-4 rounded-lg border cursor-pointer transition-all duration-200
              ${completed.has(req.id) 
                ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                : 'bg-white border-gray-200 hover:border-indigo-300 hover:shadow-md'}
            `}
          >
            <div className={`
              flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md font-mono text-lg font-bold mr-4
              ${completed.has(req.id) ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}
            `}>
              {req.symbol}
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className={`font-medium ${completed.has(req.id) ? 'text-indigo-900' : 'text-gray-900'}`}>
                  {req.title}
                </h3>
                <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">{req.category}</span>
              </div>
              <p className={`text-sm mt-1 ${completed.has(req.id) ? 'text-indigo-700' : 'text-gray-500'}`}>
                {req.drill}
              </p>
            </div>

            <div className="ml-4 flex h-6 w-6 items-center justify-center">
              <input
                type="checkbox"
                checked={completed.has(req.id)}
                readOnly
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
