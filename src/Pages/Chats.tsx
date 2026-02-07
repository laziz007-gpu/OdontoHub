import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Paperclip, Send, VolumeX, Eraser, Trash2, Pin, MessageCircle, Users, Phone, ArrowLeft } from 'lucide-react';
import { initialConversations } from '../data/chats';
import type { Message, Conversation } from '../data/chats';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AddChatModal from '../components/Chat/AddChatModal';
import { paths } from '../Routes/path';

export default function Chats() {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
    const [activeChatId, setActiveChatId] = useState<number | null>(id ? Number(id) : null);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showContext, setShowContext] = useState<number | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        if (id) {
            setActiveChatId(Number(id));
        } else {
            setActiveChatId(null);
        }
    }, [id]);

    const activeChat = conversations.find(c => c.id === activeChatId);

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newMessage.trim() || !activeChat) return;

        const msg: Message = {
            id: Date.now(),
            text: newMessage,
            sender: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
        };

        const updatedConversations = conversations.map(conv => {
            if (conv.id === activeChatId) {
                return {
                    ...conv,
                    messages: [...conv.messages, msg],
                    time: msg.time,
                    lastMessage: msg.text
                };
            }
            return conv;
        });

        setConversations(updatedConversations);
        setNewMessage('');
    };

    const handleChatSelect = (chatId: number) => {
        setActiveChatId(chatId);
        navigate(paths.chatDetail.replace(':id', String(chatId)));
    };

    const handleBackToList = () => {
        setActiveChatId(null);
        navigate(paths.chats);
    };

    const filteredConversations = conversations.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-[calc(100vh-80px)] md:h-[calc(100vh-40px)] mt-[72px] md:mt-4 m-2 md:m-4 bg-[#f8fbff] rounded-[24px] md:rounded-[32px] overflow-hidden border border-gray-100 shadow-sm relative">
            {/* Conversations List */}
            <div className={`w-full lg:w-[400px] bg-white border-r border-gray-100 flex flex-col ${activeChatId ? 'hidden lg:flex' : 'flex'}`}>
                <div className="flex-1 overflow-y-auto px-2 md:px-4 pb-4 no-scrollbar">
                    {/* Header - Now inside scrollable area */}
                    <div className="p-4 md:p-6">
                        <div className="flex items-center gap-4 mb-4 lg:hidden">
                            <Link
                                to={paths.menu}
                                className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-[#1e2235]" />
                                <span className="text-sm font-bold text-[#1e2235]">Назад</span>
                            </Link>
                        </div>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#5377f7] transition-colors" />
                            <input
                                type="text"
                                placeholder={t('dashboard.qidiruv.search_placeholder') || "Найти"}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#f1f4f9] border-none rounded-[16px] md:rounded-[20px] py-3 md:py-4 pl-12 pr-12 text-base md:text-lg focus:ring-2 focus:ring-[#5377f7]/20 transition-all outline-none"
                            />
                            <button className="absolute right-4 top-1/2 -translate-y-1/2">
                                <MoreVertical className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                    </div>

                    {filteredConversations.map((conv) => (
                        <div
                            key={conv.id}
                            onClick={() => handleChatSelect(conv.id)}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                setShowContext(conv.id);
                            }}
                            className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-[20px] md:rounded-[24px] cursor-pointer transition-all relative group mb-2
                                ${activeChatId === conv.id ? 'bg-[#f1f4f9]' : 'hover:bg-gray-50'}`}
                        >
                            <div className="relative shrink-0">
                                <img src={conv.avatar} alt={conv.name} className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover" />
                                {conv.isOnline && (
                                    <div className="absolute bottom-0 right-0 w-3 md:w-4 h-3 md:h-4 bg-green-500 border-2 border-white rounded-full"></div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-0.5 md:mb-1">
                                    <h4 className="font-bold text-[#1e2235] text-base md:text-lg truncate">{conv.name}</h4>
                                    <span className="text-xs md:text-sm text-gray-400">{conv.time}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className={`text-xs md:text-sm truncate ${conv.isTyping ? 'text-blue-500 font-medium' : 'text-gray-400'}`}>
                                        {conv.lastMessage}
                                    </p>
                                    {conv.unreadCount > 0 && (
                                        <div className="bg-[#1e2235] text-white text-[9px] md:text-[10px] font-bold w-4 md:w-5 h-4 md:h-5 rounded-full flex items-center justify-center">
                                            {conv.unreadCount}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {showContext === conv.id && (
                                <div
                                    className="absolute left-1/2 -translate-x-1/2 lg:left-full top-0 lg:ml-2 z-50 bg-white shadow-2xl rounded-2xl p-2 w-48 animate-in fade-in zoom-in-95 duration-200 border border-gray-50"
                                    onMouseLeave={() => setShowContext(null)}
                                >
                                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                                        <Pin size={16} /> Закрепить
                                    </button>
                                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                                        <VolumeX size={16} /> Выключить звук
                                    </button>
                                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                                        <Eraser size={16} /> Очистить историю
                                    </button>
                                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg">
                                        <Trash2 size={16} /> Удалить чат
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="p-4 bg-white flex justify-center border-t border-gray-50">
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="w-12 h-12 bg-[#1e2235] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-[#1e2235]/20"
                    >
                        <Users className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col bg-white ${!activeChatId ? 'hidden lg:flex' : 'flex'}`}>
                {activeChat ? (
                    <>
                        {/* Scrollable Messages Area with Header */}
                        <div className="flex-1 overflow-y-auto no-scrollbar">
                            {/* Header - Now inside scrollable area for mobile */}
                            <div className="sticky top-0 lg:static bg-white/80 backdrop-blur-md lg:bg-transparent p-4 md:p-6 border-b border-gray-100 flex items-center justify-between gap-2 z-10 transition-colors">
                                <div className="flex items-center gap-3 md:gap-4 min-w-0">
                                    <button
                                        onClick={handleBackToList}
                                        className="lg:hidden flex items-center gap-1 p-2 hover:bg-gray-50 rounded-xl transition-colors shrink-0 border border-gray-100"
                                    >
                                        <ArrowLeft className="w-5 h-5 text-[#1e2235]" />
                                        <span className="text-sm font-bold text-[#1e2235]">Назад</span>
                                    </button>
                                    <img src={activeChat.avatar} alt={activeChat.name} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover shrink-0" />
                                    <div className="min-w-0">
                                        <h3 className="font-black text-[#1e2235] text-lg md:text-xl truncate">{activeChat.name}</h3>
                                        <p className="text-xs md:text-sm text-gray-400 truncate">
                                            {activeChat.isOnline ? 'В сети' : 'Не в сети'} {activeChat.lastSeen && `последний раз был ${activeChat.lastSeen}`}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 md:gap-2 shrink-0">
                                    <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                                        <Phone className="text-gray-400 w-5 h-5 md:w-6 md:h-6" />
                                    </button>
                                    <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                                        <MoreVertical className="text-gray-400 w-5 h-5 md:w-6 md:h-6" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 md:p-8 space-y-4 md:space-y-6">
                                {activeChat.messages.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] sm:max-w-[70%] group relative ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                                            <div className={`px-4 md:px-5 py-2 md:py-3 rounded-[18px] md:rounded-[24px] shadow-sm relative overflow-hidden
                                                ${msg.sender === 'me' ? 'bg-[#5377f7] text-white rounded-tr-none' : 'bg-gray-50 text-[#1e2235] rounded-tl-none border border-gray-100'}`}>

                                                {msg.type === 'image' ? (
                                                    <div className="space-y-2">
                                                        <img src={msg.imageUrl} alt="attached" className="rounded-xl w-full max-w-full md:max-w-[300px] object-cover" />
                                                        <div className="flex items-center justify-between gap-4">
                                                            <span className="text-sm font-medium">{msg.text}</span>
                                                            <span className={`text-[9px] md:text-[10px] opacity-70 ${msg.sender === 'me' ? 'text-white' : 'text-gray-400'}`}>{msg.time}</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-end gap-2 md:gap-3">
                                                        <span className="text-[15px] md:text-[17px] font-medium leading-relaxed">{msg.text}</span>
                                                        <span className={`text-[9px] md:text-[10px] whitespace-nowrap opacity-70 ${msg.sender === 'me' ? 'text-white' : 'text-gray-400'}`}>{msg.time}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-4 md:p-6 border-t border-gray-50 lg:border-none">
                            <form
                                onSubmit={handleSendMessage}
                                className="bg-[#f1f4f9] rounded-[20px] md:rounded-[24px] p-1.5 md:p-2 flex items-center gap-2 md:gap-3 pr-3 md:pr-4 group focus-within:ring-2 focus-within:ring-[#5377f7]/20 transition-all"
                            >
                                <button type="button" className="p-2 md:p-3 text-gray-400 hover:text-[#5377f7] transition-colors shrink-0">
                                    <Paperclip className="w-5 h-5 md:w-6 md:h-6" />
                                </button>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Напишите сообщение"
                                    className="flex-1 bg-transparent border-none py-2 md:py-3 outline-none text-base md:text-lg text-[#1e2235] placeholder:text-gray-400 min-w-0"
                                />
                                <button
                                    type="submit"
                                    className={`p-2 md:p-3 rounded-xl transition-all shrink-0 ${newMessage.trim() ? 'bg-[#5377f7] text-white scale-105 md:scale-110 shadow-lg shadow-blue-500/30' : 'text-gray-400'}`}
                                >
                                    <Send className="w-5 h-5 md:w-6 md:h-6" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 space-y-4 p-8 text-center">
                        <MessageCircle size={64} className="opacity-20" />
                        <p className="text-lg md:text-xl font-medium">Выберите чат чтобы начать общение</p>
                    </div>
                )}
            </div>

            <AddChatModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={(name, phone) => {
                    if (!name.trim()) return;
                    console.log('Adding chat for:', name, phone);

                    const newConv: Conversation = {
                        id: Date.now(),
                        name: name,
                        lastMessage: 'Новый чат',
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                        unreadCount: 0,
                        avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
                        isOnline: false,
                        messages: []
                    };

                    setConversations([newConv, ...conversations]);
                    handleChatSelect(newConv.id);
                    setIsAddModalOpen(false);
                }}
            />
        </div>
    );
}
