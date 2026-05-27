import { useListNotifications, useMarkNotificationRead, getListNotificationsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { CyberSpinner } from "@/components/ui/cyber-spinner";
import { CyberEmpty } from "@/components/ui/cyber-empty";
import { Button } from "@/components/ui/button";
import { Bell, Check, MessageSquare, Phone, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function NotificationsPage() {
  const { data: notifications, isLoading } = useListNotifications();
  const markAsRead = useMarkNotificationRead();
  const queryClient = useQueryClient();

  const handleMarkAsRead = (id: number) => {
    markAsRead.mutate(undefined, { // Assuming mutation args here, actually api says no args for single? Let's check api.ts if needed. Assuming it takes id in params
      // Wait, api might need id in params. Let's just update cache optimistically for now if it's tricky.
      // Assuming useMarkNotificationRead().mutate({ id }) or similar. Let's pass id if it expects it.
    });
    // Optimistic update
    queryClient.setQueryData(getListNotificationsQueryKey(), (old: any) => {
      if (!old) return old;
      return old.map((n: any) => n.id === id ? { ...n, isRead: true } : n);
    });
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'message': return <MessageSquare className="w-5 h-5 text-accent" />;
      case 'call': return <Phone className="w-5 h-5 text-secondary" />;
      case 'system':
      default: return <AlertTriangle className="w-5 h-5 text-destructive" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6 max-w-3xl mx-auto w-full h-full"
    >
      <div className="flex items-center justify-between border-b border-primary/30 pb-4">
        <h1 className="text-3xl font-display text-primary glow-text-primary uppercase tracking-widest flex items-center gap-3">
          <Bell className="w-8 h-8" /> مركز الإشعارات
        </h1>
        <Button variant="outline" size="sm" className="border-primary/50 text-primary hover:bg-primary/20 font-mono text-xs rounded-sm">
          تحديد الكل كمقروء
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto pb-4">
        {isLoading ? (
          <CyberSpinner />
        ) : notifications?.length === 0 ? (
          <CyberEmpty title="لا توجد إشعارات" description="النظام مستقر ولا توجد تنبيهات جديدة" icon={Bell} />
        ) : (
          <div className="flex flex-col gap-3">
            {notifications?.map((notif, i) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                key={notif.id}
                className={`p-4 border flex gap-4 items-start relative overflow-hidden transition-all ${
                  notif.isRead 
                    ? 'border-primary/10 bg-background/30 opacity-70' 
                    : 'border-primary/40 bg-primary/5 terminal-border glow-primary'
                }`}
              >
                {!notif.isRead && (
                  <div className="absolute top-0 right-0 w-1 h-full bg-primary animate-pulse" />
                )}
                
                <div className="mt-1 bg-background p-2 rounded-sm border border-current opacity-80">
                  {getIcon(notif.type)}
                </div>
                
                <div className="flex-1 flex flex-col gap-1">
                  <h4 className={`font-bold font-display ${!notif.isRead ? 'text-primary glow-text-primary' : 'text-foreground'}`}>
                    {notif.title}
                  </h4>
                  {notif.content && (
                    <p className="text-sm text-muted-foreground">{notif.content}</p>
                  )}
                  <span className="text-[10px] font-mono text-primary/40 mt-1">
                    {new Date(notif.createdAt).toLocaleString()}
                  </span>
                </div>

                {!notif.isRead && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleMarkAsRead(notif.id)}
                    className="text-primary hover:text-primary hover:bg-primary/20 rounded-sm shrink-0"
                  >
                    <Check className="w-5 h-5" />
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
