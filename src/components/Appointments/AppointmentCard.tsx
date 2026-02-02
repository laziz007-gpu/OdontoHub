import React from 'react';

export type AppointmentStatus = 'Завершён' | 'Отменён' | 'Перенесён' | 'В процессе' | 'В очереди';

interface AppointmentCardProps {
    time: string;
    service: string;
    patientName: string;
    status: AppointmentStatus;
}

const statusStyles: Record<AppointmentStatus, string> = {
    'Завершён': 'border-[#00e396] text-[#00e396]',
    'Отменён': 'border-[#ff4560] text-[#ff4560]',
    'Перенесён': 'border-[#feb019] text-[#feb019]',
    'В процессе': 'border-[#4f6bff] text-[#4f6bff]',
    'В очереди': 'border-[#6c757d] text-[#6c757d]',
};

const AppointmentCard: React.FC<AppointmentCardProps> = ({ time, service, patientName, status }) => {
    return (
        <div className="bg-white rounded-[24px] md:rounded-[32px] p-5 md:p-6 shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-black text-[#1a1f36]">{time}</span>
                <span className={`px-4 py-1 rounded-[12px] text-[11px] font-bold border ${statusStyles[status]}`}>
                    {status}
                </span>
            </div>
            <div className="space-y-1">
                <h4 className="text-lg font-black text-[#1a1f36] leading-tight group-hover:text-[#4f6bff] transition-colors">
                    {service}
                </h4>
                <p className="text-[12px] font-bold text-[#1a1f36]">{patientName}</p>
            </div>
        </div>
    );
};

export default AppointmentCard;
