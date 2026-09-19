'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  Settings,
  Volume2,
  Clock,
  Bell,
  LogOut,
  Sparkles,
  Check,
  User,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentVoice?: string;
  currentPlaybackRate?: number;
  onVoiceChange?: (voice: string) => void;
  onPlaybackRateChange?: (rate: number) => void;
}

const VOICES = [
  { id: 'Aria', label: 'Aria', desc: 'Warm · British English' },
  { id: 'Kai', label: 'Kai', desc: 'Crisp · American English' },
  { id: 'Meera', label: 'Meera', desc: 'Bright · Indian English' },
];

const SPEEDS = [1.0, 1.25, 1.5, 2.0];
const TIMES = ['06:30 AM', '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM', '09:00 AM'];

export function SettingsModal({
  isOpen,
  onClose,
  currentVoice = 'Aria',
  currentPlaybackRate = 1.0,
  onVoiceChange,
  onPlaybackRateChange,
}: SettingsModalProps) {
  const router = useRouter();

  const [voice, setVoice] = useState(currentVoice);
  const [playbackRate, setPlaybackRate] = useState(currentPlaybackRate);
  const [deliveryTime, setDeliveryTime] = useState('07:00 AM');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleTestVoice = (voiceName: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        `Hello, this is Nuzio AI narrating in ${voiceName} voice.`
      );
      utterance.rate = playbackRate;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    setSavedSuccess(false);

    try {
      await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voice,
          delivery_time: deliveryTime,
          notifications_enabled: notificationsEnabled,
        }),
      });

      if (onVoiceChange) onVoiceChange(voice);
      if (onPlaybackRateChange) onPlaybackRateChange(playbackRate);

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch {
      router.push('/login');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-[460px] bg-[#0d0d0d] border border-white/[0.14] rounded-[32px] p-6 shadow-2xl relative flex flex-col max-h-[85vh] overflow-y-auto my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#6a4cf7]/20 border border-[#6a4cf7]/30 flex items-center justify-center text-[#9080ff]">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-ui font-bold text-lg text-[#f0ede8]">App Settings</h2>
              <p className="font-mono text-[9px] uppercase tracking-wider text-[#8a8480]">
                Audio Engine & Supabase Preferences
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

        {/* User Card */}
        <div className="mt-4 p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6a4cf7] to-[#9080ff] flex items-center justify-center text-white font-bold font-mono text-sm">
              A
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#f0ede8]">Aarav Sharma</h3>
              <p className="text-[10px] text-[#8a8480]">Founder / Builder · Mumbai, India</p>
            </div>
          </div>
          <span className="font-mono text-[9.5px] uppercase font-bold text-[#3ecf8e] bg-[#3ecf8e]/10 px-2 py-1 rounded-full border border-[#3ecf8e]/30">
            PRO DEMO
          </span>
        </div>

        {/* Audio Narrator Voice */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-[#3ecf8e]" />
              <label className="font-ui font-semibold text-xs text-[#f0ede8] uppercase tracking-wider">
                Narrator Voice
              </label>
            </div>
            <button
              type="button"
              onClick={() => handleTestVoice(voice)}
              className="text-[10.5px] font-mono text-[#9080ff] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-[#3ecf8e]" />
              Test Voice
            </button>
          </div>

          <div className="space-y-1.5">
            {VOICES.map((v) => {
              const active = voice === v.id;
              return (
                <div
                  key={v.id}
                  onClick={() => {
                    setVoice(v.id);
                    if (onVoiceChange) onVoiceChange(v.id);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    active
                      ? 'bg-[#6a4cf7]/20 border-[#6a4cf7] text-white shadow-sm'
                      : 'bg-white/[0.04] border-white/[0.08] text-[#8a8480] hover:bg-white/[0.07]'
                  }`}
                >
                  <div>
                    <p className="text-xs font-semibold text-[#f0ede8]">{v.label}</p>
                    <p className="text-[10px] text-[#8a8480]">{v.desc}</p>
                  </div>
                  {active && <Check className="w-4 h-4 text-[#3ecf8e]" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Playback Speed */}
        <div className="mt-4">
          <label className="font-ui font-semibold text-xs text-[#f0ede8] uppercase tracking-wider block mb-2">
            Playback Speed
          </label>
          <div className="grid grid-cols-4 gap-2">
            {SPEEDS.map((speed) => {
              const isSelected = playbackRate === speed;
              return (
                <button
                  key={speed}
                  type="button"
                  onClick={() => {
                    setPlaybackRate(speed);
                    if (onPlaybackRateChange) onPlaybackRateChange(speed);
                  }}
                  className={`py-2 rounded-xl text-center font-mono text-xs font-bold border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#6a4cf7] text-white border-[#6a4cf7] shadow-md shadow-[#6a4cf7]/30'
                      : 'bg-white/[0.04] border-white/[0.08] text-[#8a8480] hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  {speed}x
                </button>
              );
            })}
          </div>
        </div>

        {/* Delivery Timing */}
        <div className="mt-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Clock className="w-4 h-4 text-[#9080ff]" />
            <label className="font-ui font-semibold text-xs text-[#f0ede8] uppercase tracking-wider">
              Morning Delivery Time
            </label>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {TIMES.map((time) => {
              const active = deliveryTime === time;
              return (
                <button
                  key={time}
                  type="button"
                  onClick={() => setDeliveryTime(time)}
                  className={`py-2 px-1 rounded-xl text-center font-mono text-xs font-semibold border transition-all cursor-pointer ${
                    active
                      ? 'bg-[#3ecf8e]/20 text-[#3ecf8e] border-[#3ecf8e]'
                      : 'bg-white/[0.04] border-white/[0.08] text-[#8a8480] hover:bg-white/[0.08]'
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notifications */}
        <div className="mt-4 p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bell className="w-4 h-4 text-[#9080ff]" />
            <div>
              <p className="text-xs font-semibold text-[#f0ede8]">Breaking News Alerts</p>
              <p className="text-[10px] text-[#8a8480]">Receive urgent audio notifications</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
              notificationsEnabled ? 'bg-[#3ecf8e]' : 'bg-white/20'
            }`}
            aria-label="Toggle alerts"
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Supabase Status Banner */}
        <div className="mt-4 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#3ecf8e]" />
            <span className="text-[#8a8480]">Supabase Database Sync</span>
          </div>
          <span className="font-mono text-[9px] font-bold text-[#3ecf8e] bg-[#3ecf8e]/10 px-2 py-0.5 rounded">
            bqqbsvuokbyscktmlbvn
          </span>
        </div>

        {/* Actions */}
        <div className="pt-4 mt-4 border-t border-white/[0.08] space-y-2">
          <button
            type="button"
            onClick={handleSavePreferences}
            disabled={saving}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#6a4cf7] to-[#9080ff] hover:opacity-95 text-xs font-bold text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-[#6a4cf7]/25"
          >
            {saving ? (
              <span>Saving to Supabase...</span>
            ) : savedSuccess ? (
              <span className="text-[#3ecf8e] flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Saved & Synced!
              </span>
            ) : (
              <span>Save & Sync to Supabase</span>
            )}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-red-500/15 border border-white/[0.08] hover:border-red-500/40 text-xs font-semibold text-[#8a8480] hover:text-red-400 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
