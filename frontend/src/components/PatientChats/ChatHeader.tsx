import { ArrowLeft, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface ChatHeaderProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
}

const ChatHeader = ({ searchQuery, onSearchChange }: ChatHeaderProps) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="bg-white px-3 sm:px-4 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3 sm:gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 sm:p-2.5 bg-[#1D1D2B] rounded-full text-white hover:bg-gray-800 transition-colors shrink-0 active:scale-95"
                >
                    <ArrowLeft size={20} className="sm:size-[24px]" />
                </button>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight truncate">{t("patient.chats.title")}</h1>
            </div>

            <div className="relative w-full max-w-2xl">
                <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-[#1D1D2B] rounded-full flex items-center justify-center text-white">
                    <Search size={16} className="sm:size-[20px]" />
                </div>
                <input
                    type="text"
                    placeholder={t("patient.chats.search")}
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full bg-[#E5E5E5] border-none rounded-full py-3 sm:py-4 pl-12 sm:pl-16 pr-4 sm:pr-6 text-base sm:text-lg font-bold text-gray-700 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500/20 shadow-inner"
                />
            </div>
        </div>
    );
};

export default ChatHeader;
