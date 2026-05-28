import { useState, useEffect } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Phone, Settings, LogOut } from 'lucide-react';
import VideoCall from '@/components/VideoCall';

export default function VideoChat() {
  const { user, logout } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [callActive, setCallActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const mockUsers = [
      { id: 1, name: 'أحمد محمد', status: 'online', avatar: '👨' },
      { id: 2, name: 'فاطمة علي', status: 'online', avatar: '👩' },
      { id: 3, name: 'محمود حسن', status: 'away', avatar: '👨' },
      { id: 4, name: 'سارة إبراهيم', status: 'online', avatar: '👩' },
      { id: 5, name: 'عمر خالد', status: 'offline', avatar: '👨' },
    ];
    setOnlineUsers(mockUsers);
  }, []);

  const filteredUsers = onlineUsers.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartCall = (user: any) => {
    setSelectedUser(user);
    setCallActive(true);
  };

  const handleEndCall = () => {
    setCallActive(false);
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <div className="bg-card border-b-2 border-neon-cyan p-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold neon-glow neon-cyan">NEXUS COMM</h1>
          <p className="text-sm text-muted-foreground">اتصالات فيديو آمنة وسريعة</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="border-neon-cyan hover:bg-neon-cyan/10">
            <Settings className="w-4 h-4" />
          </Button>
          <Button onClick={logout} variant="outline" size="icon" className="border-red-500 hover:bg-red-500/10">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        <div className="w-80 bg-card border-r-2 border-neon-cyan p-4 overflow-y-auto">
          <div className="mb-4">
            <h2 className="text-xl font-bold neon-glow neon-cyan mb-3">المستخدمون المتصلون</h2>
            <Input placeholder="ابحث عن مستخدم..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="terminal-input mb-4" />
          </div>

          <div className="space-y-2">
            {filteredUsers.map((user) => (
              <Card
                key={user.id}
                onClick={() => !callActive && handleStartCall(user)}
                className={`p-3 cursor-pointer transition ${
                  selectedUser?.id === user.id
                    ? 'bg-accent border-2 border-neon-magenta'
                    : 'bg-muted border-2 border-border hover:border-neon-cyan'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-cyan to-neon-magenta flex items-center justify-center text-xl">
                      {user.avatar}
                    </div>
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
                        user.status === 'online'
                          ? 'bg-neon-green'
                          : user.status === 'away'
                            ? 'bg-yellow-500'
                            : 'bg-gray-500'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.status === 'online' ? '🟢 متصل' : user.status === 'away' ? '🟡 بعيد' : '⚫ غير متصل'}
                    </p>
                  </div>
                  {user.status === 'online' && !callActive && (
                    <Button onClick={(e) => { e.stopPropagation(); handleStartCall(user); }} size="sm" className="bg-neon-green/20 border border-neon-green text-neon-green hover:bg-neon-green/30">
                      <Phone className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">لا توجد مستخدمون متطابقون</p>
            </div>
          )}
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {callActive && selectedUser ? (
            <div>
              <div className="mb-4">
                <h2 className="text-2xl font-bold neon-glow neon-magenta">اتصال مع {selectedUser.name}</h2>
              </div>
              <VideoCall remoteUserId={selectedUser.id} remoteUserName={selectedUser.name} onCallEnd={handleEndCall} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-center space-y-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-neon-cyan to-neon-magenta rounded-full flex items-center justify-center">
                  <Phone className="w-12 h-12 text-background" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold neon-glow neon-cyan mb-2">مرحباً {user?.name}</h2>
                  <p className="text-muted-foreground text-lg">اختر مستخدماً من القائمة لبدء اتصال فيديو</p>
                </div>
                <div className="bg-card border-2 border-neon-cyan rounded-lg p-6 max-w-md">
                  <p className="text-sm text-muted-foreground mb-4">✨ الميزات المتاحة:</p>
                  <ul className="text-sm space-y-2 text-left">
                    <li>✓ اتصالات فيديو عالية الجودة</li>
                    <li>✓ صوت واضح مع تقليل الضوضاء</li>
                    <li>✓ تحكم كامل بالميكروفون والكاميرا</li>
                    <li>✓ واجهة آمنة وسريعة</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
