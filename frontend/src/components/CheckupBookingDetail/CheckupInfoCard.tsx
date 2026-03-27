import React from 'react';

const CheckupInfoCard = () => {
    return (
        <div className="bg-white rounded-[30px] border border-[#1D1D2B] p-6 md:p-8 w-full">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-[#1D1D2B] font-bold text-[18px] md:text-[20px]">Статус:</span>
                    <span className="text-[#1D1D2B] font-bold text-[18px] md:text-[20px] opacity-80">завершён</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[#1D1D2B] font-bold text-[18px] md:text-[20px]">Когда:</span>
                    <span className="text-[#1D1D2B] font-bold text-[18px] md:text-[20px]">25.10.2025</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[#1D1D2B] font-bold text-[18px] md:text-[20px]">Длительность:</span>
                    <span className="text-[#1D1D2B] font-bold text-[18px] md:text-[20px]">20 минут</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[#1D1D2B] font-bold text-[18px] md:text-[20px]">Назначения:</span>
                    <span className="text-[#1D1D2B] font-bold text-[18px] md:text-[20px]">Пусто</span>
                </div>
            </div>
        </div>
    );
};

export default CheckupInfoCard;
