import { useState, useEffect, useRef } from 'react';
import { Search, Send, ArrowLeft, MessageCircle, Image } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMyAppointments } from '../api/appointments';
import { sendMessage, getMessages, deleteMessage, editMessage } from '../api/chat';
import type { ChatMessage } from '../api/chat';
import DentistImg from '../assets/img/photos/Dentist.png';
import { paths } from '../Routes/path';
import MessageBubble from '../components/Chat/MessageBubble';

export default function Chats() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [sending, setSending] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);
    const [chatPreviews, setChatPreviews] = useState<Record<number, { last: string; time: string; unread: number }>>({});
    const bottomRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const reconnectTimerRef = useRef<number | null>(null);

    const { data: appointments = [] } = useMyAppointments();
    const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
    const myUserId = Number(userData.id) || 0;

    const chatMap = new Map<number, typeof appointments[0]>();
    appointments.filter(a => a.status !== 'cancelled').forEach(a => {
        const existing = chatMap.get(a.patient_id);
        if (!existing || new Date(a.start_time) > new Date(existing.start_time)) {
            chatMap.set(a.patient_id, a);
        }
    });
    const chats = Array.from(chatMap.values())
        .filter(a => (a.patient_name || '').toLowerCase().includes(searchQuery.toLowerCase()));

    const activeApt = id ? appointments.find(a => a.id === Number(id)) : null;

    const formatTime = (dateStr: string) => {
        const utc = dateStr.endsWith('Z') || dateStr.includes('+') ? dateStr : dateStr + 'Z';
        return new Date(utc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    useEffect(() => {
        if (chats.length === 0) return;
        const readMap: Record<number, number> = JSON.parse(localStorage.getItem('chat_read') || '{}');
        chats.forEach(async apt => {
            try {
                const msgs = await getMessages(apt.id);
                const last = msgs[msgs.length - 1];
                const lastReadId = readMap[apt.id] || 0;
                const unread = last && last.sender_id !== myUserId && last.id > lastReadId ? 1 : 0;
                setChatPreviews(prev => ({
                    ...prev,
                    [apt.id]: {
                        last: last ? last.text || '📷 Rasm' : '',
                        time: last ? formatTime(last.created_at) : '',
                        unread,
                    }
                }));
            } catch {}
        });
    }, [JSON.stringify(chats.map(c => c.id))]);

    useEffect(() => {
        if (!id) return;
        setMessages([]);
        fetchMessages();

        const token = localStorage.getItem('access_token');
        if (!token) return;

        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const apiUrl = new URL(apiBase);
        const wsProtocol = apiUrl.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${wsProtocol}//${apiUrl.host}/api/chat/ws?token=${encodeURIComponent(token)}`;
        let isUnmounted = false;

        const connect = () => {
            if (isUnmounted) return;
            const socket = new WebSocket(wsUrl);
            socketRef.current = socket;

            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.appointment_id === Number(id)) {
                    setMessages(prev => {
                        if (prev.find(m => m.id === data.id)) return prev;
                        return [...prev, data];
                    });
                } else if (data.appointment_id && data.id) {
                    // Keep side-list previews fresh even when another chat is open.
                    setChatPreviews(prev => {
                        const current = prev[data.appointment_id];
                        return {
                            ...prev,
                            [data.appointment_id]: {
                                last: data.text || '📷 Rasm',
                                time: formatTime(data.created_at),
                                unread: (current?.unread || 0) + 1,
                            },
                        };
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
                setChatPreviews(prev => ({ ...prev, [Number(id)]: { ...prev[Number(id)], unread: 0 } }));
            }
        }).catch(() => {});
    }, [id]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchMessages = async () => {
        if (!id) return;
        try {
            const data = await getMessages(Number(id));
            setMessages(data);
        } catch {
            // Quick retry avoids stale UI when route changes during reconnect.
            setTimeout(async () => {
                try {
                    const retryData = await getMessages(Number(id));
                    setMessages(retryData);
                } catch {}
            }, 700);
        }
    };

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (editingId) {
            if (!editText.trim()) return;
            await editMessage(editingId, editText).catch(() => {});
            setMessages(prev => prev.map(m => m.id === editingId ? { ...m, text: editText } : m));
            setEditingId(null); setEditText('');
            return;
        }
        if ((!newMessage.trim() && !imagePreview) || !id) return;
        if (sending) return;
        setSending(true);
        try {
            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                socketRef.current.send(JSON.stringify({
                    appointment_id: Number(id),
                    text: newMessage,
                    image_data: imagePreview || undefined
                }));
                // WS orqali yuborilganda xabar serverdan qaytib keladi va state'ga qo'shiladi
                setNewMessage('');
                setImagePreview(null);
            } else {
                // Fallback: Agar socket ulanmagan bo'lsa, HTTP orqali yuborish
                const sent = await sendMessage(Number(id), newMessage, imagePreview || undefined);
                setMessages(prev => [...prev, sent]);
                setNewMessage('');
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

    return (
        <div className="flex h-[calc(100vh-80px)] mt-[72px] md:mt-4 m-2 md:m-4 bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm">
            {/* Chat list */}
            <div className={`w-full lg:w-[320px] border-r border-gray-100 flex flex-col flex-shrink-0 ${id ? 'hidden lg:flex' : 'flex'}`}>
                <div className="p-4 border-b border-gray-100">
                    <h2 className="text-xl font-black text-gray-900 mb-3">Chatlar</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Qidirish..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-50 rounded-xl py-2.5 pl-9 pr-4 text-sm outline-none"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {chats.length === 0 && (
                        <div className="text-center text-gray-400 py-16 text-sm">Chatlar yo'q</div>
                    )}
                    {chats.map(apt => {
                        const preview = chatPreviews[apt.id];
                        return (
                            <div
                                key={apt.id}
                                onClick={() => {
                                const readMap = JSON.parse(localStorage.getItem('chat_read') || '{}');
                                getMessages(apt.id).then(msgs => {
                                    if (msgs.length > 0) {
                                        readMap[apt.id] = msgs[msgs.length - 1].id;
                                        localStorage.setItem('chat_read', JSON.stringify(readMap));
                                    }
                                }).catch(() => {});
                                setChatPreviews(prev => ({ ...prev, [apt.id]: { ...prev[apt.id], unread: 0 } }));
                                navigate(paths.chatDetail.replace(':id', String(apt.id)));
                            }}
                                className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50 ${Number(id) === apt.id ? 'bg-blue-50' : ''}`}
                            >
                                <img src={DentistImg} alt="" className="w-11 h-11 rounded-full object-cover shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline">
                                        <p className="font-bold text-gray-900 text-sm truncate">{apt.patient_name || 'Bemor'}</p>
                                        <span className="text-[10px] text-gray-400 shrink-0 ml-1">{preview?.time || ''}</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-0.5">
                                        <p className="text-xs text-gray-400 truncate">{preview?.last || apt.service || 'Qabul'}</p>
                                        {preview?.unread ? (
                                            <span className="ml-1 w-4 h-4 bg-[#5377f7] text-white text-[9px] font-black rounded-full flex items-center justify-center shrink-0">
                                                {preview.unread}
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Chat area */}
            <div className={`flex-1 flex flex-col ${!id ? 'hidden lg:flex' : 'flex'}`}>
                {activeApt ? (
                    <>
                        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                            <button onClick={() => navigate(paths.chats)} className="lg:hidden p-2 hover:bg-gray-50 rounded-xl">
                                <ArrowLeft size={20} />
                            </button>
                            <img src={DentistImg} alt="" className="w-10 h-10 rounded-full object-cover" />
                            <div>
                                <p className="font-bold text-gray-900">{activeApt.patient_name || 'Bemor'}</p>
                                <p className="text-xs text-gray-400">{activeApt.service}</p>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-3">
                            {messages.length === 0 && (
                                <div className="text-center text-gray-400 py-10 text-sm">Xabarlar yo'q</div>
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

                        <div className="p-4 border-t border-gray-100 relative">
                            {editingId && (
                                <div className="mb-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2 text-sm text-blue-700 flex justify-between items-center">
                                    <span>Tahrirlash</span>
                                    <button onClick={() => { setEditingId(null); setEditText(''); }}>✕</button>
                                </div>
                            )}
                            {imagePreview && (
                                <div className="mb-2 relative inline-block">
                                    <img src={imagePreview} alt="" className="h-20 rounded-xl object-cover" />
                                    <button onClick={() => setImagePreview(null)} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">✕</button>
                                </div>
                            )}
                            <input type="file" accept="image/*" ref={fileRef} className="hidden" onChange={handleImageSelect} />
                            <form onSubmit={handleSend} className="flex gap-2">
                                <button type="button" onClick={() => fileRef.current?.click()} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-blue-500 transition-colors shrink-0">
                                    <Image size={20} />
                                </button>
                                <input
                                    type="text"
                                    value={editingId ? editText : newMessage}
                                    onChange={e => editingId ? setEditText(e.target.value) : setNewMessage(e.target.value)}
                                    placeholder={editingId ? "Tahrirlang..." : "Xabar yozing..."}
                                    className="flex-1 bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                                />
                                <button
                                    type="submit"
                                disabled={sending || (editingId ? !editText.trim() : (!newMessage.trim() && !imagePreview))}
                                    className="w-10 h-10 bg-[#5377f7] text-white rounded-xl flex items-center justify-center disabled:opacity-40 hover:bg-[#4156d9] transition-colors shrink-0"
                                >
                                    <Send size={16} />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
                        <MessageCircle size={48} className="opacity-20" />
                        <p className="font-medium">Chat tanlang</p>
                    </div>
                )}
            </div>
        </div>
    );
}
