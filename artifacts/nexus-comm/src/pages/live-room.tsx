import { useRoute, Link } from "wouter";
import { useState, useEffect } from "react";
import { X, UserPlus, Gift, MessageCircle, Share2, Heart, ShieldAlert, ArrowRight } from "lucide-react";
import { useGetRoom, useJoinRoom } from "@workspace/api-client-react";
import { getGetRoomQueryKey } from "@workspace/api-client-react";

const STREAMER_IMAGES = [
  "/streamer-1.png",
  "/streamer-2.png",
  "/streamer-3.png",
  "/streamer-4.png",
];

interface ChatMsg {
  id: number;
  user: string;
  level: number;
  text: string;
  isGold?: boolean;
  color: string;
}

const MOCK_MESSAGES: ChatMsg[] = [
  { id: 1, user: "أحمد", level: 12, text: "مرحباً بالجميع! 👋", color: "text-blue-400" },
  { id: 2, user: "سارة", level: 45, text: "نظاراتك جميلة جداً", color: "text-pink-400" },
  { id: 3, user: "VIP_King", level: 99, text: "استمر، بث رائع!", isGold: true, color: "text-amber-400" },
  { id: 4, user: "Omar", level: 5, text: "أين أنت الآن؟", color: "text-green-400" },
];

export default function LiveRoomPage() {
  const [, params] = useRoute("/room/:id");
  const roomId = Number(params?.id) || 1;
  
  const { data: room, isLoading } = useGetRoom(roomId, {
    query: { enabled: !!roomId, queryKey: getGetRoomQueryKey(roomId) }
  });
  
  const joinRoomMutation = useJoinRoom();

  const [messages, setMessages] = useState<ChatMsg[]>([]);
  
  useEffect(() => {
    // Initial messages
    setMessages(MOCK_MESSAGES);
    
    // Simulate incoming messages
    const interval = setInterval(() => {
      const newMsg = {
        id: Date.now(),
        user: ["علي", "نورة", "خالد", "ليلى"][Math.floor(Math.random() * 4)],
        level: Math.floor(Math.random() * 50) + 1,
        text: ["إنه من أجل قطتك!", "ههههههه", "روعة", "ممكن تحية؟"][Math.floor(Math.random() * 4)],
        color: ["text-purple-400", "text-cyan-400", "text-emerald-400"][Math.floor(Math.random() * 3)],
      };
      setMessages(prev => [...prev.slice(-7), newMsg]); // Keep last 8 messages
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const image = STREAMER_IMAGES[(roomId - 1) % STREAMER_IMAGES.length] || STREAMER_IMAGES[0];
  const name = room?.name || "بث مباشر تفاعلي";
  const viewers = room?.memberCount || 174;
  const coins = "59,326";

  return (
    <div className="w-full h-full relative bg-black font-sans">
      {/* Background Video/Image */}
      <div className="absolute inset-0">
        <img src={image} alt="Live Stream" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none"></div>
      </div>

      {/* Top Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-start justify-between z-10">
        {/* Streamer Info */}
        <div className="bg-black/30 backdrop-blur-md rounded-full p-1 pl-3 pr-1 flex items-center gap-2 border border-white/10">
          <div className="relative">
            <img src={image} className="w-9 h-9 rounded-full border border-white object-cover" alt="Avatar" />
            <span className="absolute -bottom-1 -right-1 bg-red-500 text-white text-[8px] font-bold px-1 rounded-sm">LIVE</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white text-xs font-bold w-20 truncate">{name}</span>
            <span className="text-amber-400 text-[10px] font-bold">🪙 {coins}</span>
          </div>
          <button className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-full w-8 h-8 flex items-center justify-center text-white ml-1 shadow-lg shadow-purple-500/30">
            <UserPlus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col items-end gap-2">
          {/* Close & Viewers */}
          <div className="flex items-center gap-3">
            <div className="bg-black/30 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1 border border-white/10">
              <span>👁️</span>
              <span className="text-white text-xs font-bold">{viewers}</span>
            </div>
            <Link href="/">
              <button className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-white/20 transition">
                <X className="w-5 h-5" />
              </button>
            </Link>
          </div>

          {/* Level Badge */}
          <div className="bg-gradient-to-r from-slate-300 to-slate-400 rounded-sm px-2 py-0.5 text-[10px] font-bold text-slate-900 shadow-sm border border-slate-200">
            SILVER LV.12
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="absolute bottom-20 left-4 right-20 flex flex-col justify-end h-64 overflow-hidden mask-chat z-10">
        <div className="flex flex-col gap-2">
          <div className="bg-blue-500/20 text-blue-200 text-xs p-2 rounded-xl rounded-bl-none border border-blue-500/30 backdrop-blur-sm self-start max-w-[80%] mb-2">
            ⚠️ تذكير: يرجى الحفاظ على بيئة آمنة واحترام الجميع في الدردشة.
          </div>
          
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`animate-in slide-in-from-bottom-2 fade-in duration-300 self-start max-w-[85%] px-3 py-1.5 rounded-xl rounded-bl-none backdrop-blur-sm border ${
                msg.isGold 
                  ? 'bg-gradient-to-r from-amber-500/30 to-yellow-600/30 border-amber-400/50 text-amber-100 shadow-[0_0_10px_rgba(251,191,36,0.2)]' 
                  : 'bg-black/30 border-white/10 text-white'
              }`}
            >
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className={`text-[10px] font-bold px-1 rounded-sm ${msg.isGold ? 'bg-amber-400 text-black' : 'bg-white/20 text-white'}`}>
                  Lv.{msg.level}
                </span>
                <span className={`text-xs font-bold ${msg.color}`}>{msg.user}:</span>
                <span className="text-xs break-words">{msg.text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Toolbar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-6 flex items-center justify-between z-20 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10 relative">
            <MessageCircle className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">8</span>
          </button>
          
          <div className="h-10 bg-black/40 backdrop-blur-md rounded-full flex-1 flex items-center px-4 border border-white/10 text-white/50 text-sm">
            قل مرحباً...
          </div>
        </div>

        <div className="flex items-center gap-3 mr-3">
          <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10">
            <Share2 className="w-5 h-5" />
          </button>
          
          <button className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/40 relative animate-bounce-subtle">
            <Gift className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Floating Hearts Animation (Static visual representation) */}
      <div className="absolute bottom-24 right-6 flex flex-col gap-4 pointer-events-none opacity-50">
        <Heart className="w-6 h-6 text-pink-500 fill-pink-500 animate-pulse" />
        <Heart className="w-4 h-4 text-purple-500 fill-purple-500 ml-4 animate-pulse delay-75" />
        <Heart className="w-5 h-5 text-blue-500 fill-blue-500 mr-2 animate-pulse delay-150" />
      </div>

      <style>{`
        .mask-chat {
          mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 100%);
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 100%);
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s infinite;
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}
