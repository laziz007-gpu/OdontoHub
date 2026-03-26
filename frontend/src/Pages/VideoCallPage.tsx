import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Video, VideoOff, Mic, MicOff, PhoneOff, MessageSquare, Copy, Check, X } from "lucide-react";

const VideoCallPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const videoRef = useRef<HTMLVideoElement>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [showChat, setShowChat] = useState(false);
    const [chatMessage, setChatMessage] = useState("");
    const [messages, setMessages] = useState<{ text: string; from: "me" | "them"; time: string }[]>([]);
    const [linkCopied, setLinkCopied] = useState(false);
    const [showLinkModal, setShowLinkModal] = useState(false);

    const participant = location.state?.participant || { name: "Доктор", role: "dentist" };
    const appointmentId = location.state?.appointmentId;
    const roomId = appointmentId ? `odonto-${appointmentId}` : `odonto-${Math.random().toString(36).slice(2, 8)}`;
    const callLink = `${window.location.origin}/video-call?room=${roomId}`;

    useEffect(() => {
        startCamera();
        const timer = setInterval(() => setCallDuration(prev => prev + 1), 1000);
        return () => { clearInterval(timer); stopCamera(); };
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (error) {
            console.error("Camera error:", error);
        }
    };

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
        }
    };

    const formatDuration = (s: number) =>
        `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

    const handleEndCall = () => { stopCamera(); navigate(-1); };

    const toggleMute = () => {
        setIsMuted(prev => {
            if (videoRef.current?.srcObject)
                (videoRef.current.srcObject as MediaStream).getAudioTracks().forEach(t => (t.enabled = prev));
            return !prev;
        });
    };

    const toggleVideo = () => {
        setIsVideoOff(prev => {
            if (videoRef.current?.srcObject)
                (videoRef.current.srcObject as MediaStream).getVideoTracks().forEach(t => (t.enabled = prev));
            return !prev;
        });
    };

    const sendMessage = () => {
        if (!chatMessage.trim()) return;
        const now = new Date();
        const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
        setMessages(prev => [...prev, { text: chatMessage.trim(), from: "me", time }]);
        setChatMessage("");
    };

    const copyLink = () => {
        navigator.clipboard.writeText(callLink);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2500);
    };

    return (
        <div className="fixed inset-0 bg-gray-900 flex flex-col select-none">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/60 to-transparent p-5">
                <div className="flex items-center justify-between text-white">
                    <div>
                        <h2 className="text-xl font-bold">{participant.name}</h2>
                        <p className="text-sm text-white/60">{formatDuration(callDuration)}</p>
                    </div>
                    <button
                        onClick={() => setShowLinkModal(true)}
                        className="flex items-center gap-2 bg-white/15 hover:bg-white/25 px-4 py-2 rounded-full text-sm font-semibold transition-all"
                    >
                        <Copy size={16} />
                        Пригласить
                    </button>
                </div>
            </div>

            {/* Remote video placeholder */}
            <div className="flex-1 relative bg-gray-800 flex items-center justify-center">
                <div className="text-center text-white">
                    <div className="w-28 h-28 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-5xl font-bold shadow-2xl">
                        {participant.name.charAt(0)}
                    </div>
                    <p className="text-xl font-semibold">{participant.name}</p>
                    <p className="text-sm text-white/50 mt-2 animate-pulse">Ожидание подключения...</p>
                </div>
            </div>

            {/* Local video */}
            <div className="absolute top-20 right-4 w-28 h-36 sm:w-36 sm:h-48 bg-gray-700 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
                <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${isVideoOff ? "hidden" : ""}`} />
                {isVideoOff && (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white text-center">
                        <div>
                            <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-1 text-lg font-bold">Я</div>
                            <p className="text-[10px] opacity-60">Камера выкл</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pb-8 pt-12">
                <div className="flex items-center justify-center gap-4">
                    <button onClick={toggleMute} className={`p-4 rounded-full transition-all ${isMuted ? "bg-red-600 hover:bg-red-700" : "bg-white/20 hover:bg-white/30"}`}>
                        {isMuted ? <MicOff size={24} className="text-white" /> : <Mic size={24} className="text-white" />}
                    </button>
                    <button onClick={toggleVideo} className={`p-4 rounded-full transition-all ${isVideoOff ? "bg-red-600 hover:bg-red-700" : "bg-white/20 hover:bg-white/30"}`}>
                        {isVideoOff ? <VideoOff size={24} className="text-white" /> : <Video size={24} className="text-white" />}
                    </button>
                    <button onClick={handleEndCall} className="p-5 bg-red-600 hover:bg-red-700 rounded-full transition-all shadow-lg shadow-red-500/40">
                        <PhoneOff size={28} className="text-white" />
                    </button>
                    <button onClick={() => setShowChat(!showChat)} className={`p-4 rounded-full transition-all relative ${showChat ? "bg-blue-600 hover:bg-blue-700" : "bg-white/20 hover:bg-white/30"}`}>
                        <MessageSquare size={24} className="text-white" />
                        {messages.length > 0 && !showChat && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                                {messages.length}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Chat Panel */}
            {showChat && (
                <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl flex flex-col z-20">
                    <div className="flex items-center justify-between px-5 py-4 border-b">
                        <h3 className="text-lg font-bold text-gray-900">Чат</h3>
                        <button onClick={() => setShowChat(false)} className="p-1 hover:bg-gray-100 rounded-full">
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.length === 0 ? (
                            <p className="text-center text-gray-400 text-sm mt-8">Нет сообщений</p>
                        ) : (
                            messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm font-medium ${msg.from === "me" ? "bg-blue-600 text-white rounded-br-sm" : "bg-gray-100 text-gray-900 rounded-bl-sm"}`}>
                                        <p>{msg.text}</p>
                                        <p className={`text-[10px] mt-1 ${msg.from === "me" ? "text-white/60" : "text-gray-400"}`}>{msg.time}</p>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={chatEndRef} />
                    </div>
                    <div className="p-4 border-t flex gap-2">
                        <input
                            type="text"
                            value={chatMessage}
                            onChange={e => setChatMessage(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && sendMessage()}
                            placeholder="Введите сообщение..."
                            className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button onClick={sendMessage} className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all">
                            →
                        </button>
                    </div>
                </div>
            )}

            {/* Invite Link Modal */}
            {showLinkModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
                        <h3 className="text-2xl font-black text-gray-900 mb-2">Пригласить на консультацию</h3>
                        <p className="text-gray-500 text-sm mb-6">Отправьте эту ссылку для подключения к звонку</p>
                        <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3 border border-gray-200 mb-6">
                            <p className="flex-1 text-sm text-gray-700 font-medium break-all">{callLink}</p>
                            <button
                                onClick={copyLink}
                                className={`shrink-0 p-2 rounded-xl transition-all ${linkCopied ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600 hover:bg-blue-200"}`}
                            >
                                {linkCopied ? <Check size={20} /> : <Copy size={20} />}
                            </button>
                        </div>
                        {appointmentId && (
                            <p className="text-xs text-gray-400 text-center mb-4">Комната: {roomId}</p>
                        )}
                        <button onClick={() => setShowLinkModal(false)} className="w-full py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all">
                            Закрыть
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoCallPage;
