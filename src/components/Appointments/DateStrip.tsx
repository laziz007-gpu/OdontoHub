import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface DayItem {
    day: string;
    date: number;
    fullDate: Date;
}

const DateStrip: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 5, 16)); // Mock active date for visual match (June 16)
    const [days, setDays] = useState<DayItem[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Generate dates for June 2026 for visual matching
        const generatedDays: DayItem[] = [];
        const start = new Date(2026, 5, 14); // Start few days before today

        for (let i = 0; i < 14; i++) {
            const current = new Date(start);
            current.setDate(start.getDate() + i);

            generatedDays.push({
                day: t(`common.weekdays.${current.getDay()}`),
                date: current.getDate(),
                fullDate: current
            });
        }
        setDays(generatedDays);
    }, [i18n.language, t]);

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
            className="flex items-center bg-white rounded-[24px] p-4 shadow-sm overflow-x-auto gap-2 md:gap-4 no-scrollbar scroll-smooth w-full"
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
                        className={`
                             flex flex-col items-center justify-center min-w-[70px] md:min-w-[80px] h-[90px] md:h-[100px] rounded-[20px] md:rounded-[24px] cursor-pointer transition-all duration-300 shrink-0
                             ${active
                                ? 'bg-[#4f6bff] text-white shadow-lg shadow-[#4f6bff]/30 scale-105'
                                : 'text-[#4f6bff] hover:bg-blue-50'
                            }
                        `}
                    >
                        <span className={`text-base md:text-lg font-bold mb-1 capitalize ${active ? 'text-white' : 'text-[#4f6bff]'}`}>
                            {item.day}
                        </span>
                        <span className={`text-2xl md:text-3xl font-black ${active ? 'text-white' : 'text-[#4f6bff]'}`}>
                            {item.date}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default DateStrip;
