import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Match } from '../types';
import { Sparkles, Zap, RefreshCw, Trophy, Crown, HelpCircle } from 'lucide-react';

interface AIBracketViewProps {
  matches: Match[];
  onReset: () => void;
  onUpdateMatches: (updatedMatches: Match[]) => void;
}

export const AIBracketView: React.FC<AIBracketViewProps> = ({ matches, onReset, onUpdateMatches }) => {
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  // Filter knockout matches
  const knockoutMatches = matches.filter(m =>
    ["Babak 32 Besar", "Babak 16 Besar", "Perempat Final", "Semifinal", "Perebutan tempat ke-3", "Final"].includes(m.group)
  );

  const r32 = matches.filter(m => m.group === "Babak 32 Besar");
  const r16 = matches.filter(m => m.group === "Babak 16 Besar");
  const qf = matches.filter(m => m.group === "Perempat Final");
  const sf = matches.filter(m => m.group === "Semifinal");
  const thirdPlace = matches.filter(m => m.group.toLowerCase().includes("tempat ke-3") || m.group.toLowerCase().includes("juara 3"));
  const finalMatch = matches.filter(m => m.group === "Final");

  const totalMatchesCount = matches.length;
  const completedCount = matches.filter(m => m.status === "Selesai").length;

  const handleSimulateStep = async () => {
    setLoading(true);
    setActionMsg("Melakukan simulasi langkah taktis...");
    try {
      const res = await fetch('/api/matches/simulate-step', { method: 'POST' });
      const data = await res.json();
      if (data.matches) {
        onUpdateMatches(data.matches);
        setActionMsg(data.message || "Simulasikan 1 laga sukses!");
      }
    } catch (err) {
      console.error(err);
      setActionMsg("Gagal melakukan simulasi langkah.");
    } finally {
      setLoading(false);
      setTimeout(() => setActionMsg(null), 4000);
    }
  };

  const handleSimulateAll = async () => {
    setLoading(true);
    setActionMsg("Menjalankan Simulasi AI untuk Seluruh Turnamen...");
    try {
      const res = await fetch('/api/matches/simulate-all-ai', { method: 'POST' });
      const data = await res.json();
      if (data.matches) {
        onUpdateMatches(data.matches);
        setActionMsg("Sukses Besar! Simulasi AI melahirkan Juara Baru!");
      }
    } catch (err) {
      console.error(err);
      setActionMsg("Gagal menjalankan simulasi penuh.");
    } finally {
      setLoading(false);
      setTimeout(() => setActionMsg(null), 4000);
    }
  };

  const handleReset = async () => {
    setLoading(true);
    setActionMsg("Mereset data turnamen...");
    try {
      const res = await fetch('/api/matches/reset', { method: 'POST' });
      const data = await res.json();
      if (data.matches) {
        onUpdateMatches(data.matches);
        setActionMsg("Turnamen Piala Dunia telah di-reset ke Fase Grup awal.");
      }
    } catch (err) {
      console.error(err);
      setActionMsg("Gagal mereset turnamen.");
    } finally {
      setLoading(false);
      setTimeout(() => setActionMsg(null), 4000);
    }
  };

  // Determine champion team
  const finalGame = finalMatch[0];
  const championTeam = finalGame && finalGame.status === "Selesai" 
    ? (finalGame.homeScore > finalGame.awayScore 
        ? { name: finalGame.homeTeam, flag: finalGame.homeFlag } 
        : finalGame.homeScore < finalGame.awayScore 
          ? { name: finalGame.awayTeam, flag: finalGame.awayFlag }
          : finalGame.homePenScore !== undefined && finalGame.awayPenScore !== undefined
            ? (finalGame.homePenScore > finalGame.awayPenScore 
                ? { name: finalGame.homeTeam, flag: finalGame.homeFlag } 
                : { name: finalGame.awayTeam, flag: finalGame.awayFlag })
            : { name: finalGame.homeTeam, flag: finalGame.homeFlag })
    : null;

  const renderMatchCard = (m: Match) => {
    const isHomeWinner = m.status === "Selesai" && (
      m.homeScore > m.awayScore || 
      (m.homePenScore !== undefined && m.awayPenScore !== undefined && m.homePenScore > m.awayPenScore)
    );
    const isAwayWinner = m.status === "Selesai" && (
      m.awayScore > m.homeScore || 
      (m.homePenScore !== undefined && m.awayPenScore !== undefined && m.awayPenScore > m.homePenScore)
    );

    return (
      <div 
        key={m.id} 
        id={`bracket-match-${m.id}`}
        className="w-64 bg-[#0a192f]/90 border border-white/10 hover:border-cyan-400/50 p-3 rounded-xl shadow-xl transition-all relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-transparent" />
        
        {/* Match header */}
        <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mb-2 border-b border-white/5 pb-1 select-none">
          <span className="font-bold text-cyan-400 uppercase tracking-wider">{m.group}</span>
          <span className="text-slate-500">{m.date}</span>
        </div>

        {/* Teams block */}
        <div className="flex flex-col gap-2">
          {/* Home team */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 max-w-[170px] truncate">
              <span className="text-sm shrink-0">{m.homeFlag}</span>
              <span className={`text-xs ${isHomeWinner ? 'text-white font-black' : m.status === 'Selesai' ? 'text-slate-500' : 'text-slate-300'}`}>
                {m.homeTeam}
              </span>
              {isHomeWinner && <Crown size={11} className="text-yellow-400 shrink-0 inline" />}
            </div>
            <div className="font-mono text-xs text-white font-bold flex items-center gap-1">
              <span>{m.status === "Belum Mulai" ? "-" : m.homeScore}</span>
              {m.homePenScore !== undefined && (
                <span className="text-[10px] text-yellow-400">({m.homePenScore})</span>
              )}
            </div>
          </div>

          {/* Away team */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 max-w-[170px] truncate">
              <span className="text-sm shrink-0">{m.awayFlag}</span>
              <span className={`text-xs ${isAwayWinner ? 'text-white font-black' : m.status === 'Selesai' ? 'text-slate-500' : 'text-slate-300'}`}>
                {m.awayTeam}
              </span>
              {isAwayWinner && <Crown size={11} className="text-yellow-400 shrink-0 inline" />}
            </div>
            <div className="font-mono text-xs text-white font-bold flex items-center gap-1">
              <span>{m.status === "Belum Mulai" ? "-" : m.awayScore}</span>
              {m.awayPenScore !== undefined && (
                <span className="text-[10px] text-yellow-400">({m.awayPenScore})</span>
              )}
            </div>
          </div>
        </div>

        {/* Stadium details */}
        {m.status === "Selesai" ? (
          <div className="mt-2 pt-1 border-t border-white/5 flex justify-between items-center text-[9px] text-slate-500 font-mono">
            <span>⏱️ SELESAI</span>
            <span className="truncate max-w-[140px]">{m.city}</span>
          </div>
        ) : (
          <div className="mt-2 pt-1 border-t border-white/5 flex justify-between items-center text-[9px] text-cyan-400/80 font-mono animate-pulse">
            <span>🏟️ {m.stadium}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 select-none" id="ai-bracket-main-container">
      {/* Control center banner */}
      <div className="bg-[#001233] border border-white/10 p-5 rounded-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/5 blur-[80px] rounded-full pointer-events-none" />
        <div>
          <h2 className="text-lg font-display font-black text-white uppercase italic tracking-tight flex items-center gap-2 select-none">
            <Sparkles className="text-cyan-400 h-5 w-5 animate-pulse" />
            <span>KONTROL SIMULATOR PIALA DUNIA (MODE AI)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Simulasikan seluruh hasil sisa piala dunia piala dunia kebanggaan Anda, secara otomatis beralih dari fase grup sampai ke Final. AI mensimulasikan taktik, skor dinamis, adu penalti, serta statistik secara independen!
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
              Total Laga: <strong>72 (Grup)</strong> + Knockout
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/5 px-2 py-0.5 rounded border border-cyan-500/10">
              Selesai: <strong>{completedCount}</strong> / <strong>{totalMatchesCount}</strong> Laga
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={handleSimulateStep}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-xs text-white font-bold transition-all border border-indigo-400/20 active:scale-95 disabled:opacity-50 select-none"
          >
            <Zap size={13} className="animate-bounce" />
            <span>Simulasi 1 Laga</span>
          </button>

          <button
            onClick={handleSimulateAll}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs text-white font-bold transition-all border border-cyan-400/20 active:scale-95 disabled:opacity-50 shadow-[0_0_15px_rgba(6,182,212,0.3)] select-none animate-pulse"
          >
            <Sparkles size={13} className="text-yellow-300" />
            <span>Simulasikan Semua via AI</span>
          </button>

          <button
            onClick={handleReset}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 text-xs text-slate-300 hover:text-white hover:bg-white/10 font-bold transition-all border border-white/10 active:scale-95 disabled:opacity-50 select-none"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>Reset Turnamen</span>
          </button>
        </div>
      </div>

      {actionMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-cyan-950/40 border border-cyan-400/30 text-cyan-200 px-4 py-3 rounded-xl text-xs font-mono flex items-center gap-2 select-none"
        >
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>🚀 {actionMsg}</span>
        </motion.div>
      )}

      {/* Champion Celebration Slot */}
      {championTeam && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-[#ffe066]/10 via-[#cc9900]/5 to-transparent border border-yellow-500/30 p-6 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden select-none"
        >
          <div className="absolute top-0 bottom-0 left-0 right-0 bg-[radial-gradient(circle_at_center,rgba(253,224,71,0.1)_0,transparent_60%)] pointer-events-none" />
          <motion.div 
            animate={{ rotate: [0, -5, 5, -5, 5, 0] }}
            transition={{ repeat: Infinity, duration: 4, repeatDelay: 2 }}
            className="p-3 bg-yellow-500/20 rounded-full border border-yellow-500/30 inline-block mb-3"
          >
            <Trophy size={42} className="text-yellow-400 filter drop-shadow-lg" />
          </motion.div>
          
          <h3 className="text-xs font-mono font-black text-yellow-400 uppercase tracking-widest">
            🎉 SANG JUARA PIALA DUNIA 2026 🎉
          </h3>
          <p className="text-3xl font-display font-black text-white uppercase italic tracking-tighter mt-2 inline-flex items-center gap-3">
            <span>{championTeam.flag} {championTeam.name}</span>
          </p>
          <p className="text-slate-400 text-xs font-sans mt-1 max-w-md">
            Selamat kepada skuad garang dari <strong>{championTeam.name}</strong> atas keberhasilannya mengangkat trofi legendaris Piala Dunia FIFA 2026 setelah melewati drama sepak bola berkualitas tinggi di bawah simulasi AI!
          </p>
        </motion.div>
      )}

      {/* Bracket Tree View */}
      {knockoutMatches.length === 0 ? (
        <div className="bg-[#000814]/60 border border-white/5 py-12 px-6 rounded-2xl flex flex-col items-center justify-center text-center select-none">
          <HelpCircle size={48} className="text-slate-600 mb-4" />
          <h3 className="text-sm font-display font-bold text-white uppercase">Turnamen Belum Berada di Fase Gugur</h3>
          <p className="text-xs text-slate-500 max-w-md mt-1 mb-5">
            Babak 32 Besar sampai Final akan terbuat secara dinamis begitu seluruh laga fase grup (72 pertandingan) telah selesai disimulasikan.
          </p>
          <button
            onClick={handleSimulateAll}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 text-xs text-black font-extrabold shadow-lg hover:bg-cyan-400 transition-all focus:outline-none"
          >
            <Sparkles size={14} />
            <span>Simulasikan Instan Fase Grup & Munculkan Bagan</span>
          </button>
        </div>
      ) : (
        <div className="w-full overflow-x-auto pb-6 relative select-none">
          <div className="flex gap-8 justify-start px-2 min-w-[1300px]">
            
            {/* Round of 32 Column */}
            <div className="flex flex-col gap-4">
              <div className="text-xs font-mono font-black text-slate-400 bg-white/5 py-1.5 px-3 rounded-lg border border-white/5 mb-2 text-center select-none">
                ⚽ BABAK 32 BESAR (16 Laga)
              </div>
              <div className="flex flex-col gap-4 max-h-[850px] overflow-y-auto pr-2">
                {r32.map(m => renderMatchCard(m))}
              </div>
            </div>

            {/* Connecting Gap spacing */}
            <div className="flex flex-col gap-4">
              <div className="text-xs font-mono font-black text-cyan-400 bg-cyan-950/20 py-1.5 px-3 rounded-lg border border-cyan-500/10 mb-2 text-center select-none">
                🔥 BABAK 16 BESAR (8 Laga)
              </div>
              <div className="flex flex-col gap-4 justify-around h-full py-12">
                {r16.map(m => renderMatchCard(m))}
              </div>
            </div>

            {/* Quarter Finals Column */}
            <div className="flex flex-col gap-4">
              <div className="text-xs font-mono font-black text-purple-400 bg-purple-950/20 py-1.5 px-3 rounded-lg border border-purple-500/10 mb-2 text-center select-none">
                💥 PEREMPAT FINAL (4 Laga)
              </div>
              <div className="flex flex-col gap-4 justify-around h-full py-24">
                {qf.map(m => renderMatchCard(m))}
              </div>
            </div>

            {/* Semifinals Column */}
            <div className="flex flex-col gap-4">
              <div className="text-xs font-mono font-black text-pink-400 bg-pink-950/20 py-1.5 px-3 rounded-lg border border-pink-500/10 mb-2 text-center select-none">
                ⚡ SEMIFINAL (2 Laga)
              </div>
              <div className="flex flex-col gap-4 justify-around h-full py-36">
                {sf.map(m => renderMatchCard(m))}
              </div>
            </div>

            {/* Final and Juara 3 Column */}
            <div className="flex flex-col gap-4">
              <div className="text-xs font-mono font-black text-yellow-400 bg-yellow-500/10 py-1.5 px-3 rounded-lg border border-yellow-500/20 mb-2 text-center select-none">
                🏆 REBUTAN JUARA 3 & GRAND FINAL
              </div>
              <div className="flex flex-col gap-8 justify-center h-full">
                {thirdPlace.length > 0 && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] text-slate-500 font-mono tracking-wider font-extrabold text-center uppercase block">Perebutan Tempat Ke-3</span>
                    {renderMatchCard(thirdPlace[0])}
                  </div>
                )}
                
                {finalMatch.length > 0 && (
                  <div className="flex flex-col gap-1.5 relative">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 shrink-0 bg-yellow-500 text-black text-[9px] font-mono uppercase font-black px-2 py-0.5 rounded shadow shadow-yellow-500/50 flex items-center gap-1">
                      <Trophy size={10} />
                      <span>The Big Final</span>
                    </div>
                    {renderMatchCard(finalMatch[0])}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
