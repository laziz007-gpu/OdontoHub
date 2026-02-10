import React, { useState, useRef } from "react";
import { ArrowLeft, Send, Paperclip, MoreVertical, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DentistImg from "../assets/img/photos/Dentist.png";

interface Message {
    id: number;
    text: string;
    time: string;
    sender: "me" | "other";
    image: string | null;
}

const PatientChatDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { t } = useTranslation();
    const [message, setMessage] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [attachedImage, setAttachedImage] = useState<string | null>(null);

    // Mock data for the specific chat
    const chatInfo = {
        id: id,
        name: "Алишер Насруллаев",
        avatar: DentistImg,
        status: t("patient.chats.online"),
    };

    const initialMessages: Message[] = [
        { id: 1, text: "Здравствуйте! Как ваши дела?", time: "08:30", sender: "other", image: null },
        { id: 2, text: "Добрый день! Все хорошо, спасибо. Хотел уточнить время приёма.", time: "08:32", sender: "me", image: null },
        { id: 3, text: "Ваш приём назначен на завтра в 16:00.", time: "08:34", sender: "other", image: null },
        { id: 4, text: "Можете отправить фото снимка?", time: "08:35", sender: "other", image: null },
    ];

    const [chatMessages, setChatMessages] = useState<Message[]>(initialMessages);

    const handleSend = () => {
        if (!message.trim() && !attachedImage) return;

        const newMessage: Message = {
            id: Date.now(),
            text: message,
            image: attachedImage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sender: "me"
        };

        setChatMessages([...chatMessages, newMessage]);
        setMessage("");
        setAttachedImage(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAttachedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100/50 max-w-7xl mx-auto w-full relative">
            {/* Header */}
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
                            <p className="text-xs md:text-sm font-bold text-emerald-500 mt-0.5">{chatInfo.status}</p>
                        </div>
                    </div>
                </div>
                <button className="p-2.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                    <MoreVertical size={24} />
                </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 md:space-y-6 flex flex-col no-scrollbar pb-32">
                <div className="flex justify-center mb-4">
                    <span className="bg-white/50 backdrop-blur-sm px-4 py-1 rounded-full text-[10px] md:text-xs font-black text-gray-500 uppercase tracking-widest border border-gray-100 italic">{t("patient.chats.today")}</span>
                </div>

                {chatMessages.map((msg) => (
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

            {/* Input Area */}
            <div className="bg-white/80 backdrop-blur-xl p-4 md:p-6 border-t border-gray-100 sticky bottom-0 z-20">
                {/* Image Preview */}
                {attachedImage && (
                    <div className="absolute bottom-full left-0 right-0 p-4 animate-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white p-2 rounded-2xl shadow-2xl border border-gray-100 w-fit relative group">
                            <img src={attachedImage} alt="Preview" className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-xl" />
                            <button
                                onClick={() => setAttachedImage(null)}
                                className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-3 md:gap-4 max-w-7xl mx-auto">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-all hover:scale-110 active:scale-95 shrink-0"
                    >
                        <Paperclip size={24} />
                    </button>

                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder={t("patient.chats.write_message")}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSend()}
                            className="w-full bg-gray-100 border-none rounded-full py-4 pl-6 pr-14 text-sm md:text-lg font-bold text-[#1D1D2B] placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!message.trim() && !attachedImage}
                            className={`absolute right-1.5 top-1.5 bottom-1.5 w-11 md:w-14 rounded-full flex items-center justify-center transition-all 
                                    ${(!message.trim() && !attachedImage) ? "bg-gray-200 text-gray-400" : "bg-[#4361EE] text-white shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95"}`}
                        >
                            <Send size={20} className="md:size-24" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientChatDetail;
