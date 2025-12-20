'use client';

import Link from 'next/link';
import { SettingsDialog, Button, cn } from '@ritual/components';
import { useRitualSound } from '@ritual/ui-lib';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { 
  ChevronLeft, 
  ChevronRight, 
  Moon, 
  Sun,
  Activity,
  Zap,
  BookOpen,
  Layout,
  Dribbble,
  Settings as SettingsIcon
} from 'lucide-react';

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('vsm_sidebar_collapsed');
    if (saved) setIsCollapsed(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('vsm_sidebar_collapsed', JSON.stringify(isCollapsed));
    }
  }, [isCollapsed, mounted]);

  const { volume, setVolume, isMuted, setIsMuted } = useRitualSound({
    phaseId: 'plan',
    isRunning: false
  });

  const [autoStart, setAutoStart] = useState(false);

  if (!mounted) return null;

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-zinc-950 border-r border-zinc-900 flex flex-col transition-all duration-300 z-50",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className={cn(
        "h-16 flex items-center border-b border-zinc-900 transition-all",
        isCollapsed ? "justify-center px-0" : "px-6"
      )}>
        <div className="w-3 h-3 bg-emerald-500 rounded-sm shrink-0" />
        {!isCollapsed && (
          <span className="font-heading tracking-wider text-zinc-100 font-medium ml-3 animate-in fade-in duration-500">
            RITUAL<span className="text-zinc-600">HUB</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto no-scrollbar">
        {!isCollapsed && (
          <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-4 px-2 animate-in fade-in duration-500">
            Operations
          </div>
        )}
        
        <NavLink href="/tracker" label="Cycle Tracker" icon={<Activity size={18} />} collapsed={isCollapsed} />
        <NavLink href="/blackout" label="Blackout Protocol" icon={<Zap size={18} />} collapsed={isCollapsed} />
        <NavLink href="/blackjack" label="Blackout Blackjack" icon={<Dribbble size={18} />} collapsed={isCollapsed} />
        <NavLink href="/genesis" label="Genesis Curriculum" icon={<BookOpen size={18} />} collapsed={isCollapsed} />
        <NavLink href="/workbook" label="Workbook Station" icon={<Layout size={18} />} collapsed={isCollapsed} />
        <NavLink href="/training" label="VSM Trainer" icon={<Activity size={18} />} collapsed={isCollapsed} />
        <NavLink href="/mission" label="Mission Surface" icon={<Zap size={18} />} collapsed={isCollapsed} />
        <NavLink href="/editor" label="Card Editor" icon={<SettingsIcon size={18} />} collapsed={isCollapsed} />
      </nav>

      {/* Footer Controls */}
      <div className="p-4 border-t border-zinc-900 space-y-4">
        <div className={cn(
          "flex items-center gap-2",
          isCollapsed ? "flex-col" : "justify-between px-2"
        )}>
          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-zinc-500 hover:text-zinc-100"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </Button>

          {/* Settings */}
          <SettingsDialog 
            volume={volume}
            onVolumeChange={setVolume}
            isMuted={isMuted}
            onMutedChange={setIsMuted}
            autoStart={autoStart}
            onAutoStartChange={setAutoStart}
            trigger={
              <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-zinc-100">
                <SettingsIcon size={18} />
              </Button>
            }
          />

          {/* Collapse Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-zinc-500 hover:text-zinc-100"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>
        </div>

        {!isCollapsed && (
          <div className="flex items-center justify-between px-2 text-[10px] font-mono text-zinc-600 animate-in fade-in duration-500">
            <span>VER 0.1.0</span>
            <span className="text-emerald-500">ONLINE</span>
          </div>
        )}
      </div>
    </aside>
  );
}

function NavLink({ 
  href, 
  label, 
  icon, 
  collapsed 
}: { 
  href: string; 
  label: string; 
  icon: React.ReactNode;
  collapsed: boolean;
}) {
  return (
    <Link 
      href={href} 
      className={cn(
        "flex items-center gap-3 rounded-lg text-sm transition-all duration-200 group",
        collapsed ? "justify-center p-2" : "px-3 py-2.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
      )}
      title={collapsed ? label : undefined}
    >
      <span className={cn(
        "shrink-0 transition-colors",
        collapsed ? "text-zinc-500 group-hover:text-emerald-500" : "opacity-70 group-hover:opacity-100"
      )}>
        {icon}
      </span>
      {!collapsed && (
        <span className="truncate animate-in slide-in-from-left-2 duration-300">
          {label}
        </span>
      )}
    </Link>
  );
}
