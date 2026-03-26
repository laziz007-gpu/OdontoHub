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
            className="bg-white rounded-3xl sm:rounded-4xl lg:rounded-[2.5rem] p-3 sm:p-4 lg:p-6 flex items-center gap-3 sm:gap-4 lg:gap-6 cursor-pointer hover:shadow-xl transition-all active:scale-[0.98] border border-transparent hover:border-blue-500/10 group"
        >
            {/* Avatar */}
            <div className="relative shrink-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-24 lg:h-24 rounded-full overflow-hidden border-2 border-white ring-2 ring-gray-100 group-hover:ring-blue-500/30 transition-all">
                    <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
                </div>
                {chat.isOnline && (
                    <div className="absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 lg:bottom-1.5 lg:right-1.5 w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 bg-emerald-500 border-2 border-white rounded-full"></div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5 sm:mb-1 lg:mb-2">
                    <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 min-w-0 flex-1">
                        <h3 className="text-base sm:text-lg lg:text-2xl font-extrabold text-[#1D1D2B] truncate">{chat.name}</h3>
                        <span className="text-[10px] sm:text-xs lg:text-base font-bold text-gray-400 shrink-0">• {chat.time}</span>
                    </div>
                    {chat.unreadCount ? (
                        <div className="bg-[#5CFFB1] text-[#1D1D2B] text-[10px] sm:text-xs lg:text-base font-black px-1.5 sm:px-2 lg:px-3 py-0.5 sm:py-1 min-w-[20px] sm:min-w-[24px] lg:min-w-[32px] rounded-full flex items-center justify-center shadow-sm shrink-0 ml-2">
                            {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                        </div>
                    ) : (
                        <div className="text-blue-500 shrink-0 ml-2">
                            {chat.status === "read" ? <CheckCheck size={16} className="sm:size-[20px] lg:size-[28px]" /> : <Check size={16} className="sm:size-[20px] lg:size-[28px]" />}
                        </div>
                    )}
                </div>
                <p className={`text-xs sm:text-sm lg:text-xl truncate font-bold leading-tight ${chat.isTyping ? "text-blue-500" : "text-gray-400"}`}>
                    {chat.lastMessage}
                </p>
            </div>
        </div>
    );
};

export default ChatListItem;
