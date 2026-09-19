'use client';

import { X, Volume2, Database, ShieldCheck, LogOut, Check } from 'lucide-react';
import { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  isSupabaseLive: boolean;
  onLogout: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  userName,
  isSupabaseLive,
  onLogout,
}: SettingsModalProps) {
  const [selectedVoice, setSelectedVoice] = useState('Aria');
  const [autoAdvance, setAutoAdvance] = useState(true);

  if (!isOpen) return null;

  const voices = [
    { id: 'Aria', label: 'Aria', desc: 'Warm · Unhurried · British English' },
    { id: 'Kai', label: 'Kai', desc: 'Crisp · Focused · American English' },
    { id: 'Meera', label: 'Meera', desc: 'Bright · Curious · Indian English' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-[430px] bg-[#141414] border-t sm:border border-white/[0.12] rounded-t-[28px] sm:rounded-[28px] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <h3 className="font-ui text-sm font-semibold text-[#f0ede8]">Audio Settings</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center text-[#8a8480] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Card */}
        <div className="my-4 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6a4cf7] to-[#9080ff] flex items-center justify-center font-bold text-white text-base">
            {userName[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-[#f0ede8] truncate">{userName}</h4>
            <p className="text-[11px] text-[#8a8480]">Technology &middot; Mumbai, India</p>
          </div>
          <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-[#3ecf8e]/10 text-[#3ecf8e] border border-[#3ecf8e]/30 font-bold">
            PRO
          </span>
        </div>

        {/* Narrator Voice Selection */}
        <div className="my-4">
          <p className="font-mono text-[9px] tracking-wider uppercase text-[#8a8480] mb-2 font-semibold">
            Narrator Voice
          </p>
          <div className="space-y-2">
            {voices.map((v) => {
              const active = selectedVoice === v.id;
              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedVoice(v.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    active
                      ? 'bg-[#6a4cf7]/15 border-[#6a4cf7] text-white'
                      : 'bg-white/[0.03] border-white/[0.06] text-[#8a8480] hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Volume2 className={`w-4 h-4 ${active ? 'text-[#3ecf8e]' : 'text-[#8a8480]'}`} />
                    <div>
                      <p className="text-xs font-semibold text-[#f0ede8]">{v.label}</p>
                      <p className="text-[10px] text-[#8a8480]">{v.desc}</p>
                    </div>
                  </div>
                  {active && <Check className="w-4 h-4 text-[#3ecf8e]" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Playback Preferences */}
        <div className="my-4 space-y-2.5">
          <p className="font-mono text-[9px] tracking-wider uppercase text-[#8a8480] mb-1 font-semibold">
            Playback Preferences
          </p>
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.07]">
            <div>
              <p className="text-xs font-medium text-[#f0ede8]">Auto-Advance</p>
              <p className="text-[10px] text-[#8a8480]">Play the next story automatically</p>
            </div>
            <button
              onClick={() => setAutoAdvance(!autoAdvance)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                autoAdvance ? 'bg-[#3ecf8e]' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  autoAdvance ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Backend / Supabase Connection Status */}
        <div className="my-4 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <div className="flex items-center gap-2 mb-1">
            <Database className="w-3.5 h-3.5 text-[#9080ff]" />
            <span className="font-mono text-[9.5px] uppercase font-bold text-[#f0ede8]">
              Backend Infrastructure
            </span>
          </div>
          <div className="flex items-center justify-between mt-1 text-[11px]">
            <span className="text-[#8a8480]">Supabase Auth & RLS</span>
            <span
              className={`font-mono text-[9.5px] px-2 py-0.5 rounded-full font-semibold ${
                isSupabaseLive
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              {isSupabaseLive ? '● Live Supabase' : '● Demo Mode'}
            </span>
          </div>
        </div>

        {/* Sign Out CTA */}
        <div className="pt-2">
          <button
            onClick={onLogout}
            className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
