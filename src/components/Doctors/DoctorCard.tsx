import React from 'react';
import type { Doctor } from '../../types/patient';
import { FaMapMarkerAlt } from "react-icons/fa";

interface DoctorCardProps {
    doctor: Doctor;
    onBook: (doctor: Doctor) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBook }) => {
    return (
        <div className="bg-[#4D71F8] rounded-[24px] sm:rounded-[32px] lg:rounded-[40px] p-3 sm:p-4 lg:p-6 flex gap-3 sm:gap-4 lg:gap-6 relative overflow-hidden shadow-lg shadow-blue-500/20 hover:shadow-xl transition-shadow">
            {/* Image Container */}
            <div className="bg-white rounded-[18px] sm:rounded-[24px] lg:rounded-[32px] w-[90px] h-[90px] sm:w-[110px] sm:h-[110px] lg:w-[150px] lg:h-[150px] shrink-0 overflow-hidden flex items-center justify-center">
                <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between min-w-0 pr-12 sm:pr-14 lg:pr-20">
                <div>
                    <h3 className="text-white text-base sm:text-lg lg:text-2xl font-bold leading-tight mb-1 lg:mb-2 truncate">{doctor.name}</h3>
                    <p className="text-white/90 text-[10px] sm:text-xs lg:text-base font-medium mb-0.5 truncate">Направление: {doctor.direction || doctor.specialty}</p>
                    <p className="text-white/90 text-[10px] sm:text-xs lg:text-base font-medium mb-2 sm:mb-3 lg:mb-4">Опыт работы: {doctor.experience}</p>

                    <div className="flex items-center gap-1.5 lg:gap-2 mb-2 sm:mb-3 lg:mb-4">
                        <div className="bg-[#FF3B30] w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 rounded-full flex items-center justify-center shrink-0">
                            <FaMapMarkerAlt className="text-white text-[8px] sm:text-[10px] lg:text-xs" />
                        </div>
                        <span className="text-white text-xs sm:text-sm lg:text-lg font-bold truncate">Юнусабад</span>
                    </div>
                </div>

                <button
                    onClick={() => onBook(doctor)}
                    className="bg-[#11D76A] hover:bg-[#0fc460] text-white font-bold py-1.5 sm:py-2 lg:py-3 px-4 sm:px-6 lg:px-10 rounded-full text-[10px] sm:text-xs lg:text-base self-start transition-all shadow-sm hover:shadow-md active:scale-95"
                >
                    Записаться
                </button>
            </div>

            {/* Rating Badge */}
            <div className="absolute right-3 sm:right-4 lg:right-6 top-3 sm:top-4 lg:top-6 bg-[#F8BD00] rounded-[12px] sm:rounded-[14px] lg:rounded-[20px] w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 flex flex-col items-center justify-center p-1 shadow-sm">
                <span className="text-white text-[10px] sm:text-xs lg:text-base">✨</span>
                <span className="text-white font-bold text-xs sm:text-sm lg:text-xl leading-none">{doctor.rating}</span>
            </div>
        </div>
    );
};

export default DoctorCard;
