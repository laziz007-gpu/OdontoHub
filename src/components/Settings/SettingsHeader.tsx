import React from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DentistImg from '../../assets/img/photos/Dentist.png';

export const SettingsHeader: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-between mb-8 gap-6">
            <button
                onClick={() => navigate(-1)}
                className="w-[52px] h-[52px] rounded-full bg-[#1E2532] flex items-center justify-center text-white hover:opacity-90 transition-opacity"
            >
                <ArrowLeft size={24} />
            </button>

            <div className="relative flex-1 max-w-4xl">
                <input
                    type="text"
                    placeholder="Поиск"
                    className="w-full h-[52px] pl-5 pr-12 bg-[#E9EAEF] border-none rounded-2xl text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            </div>

            <div className="flex items-center gap-3 bg-[#1E2532] text-white p-1.5 pr-5 rounded-2xl">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-700">
                    <img src={DentistImg} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-bold leading-tight">Пулатов М</span>
                    <span className="text-[10px] text-gray-400 leading-tight">Ортодонт</span>
                </div>
            </div>
        </div>
    );
};
