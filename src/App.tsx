import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Match, Standing } from './types';
import YoutubeEmbed from './components/YoutubeEmbed';
import MatchList from './components/MatchList';
import MatchDetail from './components/MatchDetail';
import StandingsTable from './components/StandingsTable';
import BungBolaChat from './components/BungBolaChat';
import AppsScriptPortal from './components/AppsScriptPortal';
import InteractiveBall from './components/InteractiveBall';
import { Trophy, Compass, Star, FileCode, MessageSquareCode, CalendarDays, RefreshCw, Sparkles, Tv, HelpCircle, Heart } from 'lucide-react';

export default function App() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>("m4"); // Indonesia vs Belanda by default!
  const [activeTab, setActiveTab] = useState<'scores' | 'standings' | 'chat' | 'gas'>('scores');
  const [refreshSeconds, setRefreshSeconds] = useState(8);
  const [apiError, setApiError] = useState(false);

  // Fetch match results and standings on startup
  const fetchAllData = async () => {
    try {
      const matchRes = await fetch("/api/matches");
      if (!matchRes.ok) throw new Error();
      const matchData = await matchRes.json();
      setMatches(matchData.matches || []);

      const standRes = await fetch("/api/standings");
      if (!standRes.ok) throw new Error();
      const standData = await standRes.json();
      setStandings(standData.standings || []);

      setApiError(false);
    } catch {
      setApiError(true);
    }
  };

  // Trigger setup on load
  useEffect(() => {
    fetchAllData();
  }, []);

  // Background ticker loop that requests data updates cleanly
  // If games are live, we decrement refresh clock. At 0, we refetch API scores.
  useEffect(() => {
    const interval = setInterval(() => {
      // Check if some matches are live 
      const someLive = matches.some(m => m.isLive);
      
      setRefreshSeconds(prev => {
        if (prev <= 1) {
          // Time to trigger live scores tick from the backend
          fetchAllData();
          return 8; // reset countdown size
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [matches]);

  // Handle post reset of simulated scores
  const handleResetSimulation = async () => {
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
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 1 }}
              className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-400 via-pink-500 to-yellow-400 p-[2px] shadow-lg flex items-center justify-center cursor-pointer select-none"
            >
              <div className="w-full h-full rounded-lg bg-[#020617] flex items-center justify-center text-xl font-black italic text-cyan-400">
                26
              </div>
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
          <nav className="flex gap-2 p-1 bg-black/40 rounded-xl border border-white/10">
            
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

            {/* Google Apps Script Integration Tab */}
            <button
              id="navigation-tab-gas"
              onClick={() => setActiveTab('gas')}
              className={`px-4 sm:px-6 py-2.5 rounded-lg text-xs sm:text-sm font-display font-black flex items-center gap-2 transition-all focus:outline-none relative ${
                activeTab === 'gas' 
                  ? 'bg-white/5 border border-cyan-400/40 text-cyan-400 shadow-lg font-extrabold cyan-glow' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileCode size={15} />
              <span>Code.GS Apps Script</span>
            </button>

          </nav>
        </div>

        {/* MAIN TAB SWITCH VIEWPORT AREA */}
        <div className="w-full relative min-h-[420px]">
          
          {apiError && (
            <div className="bg-red-950/20 border border-red-900/40 p-4 rounded-xl text-xs text-red-400 flex items-center gap-2 mb-4 select-none">
              <span>⚠️ Terjadi masalah konektivitas server. Skor berjalan lokal pada simulator cadangan piala dunia.</span>
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
                  <MatchDetail match={selectedMatch} />
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

            {/* TAB 4: Code.GS Apps Script Copycenter Portal */}
            {activeTab === 'gas' && (
              <motion.div
                key="gas-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="w-full mt-2"
              >
                <AppsScriptPortal />
              </motion.div>
            )}

          </AnimatePresence>

        </div>

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

    </div>
  );
}
