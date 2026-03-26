import { initialPatients } from './patients';

export interface Message {
    id: number;
    text: string;
    sender: 'me' | 'other';
    time: string;
    type?: 'text' | 'image';
    imageUrl?: string;
}

export interface Conversation {
    id: number;
    name: string;
    lastMessage: string;
    time: string;
    unreadCount: number;
    avatar: string;
    isOnline: boolean;
    lastSeen?: string;
    isTyping?: boolean;
    messages: Message[];
}

// Helper to get patient details safely
const getPatient = (id: number) => initialPatients.find(p => p.id === id);

export const initialConversations: Conversation[] = [
    {
        id: 1,
        name: getPatient(1)?.name || "Дункан Факовский",
        lastMessage: "печатает...",
        time: "18:00",
        unreadCount: 4,
        avatar: getPatient(1)?.img || "https://i.pravatar.cc/150?u=1",
        isOnline: true,
        isTyping: true,
        messages: [
            { id: 1, text: "Привет", sender: 'other', time: "17:50" },
            { id: 2, text: "Как дела?", sender: 'other', time: "17:51" }
        ]
    },
    {
        id: 2,
        name: getPatient(2)?.name || "Алишер Махкамбетов",
        lastMessage: "печатает...",
        time: "12:00",
        unreadCount: 3,
        avatar: getPatient(2)?.img || "https://i.pravatar.cc/150?u=2",
        isOnline: true,
        isTyping: true,
        messages: []
    },
    {
        id: 6,
        name: getPatient(6)?.name || "Пулатов Махмуд",
        lastMessage: "В сети 20:32",
        time: "18:14",
        unreadCount: 0,
        avatar: getPatient(6)?.img || "https://i.pravatar.cc/150?u=3",
        isOnline: true,
        lastSeen: "20:32",
        messages: [
            { id: 1, text: "Привет", sender: 'other', time: "18:14" },
            { id: 2, text: "Привет", sender: 'me', time: "18:14" },
            { id: 3, text: "https://cheta/tam.com", sender: 'me', time: "18:15" },
            { id: 4, text: "X-ray result", sender: 'me', type: 'image', imageUrl: "https://images.unsplash.com/photo-1579154235828-401980c98e15?auto=format&fit=crop&q=80&w=500", time: "18:16" }
        ]
    },
    {
        id: 3,
        name: getPatient(3)?.name || "Касымов Бекмамбетов",
        lastMessage: "В сети 19:42",
        time: "10:32",
        unreadCount: 0,
        avatar: getPatient(3)?.img || "https://i.pravatar.cc/150?u=4",
        isOnline: false,
        lastSeen: "19:42",
        messages: []
    },
    {
        id: 4,
        name: getPatient(4)?.name || "Эргашев Мамурбек",
        lastMessage: "В сети 17:13",
        time: "16:23",
        unreadCount: 0,
        avatar: getPatient(4)?.img || "https://i.pravatar.cc/150?u=5",
        isOnline: false,
        lastSeen: "17:13",
        messages: []
    },
    {
        id: 5,
        name: getPatient(5)?.name || "Мамуров Джахонгир",
        lastMessage: "В сети 16:10",
        time: "16:10",
        unreadCount: 0,
        avatar: getPatient(5)?.img || "https://i.pravatar.cc/150?u=6",
        isOnline: false,
        lastSeen: "16:10",
        messages: []
    }
];
