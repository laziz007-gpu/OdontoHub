import { useState } from "react";
import { ArrowLeft, Search, Check, CheckCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { paths } from "../Routes/path";
import DentistImg from "../assets/img/photos/Dentist.png";
import type { Chat } from "../types/patient";

const PatientChats = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState("");

    const chats: Chat[] = [
        {
            id: 1,
            name: "Алишер Насруллаев",
            avatar: DentistImg,
            lastMessage: "Lorem ipsum dolor sit amet, consectetur...",
            time: "8:34",
            unreadCount: 2,
            isOnline: true,
            status: "unread"
        },
        {
            id: 2,
            name: "Махмуд Пулатов",
            avatar: DentistImg,
            lastMessage: "Печатает...",
            time: "8:34",
            isOnline: true,
            isTyping: true,
            status: "delivered"
        },
        {
            id: 3,
            name: "Бекзод Лутфуллаев",
            avatar: DentistImg,
            lastMessage: "Lorem ipsum dolor sit amet, consectetur...",
            time: "8:34",
            isOnline: false,
            status: "read"
        },
        {
            id: 4,
            name: "Алишер Насруллаев",
            avatar: DentistImg,
            lastMessage: "Lorem ipsum dolor sit amet, consectetur...",
            time: "8:34",
            unreadCount: 99,
            isOnline: false,
            status: "unread"
        },
        {
            id: 5,
            name: "Махмуд Пулатов",
            avatar: DentistImg,
            lastMessage: "Печатает...",
            time: "8:34",
            isOnline: true,
            isTyping: true,
            status: "delivered"
        },
        {
            id: 6,
            name: "Махмуд Пулатов",
            avatar: DentistImg,
            lastMessage: "Печатает...",
            time: "8:34",
            isOnline: true,
            isTyping: true,
            status: "delivered"
        }
    ];

    const filteredChats = chats.filter(chat =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen flex flex-col bg-gray-100/50 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="bg-white px-4 py-6 md:py-8 space-y-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2.5 bg-[#1D1D2B] rounded-full text-white hover:bg-gray-800 transition-colors shrink-0"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">{t("patient.chats.title")}</h1>
                </div>

                {/* Search Bar */}
                <div className="relative w-full max-w-2xl">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#1D1D2B] rounded-full flex items-center justify-center text-white">
                        <Search size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder={t("patient.chats.search")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#E5E5E5] border-none rounded-full py-4 pl-16 pr-6 text-lg font-bold text-gray-700 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500/20 shadow-inner"
                    />
                </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 px-4 py-6 md:py-8 space-y-4 pb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                    {filteredChats.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => navigate(paths.patientChatDetail.replace(":id", chat.id.toString()))}
                            className="bg-white rounded-4xl p-4 md:p-5 flex items-center gap-4 cursor-pointer hover:shadow-xl transition-all active:scale-[0.98] border border-transparent hover:border-blue-500/10 group"
                        >
                            {/* Avatar */}
                            <div className="relative shrink-0">
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-white ring-2 ring-gray-100 group-hover:ring-blue-500/30 transition-all">
                                    <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
                                </div>
                                {chat.isOnline && (
                                    <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg md:text-xl font-extrabold text-[#1D1D2B] truncate">{chat.name}</h3>
                                        <span className="text-xs md:text-sm font-bold text-gray-400">• {chat.time}</span>
                                    </div>
                                    {chat.unreadCount ? (
                                        <div className="bg-[#5CFFB1] text-[#1D1D2B] text-xs md:text-sm font-black px-2 py-1 min-w-[24px] rounded-full flex items-center justify-center shadow-sm">
                                            {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                                        </div>
                                    ) : (
                                        <div className="text-blue-500">
                                            {chat.status === "read" ? <CheckCheck size={20} /> : <Check size={20} />}
                                        </div>
                                    )}
                                </div>
                                <p className={`text-sm md:text-lg truncate font-bold leading-tight ${chat.isTyping ? "text-blue-500" : "text-gray-400"}`}>
                                    {chat.lastMessage}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PatientChats;
