'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  Sparkles,
  Volume2,
  Clock,
  Bell,
  MapPin,
  Lock,
  Mail,
  User,
  CheckCircle2,
  Loader2,
  Navigation,
} from 'lucide-react';

interface DemoOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PROFESSIONS = [
  'Technology',
  'Founder / Builder',
  'Finance & Trading',
  'Consulting',
  'Marketing & Media',
  'Legal',
  'Healthcare',
  'Government & Policy',
  'Real Estate',
  'Education',
];

const NICHES = [
  { id: 'AI & Tech', label: 'AI & Technology' },
  { id: 'Markets', label: 'Financial Markets' },
  { id: 'Startups', label: 'Startups & VC' },
  { id: 'Science', label: 'Science & Space' },
  { id: 'Global', label: 'Global Politics' },
  { id: 'Indian Business', label: 'Indian Business' },
  { id: 'Climate & Energy', label: 'Climate & Energy' },
  { id: 'Geopolitics', label: 'Geopolitics' },
];

const VOICES = [
  { id: 'Aria', label: 'Aria', desc: 'Warm · Unhurried · British English' },
  { id: 'Kai', label: 'Kai', desc: 'Crisp · Focused · American English' },
  { id: 'Meera', label: 'Meera', desc: 'Bright · Curious · Indian English' },
];

const DELIVERY_TIMES = ['06:30 AM', '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM', '09:00 AM'];
const QUICK_CITIES = ['Mumbai', 'Bengaluru', 'Delhi NCR', 'Hyderabad', 'Pune'];

