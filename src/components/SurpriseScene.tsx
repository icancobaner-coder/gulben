import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Swords, Trophy, MessageSquare, Sparkles, CheckCircle, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/sound';

interface SurpriseSceneProps {
  onBackToMessage: () => void;
}

type FinalChoice = 'REMATCH_TWIST' | 'DIRECT_CHAMPION' | null;

export const SurpriseScene: React.FC<SurpriseSceneProps> = ({ onBackToMessage }) => {
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState<FinalChoice>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confettiBurst, setConfettiBurst] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setStep(1); // "Yeni yaşında ZIP'te bol şans..."
    }, 2000);

    const t2 = setTimeout(() => {
      setStep(2); // "Çünkü yarından itibaren..." + buttons
    }, 4200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleRematchChoice = () => {
    // Only chosen once!
    setIsProcessing(true);
    sound.playCheckpoint(2);

    setTimeout(() => {
      setIsProcessing(false);
      setChoice('REMATCH_TWIST');
      sound.playSolve();
      setConfettiBurst((prev) => prev + 1);
    }, 1200);
  };

  const handleDirectChampion = () => {
    // Only chosen once!
    setChoice('DIRECT_CHAMPION');
    sound.playSolve();
    setConfettiBurst((prev) => prev + 1);
  };

  const triggerExtraSparkle = () => {
    setConfettiBurst((prev) => prev + 1);
    sound.playCheckpoint(5);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#080D19] flex flex-col items-center justify-center px-4 sm:px-6 py-10 overflow-hidden select-none">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-amber-400/15 via-[#4F7CFF]/15 to-purple-400/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Floating Sparkles when celebration clicked */}
      {confettiBurst > 0 && (
        <div className="absolute inset-0 pointer-events-none z-30">
          {Array.from({ length: 28 }).map((_, i) => (
            <motion.div
              key={`${confettiBurst}-${i}`}
              className="absolute w-2.5 h-2.5 rounded-full"
              style={{
                top: `${35 + (Math.sin(i * 0.45) * 35)}%`,
                left: `${50 + (Math.cos(i * 0.45) * 42)}%`,
                backgroundColor: ['#FBBF24', '#4F7CFF', '#A78BFA', '#F472B6', '#34D399'][i % 5],
              }}
              initial={{ scale: 0, opacity: 1, y: 0 }}
              animate={{
                scale: [0, 1.6, 0.8],
                opacity: [1, 1, 0],
                y: [(i % 2 === 0 ? -1 : 1) * (35 + i * 4), 110],
              }}
              transition={{ duration: 1.8, ease: 'easeOut' }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 max-w-lg w-full flex flex-col items-center text-center">
        {/* State 1: Intro question & single-use choice */}
        {!choice && !isProcessing && (
          <div className="w-full space-y-8 min-h-[360px] flex flex-col justify-center items-center">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.7 }}
                  className="space-y-4"
                >
                  <p className="text-2xl sm:text-3xl font-light text-slate-200 tracking-wide">
                    Bir şey daha var... 🤫
                  </p>
                </motion.div>
              )}

              {step >= 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="space-y-6 w-full max-w-md"
                >
                  <div className="space-y-3">
                    <p className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                      Yeni yaşında ZIP'te bol şans...
                    </p>

                    {step >= 2 && (
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-lg sm:text-xl font-normal text-amber-300"
                      >
                        Çünkü yarından itibaren hiç taviz yok! 😎
                      </motion.p>
                    )}
                  </div>

                  {/* Two Buttons: One-time choice */}
                  {step >= 2 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                    >
                      <button
                        type="button"
                        onClick={handleRematchChoice}
                        className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-4 text-sm font-semibold text-white bg-gradient-to-r from-[#4F7CFF] via-[#6366F1] to-[#8B5CF6] rounded-2xl shadow-[0_0_25px_rgba(79,124,255,0.4)] hover:shadow-[0_0_35px_rgba(79,124,255,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer min-h-[48px]"
                      >
                        <Swords className="w-4 h-4 text-amber-300" />
                        <span>RÖVANŞA HEMEN VARIM! ⚡</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleDirectChampion}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold text-amber-200 bg-slate-900/90 hover:bg-slate-800 border border-amber-400/30 hover:border-amber-400/50 rounded-2xl transition-all active:scale-[0.98] cursor-pointer min-h-[48px] shadow-sm"
                      >
                        <Trophy className="w-4 h-4 text-amber-400" />
                        <span>BUGÜNLÜK ZAFER BENİM 👑</span>
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Processing State when clicked Rematch */}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center space-y-4 py-16"
          >
            <div className="w-12 h-12 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
            <p className="text-base text-slate-200 font-mono tracking-wide">
              Rövanş talebi inceleniyor... ⚡
            </p>
          </motion.div>
        )}

        {/* Outcome 1: Playful Rematch Twist ("Bugün rövanş yok, her şeyde en iyisi sensin!") */}
        {choice === 'REMATCH_TWIST' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-md bg-slate-900/85 border border-amber-400/40 rounded-3xl p-7 sm:p-9 backdrop-blur-xl shadow-[0_0_60px_rgba(251,191,36,0.3)] space-y-6"
          >
            <div className="relative w-18 h-18 mx-auto rounded-3xl bg-amber-400/15 border border-amber-400/40 flex items-center justify-center shadow-[0_0_25px_rgba(251,191,36,0.4)]">
              <ShieldCheck className="w-9 h-9 text-amber-400" />
              <span className="absolute -top-2 -right-2 text-xl">👑</span>
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-400/20 text-xs font-mono text-red-300">
                <span>RÖVANŞ TALEBİ REDDEDİLDİ 🚫</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-indigo-200 tracking-tight">
                Bugün rövanş yok! 😄
              </h3>

              <div className="text-sm sm:text-base text-slate-200 font-light leading-relaxed space-y-3 pt-1">
                <p>
                  Gerekçe belli:{' '}
                  <span className="text-amber-300 font-medium">
                    Bugün tartışmasız her şeyde en iyisi sensin.
                  </span>
                </p>
                <p className="text-slate-300 text-xs sm:text-sm">
                  Bugün ne ZIP'te, ne enerjide, ne kahkahada seninle yarışılmaz.
                  Rakibin teslim bayrağını çekti ve bugünkü şampiyonluğunu resmen onayladı! 🏳️✍️
                </p>
              </div>
            </div>

            {/* Official Champion Badge */}
            <div className="bg-amber-400/10 border border-amber-400/30 rounded-2xl p-4 text-xs space-y-1.5 text-slate-300">
              <div className="font-semibold text-amber-200 flex items-center justify-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-amber-400" />
                <span>Gülben'in Mutlak Şampiyonluğu Onaylandı</span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Karar kesindir. Yeni yaşında tüm gün taç senin! 🏆
              </p>
            </div>

            {/* Celebration actions - No repeating loop */}
            <div className="pt-2 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={triggerExtraSparkle}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold text-white bg-gradient-to-r from-[#4F7CFF] via-[#6366F1] to-[#8B5CF6] rounded-xl shadow-[0_0_20px_rgba(79,124,255,0.4)] hover:shadow-[0_0_30px_rgba(79,124,255,0.6)] transition-all cursor-pointer min-h-[44px]"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Kutlama Kıvılcımı Patlat 🎉</span>
              </button>

              <button
                type="button"
                onClick={onBackToMessage}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-medium text-slate-200 hover:text-white bg-slate-800/90 border border-white/10 hover:border-white/20 rounded-xl transition-all cursor-pointer min-h-[44px]"
              >
                <MessageSquare className="w-4 h-4 text-amber-300" />
                <span>Mesajı Tekrar Oku 💌</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Outcome 2: Direct Champion Claim ("BUGÜNLÜK ZAFER BENİM") */}
        {choice === 'DIRECT_CHAMPION' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-md bg-slate-900/85 border border-amber-400/40 rounded-3xl p-7 sm:p-9 backdrop-blur-xl shadow-[0_0_60px_rgba(251,191,36,0.3)] space-y-6"
          >
            <div className="relative w-18 h-18 mx-auto rounded-3xl bg-amber-400/15 border border-amber-400/40 flex items-center justify-center shadow-[0_0_25px_rgba(251,191,36,0.4)]">
              <Trophy className="w-9 h-9 text-amber-400" />
              <span className="absolute -top-2 -right-2 text-xl">👑</span>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-indigo-200 tracking-tight">
                Zaten başka ihtimal yoktu! 🏆
              </h3>

              <div className="text-sm sm:text-base text-slate-200 font-light leading-relaxed space-y-2 pt-1">
                <p>
                  Tüm gün boyunca hak ettiğin{' '}
                  <span className="text-amber-300 font-medium">ZIP Şampiyonu</span> unvanının tadını çıkar.
                </p>
                <p className="text-slate-300 text-xs sm:text-sm">
                  Bugün Gülben'in doğum günü dokunulmazlığı yürürlükte. Yüzün hep böyle gülsün! ✨
                </p>
              </div>
            </div>

            {/* Official Champion Badge */}
            <div className="bg-amber-400/10 border border-amber-400/30 rounded-2xl p-4 text-xs space-y-1.5 text-slate-300">
              <div className="font-semibold text-amber-200 flex items-center justify-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-amber-400" />
                <span>Günün Mutlak Şampiyonu: Gülben</span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Bugün tüm skorlar ve rekorlar senin elinde! 🌟
              </p>
            </div>

            {/* Actions - No repeating loop */}
            <div className="pt-2 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={triggerExtraSparkle}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold text-white bg-gradient-to-r from-[#4F7CFF] via-[#6366F1] to-[#8B5CF6] rounded-xl shadow-[0_0_20px_rgba(79,124,255,0.4)] hover:shadow-[0_0_30px_rgba(79,124,255,0.6)] transition-all cursor-pointer min-h-[44px]"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Kutlama Kıvılcımı Patlat 🎉</span>
              </button>

              <button
                type="button"
                onClick={onBackToMessage}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-medium text-slate-200 hover:text-white bg-slate-800/90 border border-white/10 hover:border-white/20 rounded-xl transition-all cursor-pointer min-h-[44px]"
              >
                <MessageSquare className="w-4 h-4 text-amber-300" />
                <span>Mesajı Tekrar Oku 💌</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
