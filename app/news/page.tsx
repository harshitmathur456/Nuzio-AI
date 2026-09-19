'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Article, NewsCategory } from '@/lib/types';
import { INITIAL_ARTICLES } from '@/lib/newsData';
import { rankArticles } from '@/lib/ranking';
import { useAudioPlayer } from '@/lib/useAudioPlayer';
import { AppHeader } from '@/components/AppHeader';
import { CategoryPills } from '@/components/CategoryPills';
import { PlayerCard } from '@/components/PlayerCard';
import { LiveTranscriptStrip } from '@/components/LiveTranscriptStrip';
import { BottomNav } from '@/components/BottomNav';
import { SearchModal } from '@/components/SearchModal';
import { NotificationDrawer } from '@/components/NotificationDrawer';
import { SettingsModal } from '@/components/SettingsModal';
import { DiscoverModal } from '@/components/DiscoverModal';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

export default function BriefNewsPage() {
  const router = useRouter();

  // State
  const [userName, setUserName] = useState('Aarav Sharma');
  const [activeCategory, setActiveCategory] = useState<NewsCategory>('All');
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [loading, setLoading] = useState(true);

  // Modals & drawers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDiscoverOpen, setIsDiscoverOpen] = useState(false);

  // 1. Fetch user profile & persisted preferences on mount
  useEffect(() => {
    async function loadUserData() {
      try {
        // Try Supabase auth user
        if (isSupabaseConfigured) {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Aarav';
            setUserName(name);
          }
        } else {
          // Check demo cookie
          const match = document.cookie.match(/nuzio_demo_user=([^;]+)/);
          if (match) {
            try {
              const demoUser = JSON.parse(decodeURIComponent(match[1]));
              if (demoUser.name) setUserName(demoUser.name);
            } catch {
              // fallback default
            }
          }
        }

        // Fetch persisted category preference
        const res = await fetch('/api/preferences');
        if (res.ok) {
          const prefData = await res.json();
          if (prefData.categories && prefData.categories.length > 0) {
            const savedCategory = prefData.categories[0] as NewsCategory;
            if (savedCategory) {
              setActiveCategory(savedCategory);
            }
          }
        }
      } catch (err) {
        console.warn('Could not fetch user preferences:', err);
      }
    }

    loadUserData();
  }, []);

  // 2. Fetch ranked news feed based on activeCategory
  const fetchRankedNews = useCallback(async (category: NewsCategory) => {
    setLoading(true);
    try {
      const url = category === 'All' ? '/api/news' : `/api/news?category=${encodeURIComponent(category)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.articles && data.articles.length > 0) {
          setArticles(data.articles);
        }
      } else {
        // Fallback local ranking
        const ranked = rankArticles(
          INITIAL_ARTICLES,
          category === 'All' ? [] : [category]
        );
        setArticles(ranked);
      }
    } catch {
      // Local fallback
      const ranked = rankArticles(
        INITIAL_ARTICLES,
        category === 'All' ? [] : [category]
      );
      setArticles(ranked);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync news feed whenever activeCategory changes
  useEffect(() => {
    fetchRankedNews(activeCategory);
  }, [activeCategory, fetchRankedNews]);

  // 3. Audio Player Hook
  const {
    currentIndex,
    currentArticle,
    isPlaying,
    isPaused,
    playbackRate,
    elapsedSecs,
    totalSecs,
    currentSpokenText,
    setCurrentIndex,
    togglePlayPause,
    handleNext,
    handlePrev,
    cycleRate,
    seekToRatio,
  } = useAudioPlayer(articles);

  // 4. Handle Category Selection & Persistence (PRD Section 5.2)
  const handleSelectCategory = async (category: NewsCategory) => {
    setActiveCategory(category);

    // Persist to backend /api/preferences with RLS
    try {
      await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categories: category === 'All' ? ['All'] : [category],
        }),
      });
    } catch (err) {
      console.warn('Failed to persist preference to Supabase:', err);
    }
  };

  // 5. Handle Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // proceed
    }
    router.push('/login');
    router.refresh();
  };

  // Derived calculations
  const totalRuntimeMinutes = useMemo(() => {
    return articles.reduce((sum, a) => sum + a.readTimeMins, 0);
  }, [articles]);

  const nextArticle = articles[currentIndex + 1] || articles[0];

  // Dynamic date
  const todayFormatted = useMemo(() => {
    const d = new Date();
    const day = d.toLocaleDateString('en-US', { weekday: 'long' });
    const dateNum = d.getDate();
    const month = d.toLocaleDateString('en-US', { month: 'long' });
    return `${day} · ${dateNum} ${month} · Morning Brief`;
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col justify-between pb-28">
      {/* Top Header */}
      <AppHeader
        userName={userName}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col">
        {/* Category Pills Bar */}
        <CategoryPills
          categories={['All', 'AI & Tech', 'Markets', 'Startups', 'Science', 'Global']}
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
          isLoading={loading}
        />

        {/* Date Stamp in Geist Mono */}
        <div className="px-5 pt-2 pb-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#6a4cf7]">
          {todayFormatted}
        </div>

        {/* Greeting Row in Instrument Serif */}
        <div className="px-5 pt-0 pb-1">
          <h1 className="font-display text-[27px] leading-[1.14] text-[#f0ede8]">
            Good morning, {userName.split(' ')[0]} —<br />
            <em className="text-[#6a4cf7] not-italic font-display">{articles.length} things.</em>
          </h1>
        </div>

        {/* Live Audio Status Bar */}
        <div className="flex items-center gap-2 px-5 pb-3 text-[11.5px] text-[#8a8480] flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#3ecf8e] shadow-[0_0_8px_#3ecf8e]" />
            <span className="text-[#3ecf8e] font-semibold">Audio live</span>
          </div>
          <span>·</span>
          <span>
            Voice: <strong className="text-[#f0ede8] font-medium">Aria</strong>
          </span>
          <span>·</span>
          <span>
            {articles.length} stories · ~{totalRuntimeMinutes}m
          </span>
        </div>

        {/* Glass Player Card */}
        {currentArticle ? (
          <PlayerCard
            article={currentArticle}
            nextArticle={nextArticle}
            currentIndex={currentIndex}
            totalArticles={articles.length}
            isPlaying={isPlaying}
            isPaused={isPaused}
            elapsedSecs={elapsedSecs}
            totalSecs={totalSecs}
            playbackRate={playbackRate}
            onTogglePlay={togglePlayPause}
            onPrev={handlePrev}
            onNext={handleNext}
            onCycleRate={cycleRate}
            onSeek={seekToRatio}
          />
        ) : (
          <div className="mx-4 p-8 glass-card rounded-2xl text-center text-sm text-[#8a8480]">
            Loading audio brief...
          </div>
        )}

        {/* Live Spoken Transcript Strip */}
        <LiveTranscriptStrip spokenText={currentSpokenText} isPlaying={isPlaying && !isPaused} />
      </div>

      {/* Floating Bottom Nav */}
      <BottomNav
        activeTab="play"
        onSelectTab={(tab) => {
          if (tab === 'discover') setIsDiscoverOpen(true);
          if (tab === 'settings') setIsSettingsOpen(true);
        }}
        isPlaying={isPlaying && !isPaused}
      />

      {/* Modals and Drawers */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        articles={articles}
        onSelectArticle={(idx) => setCurrentIndex(idx)}
      />

      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        storyCount={articles.length}
        totalMinutes={totalRuntimeMinutes}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userName={userName}
        isSupabaseLive={isSupabaseConfigured}
        onLogout={handleLogout}
      />

      <DiscoverModal
        isOpen={isDiscoverOpen}
        onClose={() => setIsDiscoverOpen(false)}
        articles={articles}
        onSelectArticle={(idx) => setCurrentIndex(idx)}
      />
    </div>
  );
}
