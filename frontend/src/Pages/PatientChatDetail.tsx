import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import DentistImg from "../assets/img/photos/Dentist.png";
import ChatDetailHeader from "../components/PatientChatDetail/ChatDetailHeader";
import { sendMessage, getMessages, deleteMessage, editMessage } from "../api/chat";
import type { ChatMessage } from "../api/chat";
import MessageBubble from "../components/Chat/MessageBubble";
import { Send, Image } from "lucide-react";

const PatientChatDetail = () => {
    const { id } = useParams();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [attachedImage, setAttachedImage] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [sending, setSending] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const reconnectTimerRef = useRef<number | null>(null);

    const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
    const myUserId = Number(userData.id) || 0;

    const chatInfo = {
        id: Number(id),
        name: userData.role === 'patient' ? 'Shifokor' : 'Bemor',
        avatar: DentistImg,
    };

    useEffect(() => {
        if (!id) return;
        fetchMessages();

        const token = localStorage.getItem("access_token");
        if (!token) return;

        const apiBase = import.meta.env.VITE_API_URL || "http://localhost:8000";
        const apiUrl = new URL(apiBase);
        const wsProtocol = apiUrl.protocol === "https:" ? "wss:" : "ws:";
        const wsUrl = `${wsProtocol}//${apiUrl.host}/api/chat/ws?token=${encodeURIComponent(token)}`;
        let isUnmounted = false;

        const connect = () => {
            if (isUnmounted) return;
            const socket = new WebSocket(wsUrl);
            socketRef.current = socket;

            socket.onmessage = (event) => {
                const data: ChatMessage | { status?: string } = JSON.parse(event.data);
                if ("appointment_id" in data && data.appointment_id === Number(id)) {
                    setMessages((prev) => {
                        if (prev.some((m) => m.id === data.id)) return prev;
                        return [...prev, data];
                    });
                }
            };

            socket.onclose = () => {
                if (isUnmounted) return;
                reconnectTimerRef.current = window.setTimeout(connect, 1500);
            };

            socket.onerror = () => {
                socket.close();
            };
        };

        connect();

        return () => {
            isUnmounted = true;
            if (reconnectTimerRef.current) {
                window.clearTimeout(reconnectTimerRef.current);
            }
            if (socketRef.current) {
                socketRef.current.close();
            }
            socketRef.current = null;
        };
    }, [id]);

    // Chat ochilganda o'qildi deb belgilash
    useEffect(() => {
        if (!id) return;
        getMessages(Number(id)).then(msgs => {
            if (msgs.length > 0) {
                const readMap = JSON.parse(localStorage.getItem('chat_read') || '{}');
                readMap[Number(id)] = msgs[msgs.length - 1].id;
                localStorage.setItem('chat_read', JSON.stringify(readMap));
            }
        }).catch(() => {});
    }, [id]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const data = await getMessages(Number(id));
            setMessages(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (editingId) {
            if (!editText.trim()) return;
            await editMessage(editingId, editText).catch(() => {});
            setMessages(prev => prev.map(m => m.id === editingId ? { ...m, text: editText } : m));
            setEditingId(null); setEditText('');
            return;
        }
        if ((!message.trim() && !imagePreview) || !id) return;
        if (sending) return;
        setSending(true);
        try {
            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                socketRef.current.send(
                    JSON.stringify({
                        appointment_id: Number(id),
                        text: message,
                        image_data: imagePreview || undefined,
                    })
                );
                setMessage("");
                setImagePreview(null);
            } else {
                const sent = await sendMessage(Number(id), message, imagePreview || undefined);
                setMessages((prev) => [...prev, sent]);
                setMessage("");
                setImagePreview(null);
            }
        } catch {} finally {
            setSending(false);
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const handleDelete = async (msgId: number) => {
        await deleteMessage(msgId).catch(() => {});
        setMessages(prev => prev.filter(m => m.id !== msgId));
    };

    const handleEdit = (msgId: number, text: string) => {
        setEditingId(msgId);
        setEditText(text);
    };

    const formatTime = (dateStr: string) => {
        const utc = dateStr.endsWith('Z') || dateStr.includes('+') ? dateStr : dateStr + 'Z';
        return new Date(utc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="h-screen flex flex-col bg-gray-50 max-w-7xl mx-auto w-full">
            <ChatDetailHeader chatInfo={chatInfo} chatStatus="Online" />

            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-3">
                {loading && (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                    </div>
                )}
                {!loading && messages.length === 0 && (
                    <div className="text-center text-gray-400 py-10">Xabarlar yo'q. Birinchi xabar yuboring!</div>
                )}
                {messages.map(msg => (
                    <MessageBubble
                        key={msg.id}
                        id={msg.id}
                        text={msg.text}
                        image_data={msg.image_data}
                        time={formatTime(msg.created_at)}
                        isMe={msg.sender_id === myUserId}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                    />
                ))}
                <div ref={bottomRef} />
            </div>

            <div className="p-4 border-t border-gray-100">
                {editingId && (
                    <div className="mb-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2 text-sm text-blue-700 flex justify-between items-center">
                        <span>Tahrirlash</span>
                        <button onClick={() => { setEditingId(null); setEditText(''); }} className="text-blue-400">✕</button>
                    </div>
                )}
                {imagePreview && (
                    <div className="mb-2 relative inline-block">
                        <img src={imagePreview} alt="" className="h-20 rounded-xl object-cover" />
                        <button onClick={() => setImagePreview(null)} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">✕</button>
                    </div>
                )}
                <input type="file" accept="image/*" ref={fileRef} className="hidden" onChange={handleImageSelect} />
                <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                    <button type="button" onClick={() => fileRef.current?.click()} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-blue-500 transition-colors shrink-0">
                        <Image size={20} />
                    </button>
                    <input
                        type="text"
                        value={editingId ? editText : message}
                        onChange={e => editingId ? setEditText(e.target.value) : setMessage(e.target.value)}
                        placeholder={editingId ? "Tahrirlang..." : "Xabar yozing..."}
                        className="flex-1 bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <button
                        type="submit"
                    disabled={sending || (editingId ? !editText.trim() : (!message.trim() && !imagePreview))}
                        className="w-10 h-10 bg-[#5377f7] text-white rounded-xl flex items-center justify-center disabled:opacity-40 shrink-0"
                    >
                        <Send size={16} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PatientChatDetail;
