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
        <div className="bg-white rounded-[2rem] border-2 border-[#1D1D2B] p-6 md:p-8 flex flex-col gap-4">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-[#1D1D2B] font-bold text-lg md:text-xl">Статус:</span>
                    <span className="text-[#1D1D2B] font-medium text-lg md:text-xl">{details.status}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-[#1D1D2B] font-bold text-lg md:text-xl">Когда:</span>
                    <span className="text-[#1D1D2B] font-medium text-lg md:text-xl">{details.date}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-[#1D1D2B] font-bold text-lg md:text-xl">
                        {details.duration.includes('минут') ? 'Длительность:' : 'Примерная длительность:'}
                    </span>
                    <span className="text-[#1D1D2B] font-medium text-lg md:text-xl">{details.duration}</span>
                </div>

                {details.tip && (
                    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                        <span className="text-[#1D1D2B] font-bold text-lg md:text-xl shrink-0">Подсказка:</span>
                        <span className="text-[#1D1D2B] font-medium text-lg md:text-xl">{details.tip}</span>
                    </div>
                )}

                {details.notes && (
                    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                        <span className="text-[#1D1D2B] font-bold text-lg md:text-xl shrink-0">Заметки:</span>
                        <span className="text-[#1D1D2B] font-medium text-lg md:text-xl">{details.notes}</span>
                    </div>
                )}

                {/* Fallback for old "Назначения" if needed, or remove if not used */}
                {!details.tip && !details.notes && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <span className="text-[#1D1D2B] font-bold text-lg md:text-xl">Назначения:</span>
                        <span className="text-[#1D1D2B] font-medium text-lg md:text-xl">Пусто</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentDetailsCard;
