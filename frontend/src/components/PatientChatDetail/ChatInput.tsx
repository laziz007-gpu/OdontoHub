import React, { useRef } from "react";
import { Send, Paperclip, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ChatInputProps {
    message: string;
    attachedImage: string | null;
    onMessageChange: (value: string) => void;
    onSend: () => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage: () => void;
}

const ChatInput = ({ message, attachedImage, onMessageChange, onSend, onFileChange, onRemoveImage }: ChatInputProps) => {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="bg-white/80 backdrop-blur-xl p-3 sm:p-4 md:p-6 border-t border-gray-100 sticky bottom-0 z-20">
            {/* Image Preview */}
            {attachedImage && (
                <div className="absolute bottom-full left-0 right-0 p-3 sm:p-4 animate-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-white p-1.5 sm:p-2 rounded-xl sm:rounded-2xl shadow-2xl border border-gray-100 w-fit relative group">
                        <img src={attachedImage} alt="Preview" className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 object-cover rounded-lg sm:rounded-xl" />
                        <button
                            onClick={onRemoveImage}
                            className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-red-500 text-white rounded-full p-1 sm:p-1.5 shadow-lg hover:bg-red-600 transition-colors active:scale-95"
                        >
                            <X size={12} className="sm:size-[16px]" />
                        </button>
                    </div>
                </div>
            )}

            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 max-w-7xl mx-auto">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={onFileChange}
                    accept="image/*"
                    className="hidden"
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 sm:p-3 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-all hover:scale-110 active:scale-95 shrink-0"
                >
                    <Paperclip size={20} className="sm:size-[24px]" />
                </button>

                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder={t("patient.chats.write_message")}
                        value={message}
                        onChange={(e) => onMessageChange(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && onSend()}
                        className="w-full bg-gray-100 border-none rounded-full py-3 sm:py-4 pl-4 sm:pl-6 pr-11 sm:pr-14 text-xs sm:text-sm md:text-base lg:text-lg font-bold text-[#1D1D2B] placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20"
                    />
                    <button
                        onClick={onSend}
                        disabled={!message.trim() && !attachedImage}
                        className={`absolute right-1 sm:right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all 
                                ${(!message.trim() && !attachedImage) ? "bg-gray-200 text-gray-400" : "bg-[#4361EE] text-white shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95"}`}
                    >
                        <Send size={16} className="sm:size-[20px] md:size-[24px]" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInput;
