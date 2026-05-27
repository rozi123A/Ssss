import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Hash, Users as UsersIcon, User, Search, Menu, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQueryClient } from "@tanstack/react-query";
import { CyberSpinner } from "@/components/ui/cyber-spinner";
import { CyberEmpty } from "@/components/ui/cyber-empty";
import { useListRooms, useGetRoomMessages, useSendMessage, useListUsers, getGetRoomMessagesQueryKey } from "@workspace/api-client-react";

export default function ChatPage() {
  const { user } = useAuth();
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [usersPanelOpen, setUsersPanelOpen] = useState(false);

  const { data: rooms, isLoading: isLoadingRooms } = useListRooms();
  const { data: users, isLoading: isLoadingUsers } = useListUsers();
  
  // Set default active room if none selected and rooms exist
  useEffect(() => {
    if (!activeRoomId && rooms && rooms.length > 0) {
      setActiveRoomId(rooms[0].id);
    }
  }, [rooms, activeRoomId]);

  return (
    <div className="flex h-[calc(100vh-6rem)] border border-primary/20 bg-background/50 rounded-sm overflow-hidden terminal-border relative">
      
      {/* Mobile overlays */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Left Sidebar - Rooms */}
      <AnimatePresence initial={false}>
        {(sidebarOpen || typeof window !== 'undefined' && window.innerWidth >= 768) && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="absolute md:relative z-50 h-full flex flex-col border-l border-primary/20 bg-card w-[300px] flex-shrink-0"
          >
            <div className="h-16 flex items-center justify-between px-4 border-b border-primary/20">
              <h2 className="font-display font-bold text-primary flex items-center gap-2">
                <Hash className="w-5 h-5" /> القنوات
              </h2>
              <Button variant="ghost" size="icon" className="md:hidden text-primary" onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="p-3 border-b border-primary/10">
              <div className="relative">
                <Search className="w-4 h-4 absolute right-3 top-3 text-primary/50" />
                <Input 
                  placeholder="بحث في القنوات..." 
                  className="bg-background/50 border-primary/30 text-primary pr-9 font-mono focus-visible:ring-primary/50 rounded-sm"
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              {isLoadingRooms ? (
                <div className="p-4"><CyberSpinner /></div>
              ) : rooms?.length === 0 ? (
                <div className="p-4"><CyberEmpty title="لا توجد قنوات" description="قم بإنشاء قناة جديدة للبدء" icon={Hash} /></div>
              ) : (
                <div className="p-2 flex flex-col gap-1">
                  {rooms?.map(room => (
                    <button
                      key={room.id}
                      onClick={() => { setActiveRoomId(room.id); setSidebarOpen(false); }}
                      className={`w-full text-right flex flex-col gap-1 p-3 rounded-sm transition-all duration-200 border-r-2 ${
                        activeRoomId === room.id 
                          ? 'bg-primary/10 border-primary text-primary glow-primary' 
                          : 'border-transparent text-muted-foreground hover:bg-primary/5 hover:text-primary'
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="font-bold font-display flex items-center gap-1">
                          <Hash className="w-4 h-4 opacity-50" /> {room.name}
                        </span>
                        <span className="text-xs font-mono opacity-50">{room.memberCount} عضو</span>
                      </div>
                      {room.description && (
                        <span className="text-xs opacity-70 truncate w-full">{room.description}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
            
            <div className="p-4 border-t border-primary/20">
              <Button className="w-full bg-primary/10 border border-primary text-primary hover:bg-primary hover:text-background rounded-sm font-bold gap-2 glow-primary transition-all">
                <Plus className="w-4 h-4" /> إنشاء قناة جديدة
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-background relative z-10 h-full">
        {activeRoomId ? (
          <ChatRoom roomId={activeRoomId} onOpenSidebar={() => setSidebarOpen(true)} onOpenUsers={() => setUsersPanelOpen(!usersPanelOpen)} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <CyberEmpty title="لا توجد قناة محددة" description="اختر قناة من القائمة الجانبية للبدء في المحادثة" />
          </div>
        )}
      </div>

      {/* Right Sidebar - Users */}
      <AnimatePresence>
        {usersPanelOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 250, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="absolute left-0 md:relative z-40 h-full flex flex-col border-r border-primary/20 bg-card w-[250px] flex-shrink-0"
          >
            <div className="h-16 flex items-center justify-between px-4 border-b border-primary/20">
              <h2 className="font-display font-bold text-secondary flex items-center gap-2">
                <UsersIcon className="w-5 h-5" /> المتصلون
              </h2>
              <Button variant="ghost" size="icon" className="md:hidden text-secondary" onClick={() => setUsersPanelOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <ScrollArea className="flex-1">
              {isLoadingUsers ? (
                <div className="p-4"><CyberSpinner /></div>
              ) : (
                <div className="p-4 flex flex-col gap-4">
                  {['online', 'away', 'offline'].map(status => {
                    const statusUsers = users?.filter(u => u.status === status) || [];
                    if (statusUsers.length === 0) return null;
                    
                    const statusColor = status === 'online' ? 'text-accent' : status === 'away' ? 'text-yellow-500' : 'text-muted-foreground';
                    const bgIndicator = status === 'online' ? 'bg-accent glow-accent' : status === 'away' ? 'bg-yellow-500' : 'bg-muted-foreground';
                    
                    return (
                      <div key={status} className="flex flex-col gap-2">
                        <span className={`text-xs font-mono uppercase tracking-widest ${statusColor} border-b border-current/20 pb-1 mb-1`}>
                          {status} — {statusUsers.length}
                        </span>
                        {statusUsers.map(u => (
                          <div key={u.id} className="flex items-center gap-3 group cursor-pointer hover:bg-white/5 p-1 rounded-sm transition-colors">
                            <div className="relative">
                              <Avatar className="w-8 h-8 rounded-sm border border-primary/30">
                                <AvatarImage src={u.avatarUrl || undefined} />
                                <AvatarFallback className="rounded-sm bg-background text-primary text-xs font-display">
                                  <User className="w-4 h-4" />
                                </AvatarFallback>
                              </Avatar>
                              <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-background ${bgIndicator}`} />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-bold text-primary truncate group-hover:text-primary group-hover:glow-text-primary transition-all">
                                {u.displayName || u.username}
                              </span>
                              <span className="text-[10px] text-muted-foreground font-mono truncate">{u.role}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChatRoom({ roomId, onOpenSidebar, onOpenUsers }: { roomId: number, onOpenSidebar: () => void, onOpenUsers: () => void }) {
  const { data: messages, isLoading } = useGetRoomMessages(roomId, { query: { enabled: !!roomId, queryKey: getGetRoomMessagesQueryKey(roomId) } });
  const queryClient = useQueryClient();
  const sendMessage = useSendMessage();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    sendMessage.mutate({ roomId, data: { content: input, type: "text" } } as any, {
      onSuccess: () => {
        setInput("");
        queryClient.invalidateQueries({ queryKey: getGetRoomMessagesQueryKey(roomId) });
      }
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="h-16 flex items-center justify-between px-4 border-b border-primary/20 bg-card/50">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="md:hidden text-primary" onClick={onOpenSidebar}>
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex flex-col">
            <span className="font-display font-bold text-primary glow-text-primary">القناة #{roomId}</span>
            <span className="text-xs text-primary/50 font-mono">اتصال آمن نشط</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-secondary hover:text-secondary hover:bg-secondary/10 glow-secondary border border-transparent hover:border-secondary/50 rounded-sm transition-all" onClick={onOpenUsers}>
          <UsersIcon className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4" ref={scrollRef}>
        {isLoading ? (
          <CyberSpinner />
        ) : messages?.length === 0 ? (
          <CyberEmpty title="لا توجد رسائل" description="كن أول من يرسل رسالة في هذه القناة" />
        ) : (
          messages?.map((msg, i) => {
            const isMe = msg.userId === user?.id;
            return (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={msg.id} 
                className={`flex flex-col max-w-[80%] ${isMe ? 'self-start' : 'self-end'} ${i > 0 && messages[i-1].userId === msg.userId ? 'mt-1' : 'mt-4'}`}
              >
                {(i === 0 || messages[i-1].userId !== msg.userId) && (
                  <span className={`text-xs font-mono mb-1 ${isMe ? 'text-primary self-start' : 'text-secondary self-end'}`}>
                    {msg.user?.displayName || msg.user?.username || `User_${msg.userId}`}
                  </span>
                )}
                <div className={`p-3 rounded-sm ${
                  isMe 
                    ? 'bg-primary/10 border border-primary/30 text-primary-foreground rounded-tr-none glow-primary' 
                    : 'bg-secondary/10 border border-secondary/30 text-secondary-foreground rounded-tl-none glow-secondary'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap font-sans">{msg.content}</p>
                </div>
                <span className={`text-[10px] font-mono mt-1 opacity-50 ${isMe ? 'self-start' : 'self-end'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </motion.div>
            );
          })
        )}
      </div>

      <div className="p-4 border-t border-primary/20 bg-card/50">
        <form onSubmit={handleSend} className="flex gap-2 relative">
          <Input 
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="أدخل رسالتك هنا..." 
            className="bg-background/80 border-primary/50 focus-visible:ring-primary h-12 rounded-sm text-primary placeholder:text-primary/30 font-mono pr-4"
          />
          <Button type="submit" disabled={!input.trim() || sendMessage.isPending} className="h-12 w-12 rounded-sm bg-primary hover:bg-primary/90 text-background glow-primary flex-shrink-0">
            {sendMessage.isPending ? <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
