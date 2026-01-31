import React from 'react';

export type AppointmentStatus = 'Завершён' | 'Отменён' | 'Перенесён' | 'В процессе' | 'В очереди';

interface AppointmentCardProps {
    time: string;
    service: string;
    patientName: string;
    status: AppointmentStatus;
}

const statusStyles: Record<AppointmentStatus, string> = {
    'Завершён': 'bg-[#e7fbf3] text-[#00c48c] border-[#d1f7e8]',
    'Отменён': 'bg-[#fff1f1] text-[#ff5b5b] border-[#ffe4e4]',
    'Перенесён': 'bg-[#fff9e6] text-[#ffc107] border-[#fff3cd]',
    'В процессе': 'bg-[#eef2ff] text-[#4f6bff] border-[#e0e7ff]',
    'В очереди': 'bg-[#f3f4f6] text-[#9ca3af] border-[#e5e7eb]',
};

const AppointmentCard: React.FC<AppointmentCardProps> = ({ time, service, patientName, status }) => {
    return (
        <div className="bg-white border border-gray-50 rounded-[24px] md:rounded-[32px] p-5 md:p-7 shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4 md:mb-5">
                <span className="text-2xl md:text-3xl font-black text-[#1a1f36]">{time}</span>
                <span className={`px-3 md:px-5 py-1.5 md:py-2 rounded-full text-[11px] md:text-[13px] font-bold border ${statusStyles[status]}`}>
                    {status}
                </span>
            </div>
            <div className="space-y-1 md:space-y-2">
                <h4 className="text-lg md:text-[22px] font-black text-[#1a1f36] leading-tight group-hover:text-[#4f6bff] transition-colors">
                    {service}
                </h4>
                <p className="text-[13px] md:text-[15px] font-bold text-gray-400">{patientName}</p>
            </div>
        </div>
    );
};

export default AppointmentCard;
