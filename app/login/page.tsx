'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { AudioWaveform } from '@/components/AudioWaveform';
import { Logo } from '@/components/Logo';
import { DemoOnboardingModal } from '@/components/DemoOnboardingModal';
import { Sparkles, ArrowRight, Mail, Lock, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isDemoWizardOpen, setIsDemoWizardOpen] = useState(false);
  const [isEmailMode, setIsEmailMode] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  // 1. Google OAuth Flow
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);

    if (!isSupabaseConfigured) {
      setInfoMsg('Connecting via Supabase Auth... (Demo mode active as fallback)');
      await handleDemoSignIn('Aarav Sharma', 'google_user@nuzio.ai');
      return;
    }

    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        throw error;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google authentication failed';
      setErrorMsg(message);
      setLoading(false);
    }
  };

  // 2. Email / Password Fallback Flow
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setInfoMsg(null);

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured) {
      await handleDemoSignIn(name || email.split('@')[0], email);
      return;
    }

    try {
      const supabase = createClient();
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name || email.split('@')[0] },
          },
        });
        if (error) throw error;
        if (data.session) {
          router.push('/news');
          router.refresh();
        } else {
          setInfoMsg('Account created! Please check your email to confirm your account.');
          setLoading(false);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push('/news');
        router.refresh();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed';
      setErrorMsg(message);
      setLoading(false);
    }
  };

  // 3. Instant Demo Login (Zero-config evaluation)
  const handleDemoSignIn = async (demoName: string, demoEmail: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: demoName, email: demoEmail }),
      });
      if (res.ok) {
        router.push('/news');
        router.refresh();
      } else {
        setErrorMsg('Failed to initialize demo session.');
        setLoading(false);
      }
    } catch {
      setErrorMsg('Network error connecting to auth service.');
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between p-7 select-none overflow-hidden">
      {/* Background glow orb */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[60%] bg-[radial-gradient(ellipse,rgba(106,76,247,0.20)_0%,transparent_65%)] blur-[35px] pointer-events-none" />

      {/* Top section: Logo and Waveform */}
      <div className="relative z-10 pt-10 flex flex-col items-center gap-6">
        <Logo size={104} />
        <div className="w-full max-w-[240px]">
          <AudioWaveform isPlaying={true} bars={24} height={24} />
        </div>
      </div>

      {/* Hero Text */}
      <div className="relative z-10 my-auto py-6">
        <h1 className="font-ui font-bold text-[34px] leading-[1.06] text-[#f0ede8] mb-1">
          Good morning.
        </h1>
        <h2 className="font-display italic text-[36px] leading-[1.02] text-[#9080ff] mb-4">
          News on go.
        </h2>
        <p className="text-[13.5px] leading-relaxed text-[#8a8480] max-w-[300px]">
          Personalised audio news for Indian professionals — curated every morning.
        </p>

        {/* Error / Info messages */}
        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {infoMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{infoMsg}</span>
          </div>
        )}
      </div>

      {/* Auth Actions Area */}
      <div className="relative z-10 flex flex-col gap-3 pb-2">
        {!isEmailMode ? (
          <>
            {/* Primary Google Auth CTA matching Figma */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-4 px-5 rounded-2xl bg-white/[0.09] hover:bg-white/[0.13] active:scale-[0.98] border border-white/[0.12] flex items-center justify-center gap-3 transition-all cursor-pointer shadow-lg shadow-black/40 group disabled:opacity-50"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="font-ui font-semibold text-[15px] text-[#f0ede8]">
                {loading ? 'Authenticating...' : 'Continue with Google'}
              </span>
            </button>

            {/* (Create Demo) Button placed directly under Continue with Google */}
            <button
              type="button"
              onClick={() => setIsDemoWizardOpen(true)}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#6a4cf7]/25 via-[#9080ff]/20 to-[#3ecf8e]/20 hover:from-[#6a4cf7]/35 hover:to-[#3ecf8e]/30 border border-[#6a4cf7]/40 hover:border-[#3ecf8e]/50 text-[#f0ede8] font-semibold text-[13.5px] flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg shadow-[#6a4cf7]/20 group"
            >
              <Sparkles className="w-4 h-4 text-[#3ecf8e] group-hover:rotate-12 transition-transform" />
              <span>(Create Demo)</span>
              <span className="text-[11px] font-mono text-[#9080ff] font-normal">· Setup All Preferences</span>
            </button>

            {/* Email Fallback Toggle */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => setIsEmailMode(true)}
                className="text-[12px] text-[#8a8480] hover:text-[#f0ede8] transition-colors py-1 cursor-pointer"
              >
                Use email instead &rarr;
              </button>

              {/* Instant Guest demo */}
              <button
                onClick={() => handleDemoSignIn('Aarav Sharma', 'aarav.sharma@nuzio.ai')}
                disabled={loading}
                className="text-[11.5px] text-[#3ecf8e] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Instant Guest Brief &rarr;</span>
              </button>
            </div>
          </>
        ) : (
          /* Email / Password Form */
          <form onSubmit={handleEmailAuth} className="space-y-3">
            {isSignUp && (
              <div>
                <input
                  type="text"
                  placeholder="Your Name (e.g. Aarav)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/[0.06] border border-white/[0.12] rounded-xl px-4 py-3 text-sm text-[#f0ede8] placeholder-[#8a8480] focus:outline-none focus:border-[#6a4cf7]"
                />
              </div>
            )}
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8a8480] absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.06] border border-white/[0.12] rounded-xl pl-10 pr-4 py-3 text-sm text-[#f0ede8] placeholder-[#8a8480] focus:outline-none focus:border-[#6a4cf7]"
              />
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8a8480] absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/[0.06] border border-white/[0.12] rounded-xl pl-10 pr-4 py-3 text-sm text-[#f0ede8] placeholder-[#8a8480] focus:outline-none focus:border-[#6a4cf7]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6a4cf7] to-[#9080ff] text-white font-semibold text-sm transition-opacity hover:opacity-95 shadow-lg shadow-[#6a4cf7]/25 cursor-pointer disabled:opacity-50"
            >
              {loading
                ? 'Processing...'
                : isSignUp
                ? 'Create Account'
                : 'Sign In to Nuzio'}
            </button>

            <div className="flex items-center justify-between text-[11px] text-[#8a8480] pt-1">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="hover:text-[#f0ede8] transition-colors"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
              <button
                type="button"
                onClick={() => setIsEmailMode(false)}
                className="text-[#9080ff] hover:underline"
              >
                Back to Google / Demo
              </button>
            </div>
          </form>
        )}

        {/* Footer Terms */}
        <div className="text-center text-[10.5px] text-[#8a8480]/60 leading-relaxed pt-2">
          By continuing you agree to our{' '}
          <span className="text-[#9080ff] underline underline-offset-2 cursor-pointer">Terms</span>
          {' '}&{' '}
          <span className="text-[#9080ff] underline underline-offset-2 cursor-pointer">Privacy Policy</span>.
        </div>
      </div>

      {/* Full Multi-Step Demo Onboarding Modal */}
      <DemoOnboardingModal
        isOpen={isDemoWizardOpen}
        onClose={() => setIsDemoWizardOpen(false)}
      />
    </div>
  );
}
