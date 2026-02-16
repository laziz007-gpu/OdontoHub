export interface Service {
    icon: string;
    label: string;
}

export interface QuickAction {
    label: string;
    icon: string;
    color: string;
    path: string;
}

export interface Doctor {
    name: string;
    direction?: string;
    experience?: string;
    rating?: string | number;
    image: string;
    specialty?: string;
}

export type AppointmentStatus = 'upcoming' | 'past' | 'success' | 'cancelled' | 'rescheduled';

export interface Appointment {
    id: number;
    title?: string;
    doctor: string;
    specialty?: string;
    date: string;
    time: string;
    image?: string;
    type: 'upcoming' | 'past';
    status?: 'success' | 'cancelled' | 'rescheduled';
    statusText?: string;
    rating?: number;
    commentTitle?: string;
    comment?: string;
    newDateTitle?: string;
    newDate?: string;
}

export interface AppointmentDetail {
    title: string;
    date: string;
    time: string;
    doctor: Doctor;
    details: {
        status: string;
        date: string;
        duration: string;
        tip: string;
        notes: string;
    };
    price: string;
}

export interface Message {
    id: number;
    text: string;
    time: string;
    sender: 'me' | 'other';
    image: string | null;
}

export interface Chat {
    id: number;
    name: string;
    avatar: string;
    lastMessage: string;
    time: string;
    unreadCount?: number;
    isOnline: boolean;
    isTyping?: boolean;
    status: 'unread' | 'delivered' | 'read';
}

export interface Language {
    code: string;
    name: string;
    flag: string;
}

export interface MenuItem {
    icon: React.ReactNode;
    label: string;
    color?: string;
    textColor?: string;
    onClick?: () => void;
    value?: string;
}

export interface SupportItem {
    icon: React.ReactNode;
    label: string;
    path: string;
}

export interface PatientHistoryProfile {
    name: string;
    id: string;
    dob: string;
    gender: string;
    phone: string;
    registrationDate: string;
    avatar: string;
}

export interface MedicalInfo {
    allergy: string;
    chronicDisease: string;
    medication: string;
    contraindication: string;
    smoking: string;
}

export interface Treatment {
    name: string;
    dateRange: string;
    appointmentsCount: string;
}
