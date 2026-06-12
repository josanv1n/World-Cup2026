import { Match, Standing } from "./types";
import { initialMatches as JADWAL_MATCHES, calculateStandings } from "./Jadwal";

export const initialMatches: Match[] = JADWAL_MATCHES;

export const initialStandings: Standing[] = calculateStandings(JADWAL_MATCHES);

export const teamScorersFallback: Record<string, string[]> = {
  "Republik Korea": ["Hwang In-beom", "Son Heung-min", "Lee Kang-in", "Cho Gue-sung", "Hwang Hee-chan"],
  "Republik Ceko": ["P. Schick", "T. Souček", "J. Kuchta", "A. Barák", "V. Coufal"],
  "Swedia": ["A. Isak", "V. Gyökeres", "D. Kulusevski", "E. Forsberg", "J. Larsson"],
  "Kanada": ["Jonathan David", "Alphonso Davies", "Cyle Larin", "Tajon Buchanan"],
  "Belanda": ["Cody Gakpo", "Memphis Depay", "Xavi Simons", "Tijjani Reijnders", "Denzel Dumfries"],
  "Amerika Serikat": ["Christian Pulisic", "Folarin Balogun", "Timothy Weah", "Weston McKennie"],
  "Maroko": ["Hakim Ziyech", "Youssef En-Nesyri", "Achraf Hakimi", "Sofyan Amrabat"],
  "Jerman": ["Kai Havertz", "Jamal Musiala", "Florian Wirtz", "Niclas Füllkrug", "Serge Gnabry"],
  "Argentina": ["Lionel Messi", "Lautaro Martínez", "Julián Álvarez", "Alexis Mac Allister", "Enzo Fernández"],
  "Jepang": ["Kaoru Mitoma", "Takefusa Kubo", "Ayase Ueda", "Ritsu Doan", "Wataru Endo"],
  "Spanyol": ["Lamine Yamal", "Nico Williams", "Alvaro Morata", "Dani Olmo", "Pedri"],
  "Inggris": ["Harry Kane", "Jude Bellingham", "Bukayo Saka", "Phil Foden", "Cole Palmer"],
  "Prancis": ["Kylian Mbappé", "Antoine Griezmann", "Olivier Giroud", "Ousmane Dembélé"]
};
