import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calculator } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CalendarViewProps {
    onBack: () => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ onBack }) => {
    const { t } = useTranslation();
    const [viewDate, setViewDate] = useState(new Date(2023, 5, 1)); // June 2023
    const weekDays = React.useMemo(() => {
        return [1, 2, 3, 4, 5, 6, 0].map(d => t(`common.weekdays.${d}`));
    }, [t]);

    const days = React.useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        let firstDayIndex = firstDayOfMonth.getDay() - 1;
        if (firstDayIndex === -1) firstDayIndex = 6;

        const generatedDays = [];
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = firstDayIndex - 1; i >= 0; i--) {
            generatedDays.push({
                date: prevMonthLastDay - i,
                isPrevMonth: true,
                appointments: 0
            });
        }

        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
            const currentDayDate = new Date(year, month, i);
            const dayOfWeek = currentDayDate.getDay();
            const aptCount = 9;
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

            generatedDays.push({
                date: i,
                appointments: aptCount,
                isWeekend: isWeekend,
                isCurrentMonth: true
            });
        }

        const totalSlots = 42;
        const remainingSlots = totalSlots - generatedDays.length;

        for (let i = 1; i <= remainingSlots; i++) {
            const currentDayDate = new Date(year, month + 1, i);
            const dayOfWeek = currentDayDate.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

            generatedDays.push({
                date: i,
                isNextMonth: true,
                isWeekend: isWeekend,
                appointments: 0
            });
        }

        return generatedDays;
    }, [viewDate]);

    const handleNextMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    const capitalizedMonth = t(`common.months.${viewDate.getMonth()}`);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500 pb-10">
            {/* Top Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={onBack}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <div className="bg-[#1a1f36] rounded-full p-1">
                            <ChevronLeft className="w-5 h-5 text-white" />
                        </div>
                    </button>
                    <h1 className="text-3xl font-black text-[#1a1f36] tracking-tight">{t('appointments.title')}</h1>
                </div>

                <div className="flex items-center">
                    <div className="flex items-center bg-[#1a1f36] rounded-[16px] p-1.5 pl-5 pr-1.5 gap-3">
                        <span className="text-white font-bold text-sm">{t('appointments.month_view.month_appointments')}</span>
                        <div className="bg-white rounded-[12px] px-3 py-2 min-w-[40px] flex items-center justify-center">
                            <span className="text-[#1a1f36] font-black text-lg">58</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Month Selector */}
                <div className="flex items-center gap-2">
                    <div className="bg-white px-6 py-3 rounded-[16px] shadow-sm min-w-[120px]">
                        <span className="text-xl font-black text-[#1a1f36]">{capitalizedMonth}</span>
                    </div>
                    <button
                        onClick={handleNextMonth}
                        className="bg-[#d1d5db] w-12 h-12 flex items-center justify-center rounded-[16px] hover:bg-gray-400 transition-colors"
                    >
                        <ChevronRight className="w-6 h-6 text-[#1a1f36]" />
                    </button>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 bg-white px-6 py-3 rounded-[16px] shadow-sm text-[#1a1f36] font-black hover:bg-gray-50 transition-colors">
                        <Calculator className="w-5 h-5" />
                        <span>{t('appointments.title')}</span>
                    </button>
                    <button className="bg-[#10d16d] px-8 py-3 rounded-[16px] shadow-lg shadow-[#10d16d]/20 text-white font-black hover:bg-[#0ebf63] transition-colors">
                        {t('appointments.record_appointment')}
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="mt-6">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-4 mb-4">
                    {weekDays.map(day => (
                        <div key={day} className="text-xl font-black text-[#1a1f36] text-center capitalize">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-3 sm:gap-4">
                    {days.map((day, idx) => (
                        <div
                            key={idx}
                            className={`
                                relative aspect-[1/0.85] rounded-[24px] overflow-hidden p-2 flex flex-col items-center justify-end
                                ${day.isWeekend
                                    ? 'bg-[#10d16d]'
                                    : (day.isPrevMonth || day.isNextMonth ? 'bg-[#f0f0f0]' : 'bg-[#eef2f6]')
                                }
                            `}
                        >
                            {/* Day Number */}
                            <div className={`absolute top-3 right-4 text-2xl font-bold ${day.isWeekend ? 'text-white' : 'text-[#bdbdbd]'}`}>
                                {day.date}
                            </div>

                            {/* Content */}
                            <div className="w-full mb-2">
                                {day.isWeekend ? (
                                    <div className="text-center text-white font-medium text-sm">
                                        {t('appointments.month_view.weekend')}
                                    </div>
                                ) : (
                                    (day.isCurrentMonth || day.isNextMonth) && !day.isWeekend && day.appointments > 0 ? (
                                        <div className="bg-[#4f6bff] mx-auto w-[90%] py-1 rounded-full flex items-center justify-between px-1.5 overflow-hidden">
                                            <span className="text-white text-[11px] font-bold pl-2 truncate">{t('dashboard.appointments_card.title')}</span>
                                            <div className="bg-white w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                                                <span className="text-[#4f6bff] text-[10px] font-black">{day.appointments}</span>
                                            </div>
                                        </div>
                                    ) : null
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CalendarView;
