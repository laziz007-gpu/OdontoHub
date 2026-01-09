import type { FieldConfigForm } from '../../interfaces';

export const getRegisterConfig = (password: string): FieldConfigForm[] =>
    [
        {
            title: 'Ф.И.О.',
            type: 'text',
            holder: 'username',
            name: 'username',
            validation: {
                required: 'Введите свой Ф.И.О.',
                minLength: {value: 3, message: 'Имя должно быть не меньше 3 символов'},
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
        },
        {
            title: 'Email',
            type: 'email',
            holder: 'Email',
            name: 'email',
            validation: {
            required: 'Введите корректную почту',
            pattern: {
                // .+   хотя бы один любой символ (до @)
                // @    символ @
                // .+   хотя бы один любой символ (после @)
                // \.   символ .
                // .+   хотя бы один любой символ (после точки)
                value: /.+@.+\..+/,
                message: 'Введите корректную почту',
            },
            },
        },
        {
            title: 'Ваш пароль',
            type: 'password',
            holder: 'Ваш пароль',
            name: 'password',
            validation: {
              required: 'Введите пароль',
              minLength: { value: 8, message: 'Пароль не может содержать меньше 8 символов' },
            },
        },
        {
            title: 'Повторите пароль',
            type: 'password',
            holder: 'Повторите пароль',
            name: 'password2',
            validation: {
              required: 'Подтвердите пароль',
              validate: (value: string) => value === password || 'Пароли не совпадают',
              minLength: { value: 8, message: 'Пароль не может содержать меньше 8 символов' },
            },
        },
    ] as const;

export const getLoginConfig = (): FieldConfigForm[] => [
  {
    title: 'Ф.И.О.',
    type: 'text',
    holder: 'Ф.И.О.',
    name: 'username',
    validation: {
      required: 'Введите Ф.И.О.',
      minLength: { value: 3, message: 'Имя должно быть не меньше 3 символов' },
    },
  },
  {
    title: 'Пароль',
    type: 'password',
    holder: 'Введите пароль',
    name: 'password',
    validation: {
      required: 'Введите пароль',
      minLength: { value: 8, message: 'Пароль не может содержать меньше 8 символов' },
    },
  },
];   