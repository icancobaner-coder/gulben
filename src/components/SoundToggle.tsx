import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { sound } from '../utils/sound';

interface SoundToggleProps {
  className?: string;
}

export const SoundToggle: React.FC<SoundToggleProps> = ({ className = '' }) => {
  const [muted, setMutedState] = useState(sound.isMuted());

  const toggle = () => {
    const next = !muted;
    sound.setMuted(next);
    setMutedState(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={muted ? 'Sesi Aç' : 'Sesi Kapat'}
      className={`relative z-50 flex items-center justify-center w-11 h-11 rounded-full bg-slate-900/70 border border-white/10 text-slate-300 hover:text-white hover:border-white/25 active:scale-95 transition-all backdrop-blur-md shadow-lg ${className}`}
      title={muted ? 'Sesi Aç' : 'Sesi Kapat'}
    >
      {muted ? (
        <VolumeX className="w-5 h-5 text-slate-400" />
      ) : (
        <Volume2 className="w-5 h-5 text-[#4F7CFF]" />
      )}
    </button>
  );
};
