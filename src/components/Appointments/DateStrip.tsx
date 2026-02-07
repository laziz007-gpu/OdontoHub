import React from 'react';

interface DayItem {
    day: string;
    date: number;
    active?: boolean;
}

const days: DayItem[] = [
    { day: 'Bc', date: 12 },
    { day: 'Пн', date: 13 },
    { day: 'Вт', date: 14 },
    { day: 'Ср', date: 15 },
    { day: 'Чт', date: 16, active: true },
    { day: 'Пт', date: 17 },
    { day: 'Сб', date: 18 },
    { day: 'Bc', date: 19 },
    { day: 'Пн', date: 20 },
    { day: 'Вт', date: 21 },
    { day: 'Ср', date: 22 },
];

const DateStrip: React.FC = () => {
    return (
        <div className="flex items-center justify-between bg-white rounded-[32px] p-5 shadow-sm overflow-x-auto gap-2 no-scrollbar">
            <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
            {days.map((item, index) => (
                <div
                    key={index}
                    className={`flex flex-col items-center justify-center min-w-[75px] h-[95px] rounded-[24px] cursor-pointer transition-all duration-300 ${item.active
                            ? 'bg-[#4f6bff] text-white shadow-xl shadow-blue-100 scale-105'
                            : 'text-[#4f6bff] hover:bg-blue-50'
                        }`}
                >
                    <span className={`text-[15px] font-bold mb-1 ${item.active ? 'text-white/80' : 'text-[#4f6bff]/70'}`}>
                        {item.day}
                    </span>
                    <span className="text-2xl font-black">{item.date}</span>
                </div>
            ))}
        </div>
    );
};

export default DateStrip;
