import { useState, useEffect } from 'react';
import { Match, MatchEvent } from '../types';
import { Shield, Sparkles, MapPin, BarChart3, Clock, AlertTriangle, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MatchDetailProps {
  match: Match | null;
}

export default function MatchDetail({ match }: MatchDetailProps) {
  const [geminiAnalysis, setGeminiAnalysis] = useState<string>("");
  const [analyzing, setAnalyzing] = useState(false);
  const [errorText, setErrorText] = useState("");

  // Clear analysis when match changes so we can grab fresh one
  useEffect(() => {
    setGeminiAnalysis("");
    setErrorText("");
  }, [match?.id]);

  if (!match) {
    return (
      <div id="no-match-detail-panel" className="bg-[#050b1d] border border-white/10 rounded-2xl p-8 text-center text-slate-400 h-full flex flex-col items-center justify-center gap-2">
        <div className="w-16 h-16 rounded-full bg-slate-900/40 border border-white/10 flex items-center justify-center text-cyan-400 animate-pulse">
          ⚽
        </div>
        <h3 className="font-display font-semibold text-white mt-2">Daftar Pertandingan</h3>
        <p className="text-xs max-w-xs mx-auto text-slate-500">
          Silakan klik salah satu laga di sebelah kiri untuk melihat statistik langsung, peristiwa gawang, dan taklimat khusus komentator AI Gemini!
        </p>
      </div>
    );
  }

  // Handle triggering server-side Gemini commentary
  const getAIAnalysis = async () => {
    setAnalyzing(true);
    setGeminiAnalysis("");
    setErrorText("");
    try {
      const response = await fetch(`/api/gemini/analyze/${match.id}`);
      if (!response.ok) {
        throw new Error("Gagal mengambil data komentator.");
      }
      const data = await response.json();
      if (data.analysis) {
        setGeminiAnalysis(data.analysis);
      } else {
        throw new Error("Data ulasan kosong.");
      }
    } catch (err: any) {
      setErrorText("Gagal terhubung dengan satelit komentator Gemini. Mengaktifkan siaran darurat...");
      // Failover fallback commentary
      setTimeout(() => {
        setGeminiAnalysis(`### 🔥 DRAAAMA LUAR BIASA BUNG!\n\nPertandingan luhur mematikan antara **${match.homeTeam}** dan **${match.awayTeam}** menggetarkan tiang stadion! Kedua pelatih meracik taktik serangan super militan, saling membalas gempuran hingga detik akhir. Para suporter dibuat jantungan tak bernapas! Laga berkelas piala dunia murni telah tersuguh!`);
      }, 1000);
    } finally {
      setAnalyzing(false);
    }
  };

  // Percent calculator
  const getPercentage = (stat: [number, number] | undefined, index: 0 | 1) => {
    if (!stat) return "50%";
    const total = stat[0] + stat[1];
    if (total === 0) return "50%";
    return `${Math.round((stat[index] / total) * 100)}%`;
  };

  return (
    <div id="match-details-panel" className="bg-[#050b1d] border border-white/10 rounded-2xl p-5 flex flex-col gap-4 shadow-xl backdrop-blur-md">
      
      {/* Stadium header banner */}
      <div className="flex justify-between items-center bg-[#001233] p-3 rounded-xl border border-white/10">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Clock size={12} className="text-pink-400" />
          <span>Status Laga: </span>
          <span className={`font-mono font-bold ${match.isLive ? 'text-cyan-400' : 'text-slate-300'}`}>
            {match.status}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-cyan-400">
          <MapPin size={11} className="animate-bounce" />
          <span>{match.stadium}, {match.city}</span>
        </div>
      </div>

      {/* Main Score Board Profile */}
      <div className="text-center bg-[#020617] p-5 rounded-2xl border border-white/10 relative overflow-hidden">
        {/* Pitch background water ring */}
        <div className="absolute inset-0 bg-[#0c2f21]/5 pointer-events-none" />

        <div className="grid grid-cols-12 items-center gap-2 relative z-10">
          {/* Home */}
          <div className="col-span-4 flex flex-col items-center">
            <motion.div 
              whileHover={{ scale: 1.15 }}
              className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center text-3xl shadow-lg border border-slate-855 select-none"
            >
              {match.homeFlag}
            </motion.div>
            <h4 className="text-sm font-bold text-white mt-2 font-display">{match.homeTeam}</h4>
            <span className="text-[10px] text-slate-500 uppercase mt-0.5 tracking-tight">Kandang</span>
          </div>

          {/* Verses & score */}
          <div className="col-span-4 flex flex-col items-center justify-center">
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono font-bold mb-1 uppercase">
              {match.group}
            </span>
            {match.date && (
              <span className="text-[10px] text-slate-400 font-semibold tracking-wide mb-2 leading-none">
                {match.date}
              </span>
            )}
            <div className="flex items-center gap-3">
              <span className={`text-3xl sm:text-4xl font-mono font-black ${
                match.isLive ? 'text-cyan-400 animate-pulse' : 'text-cyan-400 text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-cyan-500'
              }`}>
                {match.status === "Belum Mulai" ? "-" : match.homeScore}
              </span>
              <span className="text-slate-500 font-mono text-sm">VS</span>
              <span className={`text-3xl sm:text-4xl font-mono font-black ${
                match.isLive ? 'text-cyan-400 animate-pulse' : 'text-cyan-400 text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-cyan-500'
              }`}>
                {match.status === "Belum Mulai" ? "-" : match.awayScore}
              </span>
            </div>
            {match.isLive && (
              <span className="text-[9px] text-cyan-400 font-mono tracking-widest uppercase mt-2 font-bold animate-ping">
                🔴 SEDANG BERLANGSUNG
              </span>
            )}
          </div>

          {/* Away */}
          <div className="col-span-4 flex flex-col items-center">
            <motion.div 
              whileHover={{ scale: 1.15 }}
              className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center text-3xl shadow-lg border border-slate-855 select-none"
            >
              {match.awayFlag}
            </motion.div>
            <h4 className="text-sm font-bold text-white mt-2 font-display">{match.awayTeam}</h4>
            <span className="text-[10px] text-slate-500 uppercase mt-0.5 tracking-tight">Tandang</span>
          </div>
        </div>
      </div>

      {/* TABS OF DATA (Chronology Timeline / Match Stats) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
        
        {/* 1. MATCH STATS GRAPH */}
        <div className="bg-[#020617] p-4 rounded-xl border border-white/10 flex flex-col gap-3">
          <div className="flex items-center gap-1.5 border-b border-white/10 pb-2">
            <BarChart3 size={15} className="text-cyan-400" />
            <h5 className="text-xs font-display font-bold uppercase text-white tracking-widest">STATISTIK LAGALIVE</h5>
          </div>

          {match.status === "Belum Mulai" ? (
            <div className="py-8 text-center text-xs text-slate-500 flex flex-col items-center gap-1.5">
              <AlertCircle size={22} className="text-slate-600" />
              <span>Statistik akan terisi otomatis saat sepak mula (kickoff) dimulai!</span>
            </div>
          ) : (
            <div className="flex flex-col gap-3.5 pt-1">
              
              {/* Possession */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>{match.possession?.[0] || 50}%</span>
                  <span className="font-sans text-[10px] uppercase text-slate-500">Penguasaan Bola</span>
                  <span>{match.possession?.[1] || 50}%</span>
                </div>
                {/* Visual bar */}
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-l-full shadow" style={{ width: getPercentage(match.possession, 0) }} />
                  <div className="bg-pink-500 h-full rounded-r-full shadow" style={{ width: getPercentage(match.possession, 1) }} />
                </div>
              </div>

              {/* Shots */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>{match.shots?.[0] || 0}</span>
                  <span className="font-sans text-[10px] uppercase text-slate-500">Total Tembakan</span>
                  <span>{match.shots?.[1] || 0}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="bg-cyan-400 h-full" style={{ width: getPercentage(match.shots, 0) }} />
                  <div className="bg-pink-500 h-full" style={{ width: getPercentage(match.shots, 1) }} />
                </div>
              </div>

              {/* Fouls */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>{match.fouls?.[0] || 0}</span>
                  <span className="font-sans text-[10px] uppercase text-slate-500">Pelanggaran</span>
                  <span>{match.fouls?.[1] || 0}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="bg-cyan-400 h-full" style={{ width: getPercentage(match.fouls, 0) }} />
                  <div className="bg-pink-500 h-full" style={{ width: getPercentage(match.fouls, 1) }} />
                </div>
              </div>

              {/* Cards */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs text-slate-400 border-t border-slate-800/50 pt-2.5">
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-3.5 bg-yellow-400 rounded-sm inline-block shadow" />
                    <span className="font-mono">{match.yellowCards?.[0] || 0}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-3.5 bg-red-600 rounded-sm inline-block shadow" />
                    <span className="font-mono">{match.redCards?.[0] || 0}</span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-4 border-l border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-3.5 bg-yellow-400 rounded-sm inline-block shadow" />
                    <span className="font-mono">{match.yellowCards?.[1] || 0}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-3.5 bg-red-600 rounded-sm inline-block shadow" />
                    <span className="font-mono">{match.redCards?.[1] || 0}</span>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* 2. CHRONOLOGY TIMELINE EVENTS */}
        <div className="bg-[#020617] p-4 rounded-xl border border-white/10 flex flex-col gap-3">
          <div className="flex items-center gap-1.5 border-b border-white/10 pb-2">
            <Clock size={15} className="text-cyan-400" />
            <h5 className="text-xs font-display font-bold uppercase text-white tracking-widest">KRONOLOGI PERISTIWA</h5>
          </div>

          <div className="max-h-[175px] overflow-y-auto pr-1 flex flex-col gap-2 pt-0.5 scrollbar-thin">
            {match.events.length > 0 ? (
              match.events.map(event => (
                <div 
                  key={event.id}
                  className={`p-2 rounded-lg text-xs flex justify-between items-center border border-white/10 bg-[#020617]`}
                >
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono font-bold text-[10px]">
                      {event.minute}'
                    </span>
                    <span className="text-lg">
                      {event.type === 'goal' ? '⚽' : event.type === 'yellow_card' ? '🟨' : '🟥'}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-semibold text-white">{event.player}</span>
                      {event.assistant && (
                        <span className="text-[10px] text-slate-500">Asis: {event.assistant}</span>
                      )}
                      {event.detail && (
                        <span className="text-[9px] text-cyan-400 font-medium">{event.detail}</span>
                      )}
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    event.team === 'home' 
                      ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-900/40' 
                      : 'bg-pink-950/40 text-pink-400 border border-pink-900/40'
                  }`}>
                    {event.team === 'home' ? match.homeTeam : match.awayTeam}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-500 flex flex-col items-center gap-1.5">
                <AlertCircle size={22} className="text-slate-600" />
                <span>Belum ada gol atau kartu tercipta di laga krusial ini.</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 3. SHINY GOOGLE GEMINI AUTOMATED COMMENTARY CORNER */}
      <div className="relative mt-2 p-4 rounded-xl border border-white/10 bg-[#001233] overflow-hidden cyan-glow">
        
        {/* Backlight animation */}
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-40 h-40 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="p-1 px-1.5 bg-gradient-to-tr from-cyan-400 to-pink-500 text-slate-950 rounded-lg text-[10px] font-black animate-bounce uppercase">
              AI ANALYST
            </span>
            <div>
              <h5 className="text-sm font-display font-black tracking-tight text-white flex items-center gap-1 uppercase italic">
                Komentar Cerdas Gemini AI
                <Sparkles size={13} className="text-cyan-400 animate-spin" />
              </h5>
              <p className="text-[10px] text-slate-400">Taklimat eksklusif real-time dari analis data sepak bola luhur</p>
            </div>
          </div>

          <button
            id="trigger-ai-analysis-btn"
            onClick={getAIAnalysis}
            disabled={analyzing}
            className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-400 to-blue-600 hover:opacity-95 text-slate-950 disabled:bg-slate-800 disabled:text-slate-500 font-black tracking-tight uppercase rounded-lg text-xs flex items-center gap-1.5 transition-opacity focus:outline-none"
          >
            {analyzing ? (
              <>
                <RefreshCw size={12} className="animate-spin" />
                Meracik Kajian...
              </>
            ) : (
              <>
                ⚡ Analisis Komentator AI
              </>
            )}
          </button>
        </div>

        {/* Gemini Response Display Panel with custom typewriter style box */}
        <div className="mt-3">
          {analyzing ? (
            <div className="flex flex-col gap-2 py-4 items-center justify-center text-xs text-cyan-400 animate-pulse">
              <span className="text-2xl animate-spin">⚽</span>
              <span>Bung Bola (AI) sedang membolak-balik statistik piala dunia...</span>
            </div>
          ) : errorText && !geminiAnalysis ? (
            <div className="p-3 text-xs text-pink-400 bg-pink-950/10 border border-pink-900/30 rounded-lg flex items-center gap-2">
              <AlertTriangle size={15} />
              <span>{errorText}</span>
            </div>
          ) : geminiAnalysis ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-slate-300 leading-relaxed font-sans bg-black/40 p-4 rounded-xl border border-white/5"
            >
              {/* Fake avatar tag */}
              <div className="flex items-center gap-2 mb-2 text-[10px] font-mono text-cyan-400 uppercase font-black tracking-wider">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                KOMENTATOR AKTIF
              </div>

              {/* Renders line-breaks correctly as simple markdown converter */}
              <div className="whitespace-pre-wrap font-sans text-slate-200">
                {geminiAnalysis}
              </div>
            </motion.div>
          ) : (
            <div className="py-6 text-center text-xs text-slate-500">
              Tekan tombol <span className="text-cyan-400 font-bold font-mono">⚡ Analisis Komentator AI</span> di atas untuk mendengarkan ulasan bergelora Bung Bola mengenai dinamika laga piala dunia ini!
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
