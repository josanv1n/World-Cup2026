import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Match, Standing } from './types';
import { initialMatches, initialStandings, teamScorersFallback } from './mockData';
import YoutubeEmbed from './components/YoutubeEmbed';
import MatchList from './components/MatchList';
import MatchDetail from './components/MatchDetail';
import StandingsTable from './components/StandingsTable';
import BungBolaChat from './components/BungBolaChat';
import { AIBracketView } from './components/AIBracketView';
import InteractiveBall from './components/InteractiveBall';
import { Trophy, Compass, Star, FileCode, MessageSquareCode, CalendarDays, RefreshCw, Sparkles, Tv, HelpCircle, Heart, MessageSquare } from 'lucide-react';

export default function App() {
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [standings, setStandings] = useState<Standing[]>(initialStandings);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>("m1"); // Meksiko vs Afrika Selatan by default!
  const [activeTab, setActiveTab] = useState<'scores' | 'standings' | 'chat' | 'bracket'>('scores');
  const [refreshSeconds, setRefreshSeconds] = useState(8);
  const [apiError, setApiError] = useState(false);
  const [isFlashscoreDown, setIsFlashscoreDown] = useState(false);
  const [showApiWarning, setShowApiWarning] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

  // Fetch match results and standings on startup
  const fetchAllData = async () => {
    try {
      let fsDown = false;
      const matchRes = await fetch("/api/matches");
      if (!matchRes.ok) throw new Error();
      const matchData = await matchRes.json();
      if (matchData.matches && matchData.matches.length > 0) {
        setMatches(matchData.matches);
      }
      if (matchData.isFlashscoreDown) {
        fsDown = true;
      }

      const standRes = await fetch("/api/standings");
      if (!standRes.ok) throw new Error();
      const standData = await standRes.json();
      if (standData.standings && standData.standings.length > 0) {
        setStandings(standData.standings);
      }
      if (standData.isFlashscoreDown) {
        fsDown = true;
      }

      setIsFlashscoreDown(fsDown);
      setApiError(false);
    } catch {
      setApiError(true);
      setIsFlashscoreDown(true);
    }
  };

  // Helper to update standings live in local simulation
  const updateStandingsLocalLive = (homeTeam: string, awayTeam: string, homeGDelta: number, awayGDelta: number) => {
    setStandings(prev => prev.map(group => {
      const hasTeam = group.teams.some(t => t.teamName === homeTeam || t.teamName === awayTeam);
      if (!hasTeam) return group;

      const teamsUpdated = group.teams.map(team => {
        if (team.teamName === homeTeam) {
          return {
            ...team,
            gf: team.gf + homeGDelta,
            ga: team.ga + awayGDelta,
            gd: (team.gf + homeGDelta) - (team.ga + awayGDelta)
          };
        }
        if (team.teamName === awayTeam) {
          return {
            ...team,
            gf: team.gf + awayGDelta,
            ga: team.ga + homeGDelta,
            gd: (team.gf + awayGDelta) - (team.ga + homeGDelta)
          };
        }
        return team;
      });

      teamsUpdated.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
      return { ...group, teams: teamsUpdated.map((t, idx) => ({ ...t, rank: idx + 1 })) };
    }));
  };

  // Helper to finalize standings points in local simulation
  const finalizeStandingsLocal = (homeTeam: string, awayTeam: string, homeScore: number, awayScore: number) => {
    setStandings(prev => prev.map(group => {
      const hasTeam = group.teams.some(t => t.teamName === homeTeam || t.teamName === awayTeam);
      if (!hasTeam) return group;

      const teamsUpdated = group.teams.map(team => {
        if (team.teamName === homeTeam) {
          const isWin = homeScore > awayScore;
          const isDraw = homeScore === awayScore;
          return {
            ...team,
            played: team.played + 1,
            won: team.won + (isWin ? 1 : 0),
            drawn: team.drawn + (isDraw ? 1 : 0),
            lost: team.lost + (!isWin && !isDraw ? 1 : 0),
            pts: team.pts + (isWin ? 3 : isDraw ? 1 : 0)
          };
        }
        if (team.teamName === awayTeam) {
          const isWin = awayScore > homeScore;
          const isDraw = homeScore === awayScore;
          return {
            ...team,
            played: team.played + 1,
            won: team.won + (isWin ? 1 : 0),
            drawn: team.drawn + (isDraw ? 1 : 0),
            lost: team.lost + (!isWin && !isDraw ? 1 : 0),
            pts: team.pts + (isWin ? 3 : isDraw ? 1 : 0)
          };
        }
        return team;
      });

      teamsUpdated.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
      return { ...group, teams: teamsUpdated.map((t, idx) => ({ ...t, rank: idx + 1 })) };
    }));
  };

  // Run a local simulation tick when server is disconnected/unreachable
  const simulateLocalMatchesTick = () => {
    setMatches(prevMatches => {
      let stateChanged = false;
      const nextMatches = prevMatches.map(match => {
        if (!match.isLive) return match;
        stateChanged = true;
        const nextMin = match.minute + 1;
        let nextStatus = `${nextMin}'`;
        let nextHomeScore = match.homeScore;
        let nextAwayScore = match.awayScore;
        const nextEvents = [...match.events];

        // Stats simulation
        const randStats = Math.sin(nextMin);
        const homePoss = Math.floor(50 + (randStats * 10));
        const nextPossession: [number, number] = [homePoss, 100 - homePoss];
        const nextShots: [number, number] = [
          (match.shots?.[0] || 0) + (Math.random() > 0.82 ? 1 : 0),
          (match.shots?.[1] || 0) + (Math.random() > 0.82 ? 1 : 0)
        ];
        const nextFouls: [number, number] = [
          (match.fouls?.[0] || 0) + (Math.random() > 0.90 ? 1 : 0),
          (match.fouls?.[1] || 0) + (Math.random() > 0.90 ? 1 : 0)
        ];
        const nextYCard = [...(match.yellowCards || [0, 0])] as [number, number];
        const nextRCard = [...(match.redCards || [0, 0])] as [number, number];

        // Goal scoring algorithm (~4% chance per tick)
        const rollScore = Math.random();
        if (rollScore < 0.02) {
          // Home Goal
          nextHomeScore += 1;
          const pool = teamScorersFallback[match.homeTeam] || ["Pemain Bintang"];
          const scorerName = pool[Math.floor(Math.random() * pool.length)];
          nextEvents.push({
            id: `le_${match.id}_${nextMin}_h`,
            minute: nextMin,
            type: "goal",
            team: "home",
            player: scorerName,
            detail: "Sepakan Keras"
          });
          updateStandingsLocalLive(match.homeTeam, match.awayTeam, 1, 0);
        } else if (rollScore < 0.04) {
          // Away Goal
          nextAwayScore += 1;
          const pool = teamScorersFallback[match.awayTeam] || ["Pemain Bintang"];
          const scorerName = pool[Math.floor(Math.random() * pool.length)];
          nextEvents.push({
            id: `le_${match.id}_${nextMin}_a`,
            minute: nextMin,
            type: "goal",
            team: "away",
            player: scorerName,
            detail: "Sontekan Manis"
          });
          updateStandingsLocalLive(match.homeTeam, match.awayTeam, 0, 1);
        }

        // Yellow Card Simulation (~1.5% chance)
        if (Math.random() < 0.015) {
          const isHome = Math.random() > 0.5;
          if (isHome) nextYCard[0] += 1;
          else nextYCard[1] += 1;
          const teamLabel = isHome ? "home" : "away";
          const teamName = isHome ? match.homeTeam : match.awayTeam;
          const pool = teamScorersFallback[teamName] || ["Bek Tangguh"];
          const playerName = pool[Math.floor(Math.random() * pool.length)];
          nextEvents.push({
            id: `le_${match.id}_${nextMin}_y`,
            minute: nextMin,
            type: "yellow_card",
            team: teamLabel,
            player: playerName,
            detail: "Pelanggaran taktikal"
          });
        }

        let isLiveResult = true;
        if (nextMin === 45) {
          nextStatus = "Babak Pertama Selesai";
        } else if (nextMin > 45 && nextMin < 48) {
          nextStatus = "Jeda Babak (Half Time)";
        } else if (nextMin === 48) {
          nextStatus = "46'";
        } else if (nextMin >= 90) {
          nextStatus = "Selesai";
          isLiveResult = false;
          finalizeStandingsLocal(match.homeTeam, match.awayTeam, nextHomeScore, nextAwayScore);
        }

        return {
          ...match,
          minute: nextMin > 90 ? 90 : nextMin,
          status: nextStatus,
          homeScore: nextHomeScore,
          awayScore: nextAwayScore,
          possession: nextPossession,
          shots: nextShots,
          fouls: nextFouls,
          yellowCards: nextYCard,
          redCards: nextRCard,
          events: nextEvents.sort((a, b) => b.minute - a.minute),
          isLive: isLiveResult
        };
      });
      return nextMatches;
    });
  };

  // Trigger setup on load
  useEffect(() => {
    fetchAllData();
  }, []);

  // Background ticker loop that requests data updates cleanly
  // If games are live, we decrement refresh clock. At 0, we refetch API scores.
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshSeconds(prev => {
        if (prev <= 1) {
          if (apiError) {
            // Run simple client-side local simulator if API endpoints are offline!
            simulateLocalMatchesTick();
          } else {
            // Time to trigger live scores tick from the backend
            fetchAllData();
          }
          return 8; // reset countdown size
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [matches, apiError]);

  // Handle post reset of simulated scores
  const handleResetSimulation = async () => {
    if (apiError) {
      // Local recovery reset
      setMatches(initialMatches);
      setStandings(initialStandings);
      setRefreshSeconds(8);
      return;
    }
    try {
      const response = await fetch("/api/matches/reset", { method: "POST" });
      if (response.ok) {
        const data = await response.json();
        setMatches(data.matches || []);
        setRefreshSeconds(8);
        // Refresh standings as well
        const standRes = await fetch("/api/standings");
        if (standRes.ok) {
          const standData = await standRes.json();
          setStandings(standData.standings || []);
        }
      }
    } catch {
      alert("Gagal melakukan reset simulasi.");
    }
  };

  // Find currently selected match object
  const selectedMatch = matches.find(m => m.id === selectedMatchId) || null;

  return (
    <div id="piala-dunia-applet" className="min-h-screen bg-[#020617] text-slate-100 pitch-bg pb-24 relative overflow-x-hidden">
      
      {/* Immersive Stadium Ambient Spotlights with High Density colors */}
      <div className="absolute top-0 left-1/4 w-[35vw] h-[35vw] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[30vw] h-[30vw] bg-pink-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Dynamic Slide Marquee ticker styled like FIFA High Density header */}
      <div className="w-full bg-[#001233] py-2.5 border-b border-white/10 overflow-hidden relative z-50 shadow-md">
        <div className="flex animate-marquee whitespace-nowrap gap-12 text-xs font-mono tracking-tight text-slate-100 items-center">
          <span className="flex items-center gap-1.5 text-cyan-400 font-black italic tracking-wider">
            <Trophy size={13} className="text-cyan-400 animate-pulse" />
            <span>FIFA MULTI-STREAM FEED :</span>
          </span>
          {matches.map(m => (
            <span key={m.id} className="inline-flex items-center gap-2 hover:text-cyan-400 cursor-pointer transition-colors" onClick={() => { setSelectedMatchId(m.id); setActiveTab('scores'); }}>
              <span className="text-slate-400 font-sans">{m.homeFlag} {m.homeTeam}</span>
              <span className="font-black text-cyan-400 bg-white/5 px-1.5 py-0.5 rounded font-mono">{m.status === "Belum Mulai" ? "VS" : `${m.homeScore} - ${m.awayScore}`}</span>
              <span className="text-slate-400 font-sans">{m.awayTeam} {m.awayFlag}</span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-mono font-bold ${
                m.isLive ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-800 text-slate-400'
              }`}>
                {m.status}
              </span>
            </span>
          ))}
          {/* Duplicate marquee list to loop nicely */}
          <span className="text-white/20 font-bold hidden md:inline">|</span>
          {matches.map(m => (
            <span key={`dup-${m.id}`} className="inline-flex items-center gap-2 hover:text-cyan-400 cursor-pointer transition-colors" onClick={() => { setSelectedMatchId(m.id); setActiveTab('scores'); }}>
              <span className="text-slate-400 font-sans">{m.homeFlag} {m.homeTeam}</span>
              <span className="font-black text-cyan-400 bg-white/5 px-1.5 py-0.5 rounded font-mono">{m.status === "Belum Mulai" ? "VS" : `${m.homeScore} - ${m.awayScore}`}</span>
              <span className="text-slate-400 font-sans">{m.awayTeam} {m.awayFlag}</span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-mono font-bold ${
                m.isLive ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-800 text-slate-400'
              }`}>
                {m.status}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Main Layout Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 flex flex-col gap-6">
        
        {/* Animated Main Header Banner */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-[#001233] border border-white/10 shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 bottom-0 left-0 w-2 bg-gradient-to-b from-cyan-400 via-pink-500 to-yellow-400 pointer-events-none" />

          <div className="flex items-center gap-4 relative z-10">
            {/* High Density custom badge frame logo */}
            <motion.div
              whileHover={{ scale: 1.08 }}
              className="w-20 h-20 flex items-center justify-center cursor-pointer select-none shrink-0"
            >
              <img 
                src="https://josanvin.github.io/josanvin/img/WorldCup2026.png" 
                alt="FIFA World Cup 2026 Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono tracking-widest bg-red-600/10 text-red-400 px-2.5 py-1 block rounded border border-red-500/20 uppercase font-black">
                  STREAM & DATA FEED ACTIVE
                </span>
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-black text-white tracking-tighter uppercase italic mt-1.5">
                FIFA World Cup <span className="text-cyan-400">2026</span> Live Ticker
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5 font-sans leading-tight">
                Pusat Skor Langsung, Jadwal Laga Terkini & Komparator AI Pintar Gemini Terintegrasi
              </p>
            </div>
          </div>

          {/* Quick sync stats badge */}
          <div className="flex flex-col items-center md:items-end font-mono text-xs text-slate-400 gap-1 select-none bg-black/40 p-3 rounded-xl border border-white/10">
            <span className="text-[10px] text-cyan-400 flex items-center gap-1.5 uppercase font-bold">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              SERVER SYNC ACTIVE
            </span>
            <span>MetLife • Estadio Azteca • BC Place</span>
            <span>Refresh: <span className="text-pink-400 font-bold">{refreshSeconds}s</span></span>
          </div>

        </header>

        {/* TOP COMPONENT: Official Youtube Introduction Video Embed inside custom Bezel */}
        <section id="official-fifa-intro-intro" className="w-full">
          <YoutubeEmbed url="https://www.youtube.com/watch?v=kq-5PD_1wwA" />
        </section>

        {/* TABULAR NAVIGATION BUTTONS WITH HIGH ACCENT ANIMATIONS */}
        <div className="flex justify-center border-b border-white/10 pb-px mt-3 select-none">
          <nav className="flex flex-wrap justify-center gap-2 p-1 bg-black/40 rounded-xl border border-white/10">
            
            {/* Skor Langsung Tab */}
            <button
              id="navigation-tab-scores"
              onClick={() => setActiveTab('scores')}
              className={`px-4 sm:px-6 py-2.5 rounded-lg text-xs sm:text-sm font-display font-black flex items-center gap-2 transition-all focus:outline-none relative ${
                activeTab === 'scores' 
                  ? 'bg-white/5 border border-cyan-400/40 text-cyan-400 shadow-lg font-extrabold cyan-glow' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Compass size={15} />
              <span>Skor Langsung (FIFA Live)</span>
              {matches.some(m => m.isLive) && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
              )}
            </button>

            {/* Klasemen Grup Tab */}
            <button
              id="navigation-tab-standings"
              onClick={() => setActiveTab('standings')}
              className={`px-4 sm:px-6 py-2.5 rounded-lg text-xs sm:text-sm font-display font-black flex items-center gap-2 transition-all focus:outline-none relative ${
                activeTab === 'standings' 
                  ? 'bg-white/5 border border-cyan-400/40 text-cyan-400 shadow-lg font-extrabold cyan-glow' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Trophy size={15} />
              <span>Klasemen Grup</span>
            </button>

            {/* Bagan Fase Gugur */}
            <button
              id="navigation-tab-bracket"
              onClick={() => setActiveTab('bracket')}
              className={`px-4 sm:px-6 py-2.5 rounded-lg text-xs sm:text-sm font-display font-black flex items-center gap-2 transition-all focus:outline-none relative ${
                activeTab === 'bracket' 
                  ? 'bg-white/5 border border-cyan-400/40 text-cyan-400 shadow-lg font-extrabold cyan-glow' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles size={15} className="text-cyan-400" />
              <span>Bagan Fase Gugur (Knockout)</span>
            </button>

            {/* Tanya AI Commentator Tab */}
            <button
              id="navigation-tab-chat"
              onClick={() => setActiveTab('chat')}
              className={`px-4 sm:px-6 py-2.5 rounded-lg text-xs sm:text-sm font-display font-black flex items-center gap-2 transition-all focus:outline-none relative ${
                activeTab === 'chat' 
                  ? 'bg-white/5 border border-cyan-400/40 text-cyan-400 shadow-lg font-extrabold cyan-glow' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <MessageSquareCode size={15} />
              <span>Tanya AI Bung Bola</span>
            </button>

          </nav>
        </div>

        {/* MAIN TAB SWITCH VIEWPORT AREA */}
        <div className="w-full relative min-h-[420px]">
          
          {(apiError || isFlashscoreDown) && showApiWarning && (
            <div className="bg-red-950/40 border border-red-500/30 p-4 rounded-xl text-xs text-red-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4 select-none relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
              <span className="flex items-start md:items-center gap-2 pl-2">
                <span className="text-sm shrink-0">⚠️</span>
                <span>
                  {isFlashscoreDown && !apiError ? (
                    <>
                      <strong>Website Acuan (Flashscore) sedang down atau mengalami masalah konektivitas:</strong> Sistem beralih secara otomatis ke <strong>Simulator Ticker Lokal</strong>. Skor langsung dan statistik pertandingan tetap berjalan dinamis!
                    </>
                  ) : (
                    <>
                      <strong>Website Acuan (Flashscore) offline atau Server Latar Belakang Nonaktif (Normal di Vercel):</strong> Aplikasi dialihkan dengan aman ke <strong>Simulator Ticker Lokal</strong>. Skor langsung, statistik pertandingan, dan kejadian drama gol tetap berjalan dinamis di browser Anda secara independen!
                    </>
                  )}
                </span>
              </span>
              <button 
                onClick={() => setShowApiWarning(false)} 
                className="text-red-400 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded transition-all font-bold text-[10px] shrink-0 self-end md:self-auto uppercase tracking-wider"
              >
                Sembunyikan
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            
            {/* TAB 1: Real-time Live Scores Viewport (Classic 2-Column layout) */}
            {activeTab === 'scores' && (
              <motion.div
                key="scores-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start mt-2"
              >
                {/* Match Lists component (Left) */}
                <div className="lg:col-span-7 w-full">
                  <MatchList 
                    matches={matches} 
                    selectedMatchId={selectedMatchId}
                    onSelectMatch={setSelectedMatchId}
                    onResetSimulation={handleResetSimulation}
                    refreshSeconds={refreshSeconds}
                  />
                </div>

                {/* Match Profiles component stats (Right) */}
                <div className="lg:col-span-5 w-full">
                  <MatchDetail 
                    match={selectedMatch} 
                    onUpdateMatch={(updatedMatch) => {
                      setMatches(prev => prev.map(m => m.id === updatedMatch.id ? updatedMatch : m));
                    }}
                  />
                </div>
              </motion.div>
            )}

            {/* TAB 2: Dynamic standings Table */}
            {activeTab === 'standings' && (
              <motion.div
                key="standings-tab"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="w-full mt-2"
              >
                <StandingsTable standings={standings} />
              </motion.div>
            )}

            {/* TAB 3: Interactive Commentator Conversational Room */}
            {activeTab === 'chat' && (
              <motion.div
                key="chat-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="w-full mt-2"
              >
                <BungBolaChat currentMatch={selectedMatch} />
              </motion.div>
            )}

            {/* TAB 4: Bagan AI & Fase Gugur */}
            {activeTab === 'bracket' && (
              <motion.div
                key="bracket-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="w-full mt-2"
              >
                <AIBracketView 
                  matches={matches} 
                  onReset={handleResetSimulation} 
                  onUpdateMatches={(updatedMatches) => {
                    setMatches(updatedMatches);
                    // Refresh all tables and standings concurrently
                    fetchAllData();
                  }}
                />
              </motion.div>
            )}

          </AnimatePresence>

        </div>

        {/* DONASI SEKSI - JOHAN */}
        <section id="donasi-johan-container" className="w-full mt-10">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#001233] via-[#0b1b3d] to-[#001233] border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-cyan-400/10 rounded-full blur-[40px] pointer-events-none" />
            <div className="absolute -left-10 -top-10 w-40 h-40 bg-pink-500/10 rounded-full blur-[40px] pointer-events-none" />
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <span className="text-xs font-mono tracking-widest bg-yellow-500/20 text-yellow-400 px-2.5 py-0.5 rounded-full border border-yellow-500/30 uppercase font-black animate-pulse flex items-center gap-1">
                    <Sparkles size={11} /> Support Developer
                  </span>
                  <span className="text-xs font-mono tracking-widest bg-cyan-400/20 text-cyan-400 px-2.5 py-0.5 rounded-full border border-cyan-400/30 uppercase font-black">
                    Anti Lag-Lag Club
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-black text-white italic uppercase tracking-tight">
                  Sokong Server Biar Tetep <span className="text-pink-400">Gaspol!</span> 🚀
                </h3>
                <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
                  Halo bro-sist! Biar info skor tercepat, live standing, dan si kecerdasan buatan <span className="text-cyan-400 font-bold">Bung Bola AI</span> ini kagak ngadat gara-gara server kepenuhan, yuk sawer tipis-tipis seikhlasnya buat admin kesayangan kita, bang <strong className="hover:text-cyan-400 transition-colors uppercase tracking-wider font-extrabold text-yellow-300">JOHAN</strong>! Biar doi punya amunisi kopi hitam & gorengan buat begadang nemenin lo nonton laga seru! ☕⚽🔥
                </p>
              </div>

              {/* Donation Method Widget */}
              <div className="flex flex-col items-center bg-black/40 p-5 rounded-2xl border border-white/5 w-full md:w-auto md:min-w-[320px] shrink-0">
                <span className="text-xs font-mono font-bold text-slate-400 mb-3 uppercase tracking-wider">
                  Silahkan Di-Sawer Lewat:
                </span>
                
                {/* Brand Logos Grid with high fidelity */}
                <div className="grid grid-cols-2 gap-2 w-full mb-4">
                  <div className="flex items-center justify-center gap-1.5 bg-[#EE4D2D]/10 border border-[#EE4D2D]/30 py-2 px-3 rounded-lg text-[#EE4D2D] font-black text-xs select-none shadow hover:bg-[#EE4D2D]/20 transition-all cursor-default">
                    <span className="text-sm">🟠</span> ShopeePay
                  </div>
                  <div className="flex items-center justify-center gap-1.5 bg-[#00AED6]/10 border border-[#00AED6]/30 py-2 px-3 rounded-lg text-[#00AED6] font-black text-xs select-none shadow hover:bg-[#00AED6]/20 transition-all cursor-default">
                    <span className="text-sm">🟢</span> GoPay
                  </div>
                  <div className="flex items-center justify-center gap-1.5 bg-[#4D2A86]/10 border border-[#4D2A86]/30 py-2 px-3 rounded-lg text-[#bc99fa] font-black text-xs select-none shadow hover:bg-[#4D2A86]/20 transition-all cursor-default">
                    <span className="text-sm">🟣</span> OVO
                  </div>
                  <div className="flex items-center justify-center gap-1.5 bg-[#008AE6]/10 border border-[#008AE6]/30 py-2 px-3 rounded-lg text-[#008AE6] font-black text-xs select-none shadow hover:bg-[#008AE6]/20 transition-all cursor-default">
                    <span className="text-sm">🔵</span> DANA
                  </div>
                </div>

                {/* Copiable Phone number box */}
                <div className="w-full bg-[#111827] border border-white/10 rounded-xl p-3 flex flex-col items-center justify-center text-center relative group">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">
                    No. Telpon / Akun E-Wallet
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-base font-mono font-black text-green-400 tracking-wider">
                      0813-41-300-100
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText("0813-41-300-100");
                        setCopySuccess(true);
                        setTimeout(() => setCopySuccess(false), 2000);
                      }}
                      className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/10 transition-all focus:outline-none"
                      title="Salin Nomor"
                    >
                      {copySuccess ? (
                        <span className="text-xs text-green-400 font-bold px-1">Disalin!</span>
                      ) : (
                        <span className="text-[10px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-slate-300 hover:border-cyan-400 tracking-wide font-bold">Salin</span>
                      )}
                    </button>
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono mt-1">Nama Penerima: JOHAN</span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER METRIC BRAND */}
      <footer className="mt-20 border-t border-slate-850 py-8 text-center text-xs text-slate-500 font-sans select-none max-w-7xl mx-auto px-4">
        <div className="flex justify-center gap-6 mb-3 flex-wrap">
          <span className="flex items-center gap-1 font-mono text-[10px] text-slate-400">
            🏆 FIFA World Cup 2026 Hub
          </span>
          <span className="flex items-center gap-1 font-mono text-[10px] text-slate-400">
            ⭐ Designed with Space Grotesk
          </span>
          <span className="flex items-center gap-1 font-mono text-[10px] text-slate-400">
            🌍 Deployment: Vercel Ready
          </span>
        </div>
        <p className="max-w-md mx-auto text-slate-600">
          Aplikasi Papan Skor Langsung Piala Dunia 2026. Data didistribusi secara asinkronus ke server menggunakan API hemat memori pelat baja.
        </p>
        <p className="flex items-center justify-center gap-1 mt-4 text-cyan-400 font-display font-medium">
          Dibuat dengan <Heart size={12} className="fill-pink-500 text-pink-500 animate-pulse inline-block" /> untuk Pecinta Sepak Bola Indonesia!
        </p>
      </footer>

      {/* FLOAT ELEMENT: Real Bouncing/Kickable Soccer Ball on Screen Bottom Left */}
      <InteractiveBall />

      {/* FLOATING WHATSAPP CHAT WIDGET - SLANGY & INTERACTIVE */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group select-none"
      >
        {/* Animated Pop-Up / Chat bubble with gaul slang */}
        <motion.div
          animate={{
            y: [0, -4, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="hidden sm:flex bg-slate-950/95 backdrop-blur-md border border-white/10 text-white rounded-2xl py-2 px-3.5 shadow-2xl items-center gap-2 max-w-[220px] transition-all duration-300 group-hover:border-green-500/40 opacity-90 group-hover:opacity-100 relative"
        >
          {/* Green dot notification */}
          <div className="absolute right-2 top-2 w-2 h-2 bg-green-400 rounded-full animate-ping pointer-events-none" />
          
          <div className="text-left">
            <p className="text-[10px] font-mono font-bold text-green-400 uppercase tracking-widest leading-none mb-1">
              Bung Bola Live! 🟢
            </p>
            <p className="text-xs text-slate-200 font-sans font-medium leading-normal">
              Ada kendala? <span className="text-yellow-300 font-black">PC WA</span> Bang Johan, Gaskin! 🔥
            </p>
          </div>
          {/* Speech bubble pointer */}
          <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-slate-950" />
        </motion.div>

        {/* The Float Button Circle styled like Whatsapp */}
        <motion.a
          href="https://wa.me/6281341300100"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          animate={{
            y: [0, -6, 0],
            rotate: [0, 4, -4, 0],
          }}
          transition={{
            y: {
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
            },
            rotate: {
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#128C7E] via-[#25D366] to-[#4afb8c] text-white flex items-center justify-center shadow-[0_8px_30px_rgb(37,211,102,0.3)] hover:shadow-[0_8px_40px_rgb(37,211,102,0.55)] border border-white/20 relative cursor-pointer"
          title="Hubungi Johan via WhatsApp"
        >
          <MessageSquare size={26} className="fill-white/10 stroke-[2.25px]" />
          
          {/* Outer Ripple Ring */}
          <span className="absolute -inset-1 rounded-full border-2 border-green-500/30 animate-ping pointer-events-none" />
          
          {/* Mini Notification Badge */}
          <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-rose-500 text-[8px] font-black font-sans rounded-full flex items-center justify-center border border-white text-white shadow-sm leading-none animate-pulse">
            1
          </span>
        </motion.a>
      </motion.div>

    </div>
  );
}
