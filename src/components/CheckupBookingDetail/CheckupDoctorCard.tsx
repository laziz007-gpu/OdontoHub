import React from 'react';
import { FaArrowRight } from "react-icons/fa";
import DentistImg from "../../assets/img/photos/Dentist.png";

const CheckupDoctorCard = () => {
    return (
        <div className="bg-[#4D71F8] rounded-[30px] p-6 flex items-center gap-5 shadow-lg relative overflow-hidden w-full">
            <div className="w-[100px] h-[100px] bg-white rounded-[24px] overflow-hidden flex-shrink-0 border-2 border-white/20">
                <img src={DentistImg} alt="Doctor" className="w-full h-full object-cover" />
            </div>

            <div className="flex flex-col text-white z-10 flex-1">
                <h3 className="text-[22px] font-bold mb-1 leading-tight">Махмуд Пулатов</h3>
                <div className="text-[13px] font-medium leading-snug opacity-95 space-y-0.5">
                    <p>Направление: Ортодонтия</p>
                    <p>Опыт работы: 3 года</p>
                    <p>Оценка: 4.7</p>
                </div>

                <button className="mt-3 bg-white text-black text-[12px] font-bold py-1.5 px-4 rounded-full flex items-center gap-2 self-start hover:bg-gray-100 transition-colors">
                    Перейти <FaArrowRight size={10} />
                </button>
            </div>
        </div>
    );
};

export default CheckupDoctorCard;
