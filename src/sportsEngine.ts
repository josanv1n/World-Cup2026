import { Match, MatchEvent } from "./types";

const teamScorersFallback: Record<string, string[]> = {
  "Prancis": ["Kylian Mbappé", "Antoine Griezmann", "Ousmane Dembélé", "Marcus Thuram", "Eduardo Camavinga"],
  "Perancis": ["Kylian Mbappé", "Antoine Griezmann", "Ousmane Dembélé", "Marcus Thuram", "Eduardo Camavinga"],
  "Portugal": ["Cristiano Ronaldo", "Bruno Fernandes", "Rafael Leão", "Bernardo Silva", "João Félix"],
  "Belgia": ["Kevin De Bruyne", "Romelu Lukaku", "Leandro Trossard", "Jérémy Doku", "Amadou Onana"],
  "Brazil": ["Vinícius Júnior", "Rodrygo", "Raphinha", "Neymar Jr", "Bruno Guimarães"],
  "Uruguay": ["Darwin Núñez", "Federico Valverde", "Ronald Araújo", "Luis Suárez", "Rodrigo Bentancur"],
  "Kroasia": ["Luka Modrić", "Mateo Kovačić", "Andrej Kramarić", "Ivan Perišić", "Joško Gvardiol"],
  "Senegal": ["Sadio Mané", "Nicolas Jackson", "Ismaïla Sarr", "Kalidou Koulibaly", "Pape Sarr"],
  "Ghana": ["Mohammed Kudus", "Inaki Williams", "Jordan Ayew", "Thomas Partey", "Antoine Semenyo"],
  "Turki": ["Arda Güler", "Hakan Çalhanoğlu", "Kenan Yıldız", "Kerem Aktürkoğlu", "Barış Alper Yılmaz"],
  "Australia": ["Mitchell Duke", "Craig Goodwin", "Jackson Irvine", "Martin Boyle", "Harry Souttar"],
  "Meksiko": ["Santiago Giménez", "Hirving Lozano", "Edson Álvarez", "Luis Chávez", "Uriel Antuna"],
  "Afrika Selatan": ["T. Mokoena", "P. Tau", "Themba Zwane", "Evidence Makgopa", "Mothobi Mvala"],
  "Ekuador": ["Enner Valencia", "Moisés Caicedo", "Piero Hincapié", "Kendry Páez", "Pervis Estupiñán"],
  "Swiss": ["Breel Embolo", "Xherdan Shaqiri", "Granit Xhaka", "Manuel Akanji", "Ruben Vargas"],
  "Swis": ["Breel Embolo", "Xherdan Shaqiri", "Granit Xhaka", "Manuel Akanji", "Ruben Vargas"],
  "Arab Saudi": ["Salem Al-Dawsari", "Firas Al-Buraikan", "Saleh Al-Shehri", "Mohamed Kanno", "Saud Abdulhamid"],
  "Mesir": ["Mohamed Salah", "Mostafa Mohamed", "Trezeguet", "Omar Marmoush", "Mohamed Elneny"],
  "Norwegia": ["Erling Haaland", "Martin Ødegaard", "Alexander Sørloth", "Antonio Nusa", "Sander Berge"],
  "Austria": ["Marcel Sabitzer", "Christoph Baumgartner", "Michael Gregoritsch", "Konrad Laimer", "Patrick Wimmer"],
  "Kolumbia": ["Luis Díaz", "James Rodríguez", "Jhon Durán", "Rafael Borré", "Luis Sinisterra"],
  "Aljazair": ["Riyad Mahrez", "Said Benrahma", "Amine Gouiri", "Baghdad Bounedjah", "Aissa Mandi"],
  "Yordania": ["Musa Al-Taamari", "Yazan Al-Naimat", "Ali Olwan", "Nizar Al-Rashdan"],
  "Uzbekistan": ["Eldor Shomurodov", "Abbosbek Fayzullaev", "Oston Urunov", "Jaloliddin Masharipov"],
  "RD Kongo": ["Yoane Wissa", "Cédric Bakambu", "Chancel Mbemba", "Meschack Elia"],
  "Panama": ["Ismael Díaz", "José Fajardo", "Adalberto Carrasquilla", "Edgar Bárcenas"]
};

function getTeamPlayers(teamName: string): string[] {
  const cleanName = teamName.trim();
  if (teamScorersFallback[cleanName]) {
    return teamScorersFallback[cleanName];
  }
  const generalNames = [
    "J. Rodriguez", "M. Silva", "A. Santos", "E. Gomez", "D. Fernandez", 
    "S. Diallo", "O. Mensah", "K. Tanaka", "J. Lee", "H. Schmidt"
  ];
  return generalNames.map(name => `${name} (${teamName})`);
}

