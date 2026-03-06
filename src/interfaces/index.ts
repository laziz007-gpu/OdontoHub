import type { RegisterOptions } from "react-hook-form";

export interface BaseField {
    title: string;
    type: 'text' | 'tel' | 'password' | 'email';
    holder: string;
}

export interface FieldConfigForm extends BaseField {
    name: string;
    validation: RegisterOptions;
}

export type UserRole = 'patient' | 'dentist'

export interface RegisterData {
    phone: string;
    email?: string;
    full_name: string;
    role: UserRole;
}

export interface LoginData {
    phone: string;
}

export interface TokenResponse {
    access_token: string;
    token_type: string;
    user?: {
        id: number;
        phone: string;
        email?: string;
        full_name: string;
        role: UserRole;
    };
}

// Admin interfaces
export interface DentistStats {
    total_appointments: number;
    completed_appointments: number;
    pending_appointments: number;
}

export interface DentistForAdmin {
    id: number;
    user_id: number;
    full_name: string;
    email: string | null;
    phone: string;
    pinfl: string | null;
    diploma_number: string | null;
    verification_status: 'pending' | 'approved' | 'rejected';
    specialization: string | null;
    address: string | null;
    clinic: string | null;
    age: number | null;
    experience_years: number | null;
    schedule: string | null;
    work_hours: string | null;
    telegram: string | null;
    instagram: string | null;
    whatsapp: string | null;
    works_photos: string | null;
    created_at: string | null;
    updated_at: string | null;
}