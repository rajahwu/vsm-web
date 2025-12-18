import { useEffect, useRef, useState, useCallback } from 'react';
import audioManifest from '../../../../design-source/TOKENS_SOURCE/audio.json';

// Types derived from manifest
export type PhaseId = keyof typeof audioManifest.phases;

export interface Track {
  id: string;
  title: string;
  filename: string;
  version: number;
  rating: number;
  favorite: boolean;
  tags: string[];
  bpm: number | null;
  durationSec: number | null;
}

export interface PhaseAudio {
  name: string;
  defaultTrack: string;
  shuffle: boolean;
  loop: boolean;
  tracks: Track[];
}

interface UseRitualSoundOptions {
  phaseId: PhaseId;
  isRunning: boolean;
  trackId?: string; // Override default track selection
}

interface UseRitualSoundReturn {
  // State
  isMuted: boolean;
  volume: number;
  isPlaying: boolean;
  currentTrack: Track | null;
  availableTracks: Track[];
  
  // Actions
  setIsMuted: (muted: boolean) => void;
  setVolume: (volume: number) => void;
  selectTrack: (trackId: string) => void;
  nextTrack: () => void;
  prevTrack: () => void;
}

export function useRitualSound({
  phaseId,
  isRunning,
  trackId,
}: UseRitualSoundOptions): UseRitualSoundReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState(audioManifest.settings.defaultVolume);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);

  // Get phase config
  const phaseConfig = audioManifest.phases[phaseId] as PhaseAudio | undefined;
  const availableTracks = phaseConfig?.tracks ?? [];
  
  // Resolve current track
  const resolveTrack = useCallback((): Track | null => {
    if (!phaseConfig) return null;
    
    // Priority: explicit trackId > current selection > phase default
    const targetId = trackId ?? currentTrackId ?? phaseConfig.defaultTrack;
    return phaseConfig.tracks.find(t => t.id === targetId) ?? phaseConfig.tracks[0] ?? null;
  }, [phaseConfig, trackId, currentTrackId]);

  const currentTrack = resolveTrack();

  // Build audio URL
  const getAudioUrl = (track: Track): string => {
    return `${audioManifest.basePath}${track.filename}`;
  };

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
    const audio = audioRef.current;
    
    // Event listeners
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      if (phaseConfig?.loop) {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, [phaseConfig?.loop]);

  // Handle track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    const newSrc = getAudioUrl(currentTrack);
    
    // Only switch if source actually changed
    if (!audio.src.endsWith(currentTrack.filename)) {
      // Fade out current track
      const fadeOut = () => {
        return new Promise<void>((resolve) => {
          if (audio.paused || audio.volume === 0) {
            resolve();
            return;
          }
          
          const fadeInterval = setInterval(() => {
            if (audio.volume > 0.1) {
              audio.volume = Math.max(0, audio.volume - 0.1);
            } else {
              audio.volume = 0;
              clearInterval(fadeInterval);
              resolve();
            }
          }, audioManifest.settings.fadeOutDurationMs / 10);
        });
      };

      fadeOut().then(() => {
        audio.src = newSrc;
        audio.load();
        
        if (isRunning && !isMuted) {
          audio.volume = 0;
          audio.play()
            .then(() => {
              // Fade in
              const fadeIn = setInterval(() => {
                if (audio.volume < volume - 0.1) {
                  audio.volume = Math.min(volume, audio.volume + 0.1);
                } else {
                  audio.volume = volume;
                  clearInterval(fadeIn);
                }
              }, audioManifest.settings.fadeInDurationMs / 10);
            })
            .catch(e => console.log("Autoplay prevented:", e));
        }
      });
    }
  }, [currentTrack, isRunning, isMuted, volume]);

  // Handle play/pause state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isRunning && !isMuted) {
      if (audio.paused && audio.src) {
        audio.play().catch(e => console.log("Play failed:", e));
      }
    } else {
      audio.pause();
    }
  }, [isRunning, isMuted, currentTrack]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Track selection
  const selectTrack = useCallback((newTrackId: string) => {
    if (availableTracks.some(t => t.id === newTrackId)) {
      setCurrentTrackId(newTrackId);
    }
  }, [availableTracks]);

  // Next/prev track navigation
  const nextTrack = useCallback(() => {
    if (!currentTrack || availableTracks.length <= 1) return;
    
    const currentIndex = availableTracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % availableTracks.length;
    setCurrentTrackId(availableTracks[nextIndex].id);
  }, [currentTrack, availableTracks]);

  const prevTrack = useCallback(() => {
    if (!currentTrack || availableTracks.length <= 1) return;
    
    const currentIndex = availableTracks.findIndex(t => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + availableTracks.length) % availableTracks.length;
    setCurrentTrackId(availableTracks[prevIndex].id);
  }, [currentTrack, availableTracks]);

  // Reset track selection when phase changes
  useEffect(() => {
    setCurrentTrackId(null);
  }, [phaseId]);

  return {
    isMuted,
    volume,
    isPlaying,
    currentTrack,
    availableTracks,
    setIsMuted,
    setVolume,
    selectTrack,
    nextTrack,
    prevTrack,
  };
}

// Utility: Get all tracks for a phase
export function getPhaseTracklist(phaseId: PhaseId): Track[] {
  const phase = audioManifest.phases[phaseId] as PhaseAudio | undefined;
  return phase?.tracks ?? [];
}

// Utility: Get favorites across all phases
export function getFavoriteTracks(): Track[] {
  const allPhases = Object.values(audioManifest.phases) as PhaseAudio[];
  return allPhases.flatMap(p => p.tracks.filter(t => t.favorite));
}

// Utility: Search tracks by tag
export function getTracksByTag(tag: string): Track[] {
  const allPhases = Object.values(audioManifest.phases) as PhaseAudio[];
  return allPhases.flatMap(p => p.tracks.filter(t => t.tags.includes(tag)));
}
