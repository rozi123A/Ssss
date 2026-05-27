import { useListRooms, useCreateRoom, getListRoomsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation } from "wouter";
import { CyberSpinner } from "@/components/ui/cyber-spinner";
import { CyberEmpty } from "@/components/ui/cyber-empty";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Hash, Search, Plus, Lock, Users, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function RoomsPage() {
  const { data: rooms, isLoading } = useListRooms();
  const [searchTerm, setSearchTerm] = useState("");
  const [, setLocation] = useLocation();

  const filteredRooms = rooms?.filter(room => 
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (room.description && room.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6 h-full"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-primary/30 pb-4">
        <h1 className="text-3xl font-display text-primary glow-text-primary uppercase tracking-widest flex items-center gap-3">
          <Hash className="w-8 h-8" /> دليل القنوات
        </h1>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute right-3 top-3 text-primary/50" />
            <Input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="بحث في الشبكة..." 
              className="bg-background/50 border-primary/30 text-primary pr-9 font-mono focus-visible:ring-primary/50 rounded-sm"
            />
          </div>
          <CreateRoomDialog />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-4">
        {isLoading ? (
          <CyberSpinner />
        ) : filteredRooms?.length === 0 ? (
          <CyberEmpty title="لا توجد قنوات" description="لم يتم العثور على قنوات تطابق بحثك" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRooms?.map((room, i) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                key={room.id}
                className="border border-primary/20 bg-card/50 p-5 flex flex-col gap-3 relative overflow-hidden group hover:border-primary/60 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full -z-10 group-hover:bg-primary/10 transition-colors" />
                
                <div className="flex justify-between items-start">
                  <h3 className="font-display font-bold text-lg text-primary flex items-center gap-2">
                    {room.isPrivate ? <Lock className="w-4 h-4 text-destructive" /> : <Hash className="w-4 h-4" />}
                    {room.name}
                  </h3>
                  <span className="flex items-center gap-1 text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded-sm border border-primary/20">
                    <Users className="w-3 h-3" /> {room.memberCount}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground min-h-[40px]">
                  {room.description || "لا يوجد وصف لهذه القناة."}
                </p>
                
                <div className="pt-3 border-t border-primary/10 flex justify-between items-center mt-auto">
                  <span className="text-[10px] font-mono text-primary/40 uppercase">ID: {room.id.toString().padStart(4, '0')}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setLocation(`/chat`)}
                    className="text-primary hover:text-primary-foreground hover:bg-primary rounded-sm gap-2 glow-primary h-8"
                  >
                    دخول <ArrowLeft className="w-3 h-3" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function CreateRoomDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const createRoom = useCreateRoom();
  const queryClient = useQueryClient();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    createRoom.mutate({
      data: { name, description }
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListRoomsQueryKey() });
        setOpen(false);
        setName("");
        setDescription("");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary/20 border border-primary text-primary hover:bg-primary hover:text-background rounded-sm font-bold gap-2 glow-primary transition-all whitespace-nowrap">
          <Plus className="w-4 h-4" /> إنشاء قناة
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-primary/50 text-foreground terminal-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-primary glow-text-primary uppercase tracking-widest text-xl">تهيئة قناة جديدة</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreate} className="flex flex-col gap-4 mt-4">
          <div className="space-y-2">
            <label className="text-xs font-mono text-primary uppercase">معرف القناة (الاسم)</label>
            <Input 
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="مثال: operations-alpha" 
              className="bg-background/80 border-primary/50 focus-visible:ring-primary rounded-sm text-primary font-mono"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-primary uppercase">وصف المهمة (اختياري)</label>
            <Input 
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="تحديد الغرض من هذه القناة..." 
              className="bg-background/80 border-primary/50 focus-visible:ring-primary rounded-sm text-primary font-mono"
            />
          </div>
          <Button 
            type="submit" 
            disabled={!name.trim() || createRoom.isPending} 
            className="w-full mt-4 bg-primary hover:bg-primary/90 text-background glow-primary font-bold rounded-sm"
          >
            {createRoom.isPending ? "جاري الإنشاء..." : "تأكيد وبدء البث"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