export function parseMatchDateTime(dateStr: string, timeStr: string): Date {
  const monthMap: Record<string, number> = {
    "januari": 0, "februari": 1, "maret": 2, "april": 3, "mei": 4, "juni": 5,
    "juli": 6, "agustus": 7, "september": 8, "oktober": 9, "november": 10, "desember": 11
  };
  
  const dateParts = dateStr.trim().split(/\s+/);
  const timeClean = timeStr.replace(/UTC|WIB/gi, "").trim();
  const timeParts = timeClean.split(":");
  
  const day = parseInt(dateParts[0], 10) || 1;
  const monthName = (dateParts[1] || "").toLowerCase();
  const month = monthMap[monthName] !== undefined ? monthMap[monthName] : 5; // default June
  const year = parseInt(dateParts[2], 10) || 2026;
  
  const hour = parseInt(timeParts[0], 10) || 0;
  const minute = parseInt(timeParts[1], 10) || 0;
  
  const utcDate = new Date(Date.UTC(year, month, day, hour, minute, 0));
  utcDate.setUTCHours(utcDate.getUTCHours() - 7);
  return utcDate;
}

export function getDeterministicScore(matchId: string, teamName: string): number {
  let hash = 0;
  const str = matchId + teamName;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 4; // Returns 0, 1, 2, or 3
}

export function getDeterministicStats(matchId: string, homeTeam: string, awayTeam: string, homeScore: number, awayScore: number) {
  if (matchId === "m1") {
    return { possession: [52, 48] as [number, number], shots: [12, 10] as [number, number], fouls: [11, 13] as [number, number], yellowCards: [1, 2] as [number, number], redCards: [1, 2] as [number, number] };
  } else if (matchId === "m2") {
    return { possession: [54, 46] as [number, number], shots: [13, 11] as [number, number], fouls: [9, 12] as [number, number], yellowCards: [1, 0] as [number, number], redCards: [0, 0] as [number, number] };
  } else if (matchId === "m3") {
    return { possession: [49, 51] as [number, number], shots: [10, 12] as [number, number], fouls: [12, 10] as [number, number], yellowCards: [0, 1] as [number, number], redCards: [0, 0] as [number, number] };
  } else if (matchId === "m4") {
    return { possession: [56, 44] as [number, number], shots: [18, 9] as [number, number], fouls: [12, 15] as [number, number], yellowCards: [2, 3] as [number, number], redCards: [0, 0] as [number, number] };
  }

  let hash = 0;
  const str = matchId + homeTeam + awayTeam;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hVal = Math.abs(hash);

  let homePoss = 42 + (hVal % 17);
  if (homeScore > awayScore) homePoss += 2;
  if (homeScore < awayScore) homePoss -= 2;
  homePoss = Math.max(35, Math.min(65, homePoss));
  const possession: [number, number] = [homePoss, 100 - homePoss];

  const homeShots = 6 + (homeScore * 2) + (hVal % 6);
  const awayShots = 5 + (awayScore * 2) + ((hVal >> 2) % 6);
  const shots: [number, number] = [homeShots, awayShots];

  const homeFouls = 8 + (hVal % 7);
  const awayFouls = 9 + ((hVal >> 3) % 7);
  const fouls: [number, number] = [homeFouls, awayFouls];

  const homeYellow = Math.max(0, (homeFouls > 11 ? 1 : 0) + (hVal % 3) - (homeScore > 2 ? 1 : 0));
  const awayYellow = Math.max(0, (awayFouls > 11 ? 1 : 0) + ((hVal >> 4) % 3) - (awayScore > 2 ? 1 : 0));
  const yellowCards: [number, number] = [homeYellow, awayYellow];

  const homeRed = (hVal % 23 === 0) ? 1 : 0;
  const awayRed = ((hVal >> 5) % 23 === 0) ? 1 : 0;
  const redCards: [number, number] = matchId === "m1" ? [1, 2] : [homeRed, awayRed];

  return { possession, shots, fouls, yellowCards, redCards };
}

