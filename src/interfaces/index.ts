import type { RegisterOptions } from "react-hook-form";

export interface BasField {
    title: string;
    type: 'text' | 'tel' | 'password';
    holder: string;
}

export interface FieldConfigForm extends BasField{
    name: string;
    validation: RegisterOptions;
}

export interface RegisterData {
    username: string;
    number: number;
    password: string;
    password2: string; 
}