'use client';

import { useState } from 'react';
import { Article } from '@/lib/types';
import { Search, X, Play, Clock, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  onSelectArticle: (index: number) => void;
}

export function SearchModal({
  isOpen,
  onClose,
  articles,
  onSelectArticle,
}: SearchModalProps) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = articles.filter(
    (a) =>
      a.headline.toLowerCase().includes(query.toLowerCase()) ||
      a.summary.toLowerCase().includes(query.toLowerCase()) ||
      a.source.toLowerCase().includes(query.toLowerCase()) ||
      a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-[430px] bg-[#141414] border-t sm:border border-white/[0.12] rounded-t-[28px] sm:rounded-[28px] p-5 shadow-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#9080ff]" />
            <h3 className="font-ui text-sm font-semibold text-[#f0ede8]">Search News Brief</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center text-[#8a8480] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input box */}
        <div className="my-4 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search AI, Markets, Startups, RBI..."
            autoFocus
            className="w-full bg-white/[0.06] border border-white/[0.12] rounded-xl px-4 py-3 text-sm text-[#f0ede8] placeholder-[#8a8480] focus:outline-none focus:border-[#6a4cf7] transition-colors"
          />
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-[#8a8480] text-xs">
              No matching stories found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((item) => {
              const originalIndex = articles.findIndex((a) => a.id === item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectArticle(originalIndex);
                    onClose();
                  }}
                  className="p-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] cursor-pointer transition-all flex items-start gap-3 group"
                >
                  <div className="w-8 h-8 rounded-full bg-[#6a4cf7]/20 flex items-center justify-center shrink-0 text-[#9080ff] group-hover:bg-[#6a4cf7] group-hover:text-white transition-colors">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[8.5px] text-[#3ecf8e] uppercase font-bold">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-[#8a8480] font-mono">· {item.source}</span>
                    </div>
                    <p className="font-display text-sm text-[#f0ede8] line-clamp-2 leading-snug">
                      {item.headline}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-0.5 transition-all self-center" />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
