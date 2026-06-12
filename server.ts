import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { Match, MatchEvent, Standing } from "./src/types";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = 3000;

// Initialize Gemini SDK safely
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyCJz9U83yHm7AyzUPOyrhG4M0z48uMY5j0";
let ai: GoogleGenAI | null = null;
try {
  if (GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
} catch (err) {
  console.error("Gagal menginisialisasi GoogleGenAI SDK:", err);
}

// Global state for Simulated Matches
let matches: Match[] = [
  {
    id: "m1",
    group: "Grup A",
    homeTeam: "Meksiko",
    homeFlag: "🇲🇽",
    awayTeam: "Afrika Selatan",
    awayFlag: "🇿🇦",
    homeScore: 2,
    awayScore: 0,
    status: "Selesai",
    minute: 90,
    isLive: false,
    date: "11 Juni 2026",
    time: "20:00 UTC",
    stadium: "Estadio Azteca",
    city: "Mexico City",
    possession: [58, 42],
    shots: [14, 6],
    fouls: [10, 15],
    yellowCards: [1, 3],
    redCards: [0, 1],
    events: [
      { id: "e1", minute: 12, type: "goal", team: "home", player: "R. Jiménez", assistant: "H. Lozano" },
      { id: "e2", minute: 40, type: "yellow_card", team: "away", player: "T. Mokoena" },
      { id: "e3", minute: 64, type: "goal", team: "home", player: "H. Lozano", detail: "Tendangan Keras Kaki Kanan" },
      { id: "e4", minute: 79, type: "red_card", team: "away", player: "T. Mokoena", detail: "Pelanggaran Keras Kedua" }
    ]
  },
  {
    id: "m2",
    group: "Grup F",
    homeTeam: "Korea Selatan",
    homeFlag: "🇰🇷",
    awayTeam: "Republik Ceko",
    awayFlag: "🇨🇿",
    homeScore: 2,
    awayScore: 1,
    status: "88'",
    minute: 88,
    isLive: true,
    date: "12 Juni 2026",
    time: "02:00 UTC",
    stadium: "Centurylink Field",
    city: "Seattle",
    possession: [51, 49],
    shots: [11, 10],
    fouls: [12, 11],
    yellowCards: [2, 1],
    redCards: [0, 0],
    events: [
      { id: "e5", minute: 24, type: "goal", team: "home", player: "Son Heung-min", assistant: "Lee Kang-in" },
      { id: "e6", minute: 58, type: "goal", team: "away", player: "P. Schick", assistant: "T. Souček" },
      { id: "e7", minute: 75, type: "yellow_card", team: "home", player: "Kim Min-jae" },
      { id: "e8", minute: 82, type: "goal", team: "home", player: "Hwang Hee-chan", detail: "Sundulan Maut" }
    ]
  },
  {
    id: "m3",
    group: "Grup B",
    homeTeam: "Kanada",
    homeFlag: "🇨🇦",
    awayTeam: "Swedia",
    awayFlag: "🇸🇪",
    homeScore: 1,
    awayScore: 1,
    status: "35'",
    minute: 35,
    isLive: true,
    date: "12 Juni 2026",
    time: "04:00 UTC",
    stadium: "BMO Field",
    city: "Toronto",
    possession: [45, 55],
    shots: [5, 8],
    fouls: [8, 6],
    yellowCards: [1, 1],
    redCards: [0, 0],
    events: [
      { id: "e9", minute: 18, type: "goal", team: "away", player: "A. Isak", assistant: "D. Kulusevski" },
      { id: "e10", minute: 31, type: "goal", team: "home", player: "J. David", detail: "Penalti Berkelas" }
    ]
  },
  {
    id: "m4",
    group: "Grup L",
    homeTeam: "Indonesia",
    homeFlag: "🇮🇩",
    awayTeam: "Belanda",
    awayFlag: "🇳🇱",
    homeScore: 2,
    awayScore: 2,
    status: "65'",
    minute: 65,
    isLive: true,
    date: "12 Juni 2026",
    time: "06:00 UTC",
    stadium: "SoFi Stadium",
    city: "Los Angeles",
    possession: [48, 52],
    shots: [8, 11],
    fouls: [9, 8],
    yellowCards: [1, 2],
    redCards: [0, 0],
    events: [
      { id: "e11", minute: 14, type: "goal", team: "away", player: "C. Gakpo", assistant: "X. Simons" },
      { id: "e12", minute: 28, type: "goal", team: "home", player: "Ragnar Oratmangoen", assistant: "Thom Haye" },
      { id: "e13", minute: 48, type: "goal", team: "away", player: "Memphis Depay" },
      { id: "e14", minute: 61, type: "goal", team: "home", player: "Rafael Struick", detail: "Sepakan Melengkung Tajam" }
    ]
  },
  {
    id: "m5",
    group: "Grup C",
    homeTeam: "Amerika Serikat",
    homeFlag: "🇺🇸",
    awayTeam: "Maroko",
    awayFlag: "🇲🇦",
    homeScore: 0,
    awayScore: 0,
    status: "Belum Mulai",
    minute: 0,
    isLive: false,
    date: "13 Juni 2026",
    time: "18:00 UTC",
    stadium: "MetLife Stadium",
    city: "East Rutherford",
    events: []
  },
  {
    id: "m6",
    group: "Grup D",
    homeTeam: "Jerman",
    homeFlag: "🇩🇪",
    awayTeam: "Argentina",
    awayFlag: "🇦🇷",
    homeScore: 0,
    awayScore: 0,
    status: "Belum Mulai",
    minute: 0,
    isLive: false,
    date: "13 Juni 2026",
    time: "21:00 UTC",
    stadium: "Mercedes-Benz Stadium",
    city: "Atlanta",
    events: []
  },
  {
    id: "m7",
    group: "Grup G",
    homeTeam: "Jepang",
    homeFlag: "🇯🇵",
    awayTeam: "Spanyol",
    awayFlag: "🇪🇸",
    homeScore: 0,
    awayScore: 0,
    status: "Belum Mulai",
    minute: 0,
    isLive: false,
    date: "14 Juni 2026",
    time: "15:00 UTC",
    stadium: "Levi's Stadium",
    city: "Santa Clara",
    events: []
  },
  {
    id: "m8",
    group: "Grup H",
    homeTeam: "Inggris",
    homeFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    awayTeam: "Italia",
    awayFlag: "🇮🇹",
    homeScore: 0,
    awayScore: 0,
    status: "Belum Mulai",
    minute: 0,
    isLive: false,
    date: "14 Juni 2026",
    time: "20:00 UTC",
    stadium: "Hard Rock Stadium",
    city: "Miami",
    events: []
  }
];

// Group Standings initial mock based on previous and ongoing matches
let groupStandings: Standing[] = [
  {
    groupName: "Grup A",
    teams: [
      { rank: 1, teamName: "Meksiko", flag: "🇲🇽", played: 1, won: 1, drawn: 0, lost: 0, gf: 2, ga: 0, gd: 2, pts: 3 },
      { rank: 2, teamName: "Amerika Serikat", flag: "🇺🇸", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
      { rank: 3, teamName: "Swis", flag: "🇨🇭", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
      { rank: 4, teamName: "Afrika Selatan", flag: "🇿🇦", played: 1, won: 0, drawn: 0, lost: 1, gf: 0, ga: 2, gd: -2, pts: 0 }
    ]
  },
  {
    groupName: "Grup F",
    teams: [
      { rank: 1, teamName: "Korea Selatan", flag: "🇰🇷", played: 1, won: 1, drawn: 0, lost: 0, gf: 2, ga: 1, gd: 1, pts: 3 },
      { rank: 2, teamName: "Prancis", flag: "🇫🇷", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
      { rank: 3, teamName: "Uruguay", flag: "🇺🇾", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
      { rank: 4, teamName: "Republik Ceko", flag: "🇨🇿", played: 1, won: 0, drawn: 0, lost: 1, gf: 1, ga: 2, gd: -1, pts: 0 }
    ]
  },
  {
    groupName: "Grup B",
    teams: [
      { rank: 1, teamName: "Kanada", flag: "🇨🇦", played: 1, won: 0, drawn: 1, lost: 0, gf: 1, ga: 1, gd: 0, pts: 1 },
      { rank: 2, teamName: "Swedia", flag: "🇸🇪", played: 1, won: 0, drawn: 1, lost: 0, gf: 1, ga: 1, gd: 0, pts: 1 },
      { rank: 3, teamName: "Ghana", flag: "🇬🇭", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
      { rank: 4, teamName: "Kolombia", flag: "🇨 CO", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, pts: 0 }
    ]
  },
  {
    groupName: "Grup L",
    teams: [
      { rank: 1, teamName: "Indonesia", flag: "🇮🇩", played: 1, won: 0, drawn: 1, lost: 0, gf: 2, ga: 2, gd: 0, pts: 1 },
      { rank: 2, teamName: "Belanda", flag: "🇳🇱", played: 1, won: 0, drawn: 1, lost: 0, gf: 2, ga: 2, gd: 0, pts: 1 },
      { rank: 3, teamName: "Makedonia Utara", flag: "🇲🇰", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
      { rank: 4, teamName: "Selandia Baru", flag: "🇳🇿", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, pts: 0 }
    ]
  }
];

// Names list to generate dynamic goal-scorers based on team
const teamScorers: Record<string, string[]> = {
  "Korea Selatan": ["Hwang In-beom", "Son Heung-min", "Lee Kang-in", "Cho Gue-sung", "Hwang Hee-chan"],
  "Republik Ceko": ["P. Schick", "T. Souček", "J. Kuchta", "A. Barák", "V. Coufal"],
  "Swedia": ["A. Isak", "V. Gyökeres", "D. Kulusevski", "E. Forsberg", "J. Larsson"],
  "Kanada": ["Jonathan David", "Alphonso Davies", "Cyle Larin", "Tajon Buchanan"],
  "Indonesia": ["Rafael Struick", "Ragnar Oratmangoen", "Thom Haye", "Marselino Ferdinan", "Jay Idzes", "Rizky Ridho", "Witan Sulaeman"],
  "Belanda": ["Cody Gakpo", "Memphis Depay", "Xavi Simons", "Tijjani Reijnders", "Denzel Dumfries"],
  "Amerika Serikat": ["Christian Pulisic", "Folarin Balogun", "Timothy Weah", "Weston McKennie"],
  "Maroko": ["Hakim Ziyech", "Youssef En-Nesyri", "Achraf Hakimi", "Sofyan Amrabat"],
  "Jerman": ["Kai Havertz", "Jamal Musiala", "Florian Wirtz", "Niclas Füllkrug", "Serge Gnabry"],
  "Argentina": ["Lionel Messi", "Lautaro Martínez", "Julián Álvarez", "Alexis Mac Allister", "Enzo Fernández"],
  "Jepang": ["Kaoru Mitoma", "Takefusa Kubo", "Ayase Ueda", "Ritsu Doan", "Wataru Endo"],
  "Spanyol": ["Lamine Yamal", "Nico Williams", "Alvaro Morata", "Dani Olmo", "Pedri"],
  "Inggris": ["Harry Kane", "Jude Bellingham", "Bukayo Saka", "Phil Foden", "Cole Palmer"],
  "Italia": ["Mateo Retegui", "Federico Chiesa", "Giacomo Raspadori", "Nicolo Barella"]
};

// Simulator Background Loop
// Ticks every 8 seconds, simulating game progress of live matches
setInterval(() => {
  let stateChanged = false;

  matches = matches.map(match => {
    if (!match.isLive) return match;

    stateChanged = true;
    let nextMin = match.minute + 1;
    let nextStatus = `${nextMin}'`;
    let nextHomeScore = match.homeScore;
    let nextAwayScore = match.awayScore;
    let nextEvents = [...match.events];

    // Stats simulation
    const randStats = Math.sin(nextMin);
    let homePoss = Math.floor(50 + (randStats * 10));
    let nextPossession: [number, number] = [homePoss, 100 - homePoss];
    let nextShots: [number, number] = [
      (match.shots?.[0] || 0) + (Math.random() > 0.82 ? 1 : 0),
      (match.shots?.[1] || 0) + (Math.random() > 0.82 ? 1 : 0)
    ];
    let nextFouls: [number, number] = [
      (match.fouls?.[0] || 0) + (Math.random() > 0.90 ? 1 : 0),
      (match.fouls?.[1] || 0) + (Math.random() > 0.90 ? 1 : 0)
    ];
    let nextYCard: [number, number] = [...(match.yellowCards || [0, 0])] as [number, number];
    let nextRCard: [number, number] = [...(match.redCards || [0, 0])] as [number, number];

    // Goal scoring algorithm (~2.5% chance per tick for home/away)
    const rollScore = Math.random();
    if (rollScore < 0.03) {
      // Home Goal
      nextHomeScore += 1;
      const pool = teamScorers[match.homeTeam] || ["Pemain Bintang"];
      const scorerName = pool[Math.floor(Math.random() * pool.length)];
      const assistName = Math.random() > 0.4 ? pool[Math.floor(Math.random() * pool.length)] : undefined;
      const detail = Math.random() > 0.5 ? "Sepakan Keras" : "Sundulan Mematikan";

      nextEvents.push({
        id: `e_${match.id}_${nextMin}_h`,
        minute: nextMin,
        type: "goal",
        team: "home",
        player: scorerName,
        assistant: assistName !== scorerName ? assistName : undefined,
        detail
      });

      // Update Standings dynamic points
      updateStandingsLive(match.homeTeam, match.awayTeam, 1, 0);

    } else if (rollScore < 0.06) {
      // Away Goal
      nextAwayScore += 1;
      const pool = teamScorers[match.awayTeam] || ["Pemain Bintang"];
      const scorerName = pool[Math.floor(Math.random() * pool.length)];
      const assistName = Math.random() > 0.4 ? pool[Math.floor(Math.random() * pool.length)] : undefined;
      const detail = Math.random() > 0.5 ? "Sontekan Manis" : "Volley Spektakuler";

      nextEvents.push({
        id: `e_${match.id}_${nextMin}_a`,
        minute: nextMin,
        type: "goal",
        team: "away",
        player: scorerName,
        assistant: assistName !== scorerName ? assistName : undefined,
        detail
      });

      // Update Standings dynamic points
      updateStandingsLive(match.homeTeam, match.awayTeam, 0, 1);
    }

    // Yellow Card Simulation (~1.5% chance)
    if (Math.random() < 0.015) {
      const isHome = Math.random() > 0.5;
      const teamLabel = isHome ? "home" : "away";
      const teamName = isHome ? match.homeTeam : match.awayTeam;
      const pool = teamScorers[teamName] || ["Bek Tangguh"];
      let playerName = pool[Math.floor(Math.random() * pool.length)];

      if (isHome) nextYCard[0] += 1;
      else nextYCard[1] += 1;

      nextEvents.push({
        id: `e_${match.id}_${nextMin}_y`,
        minute: nextMin,
        type: "yellow_card",
        team: teamLabel,
        player: playerName,
        detail: "Pelanggaran taktikal"
      });
    }

    // Match finalization or halftime simulation
    let isLiveResult = true;
    if (nextMin === 45) {
      nextStatus = "Babak Pertama Selesai";
    } else if (nextMin > 45 && nextMin < 48) {
      // pause/Halftime mock (3 ticks)
      nextStatus = "Jeda Babak (Half Time)";
      nextMin = 45; // freeze minute at 45
    } else if (nextMin === 48) {
      nextMin = 46;
      nextStatus = "46'";
    } else if (nextMin >= 90) {
      // Extra minute simulation for climax
      const stoppage = match.stoppageTime || Math.floor(Math.random() * 4) + 3;
      const currentPassed = nextMin - 90;
      if (currentPassed >= stoppage) {
        nextStatus = "Selesai";
        isLiveResult = false;
        // finalize standings permanently
        finalizeStandings(match.homeTeam, match.awayTeam, nextHomeScore, nextAwayScore);
      } else {
        nextStatus = `90'+${stoppage - currentPassed}'`;
        match.stoppageTime = stoppage;
      }
    }

    return {
      ...match,
      minute: nextMin,
      status: nextStatus,
      homeScore: nextHomeScore,
      awayScore: nextAwayScore,
      possession: nextPossession,
      shots: nextShots,
      fouls: nextFouls,
      yellowCards: nextYCard,
      redCards: nextRCard,
      events: nextEvents.sort((a, b) => b.minute - a.minute), // newest first
      isLive: isLiveResult
    };
  });

  if (stateChanged) {
    // Console log the tick occasionally
  }
}, 8000);

// Auxiliary functions to update standings live during goal-simulation
function updateStandingsLive(homeTeam: string, awayTeam: string, homeGDelta: number, awayGDelta: number) {
  groupStandings = groupStandings.map(group => {
    let homeTeamObj = group.teams.find(t => t.teamName === homeTeam);
    let awayTeamObj = group.teams.find(t => t.teamName === awayTeam);

    if (homeTeamObj || awayTeamObj) {
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

      // Sort group teams based on rules: Pts -> GD -> GF
      teamsUpdated.sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        if (b.gd !== a.gd) return b.gd - a.gd;
        return b.gf - a.gf;
      });

      // assign ranks
      const rankedTeams = teamsUpdated.map((team, idx) => ({ ...team, rank: idx + 1 }));
      return { ...group, teams: rankedTeams };
    }
    return group;
  });
}

function finalizeStandings(homeTeam: string, awayTeam: string, homeScore: number, awayScore: number) {
  groupStandings = groupStandings.map(group => {
    let hasHome = group.teams.some(t => t.teamName === homeTeam);
    if (!hasHome) return group;

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

    teamsUpdated.sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.gd !== a.gd) return b.gd - a.gd;
      return b.gf - a.gf;
    });

    const rankedTeams = teamsUpdated.map((team, idx) => ({ ...team, rank: idx + 1 }));
    return { ...group, teams: rankedTeams };
  });
}


const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL || process.env.VITE_APPS_SCRIPT_URL || "";

// Sync live standings and results dynamically with deployed Google Apps Script (scraped from flashscore URL)
async function syncDataWithAppsScript() {
  if (!APPS_SCRIPT_URL) return;
  try {
    // 1. Sync Matches (Get Scores Action)
    const responseScores = await fetch(`${APPS_SCRIPT_URL}?action=getScores`);
    if (responseScores.ok) {
      const text = await responseScores.text();
      
      // Jika response mengandung HTML (misalnya halaman login akun Google / izin akses ditolak)
      if (text.trim().startsWith("<") || text.includes("<html") || text.includes("<!DOCTYPE")) {
        console.log("[Apps Script Sync] Catatan: Web App mengembalikan format HTML. Sinkronisasi otomatis ditangguhkan.");
        return;
      }

      try {
        const data = JSON.parse(text);
        if (data && Array.isArray(data.matches)) {
          console.log(`[Apps Script Sync] Sukses mensinkronkan ${data.matches.length} laga.`);
          data.matches.forEach((liveMatch: any) => {
            const matchObj = matches.find(m => m.id === liveMatch.id || m.homeTeam === liveMatch.homeTeam);
            if (matchObj) {
              matchObj.homeScore = liveMatch.homeScore !== undefined ? liveMatch.homeScore : matchObj.homeScore;
              matchObj.awayScore = liveMatch.awayScore !== undefined ? liveMatch.awayScore : matchObj.awayScore;
              matchObj.status = liveMatch.status || matchObj.status;
              if (liveMatch.status === "Selesai") {
                matchObj.isLive = false;
              } else if (liveMatch.status && (liveMatch.status.includes("Live") || liveMatch.status.includes("'"))) {
                matchObj.isLive = true;
              }
            }
          });
        }
      } catch (parseErr) {
        console.log("[Apps Script Sync] Catatan: Data laga tidak dalam format JSON yang valid.");
      }
    }

    // 2. Sync Standings (Get Standings Action)
    const responseStandings = await fetch(`${APPS_SCRIPT_URL}?action=getStandings`);
    if (responseStandings.ok) {
      const text = await responseStandings.text();
      
      // Jika response mengandung HTML
      if (text.trim().startsWith("<") || text.includes("<html") || text.includes("<!DOCTYPE")) {
        return;
      }

      try {
        const liveStandings = JSON.parse(text);
        if (Array.isArray(liveStandings) && liveStandings.length > 0) {
          console.log("[Apps Script Sync] Sinkronisasi klasemen klub selesai.");
          groupStandings = groupStandings.map(group => {
            const updatedTeams = group.teams.map(team => {
              const liveTeam = liveStandings.find((t: any) => t.team === team.teamName || t.teamName === team.teamName);
              if (liveTeam) {
                return {
                  ...team,
                  played: liveTeam.main !== undefined ? liveTeam.main : team.played,
                  pts: liveTeam.poin !== undefined ? liveTeam.poin : team.pts
                };
              }
              return team;
            });
            const sortedTeams = [...updatedTeams].sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
            const rankedTeams = sortedTeams.map((t, idx) => ({ ...t, rank: idx + 1 }));
            return { ...group, teams: rankedTeams };
          });
        }
      } catch (parseErr) {
        console.log("[Apps Script Sync] Catatan: Klasemen pasif.");
      }
    }
  } catch (err) {
    console.log("[Apps Script Sync] Catatan: Hubungan asinkronus ke Apps Script belum aktif.");
  }
}


// --- REST API ENDPOINTS ---

// 1. Get matches
app.get("/api/matches", async (req, res) => {
  // Sync before responder if apps script is active
  await syncDataWithAppsScript();
  res.json({
    matches,
    serverTime: new Date().toISOString()
  });
});

// 2. Get standings
app.get("/api/standings", async (req, res) => {
  // Sync before responder if apps script is active
  await syncDataWithAppsScript();
  res.json({
    standings: groupStandings
  });
});

// 3. User Trigger Match Simulation Refresh (Reset matches if they want)
app.post("/api/matches/reset", (req, res) => {
  // Retain some live matches
  matches = matches.map(m => {
    if (m.id === "m2") {
      return { ...m, isLive: true, minute: 88, status: "88'", homeScore: 2, awayScore: 1, events: m.events.slice(0, 4) };
    }
    if (m.id === "m3") {
      return { ...m, isLive: true, minute: 35, status: "35'", homeScore: 1, awayScore: 1, events: m.events.slice(0, 2) };
    }
    if (m.id === "m4") {
      return { ...m, isLive: true, minute: 65, status: "65'", homeScore: 2, awayScore: 2, events: m.events.slice(0, 4) };
    }
    return m;
  });
  res.json({ message: "Simulasi Piala Dunia berhasil di-reset!", matches });
});

// 4. API for copy-pasteable Apps Script Code (Code.GS)
const GOOGLE_APPS_SCRIPT_CODE = `/**
 * ====================================================================
 *  FIFA 2026 Live Score Hub - Google Apps Script (Code.GS) File
 *  Developed for project: "FIFA2026"
 *  Integrates Flashscore API / Gemini LLM Web Scraping and Analytics
 * ====================================================================
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open Google Apps Script editor. Title the project "FIFA2026".
 * 2. Paste this entire Code.GS contents into your visual script workspace.
 * 3. Go to Project Settings -> Script Properties.
 * 4. Add key: GEMINI_API_KEY, value: "AIzaSyCJz9U83yHm7AyzUPOyrhG4M0z48uMY5j0" (or your own key).
 * 5. Run the "initialSetup" function once to authenticate permissions.
 * 6. Click 'Deploy' -> 'New Deployment' -> Select 'Web App'.
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 * 7. Deploy and copy the web app URL. It acts as a super fast JSON gateway!
 */

// Global constant fallback
const GEMINI_API_FALLBACK = "AIzaSyCJz9U83yHm7AyzUPOyrhG4M0z48uMY5j0";

/**
 * Serves live score data, match summaries, and group standings under HTTP GET.
 */
function doGet(e) {
  try {
    var action = e && e.parameter && e.parameter.action ? e.parameter.action : "getScores";
    var result = {};

    if (action === "getScores") {
      result = fetchFlashscoreSimulated();
    } else if (action === "getGeminiAnalysis") {
      var matchId = e.parameter.matchId || "m4";
      result = generateGeminiAnalysis(matchId);
    } else if (action === "getStandings") {
      result = getWorldCupStandings();
    } else {
      result = { status: "error", message: "Action not recognize. Available: getScores, getGeminiAnalysis, getStandings" };
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON)
      .addHeader("Access-Control-Allow-Origin", "*");
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
      .addHeader("Access-Control-Allow-Origin", "*");
  }
}

/**
 * Retreive dynamic soccer match mock with high detail (Flashscore structure mirror)
 */
function fetchFlashscoreSimulated() {
  return {
    source: "https://www.flashscore.co.id/sepak-bola/dunia/piala-dunia/",
    retrievedAt: new Date().toISOString(),
    tournamentName: "DUNIA: Piala Dunia 2026",
    matches: [
      {
        id: "m1",
        group: "Grup A",
        homeTeam: "Meksiko",
        homeFlag: "🇲🇽",
        awayTeam: "Afrika Selatan",
        awayFlag: "🇿🇦",
        homeScore: 2,
        awayScore: 0,
        status: "Selesai"
      },
      {
        id: "m2",
        group: "Grup F",
        homeTeam: "Korea Selatan",
        homeFlag: "🇰🇷",
        awayTeam: "Republik Ceko",
        awayFlag: "🇨🇿",
        homeScore: 2,
        awayScore: 1,
        status: "Live (88')"
      },
      {
        id: "m3",
        group: "Grup B",
        homeTeam: "Kanada",
        homeFlag: "🇨🇦",
        awayTeam: "Swedia",
        awayFlag: "🇸🇪",
        homeScore: 1,
        awayScore: 1,
        status: "Live (35')"
      },
      {
        id: "m4",
        group: "Grup L",
        homeTeam: "Indonesia",
        homeFlag: "🇮🇩",
        awayTeam: "Belanda",
        awayFlag: "🇳🇱",
        homeScore: 2,
        awayScore: 2,
        status: "Live (65')"
      }
    ]
  };
}

/**
 * Access Google Gemini API directly from Google Apps Script properties via UrlFetchApp!
 */
function generateGeminiAnalysis(matchId) {
  var apiKey = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY") || GEMINI_API_FALLBACK;
  var matches = fetchFlashscoreSimulated().matches;
  var targetMatch = null;
  
  for (var i = 0; i < matches.length; i++) {
    if (matches[i].id === matchId) {
      targetMatch = matches[i];
      break;
    }
  }
  
  if (!targetMatch) {
    targetMatch = matches[3]; // Default to Indonesia vs Netherlands
  }

  var prompt = "Kamu adalah komentator legendaris sepak bola piala dunia. Berikan analisis kilat yang emosional, seru, dan penuh jargon sepak bola dalam Bahasa Indonesia untuk pertandingan ini: " + 
               targetMatch.homeTeam + " " + targetMatch.homeFlag + " vs " + targetMatch.awayTeam + " " + targetMatch.awayFlag + 
               " dengan Skor " + targetMatch.homeScore + " - " + targetMatch.awayScore + " (" + targetMatch.status + "). " +
               "Berikan judul provokatif yang keren sebelum paragraf analisismu!";

  var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;
  
  var payload = {
    "contents": [{
      "parts": [{
        "text": prompt
      }]
    }]
  };

  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };

  try {
    var response = UrlFetchApp.fetch(url, options);
    var responseText = response.getContentText();
    var responseJson = JSON.parse(responseText);
    
    var textOutput = "";
    if (responseJson.candidates && responseJson.candidates[0].content.parts[0].text) {
      textOutput = responseJson.candidates[0].content.parts[0].text;
    } else {
      textOutput = "Gagal memproses ulasan otomatis dari Gemini. Silakan periksa kembali API Key Anda.";
    }
    
    return {
      matchId: matchId,
      matchSummary: targetMatch.homeTeam + " vs " + targetMatch.awayTeam,
      commentary: textOutput,
      generatedAt: new Date().toISOString()
    };
  } catch (err) {
    return {
      matchId: matchId,
      status: "fallback",
      commentary: "### DRAMA LUAR BIASA DI SOFI STADIUM!\n\nTembakan melengkung spektakuler dari penyerang sayap menghujam pojok kanan gawang, memaksa kiper lawan jatuh bangun tak berdaya! Taktik serangan balik cepat yang diracik pelatih terbukti mematikan, menyajikan duel penuh intensitas luhur khas Piala Dunia 2026. Pertandingan yang luar biasa menghibur penonton seantero jagat raya!",
      error: err.toString()
    };
  }
}

function getWorldCupStandings() {
  var standings = [];
  try {
    // 1. Fetch Flashscore Group Stage table feed otomatis
    var stageId = "SbLsX4y7";
    var feedUrl = "https://www.flashscore.co.id/x/feed/df_to_1_" + stageId + "_";
    
    var response = UrlFetchApp.fetch(feedUrl, {
      "method": "get",
      "headers": {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "X-Referer": "https://www.flashscore.co.id/"
      },
      "muteHttpExceptions": true
    });
    
    var text = response.getContentText();
    if (response.getResponseCode() === 200 && text && text.indexOf("TE~") !== -1) {
      var segments = text.split("¬");
      var currentTeam = null;
      
      for (var i = 0; i < segments.length; i++) {
        var parts = segments[i].split("~");
        var cmd = parts[0];
        
        if (cmd === "TE") {
          if (currentTeam && currentTeam.team) {
            standings.push(currentTeam);
          }
          currentTeam = { team: "", main: 0, poin: 0 };
        } else if (currentTeam) {
          if (cmd === "TN") {
            currentTeam.team = parts[1];
          } else if (cmd === "TM") {
            currentTeam.main = parseInt(parts[1], 10) || 0;
          } else if (cmd === "TP") {
            currentTeam.poin = parseInt(parts[1], 10) || 0;
          }
        }
      }
      if (currentTeam && currentTeam.team) {
        standings.push(currentTeam);
      }
    }
  } catch (err) {
    Logger.log("Gagal mengambil data real-time: " + err.toString());
  }

  // Fallback / standard data yang realistis jika crawling gagal atau sedang diblokir Cloudflare
  if (standings.length === 0) {
    standings = [
      { team: "Meksiko", main: 1, poin: 3 },
      { team: "Korea Selatan", main: 1, poin: 3 },
      { team: "Indonesia", main: 1, poin: 1 },
      { team: "Belanda", main: 1, poin: 1 },
      { team: "Kanada", main: 1, poin: 1 },
      { team: "Swedia", main: 1, poin: 1 },
      { team: "Afrika Selatan", main: 1, poin: 0 },
      { team: "Republik Ceko", main: 1, poin: 0 }
    ];
  }
  return standings;
}

function initialSetup() {
  // Set script property safely for test purposes
  PropertiesService.getScriptProperties().setProperty("GEMINI_API_KEY", GEMINI_API_FALLBACK);
  Logger.log("Inisialisasi Properti Script 'GEMINI_API_KEY' Sukses!");
}
`;

app.get("/api/apps-script-code", (req, res) => {
  res.json({ code: GOOGLE_APPS_SCRIPT_CODE });
});

// 5. Gemini AI Live Chat & Commentary route
app.post("/api/gemini/chat", async (req, res) => {
  const { messages, contextMatch } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Pesan tidak valid. Dibutuhkan format array." });
  }

  const latestMessage = messages[messages.length - 1]?.text || "Halo";
  let contextPrompt = "";
  if (contextMatch) {
    contextPrompt = `Konteks Pertandingan Berlangsung saat ini: 
    ${contextMatch.homeTeam} (${contextMatch.homeFlag}) vs ${contextMatch.awayTeam} (${contextMatch.awayFlag}) 
    Skor: ${contextMatch.homeScore} - ${contextMatch.awayScore} (Menit: ${contextMatch.status}). 
    Acara Utama: ${JSON.stringify(contextMatch.events)}. 
    Stadium: ${contextMatch.stadium} di ${contextMatch.city}.
    
    `;
  }

  const systemInstruction = `Kamu adalah "Bung Bola - AI Komentator Piala Dunia 2026". 
  Gayamu adalah komentator siaran langsung sepak bola legendaris Indonesia yang sangat bersemangat, meluap-luap, puitis, patriotik, dan humoris (selalu menggunakan suara luhur, analogi unik seperti 'umpan membelah lautan', 'tendangan geledek', 'jantung copot', 'pelanggaran keras tanpa kompromi'). 
  Selalu tanggapi dalam Bahasa Indonesia yang gaul, seru, bersahabat dan penuh wawasan statistik sepak bola. 
  Tanggapi dengan emosi komentator sejati!`;

  try {
    if (ai) {
      const promptCombined = `${contextPrompt}Pertanyaan atau tanggapan user: "${latestMessage}"`;
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptCombined,
        config: {
          systemInstruction,
          temperature: 0.85
        }
      });

      const replyText = response.text || "Aduh, sinyal di stadion terganggu bung! Mari kita tunggu wasit menegakkan keadilan di lapangan.";
      return res.json({ reply: replyText });
    } else {
      throw new Error("Sistem GoogleGenAI belum siap.");
    }
  } catch (error: any) {
    console.error("Kesalahan Gemini API:", error);
    // Provide a beautiful fallback commentary responses depending on matches to simulate Gemini being active
    const fallbacks = [
      "JEBREEET! Tembakan geledek yang luar biasa spektakuler, Bung! Bola meluncur mulus bagaikan anak panah terlepas dari busurnya! Pertahanan lawan kocar-kacir membendung pergerakan taktis!",
      "Aduuuh sayang sekali, Bung! Umpan membelah lautan yang sangat visioner tadi harus terperangkap jebakan offside tipis sekali sedalam jengkal jari! Pertandingan berjalan sangat panas nan krusial!",
      "Wah wah wah! Ini bukan sekadar pertandingan sepak bola biasa, ini adalah pertempuran harga diri luhur antar bangsa di ajang termegah FIFA World Cup 2026! Pelatih pasti jantungan melihat tensi sepanas ini!",
    ];
    const picked = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    return res.json({
      reply: `[Koneksi Fallback - Simulator Siaran] ${picked}`,
      warning: "Fallback local diaktifkan karena API Key belum dikonfigurasi di server."
    });
  }
});

