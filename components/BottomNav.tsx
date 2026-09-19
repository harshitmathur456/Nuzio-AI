'use client';

import { Compass, Play, Settings } from 'lucide-react';

interface BottomNavProps {
  onPlayClick?: () => void;
  onDiscoverClick?: () => void;
  onSettingsClick?: () => void;
  isPlaying?: boolean;
  activeTab?: 'play' | 'discover' | 'settings';
}

export function BottomNav({
  onPlayClick,
  onDiscoverClick,
  onSettingsClick,
  isPlaying = false,
  activeTab = 'play',
}: BottomNavProps) {
  return (
    <div className="fixed bottom-4 left-0 right-0 max-w-[430px] mx-auto px-5 z-40 pointer-events-none">
      <nav className="h-[64px] rounded-full bg-[#141414]/95 backdrop-blur-2xl border border-white/[0.12] shadow-[0_12px_40px_rgba(0,0,0,0.75)] flex items-center justify-around px-6 pointer-events-auto">
        {/* Discover Button */}
        <button
          type="button"
          onClick={onDiscoverClick}
          className={`flex flex-col items-center gap-1 transition-all cursor-pointer group ${
            activeTab === 'discover' ? 'text-[#3ecf8e]' : 'text-[#8a8480] hover:text-[#f0ede8]'
          }`}
          title="Discover Trending Stories & Channels"
          aria-label="Discover"
        >
          <div className="p-1 rounded-full group-hover:bg-white/[0.06] transition-colors">
            <Compass className={`w-5 h-5 ${activeTab === 'discover' ? 'text-[#3ecf8e]' : ''}`} />
          </div>
          <span className="font-mono text-[8.5px] font-semibold tracking-widest uppercase">
            Discover
          </span>
        </button>

        {/* Center: Play (Active Player Brief) */}
        <button
          type="button"
          onClick={onPlayClick}
          className="relative flex flex-col items-center -top-3 cursor-pointer group"
          aria-label="Play brief"
          title="Play Brief"
        >
          <div className="w-[52px] h-[52px] rounded-full bg-gradient-to-tr from-[#6a4cf7] to-[#9080ff] flex items-center justify-center shadow-[0_8px_24px_rgba(106,76,247,0.55)] border-2 border-[#3ecf8e]/40 transition-transform group-hover:scale-105 active:scale-95 text-white">
            <Play className={`w-5 h-5 fill-white ml-0.5 ${isPlaying ? 'animate-pulse' : ''}`} />
          </div>
          <span className="font-mono text-[8.5px] font-bold tracking-widest text-[#9080ff] uppercase mt-0.5">
            Play
          </span>
        </button>

        {/* Settings Button */}
        <button
          type="button"
          onClick={onSettingsClick}
          className={`flex flex-col items-center gap-1 transition-all cursor-pointer group ${
            activeTab === 'settings' ? 'text-[#6a4cf7]' : 'text-[#8a8480] hover:text-[#f0ede8]'
          }`}
          title="Preferences & Audio Settings"
          aria-label="Settings"
        >
          <div className="p-1 rounded-full group-hover:bg-white/[0.06] transition-colors">
            <Settings className={`w-5 h-5 ${activeTab === 'settings' ? 'text-[#6a4cf7]' : ''}`} />
          </div>
          <span className="font-mono text-[8.5px] font-semibold tracking-widest uppercase">
            Settings
          </span>
        </button>
      </nav>
    </div>
  );
}
