'use client';

import { Compass, Play, Settings } from 'lucide-react';

interface BottomNavProps {
  onPlayClick?: () => void;
  isPlaying?: boolean;
}

export function BottomNav({ onPlayClick, isPlaying = false }: BottomNavProps) {
  return (
    <div className="fixed bottom-4 left-0 right-0 max-w-[430px] mx-auto px-5 z-40 pointer-events-none">
      <nav className="h-[64px] rounded-full bg-[#141414]/95 backdrop-blur-2xl border border-white/[0.12] shadow-[0_12px_40px_rgba(0,0,0,0.75)] flex items-center justify-around px-6 pointer-events-auto">
        {/* Discover (visual-only, does not navigate per PRD) */}
        <div
          className="flex flex-col items-center gap-1 text-[#8a8480] cursor-default opacity-75 select-none"
          title="Discover (Visual only)"
        >
          <Compass className="w-5 h-5" />
          <span className="font-mono text-[8.5px] font-semibold tracking-widest uppercase">
            Discover
          </span>
        </div>

        {/* Center: Play (Real Active Tab) */}
        <button
          onClick={onPlayClick}
          className="relative flex flex-col items-center -top-3 cursor-pointer group"
          aria-label="Play brief"
        >
          <div className="w-[52px] h-[52px] rounded-full bg-gradient-to-tr from-[#6a4cf7] to-[#9080ff] flex items-center justify-center shadow-[0_8px_24px_rgba(106,76,247,0.55)] border-2 border-[#3ecf8e]/35 transition-transform group-hover:scale-105 active:scale-95 text-white">
            <Play className={`w-5 h-5 fill-white ml-0.5 ${isPlaying ? 'animate-pulse' : ''}`} />
          </div>
          <span className="font-mono text-[8.5px] font-bold tracking-widest text-[#9080ff] uppercase mt-0.5">
            Play
          </span>
        </button>

        {/* Settings (visual-only, does not navigate per PRD) */}
        <div
          className="flex flex-col items-center gap-1 text-[#8a8480] cursor-default opacity-75 select-none"
          title="Settings (Visual only)"
        >
          <Settings className="w-5 h-5" />
          <span className="font-mono text-[8.5px] font-semibold tracking-widest uppercase">
            Settings
          </span>
        </div>
      </nav>
    </div>
  );
}
