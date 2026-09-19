'use client';

import { Logo } from './Logo';
import { Search, Bell, LogOut, User } from 'lucide-react';
import { useState } from 'react';

interface AppHeaderProps {
  userName?: string;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
}

export function AppHeader({
  userName = 'Aarav Sharma',
  onOpenSearch,
  onOpenNotifications,
  onOpenSettings,
  onLogout,
}: AppHeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="flex items-center justify-between px-5 py-3.5 bg-[#0d0d0d] border-b border-white/[0.07] sticky top-0 z-40">
      {/* Official Nuzio Logo */}
      <Logo size={42} />

      {/* Header Actions */}
      <div className="flex items-center gap-2">
        {/* Search button */}
        <button
          onClick={onOpenSearch}
          className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.09] flex items-center justify-center text-[#f0ede8]/80 hover:text-white hover:bg-white/[0.12] transition-all cursor-pointer"
          title="Search news brief"
          aria-label="Search news"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications button with unread dot */}
        <button
          onClick={onOpenNotifications}
          className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.09] flex items-center justify-center text-[#f0ede8]/80 hover:text-white hover:bg-white/[0.12] transition-all relative cursor-pointer"
          title="Morning alerts & audio live"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#3ecf8e] shadow-[0_0_6px_#3ecf8e]" />
        </button>

        {/* User profile / Logout dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6a4cf7]/40 to-[#9080ff]/20 border border-[#6a4cf7]/40 flex items-center justify-center text-[12px] font-bold text-[#f0ede8] hover:border-[#6a4cf7] transition-all cursor-pointer"
            title={userName}
          >
            {userName ? userName[0].toUpperCase() : 'U'}
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-11 w-48 rounded-2xl glass-panel p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-white/[0.08] mb-1">
                <p className="text-[12px] font-semibold text-[#f0ede8] truncate">{userName}</p>
                <p className="text-[10px] text-[#8a8480] font-mono">Audio Pro Plan</p>
              </div>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  onOpenSettings();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] text-[#f0ede8] hover:bg-white/[0.08] transition-colors text-left"
              >
                <User className="w-3.5 h-3.5 text-[#9080ff]" />
                <span>Audio Settings</span>
              </button>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] text-red-400 hover:bg-red-500/10 transition-colors text-left"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
