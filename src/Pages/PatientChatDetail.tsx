import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DentistImg from "../assets/img/photos/Dentist.png";
import ChatDetailHeader from "../components/PatientChatDetail/ChatDetailHeader";
import MessageList from "../components/PatientChatDetail/MessageList";
import ChatInput from "../components/PatientChatDetail/ChatInput";
import type { Message, Chat } from "../types/patient";

const PatientChatDetail = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const [message, setMessage] = useState("");
    const [attachedImage, setAttachedImage] = useState<string | null>(null);

    const chatInfo: Partial<Chat> = {
        id: Number(id),
        name: "Алишер Насруллаев",
        avatar: DentistImg,
    };
    const chatStatus = t("patient.chats.online");

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
            <ChatDetailHeader chatInfo={chatInfo} chatStatus={chatStatus} />
            <MessageList messages={chatMessages} />
            <ChatInput
                message={message}
                attachedImage={attachedImage}
                onMessageChange={setMessage}
                onSend={handleSend}
                onFileChange={handleFileChange}
                onRemoveImage={() => setAttachedImage(null)}
            />
        </div>
    );
};

export default PatientChatDetail;
