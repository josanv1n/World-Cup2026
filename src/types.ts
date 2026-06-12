/**
 * Types for FIFA World Cup 2026 Live Score Tracker
 */

export interface MatchEvent {
  id: string;
  minute: number;
  type: 'goal' | 'yellow_card' | 'red_card' | 'penalty' | 'substitution';
  team: 'home' | 'away';
  player: string;
  assistant?: string;
  detail?: string;
}

export interface Match {
  id: string;
  group: string;
  homeTeam: string;
  homeFlag: string;
  awayTeam: string;
  awayFlag: string;
  homeScore: number;
  awayScore: number;
  status: string; // 'Selesai', '90\'', '45\'', 'Belum Mulai', etc.
  minute: number; // For live match ticking
  stoppageTime?: number;
  isLive: boolean;
  date: string;
  time: string;
  stadium: string;
  city: string;
  events: MatchEvent[];
  possession?: [number, number]; // [home, away] eg [54, 46]
  shots?: [number, number];
  fouls?: [number, number];
  yellowCards?: [number, number];
  redCards?: [number, number];
}

export interface Standing {
  groupName: string;
  teams: {
    rank: number;
    teamName: string;
    flag: string;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    gf: number;
    ga: number;
    gd: number;
    pts: number;
  }[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}
