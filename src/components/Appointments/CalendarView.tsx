import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, Plus, User } from 'lucide-react';

interface CalendarViewProps {
    onBack: () => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ onBack }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [viewDate, setViewDate] = useState(new Date(2026, 0, 1)); // Start at Jan 2026 as per design

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    const days = React.useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        // Get day of week (0-6, where 0 is Sunday)
        // Adjust for Monday start (0: Пн, 6: Bc)
        let firstDayIndex = firstDayOfMonth.getDay() - 1;
        if (firstDayIndex === -1) firstDayIndex = 6;

        const generatedDays = [];

        // Previous month days
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = firstDayIndex - 1; i >= 0; i--) {
            generatedDays.push({
                date: prevMonthLastDay - i,
                appointments: (prevMonthLastDay - i) % 5, // Stable mock data
                isPrevMonth: true,
                isOff: (firstDayIndex - 1 - i) % 7 === 6 || (firstDayIndex - 1 - i) % 7 === 5
            });
        }

        // Current month days
        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
            const currentDayDate = new Date(year, month, i);
            const dayOfWeek = currentDayDate.getDay();
            generatedDays.push({
                date: i,
                appointments: (i * 3) % 13, // Stable mock data
                isSelected: i === 7 && month === 0,
                hasBlueBorder: i === 14 && month === 0,
                isOff: dayOfWeek === 0 || dayOfWeek === 6
            });
        }

        // Next month days to fill 42 cells
        const nextMonthPadding = 42 - generatedDays.length;
        for (let i = 1; i <= nextMonthPadding; i++) {
            generatedDays.push({
                date: i,
                appointments: 0,
                isNextMonth: true,
                isOff: (generatedDays.length % 7 === 5 || generatedDays.length % 7 === 6)
            });
        }

        return generatedDays;
    }, [viewDate]);

    const handlePrevMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    const monthName = new Intl.DateTimeFormat('ru-RU', { month: 'long' }).format(viewDate);
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500 pb-10">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 md:gap-4">
                    <button
                        onClick={onBack}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ChevronLeft className="w-8 h-8 md:w-10 md:h-10 text-[#1a1f36]" />
                    </button>
                    <h1 className="text-2xl md:text-[36px] font-black text-[#1a1f36] tracking-tight">Календарь</h1>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                    <div className="px-3 md:px-5 py-1.5 md:py-2 bg-white rounded-[16px] md:rounded-[22px] shadow-sm border border-gray-100 flex flex-row sm:flex-col items-center justify-center min-w-[80px] md:min-w-[100px] gap-2 sm:gap-0">
                        <span className="text-xl md:text-[34px] font-black text-[#1a1f36] leading-none">56</span>
                        <span className="text-[10px] font-black text-[#1a1f36] uppercase tracking-tighter sm:mt-1">Приёмов</span>
                    </div>
                    <div className="px-4 md:px-8 py-1.5 md:py-2 bg-white rounded-[16px] md:rounded-[22px] shadow-sm border border-gray-100 flex items-center justify-center min-w-[100px] md:min-w-[140px]">
                        <span className="text-2xl md:text-[38px] font-black text-[#1a1f36] leading-none">{formatTime(currentTime)}</span>
                    </div>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 md:gap-6">
                <div className="flex items-center justify-between lg:justify-start">
                    <div className="flex items-center text-xl md:text-[34px] font-black text-[#1a1f36]">
                        <ChevronLeft
                            onClick={handlePrevMonth}
                            className="w-8 h-8 md:w-10 md:h-10 cursor-pointer hover:opacity-70 transition-opacity"
                        />
                        <span className="mx-1 min-w-[100px] md:min-w-[140px] text-center">{capitalizedMonth}</span>
                        <ChevronRight
                            onClick={handleNextMonth}
                            className="w-8 h-8 md:w-10 md:h-10 cursor-pointer hover:opacity-70 transition-opacity"
                        />
                        <span className="ml-2 text-lg md:text-[24px] text-gray-400 font-bold">{viewDate.getFullYear()}</span>
                    </div>

                    <button className="lg:hidden w-10 h-10 bg-[#1a1f36] text-white rounded-full flex items-center justify-center hover:bg-[#2a2f46] transition-all active:scale-90 shadow-lg shadow-[#1a1f36]/20">
                        <Plus className="w-6 h-6 stroke-3" />
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 lg:flex-1">
                    <div className="h-12 bg-[#e0e0e0] rounded-[18px] flex items-center p-1.5 shrink-0">
                        <button className="flex-1 sm:px-7 h-full bg-white rounded-[14px] shadow-sm flex items-center justify-center text-[15px] font-black text-[#4f6bff]">
                            Неделя
                        </button>
                        <button className="flex-1 sm:px-7 h-full flex items-center justify-center text-[15px] font-black text-[#9a9a9a]">
                            Месяц
                        </button>
                    </div>

                    <div className="flex-1 max-w-full lg:max-w-sm relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2">
                            <Search className="w-5 h-5 text-[#8a8a8a]" />
                        </div>
                        <input
                            type="text"
                            placeholder="имя или диагноз..."
                            className="w-full h-12 pl-12 pr-5 bg-[#d9d9d9] rounded-[18px] border-none focus:ring-2 focus:ring-[#4f6bff]/20 font-bold text-base text-[#1a1f36] placeholder:text-[#8a8a8a]"
                        />
                    </div>

                    <button className="hidden lg:flex w-12 h-12 bg-[#1a1f36] text-white rounded-full items-center justify-center hover:bg-[#2a2f46] transition-all active:scale-90 ml-auto shadow-lg shadow-[#1a1f36]/20">
                        <Plus className="w-8 h-8 stroke-3" />
                    </button>
                </div>
            </div>

            {/* Weekend Headers */}
            <div className="grid grid-cols-7 gap-1 md:gap-4">
                {weekDays.map(day => (
                    <div key={day} className="text-lg md:text-[32px] font-black text-[#1a1f36] text-center mb-1 md:mb-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-3 md:gap-5">
                {days.map((day, idx) => (
                    <div
                        key={idx}
                        className={`
                            relative aspect-[16/14.5] rounded-[12px] sm:rounded-[20px] md:rounded-[28px] overflow-hidden transition-all duration-300
                            ${day.isOff ? 'bg-[#10d16d]' : (day.isPrevMonth || day.isNextMonth ? 'bg-[#ebebeb] opacity-70' : 'bg-[#ebebeb]')}
                            ${day.hasBlueBorder ? 'border-2 md:border-[3px] border-[#0089ff]' : ''}
                        `}
                    >
                        {/* Day Number */}
                        <div className="absolute top-1 sm:top-2.5 right-1 sm:right-4">
                            <span className={`text-base sm:text-2xl md:text-[32px] font-black leading-none ${day.isSelected ? 'bg-[#1a1f36] text-white w-6 h-6 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center rounded-[6px] sm:rounded-[12px] md:rounded-[18px]' :
                                day.isOff ? 'text-white/60' : 'text-[#bdbdbd]'
                                }`}>
                                {day.date}
                            </span>
                        </div>

                        {/* Appointment Badges / Holiday Text */}
                        <div className="absolute bottom-1 sm:bottom-3 md:bottom-5 left-1 sm:left-3 md:left-4 right-1 sm:right-3 md:right-4">
                            {day.isOff ? (
                                <div className="hidden sm:flex items-center justify-center">
                                    <span className="text-white font-black text-[10px] sm:text-sm md:text-[18px]">Выходной</span>
                                </div>
                            ) : day.appointments > 0 ? (
                                <div className="bg-[#4f6bff] w-full h-4 sm:h-8 md:h-10 rounded-full flex items-center justify-center px-1">
                                    <div className="hidden sm:flex p-0.5 md:p-1 border border-white/30 rounded-full shrink-0">
                                        <User className="w-2 h-2 md:w-4 md:h-4 text-white fill-white" />
                                    </div>
                                    <span className="hidden md:inline text-[13px] font-black text-white ml-1">приёмов</span>
                                    <span className="md:hidden text-[8px] sm:text-[11px] font-black text-white sm:ml-1">приём</span>
                                    <div className="ml-0.5 sm:ml-1 bg-white w-3 h-3 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center shrink-0">
                                        <span className="text-[8px] sm:text-[11px] md:text-[13px] font-black text-[#4f6bff]">{day.appointments}</span>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CalendarView;
