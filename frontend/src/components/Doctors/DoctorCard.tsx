import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Doctor } from '../../types/patient';
import { FaMapMarkerAlt } from "react-icons/fa";

interface DoctorCardProps {
    doctor: Doctor;
    onBook: (doctor: Doctor) => void;
    onOpenMap: (doctor: Doctor) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBook, onOpenMap }) => {
    const navigate = useNavigate();
    const coordinateLikeAddress = typeof doctor.address === 'string'
        ? /^\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*$/.test(doctor.address)
        : false;
    const displayAddress = coordinateLikeAddress
        ? (doctor.clinic || 'Тошкент')
        : (doctor.address || doctor.clinic || 'Манзил кўрсатилмаган');

    const handleCardClick = (e: React.MouseEvent) => {
        // Don't navigate if clicking the button
        if ((e.target as HTMLElement).closest('button')) {
            return;
        }
        // Navigate to doctor profile with doctor data
        navigate('/my-dentist', { state: { doctor } });
    };

    return (
        <div 
            onClick={handleCardClick}
            className="bg-[#4D71F8] rounded-[24px] sm:rounded-[32px] p-3 sm:p-4 lg:p-6 flex gap-3 sm:gap-4 relative overflow-hidden shadow-lg shadow-blue-500/20 hover:shadow-xl transition-shadow cursor-pointer"
        >
            {/* Image Container */}
            <div className="bg-white rounded-[18px] sm:rounded-[24px] w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] lg:w-[130px] lg:h-[130px] shrink-0 overflow-hidden flex items-center justify-center">
                <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between min-w-0 pr-10 sm:pr-14 lg:pr-20">
                <div>
                    <h3 className="text-white text-sm sm:text-lg lg:text-2xl font-bold leading-tight mb-1 lg:mb-2 line-clamp-2">{doctor.name}</h3>
                    <p className="text-white/90 text-[10px] sm:text-xs lg:text-sm font-medium mb-0.5 truncate">Направление: {doctor.direction || doctor.specialty}</p>
                    <p className="text-white/90 text-[10px] sm:text-xs lg:text-sm font-medium mb-2 sm:mb-3">Опыт: {doctor.experience}</p>

                    <div className="flex items-center gap-1 sm:gap-1.5 mb-2 sm:mb-3">
                        <div className="bg-[#FF3B30] w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shrink-0">
                            <FaMapMarkerAlt className="text-white text-[7px] sm:text-[9px]" />
                        </div>
                        <span className="text-white text-[10px] sm:text-sm font-bold truncate">
                            {displayAddress}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onBook(doctor);
                        }}
                        className="bg-[#11D76A] hover:bg-[#0fc460] text-white font-bold py-1.5 sm:py-2 px-3 sm:px-6 lg:px-10 rounded-full text-[10px] sm:text-xs lg:text-sm self-start transition-all shadow-sm hover:shadow-md active:scale-95"
                    >
                        Записаться
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onOpenMap(doctor);
                        }}
                        className="bg-white/15 hover:bg-white/25 border border-white/40 text-white font-bold py-1.5 sm:py-2 px-3 sm:px-5 rounded-full text-[10px] sm:text-xs lg:text-sm transition-all"
                    >
                        На карте
                    </button>
                </div>
            </div>

            {/* Rating Badge */}
            <div className="absolute right-2.5 sm:right-4 lg:right-6 top-2.5 sm:top-4 lg:top-6 bg-[#F8BD00] rounded-[10px] sm:rounded-[14px] px-2 py-1 flex flex-col items-center justify-center shadow-sm min-w-[36px] sm:min-w-[48px] lg:min-w-[56px]">
                <div className="flex items-center gap-0.5">
                    <span className="text-white text-[8px] sm:text-[10px]">⭐</span>
                    <span className="text-white font-black text-[12px] sm:text-base lg:text-lg leading-none">{doctor.rating || '0.0'}</span>
                </div>
                {doctor.review_count !== undefined && (
                    <span className="text-white/80 text-[7px] sm:text-[9px] font-bold uppercase mt-0.5 whitespace-nowrap">
                        {doctor.review_count} sharh
                    </span>
                )}
            </div>
        </div>
    );
};

export default DoctorCard;
