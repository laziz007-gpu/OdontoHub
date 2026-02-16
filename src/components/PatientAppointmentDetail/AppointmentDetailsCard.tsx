import React from 'react';

interface AppointmentDetailsCardProps {
    details: {
        status: string;
        date: string;
        duration: string;
        tip?: string; // Mapped to "Naznachenie" or similar? Screenshot says "Назначения: Пусто"
        notes?: string;
    };
}

const AppointmentDetailsCard: React.FC<AppointmentDetailsCardProps> = ({ details }) => {
    return (
        <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] border-2 border-[#1D1D2B] p-4 sm:p-6 lg:p-10 flex flex-col gap-3 sm:gap-4 lg:gap-6">
            <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 lg:gap-3">
                    <span className="text-[#1D1D2B] font-bold text-sm sm:text-base lg:text-2xl">Статус:</span>
                    <span className="text-[#1D1D2B] font-medium text-sm sm:text-base lg:text-2xl">{details.status}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 lg:gap-3">
                    <span className="text-[#1D1D2B] font-bold text-sm sm:text-base lg:text-2xl">Когда:</span>
                    <span className="text-[#1D1D2B] font-medium text-sm sm:text-base lg:text-2xl">{details.date}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 lg:gap-3">
                    <span className="text-[#1D1D2B] font-bold text-sm sm:text-base lg:text-2xl">
                        {details.duration.includes('минут') ? 'Длительность:' : 'Примерная длительность:'}
                    </span>
                    <span className="text-[#1D1D2B] font-medium text-sm sm:text-base lg:text-2xl">{details.duration}</span>
                </div>

                {details.tip && (
                    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2 lg:gap-3">
                        <span className="text-[#1D1D2B] font-bold text-sm sm:text-base lg:text-2xl shrink-0">Подсказка:</span>
                        <span className="text-[#1D1D2B] font-medium text-sm sm:text-base lg:text-2xl">{details.tip}</span>
                    </div>
                )}

                {details.notes && (
                    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2 lg:gap-3">
                        <span className="text-[#1D1D2B] font-bold text-sm sm:text-base lg:text-2xl shrink-0">Заметки:</span>
                        <span className="text-[#1D1D2B] font-medium text-sm sm:text-base lg:text-2xl">{details.notes}</span>
                    </div>
                )}

                {/* Fallback for old "Назначения" if needed, or remove if not used */}
                {!details.tip && !details.notes && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 lg:gap-3">
                        <span className="text-[#1D1D2B] font-bold text-sm sm:text-base lg:text-2xl">Назначения:</span>
                        <span className="text-[#1D1D2B] font-medium text-sm sm:text-base lg:text-2xl">Пусто</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentDetailsCard;
