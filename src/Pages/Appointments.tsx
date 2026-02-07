import React from 'react';
import DateStrip from '../components/Appointments/DateStrip';
import AppointmentCard, { AppointmentStatus } from '../components/Appointments/AppointmentCard';

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
    return (
        <div className="p-10 bg-[#f8fbff] min-h-screen">
            <div className="max-w-[1600px] mx-auto space-y-10">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                    <div className="space-y-8">
                        <h1 className="text-5xl font-black text-[#1a1f36] tracking-tight">Приёмы</h1>
                        <div className="space-y-2">
                            <p className="text-xl font-bold text-gray-400">Сегодня</p>
                            <p className="text-4xl font-black text-[#1a1f36]">16 Июнь, 2026</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-5">
                        <button className="px-10 py-4 bg-white text-[#1a1f36] font-bold rounded-[20px] shadow-sm hover:shadow-md transition-all active:scale-95 border border-gray-100">
                            Календарь
                        </button>
                        <button className="px-10 py-4 bg-[#00e396] text-white font-bold rounded-[20px] shadow-lg shadow-[#00e396]/20 hover:bg-[#00d08a] transition-all active:scale-95">
                            Записать приём
                        </button>
                    </div>
                </div>

                {/* Date Selector */}
                <DateStrip />

                {/* Appointments List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {appointmentsData.map((apt, idx) => (
                        <AppointmentCard key={idx} {...apt} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Appointments;
