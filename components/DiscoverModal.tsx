'use client';

import { X, Compass, Flame, Radio, Search, Play, ArrowUpRight, Sparkles } from 'lucide-react';

interface DiscoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTopic: (topicQuery: string) => void;
}

const TRENDING_TOPICS = [
  {
    tag: 'AI & Tech',
    title: 'Tata & Nvidia 16,000 GPU AI cluster across India',
    source: 'Economic Times',
    time: '2m ago',
    query: 'Nvidia Tata AI GPU India',
  },
  {
    tag: 'Markets',
    title: 'RBI holds repo rate at 6.5% as retail inflation eases',
    source: 'Bloomberg',
    time: '8m ago',
    query: 'RBI repo rate retail inflation India',
  },
  {
    tag: 'Startups',
    title: 'Zepto closes $350M round led by domestic family offices at $5B',
    source: 'TechCrunch',
    time: '15m ago',
    query: 'Zepto funding quick commerce valuation',
  },
  {
    tag: 'Science',
    title: 'ISRO finalizes timeline for Chandrayaan-4 sample return',
    source: 'Reuters',
    time: '32m ago',
    query: 'ISRO Chandrayaan 4 space mission India',
  },
  {
    tag: 'Global Tech',
    title: 'Anthropic ships Claude 4.5 with 2M-token memory and native tools',
    source: 'The Verge',
    time: '1h ago',
    query: 'Anthropic Claude AI model update',
  },
];

const CURATED_CHANNELS = [
  {
    id: 'founder_daily',
    title: 'The Indian Founder Daily',
    desc: 'Fundraising, product playbooks, hiring, and regulatory shifts.',
    storiesCount: '6 stories',
    query: 'Indian startups founders venture capital funding',
  },
  {
    id: 'dalal_street',
    title: 'Dalal Street & Macro Pulse',
    desc: 'Nifty 50, RBI policy, corporate earnings, and global trade bonds.',
    storiesCount: '8 stories',
    query: 'Indian stock market Nifty Sensex corporate earnings',
  },
  {
    id: 'deeptech_mission',
    title: 'Semiconductor & DeepTech Mission',
    desc: 'Fab investments, quantum computing, EV batteries, and aerospace.',
    storiesCount: '5 stories',
    query: 'India semiconductor fab deep tech hardware',
  },
];

export function DiscoverModal({ isOpen, onClose, onSelectTopic }: DiscoverModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-[480px] bg-[#0d0d0d] border border-white/[0.14] rounded-[32px] p-6 shadow-2xl relative flex flex-col max-h-[85vh] overflow-y-auto my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#3ecf8e]/15 border border-[#3ecf8e]/30 flex items-center justify-center text-[#3ecf8e]">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-ui font-bold text-lg text-[#f0ede8]">Discover & Explore</h2>
              <p className="font-mono text-[9px] uppercase tracking-wider text-[#8a8480]">
                Trending Topics & Curated Feeds
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-[#8a8480] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Trending Stories */}
        <div className="mt-4">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Flame className="w-4 h-4 text-[#ff5c5c]" />
            <h3 className="font-ui font-semibold text-xs text-[#f0ede8] uppercase tracking-wider">
              Trending Stories in India & Tech
            </h3>
          </div>

          <div className="space-y-2">
            {TRENDING_TOPICS.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onSelectTopic(item.query);
                  onClose();
                }}
                className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-[#3ecf8e]/40 transition-all cursor-pointer group flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[9px] uppercase font-bold text-[#3ecf8e] bg-[#3ecf8e]/10 px-1.5 py-0.5 rounded">
                      {item.tag}
                    </span>
                    <span className="text-[10px] text-[#8a8480]">{item.source} · {item.time}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-[#f0ede8] group-hover:text-white line-clamp-2 leading-relaxed">
                    {item.title}
                  </h4>
                </div>
                <div className="w-7 h-7 rounded-full bg-white/[0.06] group-hover:bg-[#3ecf8e] flex items-center justify-center text-[#8a8480] group-hover:text-black shrink-0 transition-colors mt-1">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Curated Channels */}
        <div className="mt-5">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Radio className="w-4 h-4 text-[#6a4cf7]" />
            <h3 className="font-ui font-semibold text-xs text-[#f0ede8] uppercase tracking-wider">
              Curated Audio Channels
            </h3>
          </div>

          <div className="space-y-2">
            {CURATED_CHANNELS.map((channel) => (
              <div
                key={channel.id}
                onClick={() => {
                  onSelectTopic(channel.query);
                  onClose();
                }}
                className="p-3.5 rounded-2xl bg-[#6a4cf7]/10 hover:bg-[#6a4cf7]/20 border border-[#6a4cf7]/20 hover:border-[#6a4cf7]/50 transition-all cursor-pointer group flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="text-xs font-bold text-white group-hover:text-[#9080ff] transition-colors">
                      {channel.title}
                    </h4>
                    <span className="font-mono text-[9px] text-[#9080ff] bg-white/[0.06] px-1.5 py-0.5 rounded">
                      {channel.storiesCount}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#8a8480] leading-normal">{channel.desc}</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#9080ff] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 ml-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Footer Action */}
        <div className="pt-4 mt-4 border-t border-white/[0.08] text-center">
          <p className="text-[10.5px] text-[#8a8480]">
            Select any topic to search Google News and immediately play audio briefing.
          </p>
        </div>
      </div>
    </div>
  );
}
