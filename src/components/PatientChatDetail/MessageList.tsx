import { useTranslation } from "react-i18next";
import type { Message } from "../../types/patient";

interface MessageListProps {
    messages: Message[];
}

const MessageList = ({ messages }: MessageListProps) => {
    const { t } = useTranslation();

    return (
        <div className="flex-1 overflow-y-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 space-y-3 sm:space-y-4 lg:space-y-6 flex flex-col no-scrollbar pb-32">
            <div className="flex justify-center mb-3 sm:mb-4 lg:mb-6">
                <span className="bg-white/50 backdrop-blur-sm px-3 sm:px-4 lg:px-6 py-0.5 sm:py-1 lg:py-1.5 rounded-full text-[9px] sm:text-[10px] lg:text-sm font-black text-gray-500 uppercase tracking-widest border border-gray-100 italic">{t("patient.chats.today")}</span>
            </div>

            {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[90%] sm:max-w-[85%] lg:max-w-[75%] space-y-1 ${msg.sender === "me" ? "items-end" : "items-start"}`}>
                        <div className={`px-3 py-2 sm:px-4 sm:py-3 lg:px-8 lg:py-5 rounded-2xl sm:rounded-3xl lg:rounded-[2rem] shadow-sm relative overflow-hidden group
                                ${msg.sender === "me" ? "bg-[#4361EE] text-white rounded-br-none" : "bg-white text-[#1D1D2B] rounded-bl-none border border-gray-100"}`}>

                            {msg.image && (
                                <div className="mb-1.5 sm:mb-2 lg:mb-3 max-w-[200px] sm:max-w-sm lg:max-w-lg rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden border border-white/20 shadow-lg">
                                    <img src={msg.image} alt="Attachment" className="w-full object-cover" />
                                </div>
                            )}

                            {msg.text && (
                                <p className="text-xs sm:text-sm lg:text-xl font-bold leading-tight tracking-tight">
                                    {msg.text}
                                </p>
                            )}

                            <div className={`flex items-center gap-0.5 sm:gap-1 mt-0.5 sm:mt-1 lg:mt-2 justify-end ${msg.sender === "me" ? "text-white/80" : "text-gray-400"}`}>
                                <span className="text-[9px] sm:text-[10px] lg:text-sm font-black uppercase">{msg.time}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MessageList;
