'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Article, Category, NewsCategory, GoogleNewsItem } from '@/lib/types';
import { INITIAL_ARTICLES } from '@/lib/newsData';
import { rankArticles } from '@/lib/ranking';
import { useAudioPlayer } from '@/lib/useAudioPlayer';
import { AppHeader } from '@/components/AppHeader';
import { CategoryPills } from '@/components/CategoryPills';
import { PlayerCard } from '@/components/PlayerCard';
import { LiveTranscriptStrip } from '@/components/LiveTranscriptStrip';
import { BottomNav } from '@/components/BottomNav';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { Play, Sparkles, X, ExternalLink, Volume2 } from 'lucide-react';

export default function BriefNewsPage() {
  const router = useRouter();

  // State
  const [userName, setUserName] = useState('Aarav');
  const [activeCategory, setActiveCategory] = useState<NewsCategory>('All');
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [loading, setLoading] = useState(true);

  // View Mode: Mobile vs Desktop (switchable at runtime, defaulted by window.innerWidth)
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');

  // Search state (Google News live search)
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GoogleNewsItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // 1. Initial responsive view mode detection (>=1024px -> Desktop, else Mobile)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) {
        setViewMode('desktop');
      }
    }
  }, []);

  // 2. Fetch user profile & persisted preferences on mount
  useEffect(() => {
    async function loadUserData() {
      try {
        if (isSupabaseConfigured) {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            // First name from user's email or metadata
            const emailName = user.email ? user.email.split('@')[0] : '';
            const firstName = user.user_metadata?.full_name?.split(' ')[0] || emailName || 'Aarav';
            setUserName(firstName);
          }
        } else {
          // Check demo session cookie
          const match = document.cookie.match(/nuzio_demo_user=([^;]+)/);
          if (match) {
            try {
              const demoUser = JSON.parse(decodeURIComponent(match[1]));
              if (demoUser.email) {
                setUserName(demoUser.email.split('@')[0]);
              } else if (demoUser.name) {
                setUserName(demoUser.name.split(' ')[0]);
              }
            } catch {
              // fallback
            }
          }
        }

        // Fetch user preferences from /api/preferences
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
        console.warn('Could not load user data:', err);
      }
    }

    loadUserData();
  }, []);

  // 3. Fetch ranked news feed based on active category
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
        const ranked = rankArticles(
          INITIAL_ARTICLES,
          category === 'All' ? [] : [category as Category]
        );
        setArticles(ranked);
      }
    } catch {
      const ranked = rankArticles(
        INITIAL_ARTICLES,
        category === 'All' ? [] : [category as Category]
      );
      setArticles(ranked);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRankedNews(activeCategory);
  }, [activeCategory, fetchRankedNews]);

  // 4. Audio Player Engine
  const {
    currentIndex,
    currentArticle,
    isPlaying,
    isPaused,
    playbackRate,
    progressRatio,
    elapsedSecs,
    durationSec,
    currentSpokenText,
    isSearchPlaying,
    togglePlayPause,
    handleNext,
    handlePrev,
    cycleRate,
    playStoryAtIndex,
    playSearchResult,
    seekToRatio,
  } = useAudioPlayer(articles);

  // 5. Handle Category Pill Selection & Persistence (POST /api/preferences)
  const handleSelectCategory = async (category: NewsCategory) => {
    setActiveCategory(category);

    try {
      await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categories: category === 'All' ? ['All'] : [category],
        }),
      });
    } catch (err) {
      console.warn('Failed to persist category preference:', err);
    }
  };

  // 6. Handle Google News RSS Search
  const handleSearchSubmit = async (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const res = await fetch(`/api/search/news?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (res.ok && data.results) {
        setSearchResults(data.results);
      } else {
        setSearchError(data.error || 'No news stories found');
      }
    } catch {
      setSearchError('Failed to fetch Google News results');
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearchResults = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchError(null);
  };

  // 7. Handle Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // proceed
    }
    router.push('/login');
    router.refresh();
  };

  // Derived: total runtime in mm:ss
  const totalRuntimeFormatted = useMemo(() => {
    const totalSecs = articles.reduce((sum, a) => sum + (a.durationSec || 40), 0);
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }, [articles]);

  const nextArticle = articles[currentIndex + 1] || articles[0];

  const isDesktop = viewMode === 'desktop';

  return (
    <div
      className={`min-h-screen flex flex-col justify-between transition-all duration-300 ${
        isDesktop
          ? 'w-full max-w-[1080px] border-x border-white/[0.06] bg-[#0d0d0d] shadow-2xl pb-24'
          : 'w-full max-w-[430px] border-x border-white/[0.06] bg-[#0d0d0d] shadow-2xl pb-28'
      }`}
    >
      {/* 1. Header with in-place functional search, notifications (unread dot), & Desktop/Mobile switch */}
      <AppHeader
        userName={userName}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        onSearchSubmit={handleSearchSubmit}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col">
        {/* Search Results (Temporary Ephemeral Layer backed by Google News) */}
        {searchQuery && (
          <div className="mx-4 my-3 p-4 rounded-2xl glass-card border border-white/[0.12] animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#3ecf8e]" />
                <span className="font-mono text-[10px] text-[#f0ede8] uppercase tracking-wider font-semibold">
                  Google News Results for &ldquo;{searchQuery}&rdquo;
                </span>
              </div>
              <button
                onClick={handleClearSearchResults}
                className="text-[#8a8480] hover:text-white text-xs flex items-center gap-1 cursor-pointer"
              >
                <span>Clear</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {isSearching ? (
              <div className="py-4 text-center text-xs text-[#8a8480]">
                Fetching live stories from Google News...
              </div>
            ) : searchError ? (
              <div className="py-2 text-center text-xs text-red-400">{searchError}</div>
            ) : searchResults.length === 0 ? (
              <div className="py-2 text-center text-xs text-[#8a8480]">
                No recent stories found.
              </div>
            ) : (
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {searchResults.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-all flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono text-[8.5px] text-[#3ecf8e] uppercase font-bold">
                          {item.source}
                        </span>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#9080ff] text-[9px] hover:underline flex items-center gap-0.5"
                        >
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                      <p className="font-display text-xs text-[#f0ede8] line-clamp-1">
                        {item.title}
                      </p>
                    </div>

                    <button
                      onClick={() => playSearchResult(item)}
                      className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#6a4cf7] to-[#9080ff] hover:opacity-95 text-white text-[10.5px] font-semibold flex items-center gap-1 shrink-0 cursor-pointer shadow-sm"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Play</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. Category Pills Bar */}
        <CategoryPills
          categories={['All', 'AI & Tech', 'Markets', 'Startups', 'Science', 'Global']}
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
          isLoading={loading}
        />

        {/* 3. Greeting Row & Status Line */}
        <div className={`pt-2 pb-1 ${isDesktop ? 'px-7' : 'px-5'}`}>
          <h1 className="font-display text-[26px] leading-[1.12] text-[#f0ede8]">
            Good morning, {userName} —{' '}
            <em className="text-[#6a4cf7] not-italic font-display">
              {articles.length} things.
            </em>
          </h1>
          <div className="flex items-center gap-2 pt-1 text-[11.5px] text-[#8a8480] flex-wrap font-sans">
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
              {articles.length} stories · total runtime {totalRuntimeFormatted}
            </span>
          </div>
        </div>

        {/* 4. Player Card & Layout (Desktop 2-Column vs Mobile Single-Column) */}
        {isDesktop ? (
          /* Desktop 2-Column Mode */
          <div className="grid grid-cols-12 gap-6 px-7 py-4 flex-1">
            {/* Left Column: Scrollable List of the Full Queue */}
            <div className="col-span-5 flex flex-col glass-card rounded-[24px] p-4 max-h-[520px] overflow-y-auto border border-white/[0.08]">
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/[0.08]">
                <span className="font-mono text-[10px] text-[#8a8480] uppercase tracking-wider font-semibold">
                  Queue ({articles.length} Stories)
                </span>
                <span className="font-mono text-[9.5px] text-[#9080ff]">
                  Ranked by Personalization
                </span>
              </div>

              <div className="space-y-2 pr-1">
                {articles.map((story, idx) => {
                  const isCurrent = !isSearchPlaying && currentIndex === idx;
                  return (
                    <div
                      key={story.id}
                      onClick={() => playStoryAtIndex(idx)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 ${
                        isCurrent
                          ? 'bg-[#6a4cf7]/15 border-[#6a4cf7]/60 shadow-[0_4px_16px_rgba(106,76,247,0.25)]'
                          : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.07] hover:border-white/[0.12]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[8.5px] text-[#3ecf8e] font-bold uppercase tracking-wider">
                          {story.category}
                        </span>
                        <div className="flex items-center gap-1.5 font-mono text-[9px] text-[#8a8480]">
                          <span>{story.source}</span>
                          <span>·</span>
                          <span>{story.durationSec}s</span>
                          {isCurrent && isPlaying && !isPaused && (
                            <Volume2 className="w-3 h-3 text-[#3ecf8e] animate-pulse ml-1" />
                          )}
                        </div>
                      </div>
                      <h4
                        className={`font-display text-sm leading-snug ${
                          isCurrent ? 'text-white font-medium' : 'text-[#f0ede8]'
                        }`}
                      >
                        {story.headline}
                      </h4>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Centerpiece Glass Player Card with Breathing Room */}
            <div className="col-span-7 flex flex-col justify-between">
              {currentArticle && (
                <PlayerCard
                  article={currentArticle}
                  nextArticle={nextArticle}
                  currentIndex={currentIndex}
                  totalArticles={articles.length}
                  isPlaying={isPlaying}
                  isPaused={isPaused}
                  progressRatio={progressRatio}
                  elapsedSecs={elapsedSecs}
                  durationSec={durationSec}
                  playbackRate={playbackRate}
                  viewMode="desktop"
                  onTogglePlay={togglePlayPause}
                  onPrev={handlePrev}
                  onNext={handleNext}
                  onCycleRate={cycleRate}
                  onSeek={seekToRatio}
                />
              )}

              {/* 5. Transcript Strip: small glass pill, green text, visible only while playing */}
              <div className="mt-3">
                <LiveTranscriptStrip spokenText={currentSpokenText} isPlaying={isPlaying && !isPaused} />
              </div>
            </div>
          </div>
        ) : (
          /* Mobile Single-Column Mode */
          <div className="flex-1 flex flex-col">
            {currentArticle ? (
              <PlayerCard
                article={currentArticle}
                nextArticle={nextArticle}
                currentIndex={currentIndex}
                totalArticles={articles.length}
                isPlaying={isPlaying}
                isPaused={isPaused}
                progressRatio={progressRatio}
                elapsedSecs={elapsedSecs}
                durationSec={durationSec}
                playbackRate={playbackRate}
                viewMode="mobile"
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

            {/* 5. Transcript Strip: visible only while playing */}
            <LiveTranscriptStrip spokenText={currentSpokenText} isPlaying={isPlaying && !isPaused} />
          </div>
        )}
      </div>

      {/* 6. Fixed Bottom Nav: Discover / Play (center, active) / Settings (visual-only) */}
      <BottomNav
        onPlayClick={togglePlayPause}
        isPlaying={isPlaying && !isPaused}
      />
    </div>
  );
}
