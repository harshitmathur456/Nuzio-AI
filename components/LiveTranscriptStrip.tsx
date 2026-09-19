'use client';

interface LiveTranscriptStripProps {
  spokenText: string;
  isPlaying: boolean;
}

export function LiveTranscriptStrip({ spokenText, isPlaying }: LiveTranscriptStripProps) {
  if (!isPlaying) return null;

  return (
    <div className="mx-4 my-2 p-3 rounded-full glass-card border border-white/[0.10] flex items-center gap-2.5 animate-in fade-in zoom-in-95 duration-200">
      <div className="relative shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-[#3ecf8e]/15 text-[#3ecf8e]">
        <span className="text-xs">🎙</span>
      </div>
      <div className="text-[11.5px] leading-tight text-[#3ecf8e] overflow-hidden text-ellipsis whitespace-nowrap flex-1 font-medium">
        <span className="text-white/50 mr-1.5 font-normal">Now narrating —</span>
        <span>{spokenText}</span>
      </div>
    </div>
  );
}
