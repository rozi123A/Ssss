import { useEffect, useRef, useState, useCallback } from 'react';

interface WebRTCConfig {
  iceServers?: RTCIceServer[];
  onLocalStream?: (stream: MediaStream) => void;
  onRemoteStream?: (stream: MediaStream) => void;
  onConnectionStateChange?: (state: RTCPeerConnectionState) => void;
  onIceCandidate?: (candidate: RTCIceCandidate) => void;
}

export function useWebRTC(config: WebRTCConfig = {}) {
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>('new');

  const initializePeerConnection = useCallback(async () => {
    try {
      const iceServers = config.iceServers || [
        { urls: ['stun:stun.l.google.com:19302'] },
        { urls: ['stun:stun1.l.google.com:19302'] },
      ];

      const peerConnection = new RTCPeerConnection({ iceServers });

      peerConnection.onconnectionstatechange = () => {
        setConnectionState(peerConnection.connectionState);
        config.onConnectionStateChange?.(peerConnection.connectionState);
        if (peerConnection.connectionState === 'connected') {
          setIsConnected(true);
        } else if (peerConnection.connectionState === 'disconnected' || peerConnection.connectionState === 'failed') {
          setIsConnected(false);
        }
      };

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          config.onIceCandidate?.(event.candidate);
        }
      };

      peerConnection.ontrack = (event) => {
        if (remoteStreamRef.current) {
          event.streams[0].getTracks().forEach((track) => {
            remoteStreamRef.current?.addTrack(track);
          });
        } else {
          remoteStreamRef.current = event.streams[0];
          config.onRemoteStream?.(event.streams[0]);
        }
      };

      peerConnectionRef.current = peerConnection;
    } catch (error) {
      console.error('خطأ في تهيئة الاتصال:', error);
      throw error;
    }
  }, [config]);

  const getLocalStream = useCallback(async (constraints?: MediaStreamConstraints) => {
    try {
      const defaultConstraints: MediaStreamConstraints = {
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints || defaultConstraints);
      localStreamRef.current = stream;
      config.onLocalStream?.(stream);

      if (peerConnectionRef.current) {
        stream.getTracks().forEach((track) => {
          peerConnectionRef.current?.addTrack(track, stream);
        });
      }

      return stream;
    } catch (error) {
      console.error('خطأ في الحصول على تدفق الوسائط:', error);
      throw error;
    }
  }, [config]);

  const createOffer = useCallback(async () => {
    if (!peerConnectionRef.current) throw new Error('الاتصال لم يتم تهيئته');
    try {
      const offer = await peerConnectionRef.current.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await peerConnectionRef.current.setLocalDescription(offer);
      return offer;
    } catch (error) {
      console.error('خطأ في إنشاء العرض:', error);
      throw error;
    }
  }, []);

  const createAnswer = useCallback(async (offer: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current) throw new Error('الاتصال لم يتم تهيئته');
    try {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      return answer;
    } catch (error) {
      console.error('خطأ في إنشاء الإجابة:', error);
      throw error;
    }
  }, []);

  const setRemoteAnswer = useCallback(async (answer: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current) throw new Error('الاتصال لم يتم تهيئته');
    try {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
      console.error('خطأ في تعيين الإجابة:', error);
    }
  }, []);

  const addIceCandidate = useCallback(async (candidate: RTCIceCandidateInit) => {
    if (!peerConnectionRef.current) throw new Error('الاتصال لم يتم تهيئته');
    try {
      await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('خطأ في إضافة المرشح:', error);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  }, [isVideoEnabled]);

  const closeConnection = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach((track) => track.stop());
      remoteStreamRef.current = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    setIsConnected(false);
    setConnectionState('closed');
  }, []);

  useEffect(() => {
    return () => {
      closeConnection();
    };
  }, [closeConnection]);

  return {
    peerConnectionRef,
    localStreamRef,
    remoteStreamRef,
    isConnected,
    isMuted,
    isVideoEnabled,
    connectionState,
    initializePeerConnection,
    getLocalStream,
    createOffer,
    createAnswer,
    setRemoteAnswer,
    addIceCandidate,
    toggleMute,
    toggleVideo,
    closeConnection,
  };
}
