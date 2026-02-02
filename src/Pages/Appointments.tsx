import React, { useState, useEffect } from 'react';
import { ChevronLeft, Calculator } from 'lucide-react';
import DateStrip from '../components/Appointments/DateStrip';
import AppointmentCard, { AppointmentStatus } from '../components/Appointments/AppointmentCard';
import CalendarView from '../components/Appointments/CalendarView';
import AppointmentModal from '../components/Appointments/AppointmentModal';
import { useTranslation } from 'react-i18next';

const appointmentsData = [
    { time: '8:00', status: 'Завершён' as AppointmentStatus, service: 'Имплантация', patientName: 'Шерзод Бахромов' },
    { time: '10:00', status: 'Завершён' as AppointmentStatus, service: 'Имплантация', patientName: 'Шерзод Бахромов' },
    { time: '11:00', status: 'Отменён' as AppointmentStatus, service: 'Имплантация', patientName: 'Шерзод Бахромов' },
    { time: '12:30', status: 'Перенесён' as AppointmentStatus, service: 'Имплантация', patientName: 'Шерзод Бахромов' },
    { time: '13:30', status: 'Завершён' as AppointmentStatus, service: 'Имплантация', patientName: 'Шерзод Бахромов' },
    { time: '13:30', status: 'В процессе' as AppointmentStatus, service: 'Имплантация', patientName: 'Шерзод Бахромов' },
    { time: '13:30', status: 'В очереди' as AppointmentStatus, service: 'Имплантация', patientName: 'Шерзод Бахромов' },
    { time: '14:40', status: 'В очереди' as AppointmentStatus, service: 'Имплантация', patientName: 'Шерзод Бахромов' },
    { time: '16:00', status: 'В очереди' as AppointmentStatus, service: 'Имплантация', patientName: 'Шерзод Бахромов' },
    { time: '17:10', status: 'В очереди' as AppointmentStatus, service: 'Имплантация', patientName: 'Шерзод Бахромов' },
    { time: '18:00', status: 'В очереди' as AppointmentStatus, service: 'Имплантация', patientName: 'Шерзод Бахромов' },
    { time: '19:30', status: 'В очереди' as AppointmentStatus, service: 'Имплантация', patientName: 'Шерзод Бахромов' },
];

const Appointments: React.FC = () => {
    const { t } = useTranslation();
    const [view, setView] = useState<'list' | 'calendar'>('list');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mock date to match image for visual consistency
    // June 16, 2026 is a Tuesday.
    const displayDate = "16 Июнь, 2026";

    return (
        <div className="p-4 md:p-10 bg-[#f8fbff] min-h-screen relative">
            <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-10">
                {view === 'calendar' ? (
                    <CalendarView onBack={() => setView('list')} />
                ) : (
                    <>
                        {/* Header Section */}
                        {/* Header Section */}
                        <div className="flex flex-col gap-6">
                            {/* Top Bar with Back, Title, and Toast */}
                            <div className="relative flex items-center h-14">
                                {/* Left Side: Back & Title */}
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-4">
                                    <div className="bg-[#1a1f36] rounded-full p-1 cursor-pointer hover:bg-[#2a2f46] transition-colors">
                                        <ChevronLeft className="w-5 h-5 text-white" />
                                    </div>
                                    <h1 className="text-3xl font-black text-[#1a1f36] tracking-tight">{t('appointments.title')}</h1>
                                </div>

                                {/* Center: Toast */}
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex">
                                    <div className="bg-[#10d16d] rounded-[16px] px-6 py-3 flex items-center gap-3 shadow-lg shadow-[#10d16d]/20 animate-in slide-in-from-top-2 fade-in duration-500">
                                        <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
                                        <span className="text-white font-bold text-sm md:text-[15px]">{t('appointments.success_toast')}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Date and Controls */}
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                <h2 className="text-4xl md:text-5xl font-black text-[#1a1f36] tracking-tight">{displayDate}</h2>

                                <div className="flex items-center gap-4 self-start lg:self-auto">
                                    <button
                                        onClick={() => setView('calendar')}
                                        className="flex items-center gap-2 px-6 md:px-8 py-3 bg-white text-[#1a1f36] font-bold rounded-[16px] shadow-sm hover:shadow-md transition-all active:scale-95 text-sm md:text-base cursor-pointer"
                                    >
                                        <Calculator className="w-5 h-5" />
                                        <span>{t('appointments.calendar')}</span>
                                    </button>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="px-6 md:px-10 py-3 bg-[#00e396] text-white font-bold rounded-[16px] shadow-lg shadow-[#00e396]/20 hover:bg-[#00d08a] transition-all active:scale-95 text-sm md:text-base cursor-pointer"
                                    >
                                        {t('appointments.record_appointment')}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Date Selector */}
                        <DateStrip />

                        {/* Appointments List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                            {appointmentsData.map((apt, idx) => (
                                <AppointmentCard key={idx} {...apt} />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Modal */}
            <AppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default Appointments;
