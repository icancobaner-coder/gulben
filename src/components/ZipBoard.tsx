import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Undo2, Clock, Sparkles, Trophy, ArrowRight, Heart } from 'lucide-react';
import {
  Coord,
  PuzzleDefinition,
  coordKey,
  validateMove,
  isPuzzleComplete,
  getNextExpectedCheckpoint,
} from '../game/rules';
import { sound } from '../utils/sound';

interface ZipBoardProps {
  puzzle: PuzzleDefinition;
  onPuzzleSolved: (timeSpentSeconds: number) => void;
  onProceedToReveal: () => void;
}

export const ZipBoard: React.FC<ZipBoardProps> = ({
  puzzle,
  onPuzzleSolved,
  onProceedToReveal,
}) => {
  const [path, setPath] = useState<Coord[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [celebrationStep, setCelebrationStep] = useState(0);
  const [invalidFlashCoord, setInvalidFlashCoord] = useState<Coord | null>(null);
  const [encouragement, setEncouragement] = useState<string>('Başlamak için 1 numaraya dokun');

  const boardRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalCells = puzzle.gridSize * puzzle.gridSize;
  const nextCheckpoint = getNextExpectedCheckpoint(path, puzzle.checkpoints);

  // Timer control
  useEffect(() => {
    if (timerActive && !isSolved) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive, isSolved]);

  // Reset state when puzzle changes
  useEffect(() => {
    setPath([]);
    setIsDragging(false);
    setIsSolved(false);
    setSeconds(0);
    setTimerActive(false);
    setCelebrationStep(0);
    setEncouragement('Başlamak için 1 numaraya dokun');
  }, [puzzle.id]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const attemptMove = useCallback(
    (target: Coord) => {
      if (isSolved) return;

      const validation = validateMove(path, target, puzzle);

      if (!validation.valid) {
        if (validation.reason && validation.type === 'INVALID') {
          setInvalidFlashCoord(target);
          setTimeout(() => setInvalidFlashCoord(null), 300);
        }
        return;
      }

      // If valid, start timer on first move
      if (!timerActive) {
        setTimerActive(true);
      }

      if (validation.type === 'START') {
        setPath([target]);
        sound.playCheckpoint(1);
        setEncouragement('Harika başlangıç! Şimdi 2 numaraya doğru... 🎯');
        return;
      }

      if (validation.type === 'BACKTRACK' && validation.backtrackIndex !== undefined) {
        setPath((prev) => prev.slice(0, validation.backtrackIndex! + 1));
        sound.playUndo();
        return;
      }

      if (validation.type === 'APPEND') {
        const nextPath = [...path, target];
        setPath(nextPath);

        const targetCp = puzzle.checkpoints[coordKey(target.r, target.c)];
        if (targetCp !== undefined) {
          sound.playCheckpoint(targetCp);
          if (targetCp === 2) setEncouragement('2 cepte! 3 numaraya ilerle 🚀');
          else if (targetCp === 3) setEncouragement('Süper gidiyorsun Gülben, yarıladın! ✨');
          else if (targetCp === 4) setEncouragement('4 tamam! Şimdi son hedef 5! 🔥');
          else if (targetCp === 5) setEncouragement('Son hücreler... Bitmek üzere! 🎈');
        } else {
          sound.playMove(nextPath.length);
        }

        // Check for victory
        if (isPuzzleComplete(nextPath, puzzle)) {
          setIsSolved(true);
          setTimerActive(false);
          sound.playSolve();
          onPuzzleSolved(seconds);

          // Trigger sequential victory transitions
          setTimeout(() => setCelebrationStep(1), 300); // TEBRİKLER GÜLBEN!
          setTimeout(() => setCelebrationStep(2), 1500); // Yine kazandın.
          setTimeout(() => setCelebrationStep(3), 3000); // Ama bu sefer ödül biraz farklı. + Button
        }
      }
    },
    [isSolved, path, puzzle, timerActive, seconds, onPuzzleSolved]
  );

  const handlePointerDown = (r: number, c: number) => {
    setIsDragging(true);
    attemptMove({ r, c });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isSolved) return;

    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el) return;

    const cellEl = el.closest('[data-cell-coord]');
    if (cellEl) {
      const coordStr = cellEl.getAttribute('data-cell-coord');
      if (coordStr) {
        const [rStr, cStr] = coordStr.split(',');
        const r = parseInt(rStr, 10);
        const c = parseInt(cStr, 10);
        if (!isNaN(r) && !isNaN(c)) {
          attemptMove({ r, c });
        }
      }
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleUndo = () => {
    if (path.length > 0 && !isSolved) {
      setPath((prev) => prev.slice(0, -1));
      sound.playUndo();
    }
  };

  const handleReset = () => {
    if (!isSolved) {
      setPath([]);
      setSeconds(0);
      setTimerActive(false);
      sound.playUndo();
      setEncouragement('Başlamak için 1 numaraya dokun');
    }
  };

  const pathIndexMap = new Map<string, number>();
  path.forEach((c, idx) => {
    pathIndexMap.set(coordKey(c.r, c.c), idx);
  });

  const getCellCenterPercent = (r: number, c: number) => {
    const step = 100 / puzzle.gridSize;
    return {
      x: c * step + step / 2,
      y: r * step + step / 2,
    };
  };

  const svgPoints = path
    .map((c) => {
      const { x, y } = getCellCenterPercent(c.r, c.c);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div
      className="relative w-full min-h-screen bg-[#080D19] flex flex-col items-center justify-between py-5 px-4 select-none touch-none"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Top Header */}
      <header className="w-full max-w-md flex flex-col items-center text-center space-y-1 pt-2">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-xs font-mono tracking-wider text-amber-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>GÜLBEN'E ÖZEL ZIP 🎈</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Bu bölümü geçebilir misin?
        </h2>
        <p className="text-xs text-slate-300 max-w-xs">
          Günün şampiyonuna özel hazırlandı! Bakalım rekorun kaç olacak? 😉
        </p>

        {/* HUD Bar: Timer & Progress */}
        <div className="w-full flex items-center justify-between pt-2 px-2 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-full border border-white/10 tabular-nums shadow-sm">
            <Clock className="w-3.5 h-3.5 text-[#4F7CFF]" />
            <span className="font-mono text-slate-100 font-medium">{formatTime(seconds)}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-full border border-white/10 shadow-sm">
            <span className="text-slate-400">İlerleme:</span>
            <span className="font-mono font-semibold text-amber-300 tabular-nums">
              {path.length} / {totalCells}
            </span>
          </div>
        </div>

        {/* Cheerful mini prompt */}
        <div className="pt-1 text-[11px] font-medium text-indigo-300 transition-all">
          {encouragement}
        </div>
      </header>

      {/* Game Board Container */}
      <main className="w-full max-w-sm aspect-square my-auto relative p-3">
        {/* Ambient warm backlight glow */}
        <div
          className={`absolute inset-0 rounded-3xl transition-all duration-700 pointer-events-none ${
            isSolved
              ? 'bg-gradient-to-tr from-[#4F7CFF]/25 via-amber-400/20 to-[#A78BFA]/25 blur-3xl'
              : 'bg-gradient-to-tr from-[#4F7CFF]/10 via-[#A78BFA]/10 to-amber-500/5 blur-2xl'
          }`}
        />

        {/* Grid Box */}
        <div
          ref={boardRef}
          className={`relative w-full h-full bg-slate-950/80 border rounded-3xl p-3 shadow-2xl backdrop-blur-xl transition-all duration-500 ${
            isSolved
              ? 'border-amber-400/60 shadow-[0_0_50px_rgba(251,191,36,0.35)]'
              : 'border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]'
          }`}
        >
          {/* SVG Connection Layer */}
          <svg
            className="absolute inset-3 w-[calc(100%-24px)] h-[calc(100%-24px)] pointer-events-none z-10"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4F7CFF" />
                <stop offset="50%" stopColor="#A78BFA" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
              <filter id="pathGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Glowing active path line */}
            {path.length > 1 && (
              <polyline
                points={svgPoints}
                fill="none"
                stroke="url(#pathGradient)"
                strokeWidth={isSolved ? '4.8' : '4.0'}
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#pathGlow)"
                className={isSolved ? 'animate-pulse' : ''}
              />
            )}
          </svg>

          {/* 5x5 Grid Cells */}
          <div
            className="grid w-full h-full gap-2 relative z-20"
            style={{
              gridTemplateColumns: `repeat(${puzzle.gridSize}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${puzzle.gridSize}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: puzzle.gridSize }).map((_, r) =>
              Array.from({ length: puzzle.gridSize }).map((_, c) => {
                const key = coordKey(r, c);
                const isVisited = pathIndexMap.has(key);
                const stepIndex = pathIndexMap.get(key);
                const checkpoint = puzzle.checkpoints[key];
                const isHead =
                  path.length > 0 &&
                  path[path.length - 1].r === r &&
                  path[path.length - 1].c === c;
                const isNextTarget = checkpoint === nextCheckpoint;
                const isFlashInvalid =
                  invalidFlashCoord &&
                  invalidFlashCoord.r === r &&
                  invalidFlashCoord.c === c;

                return (
                  <button
                    key={key}
                    type="button"
                    data-cell-coord={key}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      handlePointerDown(r, c);
                    }}
                    className={`relative w-full h-full rounded-2xl flex items-center justify-center transition-all duration-200 outline-none select-none cursor-pointer ${
                      isFlashInvalid ? 'bg-red-500/30 ring-2 ring-red-400' : ''
                    } ${
                      isVisited
                        ? 'bg-[#4F7CFF]/25 border border-[#4F7CFF]/70'
                        : 'bg-white/[0.04] hover:bg-white/[0.09] border border-white/5'
                    } ${isHead ? 'ring-2 ring-amber-300 shadow-[0_0_15px_#F59E0B]' : ''}`}
                    aria-label={`Hücre ${r + 1}, ${c + 1}${
                      checkpoint ? ` - Nokta ${checkpoint}` : ''
                    }`}
                  >
                    {/* Checkpoint Badge / Circle */}
                    {checkpoint !== undefined ? (
                      <div
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-md ${
                          isVisited
                            ? 'bg-gradient-to-tr from-[#4F7CFF] via-[#A78BFA] to-amber-400 text-white shadow-[0_0_15px_rgba(79,124,255,0.7)]'
                            : isNextTarget
                            ? 'bg-slate-900 border-2 border-amber-400 text-amber-300 animate-pulse shadow-[0_0_12px_rgba(251,191,36,0.5)]'
                            : 'bg-slate-900/90 border border-white/20 text-slate-300'
                        }`}
                      >
                        {checkpoint}
                      </div>
                    ) : (
                      /* Visited Cell Center Dot */
                      isVisited && (
                        <div
                          className={`w-2.5 h-2.5 rounded-full transition-transform ${
                            isHead
                              ? 'bg-amber-300 scale-125 shadow-[0_0_8px_#FDE68A]'
                              : 'bg-[#4F7CFF]'
                          }`}
                        />
                      )
                    )}

                    {/* Step order index indicator */}
                    {isVisited && !checkpoint && (
                      <span className="absolute bottom-1 right-1 text-[9px] font-mono text-slate-400 opacity-70">
                        {stepIndex! + 1}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Board Controls: Undo & Reset */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            type="button"
            onClick={handleUndo}
            disabled={path.length <= 1 || isSolved}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-200 bg-slate-900/80 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed border border-white/10 rounded-full transition-all active:scale-95"
            aria-label="Son hamleyi geri al"
          >
            <Undo2 className="w-3.5 h-3.5 text-[#4F7CFF]" />
            <span>Geri Al</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={path.length === 0 || isSolved}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-200 bg-slate-900/80 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed border border-white/10 rounded-full transition-all active:scale-95"
            aria-label="Bulmacayı sıfırla"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Baştan Dene</span>
          </button>
        </div>
      </main>

      {/* Footer Subtitle */}
      <footer className="w-full text-center pb-2">
        <p className="text-xs text-slate-400 font-medium tracking-wide">
          Rekabetin yeni seviyesi · <span className="text-amber-300">Bugün tüm rekorlar senin elinde ✨</span>
        </p>
      </footer>

      {/* Victory Celebration Modal Overlay */}
      <AnimatePresence>
        {isSolved && celebrationStep >= 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900/95 to-[#080D19] border border-amber-400/40 rounded-3xl p-8 text-center shadow-[0_0_60px_rgba(251,191,36,0.25)] space-y-6"
            >
              {/* Glowing Trophy Icon with celebratory confetti spark */}
              <div className="relative w-18 h-18 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400/20 via-[#4F7CFF]/20 to-[#A78BFA]/20 border border-amber-400/40 flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.3)]">
                <Trophy className="w-10 h-10 text-amber-400 animate-bounce" />
                <span className="absolute -top-2 -right-2 text-xl">🎉</span>
              </div>

              {/* Sequential Warm & Cheerful Victory Text */}
              <div className="space-y-3 min-h-[120px] flex flex-col items-center justify-center">
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-indigo-200 tracking-tight"
                >
                  TEBRİKLER GÜLBEN!
                </motion.h3>

                {celebrationStep >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-1"
                  >
                    <p className="text-lg font-semibold text-slate-100">
                      Yine kazandın! 🏆
                    </p>
                    <p className="text-xs text-amber-300 font-medium">
                      ZIP tahtasını yine tek hamlede fethettin, tebrikler!
                    </p>
                  </motion.div>
                )}

                {celebrationStep >= 3 && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-sm text-slate-300 font-light"
                  >
                    Ama bu sefer ödül biraz farklı... 😉
                  </motion.p>
                )}
              </div>

              {/* Reward Reveal Button */}
              {celebrationStep >= 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <button
                    type="button"
                    onClick={onProceedToReveal}
                    className="group relative w-full inline-flex items-center justify-center gap-3 py-4 px-6 text-sm font-semibold text-white bg-gradient-to-r from-[#4F7CFF] via-[#6366F1] to-[#8B5CF6] rounded-2xl shadow-[0_0_30px_rgba(79,124,255,0.6)] hover:shadow-[0_0_40px_rgba(79,124,255,0.8)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer min-h-[48px]"
                  >
                    <span>ÖDÜLÜMÜ GÖSTER ✨</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
