import { useNavigate } from "react-router-dom";
import DentistImg from "../assets/img/photos/Dentist.png";
import ChatHeader from "../components/PatientChats/ChatHeader";
import { useState, useEffect } from "react";
import { useMyAppointments } from "../api/appointments";
import { getMessages } from "../api/chat";
import type { ChatMessage } from "../api/chat";
import { paths } from "../Routes/path";

interface ChatPreview {
    aptId: number;
    dentistName: string;
    service: string;
    date: string;
    lastMessage: string;
    lastTime: string;
    unread: number;
}

const PatientChats = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const { data: appointments = [], isLoading } = useMyAppointments();
    const [previews, setPreviews] = useState<ChatPreview[]>([]);
    const myUserId = JSON.parse(localStorage.getItem('user_data') || '{}').id || 0;

    // Har bir doktor uchun bitta chat (eng oxirgi appointment)
    const chatMap = new Map<number, typeof appointments[0]>();
    appointments
        .filter(a => a.status !== 'cancelled')
        .forEach(a => {
            const existing = chatMap.get(a.dentist_id);
            if (!existing || new Date(a.start_time) > new Date(existing.start_time)) {
                chatMap.set(a.dentist_id, a);
            }
        });
    const uniqueChats = Array.from(chatMap.values());

    useEffect(() => {
        if (uniqueChats.length === 0) return;
        loadPreviews();
    }, [JSON.stringify(uniqueChats.map(c => c.id))]);

    const loadPreviews = async () => {
        const results: ChatPreview[] = [];
        const readMap: Record<number, number> = JSON.parse(localStorage.getItem('chat_read') || '{}');

        for (const apt of uniqueChats) {
            try {
                const msgs: ChatMessage[] = await getMessages(apt.id);
                const last = msgs[msgs.length - 1];
                const startDate = new Date(apt.start_time.endsWith('Z') ? apt.start_time : apt.start_time + 'Z');
                const lastId = last?.id || 0;
                const lastReadId = readMap[apt.id] || 0;
                const unread = last && last.sender_id !== myUserId && lastId > lastReadId ? 1 : 0;

                results.push({
                    aptId: apt.id,
                    dentistName: apt.dentist_name || 'Shifokor',
                    service: apt.service || 'Qabul',
                    date: startDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
                    lastMessage: last ? last.text || '📷 Rasm' : 'Xabar yo\'q',
                    lastTime: last ? formatTime(last.created_at) : '',
                    unread,
                });
            } catch {
                const startDate = new Date(apt.start_time.endsWith('Z') ? apt.start_time : apt.start_time + 'Z');
                results.push({
                    aptId: apt.id,
                    dentistName: apt.dentist_name || 'Shifokor',
                    service: apt.service || 'Qabul',
                    date: startDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
                    lastMessage: 'Xabar yo\'q',
                    lastTime: '',
                    unread: 0,
                });
            }
        }
        setPreviews(results);
    };

    const formatTime = (dateStr: string) => {
        const utc = dateStr.endsWith('Z') || dateStr.includes('+') ? dateStr : dateStr + 'Z';
        const d = new Date(utc);
        const now = new Date();
        if (d.toDateString() === now.toDateString()) {
            return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    };

    const filtered = previews.filter(p =>
        p.dentistName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen flex flex-col bg-gray-100/50 max-w-7xl mx-auto w-full">
            <ChatHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

            <div className="flex-1 px-4 py-6 space-y-3 pb-32">
                {isLoading && (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                    </div>
                )}

                {!isLoading && filtered.length === 0 && (
                    <div className="text-center text-gray-400 py-16">
                        <p className="font-bold text-lg">Chatlar yo'q</p>
                        <p className="text-sm mt-1">Avval doktorga yoziling</p>
                    </div>
                )}

                {filtered.map(chat => (
                    <div
                        key={chat.aptId}
                        onClick={() => {
                            // O'qildi deb belgilash
                            const readMap = JSON.parse(localStorage.getItem('chat_read') || '{}');
                            const lastMsg = previews.find(p => p.aptId === chat.aptId);
                            if (lastMsg) {
                                // Oxirgi xabar id sini topib saqlaymiz
                                getMessages(chat.aptId).then(msgs => {
                                    if (msgs.length > 0) {
                                        readMap[chat.aptId] = msgs[msgs.length - 1].id;
                                        localStorage.setItem('chat_read', JSON.stringify(readMap));
                                    }
                                }).catch(() => {});
                            }
                            setPreviews(prev => prev.map(p => p.aptId === chat.aptId ? { ...p, unread: 0 } : p));
                            navigate(paths.patientChatDetail.replace(':id', String(chat.aptId)));
                        }}
                        className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm cursor-pointer hover:bg-gray-50 transition-colors active:scale-[0.98]"
                    >
                        <div className="relative shrink-0">
                            <img src={DentistImg} alt="" className="w-14 h-14 rounded-full object-cover" />
                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                                <h4 className="font-bold text-gray-900 truncate">{chat.dentistName}</h4>
                                <span className="text-xs text-gray-400 shrink-0 ml-2">{chat.lastTime || chat.date}</span>
                            </div>
                            <div className="flex justify-between items-center mt-0.5">
                                <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                                {chat.unread > 0 && (
                                    <span className="ml-2 w-5 h-5 bg-[#5377f7] text-white text-[10px] font-black rounded-full flex items-center justify-center shrink-0">
                                        {chat.unread}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PatientChats;
