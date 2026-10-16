import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles, Smile } from 'lucide-react';
import { sound } from '../utils/sound';

interface IntroSceneProps {
  onStartGame: () => void;
}

export const IntroScene: React.FC<IntroSceneProps> = ({ onStartGame }) => {
  // Steps: 0 = "İş arasında...", 1 = "Her gün...", 2 = "GÜLBEN + button"
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setStep(1);
    }, 2800);

    const t2 = setTimeout(() => {
      setStep(2);
    }, 5800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleStart = () => {
    sound.playCheckpoint(1);
    onStartGame();
  };

  return (
    <div className="relative w-full min-h-screen bg-[#080D19] flex flex-col items-center justify-center px-6 overflow-hidden select-none">
      {/* Warm Ambient Glowing Lights */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40">
        <svg className="w-full max-w-lg h-96" viewBox="0 0 400 300">
          <defs>
            <linearGradient id="introLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F7CFF" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#A78BFA" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.9" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Animated Connecting Path Lines */}
          <motion.path
            d="M 60 70 L 160 70 L 160 150 L 260 150 L 260 230 L 340 230"
            fill="none"
            stroke="url(#introLineGrad)"
            strokeWidth="3"
            strokeDasharray="600"
            strokeDashoffset="600"
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 4.2, ease: 'easeInOut' }}
            filter="url(#glow)"
          />

          {/* Glowing Animated Nodes */}
          {[
            { cx: 60, cy: 70, delay: 0.2 },
            { cx: 160, cy: 70, delay: 0.9 },
            { cx: 160, cy: 150, delay: 1.7 },
            { cx: 260, cy: 150, delay: 2.5 },
            { cx: 260, cy: 230, delay: 3.3 },
            { cx: 340, cy: 230, delay: 4.1 },
          ].map((dot, i) => (
            <g key={i}>
              <motion.circle
                cx={dot.cx}
                cy={dot.cy}
                r="15"
                fill="#0B132B"
                stroke={i === 5 ? '#F59E0B' : '#4F7CFF'}
                strokeWidth="2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: dot.delay, duration: 0.5, type: 'spring' }}
                filter="url(#glow)"
              />
              <motion.circle
                cx={dot.cx}
                cy={dot.cy}
                r="5"
                fill={i === 5 ? '#FDE68A' : '#F8FAFC'}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: dot.delay + 0.1, duration: 0.3 }}
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Warm Ambient Glow Bubbles */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-[#4F7CFF]/15 via-[#A78BFA]/15 to-[#F59E0B]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Skip button for quick access */}
      {step < 2 && (
        <button
          onClick={handleStart}
          className="absolute top-6 right-20 text-xs text-slate-300 hover:text-white px-3.5 py-1.5 rounded-full bg-slate-900/60 border border-white/10 hover:border-white/25 transition-all backdrop-blur-sm"
        >
          Hızlı Geç ⚡
        </button>
      )}

      {/* Sequential Text Storytelling */}
      <div className="relative z-10 max-w-lg w-full text-center flex flex-col items-center justify-center min-h-[340px]">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-xs text-blue-300 font-medium mb-1">
                <span>☕️ Ofis kahvesi eşliğinde</span>
              </div>
              <p className="text-2xl sm:text-3xl font-light text-slate-100 tracking-wide leading-relaxed">
                Her şey iş arasında başlayan o küçük ZIP kapışmasıyla başladı...
              </p>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.7 }}
              className="space-y-4"
            >
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-lg sm:text-xl font-light text-slate-200"
              >
                İki meraklı zihin.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="text-lg sm:text-xl font-light text-slate-200"
              >
                Her sabah "Bugün kim daha hızlı çözdü?" tatlı rekabeti... 😉
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                className="text-xl sm:text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-indigo-200"
              >
                Ve bitmeyen o eğlenceli yarış.
              </motion.p>
            </motion.div>
          )}

          {step >= 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 flex flex-col items-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-blue-500/10 border border-amber-400/30 text-xs text-amber-200 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Günün Yıldızına Özel</span>
              </div>

              <motion.div
                initial={{ opacity: 0, letterSpacing: '0.15em' }}
                animate={{ opacity: 1, letterSpacing: '0.22em' }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
              >
                <h1 className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-amber-200 tracking-[0.22em] drop-shadow-[0_0_30px_rgba(79,124,255,0.4)]">
                  GÜLBEN
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-base sm:text-lg text-slate-200 font-normal max-w-sm leading-relaxed"
              >
                Bugün doğum günün olduğu için kurallar biraz değişti...
                <br />
                <span className="text-amber-300 font-medium text-sm">
                  (Bakalım bu özel bölümü ne kadar sürede çözeceksin? 😉)
                </span>
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="pt-2"
              >
                <button
                  type="button"
                  onClick={handleStart}
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-sm font-semibold text-white bg-gradient-to-r from-[#4F7CFF] via-[#6366F1] to-[#8B5CF6] rounded-2xl shadow-[0_0_25px_rgba(79,124,255,0.5)] hover:shadow-[0_0_40px_rgba(79,124,255,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer min-h-[48px]"
                >
                  <Smile className="w-4 h-4 text-amber-300" />
                  <span className="tracking-wide">MEYDAN OKUMAYI KABUL ET ✨</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom subtle watermark label */}
      <div className="absolute bottom-6 flex items-center gap-2 text-[11px] font-mono tracking-widest text-slate-400">
        <span>ZIP · The Gülben Edition</span>
        <span>🎈</span>
      </div>
    </div>
  );
};
