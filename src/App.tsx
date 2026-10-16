/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { IntroScene } from './components/IntroScene';
import { ZipBoard } from './components/ZipBoard';
import { RevealScene } from './components/RevealScene';
import { MessageScene } from './components/MessageScene';
import { SurpriseScene } from './components/SurpriseScene';
import { SoundToggle } from './components/SoundToggle';
import { PUZZLES } from './game/rules';

export type AppScene =
  | 'INTRO'
  | 'GAME'
  | 'REVEAL'
  | 'MESSAGE'
  | 'SURPRISE';

export default function App() {
  const [currentScene, setCurrentScene] = useState<AppScene>('INTRO');
  const [activePuzzleIndex, setActivePuzzleIndex] = useState(0);
  const [lastSolveTime, setLastSolveTime] = useState<number | null>(null);

  // Check URL params for ?autostart=1 to allow instant automated testing of gameplay
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        setCurrentScene('GAME');
      }
    }
  }, []);

  const handleStartGame = () => {
    setCurrentScene('GAME');
  };

  const handlePuzzleSolved = (timeSpent: number) => {
    setLastSolveTime(timeSpent);
  };

  const handleProceedToReveal = () => {
    setCurrentScene('REVEAL');
  };

  const handleProceedToMessage = () => {
    setCurrentScene('MESSAGE');
  };

  const handleProceedToSurprise = () => {
    setCurrentScene('SURPRISE');
  };

  const handleStartRematch = () => {
    // Switch to Puzzle 2 (or toggle between puzzles)
    setActivePuzzleIndex((prev) => (prev + 1) % PUZZLES.length);
    setCurrentScene('GAME');
  };

  const currentPuzzle = PUZZLES[activePuzzleIndex] || PUZZLES[0];

  return (
    <div className="relative w-full min-h-screen bg-[#080D19] text-[#F8FAFC] overflow-x-hidden selection:bg-[#4F7CFF]/30 selection:text-white">
      {/* Global Persistent Floating Audio Control */}
      <div className="fixed top-4 right-4 z-50">
        <SoundToggle />
      </div>

      <AnimatePresence mode="wait">
        {currentScene === 'INTRO' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full min-h-screen"
          >
            <IntroScene onStartGame={handleStartGame} />
          </motion.div>
        )}

        {currentScene === 'GAME' && (
          <motion.div
            key={`game-${currentPuzzle.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full min-h-screen"
          >
            <ZipBoard
              puzzle={currentPuzzle}
              onPuzzleSolved={handlePuzzleSolved}
              onProceedToReveal={handleProceedToReveal}
            />
          </motion.div>
        )}

        {currentScene === 'REVEAL' && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full min-h-screen"
          >
            <RevealScene onProceedToMessage={handleProceedToMessage} />
          </motion.div>
        )}

        {currentScene === 'MESSAGE' && (
          <motion.div
            key="message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full min-h-screen"
          >
            <MessageScene onProceedToSurprise={handleProceedToSurprise} />
          </motion.div>
        )}

        {currentScene === 'SURPRISE' && (
          <motion.div
            key="surprise"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full min-h-screen"
          >
            <SurpriseScene
              onBackToMessage={handleProceedToMessage}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
