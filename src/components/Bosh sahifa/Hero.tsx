import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { paths } from '../../Routes/path';
import { useTranslation } from 'react-i18next';
import type { RootState } from '../../store/store';

import NotificationIcon from '../../assets/img/icons/Notification.svg';
import SettingsIcon from '../../assets/img/icons/Settings.svg';
import StarIcon from '../../assets/img/icons/Star.svg';
import DentistImg from '../../assets/img/photos/Dentist.png';

// Types
interface Notification {
  from: string;
  message: string;
  time: string;
}

interface HeroProps {
  onSearch?: (query: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onSearch }) => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user.user);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const settingsRef = useRef<HTMLDivElement>(null);
  const ratingModalRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const notifications: Notification[] = [
    { from: 'Odonto', message: 'Следующий приём через 15 минут', time: '5 мин' },
    { from: 'Пациент Алишер', message: 'Поставил вам 5 ★★★★★', time: '12 мин' },
    { from: 'Пациент Гулнора', message: 'Оставил подробный отзыв', time: '27 мин' },
    { from: 'Odonto', message: 'Напоминание: ежемесячная оплата', time: '1 ч' },
    { from: 'Пациент Зарина', message: 'Перенес приём на 14:30', time: '2 ч' },
    { from: 'Пациент Фарход', message: 'Ждёт вашего ответа уже 4+ часа', time: '4 ч' },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setIsSettingsOpen(false);
      }
      if (ratingModalRef.current && !ratingModalRef.current.contains(e.target as Node)) {
        setIsRatingModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitial = (name: string) =>
    name.startsWith('Odonto') ? 'O' : name.charAt(0);

  return (
    <>
      {/* HEADER */}
      <header className="w-full bg-white border-b border-gray-100 shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between gap-6">

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                value={searchValue}
                onChange={handleSearch}
                placeholder={t('dashboard.search_placeholder')}
                className="w-full h-[52px] pl-12 pr-5 bg-gray-50 border border-gray-200 rounded-2xl text-sm"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            </div>

            {/* Right */}
            <div className="flex items-center gap-4">

              {/* ⭐ Rating button */}
              <button
                onClick={() => setIsRatingModalOpen(true)}
                className="hidden lg:flex h-[52px] px-5 items-center gap-3 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-2xl"
              >
                <img src={StarIcon} className="w-6 h-6" />
                <div className="flex flex-col leading-none">
                  <span className="font-bold text-xl">4.5</span>
                  <span className="text-xs">{t('dashboard.improve')}</span>
                </div>
              </button>

              {/* Notifications */}
              <div className="relative" ref={settingsRef}>
                <button
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className={`w-11 h-11 rounded-xl border transition-all flex items-center justify-center ${isSettingsOpen ? "bg-gray-100 border-gray-300 shadow-inner" : "hover:bg-gray-50 bg-white"
                    }`}
                >
                  <img src={NotificationIcon} className="w-6 h-6" />
                </button>

                {isSettingsOpen && (
                  <div className="absolute right-0 mt-3 w-[400px] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                      <h3 className="font-bold text-gray-900">{t('dashboard.notifications.title')}</h3>
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-semibold">
                        {t('dashboard.notifications.new_count', { count: notifications.length })}
                      </span>
                    </div>
                    <div className="max-h-[480px] overflow-y-auto custom-scrollbar">
                      {notifications.map((n, i) => (
                        <div
                          key={i}
                          className={`px-6 py-4 flex gap-4 hover:bg-gray-50 transition-colors cursor-pointer ${i !== notifications.length - 1 ? "border-b border-gray-50" : ""
                            }`}
                        >
                          <div className="shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-200">
                            {getInitial(n.from)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-0.5">
                              <span className="font-bold text-sm text-gray-900 truncate">{n.from}</span>
                              <span className="text-[10px] font-medium text-gray-400 shrink-0">{n.time}</span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2 leading-tight">
                              {n.message}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="w-full py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors border-t border-gray-100">
                      {t('dashboard.notifications.show_all')}
                    </button>
                  </div>
                )}
              </div>

              {/* Settings */}
              <Link to={paths.settings} className="w-11 h-11 border rounded-xl flex items-center justify-center transition-opacity hover:opacity-70">
                <img src={SettingsIcon} className="w-5 h-5 opacity-70" />
              </Link>

              {/* Profile */}
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
          </div>
        </div>
      </header>

      {/* ⭐ RATING MODAL */}
      {isRatingModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            ref={ratingModalRef}
            className="bg-white rounded-2xl w-[640px] max-w-[90%] p-6 flex gap-6 relative"
          >
            <button
              onClick={() => setIsRatingModalOpen(false)}
              className="absolute top-4 right-4 text-xl text-gray-400"
            >
              ×
            </button>

            <div className="w-[220px] rounded-xl bg-[#999709] text-white flex flex-col items-center justify-center">
              <div className="text-5xl font-bold">4.5</div>
              <p className="text-sm mt-2">{t('dashboard.rating.average')}</p>
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">
                {t('dashboard.rating.how_to_improve')}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {t('dashboard.rating.desc')}
              </p>

              <ul className="space-y-2 text-sm mb-4">
                <li>• {t('dashboard.rating.tip1')}</li>
                <li>• {t('dashboard.rating.tip2')}</li>
                <li>• {t('dashboard.rating.tip3')}</li>
                <li>• {t('dashboard.rating.tip4')}</li>
              </ul>

              <button className="w-full bg-blue-600 text-white py-2 rounded-xl">
                {t('dashboard.rating.request_review')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;
