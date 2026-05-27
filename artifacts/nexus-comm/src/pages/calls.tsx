import { useListUsers, useInitiateCall } from "@workspace/api-client-react";
import { CyberSpinner } from "@/components/ui/cyber-spinner";
import { CyberEmpty } from "@/components/ui/cyber-empty";
import { Button } from "@/components/ui/button";
import { Phone, Video, PhoneCall, PhoneMissed, PhoneForwarded } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CallsPage() {
  const { data: users, isLoading } = useListUsers();
  const initiateCall = useInitiateCall();

  const handleCall = (userId: number, type: 'audio' | 'video') => {
    initiateCall.mutate({ data: { recipientId: userId, callType: type } });
  };

  // Mocking call history since there isn't a useListCalls hook provided in the prompt
  const callHistory = [
    { id: 1, type: 'audio', status: 'completed', duration: 120, user: users?.[0], date: new Date(Date.now() - 3600000) },
    { id: 2, type: 'video', status: 'missed', duration: null, user: users?.[1], date: new Date(Date.now() - 86400000) },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col lg:flex-row gap-6 h-full max-w-6xl mx-auto w-full"
    >
      <div className="flex-1 flex flex-col gap-6">
        <div className="border-b border-secondary/30 pb-4">
          <h1 className="text-3xl font-display text-secondary glow-text-secondary uppercase tracking-widest flex items-center gap-3">
            <Phone className="w-8 h-8" /> سجل الاتصالات
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto">
          {callHistory.length === 0 ? (
            <CyberEmpty title="لا توجد مكالمات" description="سجل الاتصالات فارغ" icon={Phone} />
          ) : (
            <div className="flex flex-col gap-3">
              {callHistory.map((call, i) => (
                <div key={call.id} className="border border-secondary/20 bg-background/50 p-4 flex items-center justify-between hover:bg-secondary/5 transition-colors rounded-sm">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-sm border ${call.status === 'missed' ? 'border-destructive text-destructive bg-destructive/10' : 'border-secondary/50 text-secondary bg-secondary/10'}`}>
                      {call.status === 'missed' ? <PhoneMissed className="w-5 h-5" /> : call.type === 'video' ? <Video className="w-5 h-5" /> : <PhoneForwarded className="w-5 h-5" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground font-display">{call.user?.displayName || call.user?.username || 'Unknown'}</span>
                      <span className="text-xs font-mono text-muted-foreground">{call.date.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {call.duration && <span className="text-xs font-mono text-secondary/70">{Math.floor(call.duration/60)}:{String(call.duration%60).padStart(2,'0')}</span>}
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="text-secondary hover:text-secondary hover:bg-secondary/20 rounded-sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="w-full lg:w-80 flex flex-col border border-primary/20 bg-card/50 rounded-sm p-4 terminal-border">
        <h2 className="text-xl font-display text-primary mb-4 flex items-center gap-2 border-b border-primary/20 pb-2">
          <PhoneCall className="w-5 h-5" /> جهات الاتصال
        </h2>
        
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <CyberSpinner />
          ) : (
            <div className="flex flex-col gap-2">
              {users?.map(u => (
                <div key={u.id} className="flex items-center justify-between p-2 hover:bg-primary/10 rounded-sm transition-colors group">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8 rounded-sm border border-primary/30">
                      <AvatarImage src={u.avatarUrl || undefined} />
                      <AvatarFallback className="rounded-sm bg-background text-primary text-xs font-display">N</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-bold text-foreground truncate max-w-[120px]">
                      {u.displayName || u.username}
                    </span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="w-8 h-8 text-primary hover:bg-primary/20 rounded-sm"
                      onClick={() => handleCall(u.id, 'audio')}
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="w-8 h-8 text-secondary hover:bg-secondary/20 rounded-sm"
                      onClick={() => handleCall(u.id, 'video')}
                    >
                      <Video className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