export function getDeterministicEvents(matchId: string, homeTeam: string, awayTeam: string, homeScore: number, awayScore: number, yellowCards: [number, number], redCards: [number, number]): MatchEvent[] {
  if (matchId === "m1") {
    return [
      { id: `${matchId}_e1`, minute: 9, type: "goal", team: "home", player: "Julián Quiñones", assistant: "Erik Lira", detail: "Mencetak gol pertama sekaligus gol perdana di turnamen Piala Dunia 2026 lewat tembakan kaki kanan setelah menerima operan dari Erik Lira." },
      { id: `${matchId}_e2`, minute: 49, type: "red_card", team: "away", player: "Sphephelo Sithole", detail: "Menerima kartu merah langsung setelah melakukan pelanggaran taktis ekstrem." },
      { id: `${matchId}_e3`, minute: 67, type: "goal", team: "home", player: "Raúl Jiménez", assistant: "Roberto Alvarado", detail: "Mengunci kemenangan Meksiko lewat sundulan kepala yang memanfaatkan umpan silang matang dari Roberto Alvarado." },
      { id: `${matchId}_e4`, minute: 84, type: "red_card", team: "away", player: "Themba Zwane", detail: "Kartu kuning kedua setelah menjatuhkan striker lawan." },
      { id: `${matchId}_e5`, minute: 93, type: "red_card", team: "home", player: "César Montes", detail: "Kartu merah langsung setelah mengalami ketegangan fisik di area kotak penalti." }
    ];
  } else if (matchId === "m2") {
    return [
      { id: `${matchId}_e5`, minute: 24, type: "goal", team: "home", player: "Son Heung-min", assistant: "Lee Kang-in", detail: "Sontekan Kaki Kiri" },
      { id: `${matchId}_e6`, minute: 58, type: "goal", team: "away", player: "P. Schick", detail: "Tendangan Gawang" },
      { id: `${matchId}_e7`, minute: 75, type: "yellow_card", team: "home", player: "Kim Min-jae", detail: "Pelanggaran taktikal menghentikan serangan balik cepat" },
      { id: `${matchId}_e8`, minute: 82, type: "goal", team: "home", player: "Hwang Hee-chan", detail: "Sontekan Manis" }
    ];
  } else if (matchId === "m3") {
    return [
      { id: `${matchId}_e9`, minute: 34, type: "goal", team: "home", player: "Jonathan David", assistant: "Alphonso Davies", detail: "Tendangan Gawang" },
      { id: `${matchId}_e10`, minute: 52, type: "yellow_card", team: "away", player: "E. Džeko", detail: "Protes keras berlebih kepada hakim garis" },
      { id: `${matchId}_e11`, minute: 79, type: "goal", team: "away", player: "E. Džeko", assistant: "M. Pjanić", detail: "Undangan Sundulan Sudut yang murni" }
    ];
  } else if (matchId === "m4") {
    return [
      { id: `${matchId}_e12`, minute: 7, type: "goal", team: "home", player: "Damián Bobadilla (Gol Bunuh Diri)", detail: "Gol Bunuh Diri - Pemain Paraguay salah mengantisipasi umpan silang Weston McKennie sehingga bola masuk ke gawangnya sendiri." },
      { id: `${matchId}_e13`, minute: 31, type: "goal", team: "home", player: "Folarin Balogun", assistant: "Christian Pulisic", detail: "Mencetak gol setelah memaksimalkan umpan matang dari Christian Pulisic." },
      { id: `${matchId}_e14`, minute: 45, type: "goal", team: "home", player: "Folarin Balogun", assistant: "Malik Tillman", detail: "Mencetak gol keduanya (brace) sesaat sebelum babak pertama usai setelah menerima umpan jauh dari Malik Tillman." },
      { id: `${matchId}_e15`, minute: 73, type: "goal", team: "away", player: "Maurício", detail: "Mencetak gol hiburan bagi Paraguay setelah memanfaatkan kelengahan barisan pertahanan Amerika Serikat." },
      { id: `${matchId}_e16`, minute: 90, type: "goal", team: "home", player: "Giovanni Reyna", detail: "Mengunci kemenangan telak AS di masa injury time babak kedua lewat tembakan terukur dari luar kotak penalti." }
    ];
  }

  const events: MatchEvent[] = [];
  const homePool = getTeamPlayers(homeTeam);
  const awayPool = getTeamPlayers(awayTeam);

  let hash = 0;
  const str = matchId + homeTeam + awayTeam;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hVal = Math.abs(hash);

  for (let i = 0; i < homeScore; i++) {
    const min = 4 + Math.floor(((hVal + i * 22) % 84));
    const scorer = homePool[(hVal + i) % homePool.length];
    const assister = (hVal + i) % 3 !== 0 ? homePool[(hVal + i + 1) % homePool.length] : undefined;
    const details = ["Tendangan Gawang", "Sundulan Sudut", "Sontekan Kaki Kiri", "Penalti Dingin"];
    const detail = details[(hVal + i) % details.length];
    
    events.push({
      id: `${matchId}_hg_${i}`,
      minute: min,
      type: "goal",
      team: "home",
      player: scorer,
      assistant: assister !== scorer ? assister : undefined,
      detail
    });
  }

  for (let i = 0; i < awayScore; i++) {
    const min = 6 + Math.floor(((hVal + i * 19) % 83));
    const scorer = awayPool[(hVal + i + 2) % awayPool.length];
    const assister = (hVal + i) % 4 !== 0 ? awayPool[(hVal + i + 3) % awayPool.length] : undefined;
    const details = ["Sepakan Keras Terarah", "Sontekan Manis", "Tembakan Voli", "Sundulan Terbang"];
    const detail = details[(hVal + i + 2) % details.length];

    events.push({
      id: `${matchId}_ag_${i}`,
      minute: min,
      type: "goal",
      team: "away",
      player: scorer,
      assistant: assister !== scorer ? assister : undefined,
      detail
    });
  }

  return events.sort((a, b) => b.minute - a.minute);
}

