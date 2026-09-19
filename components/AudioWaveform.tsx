'use client';

interface AudioWaveformProps {
  bars?: number;
  height?: number;
  isPlaying?: boolean;
  colorA?: string;
  colorB?: string;
}

const BASE_WAVE_HEIGHTS = [
  8, 14, 22, 30, 38, 28, 18, 34, 42, 26, 16, 36, 44, 30, 20, 38, 24, 16, 32, 40,
  28, 18, 36, 22, 14, 30, 42, 24, 18, 32, 26, 14, 28, 36
];

export function AudioWaveform({
  bars = 32,
  height = 34,
  isPlaying = false,
  colorA = '#6a4cf7',
  colorB = '#9080ff',
}: AudioWaveformProps) {
  const heights = BASE_WAVE_HEIGHTS.slice(0, bars);

  return (
    <div
      className="flex items-end gap-[2.5px] overflow-hidden my-3 w-full justify-between"
      style={{ height }}
      aria-label="Audio waveform visualization"
    >
      {heights.map((maxH, i) => {
        const barH = Math.max(4, (maxH / 44) * height);
        // Stagger animation durations and delays for organic organic speech cadence
        const duration = 0.5 + ((i * 7) % 5) * 0.15;
        const delay = ((i * 13) % 7) * 0.08;

        return (
          <div
            key={i}
            className="flex-1 rounded-full transition-all"
            style={{
              height: isPlaying ? barH : Math.max(3, barH * 0.28),
              background: `linear-gradient(180deg, ${colorB}, ${colorA})`,
              opacity: isPlaying ? 0.95 : 0.35,
              animation: isPlaying
                ? `wave-bounce ${duration}s ease-in-out ${delay}s infinite alternate`
                : 'none',
              transformOrigin: 'bottom',
              minWidth: 2,
              maxWidth: 4,
            }}
          />
        );
      })}
    </div>
  );
}
