import React, { type FC } from 'react';
import DentistImg from '../../assets/img/photos/Dentist.png';

const DoctorInfoCard: FC = () => {
    return (
        <div className=" w-[443px] h-[185px] bg-[#5B7FFF] rounded-[24px] p-6 text-white flex items-center gap-5 shadow-sm">
            <div className="w-[120px] h-[120px] rounded-[18px] overflow-hidden border-2 border-white/20 shrink-0">
                <img src={DentistImg} alt="Doctor" className="w-full h-full object-cover" />
            </div>
            <div>
                <h2 className="text-xl font-bold mb-3 tracking-tight">Пулатов Махмуд</h2>
                <div className="space-y-0.5 text-[13px] text-blue-50">
                    <p>Пол: <span className="text-white font-medium">Мужчина</span></p>
                    <p>Возраст: <span className="text-white font-medium">25 лет</span></p>
                    <p>Специализация: <span className="text-white font-medium">Хирург</span></p>
                </div>
            </div>
        </div>
    );
};

export default DoctorInfoCard;
