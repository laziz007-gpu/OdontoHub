import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
    Video, 
    VideoOff, 
    Mic, 
    MicOff, 
    PhoneOff, 
    MessageSquare,
    Settings
} from "lucide-react";

const VideoCallPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const videoRef = useRef<HTMLVideoElement>(null);
    
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [showChat, setShowChat] = useState(false);
    
    // Get participant info from navigation state
    const participant = location.state?.participant || {
        name: "Доктор",
        role: "dentist"
    };

    useEffect(() => {
        // Start camera
        startCamera();
        
        // Start call timer
        const timer = setInterval(() => {
            setCallDuration(prev => prev + 1);
        }, 1000);

        return () => {
            clearInterval(timer);
            stopCamera();
        };
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: true, 
                audio: true 
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error("Error accessing camera:", error);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleEndCall = () => {
        stopCamera();
        navigate(-1);
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getAudioTracks().forEach(track => {
                track.enabled = isMuted;
            });
        }
    };

    const toggleVideo = () => {
        setIsVideoOff(!isVideoOff);
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getVideoTracks().forEach(track => {
                track.enabled = isVideoOff;
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 flex flex-col">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-6">
                <div className="flex items-center justify-between text-white">
                    <div>
                        <h2 className="text-xl font-bold">{participant.name}</h2>
                        <p className="text-sm text-white/70">{formatDuration(callDuration)}</p>
                    </div>
                    <button className="p-2 hover:bg-white/10 rounded-full transition">
                        <Settings size={24} />
                    </button>
                </div>
            </div>

            {/* Main Video (Remote) */}
            <div className="flex-1 relative bg-gray-800">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                        <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-5xl font-bold">
                                {participant.name.charAt(0)}
                            </span>
                        </div>
                        <p className="text-xl font-semibold">{participant.name}</p>
                        <p className="text-sm text-white/70 mt-2">Подключение...</p>
                    </div>
                </div>
            </div>

            {/* Local Video (Self) */}
            <div className="absolute top-24 right-6 w-32 h-40 sm:w-40 sm:h-52 bg-gray-700 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`}
                />
                {isVideoOff && (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                        <div className="text-center text-white">
                            <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                <span className="text-2xl font-bold">Я</span>
                            </div>
                            <p className="text-xs">Камера выкл</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <div className="flex items-center justify-center gap-4">
                    {/* Mute/Unmute */}
                    <button
                        onClick={toggleMute}
                        className={`p-4 rounded-full transition-all ${
                            isMuted 
                                ? 'bg-red-600 hover:bg-red-700' 
                                : 'bg-white/20 hover:bg-white/30'
                        }`}
                    >
                        {isMuted ? (
                            <MicOff size={24} className="text-white" />
                        ) : (
                            <Mic size={24} className="text-white" />
                        )}
                    </button>

                    {/* Video On/Off */}
                    <button
                        onClick={toggleVideo}
                        className={`p-4 rounded-full transition-all ${
                            isVideoOff 
                                ? 'bg-red-600 hover:bg-red-700' 
                                : 'bg-white/20 hover:bg-white/30'
                        }`}
                    >
                        {isVideoOff ? (
                            <VideoOff size={24} className="text-white" />
                        ) : (
                            <Video size={24} className="text-white" />
                        )}
                    </button>

                    {/* End Call */}
                    <button
                        onClick={handleEndCall}
                        className="p-4 bg-red-600 hover:bg-red-700 rounded-full transition-all"
                    >
                        <PhoneOff size={24} className="text-white" />
                    </button>

                    {/* Chat */}
                    <button
                        onClick={() => setShowChat(!showChat)}
                        className="p-4 bg-white/20 hover:bg-white/30 rounded-full transition-all"
                    >
                        <MessageSquare size={24} className="text-white" />
                    </button>
                </div>
            </div>

            {/* Chat Panel */}
            {showChat && (
                <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl p-4 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">Чат</h3>
                        <button
                            onClick={() => setShowChat(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto mb-4">
                        <p className="text-center text-gray-500 text-sm">
                            Нет сообщений
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Введите сообщение..."
                            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Отправить
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoCallPage;
