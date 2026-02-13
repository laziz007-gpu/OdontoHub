import React from 'react';
import type { Doctor } from '../../types/patient';
import { FaMapMarkerAlt } from "react-icons/fa";

interface DoctorCardProps {
    doctor: Doctor;
    onBook: (doctor: Doctor) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBook }) => {
    return (
        <div className="bg-[#4D71F8] rounded-[32px] p-4 flex gap-4 relative overflow-hidden shadow-lg shadow-blue-500/20">
            {/* Image Container */}
            <div className="bg-white rounded-[24px] w-[110px] h-[110px] shrink-0 overflow-hidden flex items-center justify-center">
                <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="text-white text-lg font-bold leading-tight mb-1">{doctor.name}</h3>
                    <p className="text-white/90 text-xs font-medium mb-0.5">Направление: {doctor.direction || doctor.specialty}</p>
                    <p className="text-white/90 text-xs font-medium mb-2">Опыт работы: {doctor.experience}</p>

                    <div className="flex items-center gap-1.5 mb-3">
                        <div className="bg-[#FF3B30] w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                            <FaMapMarkerAlt className="text-white text-[10px]" />
                        </div>
                        <span className="text-white text-sm font-bold">Юнусабад</span>
                    </div>
                </div>

                <button
                    onClick={() => onBook(doctor)}
                    className="bg-[#11D76A] hover:bg-[#0fc460] text-white font-bold py-2 px-6 rounded-full text-xs self-start transition-colors shadow-sm"
                >
                    Записаться
                </button>
            </div>

            {/* Rating Badge - Absolute positioned or flex? Screenshot shows it bottom right or right aligned. 
                 Let's place it absolute bottom right for now or flex right. 
                 Actually in screenshot it looks like it's on the right side.
            */}
            <div className="absolute right-4 bottom-16 bg-[#F8BD00] rounded-[14px] w-12 h-12 flex flex-col items-center justify-center p-1 shadow-sm">
                <span className="text-white text-xs">✨</span>
                <span className="text-white font-bold text-sm leading-none">{doctor.rating}</span>
            </div>
        </div>
    );
};

export default DoctorCard;
