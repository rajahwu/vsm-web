export const VSMCheckbook = () => {
  const tasks = [
    { id: 'pulse', label: 'Pulse Check (Time Window)', track: 'Ritual' },
    { id: 'prime', label: 'Genesis Prime (Visual Primitives)', track: 'Genesis' },
    { id: 'mission', label: 'Mission Execution (Card Drill)', track: 'Powerhouse' },
    { id: 'ship', label: 'Artifact Ship (Markdown/Log)', track: 'Grindline' },
    { id: 'aar', label: 'AAR Closure (4-Pillar Review)', track: 'Org Learning' },
  ];

  return (
    <div className="vsm-checkbook p-4 bg-zinc-950 border border-zinc-800 rounded-lg">
      <h3 className="text-primary-glow text-xs uppercase tracking-tighter mb-4">VSM Daily Checkbook</h3>
      <ul className="space-y-3">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center gap-3">
            <input type="checkbox" className="w-4 h-4 rounded border-zinc-700 bg-black text-primary-glow" />
            <span className="text-zinc-300 text-sm">{task.label}</span>
            <span className="ml-auto text-[10px] text-zinc-600 uppercase italic">{task.track}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
