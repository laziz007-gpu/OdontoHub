import React from 'react';
import { FaArrowRight } from "react-icons/fa";
import type { Doctor } from "../../types/patient";

interface DoctorInfoCardProps {
    doctor: Doctor;
}

const DoctorInfoCard: React.FC<DoctorInfoCardProps> = ({ doctor }) => {
    return (
        <div className="bg-[#4D71F8] rounded-[2rem] p-6 text-white flex gap-6 items-center shadow-lg relative overflow-hidden">
            {/* Image */}
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-white p-1 shrink-0 overflow-hidden">
                <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover rounded-2xl"
                />
            </div>

            {/* Content */}
            <div className="flex-1 z-10">
                <h3 className="text-xl md:text-2xl font-bold mb-2">{doctor.name}</h3>
                <div className="space-y-1 text-sm md:text-base opacity-90">
                    <p>Направление: {doctor.direction}</p>
                    <p>Опыт работы: {doctor.experience}</p>
                    <p>Оценка: {doctor.rating}</p>
                </div>

                <button className="mt-4 bg-white text-black text-xs md:text-sm font-bold py-2 px-4 rounded-full flex items-center gap-2 hover:bg-gray-100 transition-colors">
                    Перейти <FaArrowRight size={10} />
                </button>
            </div>
        </div>
    );
};

export default DoctorInfoCard;
