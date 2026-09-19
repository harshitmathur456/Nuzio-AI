export type NewsCategory = 'All' | 'AI & Tech' | 'Markets' | 'Startups' | 'Science' | 'Global';

export interface Article {
  id: string;
  category: Exclude<NewsCategory, 'All'>;
  headline: string;
  summary: string;
  narrationText: string;
  source: string;
  sourceUrl: string;
  readTimeMins: number;
  publishedAt: string; // ISO 8601 string
  accentGradient: [string, string];
  score?: number;
  saved?: boolean;
}

export interface UserPreference {
  userId: string;
  categories: string[];
  updatedAt: string;
}

export interface PlaybackState {
  currentArticleIndex: number;
  isPlaying: boolean;
  isPaused: boolean;
  elapsedSecs: number;
  totalSecs: number;
  playbackRate: 1 | 1.25 | 1.5;
  currentSpokenText?: string;
  currentWordIndex?: number;
}