export function DemoOnboardingModal({ isOpen, onClose }: DemoOnboardingModalProps) {
  const router = useRouter();

  // Wizard Step (1 to 7)
  const [step, setStep] = useState(1);

  // Form State
  const [email, setEmail] = useState('aarav.sharma@nuzio.ai');
  const [password, setPassword] = useState('Nuzio@2026');
  const [fullName, setFullName] = useState('Aarav Sharma');

  const [language, setLanguage] = useState<'English' | 'Hindi'>('English');
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [locationText, setLocationText] = useState('Mumbai, India (Hyperlocal news)');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const [profession, setProfession] = useState('Technology');
  const [selectedNiches, setSelectedNiches] = useState<string[]>(['AI & Tech', 'Markets', 'Startups']);

  const [voice, setVoice] = useState('Aria');
  const [briefLength, setBriefLength] = useState('10 min');

  const [deliveryTime, setDeliveryTime] = useState('07:00 AM');
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleNiche = (nicheId: string) => {
    if (selectedNiches.includes(nicheId)) {
      if (selectedNiches.length > 1) {
        setSelectedNiches(selectedNiches.filter((n) => n !== nicheId));
      }
    } else {
      if (selectedNiches.length < 7) {
        setSelectedNiches([...selectedNiches, nicheId]);
      }
    }
  };

  const prefillDemoData = () => {
    const randomId = Math.floor(Math.random() * 900) + 100;
    setEmail(`demo.user${randomId}@nuzio.ai`);
    setPassword(`Nuzio@${randomId}`);
    setFullName('Harshit Mathur');
    setProfession('Founder / Builder');
    setSelectedNiches(['AI & Tech', 'Markets', 'Startups']);
  };

  const handleToggleLocation = () => {
    if (!locationEnabled) {
      setLocationEnabled(true);
      setIsDetectingLocation(true);
      setLocationText('Detecting GPS & City location...');

      if (typeof window !== 'undefined' && 'geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setIsDetectingLocation(false);
            setLocationText('📍 Mumbai, Maharashtra (Hyperlocal active)');
          },
          (err) => {
            setIsDetectingLocation(false);
            setLocationText('📍 Mumbai, India (Hyperlocal active)');
          },
          { timeout: 4000 }
        );
      } else {
        setIsDetectingLocation(false);
        setLocationText('📍 Mumbai, India (Hyperlocal news)');
      }
    } else {
      setLocationEnabled(false);
      setLocationText('Location disabled (Global coverage)');
    }
  };

  // Submit complete onboarding to backend API which directly writes to Supabase
  const handleCompleteOnboarding = async () => {
    setLoading(true);
    setErrorMsg(null);

    // Map selected niches to primary categories
    const primaryCategories = selectedNiches.map((n) => {
      if (n.includes('Tech') || n.includes('AI')) return 'AI & Tech';
      if (n.includes('Market')) return 'Markets';
      if (n.includes('Startup')) return 'Startups';
      if (n.includes('Science')) return 'Science';
      return 'Global';
    });
    const uniqueCategories = Array.from(new Set(primaryCategories));

    try {
      // Send directly to backend API (handles Supabase auth & postgres preferences without frontend client limits)
      const res = await fetch('/api/auth/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          password,
          profession,
          categories: uniqueCategories,
          voice,
          briefLength,
          deliveryTime,
          language,
          location: locationText,
          notificationsEnabled,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to save profile to server');
      }

      // Close and navigate to news
      onClose();
      router.push('/news');
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save demo preferences';
      setErrorMsg(message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-[430px] bg-[#0d0d0d] border border-white/[0.14] rounded-[32px] p-6 shadow-2xl relative flex flex-col min-h-[580px] justify-between my-auto">
        {/* Top Progress Bar */}
        <div>
          <div className="flex items-center justify-between pb-3">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#6a4cf7] font-semibold">
              STEP {step} OF 7 ·{' '}
              {step === 1
                ? 'CREDENTIALS'
                : step === 2
                ? 'LANGUAGE'
                : step === 3
                ? 'PROFESSION'
                : step === 4
                ? 'NICHES'
                : step === 5
                ? 'VOICE'
                : step === 6
                ? 'TIME'
                : 'READY'}
            </span>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center text-[#8a8480] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-1.5 mb-5">
            {Array.from({ length: 7 }, (_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all ${
                  i < step ? 'bg-gradient-to-r from-[#6a4cf7] to-[#3ecf8e]' : 'bg-white/[0.12]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Account Credentials */}
        {step === 1 && (
          <div className="flex-1 flex flex-col justify-center animate-in fade-in duration-200">
            <h3 className="font-ui font-bold text-2xl text-[#f0ede8] mb-1">Create your account.</h3>
            <p className="font-display italic text-lg text-[#9080ff] mb-4">Saved directly to Supabase.</p>

            <div className="space-y-3 mb-4">
              <div className="relative">
                <User className="w-4 h-4 text-[#8a8480] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white/[0.06] border border-white/[0.12] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#f0ede8] placeholder-[#8a8480] focus:outline-none focus:border-[#6a4cf7]"
                />
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8a8480] absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.06] border border-white/[0.12] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#f0ede8] placeholder-[#8a8480] focus:outline-none focus:border-[#6a4cf7]"
                />
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8a8480] absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[0.06] border border-white/[0.12] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#f0ede8] placeholder-[#8a8480] focus:outline-none focus:border-[#6a4cf7]"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={prefillDemoData}
              className="text-[11px] text-[#9080ff] hover:underline flex items-center gap-1.5 self-start mb-2 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-[#3ecf8e]" />
              <span>Generate Fresh Demo Profile</span>
            </button>
          </div>
        )}

        {/* Step 2: Language & Location (Figma 02_language_location) */}
        {step === 2 && (
          <div className="flex-1 flex flex-col justify-center animate-in fade-in duration-200">
            <h3 className="font-ui font-bold text-2xl text-[#f0ede8] mb-1">Choose your</h3>
            <p className="font-display italic text-2xl text-[#9080ff] mb-4">language & city.</p>

            <div className="space-y-2.5 mb-3">
              {[
                { id: 'English', title: 'English', sub: 'Briefings delivered in English' },
                { id: 'Hindi', title: 'हिंदी (Hindi)', sub: 'हिंदी में समाचार सुनें' },
              ].map((lang) => {
                const active = language === lang.id;
                return (
                  <div
                    key={lang.id}
                    onClick={() => setLanguage(lang.id as any)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      active
                        ? 'bg-[#6a4cf7]/15 border-[#6a4cf7]'
                        : 'bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.07]'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-semibold text-[#f0ede8]">{lang.title}</p>
                      <p className="text-[10px] text-[#8a8480]">{lang.sub}</p>
                    </div>
                    {active && <CheckCircle2 className="w-4 h-4 text-[#3ecf8e]" />}
                  </div>
                );
              })}

              {/* Enable Location Box */}
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between mt-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center">
                    {isDetectingLocation ? (
                      <Loader2 className="w-4 h-4 text-[#3ecf8e] animate-spin" />
                    ) : (
                      <MapPin className="w-4 h-4 text-[#9080ff]" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#f0ede8]">Enable Location</p>
                    <p className={`text-[11px] font-medium transition-colors ${locationEnabled ? 'text-[#3ecf8e]' : 'text-[#8a8480]'}`}>
                      {locationText}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleToggleLocation}
                  className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                    locationEnabled ? 'bg-[#3ecf8e]' : 'bg-white/20'
                  }`}
                  aria-label="Toggle location"
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      locationEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Quick City Selector Chips */}
              <div className="pt-1">
                <p className="text-[10px] font-mono text-[#8a8480] uppercase tracking-wider mb-1.5">
                  Quick Select City:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_CITIES.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => {
                        setLocationEnabled(true);
                        setLocationText(`📍 ${city}, India (Hyperlocal news)`);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-[#6a4cf7]/20 border border-white/[0.08] hover:border-[#6a4cf7]/40 text-[10.5px] text-[#f0ede8] transition-all cursor-pointer"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Profession (Figma 04_profession) */}
        {step === 3 && (
          <div className="flex-1 flex flex-col justify-center animate-in fade-in duration-200">
            <h3 className="font-ui font-bold text-2xl text-[#f0ede8] mb-1">What&apos;s your</h3>
            <p className="font-display italic text-2xl text-[#9080ff] mb-4">profession?</p>

            <div className="grid grid-cols-2 gap-2 max-h-[250px] overflow-y-auto pr-1 mb-2">
              {PROFESSIONS.map((prof) => {
                const active = profession === prof;
                return (
                  <button
                    key={prof}
                    type="button"
                    onClick={() => setProfession(prof)}
                    className={`p-3 rounded-xl border text-left transition-all text-xs font-semibold flex items-center justify-between cursor-pointer ${
                      active
                        ? 'bg-[#6a4cf7]/20 border-[#6a4cf7] text-white shadow-sm'
                        : 'bg-white/[0.04] border-white/[0.08] text-[#8a8480] hover:bg-white/[0.07] hover:text-[#f0ede8]'
                    }`}
                  >
                    <span className="truncate">{prof}</span>
                    {active && <Check className="w-3 h-3 text-[#3ecf8e] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Niches (Figma 05_niches) */}
        {step === 4 && (
          <div className="flex-1 flex flex-col justify-center animate-in fade-in duration-200">
            <h3 className="font-ui font-bold text-2xl text-[#f0ede8] mb-1">What moves</h3>
            <p className="font-display italic text-2xl text-[#9080ff] mb-4">your world?</p>
            <p className="text-[11px] text-[#8a8480] mb-2 font-mono">
              Pick up to 7 niches ({selectedNiches.length}/7 selected):
            </p>

            <div className="flex flex-wrap gap-2 max-h-[240px] overflow-y-auto pr-1 mb-2">
              {NICHES.map((niche) => {
                const active = selectedNiches.includes(niche.id);
                return (
                  <button
                    key={niche.id}
                    type="button"
                    onClick={() => toggleNiche(niche.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                      active
                        ? 'bg-[#3ecf8e]/15 border-[#3ecf8e] text-[#3ecf8e]'
                        : 'bg-white/[0.04] border-white/[0.08] text-[#8a8480] hover:bg-white/[0.07]'
                    }`}
                  >
                    <span>{niche.label}</span>
                    {active && <Check className="w-3 h-3 text-[#3ecf8e]" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 5: Voice & Length (Figma 06_voice) */}
        {step === 5 && (
          <div className="flex-1 flex flex-col justify-center animate-in fade-in duration-200">
            <h3 className="font-ui font-bold text-2xl text-[#f0ede8] mb-1">Pick a</h3>
            <p className="font-display italic text-2xl text-[#9080ff] mb-3">narrator voice.</p>

            <div className="space-y-2 mb-4">
              {VOICES.map((v) => {
                const active = voice === v.id;
                return (
                  <div
                    key={v.id}
                    onClick={() => setVoice(v.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      active
                        ? 'bg-[#6a4cf7]/20 border-[#6a4cf7] text-white'
                        : 'bg-white/[0.04] border-white/[0.08] text-[#8a8480] hover:bg-white/[0.07]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Volume2 className={`w-4 h-4 ${active ? 'text-[#3ecf8e]' : 'text-[#8a8480]'}`} />
                      <div>
                        <p className="text-xs font-semibold text-[#f0ede8]">{v.label}</p>
                        <p className="text-[10px] text-[#8a8480]">{v.desc}</p>
                      </div>
                    </div>
                    {active && <CheckCircle2 className="w-4 h-4 text-[#3ecf8e]" />}
                  </div>
                );
              })}
            </div>

            <p className="font-mono text-[9px] uppercase tracking-wider text-[#8a8480] mb-2 font-semibold">
              Brief Length
            </p>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {['5 min', '10 min', '15 min', 'Custom'].map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setBriefLength(l)}
                  className={`py-2 rounded-xl text-center font-mono text-[11px] font-semibold border cursor-pointer ${
                    briefLength === l
                      ? 'bg-[#6a4cf7] text-white border-[#6a4cf7]'
                      : 'bg-white/[0.04] border-white/[0.08] text-[#8a8480] hover:bg-white/[0.08]'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Delivery Time & Notifications (Figma 07_time & 08_notifications) */}
        {step === 6 && (
          <div className="flex-1 flex flex-col justify-center animate-in fade-in duration-200">
            <h3 className="font-ui font-bold text-2xl text-[#f0ede8] mb-1">When do you want</h3>
            <p className="font-display italic text-2xl text-[#9080ff] mb-4">your morning brief?</p>

            {/* Changeable Delivery Time Box */}
            <div
              onClick={() => setIsTimePickerOpen(!isTimePickerOpen)}
              className="p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] hover:border-[#6a4cf7]/40 flex items-center justify-between mb-3 cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#3ecf8e]/10 border border-[#3ecf8e]/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#3ecf8e]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold text-[#f0ede8]">Daily Delivery Time</p>
                    <span className="text-[9px] font-mono text-[#9080ff] bg-[#6a4cf7]/15 px-1.5 py-0.5 rounded">Tap to change</span>
                  </div>
                  <p className="text-[10px] text-[#8a8480]">Nuzio prepares fresh audio every morning</p>
                </div>
              </div>
              <span className="font-mono text-base font-bold text-[#6a4cf7] bg-[#6a4cf7]/10 px-3 py-1 rounded-xl border border-[#6a4cf7]/30 group-hover:border-[#6a4cf7]">
                {deliveryTime}
              </span>
            </div>

            {/* Interactive Time Selector Chips */}
            {isTimePickerOpen && (
              <div className="p-3 rounded-2xl bg-[#141414] border border-[#6a4cf7]/30 mb-3 animate-in fade-in slide-in-from-top-2 duration-150">
                <p className="font-mono text-[9px] uppercase tracking-wider text-[#8a8480] mb-2 font-semibold">
                  Select Morning Timing:
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  {DELIVERY_TIMES.map((time) => {
                    const isSelected = deliveryTime === time;
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeliveryTime(time);
                          setIsTimePickerOpen(false);
                        }}
                        className={`py-2 px-1 rounded-xl text-center font-mono text-xs font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#6a4cf7] text-white border-[#6a4cf7] shadow-md shadow-[#6a4cf7]/30'
                            : 'bg-white/[0.04] border-white/[0.08] text-[#8a8480] hover:bg-white/[0.08] hover:text-white'
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Notifications Toggle */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#6a4cf7]/10 border border-[#6a4cf7]/20 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-[#9080ff]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#f0ede8]">Stay in the loop</p>
                  <p className="text-[10px] text-[#8a8480]">Push alerts for breaking stories</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                  notificationsEnabled ? 'bg-[#3ecf8e]' : 'bg-white/20'
                }`}
                aria-label="Toggle notifications"
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* Step 7: All Set! (Figma 09_all_set) */}
        {step === 7 && (
          <div className="flex-1 flex flex-col justify-center animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-full bg-[#3ecf8e]/15 border border-[#3ecf8e]/40 flex items-center justify-center text-[#3ecf8e] mx-auto mb-3">
              <Check className="w-6 h-6" />
            </div>

            <h3 className="font-ui font-bold text-2xl text-center text-[#f0ede8] mb-1">You&apos;re ready,</h3>
            <p className="font-display italic text-2xl text-center text-[#9080ff] mb-4">{fullName}.</p>

            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] space-y-2 mb-2 text-xs">
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span className="text-[#8a8480]">Profession</span>
                <span className="font-semibold text-white">{profession}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span className="text-[#8a8480]">Niches</span>
                <span className="font-semibold text-[#3ecf8e]">{selectedNiches.join(', ')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span className="text-[#8a8480]">Delivery</span>
                <span className="font-semibold text-white font-mono">{deliveryTime}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span className="text-[#8a8480]">Location</span>
                <span className="font-semibold text-white">{locationText.replace('📍 ', '')}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#8a8480]">Supabase Sync</span>
                <span className="font-mono text-[10px] text-[#3ecf8e] font-bold">● CLOUD CONNECTED</span>
              </div>
            </div>

            {errorMsg && <p className="text-red-400 text-[11px] text-center mb-2">{errorMsg}</p>}
          </div>
        )}

        {/* Bottom Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.08] mt-2">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-[#f0ede8] flex items-center gap-1 cursor-pointer transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 7 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6a4cf7] to-[#9080ff] hover:opacity-95 text-xs font-semibold text-white flex items-center gap-1.5 ml-auto cursor-pointer shadow-md shadow-[#6a4cf7]/30 transition-all"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCompleteOnboarding}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#3ecf8e] to-[#6a4cf7] hover:opacity-95 text-xs font-bold text-[#0d0d0d] flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#3ecf8e]/20 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-[#0d0d0d]" />
              <span>{loading ? 'Saving to Supabase...' : 'Start Listening →'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
