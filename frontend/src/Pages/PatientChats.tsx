import { useState } from "react";
import DentistImg from "../assets/img/photos/Dentist.png";
import ChatHeader from "../components/PatientChats/ChatHeader";
import ChatListItem from "../components/PatientChats/ChatListItem";
import type { Chat } from "../types/patient";

const PatientChats = () => {
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
            <ChatHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            
            <div className="flex-1 px-4 py-6 md:py-8 space-y-4 pb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                    {filteredChats.map((chat) => (
                        <ChatListItem key={chat.id} chat={chat} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PatientChats;
