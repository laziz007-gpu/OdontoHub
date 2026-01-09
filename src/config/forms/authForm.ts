import type { BaseField, FieldConfigForm } from '../../interfaces';

export const getRegisterConfig = (password: string): FieldConfigForm[] =>
    [
        {
            title: 'Ф.И.О.',
            type: 'text',
            holder: 'username',
            name: 'username',
            validation: {
                required: 'Введите свой Ф.И.О.',
                minLength: {value: 4, message: 'Имя должно быть не меньше 4 символов'},
            },
        },
        {
            title: 'Номер телефона',
            type: 'tel',
            holder: '+998 __ ___ __ __',
            name: 'phonenumber',
            validation: {
                required: 'Введите свой номер телефона',
                pattern: {
                  value: /^\+998\d{9}$/,
                  message: 'Неверный формат номера телефона',  
                },
                minLength: {
                  value: 13, // +998 + 9 цифр = 13 символов
                  message: 'Номер телефона должен содержать 9 цифр', 
                }
            }
        }
    ]