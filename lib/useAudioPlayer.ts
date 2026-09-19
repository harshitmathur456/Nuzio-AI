'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Article } from './types';

export function useAudioPlayer(articles: Article[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeArticleOverride, setActiveArticleOverride] = useState<Article | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<1 | 1.25 | 1.5>(1);
  const [progressRatio, setProgressRatio] = useState(0); // 0 to 1
  const [currentSpokenText, setCurrentSpokenText] = useState('');

  // The active article is either an override (e.g. search result swapped in) or the queue article
  const currentArticle = activeArticleOverride || articles[currentIndex] || null;
  const durationSec = currentArticle?.durationSec || 40;
  const elapsedSecs = Math.round(progressRatio * durationSec);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const fullTextRef = useRef<string>('');
  const totalLengthRef = useRef<number>(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clean stop
  const cancelUtterance = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Play article narration
  const playArticle = useCallback((article: Article, rate: number = playbackRate) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !article) {
      return;
    }

    cancelUtterance();

    // Narrate headline + ". " + body (or for search items: title + ". From " + source)
    let scriptToSpeak = '';
    if (article.isSearchItem || !article.body) {
      scriptToSpeak = `${article.headline}. From ${article.source}.`;
    } else {
      scriptToSpeak = `${article.headline}. ${article.body}`;
    }

    fullTextRef.current = scriptToSpeak;
    totalLengthRef.current = Math.max(1, scriptToSpeak.length);
    setCurrentSpokenText(article.headline);

    const utterance = new SpeechSynthesisUtterance(scriptToSpeak);
    utterance.rate = rate;
    utterance.pitch = 1.0;

    // Select natural voice (Aria preference)
    const voices = window.speechSynthesis.getVoices();
    const ariaVoice = voices.find((v) => v.name.includes('Aria')) ||
      voices.find((v) => v.name.includes('Google UK English Female')) ||
      voices.find((v) => v.name.includes('Google US English')) ||
      voices.find((v) => v.lang.startsWith('en'));

    if (ariaVoice) {
      utterance.voice = ariaVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    // Driven by the Speech Synthesis boundary event (char index ÷ total length)
    // mapped against estimated duration
    utterance.onboundary = (event) => {
      if (event.charIndex !== undefined) {
        const ratio = Math.min(1, Math.max(0, event.charIndex / totalLengthRef.current));
        setProgressRatio(ratio);

        // Update transcript snippet
        const remaining = fullTextRef.current.slice(event.charIndex);
        const nextPeriod = remaining.indexOf('.');
        const snippet = nextPeriod > 0 ? remaining.slice(0, nextPeriod) : remaining.slice(0, 50);
        if (snippet.trim()) {
          setCurrentSpokenText(snippet.trim());
        }
      }
    };

    utterance.onpause = () => {
      setIsPaused(true);
      setIsPlaying(false);
    };

    utterance.onresume = () => {
      setIsPaused(false);
      setIsPlaying(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setProgressRatio(1);
      if (intervalRef.current) clearInterval(intervalRef.current);

      // Auto-advance if not playing a search item
      if (!article.isSearchItem && currentIndex < articles.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setProgressRatio(0);
      }
    };

    utterance.onerror = (e) => {
      // ignore canceled errors
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        console.warn('SpeechSynthesis error:', e.error);
      }
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  }, [cancelUtterance, playbackRate, currentIndex, articles.length]);

  // Handle Play/Pause
  const togglePlayPause = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !currentArticle) {
      return;
    }

    if (isPlaying && !isPaused) {
      // Pause: uses speechSynthesis.pause() — never cancel+restart
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    } else if (isPaused) {
      // Resume: uses speechSynthesis.resume()
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
    } else {
      // Fresh start
      playArticle(currentArticle, playbackRate);
    }
  }, [isPlaying, isPaused, currentArticle, playArticle, playbackRate]);

  // Next: cancels current utterance and starts the new one
  const handleNext = useCallback(() => {
    if (articles.length === 0) return;
    setActiveArticleOverride(null);
    cancelUtterance();
    const nextIdx = (currentIndex + 1) % articles.length;
    setCurrentIndex(nextIdx);
    setProgressRatio(0);
    const nextArticle = articles[nextIdx];
    if (nextArticle) {
      playArticle(nextArticle, playbackRate);
    }
  }, [articles, currentIndex, cancelUtterance, playArticle, playbackRate]);

  // Previous: cancels current utterance and starts the previous one
  const handlePrev = useCallback(() => {
    if (articles.length === 0) return;
    setActiveArticleOverride(null);
    cancelUtterance();
    const prevIdx = (currentIndex - 1 + articles.length) % articles.length;
    setCurrentIndex(prevIdx);
    setProgressRatio(0);
    const prevArticle = articles[prevIdx];
    if (prevArticle) {
      playArticle(prevArticle, playbackRate);
    }
  }, [articles, currentIndex, cancelUtterance, playArticle, playbackRate]);

  // Changing speed: restarts current utterance at the new rate
  const cycleRate = useCallback(() => {
    const nextRate: 1 | 1.25 | 1.5 =
      playbackRate === 1 ? 1.25 : playbackRate === 1.25 ? 1.5 : 1;
    setPlaybackRate(nextRate);

    if (currentArticle && (isPlaying || isPaused)) {
      // Web Speech API can't change rate mid-utterance: restart at new rate
      playArticle(currentArticle, nextRate);
    }
  }, [playbackRate, currentArticle, isPlaying, isPaused, playArticle]);

  // Jump directly to specific story in the queue
  const playStoryAtIndex = useCallback((index: number) => {
    if (index >= 0 && index < articles.length) {
      setActiveArticleOverride(null);
      setCurrentIndex(index);
      setProgressRatio(0);
      playArticle(articles[index], playbackRate);
    }
  }, [articles, playArticle, playbackRate]);

  // Play a search result item swapped into the player
  const playSearchResult = useCallback((item: { title: string; link: string; source: string; pubDate: string }) => {
    const searchArticle: Article = {
      id: `search-${Date.now()}`,
      category: 'Global',
      headline: item.title,
      standfirst: `Live from ${item.source}`,
      body: `Reporting from ${item.source}: ${item.title}. Published recently on Google News.`,
      source: item.source,
      sourceUrl: item.link,
      publishedAt: item.pubDate,
      durationSec: 25,
      isSearchItem: true,
    };

    setActiveArticleOverride(searchArticle);
    setProgressRatio(0);
    playArticle(searchArticle, playbackRate);
  }, [playArticle, playbackRate]);

  // Scrub progress
  const seekToRatio = useCallback((ratio: number) => {
    setProgressRatio(ratio);
  }, []);

  // Always cancel on unmount
  useEffect(() => {
    return () => {
      cancelUtterance();
    };
  }, [cancelUtterance]);

  return {
    currentIndex,
    currentArticle,
    isPlaying,
    isPaused,
    playbackRate,
    progressRatio,
    elapsedSecs,
    durationSec,
    currentSpokenText,
    isSearchPlaying: Boolean(activeArticleOverride?.isSearchItem),
    togglePlayPause,
    handleNext,
    handlePrev,
    cycleRate,
    playStoryAtIndex,
    playSearchResult,
    seekToRatio,
  };
}
