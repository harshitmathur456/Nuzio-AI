import { Article } from './types';

/**
 * Personalization & Ranking Logic (PRD Section 7):
 * score(article) = (isPreferredCategory ? 100 : 0) - ageInHours
 * 
 * Guarantees a preferred-category story always outranks a non-preferred one,
 * while still surfacing the freshest story within a category.
 */
export function scoreArticle(article: Article, preferredCategories: string[]): number {
  // Check if article belongs to any preferred category
  // If preferredCategories is empty or contains 'All', all categories get baseline 0 (ranked purely by freshness)
  const isPreferred = preferredCategories.length > 0 && 
    !preferredCategories.includes('All') && 
    preferredCategories.includes(article.category);
  
  const publishTime = new Date(article.publishedAt).getTime();
  const now = Date.now();
  const ageInHours = Math.max(0, (now - publishTime) / (1000 * 60 * 60));

  const categoryBoost = isPreferred ? 100 : 0;
  return Number((categoryBoost - ageInHours).toFixed(2));
}

/**
 * Rank articles by personalization score (descending)
 */
export function rankArticles(articles: Article[], preferredCategories: string[] = []): Article[] {
  return articles
    .map((article) => ({
      ...article,
      score: scoreArticle(article, preferredCategories),
    }))
    .sort((a, b) => {
      // Primary: Score descending
      if (b.score! !== a.score!) {
        return b.score! - a.score!;
      }
      // Secondary: Freshness descending (most recent first)
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
}
