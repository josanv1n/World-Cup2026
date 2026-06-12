import { useState, useEffect } from 'react';
import { Copy, Check, Terminal, ExternalLink, Settings, Lightbulb, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export default function AppsScriptPortal() {
  const [appsScriptCode, setAppsScriptCode] = useState("");
  const [copying, setCopying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get GAS code from the API route
    fetch("/api/apps-script-code")
      .then(res => res.json())
      .then(data => {
        setAppsScriptCode(data.code || "");
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleCopy = () => {
    setCopying(true);
    navigator.clipboard.writeText(appsScriptCode);
    setTimeout(() => setCopying(false), 2000);
  };

  return (
    <div id="apps-script-portal-component" className="w-full flex flex-col gap-6">
      
      {/* Visual top guide cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-[#001233] p-4 rounded-xl border border-white/10 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Settings size={16} />
            <span className="font-display font-bold text-xs tracking-wider uppercase text-white">1. SETUP PROPERTI</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Buka menu <b>Project Settings (Gigi Roda)</b> di Google Apps Script Anda, dan tambahkan Properti Script dengan kunci:
            <code className="block mt-1 font-mono text-[10px] bg-[#020617] p-2 rounded border border-white/10 text-cyan-300">
              GEMINI_API_KEY = "AIzaSyCJz9U83yHm7AyzUPOyrhG4M0z48uMY5j0"
            </code>
          </p>
        </div>

        <div className="bg-[#001233] p-4 rounded-xl border border-white/10 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Terminal size={16} />
            <span className="font-display font-bold text-xs tracking-wider uppercase text-white">2. PASTE CODE.GS</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Salin seluruh blok kode luhur di bawah ini, gantikan seluruh isi file default editor bawaan Google dengan nama proyek Anda: <b>FIFA2026</b>.
            Pilih <code>Code.gs</code> lalu klik Simpan.
          </p>
        </div>

        <div className="bg-[#001233] p-4 rounded-xl border border-white/10 flex flex-col gap-1.5 shadow cyan-glow">
          <div className="flex items-center gap-1.5 text-pink-400">
            <Zap size={16} className="animate-bounce" />
            <span className="font-display font-bold text-xs tracking-wider uppercase text-white">3. PUBLIKASI API</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Klik <b>Deploy &gt; New Deployment</b>. Pilih tipe <b>Web App</b>. Jalankan sebagai: <b>"Me"</b>, Akses: <b>"Anyone"</b>. Deploy untuk menghasilkan endpoint JSON live piala dunia Anda!
          </p>
        </div>

      </div>

      {/* Editor Mock Component */}
      <div className="bg-[#050b1d] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Editor bar header */}
        <div className="bg-[#001233] px-4 py-3 flex items-center justify-between border-b border-white/10 select-none">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            <span className="ml-2 font-mono text-xs text-slate-400 font-bold flex items-center gap-1">
              💻 FIFA2026 / Code.gs (Google Apps Script Engine)
            </span>
          </div>

          <button
            id="copy-apps-script-code-btn"
            onClick={handleCopy}
            className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-400 to-blue-600 hover:opacity-95 text-slate-950 font-black tracking-tight rounded-lg text-xs flex items-center gap-1.5 transition-colors focus:outline-none uppercase"
          >
            {copying ? (
              <>
                <Check size={12} className="text-slate-950 stroke-[3px]" />
                Kode Berhasil Disalin!
              </>
            ) : (
              <>
                <Copy size={12} />
                Salin Kode Script
              </>
            )}
          </button>
        </div>

        {/* Code body panel */}
        <div className="p-4 overflow-x-auto bg-[#020617] text-slate-300 font-mono text-[11px] md:text-xs leading-relaxed max-h-[400px] overflow-y-auto scrollbar-thin">
          {loading ? (
            <div className="py-24 text-center text-slate-500 animate-pulse flex flex-col items-center gap-1">
              <span>🔄 Loading Code.GS modules...</span>
            </div>
          ) : (
            <pre className="text-slate-300">
              <code>{appsScriptCode}</code>
            </pre>
          )}
        </div>

        <div className="bg-[#001233] px-4 py-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-white/10">
          <span>Google Workspace & Apps Script Integration Module V1.0</span>
          <span className="flex items-center gap-1">
            Bahasa Pemrograman: <span className="text-cyan-400 font-bold">JavaScript / Google Script (GAS)</span>
          </span>
        </div>

      </div>

      {/* Pro Tip Alert */}
      <div className="bg-[#051310] border border-emerald-900 p-4 rounded-xl flex items-start gap-3">
        <Lightbulb className="text-teal-400 flex-shrink-0 animate-pulse mt-0.5" size={18} />
        <div className="text-xs text-slate-400 leading-relaxed">
          <span className="text-teal-300 font-bold block mb-0.5">💡 PRO TIPS UNTUK INTEGRASI VERCEL ATAU REPOSITORY GITHUB:</span>
          Anda dapat menyimpan kode Apps Script ini di dalam berkas terpisah bernama `Code.gs` di root repository Github Anda. Setelah dideploy di Vercel, Anda juga dapat memicu skrip ini untuk mengirimkan notifikasi gol otomatis Piala Dunia ke Webhook Discord, Telegram, ataupun Google Chat Anda secara seketika!
        </div>
      </div>

    </div>
  );
}
