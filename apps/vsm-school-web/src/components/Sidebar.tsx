import Link from 'next/link';

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-zinc-950 border-r border-zinc-900 flex flex-col">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-zinc-900">
        <div className="w-3 h-3 bg-emerald-500 rounded-sm mr-3" />
        <span className="font-heading tracking-wider text-zinc-100 font-medium">
          RITUAL<span className="text-zinc-600">HUB</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-2 px-2">
          Operations
        </div>
        
        <NavLink href="/tracker" label="Cycle Tracker" icon="⚡" />
        <NavLink href="/blackout" label="Blackout Protocol" icon="⚫" />
        <NavLink href="/genesis" label="Genesis Curriculum" icon="📚" />
        <NavLink href="/editor" label="Ritual Workbook" icon="📝" />
        <NavLink href="/training" label="VSM Trainer" icon="🃏" />
        <NavLink href="/mission" label="Mission Surface" icon="🛰️" />
      </nav>

      {/* Footer Status */}
      <div className="p-4 border-t border-zinc-900">
        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-600">
          <span>VER 0.1.0</span>
          <span className="text-emerald-500">SIGNAL CLEAR</span>
        </div>
      </div>
    </aside>
  );
}

function NavLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors"
    >
      <span className="opacity-70">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
