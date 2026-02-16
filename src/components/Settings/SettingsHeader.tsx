import React from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { paths } from '../../Routes/path';
import type { RootState } from '../../store/store';
import DentistImg from '../../assets/img/photos/Dentist.png';

export const SettingsHeader: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);

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

      <Link
        to={user?.role === 'dentist' ? paths.profile : paths.patientProfileSettings}
        className="flex h-[52px] pl-3 pr-5 items-center gap-3 bg-[#1e2532] text-white rounded-2xl hover:bg-[#2c3545] transition-colors"
      >
        <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-gray-700">
          <img src={DentistImg} alt="Profile" className="w-full h-full object-cover" />
        </div>
        <div className="hidden md:flex flex-col leading-tight">
          <span className="font-bold text-sm whitespace-nowrap">
            {user?.full_name || 'Пользователь'}
          </span>
          <span className="text-[11px] text-gray-400">
            {user?.role === 'dentist' ? 'Врач' : 'Пациент'}
          </span>
        </div>
      </Link>
    </div>
  );
};
