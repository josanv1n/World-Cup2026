import { Match, Standing } from "./types";

interface MatchConfig {
  id: string;
  group: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  homeScore?: number;
  awayScore?: number;
  status?: string;
  minute?: number;
  isLive?: boolean;
}

export const flags: Record<string, string> = {
  "Meksiko": "🇲🇽",
  "Afrika Selatan": "🇿🇦",
  "Republik Korea": "🇰🇷",
  "Republik Ceko": "🇨🇿",
  "Kanada": "🇨🇦",
  "Bosnia dan Herzegovina": "🇧🇦",
  "Amerika Serikat": "🇺🇸",
  "Paraguay": "🇵🇾",
  "Haiti": "🇭🇹",
  "Skotlandia": "sco",
  "Australia": "🇦🇺",
  "Turki": "🇹🇷",
  "Brazil": "🇧🇷",
  "Maroko": "🇲🇦",
  "Qatar": "🇶🇦",
  "Swiss": "🇨🇭",
  "Pantai Gading": "🇨🇮",
  "Ekuador": "🇪🇨",
  "Jerman": "🇩🇪",
  "Curaçao": "🇨🇼",
  "Belanda": "🇳🇱",
  "Jepang": "🇯🇵",
  "Swedia": "🇸🇪",
  "Tunisia": "🇹🇳",
  "Arab Saudi": "🇸🇦",
  "Uruguay": "🇺🇾",
  "Spanyol": "🇪🇸",
  "Tanjung Verde": "🇨🇻",
  "Iran": "🇮🇷",
  "Selandia Baru": "🇳🇿",
  "Belgia": "🇧🇪",
  "Mesir": "🇪🇬",
  "Perancis": "🇫🇷",
  "senegal": "🇸🇳",
  "Irak": "🇮🇶",
  "Norwegia": "🇳🇴",
  "Argentina": "🇦🇷",
  "Aljazair": "🇩🇿",
  "Austria": "🇦🇹",
  "Yordania": "🇯🇴",
  "Ghana": "🇬🇭",
  "Panama": "🇵🇦",
  "Inggris": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "Kroasia": "🇭🇷",
  "Portugal": "🇵🇹",
  "RD Kongo": "🇨🇩",
  "Uzbekistan": "🇺🇿",
  "Kolumbia": "🇨🇴"
};

