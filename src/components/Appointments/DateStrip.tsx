import React, { useState, useEffect, useRef } from 'react';

interface DayItem {
    day: string;
    date: number;
    fullDate: Date;
}

const DateStrip: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [days, setDays] = useState<DayItem[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Generate dates for the next 12 months (365 days)
        const generatedDays: DayItem[] = [];
        const start = new Date();

        for (let i = 0; i < 365; i++) {
            const current = new Date(start);
            current.setDate(start.getDate() + i);

            generatedDays.push({
                day: new Intl.DateTimeFormat('ru-RU', { weekday: 'short' }).format(current),
                date: current.getDate(),
                fullDate: current
            });
        }
        setDays(generatedDays);
    }, []);

    const isSameDay = (d1: Date, d2: Date) => {
        return d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear();
    };

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
    };

    return (
        <div
            ref={scrollRef}
            className="flex items-center bg-white rounded-[24px] md:rounded-[32px] p-3 md:p-5 shadow-sm overflow-x-auto gap-3 md:gap-4 no-scrollbar scroll-smooth"
        >
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
            {days.map((item, index) => {
                const active = isSameDay(item.fullDate, selectedDate);
                return (
                    <div
                        key={index}
                        onClick={() => handleDateClick(item.fullDate)}
                        className={`flex flex-col items-center justify-center min-w-[65px] md:min-w-[75px] h-[85px] md:h-[95px] rounded-[18px] md:rounded-[24px] cursor-pointer transition-all duration-300 shrink-0 ${active
                            ? 'bg-[#4f6bff] text-white shadow-xl shadow-blue-100 scale-105'
                            : 'text-[#4f6bff] hover:bg-blue-50'
                            }`}
                    >
                        <span className={`text-[15px] font-bold mb-1 capitalize ${active ? 'text-white/80' : 'text-[#4f6bff]/70'}`}>
                            {item.day}
                        </span>
                        <span className="text-2xl font-black">{item.date}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default DateStrip;
