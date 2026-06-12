import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, MessageSquare, RefreshCw, Trophy, Heart } from 'lucide-react';
import { ChatMessage, Match } from '../types';

interface BungBolaChatProps {
  currentMatch: Match | null;
}

export default function BungBolaChat({ currentMatch }: BungBolaChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "JEBREEET!!! Halo Bung! Saya Bung Bola, komentator sepak bola Piala Dunia paling heboh sejagat raya! 🎙️⚽\n\nLapangan hijau sedang membara, taktik sedang beradu! Ada pertandingan seru sedang berlangsung. Apakah Bung ingin menanyakan analisis taktis mendetail, ramalan juara grup, atau mengulas asis maut? Silakan tanyakan, saya jabarkan dengan tendangan geledek luhur!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Quick suggestion prompts
  const suggestions = [
    "Siapa saja pencetak gol laga Indonesia vs Belanda?",
    "Berikan komentar heboh laga Korea vs Republik Ceko!",
    "Siapa favorit juara FIFA World Cup 2026 menurut Bung?",
    "Ulas taktik formasi andalan Timnas Indonesia!"
  ];

  // Auto-scroll to bottom of chat
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (presetText?: string) => {
    const textToSend = presetText || input.trim();
    if (!textToSend || loading) return;

    if (!presetText) setInput("");

    const userMsg: ChatMessage = {
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          contextMatch: currentMatch
        })
      });

      if (!response.ok) {
        throw new Error("Gagal memanggil Bung Bola.");
      }

      const data = await response.json();
      const modelMsg: ChatMessage = {
        role: 'model',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch {
      // Fallback response inside the chat
      const fallbacks = [
        "AHAIII! Tendangan geledek dari user memotong sambungan transmisi radio satelit piala dunia, Bung! Mari kita terus kawal laga dengan stamina penuh berkobar-kobar!",
        "JEBREEET!!! Pertahanan server kami digempur serangan membabi buta dari suporter lawan! Sambil menunggu router pulih, mari kita nikmati asis manja di lapangan!",
        "Kiper kami terjatuh menyelamatkan gawang dari badai sinyal, Bung! Tapi mentalitas luhur juara piala dunia tak boleh padam! Tembak lagi pertanyaanmu!"
      ];
      const modelMsg: ChatMessage = {
        role: 'model',
        text: `[Sinyal Terganggu] ${fallbacks[Math.floor(Math.random() * fallbacks.length)]}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, modelMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div id="bung-bola-ai-chat-interface" className="w-full flex flex-col gap-4 bg-[#050b1d] border border-white/10 p-5 rounded-2xl shadow-2xl relative overflow-hidden backdrop-blur-md">
      
      {/* Visual background lights */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Ticker chat header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3 flex-wrap gap-2 select-none">
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-950 animate-pulse" />
            <span className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-pink-500 flex items-center justify-center text-xl shadow cyan-glow font-black">
              🎙️
            </span>
          </div>
          <div>
            <h4 className="font-display font-black text-white text-sm sm:text-base flex items-center gap-1.5 leading-tight uppercase italic">
              Bung Bola (AI Komentator)
              <Sparkles size={13} className="text-cyan-400 animate-spin" />
            </h4>
            <p className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
              SATELLITE LINK ACTIVE - GEMINI ENGINE V3.5
            </p>
          </div>
        </div>

        {/* Action clear trigger */}
        <button
          id="clear-chat-history-btn"
          onClick={() => setMessages(messages.slice(0, 1))}
          className="text-[10px] uppercase font-mono text-slate-500 hover:text-cyan-400 transition-colors focus:outline-none"
        >
          Bersihkan Obrolan ×
        </button>
      </div>

      {/* Middle Scroll Dialogues */}
      <div className="h-[300px] overflow-y-auto pr-1 flex flex-col gap-3 scrollbar-thin">
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <motion.div
              key={idx}
              id={`chat-msg-bubble-${idx}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col max-w-[85%] ${
                isUser ? 'self-end items-end' : 'self-start items-start'
              }`}
            >
              <div className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                isUser 
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold rounded-tr-sm cyan-glow' 
                  : 'bg-[#001233] text-slate-200 rounded-tl-sm border border-white/10'
              }`}>
                {/* Format line breaks inside message nicely */}
                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>
              <span className="text-[9px] text-slate-500 font-mono mt-1 px-1">
                {msg.timestamp}
              </span>
            </motion.div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="self-start flex flex-col gap-1 max-w-[80%]">
            <div className="p-3.5 bg-[#001233] border border-white/10 rounded-2xl rounded-tl-sm text-xs text-cyan-400 animate-pulse flex items-center gap-2">
              <RefreshCw size={11} className="animate-spin" />
              <span>Bung Bola sedang mengetik tanggapan seru...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Suggested Fast Prompts (Interactive chips) */}
      <div className="flex flex-col gap-1.5 pt-1.5 border-t border-white/5">
        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono font-bold select-none">
          💡 Pertanyaan Cepat :
        </span>
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((sug, sIdx) => (
            <button
              key={sIdx}
              id={`sug-chip-btn-${sIdx}`}
              disabled={loading}
              onClick={() => sendMessage(sug)}
              className="px-2.5 py-1 text-[10px] bg-[#020617] hover:bg-slate-800 disabled:opacity-50 text-slate-300 hover:text-white rounded-lg border border-white/10 transition-colors focus:outline-none text-left font-sans"
            >
              {sug}
            </button>
          ))}
        </div>
      </div>

      {/* Input row */}
      <div className="flex gap-2 mt-1">
        <input
          id="chat-user-input"
          type="text"
          placeholder="Tanyakan analisis piala dunia atau hasil pertandingan..."
          value={input}
          disabled={loading}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 bg-[#020617] border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-cyan-400/60 text-slate-200"
        />
        <button
          id="send-chat-message-btn"
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          className="p-2 sm:px-4 bg-gradient-to-r from-cyan-400 to-blue-600 hover:opacity-90 disabled:opacity-40 text-slate-950 font-black rounded-xl flex items-center justify-center gap-1 focus:outline-none transition-all uppercase tracking-wider"
        >
          <Send size={15} />
          <span className="hidden sm:inline text-xs font-black">Kirim</span>
        </button>
      </div>

    </div>
  );
}
