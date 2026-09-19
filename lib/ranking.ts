import { Article } from './types';

/**
 * Personalization & Ranking Logic:
 * score(article) = (isPreferredCategory ? 100 : 0) - ageInHours
 * 
 * Guarantees a preferred-category story always outranks a non-preferred one,
 * while still surfacing the freshest story within a category.
 */
export function scoreArticle(article: Article, preferredCategories: string[]): { score: number; isPreferred: boolean } {
  const isPreferred = preferredCategories.length > 0 && 
    !preferredCategories.includes('All') && 
    preferredCategories.includes(article.category);
  
  const publishTime = new Date(article.publishedAt).getTime();
  const now = Date.now();
  const ageInHours = Math.max(0, (now - publishTime) / (1000 * 60 * 60));

  const categoryBoost = isPreferred ? 100 : 0;
  const score = Number((categoryBoost - ageInHours).toFixed(2));

  return { score, isPreferred };
}

/**
 * Rank articles by personalization score (descending)
 */
export function rankArticles(articles: Article[], preferredCategories: string[] = []): Article[] {
  return articles
    .map((article) => {
      const { score, isPreferred } = scoreArticle(article, preferredCategories);
      return {
        ...article,
        score,
        isPreferred,
      };
    })
    .sort((a, b) => {
      // Primary: Score descending
      if (b.score! !== a.score!) {
        return b.score! - a.score!;
      }
      // Secondary: Freshness descending
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
}
