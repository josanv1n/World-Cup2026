import { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Tv, Volume2, ShieldAlert, Sparkles } from 'lucide-react';

interface YoutubeEmbedProps {
  url: string;
}

export default function YoutubeEmbed({ url }: YoutubeEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Extract YouTube video ID
  const getEmbedId = (youtubeUrl: string) => {
    try {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = youtubeUrl.match(regExp);
      return (match && match[2].length === 11) ? match[2] : "kq-5PD_1wwA";
    } catch {
      return "kq-5PD_1wwA";
    }
  };

  const videoId = getEmbedId(url);
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&mute=0&rel=0&modestbranding=1`;

  return (
    <div id="stadium-video-theater-container" className="relative w-full rounded-2xl bg-[#050b1d] p-1.5 border border-white/10 shadow-2xl overflow-hidden mt-2 cyan-glow">
      {/* Laser spotlight lightbars inside the frame */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-pink-400 to-blue-600 animate-pulse z-20 pointer-events-none" />

      {/* Decorative Outer Bezel Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />

      {/* Dynamic scoreboard banner */}
      <div className="bg-[#001233] border-b border-white/10 px-4 py-2 flex items-center justify-between text-xs font-mono font-bold tracking-tight text-cyan-400">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping inline-block" />
          <span className="text-white flex items-center gap-1 font-display uppercase italic">
            <Tv size={14} className="text-cyan-400 animate-pulse" />
            FIFA TV EXCLUSIVE
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles size={11} className="text-cyan-400 animate-spin" />
          <span className="hidden sm:inline">OFFICIAL PRE-SHOW INTRO: FIFA 2026</span>
          <span className="bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded text-[10px] border border-cyan-500/20">4K ULTRA HD</span>
        </div>
      </div>

      <div className="relative aspect-video w-full bg-slate-900 overflow-hidden flex items-center justify-center">
        {!isPlaying ? (
          /* High-Fidelity Custom Stadium Poster Stage with Interactive Overlay */
          <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#0a1530] via-[#020617] to-black">
            
            {/* Visual glow background ring */}
            <div className="absolute -inset-10 bg-gradient-to-b from-cyan-500/10 via-pink-500/10 to-transparent rounded-full blur-3xl opacity-65 pointer-events-none" />

            {/* Stadium seats watermark ornament */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(rgba(10,32,51,0)_0%,rgba(3,10,22,0.95)_100%)] z-0 pointer-events-none" />

            {/* Simulated camera focus frame */}
            <div className="absolute inset-6 border border-white/5 pointer-events-none flex flex-col justify-between p-2 font-mono text-[9px] text-white/30 z-10 select-none">
              <div className="flex justify-between">
                <span>[REC] 2160p</span>
                <span>SPOTLIGHTS: ACTIVE</span>
              </div>
              <div className="flex justify-between">
                <span>STADIUM BROADCAST</span>
                <span>CH: 01_WC2026</span>
              </div>
            </div>

            {/* Immersive FIFA World Cup Poster Backdrop text and graphic */}
            <div className="z-10 text-center flex flex-col items-center px-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="mb-3"
              >
                {/* Simulated championship graphic */}
                <span className="px-3 py-1 bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 rounded-full font-display text-xs tracking-widest font-bold block mb-2 cyan-glow uppercase scale-[0.9] italic">
                  🏆 UNITED 2026
                </span>
                
                <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-white uppercase tracking-tighter text-center max-w-sm sm:max-w-xl italic">
                  FIFA World Cup 2026
                </h2>
                <p className="text-slate-400 text-xs mt-1 font-sans text-center max-w-sm sm:max-w-md mx-auto">
                  Sambut Kemeriahan Turnamen Terbesar Sejarah di Amerika, Kanada, & Meksiko!
                </p>
              </motion.div>

              {/* Big pulsing cyan play button */}
              <motion.button
                whileHover={{ scale: 1.12, boxShadow: "0 0 30px rgba(6, 182, 212, 0.7)" }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setIsPlaying(true)}
                className="relative mt-2 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center shadow-2xl border-4 border-slate-950 focus:outline-none transition-shadow z-20"
              >
                {/* Pulse wave ring */}
                <span className="absolute -inset-3 rounded-full border-2 border-cyan-400/20 animate-ping pointer-events-none" />
                <Play size={24} className="text-slate-950 fill-slate-950 ml-1" />
              </motion.button>

              <div className="mt-4 flex items-center gap-1 text-[11px] text-cyan-400 font-mono opacity-80 bg-slate-950/80 px-2.5 py-1 rounded-full border border-white/10">
                <Volume2 size={12} className="animate-pulse text-cyan-400" />
                <span>Klik untuk menonton Official Intro Video</span>
              </div>
            </div>
            
            {/* Real aesthetic background mock vector style stadium lights */}
            <div className="absolute top-8 left-10 flex gap-1 pointer-events-none opacity-40">
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
            </div>
            <div className="absolute top-8 right-10 flex gap-1 pointer-events-none opacity-40">
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
            </div>
          </div>
        ) : (
          /* Actual YouTube Iframe video stream */
          <iframe
            id="stadium-youtube-iframe"
            className="w-full h-full border-0 rounded-b"
            src={embedUrl}
            title="FIFA World Cup 2026 Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        )}
      </div>

      {/* Interactive Quick Stats / Commentary overlay banner at base */}
      <div className="bg-slate-950/90 py-1.5 px-3 flex items-center justify-between text-[11px] border-t border-white/10 text-slate-400 font-sans">
        <span className="flex items-center gap-1">
          <ShieldAlert size={12} className="text-cyan-400" />
          Mempresentasikan visual kebersamaan akbar piala dunia bersejarah.
        </span>
        {isPlaying && (
          <button 
            id="stop-video-btn"
            onClick={() => setIsPlaying(false)} 
            className="text-cyan-400 hover:text-white transition-colors hover:underline focus:outline-none"
          >
            Tutup Cuplikan ×
          </button>
        )}
      </div>
    </div>
  );
}
