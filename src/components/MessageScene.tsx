import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Quote, Sparkles, Heart } from 'lucide-react';

interface MessageSceneProps {
  onProceedToSurprise: () => void;
}

export const MessageScene: React.FC<MessageSceneProps> = ({ onProceedToSurprise }) => {
  return (
    <div className="relative w-full min-h-screen bg-[#080D19] flex flex-col items-center justify-center px-4 sm:px-6 py-10 overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-400/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#4F7CFF]/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Premium Thoughtful Message Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-lg w-full bg-slate-900/75 border border-amber-400/25 rounded-3xl p-6 sm:p-9 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.6)] space-y-6"
      >
        {/* Thoughtful card header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-mono tracking-widest text-amber-200 uppercase font-medium">
              Sana Özel Bir Not 💌
            </span>
          </div>
          <Quote className="w-4 h-4 text-amber-400/60" />
        </div>

        {/* Heartfelt & Playful Message Paragraphs */}
        <div className="space-y-4 text-slate-200 text-sm sm:text-base leading-relaxed font-light">
          <p className="tracking-wide">
            ZIP skor tablosunda kimin önde olduğu konusu... tamam kabul,{' '}
            <span className="text-amber-200 font-normal">belki bugünlük tartışılabilir.</span> 😉
          </p>

          <p className="tracking-wide text-slate-300">
            Ama şaka bir yana; yoğun iş günleri arasında seninle bu tatlı oyunu yarışmak,
            ortama kattığın neşe ve enerjin gerçekten çok özel.
            İyi ki bu rekabet başlamış. :)
          </p>

          <p className="tracking-wide text-slate-300">
            Yeni yaşın sana tüm hedeflerini tek hamlede kolayca 'ZIP'lediğin,
            bol kahkahalı, kalbini ısıtacak sürprizlerle dolu ve unutulmaz anlar getirsin. 🎈
          </p>
        </div>

        {/* Highlighted Memorable Sentence */}
        <div className="pt-1">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="relative p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-blue-500/10 border border-amber-400/30 shadow-[0_0_20px_rgba(251,191,36,0.15)]"
          >
            <p className="text-base sm:text-lg font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-white to-indigo-200 leading-snug">
              “Küçük hamleler,
              <br />
              güzel şeylerin başlangıcı olabilir.” ✨
            </p>
          </motion.div>
        </div>

        {/* Playful Postscript */}
        <div className="text-xs text-slate-400 italic bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2.5">
          <span className="text-amber-300 font-medium not-italic">Dipnot:</span> Yarından itibaren ZIP'te skor konusunda hiç taviz yok, ama bugün taç tamamen senin! 👑
        </div>

        {/* Proceed Action Button */}
        <div className="pt-2 flex justify-center">
          <button
            type="button"
            onClick={onProceedToSurprise}
            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-[#4F7CFF] via-[#6366F1] to-[#8B5CF6] rounded-2xl shadow-[0_0_25px_rgba(79,124,255,0.4)] hover:shadow-[0_0_35px_rgba(79,124,255,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer min-h-[48px]"
          >
            <span>BİR ŞEY DAHA VAR... 😉</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
