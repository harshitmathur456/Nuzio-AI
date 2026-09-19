'use client';

interface LiveTranscriptStripProps {
  spokenText: string;
  isPlaying: boolean;
}

export function LiveTranscriptStrip({ spokenText, isPlaying }: LiveTranscriptStripProps) {
  return (
    <div className="mx-4 my-2.5 p-3.5 rounded-2xl glass-card border border-white/[0.08] flex items-center gap-3">
      {/* Microphone Icon with pulse */}
      <div className="relative shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-[#3ecf8e]/10 border border-[#3ecf8e]/20 text-[#3ecf8e]">
        <span className="text-sm">🎙</span>
        {isPlaying && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#3ecf8e] animate-ping" />
        )}
      </div>

      {/* Transcript Text */}
      <div className="text-[12px] leading-relaxed text-[#3ecf8e]/95 overflow-hidden text-ellipsis whitespace-nowrap flex-1 font-medium">
        <span className="text-white/40 mr-1.5 font-normal">Now narrating —</span>
        <span>{spokenText || 'Ready to narrate your morning brief...'}</span>
      </div>
    </div>
  );
}
