'use client';

import { Compass, Play, Settings } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'discover' | 'play' | 'settings';
  onSelectTab: (tab: 'discover' | 'play' | 'settings') => void;
  isPlaying?: boolean;
}

export function BottomNav({ activeTab = 'play', onSelectTab, isPlaying = false }: BottomNavProps) {
  return (
    <div className="fixed bottom-4 left-0 right-0 max-w-[430px] mx-auto px-5 z-40 pointer-events-none">
      <nav className="h-[64px] rounded-full bg-[#141414]/95 backdrop-blur-2xl border border-white/[0.12] shadow-[0_12px_40px_rgba(0,0,0,0.75)] flex items-center justify-around px-6 pointer-events-auto">
        {/* Discover */}
        <button
          onClick={() => onSelectTab('discover')}
          className={`flex flex-col items-center gap-1 transition-all duration-200 cursor-pointer ${
            activeTab === 'discover' ? 'text-[#3ecf8e]' : 'text-[#8a8480] hover:text-[#f0ede8]'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="font-mono text-[8.5px] font-semibold tracking-widest uppercase">
            Discover
          </span>
        </button>

        {/* Center: Play (Main Active Tab) */}
        <button
          onClick={() => onSelectTab('play')}
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

        {/* Settings */}
        <button
          onClick={() => onSelectTab('settings')}
          className={`flex flex-col items-center gap-1 transition-all duration-200 cursor-pointer ${
            activeTab === 'settings' ? 'text-[#3ecf8e]' : 'text-[#8a8480] hover:text-[#f0ede8]'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="font-mono text-[8.5px] font-semibold tracking-widest uppercase">
            Settings
          </span>
        </button>
      </nav>
    </div>
  );
}
