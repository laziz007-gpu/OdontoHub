import Rasm from "../assets/img/photos/Subtract.png"
import Brat from "../assets/img/photos/neuverennyi-stil-nyi-paren-protagivaet-ruku-dla-rukopozatia-s-grustnym-vyrazeniem-lica 1.png"
import Koz from "../assets/img/photos/privlekatel-nyi-molodoi-celovek-stoal-na-doroge-zesty 1.png"
import Molodda from "../assets/img/photos/molodaa-model-muzcina 1.png"

export interface Patient {
    id: number
    name: string
    age: number
    phone: string
    diagnosis: string
    status: string
    statusColor: string
    img: string
    gender?: string
    birthDate?: string
    doctor?: string
}

export const initialPatients: Patient[] = [
    {
        id: 1,
        name: 'Дункан Факовский',
        age: 27,
        phone: '+998 88 022 00 54',
        diagnosis: 'Сломанный зуб',
        status: 'ЛЕЧИТСЯ',
        statusColor: 'text-blue-600',
        img: Rasm,
        gender: 'Мужчина',
        birthDate: '10.01.1997',
        doctor: 'Пулатов Махмуд'
    },
    {
        id: 2,
        name: 'Алишер Махкамбетов',
        age: 21,
        phone: '+998 56 789 10 11',
        diagnosis: 'Кариес',
        status: 'НОВЫЙ',
        statusColor: 'text-green-600',
        img: Brat,
        gender: 'Мужчина',
        birthDate: '15.05.2003',
        doctor: 'Алиев Вали'
    },
    {
        id: 3,
        name: 'Касымов Бекмамбетов',
        age: 32,
        phone: '+998 90 123 45 67',
        diagnosis: 'Больной зуб',
        status: 'ЗАПИСАН',
        statusColor: 'text-gray-800',
        img: Koz,
        gender: 'Мужчина',
        birthDate: '20.08.1992',
        doctor: 'Каримов Салим'
    },
    {
        id: 4,
        name: 'Эргашев Мамурбек',
        age: 36,
        phone: '+998 90 123 45 67',
        diagnosis: 'Эрозия',
        status: 'НОВЫЙ',
        statusColor: 'text-green-600',
        img: Molodda,
        gender: 'Мужчина',
        birthDate: '10.01.1990',
        doctor: 'Пулатов Махмуд'
    },
    {
        id: 5,
        name: 'Мамуров Джахонгир',
        age: 42,
        phone: '+998 90 123 45 67',
        diagnosis: 'Пульпит',
        status: 'ЛЕЧИТСЯ',
        statusColor: 'text-blue-600',
        img: Rasm,
        gender: 'Мужчина',
        birthDate: '05.02.1982',
        doctor: 'Усманов Ботир'
    },
     {
        id: 6,
        name: 'Пулатов Махмуд',
        age: 27,
        phone: '+998 88 022 00 54',
        diagnosis: 'Сломанный зуб',
        status: 'ЛЕЧИТСЯ',
        statusColor: 'text-blue-600',
        img: Rasm,
        gender: 'Мужчина',
        birthDate: '10.01.1997',
        doctor: 'Пулатов Махмуд'
    }
]
