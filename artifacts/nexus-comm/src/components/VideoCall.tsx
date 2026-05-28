import { useEffect, useRef, useState } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useWebRTC } from '@/hooks/useWebRTC';

interface VideoCallProps {
  remoteUserId?: string;
  remoteUserName?: string;
  onCallEnd?: () => void;
  onCallStart?: () => void;
}

export default function VideoCall({
  remoteUserId,
  remoteUserName = 'المستخدم الآخر',
  onCallEnd,
  onCallStart,
}: VideoCallProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [callStarted, setCallStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    isConnected,
    isMuted,
    isVideoEnabled,
    connectionState,
    initializePeerConnection,
    getLocalStream,
    toggleMute,
    toggleVideo,
    closeConnection,
  } = useWebRTC({
    onLocalStream: (stream) => {
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    },
    onRemoteStream: (stream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
    },
    onConnectionStateChange: (state) => {
      if (state === 'connected') {
        onCallStart?.();
      }
    },
  });

  const startCall = async () => {
    try {
      setError(null);
      await initializePeerConnection();
      await getLocalStream();
      setCallStarted(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ في بدء الاتصال';
      setError(errorMessage);
      console.error('خطأ في بدء الاتصال:', err);
    }
  };

  const endCall = () => {
    closeConnection();
    setCallStarted(false);
    onCallEnd?.();
  };

  useEffect(() => {
    return () => {
      if (callStarted) {
        closeConnection();
      }
    };
  }, [callStarted, closeConnection]);

  if (!callStarted) {
    return (
      <Card className="w-full max-w-md mx-auto bg-card border-2 border-neon-cyan p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold neon-glow neon-cyan mb-4">
            اتصال فيديو
          </h2>
          <p className="text-muted-foreground mb-6">
            اضغط على الزر أدناه لبدء اتصال فيديو
          </p>
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded mb-4">
              {error}
            </div>
          )}
          <Button
            onClick={startCall}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Phone className="w-4 h-4 mr-2" />
            بدء الاتصال
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* الفيديو المحلي والبعيد */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* الفيديو البعيد (الرئيسي) */}
        <div className="relative bg-black rounded-lg overflow-hidden border-2 border-neon-magenta">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-96 object-cover"
          />
          <div className="absolute bottom-4 left-4 text-white font-bold neon-glow neon-magenta">
            {remoteUserName}
          </div>
          {!isConnected && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-center">
                <p className="text-white neon-glow neon-cyan mb-2">جاري الاتصال...</p>
                <div className="animate-pulse">
                  <div className="w-12 h-12 border-4 border-neon-cyan border-t-neon-magenta rounded-full animate-spin mx-auto" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* الفيديو المحلي (الصغير) */}
        <div className="relative bg-black rounded-lg overflow-hidden border-2 border-neon-cyan">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-96 object-cover"
          />
          <div className="absolute bottom-4 left-4 text-white font-bold neon-glow neon-cyan">
            أنت
          </div>
          {!isVideoEnabled && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <VideoOff className="w-12 h-12 text-neon-cyan" />
            </div>
          )}
        </div>
      </div>

      {/* معلومات الاتصال */}
      <Card className="bg-card border-2 border-neon-cyan p-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">حالة الاتصال</p>
            <p className="text-neon-cyan font-bold">
              {connectionState === 'connected' ? '✓ متصل' : `جاري (${connectionState})`}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">الصوت</p>
            <p className={`font-bold ${isMuted ? 'text-red-500' : 'text-neon-green'}`}>
              {isMuted ? '🔇 مكتوم' : '🔊 مفعل'}
            </p>
          </div>
        </div>
      </Card>

      {/* أزرار التحكم */}
      <div className="flex gap-4 justify-center">
        <Button
          onClick={toggleMute}
          variant={isMuted ? 'destructive' : 'outline'}
          className={`${
            isMuted
              ? 'bg-red-500/20 border-red-500 hover:bg-red-500/30'
              : 'border-neon-cyan hover:bg-neon-cyan/10'
          }`}
        >
          {isMuted ? (
            <MicOff className="w-4 h-4 mr-2" />
          ) : (
            <Mic className="w-4 h-4 mr-2" />
          )}
          {isMuted ? 'إلغاء كتم الصوت' : 'كتم الصوت'}
        </Button>

        <Button
          onClick={toggleVideo}
          variant={!isVideoEnabled ? 'destructive' : 'outline'}
          className={`${
            !isVideoEnabled
              ? 'bg-red-500/20 border-red-500 hover:bg-red-500/30'
              : 'border-neon-cyan hover:bg-neon-cyan/10'
          }`}
        >
          {isVideoEnabled ? (
            <Video className="w-4 h-4 mr-2" />
          ) : (
            <VideoOff className="w-4 h-4 mr-2" />
          )}
          {isVideoEnabled ? 'إيقاف الفيديو' : 'تشغيل الفيديو'}
        </Button>

        <Button
          onClick={endCall}
          className="bg-red-500/20 border-2 border-red-500 text-red-400 hover:bg-red-500/30"
        >
          <PhoneOff className="w-4 h-4 mr-2" />
          إنهاء الاتصال
        </Button>
      </div>

      {/* رسالة الخطأ */}
      {error && (
        <Card className="bg-red-500/10 border-2 border-red-500 p-4">
          <p className="text-red-400 text-sm">⚠️ {error}</p>
        </Card>
      )}
    </div>
  );
}
