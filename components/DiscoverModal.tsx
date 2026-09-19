'use client';

import { X, Play, Sparkles } from 'lucide-react';
import { Article } from '@/lib/types';

interface DiscoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  onSelectArticle: (index: number) => void;
}

export function DiscoverModal({
  isOpen,
  onClose,
  articles,
  onSelectArticle,
}: DiscoverModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-[430px] bg-[#141414] border-t sm:border border-white/[0.12] rounded-t-[28px] sm:rounded-[28px] p-6 shadow-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#3ecf8e]" />
            <h3 className="font-ui text-sm font-semibold text-[#f0ede8]">Discover Wire Feed</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center text-[#8a8480] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stories list */}
        <div className="flex-1 overflow-y-auto space-y-3 pt-3 pr-1">
          {articles.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => {
                onSelectArticle(idx);
                onClose();
              }}
              className="p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] cursor-pointer transition-all flex flex-col gap-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] text-[#9080ff] uppercase font-bold tracking-wider">
                  {item.category}
                </span>
                <span className="font-mono text-[10px] text-[#8a8480]">
                  {item.source} · {item.readTimeMins} MIN
                </span>
              </div>
              <h4 className="font-display text-base text-[#f0ede8] leading-tight group-hover:text-[#3ecf8e] transition-colors">
                {item.headline}
              </h4>
              <p className="text-[11.5px] text-[#8a8480] line-clamp-2 leading-relaxed">
                {item.summary}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-[#3ecf8e] font-semibold mt-1">
                <Play className="w-3 h-3 fill-current" />
                <span>Play this story</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
