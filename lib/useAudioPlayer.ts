'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Article } from './types';

export function useAudioPlayer(articles: Article[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<1 | 1.25 | 1.5>(1);
  const [elapsedSecs, setElapsedSecs] = useState(0);
  const [currentSpokenText, setCurrentSpokenText] = useState('');
  
  const currentArticle = articles[currentIndex] || null;
  // Estimated duration in seconds (based on readTimeMins or word count, adjusted by playbackRate)
  const totalSecs = currentArticle 
    ? Math.max(30, Math.round((currentArticle.readTimeMins * 60) / playbackRate))
    : 120;

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const fullTextRef = useRef<string>('');

  // Clean stop of speech
  const stopSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Advance to next story
  const handleNext = useCallback(() => {
    if (articles.length === 0) return;
    stopSpeech();
    setCurrentIndex((prev) => (prev + 1) % articles.length);
    setElapsedSecs(0);
  }, [articles.length, stopSpeech]);

  // Go to previous story
  const handlePrev = useCallback(() => {
    if (articles.length === 0) return;
    stopSpeech();
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
    setElapsedSecs(0);
  }, [articles.length, stopSpeech]);

  // Start speaking current article
  const speakCurrent = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !currentArticle) {
      return;
    }

    stopSpeech();

    const fullScript = `${currentArticle.headline}. ${currentArticle.narrationText}`;
    fullTextRef.current = fullScript;
    setCurrentSpokenText(currentArticle.headline);

    const utterance = new SpeechSynthesisUtterance(fullScript);
    utterance.rate = playbackRate;
    utterance.pitch = 1.0;

    // Pick best available natural voice (preference: Aria, Google, Natural, or English)
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        v.name.includes('Aria') ||
        v.name.includes('Google UK English Female') ||
        v.name.includes('Google US English') ||
        v.name.includes('Samantha') ||
        (v.lang.startsWith('en') && v.name.includes('Natural'))
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    // Track word boundaries for live transcript
    utterance.onboundary = (event) => {
      if (event.name === 'word' || event.charIndex !== undefined) {
        const charIdx = event.charIndex;
        // Grab current sentence or slice for transcript strip
        const remaining = fullScript.slice(charIdx);
        const nextSentenceEnd = remaining.indexOf('.');
        const activeChunk = nextSentenceEnd > 0 
          ? remaining.slice(0, nextSentenceEnd) 
          : remaining.slice(0, 60);
        
        setCurrentSpokenText(activeChunk || currentArticle.headline);
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

    // Auto-advance on end
    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
      // Automatically advance to next article
      if (currentIndex < articles.length - 1) {
        handleNext();
      } else {
        setElapsedSecs(0);
      }
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error/cancelled:', e);
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);

    // Progress timer tick
    intervalRef.current = setInterval(() => {
      setElapsedSecs((prev) => {
        if (prev >= totalSecs) {
          return totalSecs;
        }
        return prev + 1;
      });
    }, 1000);
  }, [currentArticle, playbackRate, totalSecs, currentIndex, articles.length, handleNext, stopSpeech]);

  // Toggle Play / Pause
  const togglePlayPause = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    if (isPlaying && !isPaused) {
      // Pause
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else if (isPaused) {
      // Resume
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      intervalRef.current = setInterval(() => {
        setElapsedSecs((prev) => Math.min(totalSecs, prev + 1));
      }, 1000);
    } else {
      // Start fresh
      speakCurrent();
    }
  }, [isPlaying, isPaused, speakCurrent, totalSecs]);

  // Toggle speed (1x -> 1.25x -> 1.5x -> 1x)
  const cycleRate = useCallback(() => {
    const nextRate: 1 | 1.25 | 1.5 =
      playbackRate === 1 ? 1.25 : playbackRate === 1.25 ? 1.5 : 1;
    setPlaybackRate(nextRate);

    // If currently playing, re-speak at new rate from current context
    if (isPlaying) {
      stopSpeech();
      setTimeout(() => {
        if (typeof window !== 'undefined' && currentArticle) {
          const fullScript = `${currentArticle.headline}. ${currentArticle.narrationText}`;
          const utterance = new SpeechSynthesisUtterance(fullScript);
          utterance.rate = nextRate;
          utteranceRef.current = utterance;
          window.speechSynthesis.speak(utterance);
          setIsPlaying(true);
          setIsPaused(false);
        }
      }, 100);
    }
  }, [playbackRate, isPlaying, stopSpeech, currentArticle]);

  // Scrub progress
  const seekToRatio = useCallback((ratio: number) => {
    const newSecs = Math.round(ratio * totalSecs);
    setElapsedSecs(newSecs);
  }, [totalSecs]);

  // Cleanup on unmount or index change
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, [stopSpeech]);

  // Reset progress on story change
  useEffect(() => {
    setElapsedSecs(0);
    if (currentArticle) {
      setCurrentSpokenText(currentArticle.headline);
    }
  }, [currentIndex, currentArticle]);

  return {
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
  };
}
