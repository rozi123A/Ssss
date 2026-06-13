import { useListRooms, useGetDashboardStats } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Bell, Search, Calendar, ChevronLeft, Flame, Compass, PlusCircle, Trophy, Users } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data to augment API rooms
const STREAMER_IMAGES = [
  "/streamer-1.png",
  "/streamer-2.png",
  "/streamer-3.png",
  "/streamer-4.png",
];

const MOCK_NAMES = ["حفلة موسيقى صوتي", "عنوان المرح الجديد", "سوالف ليل", "تحدي الأبطال"];

export default function Home() {
  const { data: rooms, isLoading } = useListRooms();
  const { data: stats } = useGetDashboardStats();

  return (
    <div className="flex flex-col h-full bg-background relative overflow-y-auto hide-scrollbar pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md pb-2 pt-4 px-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="text-white/90 hover:text-white transition">
              <Search className="w-6 h-6" />
            </button>
            <button className="text-white/90 hover:text-white transition relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-background"></span>
            </button>
          </div>
          <h1 className="text-xl font-bold italic tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 font-display">
            SUPERLIVE
          </h1>
          <div className="w-16"></div> {/* Spacer for balance */}
        </div>

        {/* Tabs */}
        <ScrollArea className="w-full mt-4" dir="rtl">
          <div className="flex items-center gap-6 px-2 pb-2">
            <button className="text-lg font-bold text-white relative">
              <span className="flex items-center gap-1"><Flame className="w-4 h-4 text-orange-500" fill="currentColor" /> مشهور</span>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-1 bg-white rounded-full"></span>
            </button>
            <button className="text-white/60 hover:text-white/90 font-medium whitespace-nowrap transition text-sm">
              اكتشف
            </button>
            <button className="text-white/60 hover:text-white/90 font-medium whitespace-nowrap transition text-sm">
              جديد
            </button>
            <button className="text-white/60 hover:text-white/90 font-medium whitespace-nowrap transition text-sm">
              معركة
            </button>
            <button className="text-white/60 hover:text-white/90 font-medium whitespace-nowrap transition text-sm">
              ضيف متعدد
            </button>
          </div>
          <ScrollBar orientation="horizontal" className="hidden" />
        </ScrollArea>
      </header>

      <div className="p-4 space-y-6">
        {/* Banner */}
        <div className="w-full h-24 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 relative overflow-hidden flex items-center justify-between px-6 shadow-lg shadow-purple-900/20">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
          <div className="relative z-10 flex flex-col justify-center">
            <span className="text-white font-bold text-lg">تقويم الفعاليات</span>
            <span className="text-white/80 text-sm">اكتشف أحدث المسابقات!</span>
          </div>
          <div className="relative z-10 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Live Grid */}
        <div>
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="aspect-[3/4] rounded-xl bg-white/5" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {(rooms?.length ? rooms : Array(8).fill(null)).map((room, i) => {
                const image = STREAMER_IMAGES[i % STREAMER_IMAGES.length];
                const name = room?.name || MOCK_NAMES[i % MOCK_NAMES.length];
                const viewers = room?.memberCount || Math.floor(Math.random() * 900) + 100;
                const coins = Math.floor(Math.random() * 50000) + 1000;
                const roomId = room?.id || (i + 1);

                return (
                  <Link key={i} href={`/room/${roomId}`}>
                    <div className="cursor-pointer group block aspect-[3/4] rounded-xl overflow-hidden relative shadow-md bg-zinc-900">
                      <img 
                        src={image} 
                        alt="Streamer" 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      
                      {/* Top Overlay */}
                      <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
                        <div className="bg-black/40 backdrop-blur-md rounded-full px-2 py-0.5 flex items-center gap-1 text-[10px] text-white">
                          <span>👁️</span>
                          <span className="font-bold">{viewers}</span>
                        </div>
                      </div>

                      {/* Bottom Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 pt-8 bg-gradient-to-t from-black/80 to-transparent">
                        <h3 className="text-white font-medium text-sm line-clamp-1 text-shadow-sm">{name}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-[10px] text-amber-400 font-bold bg-amber-400/20 px-1.5 py-0.5 rounded-sm flex items-center gap-0.5">
                            🪙 {coins.toLocaleString('en-US')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
