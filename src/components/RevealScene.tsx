import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Heart } from 'lucide-react';
import { sound } from '../utils/sound';

interface RevealSceneProps {
  onProceedToMessage: () => void;
}

export const RevealScene: React.FC<RevealSceneProps> = ({ onProceedToMessage }) => {
  const [showGulben, setShowGulben] = useState(false);
  const [showAction, setShowAction] = useState(false);
  const [wishMade, setWishMade] = useState(false);

  useEffect(() => {
    // Play celebratory reveal chime after slight delay
    const tAudio = setTimeout(() => {
      sound.playReveal();
    }, 500);

    const tGulben = setTimeout(() => {
      setShowGulben(true);
    }, 1500);

    const tAction = setTimeout(() => {
      setShowAction(true);
    }, 2800);

    return () => {
      clearTimeout(tAudio);
      clearTimeout(tGulben);
      clearTimeout(tAction);
    };
  }, []);

  const handleMakeWish = () => {
    setWishMade(true);
    sound.playCheckpoint(5);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#080D19] flex flex-col items-center justify-center px-6 overflow-hidden select-none">
      {/* Cinematic Ambient Glow & Warm Particle Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Central Warm Aurora Light Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-gradient-to-tr from-amber-400/15 via-[#4F7CFF]/15 to-[#A78BFA]/20 rounded-full blur-[110px]" />

        {/* Dynamic Light Ribbon / Travelling Beam SVG */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="revealRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F7CFF" stopOpacity="0.1" />
              <stop offset="35%" stopColor="#A78BFA" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#F59E0B" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
            </linearGradient>
            <filter id="ribbonGlow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Flowing animated light lines */}
          <motion.path
            d="M -50 300 Q 200 100 400 350 T 900 200"
            fill="none"
            stroke="url(#revealRibbonGrad)"
            strokeWidth="2.5"
            strokeDasharray="1200"
            strokeDashoffset="1200"
            animate={{ strokeDashoffset: [1200, 0] }}
            transition={{ duration: 3.5, ease: 'easeInOut' }}
            filter="url(#ribbonGlow)"
          />
          <motion.path
            d="M 50 600 Q 250 400 450 550 T 850 450"
            fill="none"
            stroke="url(#revealRibbonGrad)"
            strokeWidth="2"
            strokeDasharray="1000"
            strokeDashoffset="1000"
            animate={{ strokeDashoffset: [1000, 0] }}
            transition={{ duration: 4, delay: 0.4, ease: 'easeInOut' }}
            filter="url(#ribbonGlow)"
          />
        </svg>

        {/* Floating warm starlight and golden particles */}
        {Array.from({ length: 32 }).map((_, i) => {
          const top = ((i * 17) % 95) + 3;
          const left = ((i * 29) % 95) + 3;
          const size = (i % 3) + 2;
          const duration = 2.8 + (i % 4);
          const delay = (i % 5) * 0.35;
          const isGold = i % 3 === 0;
          return (
            <motion.div
              key={i}
              className={`absolute rounded-full ${isGold ? 'bg-amber-300' : 'bg-white'}`}
              style={{
                top: `${top}%`,
                left: `${left}%`,
                width: `${size}px`,
                height: `${size}px`,
                boxShadow: isGold
                  ? '0 0 12px rgba(251, 191, 36, 0.9)'
                  : '0 0 10px rgba(167, 139, 250, 0.8)',
              }}
              animate={{
                y: [-18, 18, -18],
                opacity: [0.3, 0.95, 0.3],
                scale: [0.8, 1.4, 0.8],
              }}
              transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </div>

      {/* Main Content Reveal */}
      <div className="relative z-10 max-w-lg w-full text-center flex flex-col items-center justify-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400/15 to-purple-400/15 border border-amber-400/30 text-xs font-mono tracking-wider text-amber-200 backdrop-blur-md mb-2 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>EN SEVDİĞİM RAKİBİME ÖZEL 🎂</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-light text-slate-100 tracking-wider">
            İYİ Kİ DOĞDUN
          </h2>
        </motion.div>

        {/* GÜLBEN Large Typography Reveal */}
        {showGulben && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="pt-1 flex flex-col items-center"
          >
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-[#4F7CFF] drop-shadow-[0_0_35px_rgba(251,191,36,0.35)]">
              GÜLBEN!
            </h1>
            <p className="pt-3 text-sm sm:text-base text-slate-300 font-light max-w-xs">
              Enerjinle ortama kattığın neşe ve o tatlı hırsın hiç eksilmesin ✨
            </p>
          </motion.div>
        )}

        {/* Interactive Wish Micro-Action */}
        {showGulben && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="pt-2"
          >
            {!wishMade ? (
              <button
                type="button"
                onClick={handleMakeWish}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-xs text-amber-200 transition-all active:scale-95 cursor-pointer shadow-sm"
              >
                <span>🕯️ Bir Doğum Günü Dileği Tut</span>
                <Sparkles className="w-3 h-3 text-amber-300" />
              </button>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-xs font-medium text-amber-300 bg-amber-400/15 border border-amber-400/30 px-4 py-2 rounded-full shadow-sm"
              >
                ✨ Dileğin kabul olsun, harika bir yıl seni bekliyor! 🎈
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Continuation Action */}
        {showAction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="pt-4"
          >
            <button
              type="button"
              onClick={onProceedToMessage}
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-sm font-semibold text-white bg-gradient-to-r from-[#4F7CFF] via-[#6366F1] to-[#8B5CF6] rounded-2xl shadow-[0_0_30px_rgba(79,124,255,0.5)] hover:shadow-[0_0_40px_rgba(79,124,255,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer min-h-[48px]"
            >
              <span>SANA BİR MESAJIM VAR 💌</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}
      </div>

      {/* Discrete bottom timestamp note */}
      <div className="absolute bottom-6 text-xs text-slate-400 font-mono tracking-wider">
        Mutlu Yıllar Gülben · 🌟
      </div>
    </div>
  );
};
