import Image from 'next/image';

interface LogoProps {
  size?: number;
  className?: string;
  showWordmark?: boolean;
}

export function Logo({ size = 44, className = '', showWordmark = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Waveform icon & Nuzio Brandmark */}
      <div 
        className="relative flex items-center justify-center shrink-0" 
        style={{ width: size, height: Math.round(size * 0.45) }}
      >
        <Image
          src="/logo.png"
          alt="Nuzio AI"
          width={180}
          height={40}
          priority
          className="object-contain w-auto h-full filter drop-shadow-[0_0_12px_rgba(106,76,247,0.45)]"
        />
      </div>
    </div>
  );
}
