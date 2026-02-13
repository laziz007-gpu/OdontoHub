import { ArrowLeft, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Chat } from "../../types/patient";

interface ChatDetailHeaderProps {
    chatInfo: Partial<Chat>;
    chatStatus: string;
}

const ChatDetailHeader = ({ chatInfo, chatStatus }: ChatDetailHeaderProps) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white px-4 py-4 md:py-6 border-b border-gray-100 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2.5 bg-[#1D1D2B] rounded-full text-white hover:bg-gray-800 transition-colors shrink-0"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="relative shrink-0">
                        <img src={chatInfo.avatar} alt={chatInfo.name} className="w-10 h-10 md:w-14 md:h-14 rounded-full border-2 border-white shadow-sm" />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-base md:text-xl font-extrabold text-[#1D1D2B] truncate leading-tight">{chatInfo.name}</h3>
                        <p className="text-xs md:text-sm font-bold text-emerald-500 mt-0.5">{chatStatus}</p>
                    </div>
                </div>
            </div>
            <button className="p-2.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                <MoreVertical size={24} />
            </button>
        </div>
    );
};

export default ChatDetailHeader;
