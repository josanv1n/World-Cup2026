import { Standing } from '../types';
import { motion } from 'motion/react';
import { Trophy, ShieldAlert, Award, Star } from 'lucide-react';

interface StandingsTableProps {
  standings: Standing[];
}

export default function StandingsTable({ standings }: StandingsTableProps) {
  return (
    <div id="standings-table-component" className="w-full flex flex-col gap-6">
      
      {/* Intro info panel */}
      <div className="bg-[#001233] p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row items-center gap-4 justify-between cyan-glow">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Trophy size={20} className="animate-pulse" />
          </div>
          <div>
            <h4 className="font-display font-black text-white text-sm sm:text-base tracking-tight select-none uppercase italic">
              KLASEMEN HIDUP PIALA DUNIA 2026 (LIVE STANDINGS)
            </h4>
            <p className="text-xs text-slate-400">
              Negara peringkat #1 dan #2 masing-masing grup otomatis lolos menuju Babak Gugur 32 Besar.
            </p>
          </div>
        </div>
        <div className="text-right text-[11px] font-mono text-cyan-400 font-bold bg-[#020617] p-2 rounded-lg border border-white/10">
          STATUS: 100% SINKRONISASI AKTIF
        </div>
      </div>

      {/* Grid of four 2026 groups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {standings.map((group, gIdx) => (
          <motion.div
            key={group.groupName}
            id={`group-table-card-${group.groupName}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gIdx * 0.1 }}
            className="bg-[#050b1d] p-4 rounded-2xl border border-white/10 shadow-xl relative overflow-hidden"
          >
            {/* Visual gradient backdrop */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-full pointer-events-none" />

            {/* League match group banner */}
            <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-3">
              <h5 className="font-display font-extrabold text-sm text-cyan-400 tracking-wider uppercase flex items-center gap-1.5 select-none italic font-black">
                <Award size={14} className="text-cyan-400" />
                {group.groupName} (Group stage)
              </h5>
              <span className="text-[10px] font-mono bg-white/5 text-slate-400 px-2 py-0.5 rounded">
                FIFA OFFICIAL
              </span>
            </div>

            {/* Main table header & body */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="text-[10px] font-mono text-slate-500 uppercase tracking-widest border-b border-white/10 pb-1.5">
                    <th className="py-1 px-1 text-center font-bold">Rk</th>
                    <th className="py-1 px-2 font-bold">Kesebelasan</th>
                    <th className="py-1 px-2 text-center font-bold">Mn</th>
                    <th className="py-1 px-1 text-center font-bold">M</th>
                    <th className="py-1 px-1 text-center font-bold">S</th>
                    <th className="py-1 px-1 text-center font-bold">K</th>
                    <th className="py-1 px-2 text-center font-bold">SG</th>
                    <th className="py-1 px-2 text-center font-bold text-cyan-400 font-black">Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {group.teams.map((team, tIdx) => {
                    const isQualified = team.rank <= 2;
                    const isIndonesia = team.teamName === "Indonesia";

                    return (
                      <motion.tr
                        key={team.teamName}
                        id={`team-row-${team.teamName}`}
                        whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.02)" }}
                        className={`transition-colors font-sans ${
                          isIndonesia ? 'bg-cyan-500/5 font-semibold text-cyan-400' : ''
                        }`}
                      >
                        {/* Position rank badge */}
                        <td className="py-2.5 px-1 text-center">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] mx-auto ${
                            tIdx === 0 
                              ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black cyan-glow shadow' 
                              : tIdx === 1 
                              ? 'bg-gradient-to-r from-pink-400 to-purple-600 text-white' 
                              : isQualified 
                              ? 'bg-cyan-950 text-cyan-400' 
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {team.rank}
                          </span>
                        </td>

                        {/* Country Name & Flag */}
                        <td className="py-2.5 px-2 font-medium">
                          <div className="flex items-center gap-2">
                            <span className="text-lg" role="img" aria-label={team.teamName}>
                              {team.flag}
                            </span>
                            <span className={`truncate text-xs ${isIndonesia ? 'text-cyan-400 font-bold' : 'text-slate-300'}`}>
                              {team.teamName}
                            </span>
                          </div>
                        </td>

                        {/* Played matches */}
                        <td className="py-2.5 px-2 text-center font-mono text-slate-455">
                          {team.played}
                        </td>

                        {/* Won matches */}
                        <td className="py-2.5 px-1 text-center font-mono text-slate-455">
                          {team.won}
                        </td>

                        {/* Drawn matches */}
                        <td className="py-2.5 px-1 text-center font-mono text-slate-455">
                          {team.drawn}
                        </td>

                        {/* Lost matches */}
                        <td className="py-2.5 px-1 text-center font-mono text-slate-455">
                          {team.lost}
                        </td>

                        {/* Goal difference */}
                        <td className={`py-2.5 px-2 text-center font-mono font-bold ${
                          team.gd > 0 ? 'text-cyan-400' : team.gd < 0 ? 'text-pink-400' : 'text-slate-400'
                        }`}>
                          {team.gd > 0 ? `+${team.gd}` : team.gd}
                        </td>

                        {/* Total Points */}
                        <td className="py-2.5 px-2 text-center font-mono text-sm font-black text-cyan-400">
                          {team.pts}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Qualification borders footnote indicator */}
            <div className="mt-3 flex gap-4 text-[9px] text-slate-500 uppercase tracking-tight font-mono select-none">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
                #1 - #2 Promosi 32 Besar piala dunia
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600 inline-block" />
                #3 - #4 Babak Gugur Tutup
              </span>
            </div>

          </motion.div>
        ))}
      </div>

    </div>
  );
}
