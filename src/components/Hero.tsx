import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

import NotificationIcon from '../assets/img/icons/Notification.svg';
import SettingsIcon from '../assets/img/icons/Settings.svg';
import StarIcon from '../assets/img/icons/Star.svg';

// Types
interface Notification {
  from: string;
  message: string;
  time: string;
}

const Hero: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  const settingsRef = useRef<HTMLDivElement>(null);
  const ratingModalRef = useRef<HTMLDivElement>(null);

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
      <header className="w-full bg-white border-b border-gray-100 shadow-sm max-md:pt-5">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between gap-6">

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                placeholder="Поиск пациентов, услуг..."
                className="w-full h-[52px] pl-12 pr-5 bg-gray-50 border border-gray-200 rounded-2xl text-sm"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            </div>

            {/* Right */}
            <div className="flex items-center gap-4">

              <button className="hidden lg:block h-[52px] px-8 bg-blue-600 text-white rounded-2xl">
                Консультация
              </button>

              {/* ⭐ Rating button */}
              <button
                onClick={() => setIsRatingModalOpen(true)}
                className="hidden lg:flex h-[52px] px-5 items-center gap-3 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-2xl"
              >
                <img src={StarIcon} className="w-6 h-6" />
                <div className="flex flex-col leading-none">
                  <span className="font-bold text-xl">4.5</span>
                  <span className="text-xs">улучшить</span>
                </div>
              </button>

              {/* Notifications */}
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="w-11 h-11 rounded-xl border relative"
              >
                <img src={NotificationIcon} className="w-6 h-6 mx-auto" />
              </button>

              {/* Dropdown */}
              <div className="relative" ref={settingsRef}>
                <button>
                  <img src={SettingsIcon} className="w-5 h-5" />
                </button>

                {isSettingsOpen && (
                  <div className="absolute right-0 mt-2 w-[420px] bg-white rounded-xl shadow-xl">
                    {notifications.map((n, i) => (
                      <div key={i} className="px-6 py-4 flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                          {getInitial(n.from)}
                        </div>
                        <div>
                          <div className="flex justify-between">
                            <span className="font-medium">{n.from}</span>
                            <span className="text-xs text-gray-400">{n.time}</span>
                          </div>
                          <p className="text-sm text-gray-600">{n.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Profile */}
              <Link
                to="/patsent/6"
                className="flex h-[52px] pl-3 pr-5 items-center gap-3 bg-gray-900 text-white rounded-2xl"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center font-bold text-lg">
                  П
                </div>
                <div className="hidden md:flex flex-col">
                  <span className="font-semibold text-sm">Пулатов М</span>
                  <span className="text-xs text-gray-400">Хирург</span>
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
              <p className="text-sm mt-2">Ваша средняя оценка</p>
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">
                Как повысить ваш рейтинг?
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Рейтинг строится на основе отзывов, активности и качества обслуживания
              </p>

              <ul className="space-y-2 text-sm mb-4">
                <li>• Старайтесь отвечать быстро в чатах</li>
                <li>• Быстро подтверждайте записи</li>
                <li>• Получайте отзывы от пациентов</li>
                <li>• Завершайте приёмы на отлично</li>
              </ul>

              <button className="w-full bg-blue-600 text-white py-2 rounded-xl">
                Попросить отзыв
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;
