'use client';

import { useState } from 'react';
import { Logo } from './Logo';
import { Search, Bell, X, Smartphone, Monitor, LogOut } from 'lucide-react';

interface AppHeaderProps {
  userName?: string;
  viewMode: 'mobile' | 'desktop';
  onToggleViewMode: (mode: 'mobile' | 'desktop') => void;
  onSearchSubmit: (query: string) => void;
  onLogout: () => void;
}

export function AppHeader({
  userName = 'Aarav',
  viewMode,
  onToggleViewMode,
  onSearchSubmit,
  onLogout,
}: AppHeaderProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setIsSearchExpanded(false);
      return;
    }
    onSearchSubmit(searchQuery.trim());
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearchExpanded(false);
    onSearchSubmit('');
  };

  return (
    <header className="px-5 py-3.5 bg-[#0d0d0d] border-b border-white/[0.07] sticky top-0 z-40">
      <div className="flex items-center justify-between gap-3">
        {/* Logo (left) */}
        {!isSearchExpanded && <Logo size={42} />}

        {/* In-place expanding search input (functional) */}
        {isSearchExpanded ? (
          <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2 animate-in fade-in duration-200">
            <div className="relative flex-1 flex items-center">
              <Search className="w-3.5 h-3.5 text-[#9080ff] absolute left-3 pointer-events-none" />
              <input
                type="text"
                autoFocus
                placeholder="Search Google News (India)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.08] border border-white/[0.15] rounded-full pl-9 pr-8 py-1.5 text-xs text-[#f0ede8] placeholder-[#8a8480] focus:outline-none focus:border-[#6a4cf7]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2.5 text-[#8a8480] hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-full bg-[#6a4cf7] hover:bg-[#6a4cf7]/90 text-white text-[11px] font-semibold transition-colors shrink-0 cursor-pointer"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleClearSearch}
              className="p-1.5 rounded-full text-[#8a8480] hover:text-white shrink-0 cursor-pointer"
              title="Close search"
            >
              <X className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Right cluster: Search Icon + Notification Bell + View Mode Toggle + User */
          <div className="flex items-center gap-2.5 ml-auto">
            {/* Functional Search icon */}
            <button
              onClick={() => setIsSearchExpanded(true)}
              className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.09] flex items-center justify-center text-[#f0ede8]/80 hover:text-white hover:bg-white/[0.12] transition-all cursor-pointer"
              title="Search Google News"
              aria-label="Search news"
            >
              <Search className="w-3.5 h-3.5" />
            </button>

            {/* Notification Bell (visual with unread green dot per PRD) */}
            <div
              className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.09] flex items-center justify-center text-[#f0ede8]/80 relative select-none"
              title="Notifications"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#3ecf8e] shadow-[0_0_6px_#3ecf8e]" />
            </div>

            {/* View Mode Toggle: [Mobile | Desktop] */}
            <div className="flex items-center p-0.5 rounded-full bg-white/[0.06] border border-white/[0.10] text-[10px] font-mono">
              <button
                onClick={() => onToggleViewMode('mobile')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  viewMode === 'mobile'
                    ? 'bg-[#6a4cf7] text-white font-semibold shadow-sm'
                    : 'text-[#8a8480] hover:text-[#f0ede8]'
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-3 h-3" />
                <span className="hidden sm:inline">Mobile</span>
              </button>
              <button
                onClick={() => onToggleViewMode('desktop')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  viewMode === 'desktop'
                    ? 'bg-[#6a4cf7] text-white font-semibold shadow-sm'
                    : 'text-[#8a8480] hover:text-[#f0ede8]'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-3 h-3" />
                <span className="hidden sm:inline">Desktop</span>
              </button>
            </div>

            {/* User profile / Logout */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6a4cf7]/40 to-[#9080ff]/20 border border-[#6a4cf7]/40 flex items-center justify-center text-[11px] font-bold text-[#f0ede8] hover:border-[#6a4cf7] transition-all cursor-pointer"
                title={userName}
              >
                {userName ? userName[0].toUpperCase() : 'U'}
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-10 w-44 rounded-2xl glass-panel p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-white/[0.08] mb-1">
                    <p className="text-[12px] font-semibold text-[#f0ede8] truncate">{userName}</p>
                    <p className="text-[10px] text-[#8a8480] font-mono">Authenticated</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] text-red-400 hover:bg-red-500/10 transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
