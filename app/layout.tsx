import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nuzio AI — Personalized Audio News for Indian Professionals',
  description: 'AI-curated, personalized morning audio briefs for Indian tech leaders, founders, and investors.',
  icons: {
    icon: '/logo.png',
  },
  openGraph: {
    title: 'Nuzio AI — Personalized Audio News for Indian Professionals',
    description: 'Listen to your personalized news brief every morning with natural AI narration.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0d0d0d',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark bg-[#0d0d0d]">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600;700&family=Hanken+Grotesk:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#0d0d0d] text-[#f0ede8] antialiased selection:bg-[#6a4cf7]/40 selection:text-white relative overflow-x-hidden flex justify-center">
        {/* Ambient background aura blobs matching Figma Make export */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(106,76,247,0.18)_0%,transparent_55%)]" />
          <div className="absolute -top-[5%] -right-[15%] w-[550px] h-[350px] rounded-full bg-[radial-gradient(circle,rgba(76,141,255,0.14)_0%,transparent_70%)] blur-[60px]" />
          <div className="absolute top-[28%] -left-[15%] w-[450px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(62,207,142,0.10)_0%,transparent_70%)] blur-[56px]" />
        </div>

        {/* Dynamic container width controlled by page view mode */}
        <div className="w-full flex justify-center relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