export const groupsMapping: Record<string, { teamName: string; flag: string }[]> = {
  "Grup A": [
    { teamName: "Meksiko", flag: "🇲🇽" },
    { teamName: "Republik Korea", flag: "🇰🇷" },
    { teamName: "Republik Ceko", flag: "🇨🇿" },
    { teamName: "Afrika Selatan", flag: "🇿🇦" }
  ],
  "Grup B": [
    { teamName: "Swiss", flag: "🇨🇭" },
    { teamName: "Kanada", flag: "🇨🇦" },
    { teamName: "Qatar", flag: "🇶🇦" },
    { teamName: "Bosnia dan Herzegovina", flag: "🇧🇦" }
  ],
  "Grup C": [
    { teamName: "Brazil", flag: "🇧🇷" },
    { teamName: "Maroko", flag: "🇲🇦" },
    { teamName: "Skotlandia", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
    { teamName: "Haiti", flag: "🇭🇹" }
  ],
  "Grup D": [
    { teamName: "Amerika Serikat", flag: "🇺🇸" },
    { teamName: "Turki", flag: "🇹🇷" },
    { teamName: "Australia", flag: "🇦🇺" },
    { teamName: "Paraguay", flag: "🇵🇾" }
  ],
  "Grup E": [
    { teamName: "Jerman", flag: "🇩🇪" },
    { teamName: "Ekuador", flag: "🇪🇨" },
    { teamName: "Pantai Gading", flag: "🇨🇮" },
    { teamName: "Curaçao", flag: "🇨🇼" }
  ],
  "Grup F": [
    { teamName: "Belanda", flag: "🇳🇱" },
    { teamName: "Jepang", flag: "🇯🇵" },
    { teamName: "Swedia", flag: "🇸🇪" },
    { teamName: "Tunisia", flag: "🇹🇳" }
  ],
  "Grup G": [
    { teamName: "Belgia", flag: "🇧🇪" },
    { teamName: "Iran", flag: "🇮🇷" },
    { teamName: "Mesir", flag: "🇪🇬" },
    { teamName: "Selandia Baru", flag: "🇳🇿" }
  ],
  "Grup H": [
    { teamName: "Spanyol", flag: "🇪🇸" },
    { teamName: "Uruguay", flag: "🇺🇾" },
    { teamName: "Arab Saudi", flag: "🇸🇦" },
    { teamName: "Tanjung Verde", flag: "🇨🇻" }
  ],
  "Grup I": [
    { teamName: "Perancis", flag: "🇫🇷" },
    { teamName: "senegal", flag: "🇸🇳" },
    { teamName: "Norwegia", flag: "🇳🇴" },
    { teamName: "Irak", flag: "🇮🇶" }
  ],
  "Grup J": [
    { teamName: "Argentina", flag: "🇦🇷" },
    { teamName: "Austria", flag: "🇦🇹" },
    { teamName: "Aljazair", flag: "🇩🇿" },
    { teamName: "Yordania", flag: "🇯🇴" }
  ],
  "Grup K": [
    { teamName: "Portugal", flag: "🇵🇹" },
    { teamName: "Kolumbia", flag: "🇨🇴" },
    { teamName: "RD Kongo", flag: "🇨🇩" },
    { teamName: "Uzbekistan", flag: "🇺🇿" }
  ],
  "Grup L": [
    { teamName: "Inggris", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
    { teamName: "Kroasia", flag: "🇭🇷" },
    { teamName: "Panama", flag: "🇵🇦" },
    { teamName: "Ghana", flag: "🇬🇭" }
  ]
};

const matchRaw: MatchConfig[] = [
  { id: "m1", group: "Grup A", homeTeam: "Meksiko", awayTeam: "Afrika Selatan", date: "12 Juni 2026", time: "02:00 UTC", homeScore: 2, awayScore: 0, status: "Selesai", minute: 90 },
  { id: "m2", group: "Grup A", homeTeam: "Republik Korea", awayTeam: "Republik Ceko", date: "12 Juni 2026", time: "09:00 UTC", homeScore: 2, awayScore: 1, status: "Selesai", minute: 90 },
  { id: "m3", group: "Grup B", homeTeam: "Kanada", awayTeam: "Bosnia dan Herzegovina", date: "13 Juni 2026", time: "02:00 UTC", homeScore: 1, awayScore: 1, status: "Selesai", minute: 90 },
  { id: "m4", group: "Grup D", homeTeam: "Amerika Serikat", awayTeam: "Paraguay", date: "13 Juni 2026", time: "08:00 UTC", homeScore: 4, awayScore: 1, status: "Selesai", minute: 90 },
  { id: "m5", group: "Grup C", homeTeam: "Haiti", awayTeam: "Skotlandia", date: "14 Juni 2026", time: "08:00 UTC" },
  { id: "m6", group: "Grup D", homeTeam: "Australia", awayTeam: "Turki", date: "14 Juni 2026", time: "11:00 UTC" },
  { id: "m7", group: "Grup C", homeTeam: "Brazil", awayTeam: "Maroko", date: "14 Juni 2026", time: "05:00 UTC" },
  { id: "m8", group: "Grup B", homeTeam: "Qatar", awayTeam: "Swiss", date: "14 Juni 2026", time: "02:00 UTC" },
  { id: "m9", group: "Grup E", homeTeam: "Pantai Gading", awayTeam: "Ekuador", date: "15 Juni 2026", time: "06:00 UTC" },
  { id: "m10", group: "Grup E", homeTeam: "Jerman", awayTeam: "Curaçao", date: "15 Juni 2026", time: "00:00 UTC" },
  { id: "m11", group: "Grup F", homeTeam: "Belanda", awayTeam: "Jepang", date: "15 Juni 2026", time: "03:00 UTC" },
  { id: "m12", group: "Grup F", homeTeam: "Swedia", awayTeam: "Tunisia", date: "15 Juni 2026", time: "09:00 UTC" },
  { id: "m13", group: "Grup H", homeTeam: "Arab Saudi", awayTeam: "Uruguay", date: "16 Juni 2026", time: "05:00 UTC" },
  { id: "m14", group: "Grup H", homeTeam: "Spanyol", awayTeam: "Tanjung Verde", date: "15 Juni 2026", time: "23:00 UTC" },
  { id: "m15", group: "Grup G", homeTeam: "Iran", awayTeam: "Selandia Baru", date: "16 Juni 2026", time: "08:00 UTC" },
  { id: "m16", group: "Grup G", homeTeam: "Belgia", awayTeam: "Mesir", date: "16 Juni 2026", time: "02:00 UTC" },
  { id: "m17", group: "Grup I", homeTeam: "Perancis", awayTeam: "senegal", date: "17 Juni 2026", time: "02:00 UTC" },
  { id: "m18", group: "Grup I", homeTeam: "Irak", awayTeam: "Norwegia", date: "17 Juni 2026", time: "05:00 UTC" },
  { id: "m19", group: "Grup J", homeTeam: "Argentina", awayTeam: "Aljazair", date: "17 Juni 2026", time: "08:00 UTC" },
  { id: "m20", group: "Grup J", homeTeam: "Austria", awayTeam: "Yordania", date: "17 Juni 2026", time: "11:00 UTC" },
  { id: "m21", group: "Grup L", homeTeam: "Ghana", awayTeam: "Panama", date: "18 Juni 2026", time: "06:00 UTC" },
  { id: "m22", group: "Grup L", homeTeam: "Inggris", awayTeam: "Kroasia", date: "18 Juni 2026", time: "03:00 UTC" },
  { id: "m23", group: "Grup K", homeTeam: "Portugal", awayTeam: "RD Kongo", date: "18 Juni 2026", time: "00:00 UTC" },
  { id: "m24", group: "Grup K", homeTeam: "Uzbekistan", awayTeam: "Kolumbia", date: "18 Juni 2026", time: "09:00 UTC" },
  { id: "m25", group: "Grup A", homeTeam: "Republik Ceko", awayTeam: "Afrika Selatan", date: "18 Juni 2026", time: "23:00 UTC" },
  { id: "m26", group: "Grup B", homeTeam: "Swiss", awayTeam: "Bosnia dan Herzegovina", date: "19 Juni 2026", time: "02:00 UTC" },
  { id: "m27", group: "Grup B", homeTeam: "Kanada", awayTeam: "Qatar", date: "19 Juni 2026", time: "05:00 UTC" },
  { id: "m28", group: "Grup A", homeTeam: "Meksiko", awayTeam: "Republik Korea", date: "19 Juni 2026", time: "08:00 UTC" },
  { id: "m29", group: "Grup C", homeTeam: "Brazil", awayTeam: "Haiti", date: "20 Juni 2026", time: "07:30 UTC" },
  { id: "m30", group: "Grup C", homeTeam: "Skotlandia", awayTeam: "Maroko", date: "20 Juni 2026", time: "05:00 UTC" },
  { id: "m31", group: "Grup D", homeTeam: "Amerika Serikat", awayTeam: "Australia", date: "20 Juni 2026", time: "10:00 UTC" },
  { id: "m32", group: "Grup D", homeTeam: "Turki", awayTeam: "Paraguay", date: "20 Juni 2026", time: "02:00 UTC" },
  { id: "m33", group: "Grup E", homeTeam: "Jerman", awayTeam: "Pantai Gading", date: "21 Juni 2026", time: "03:00 UTC" },
  { id: "m34", group: "Grup E", homeTeam: "Ekuador", awayTeam: "Curaçao", date: "21 Juni 2026", time: "07:00 UTC" },
  { id: "m35", group: "Grup F", homeTeam: "Belanda", awayTeam: "Swedia", date: "21 Juni 2026", time: "00:00 UTC" },
  { id: "m36", group: "Grup F", homeTeam: "Tunisia", awayTeam: "Jepang", date: "21 Juni 2026", time: "11:00 UTC" },
  { id: "m37", group: "Grup H", homeTeam: "Uruguay", awayTeam: "Tanjung Verde", date: "22 Juni 2026", time: "05:00 UTC" },
  { id: "m38", group: "Grup H", homeTeam: "Spanyol", awayTeam: "Arab Saudi", date: "21 Juni 2026", time: "23:00 UTC" },
  { id: "m39", group: "Grup G", homeTeam: "Belgia", awayTeam: "Iran", date: "22 Juni 2026", time: "02:00 UTC" },
  { id: "m40", group: "Grup G", homeTeam: "Selandia Baru", awayTeam: "Mesir", date: "22 Juni 2026", time: "08:00 UTC" },
  { id: "m41", group: "Grup I", homeTeam: "Norwegia", awayTeam: "senegal", date: "23 Juni 2026", time: "07:00 UTC" },
  { id: "m42", group: "Grup I", homeTeam: "Perancis", awayTeam: "Irak", date: "23 Juni 2026", time: "03:00 UTC" },
  { id: "m43", group: "Grup J", homeTeam: "Argentina", awayTeam: "Austria", date: "23 Juni 2026", time: "00:00 UTC" },
  { id: "m44", group: "Grup J", homeTeam: "Yordania", awayTeam: "Aljazair", date: "23 Juni 2026", time: "10:00 UTC" },
  { id: "m45", group: "Grup L", homeTeam: "Inggris", awayTeam: "Ghana", date: "24 Juni 2026", time: "03:00 UTC" },
  { id: "m46", group: "Grup L", homeTeam: "Panama", awayTeam: "Kroasia", date: "24 Juni 2026", time: "06:00 UTC" },
  { id: "m47", group: "Grup K", homeTeam: "Portugal", awayTeam: "Uzbekistan", date: "24 Juni 2026", time: "00:00 UTC" },
  { id: "m48", group: "Grup K", homeTeam: "Kolumbia", awayTeam: "RD Kongo", date: "24 Juni 2026", time: "09:00 UTC" },
  { id: "m49", group: "Grup C", homeTeam: "Skotlandia", awayTeam: "Brazil", date: "25 Juni 2026", time: "05:00 UTC" },
  { id: "m50", group: "Grup C", homeTeam: "Maroko", awayTeam: "Haiti", date: "25 Juni 2026", time: "05:00 UTC" },
  { id: "m51", group: "Grup B", homeTeam: "Swiss", awayTeam: "Kanada", date: "25 Juni 2026", time: "02:00 UTC" },
  { id: "m52", group: "Grup B", homeTeam: "Bosnia dan Herzegovina", awayTeam: "Qatar", date: "25 Juni 2026", time: "02:00 UTC" },
  { id: "m53", group: "Grup A", homeTeam: "Republik Ceko", awayTeam: "Meksiko", date: "25 Juni 2026", time: "08:00 UTC" },
  { id: "m54", group: "Grup A", homeTeam: "Afrika Selatan", awayTeam: "Republik Korea", date: "25 Juni 2026", time: "08:00 UTC" },
  { id: "m55", group: "Grup E", homeTeam: "Curaçao", awayTeam: "Pantai Gading", date: "26 Juni 2026", time: "03:00 UTC" },
  { id: "m56", group: "Grup E", homeTeam: "Ekuador", awayTeam: "Jerman", date: "26 Juni 2026", time: "03:00 UTC" },
  { id: "m57", group: "Grup F", homeTeam: "Jepang", awayTeam: "Swedia", date: "26 Juni 2026", time: "06:00 UTC" },
  { id: "m58", group: "Grup F", homeTeam: "Tunisia", awayTeam: "Belanda", date: "26 Juni 2026", time: "06:00 UTC" },
  { id: "m59", group: "Grup D", homeTeam: "Turki", awayTeam: "Amerika Serikat", date: "26 Juni 2026", time: "09:00 UTC" },
  { id: "m60", group: "Grup D", homeTeam: "Paraguay", awayTeam: "Australia", date: "26 Juni 2026", time: "09:00 UTC" },
  { id: "m61", group: "Grup I", homeTeam: "Norwegia", awayTeam: "Perancis", date: "27 Juni 2026", time: "02:00 UTC" },
  { id: "m62", group: "Grup I", homeTeam: "senegal", awayTeam: "Irak", date: "27 Juni 2026", time: "02:00 UTC" },
  { id: "m63", group: "Grup G", homeTeam: "Mesir", awayTeam: "Iran", date: "27 Juni 2026", time: "10:00 UTC" },
  { id: "m64", group: "Grup G", homeTeam: "Selandia Baru", awayTeam: "Belgia", date: "27 Juni 2026", time: "10:00 UTC" },
  { id: "m65", group: "Grup H", homeTeam: "Tanjung Verde", awayTeam: "Arab Saudi", date: "27 Juni 2026", time: "07:00 UTC" },
  { id: "m66", group: "Grup H", homeTeam: "Uruguay", awayTeam: "Spanyol", date: "27 Juni 2026", time: "07:00 UTC" },
  { id: "m67", group: "Grup L", homeTeam: "Panama", awayTeam: "Inggris", date: "28 Juni 2026", time: "04:00 UTC" },
  { id: "m68", group: "Grup L", homeTeam: "Kroasia", awayTeam: "Ghana", date: "28 Juni 2026", time: "04:00 UTC" },
  { id: "m69", group: "Grup J", homeTeam: "Aljazair", awayTeam: "Austria", date: "28 Juni 2026", time: "09:00 UTC" },
  { id: "m70", group: "Grup J", homeTeam: "Yordania", awayTeam: "Argentina", date: "28 Juni 2026", time: "09:00 UTC" },
  { id: "m71", group: "Grup K", homeTeam: "Kolumbia", awayTeam: "Portugal", date: "28 Juni 2026", time: "06:30 UTC" },
  { id: "m72", group: "Grup K", homeTeam: "RD Kongo", awayTeam: "Uzbekistan", date: "28 Juni 2026", time: "06:30 UTC" }
];

export const initialMatches: Match[] = matchRaw.map(m => {
  const isLive = m.isLive ?? false;
  const status = m.status ?? "Belum Mulai";
  const minute = m.minute ?? 0;
  const homeScore = m.homeScore ?? 0;
  const awayScore = m.awayScore ?? 0;

  const isSelesai = status === "Selesai";
  let possession: [number, number] = [50, 50];
  let shots: [number, number] = [0, 0];
  let fouls: [number, number] = [0, 0];
  let yellowCards: [number, number] = [0, 0];
  let redCards: [number, number] = [0, 0];

  if (isSelesai) {
    if (m.id === "m1") {
      possession = [52, 48];
      shots = [12, 10];
      fouls = [11, 13];
      yellowCards = [1, 2];
      redCards = [1, 2];
    } else if (m.id === "m2") {
      possession = [54, 46];
      shots = [13, 11];
      fouls = [9, 12];
      yellowCards = [1, 0];
      redCards = [0, 0];
    } else if (m.id === "m3") {
      possession = [49, 51];
      shots = [10, 12];
      fouls = [12, 10];
      yellowCards = [0, 1];
      redCards = [0, 0];
    } else if (m.id === "m4") {
      possession = [56, 44];
      shots = [18, 9];
      fouls = [12, 15];
      yellowCards = [2, 3];
      redCards = [0, 0];
    } else {
      possession = [52, 48];
      shots = [12, 10];
      fouls = [11, 13];
      yellowCards = [1, 2];
      redCards = [0, 0];
    }
  }

  let events = [];
  if (m.id === "m1") {
    events = [
      { id: "e1", minute: 9, type: "goal", team: "home", player: "Julián Quiñones", assistant: "Erik Lira", detail: "Mencetak gol pertama sekaligus gol perdana di turnamen Piala Dunia 2026 lewat tembakan kaki kanan setelah menerima operan dari Erik Lira." },
      { id: "e2", minute: 49, type: "red_card", team: "away", player: "Sphephelo Sithole", detail: "Menerima kartu merah langsung setelah melakukan pelanggaran taktis ekstrem." },
      { id: "e3", minute: 67, type: "goal", team: "home", player: "Raúl Jiménez", assistant: "Roberto Alvarado", detail: "Mengunci kemenangan Meksiko lewat sundulan kepala yang memanfaatkan umpan silang matang dari Roberto Alvarado." },
      { id: "e4", minute: 84, type: "red_card", team: "away", player: "Themba Zwane", detail: "Kartu kuning kedua setelah menjatuhkan striker lawan." },
      { id: "e5", minute: 93, type: "red_card", team: "home", player: "César Montes", detail: "Kartu merah langsung setelah mengalami ketegangan fisik di area kotak penalti." }
    ];
  } else if (m.id === "m2") {
    events = [
      { id: "e5", minute: 24, type: "goal", team: "home", player: "Son Heung-min", assistant: "Lee Kang-in" },
      { id: "e6", minute: 58, type: "goal", team: "away", player: "P. Schick" },
      { id: "e7", minute: 75, type: "yellow_card", team: "home", player: "Kim Min-jae" },
      { id: "e8", minute: 82, type: "goal", team: "home", player: "Hwang Hee-chan" }
    ];
  } else if (m.id === "m3") {
    events = [
      { id: "e9", minute: 34, type: "goal", team: "home", player: "Jonathan David", assistant: "Alphonso Davies" },
      { id: "e10", minute: 52, type: "yellow_card", team: "away", player: "E. Džeko" },
      { id: "e11", minute: 79, type: "goal", team: "away", player: "E. Džeko", assistant: "M. Pjanić" }
    ];
  } else if (m.id === "m4") {
    events = [
      { id: "e12", minute: 7, type: "goal", team: "home", player: "Damián Bobadilla (Gol Bunuh Diri)", detail: "Gol Bunuh Diri: Pemain Paraguay salah mengantisipasi umpan silang Weston McKennie sehingga bola masuk ke gawangnya sendiri." },
      { id: "e13", minute: 31, type: "goal", team: "home", player: "Folarin Balogun", assistant: "Christian Pulisic", detail: "Mencetak gol setelah memaksimalkan umpan matang dari Christian Pulisic." },
      { id: "e14", minute: 45, type: "goal", team: "home", player: "Folarin Balogun", assistant: "Malik Tillman", detail: "Mencetak gol keduanya (brace) sesaat sebelum babak pertama usai setelah menerima umpan jauh dari Malik Tillman." },
      { id: "e15", minute: 73, type: "goal", team: "away", player: "Maurício", detail: "Mencetak gol hiburan bagi Paraguay setelah memanfaatkan kelengahan barisan pertahanan Amerika Serikat." },
      { id: "e16", minute: 90, type: "goal", team: "home", player: "Giovanni Reyna", detail: "Mengunci kemenangan telak AS di masa injury time babak kedua lewat tembakan terukur dari luar kotak penalti." }
    ];
  }

  return {
    ...m,
    time: m.time.indexOf("WIB") !== -1 ? m.time : m.time.replace(/\s*UTC\s*$/i, " WIB"),
    homeFlag: flags[m.homeTeam] || "🏳️",
    awayFlag: flags[m.awayTeam] || "🏳️",
    homeScore,
    awayScore,
    status,
    minute,
    isLive,
    stadium: "Stadion Piala Dunia",
    city: "FIFA Host City",
    possession,
    shots,
    fouls,
    yellowCards,
    redCards,
    events
  } as Match;
});

export function calculateStandings(matchList: Match[]): Standing[] {
  const standings: Standing[] = Object.keys(groupsMapping).map(groupName => {
    const teams = groupsMapping[groupName].map(t => ({
      rank: 0,
      teamName: t.teamName,
      flag: t.flag,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      pts: 0
    }));
    return { groupName, teams };
  });

  matchList.forEach(m => {
    const hasBeenPlayed = m.status === "Selesai" || m.isLive || (m.minute > 0 && m.status !== "Belum Mulai");
    if (!hasBeenPlayed) return;

    const grpn = m.group;
    const groupStanding = standings.find(s => s.groupName === grpn);
    if (!groupStanding) return;

    const homeVal = groupStanding.teams.find(t => t.teamName === m.homeTeam);
    const awayVal = groupStanding.teams.find(t => t.teamName === m.awayTeam);

    if (homeVal && awayVal) {
      homeVal.played += 1;
      awayVal.played += 1;
      homeVal.gf += m.homeScore;
      homeVal.ga += m.awayScore;
      awayVal.gf += m.awayScore;
      awayVal.ga += m.homeScore;

      if (m.homeScore > m.awayScore) {
        homeVal.won += 1;
        homeVal.pts += 3;
        awayVal.lost += 1;
      } else if (m.homeScore < m.awayScore) {
        awayVal.won += 1;
        awayVal.pts += 3;
        homeVal.lost += 1;
      } else {
        homeVal.drawn += 1;
        homeVal.pts += 1;
        awayVal.drawn += 1;
        awayVal.pts += 1;
      }

      homeVal.gd = homeVal.gf - homeVal.ga;
      awayVal.gd = awayVal.gf - awayVal.ga;
    }
  });

  standings.forEach(s => {
    s.teams.sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.gd !== a.gd) return b.gd - a.gd;
      if (b.gf !== a.gf) return b.gf - a.gf;
      return a.teamName.localeCompare(b.teamName);
    });

    s.teams.forEach((t, i) => {
      t.rank = i + 1;
    });
  });

  return standings;
}
