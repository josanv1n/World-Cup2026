import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Match } from '../types';
import { Search, RotateCcw, AlertCircle, TrendingUp, Calendar, MapPin, RefreshCw, Star } from 'lucide-react';

interface MatchListProps {
  matches: Match[];
  selectedMatchId: string | null;
  onSelectMatch: (matchId: string) => void;
  onResetSimulation: () => void;
  refreshSeconds: number;
}

const RedCardIcon = ({ count }: { count: number }) => {
  if (count <= 0) return null;
  if (count === 1) {
    return (
      <span 
        className="w-2.5 h-3.5 bg-red-600 rounded-[2px] inline-block shadow-md border-r border-b border-red-700/80" 
        title="1 Kartu Merah" 
      />
    );
  }
  return (
    <span 
      className="min-w-[14px] h-3.5 bg-red-600 rounded-[2px] inline-flex items-center justify-center px-0.5 shadow-sm text-white font-mono font-bold text-[10px] leading-none" 
      title={`${count} Kartu Merah`}
    >
      {count}
    </span>
  );
};

export default function MatchList({ 
  matches, 
  selectedMatchId, 
  onSelectMatch, 
  onResetSimulation,
  refreshSeconds
}: MatchListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<'all' | 'live' | 'completed' | 'upcoming'>('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Sound generator on Goal Alert (Checks if score changed)
  const [prevScores, setPrevScores] = useState<Record<string, number>>({});
  
  useEffect(() => {
    matches.forEach(m => {
      const totScore = m.homeScore + m.awayScore;
      const key = m.id;
      if (prevScores[key] !== undefined && totScore > prevScores[key]) {
        // Score triggered! Spark goal chime
        triggerVisualGoalFlash(m);
      }
      prevScores[key] = totScore;
    });
    setPrevScores({ ...prevScores });
  }, [matches]);

  const [goalFlasher, setGoalFlasher] = useState<{ id: string, msg: string } | null>(null);

  const triggerVisualGoalFlash = (match: Match) => {
    const msg = `GOOOL!!! ${match.homeTeam} VS ${match.awayTeam} (${match.homeScore} - ${match.awayScore})`;
    setGoalFlasher({ id: match.id, msg });
    setTimeout(() => setGoalFlasher(null), 4000);
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(f => f !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  // Filter conditions
  const filteredMatches = matches.filter(match => {
    const matchName = `${match.homeTeam} vs ${match.awayTeam}`.toLowerCase();
    const groupName = match.group.toLowerCase();
    const matchesSearch = matchName.includes(searchTerm.toLowerCase()) || groupName.includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    if (filterType === 'live') return match.isLive;
    if (filterType === 'completed') return match.status === 'Selesai';
    if (filterType === 'upcoming') return match.status === 'Belum Mulai';
    return true;
  });

  // Sort: Favorited first, then Live first, then others
  const sortedMatches = [...filteredMatches].sort((a, b) => {
    const aFav = favorites.includes(a.id) ? 1 : 0;
    const bFav = favorites.includes(b.id) ? 1 : 0;
    if (bFav !== aFav) return bFav - aFav;

    const aLive = a.isLive ? 1 : 0;
    const bLive = b.isLive ? 1 : 0;
    return bLive - aLive;
  });

  const getStatusBadge = (match: Match) => {
    if (match.status === "Selesai") {
      return (
        <span className="px-2.5 py-1 text-xs font-mono font-medium rounded-md bg-slate-800 text-slate-400 border border-slate-700">
          Selesai
        </span>
      );
    }
    if (match.status === "Belum Mulai") {
      return (
        <span className="px-2.5 py-1 text-xs font-mono font-medium rounded-md bg-teal-950/40 text-teal-400 border border-teal-900/40 flex items-center gap-1">
          <Calendar size={11} /> {match.time}
        </span>
      );
    }
    
    // Live ticking game status
    return (
      <div className="flex flex-col items-end">
        <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-md bg-red-600 text-white flex items-center gap-1.5 animate-pulse">
          <span className="h-1.5 w-1.5 rounded-full bg-white inline-block animate-ping" />
          {match.status}
        </span>
        {match.minute > 0 && match.minute <= 90 && (
          <span className="text-[9px] text-[#22d3ee] font-mono font-bold mt-1 tracking-wider uppercase">
            LIVE TICKING
          </span>
        )}
      </div>
    );
  };

  return (
    <div id="match-list-component" className="w-full flex flex-col gap-3">
      
      {/* High Goal scoring banner dynamic alert */}
      <AnimatePresence>
        {goalFlasher && (
          <motion.div
            id="global-goal-flash-notification"
            initial={{ opacity: 0, y: -25, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.95 }}
            className="w-full bg-gradient-to-r from-cyan-500 via-pink-500 to-yellow-400 p-3 rounded-xl text-center font-display font-black text-slate-950 shadow-2xl flex items-center justify-center gap-2 border border-white/20 cyan-glow-strong"
          >
            <span className="text-xl animate-bounce">⚽</span>
            <span className="tracking-wide uppercase text-sm sm:text-base text-black font-black italic">{goalFlasher.msg}</span>
            <span className="text-xl animate-bounce">⚽</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control panel & Filter bar */}
      <div className="bg-[#001233] p-4 rounded-xl border border-white/10 flex flex-col gap-3">
        
        {/* Search header container */}
        <div className="flex flex-col md:flex-row gap-2 justify-between items-stretch md:items-center">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
              <Search size={16} />
            </span>
            <input
              id="match-search-input"
              type="text"
              placeholder="Cari tim sepak bola (e.g. Indonesia, Meksiko)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-[#020617] border border-white/10 rounded-lg focus:outline-none focus:border-cyan-400/60 text-slate-200"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Simulation reset trigger button */}
            <button
              id="reset-simulation-score-btn"
              onClick={onResetSimulation}
              title="Reset Simulasi Skor"
              className="px-3 py-2 bg-[#020617] hover:bg-slate-800 text-cyan-400 hover:text-white rounded-lg border border-white/10 text-xs font-mono flex items-center gap-1.5 transition-colors focus:outline-none"
            >
              <RotateCcw size={13} />
              Reset Simulasi
            </button>
          </div>
        </div>

        {/* Quick Filter tabs & ticker timer progress bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3">
          <div className="flex gap-1">
            {(['all', 'live', 'completed', 'upcoming'] as const).map(type => (
              <button
                key={type}
                id={`filter-btn-${type}`}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 text-xs font-display font-medium rounded-md transition-all focus:outline-none capitalize ${
                  filterType === type 
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-bold shadow-md cyan-glow' 
                    : 'bg-[#020617] text-slate-400 hover:text-slate-200 border border-white/10'
                }`}
              >
                {type === 'all' ? 'Semua Laga' : type === 'live' ? '🔴 Live' : type === 'completed' ? 'Selesai' : 'Jadwal'}
              </button>
            ))}
          </div>

          {/* Sync Engine Progress Indicator */}
          <div className="flex items-center gap-1.5 text-[11px] text-cyan-400 font-mono">
            <RefreshCw size={11} className="animate-spin text-pink-400" />
            <span>Refresh angka in:</span>
            <span className="px-1.5 py-0.2 bg-white/5 rounded text-cyan-300 font-bold">
              {refreshSeconds}s
            </span>
          </div>
        </div>
      </div>

      {/* Main Flashscore Lists Grid */}
      <div className="bg-[#050b1d] rounded-2xl border border-white/10 shadow-xl overflow-hidden">
        
        {/* Mirror Flashscore leagues bar */}
        <div className="bg-[#001233] border-b border-white/10 px-4 py-3 flex items-center justify-between text-xs font-bold tracking-tight text-white select-none">
          <div className="flex items-center gap-2 text-cyan-400">
            <TrendingUp size={15} />
            <span className="uppercase text-white font-display text-[11px] font-black tracking-wider italic">🌎 DUNIA: Piala Dunia FIFA (FIFA World Cup 2026)</span>
          </div>
          <span className="text-[10px] text-pink-400 font-mono tracking-wider font-extrabold uppercase">
            Klasemen langsung
          </span>
        </div>

        <div className="divide-y divide-white/5">
          {sortedMatches.length > 0 ? (
            sortedMatches.map(match => {
              const isSelected = selectedMatchId === match.id;
              const isFav = favorites.includes(match.id);
              return (
                <motion.div
                  key={match.id}
                  id={`match-card-${match.id}`}
                  onClick={() => onSelectMatch(match.id)}
                  whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.03)" }}
                  className={`p-4 flex items-center gap-2 cursor-pointer transition-colors relative ${
                    isSelected ? 'bg-white/5 border-l-4 border-cyan-400' : 'border-l-4 border-transparent'
                  }`}
                >
                  {/* Star Favorite element */}
                  <button
                    id={`toggle-fav-${match.id}`}
                    onClick={(e) => toggleFavorite(match.id, e)}
                    className="p-1 text-slate-500 hover:text-cyan-400 transition-colors focus:outline-none"
                  >
                    <Star size={16} className={isFav ? "fill-cyan-400 text-cyan-400" : ""} />
                  </button>

                  {/* Group Info panel */}
                  <div className="flex-1 grid grid-cols-12 items-center gap-2">
                    
                    {/* Time or minute indicators */}
                    <div className="col-span-3 sm:col-span-2 text-center flex flex-col justify-center items-center">
                      <span className="block text-[10px] text-slate-500 font-mono tracking-tight uppercase mb-0.5">
                        {match.group}
                      </span>
                      {getStatusBadge(match)}
                      {match.date && (
                        <span className="block mt-1 text-[9px] text-slate-400 font-semibold tracking-wide">
                          {match.date}
                        </span>
                      )}
                    </div>

                    {/* Team Score Container */}
                    <div className="col-span-9 sm:col-span-7 flex flex-col gap-2.5 pl-2">
                      {/* Home Team */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl" role="img" aria-label={match.homeTeam}>
                            {match.homeFlag}
                          </span>
                          <span className={`text-sm sm:text-base font-bold ${
                            match.isLive ? 'text-cyan-300' : 'text-slate-300'
                          }`}>
                            {match.homeTeam}
                          </span>
                          {/* Red Card Marker if exists in events */}
                          {match.redCards && match.redCards[0] > 0 && (
                            <RedCardIcon count={match.redCards[0]} />
                          )}
                        </div>
                        <span className={`text-base sm:text-xl font-mono font-black ${
                          match.isLive 
                            ? 'text-cyan-400 font-extrabold animate-pulse' 
                            : 'text-white'
                        }`}>
                          {match.status === "Belum Mulai" ? "-" : match.homeScore}
                        </span>
                      </div>

                      {/* Away Team */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl" role="img" aria-label={match.awayTeam}>
                            {match.awayFlag}
                          </span>
                          <span className={`text-sm sm:text-base font-bold ${
                            match.isLive ? 'text-cyan-300' : 'text-slate-300'
                          }`}>
                            {match.awayTeam}
                          </span>
                          {match.redCards && match.redCards[1] > 0 && (
                            <RedCardIcon count={match.redCards[1]} />
                          )}
                        </div>
                        <span className={`text-base sm:text-xl font-mono font-black ${
                          match.isLive 
                            ? 'text-cyan-400 font-extrabold animate-pulse' 
                            : 'text-white'
                        }`}>
                          {match.status === "Belum Mulai" ? "-" : match.awayScore}
                        </span>
                      </div>
                    </div>

                    {/* Stadium details */}
                    <div className="hidden sm:col-span-3 text-right text-[11px] text-slate-500 font-sans pr-2">
                      <div className="flex items-center gap-1 justify-end">
                        <MapPin size={10} className="text-pink-400" />
                        <span className="truncate max-w-[120px]">{match.stadium}</span>
                      </div>
                      <span className="block mt-0.5">{match.city}</span>
                    </div>

                  </div>

                </motion.div>
              );
            })
          ) : (
            <div className="p-8 text-center text-slate-500 flex flex-col items-center gap-2 bg-slate-950/20">
              <AlertCircle size={28} className="text-slate-600" />
              <span>Tidak ada pertandingan sepak bola yang cocok dengan pencarian Anda.</span>
              <button 
                id="clear-search-btn"
                onClick={() => { setSearchTerm(""); setFilterType("all"); }} 
                className="text-cyan-400 text-xs underline mt-1"
              >
                Clear Pencarian & Filter
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
