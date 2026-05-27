import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Terminal, ShieldAlert, Cpu, Activity } from "lucide-react";
import { useGetDashboardStats } from "@workspace/api-client-react";
import { CyberSpinner } from "@/components/ui/cyber-spinner";

function Dashboard() {
  const { data: stats, isLoading } = useGetDashboardStats();

  if (isLoading) return <CyberSpinner />;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6 w-full h-full"
    >
      <h1 className="text-3xl font-display text-primary border-b border-primary/30 pb-4 inline-block glow-text-primary uppercase tracking-widest">
        المركز القيادي
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
        {[
          { label: "المستخدمين المتصلين", value: stats?.onlineUsers, color: "text-green-400", border: "border-green-500/30" },
          { label: "إجمالي الأعضاء", value: stats?.totalUsers, color: "text-primary", border: "border-primary/30" },
          { label: "القنوات النشطة", value: stats?.totalRooms, color: "text-secondary", border: "border-secondary/30" },
          { label: "الرسائل المتبادلة", value: stats?.totalMessages, color: "text-accent", border: "border-accent/30" },
        ].map((stat, i) => (
          <div key={i} className={`p-6 border ${stat.border} bg-background/50 flex flex-col gap-2 relative overflow-hidden group hover:border-opacity-100 transition-colors duration-300`}>
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-current opacity-20 group-hover:opacity-100" style={{ color: stat.color }}></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-current opacity-20 group-hover:opacity-100" style={{ color: stat.color }}></div>
            <span className="text-sm font-mono text-muted-foreground uppercase">{stat.label}</span>
            <span className={`text-4xl font-display font-bold ${stat.color}`}>{stat.value?.toLocaleString() || "0"}</span>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4 flex-1 min-h-[300px]">
        <div className="lg:col-span-2 border border-primary/20 bg-background/50 p-6 relative">
           <h2 className="text-xl font-display text-primary mb-4 flex items-center gap-2">
             <Activity className="w-5 h-5" /> نشاط الشبكة
           </h2>
           <div className="h-full flex items-center justify-center border border-dashed border-primary/10">
             <span className="font-mono text-primary/30 animate-pulse">[ جاري تحليل البيانات ]</span>
           </div>
        </div>
        <div className="border border-secondary/20 bg-background/50 p-6 relative">
           <h2 className="text-xl font-display text-secondary mb-4 flex items-center gap-2">
             <ShieldAlert className="w-5 h-5" /> تنبيهات النظام
           </h2>
           <ul className="flex flex-col gap-3 font-mono text-sm">
             <li className="text-muted-foreground border-r-2 border-secondary/50 pr-3">تم رصد وصول جديد من الوحدة الفرعية 7</li>
             <li className="text-muted-foreground border-r-2 border-secondary/50 pr-3">تحديث بروتوكول التشفير مكتمل</li>
             <li className="text-secondary/70 border-r-2 border-secondary pr-3">مزامنة البيانات مع المركز الرئيسي جارية</li>
           </ul>
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const { isAuthenticated, loginAsGuest } = useAuth();
  const [, setLocation] = useLocation();

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] relative">
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <Cpu className="w-[80vw] h-[80vw] text-primary" />
      </div>
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full flex flex-col items-center text-center gap-8 relative z-10"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 bg-primary/10 border-2 border-primary flex items-center justify-center rounded-sm glow-primary mb-4 rotate-45">
            <span className="font-display font-bold text-5xl text-primary -rotate-45">N</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-primary tracking-widest glow-text-primary">
            NEXUS COMM
          </h1>
          <p className="text-xl text-primary/70 font-mono mt-2 uppercase tracking-widest border-b border-primary/30 pb-4">
            Secured Communication Protocol
          </p>
        </div>
        
        <p className="text-lg text-muted-foreground max-w-lg leading-relaxed mt-4">
          منصة التواصل من الجيل القادم. نظام مشفر، اتصالات فورية، وواجهة قيادة متقدمة للعمليات الحساسة.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 mt-8 w-full sm:w-auto">
          <Button 
            size="lg" 
            className="font-bold text-lg bg-primary hover:bg-primary/90 text-primary-foreground rounded-sm px-10 h-14 glow-primary"
            onClick={() => {
              loginAsGuest();
              setLocation("/chat");
            }}
          >
            دخول كضيف <Terminal className="ml-2 w-5 h-5 inline" />
          </Button>
        </div>
        
        <div className="mt-12 flex gap-8 font-mono text-xs text-primary/40 uppercase tracking-widest">
          <span>Status: Online</span>
          <span>Encryption: AES-256</span>
          <span>Nodes: Active</span>
        </div>
      </motion.div>
    </div>
  );
}
