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
    <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:gap-4 lg:gap-6">
      <button
        onClick={() => navigate(-1)}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1E2532] text-white transition-opacity hover:opacity-90 sm:h-[52px] sm:w-[52px]"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="relative order-3 w-full flex-1 sm:order-2 sm:max-w-4xl">
        <input
          type="text"
          placeholder="Поиск"
          className="w-full h-[52px] pl-5 pr-12 bg-[#E9EAEF] border-none rounded-2xl text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
      </div>

      <Link
        to={user?.role === 'dentist' ? paths.profile : paths.patientProfileSettings}
        className="order-2 flex h-11 w-full items-center justify-center gap-3 rounded-2xl bg-[#1e2532] px-3 text-white transition-colors hover:bg-[#2c3545] sm:order-3 sm:h-[52px] sm:w-auto sm:justify-start sm:pr-5"
      >
        <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-gray-700">
          <img src={DentistImg} alt="Profile" className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0 hidden md:flex flex-col leading-tight">
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
