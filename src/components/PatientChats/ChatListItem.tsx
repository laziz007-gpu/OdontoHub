import { Check, CheckCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { paths } from "../../Routes/path";
import type { Chat } from "../../types/patient";

interface ChatListItemProps {
    chat: Chat;
}

const ChatListItem = ({ chat }: ChatListItemProps) => {
    const navigate = useNavigate();

    return (
        <div
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
    );
};

export default ChatListItem;
