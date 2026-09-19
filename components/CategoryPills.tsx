'use client';

import { NewsCategory } from '@/lib/types';

interface CategoryPillsProps {
  categories: NewsCategory[];
  activeCategory: NewsCategory;
  onSelectCategory: (cat: NewsCategory) => void;
  isLoading?: boolean;
}

const DEFAULT_CATEGORIES: NewsCategory[] = [
  'All',
  'AI & Tech',
  'Markets',
  'Startups',
  'Science',
  'Global',
];

export function CategoryPills({
  categories = DEFAULT_CATEGORIES,
  activeCategory,
  onSelectCategory,
  isLoading = false,
}: CategoryPillsProps) {
  return (
    <div className="flex items-center gap-2 px-5 py-3 overflow-x-auto no-scrollbar scroll-smooth">
      {categories.map((cat) => {
        const isActive = activeCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            disabled={isLoading}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-[11.5px] font-semibold transition-all duration-200 cursor-pointer select-none active:scale-95 ${
              isActive
                ? 'bg-[#3ecf8e] text-[#052015] shadow-[0_0_14px_rgba(62,207,142,0.35)]'
                : 'bg-white/[0.06] text-[#8a8480] hover:text-[#f0ede8] hover:bg-white/[0.10] border border-white/[0.11]'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
