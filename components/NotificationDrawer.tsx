'use client';

import { X, Bell, Radio, CheckCircle, Clock } from 'lucide-react';
import { useState } from 'react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  storyCount: number;
  totalMinutes: number;
}

export function NotificationDrawer({
  isOpen,
  onClose,
  storyCount,
  totalMinutes,
}: NotificationDrawerProps) {
  const [morningBriefEnabled, setMorningBriefEnabled] = useState(true);
  const [breakingNewsEnabled, setBreakingNewsEnabled] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-[430px] bg-[#141414] border-t sm:border border-white/[0.12] rounded-t-[28px] sm:rounded-[28px] p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <Radio className="w-5 h-5 text-[#3ecf8e] animate-pulse" />
            <h3 className="font-ui text-sm font-semibold text-[#f0ede8]">Audio Brief Status</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center text-[#8a8480] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Audio Status Card */}
        <div className="my-4 p-4 rounded-2xl bg-[#3ecf8e]/10 border border-[#3ecf8e]/20 flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#3ecf8e] shadow-[0_0_10px_#3ecf8e]" />
          <div>
            <div className="text-xs font-bold text-[#3ecf8e] flex items-center gap-1.5">
              <span>BROADCAST ACTIVE</span>
              <span>·</span>
              <span>Aria Voice</span>
            </div>
            <p className="text-[11px] text-[#f0ede8]/80 mt-0.5">
              {storyCount} stories curated for your morning · ~{totalMinutes} min runtime
            </p>
          </div>
        </div>

        {/* Alert Preferences */}
        <div className="space-y-3 my-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.07]">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-[#9080ff]" />
              <div>
                <p className="text-xs font-medium text-[#f0ede8]">Morning Brief Ready</p>
                <p className="text-[10px] text-[#8a8480]">Daily at 7:00 AM IST</p>
              </div>
            </div>
            <button
              onClick={() => setMorningBriefEnabled(!morningBriefEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                morningBriefEnabled ? 'bg-[#6a4cf7]' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  morningBriefEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.07]">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-[#3ecf8e]" />
              <div>
                <p className="text-xs font-medium text-[#f0ede8]">Breaking Stories in Niches</p>
                <p className="text-[10px] text-[#8a8480]">Urgent alerts in your preferred niches</p>
              </div>
            </div>
            <button
              onClick={() => setBreakingNewsEnabled(!breakingNewsEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                breakingNewsEnabled ? 'bg-[#6a4cf7]' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  breakingNewsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6a4cf7] to-[#9080ff] text-white font-semibold text-xs transition-opacity hover:opacity-95 cursor-pointer shadow-lg shadow-[#6a4cf7]/25"
        >
          Done
        </button>
      </div>
    </div>
  );
}
