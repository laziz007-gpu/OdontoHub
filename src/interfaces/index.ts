import type { RegisterOptions } from "react-hook-form";

export interface BaseField {
    title: string;
    type: 'text' | 'tel' | 'password';
    holder: string;
}

export interface FieldConfigForm extends BaseField{
    name: string;
    validation: RegisterOptions;
}

export interface RegisterData {
    username: string;
    number: number;
    password: string;
    password2: string; 
}