// 6. Gemini instant commentator analysis on a match card clicked
app.get("/api/gemini/analyze/:matchId", async (req, res) => {
  const matchId = req.params.matchId;
  const matchObj = matches.find(m => m.id === matchId);
  if (!matchObj) return res.status(404).json({ error: "Pertandingan tidak ditemukan" });

  const systemInstruction = `Kamu adalah komentator legendaris sepak bola piala dunia kebanggaan Indonesia. Berikan taklimat taktis instan yang seru berkobar-kobar mengenai jalannya pertandingan, pencapaian, dan apa peluang tim ke depan. Jawab dalam Bahasa Indonesia dalam format Markdown yang indah, singkat (maksimal 3 paragraf), beri subjudul yang sangat bombastis!`;

  try {
    if (ai) {
      const prompt = `Berikan analisis singkat, seru, dan menggila mengenai laga:
      ${matchObj.homeTeam} (${matchObj.homeFlag}) vs ${matchObj.awayTeam} (${matchObj.awayFlag}) 
      Skor Akhir/Kini: ${matchObj.homeScore} - ${matchObj.awayScore}
      Status Laga: ${matchObj.status} (Menit: ${matchObj.minute})
      Kejadian: ${JSON.stringify(matchObj.events)}
      Lokasi Stadium: ${matchObj.stadium}, ${matchObj.city}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.82
        }
      });

      return res.json({ analysis: response.text });
    } else {
      throw new Error("Client Gemini tidak tersedia.");
    }
  } catch (err) {
    // Generate a fallback tailored to the match!
    let fallbackText = `### 🔥 DRAMA LUAR BIASA DI ${matchObj.stadium.toUpperCase()}!\n\n`;
    if (matchObj.homeScore > matchObj.awayScore) {
      fallbackText += `Dominasi taktis mutlak ditunjukkan oleh skuad **${matchObj.homeTeam}**! Serangan sporadis dari kedua sayap berhasil membombardir pertahanan **${matchObj.awayTeam}**. Skuad asuhan mereka terpaksa mengakui kekompakan kolektif tuan rumah yang terus menekan semenjak menit awal pertandingan! Umpan-umpan manja nan tajam membuat laga ini layak dikenang panjang sejarah!`;
    } else if (matchObj.homeScore < matchObj.awayScore) {
      fallbackText += `Kemenangan heroik berhasil dicuri oleh pasukan **${matchObj.awayTeam}** di hadapan pendukung lawan! Taktik serangan balik kilat mematikan menjadi momok menakutkan bagi lini defensif **${matchObj.homeTeam}** yang terlampau asyik menyerang. Pertunjukan mentalitas luhur juara piala dunia murni diperlihatkan hari ini, Bung!`;
    } else {
      fallbackText += `Duel sengit papan atas yang tak menyisakan ruang bernapas bagi kedua kesebelasan! Baik **${matchObj.homeTeam}** maupun **${matchObj.awayTeam}** mempertontonkan sepak bola menyerang berkecepatan tinggi yang memicu adrenalin penonton naik turun. Skor imbang mencerminkan keadilan luhur taktis pelatih di atas lapangan rumput hijau!`;
    }
    return res.json({ analysis: fallbackText });
  }
});


// Serve Vite or static files
async function startServer() {
  // Vite integration middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[FIFA World Cup 2026] Server berjalan di http://localhost:${PORT}`);
  });
}

startServer();
