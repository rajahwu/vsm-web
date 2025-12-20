'use client';

import React from 'react';
import { 
  Settings, 
  Volume2, 
  VolumeX, 
  Moon, 
  Sun, 
  Clock,
  RotateCcw,
  Download,
  Shield
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';

interface SettingsDialogProps {
  volume: number;
  onVolumeChange: (value: number) => void;
  isMuted: boolean;
  onMutedChange: (value: boolean) => void;
  autoStart?: boolean;
  onAutoStartChange?: (value: boolean) => void;
  onResetProgress?: () => void;
  onExportData?: () => void;
  trigger?: React.ReactNode;
}

export function SettingsDialog({
  volume,
  onVolumeChange,
  isMuted,
  onMutedChange,
  autoStart,
  onAutoStartChange,
  onResetProgress,
  onExportData,
  trigger
}: SettingsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-zinc-100">
            <Settings className="h-5 w-5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 uppercase tracking-widest text-teal-500">
            <Settings className="h-5 w-5" />
            System Settings
          </DialogTitle>
          <DialogDescription className="text-zinc-500">
            Configure your VSM training environment.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-8">
          {/* Audio Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono text-zinc-600 uppercase tracking-widest">Audio Protocols</h4>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Silent Mode</Label>
                <p className="text-xs text-zinc-500 font-sans">Disable all ritual sounds.</p>
              </div>
              <Switch 
                checked={isMuted} 
                onCheckedChange={onMutedChange} 
              />
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium flex items-center gap-2">
                  {volume === 0 || isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  Master Volume
                </Label>
                <span className="text-xs font-mono text-zinc-500">{Math.round(volume * 100)}%</span>
              </div>
              <Slider
                disabled={isMuted}
                value={[volume * 100]}
                max={100}
                step={1}
                onValueChange={(vals) => onVolumeChange(vals[0] / 100)}
                className="py-4"
              />
            </div>
          </div>

          {/* Automation Section */}
          <div className="space-y-4 pt-4 border-t border-zinc-900">
            <h4 className="text-xs font-mono text-zinc-600 uppercase tracking-widest">Automation</h4>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Auto-Advance</Label>
                <p className="text-xs text-zinc-500">Automatically start next phase.</p>
              </div>
              <Switch 
                checked={autoStart} 
                onCheckedChange={onAutoStartChange} 
              />
            </div>
          </div>

          {/* Data Section */}
          <div className="space-y-4 pt-4 border-t border-zinc-900">
            <h4 className="text-xs font-mono text-zinc-600 uppercase tracking-widest">Core Data</h4>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                onClick={onExportData}
              >
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/20"
                onClick={onResetProgress}
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-start pt-4 border-t border-zinc-900">
          <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-700">
            <Shield className="h-3 w-3" />
            <span>ENCRYPTED_LOCAL_STATE</span>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
