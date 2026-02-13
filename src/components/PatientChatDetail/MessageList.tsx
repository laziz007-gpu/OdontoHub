import { useTranslation } from "react-i18next";
import type { Message } from "../../types/patient";

interface MessageListProps {
    messages: Message[];
}

const MessageList = ({ messages }: MessageListProps) => {
    const { t } = useTranslation();

    return (
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 md:space-y-6 flex flex-col no-scrollbar pb-32">
            <div className="flex justify-center mb-4">
                <span className="bg-white/50 backdrop-blur-sm px-4 py-1 rounded-full text-[10px] md:text-xs font-black text-gray-500 uppercase tracking-widest border border-gray-100 italic">{t("patient.chats.today")}</span>
            </div>

            {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] md:max-w-[70%] space-y-1 ${msg.sender === "me" ? "items-end" : "items-start"}`}>
                        <div className={`px-4 py-3 md:px-6 md:py-4 rounded-3xl md:rounded-4xl shadow-sm relative overflow-hidden group
                                ${msg.sender === "me" ? "bg-[#4361EE] text-white rounded-br-none" : "bg-white text-[#1D1D2B] rounded-bl-none border border-gray-100"}`}>

                            {msg.image && (
                                <div className="mb-2 max-w-sm rounded-2xl overflow-hidden border border-white/20 shadow-lg">
                                    <img src={msg.image} alt="Attachment" className="w-full object-cover" />
                                </div>
                            )}

                            {msg.text && (
                                <p className="text-sm md:text-lg font-bold leading-tight tracking-tight">
                                    {msg.text}
                                </p>
                            )}

                            <div className={`flex items-center gap-1 mt-1 justify-end ${msg.sender === "me" ? "text-white/80" : "text-gray-400"}`}>
                                <span className="text-[10px] md:text-xs font-black uppercase">{msg.time}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MessageList;
