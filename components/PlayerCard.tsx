'use client';

import { useState } from 'react';
import { Article } from '@/lib/types';
import { AudioWaveform } from './AudioWaveform';
import { ExternalLink, Bookmark, SkipBack, SkipForward, Play, Pause } from 'lucide-react';

interface PlayerCardProps {
  article: Article;
  nextArticle?: Article;
  currentIndex: number;
  totalArticles: number;
  isPlaying: boolean;
  isPaused: boolean;
  progressRatio: number; // 0 to 1 from boundary events
  elapsedSecs: number;
  durationSec: number;
  playbackRate: 1 | 1.25 | 1.5;
  viewMode?: 'mobile' | 'desktop';
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onCycleRate: () => void;
  onSeek: (ratio: number) => void;
}

export function PlayerCard({
  article,
  nextArticle,
  currentIndex,
  totalArticles,
  isPlaying,
  isPaused,
  progressRatio,
  elapsedSecs,
  durationSec,
  playbackRate,
  viewMode = 'mobile',
  onTogglePlay,
  onPrev,
  onNext,
  onCycleRate,
  onSeek,
}: PlayerCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  // Format mm:ss
  const formatTime = (secs: number) => {
    const s = Math.max(0, Math.round(secs));
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const remainingSecs = Math.max(0, durationSec - elapsedSecs);
  const progressPercent = Math.min(100, Math.max(0, progressRatio * 100));

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio);
  };

  const queuePositionText = article.isSearchItem
    ? 'SEARCH RESULT'
    : `${(currentIndex + 1).toString().padStart(2, '0')} / ${totalArticles.toString().padStart(2, '0')}`;

  const isDesktop = viewMode === 'desktop';

  return (
    <div
      className={`rounded-[24px] glass-panel transition-all relative overflow-hidden flex flex-col justify-between ${
        isDesktop ? 'p-7 h-full min-h-[460px]' : 'mx-4 my-2 p-5'
      }`}
    >
      <div>
        {/* Top row: Category Pill (left) + Queue Position (right) */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 bg-white/[0.08] backdrop-blur-md px-3 py-1 rounded-full border border-white/[0.08]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#6a4cf7] animate-pulse" />
            <span className="font-mono text-[9px] tracking-wider text-[#9080ff] font-semibold uppercase">
              {article.isSearchItem ? 'LIVE SEARCH' : `NOW PLAYING · ${article.category}`}
            </span>
          </div>
          <span className="font-mono text-[10.5px] text-[#8a8480] tracking-wide font-medium">
            {queuePositionText}
          </span>
        </div>

        {/* Headline: Large serif font in Instrument Serif */}
        <h2
          className={`font-display leading-[1.22] text-[#f0ede8] font-normal mb-3 ${
            isDesktop ? 'text-[28px] min-h-[88px]' : 'text-[22px] min-h-[66px]'
          }`}
        >
          {article.headline}
        </h2>

        {/* Meta row: SOURCE (mono, violet) · "N MIN" (gray) · "SOURCE ↗" (green) · "SAVE" (gray) */}
        <div className="flex items-center gap-2 font-mono text-[9.5px] tracking-wider mb-3">
          <span className="text-[#6a4cf7] font-bold">{article.source.toUpperCase()}</span>
          <span className="text-[#8a8480]">· {Math.ceil(durationSec / 60)} MIN</span>
          {article.sourceUrl && (
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[#3ecf8e] font-semibold hover:underline flex items-center gap-0.5 ml-1"
            >
              <span>SOURCE</span>
              <ExternalLink className="w-2.5 h-2.5 inline" />
            </a>
          )}
          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`ml-auto flex items-center gap-1 font-mono text-[9.5px] transition-colors cursor-pointer ${
              isSaved ? 'text-[#3ecf8e]' : 'text-[#8a8480] hover:text-[#f0ede8]'
            }`}
          >
            <Bookmark className="w-2.5 h-2.5" fill={isSaved ? '#3ecf8e' : 'none'} />
            <span>{isSaved ? 'SAVED' : 'SAVE'}</span>
          </button>
        </div>

        {/* Dim, truncated one-line preview of the next article */}
        <div className="font-display text-[13px] text-[#f0ede8]/30 mb-2 overflow-hidden whitespace-nowrap text-ellipsis italic">
          {nextArticle ? `Next: ${nextArticle.headline}` : 'End of morning brief queue'}
        </div>

        {/* Animated Waveform Bars (scale continuously while playing, flatten low while paused) */}
        <AudioWaveform isPlaying={isPlaying && !isPaused} bars={isDesktop ? 36 : 30} height={isDesktop ? 38 : 32} />

        {/* Progress bar with elapsed/remaining time driven by boundary event */}
        <div
          onClick={handleTrackClick}
          className="h-1.5 rounded-full bg-white/[0.12] relative my-2.5 cursor-pointer group"
          title="Click to seek"
        >
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-[#6a4cf7] to-[#9080ff] transition-all duration-150"
            style={{ width: `${progressPercent}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `calc(${progressPercent}% - 6px)` }}
          />
        </div>

        {/* Elapsed & Remaining Time */}
        <div className="flex justify-between font-mono text-[9.5px] text-[#8a8480] mb-4">
          <span>{formatTime(elapsedSecs)}</span>
          <span>-{formatTime(remainingSecs)}</span>
        </div>
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-3 pt-2">
        {/* Previous (glass circle) */}
        <button
          onClick={onPrev}
          className="w-11 h-11 rounded-full glass-card border border-white/[0.08] flex items-center justify-center text-[#f0ede8] hover:bg-white/[0.12] active:scale-95 transition-all cursor-pointer"
          title="Previous story"
          aria-label="Previous story"
        >
          <SkipBack className="w-4 h-4 fill-current" />
        </button>

        {/* Large center play/pause (violet gradient circle) */}
        <button
          onClick={onTogglePlay}
          className="w-[62px] h-[62px] rounded-full shrink-0 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 bg-gradient-to-br from-[#9080ff] to-[#6a4cf7] shadow-[0_10px_28px_-6px_rgba(106,76,247,0.65)] border-2 border-[#3ecf8e]/40 text-[#0d0d0d]"
          title={isPlaying && !isPaused ? 'Pause narration' : 'Play narration'}
          aria-label={isPlaying && !isPaused ? 'Pause narration' : 'Play narration'}
        >
          {isPlaying && !isPaused ? (
            <Pause className="w-6 h-6 fill-[#0d0d0d]" />
          ) : (
            <Play className="w-6 h-6 fill-[#0d0d0d] ml-1" />
          )}
        </button>

        {/* Next (glass circle) */}
        <button
          onClick={onNext}
          className="w-11 h-11 rounded-full glass-card border border-white/[0.08] flex items-center justify-center text-[#f0ede8] hover:bg-white/[0.12] active:scale-95 transition-all cursor-pointer"
          title="Next story"
          aria-label="Next story"
        >
          <SkipForward className="w-4 h-4 fill-current" />
        </button>

        {/* Speed toggle chip cycling 1× → 1.25× → 1.5× */}
        <button
          onClick={onCycleRate}
          className="ml-auto font-mono text-[11px] font-semibold text-[#f0ede8] glass-card px-3.5 py-2 rounded-xl border border-white/[0.08] hover:bg-white/[0.12] active:scale-95 transition-all cursor-pointer"
          title="Change narration speed"
        >
          {playbackRate}×
        </button>
      </div>
    </div>
  );
}
