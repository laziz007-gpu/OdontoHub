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
    password: string;
    role: UserRole;
    full_name: string;
    email?: string;
}

export interface LoginData {
    username: string;
    password: string;
}

export interface TokenResponse {
    access_token: string;
    token_type: string;
}