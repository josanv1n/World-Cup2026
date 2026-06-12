import { Match, Standing } from "./types";

export const initialMatches: Match[] = [
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
    status: "Selesai",
    minute: 90,
    isLive: false,
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
    status: "Selesai",
    minute: 90,
    isLive: false,
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
    status: "Selesai",
    minute: 90,
    isLive: false,
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

export const initialStandings: Standing[] = [
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
      { rank: 4, teamName: "Kolombia", flag: "🇨🇴", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, pts: 0 }
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

export const teamScorersFallback: Record<string, string[]> = {
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
