export type Category = "AI & Tech" | "Markets" | "Startups" | "Science" | "Global";
export type NewsCategory = "All" | Category;

export interface Article {
  id: string;
  category: Category;
  headline: string;
  standfirst: string;
  body: string;
  source: string;
  publishedAt: string; // ISO 8601 string
  durationSec: number;
  sourceUrl?: string;
  isSearchItem?: boolean;
  score?: number;
  isPreferred?: boolean;
  saved?: boolean;
}

export interface GoogleNewsItem {
  title: string;
  link: string;
  source: string;
  pubDate: string;
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
}
