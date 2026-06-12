import { useState } from 'react';
import { motion, useAnimation } from 'motion/react';
import { Sparkles, Trophy } from 'lucide-react';

export default function InteractiveBall() {
  const [kickCount, setKickCount] = useState(0);
  const [lastPhrase, setLastPhrase] = useState("KICK ME!");
  const [phraseActive, setPhraseActive] = useState(false);
  const controls = useAnimation();

  // Soccer commentator phrases in Indonesian
  const phrases = [
    "JEBREEET!!!",
    "GOOOL LUAR BIASA!",
    "TENDANGAN GELEDEK!",
    "PELUANG EMAS!",
    "SUNDULAN MAUT!",
    "MEMBELAH LAUTAN!",
    "KIPER JANTUNGAN!",
    "CUEK BEBEK BUNG!",
    "AHAIII MANIS SEKALI!",
    "TIANG GAWANG GAWATT!"
  ];

  // Synthesis sound effects for zero-dependency audio
  const playKickSound = (pitch: number) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Node 1: Kick impact
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.15);
      
      gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);

      // Node 2: Cheering crowd beep synth
      if (pitch > 200) {
        const oscCrowd = audioCtx.createOscillator();
        const gainCrowd = audioCtx.createGain();
        oscCrowd.connect(gainCrowd);
        gainCrowd.connect(audioCtx.destination);
        oscCrowd.type = 'sawtooth';
        oscCrowd.frequency.setValueAtTime(pitch * 1.5, audioCtx.currentTime);
        oscCrowd.frequency.linearRampToValueAtTime(pitch * 2, audioCtx.currentTime + 0.35);
        gainCrowd.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gainCrowd.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
        oscCrowd.start();
        oscCrowd.stop(audioCtx.currentTime + 0.45);
      }
    } catch {
      // AudioContext may be blocked by iframe, fail silently as required
    }
  };

  const handleKick = async () => {
    // Increment kicks count
    const nextCount = kickCount + 1;
    setKickCount(nextCount);
    
    // Choose randomly from exciting phrases
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    setLastPhrase(randomPhrase);
    setPhraseActive(true);
    setTimeout(() => setPhraseActive(false), 1200);

    // Play synthesized celebratory sound
    const pitch = 150 + (nextCount % 5) * 80;
    playKickSound(pitch);

    // Dynamic Framer-motion multi-bouncing simulation
    await controls.start({
      y: [0, -180, 40, -90, 20, -30, 0],
      x: [0, Math.random() > 0.5 ? 40 : -40, Math.random() > 0.5 ? -20 : 20, 0],
      rotate: [0, 360, 720, 1080],
      transition: {
        duration: 1.4,
        ease: "easeInOut"
      }
    });
  };

  return (
    <div id="interactive-soccer-ball-container" className="fixed bottom-6 left-6 z-50 flex flex-col items-center select-none pointer-events-auto">
      {/* Phrase box above the ball */}
      <motion.div
        id="ball-phrase-banner"
        initial={{ opacity: 0, scale: 0.5, y: 15 }}
        animate={phraseActive ? { opacity: 1, scale: 1.1, y: -10 } : { opacity: 0.8, scale: 0.9, y: 0 }}
        className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg border backdrop-blur-md flex items-center gap-1 ${
          phraseActive 
            ? 'bg-[#001233] border-cyan-400 text-cyan-400 cyan-glow font-display uppercase italic' 
            : 'bg-[#020617]/90 border-white/10 text-cyan-400 font-display'
        }`}
      >
        {phraseActive ? <Sparkles size={12} className="animate-spin text-cyan-400" /> : <Trophy size={11} className="text-cyan-400" />}
        <span>{lastPhrase}</span>
        {kickCount > 0 && (
          <span className="ml-1 px-1.5 py-0.2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-md text-[10px]">{kickCount}x</span>
        )}
      </motion.div>

      {/* Physics Ball */}
      <motion.div
        id="kickable-soccer-ball"
        animate={controls}
        whileHover={{ scale: 1.15, cursor: "pointer" }}
        whileTap={{ scale: 0.9 }}
        onClick={handleKick}
        className="relative w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center shadow-xl border-4 border-slate-900 group"
        style={{
          boxShadow: '0 0 20px rgba(6,182,212,0.4), inset -10px -10px 15px rgba(0,0,0,0.25)'
        }}
      >
        {/* Soccer ball pattern SVG layout */}
        <div className="absolute inset-0 rounded-full overflow-hidden flex items-center justify-center">
          {/* Classic Pentagons / hexagons */}
          <div className="w-5 h-5 bg-slate-950 clip-pentagon transform translate-y-[-24px]" />
          <div className="w-5 h-5 bg-slate-950 clip-pentagon transform translate-x-[-24px]" />
          <div className="w-5 h-5 bg-slate-950 clip-pentagon transform translate-x-[24px]" />
          <div className="w-5 h-5 bg-slate-950 clip-pentagon transform translate-y-[24px]" />
          <div className="w-5 h-5 bg-slate-950 rotate-[36deg]" />
          
          {/* Connecting lines */}
          <div className="absolute w-full h-0.5 bg-slate-800 rotate-45 opacity-60" />
          <div className="absolute w-full h-0.5 bg-slate-800 -rotate-45 opacity-60" />
          <div className="absolute h-full w-0.5 bg-slate-800 opacity-60" />
          <div className="absolute w-full h-0.5 bg-slate-800 opacity-60" />
        </div>

        {/* Outer shine rim */}
        <div className="absolute inset-0.5 rounded-full border border-white/40 pointer-events-none" />

        {/* Small pink sparkle particle */}
        <div className="absolute right-1 top-2 w-2 h-2 rounded-full bg-pink-500 blur-[1px] animate-pulse" />
      </motion.div>

      {/* Stadium grass shadow ring */}
      <div 
        className="w-12 h-1 bg-black/40 rounded-full blur-[2px] mt-1.5 transition-all duration-300"
        style={{
          transform: phraseActive ? 'scale(0.4)' : 'scale(1)',
          opacity: phraseActive ? 0.35 : 0.8
        }}
      />
    </div>
  );
}