export function updateMatchStatusesAndScoresByTimeOffline(currentMatches: Match[]): Match[] {
  const now = new Date();

  return currentMatches.map(originalMatch => {
    // Clone match object deep
    const match = JSON.parse(JSON.stringify(originalMatch)) as Match;
    
    const isPresetCompleted = ["m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8", "m9", "m10", "m11", "m12", "m13", "m14", "m15", "m16"].includes(match.id);
    
    if (isPresetCompleted) {
      match.status = "Selesai";
      match.isLive = false;
      match.minute = 90;
      
      const stats = getDeterministicStats(match.id, match.homeTeam, match.awayTeam, match.homeScore, match.awayScore);
      match.possession = stats.possession;
      match.shots = stats.shots;
      match.fouls = stats.fouls;
      match.yellowCards = stats.yellowCards;
      match.redCards = stats.redCards;
      if (!match.events || match.events.length === 0) {
        match.events = getDeterministicEvents(match.id, match.homeTeam, match.awayTeam, match.homeScore, match.awayScore, stats.yellowCards, stats.redCards);
      }
      return match;
    }
    
    const matchDateObj = parseMatchDateTime(match.date, match.time);
    const matchStartTime = matchDateObj.getTime();
    const currentTime = now.getTime();
    
    const matchEndTime = matchStartTime + (105 * 60 * 1000); // 105 mins approx

    if (currentTime < matchStartTime) {
      match.status = "Belum Mulai";
      match.isLive = false;
      match.minute = 0;
      match.homeScore = 0;
      match.awayScore = 0;
      match.events = [];
    } else if (currentTime >= matchStartTime && currentTime <= matchEndTime) {
      match.isLive = true;
      match.status = "Live";
      const currentMinute = Math.min(90, Math.floor((currentTime - matchStartTime) / (60 * 1000)));
      match.minute = currentMinute;
      
      // Calculate intermediate score up to this minute deterministically
      const fullHomeScore = getDeterministicScore(match.id, match.homeTeam);
      const fullAwayScore = getDeterministicScore(match.id, match.awayTeam);
      
      const stats = getDeterministicStats(match.id, match.homeTeam, match.awayTeam, fullHomeScore, fullAwayScore);
      const allEvents = getDeterministicEvents(match.id, match.homeTeam, match.awayTeam, fullHomeScore, fullAwayScore, stats.yellowCards, stats.redCards);
      
      // Filter events that happened. Since it's sorted desc, filter and reverse
      const ongoingEvents = allEvents.filter(e => e.minute <= currentMinute);
      const ongoingHomeGoals = ongoingEvents.filter(e => e.type === "goal" && e.team === "home").length;
      const ongoingAwayGoals = ongoingEvents.filter(e => e.type === "goal" && e.team === "away").length;
      
      match.homeScore = ongoingHomeGoals;
      match.awayScore = ongoingAwayGoals;
      match.events = ongoingEvents;
      
      match.possession = stats.possession;
      match.shots = [Math.floor((stats.shots[0] * currentMinute) / 90), Math.floor((stats.shots[1] * currentMinute) / 90)];
      match.fouls = [Math.floor((stats.fouls[0] * currentMinute) / 90), Math.floor((stats.fouls[1] * currentMinute) / 90)];
      match.yellowCards = [
        ongoingEvents.filter(e => e.type === "yellow_card" && e.team === "home").length,
        ongoingEvents.filter(e => e.type === "yellow_card" && e.team === "away").length
      ];
      match.redCards = [
        ongoingEvents.filter(e => e.type === "red_card" && e.team === "home").length,
        ongoingEvents.filter(e => e.type === "red_card" && e.team === "away").length
      ];
    } else if (currentTime > matchEndTime) {
      match.status = "Selesai";
      match.isLive = false;
      match.minute = 90;
      
      match.homeScore = getDeterministicScore(match.id, match.homeTeam);
      match.awayScore = getDeterministicScore(match.id, match.awayTeam);
      
      const stats = getDeterministicStats(match.id, match.homeTeam, match.awayTeam, match.homeScore, match.awayScore);
      match.possession = stats.possession;
      match.shots = stats.shots;
      match.fouls = stats.fouls;
      match.yellowCards = stats.yellowCards;
      match.redCards = stats.redCards;
      match.events = getDeterministicEvents(match.id, match.homeTeam, match.awayTeam, match.homeScore, match.awayScore, stats.yellowCards, stats.redCards);
    }
    return match;
  });
}
