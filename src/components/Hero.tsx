import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';

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
  // States
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState<boolean>(false);
  
  // Refs
  const settingsRef = useRef<HTMLDivElement>(null);
  const ratingModalRef = useRef<HTMLDivElement>(null);

  // Notification data
  const notifications: Notification[] = [
    { from: 'Odonto', message: 'Следующий приём через 15 минут', time: '5 мин' },
    { from: 'Пациент Алишер', message: 'Поставил вам 5 ★★★★★', time: '12 мин' },
    { from: 'Пациент Гулнора', message: 'Оставил подробный отзыв', time: '27 мин' },
    { from: 'Odonto', message: 'Напоминание: ежемесячная оплата', time: '1 ч' },
    { from: 'Пациент Зарина', message: 'Перенес приём на 14:30', time: '2 ч' },
    { from: 'Пациент Фарход', message: 'Ждёт вашего ответа уже 4+ часа', time: '4 ч' },
  ];

  // Tashqariga bosilganda dropdown yopiladi
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setIsSettingsOpen(false);
      }
      if (
        ratingModalRef.current &&
        !ratingModalRef.current.contains(event.target as Node)
      ) {
        setIsRatingModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handler functions
  const handleSettingsToggle = (): void => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handleRatingModalOpen = (): void => {
    setIsRatingModalOpen(true);
  };

  const handleRatingModalClose = (): void => {
    setIsRatingModalOpen(false);
  };

  const handleSettingsClose = (): void => {
    setIsSettingsOpen(false);
  };

  const getInitial = (name: string): string => {
    return name.startsWith('Odonto') ? 'O' : name.charAt(0);
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between gap-6">

          {/* Qidiruv */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Поиск пациентов, услуг..."
              className="w-full h-[52px] pl-12 pr-5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-700 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          </div>

          {/* O'ng taraf */}
          <div className="flex items-center gap-4">

            {/* Konsultatsiya */}
            <button 
              type="button"
              className="h-[52px] px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-2xl transition-colors"
            >
              Консультация
            </button>
            <button 
              type="button"
              onClick={handleRatingModalOpen}
              className="flex h-[52px] px-5 items-center gap-3 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-2xl hover:from-amber-500 hover:to-orange-500 transition-all"
              aria-label="Открыть рейтинг"
            >
              <img src={StarIcon} className="w-6 h-6" alt="Star" />
              <div className="flex flex-col leading-none">
                <span className="font-bold text-xl">4.5</span>
                <span className="text-xs opacity-90">улучшить</span>
              </div>
            </button>

            {/* Notification icon */}
            <button 
               type="button"
                onClick={handleSettingsToggle} 
                className="w-11 h-11 flex items-center justify-center rounded-xl bg-white border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow transition-all duration-200"
                aria-label="Настройки"
                aria-expanded={isSettingsOpen}
            >
              <img src={NotificationIcon} className="w-6 h-6" alt="Notification" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-blue-600 rounded-full ring-2 ring-white" />
            </button>

            {/* Settings dropdown */}
            <div className="relative" ref={settingsRef}>
              <button >
                <img src={SettingsIcon} alt="Settings" className="w-5 h-5 opacity-80" />
              </button>
              
              {isSettingsOpen && (
                <div 
                  className="absolute right-0 mt-2 w-[420px] bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden z-50" 
                  style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                  role="menu"
                >
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Уведомления
                    </h2>
                    <button
                      type="button"
                      onClick={handleSettingsClose}
                      className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                      aria-label="Закрыть"
                    >
                      ×
                    </button>
                  </div>

                  {/* Filters */}
                  <div className="px-6 pt-4 pb-3 border-b border-gray-100 bg-gray-50/40">
                    <div className="inline-flex items-center gap-1.5 p-1 bg-gray-100 rounded-lg">
                      <button 
                        type="button"
                        className="px-4 py-1.5 text-sm font-medium rounded-md bg-white shadow-sm text-gray-900"
                      >
                        Все
                      </button>
                      <button 
                        type="button"
                        className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
                      >
                        Непрочитанные
                      </button>
                      <button 
                        type="button"
                        className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
                      >
                        Обновления
                      </button>
                    </div>

                    <button 
                      type="button"
                      className="ml-4 px-4 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 transition"
                    >
                      Очистить все
                    </button>
                  </div>
{/* Notifications List */}
                  <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-100">
                    {notifications.map((notif: Notification, i: number) => (
                      <div
                        key={i}
                        className="px-6 py-4 hover:bg-gray-50/80 transition-colors group flex items-start gap-4"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-lg font-semibold shrink-0">
                          {getInitial(notif.from)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                              {notif.from}
                            </span>
                            <span className="text-xs text-gray-400 whitespace-nowrap">
                              {notif.time}
                            </span>
                          </div>
                          <p className="mt-0.5 text-sm text-gray-600 leading-relaxed">
                            {notif.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50 text-center">
                    <button 
                      type="button"
                      className="text-sm text-gray-500 hover:text-gray-700 transition"
                    >
                      Посмотреть все уведомления →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profil */}
            <div className="flex h-[52px] pl-3 pr-5 items-center gap-3 bg-gray-900 text-white rounded-2xl">
              <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center font-bold text-lg">
                П
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">
                  Пулатов М
                </span>
                <span className="text-xs text-gray-400">
                  Хирург
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {isRatingModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="rating-modal-title"
        >
          <div 
            ref={ratingModalRef} 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden"
          >
            
            {/* Gradient card bilan qism */}
            <div className="flex items-center justify-center p-6 bg-gray-50">
              <div className="bg-gradient-to-br from-amber-400 to-orange-400 rounded-2xl w-full max-w-xs p-8 text-center text-white relative">
                <button 
                  type="button"
                  onClick={handleRatingModalClose}
                  className="absolute top-3 right-3 text-white/80 hover:text-white text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition"
                  aria-label="Закрыть модальное окно"
                >
                  ×
                </button>
                <img src={StarIcon} className="w-12 h-12 mx-auto mb-3" alt="Star" />
                <div className="text-5xl font-bold mb-1">4.5</div>
                <div className="text-base font-medium opacity-90">Ваша средняя оценка</div>
              </div>
            </div>

Akbarkhanov, [20.01.2026 7:13]
{/* Content qismi */}
            <div className="px-6 py-5">
              <h3 
                id="rating-modal-title"
                className="text-lg font-bold text-gray-900 mb-2"
              >
                Как повысить ваш рейтинг?
              </h3>
              <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                Рейтинг влияет на вашу позицию в списке врачей и самое главное качества обслуживания
              </p>

              {/* Recommendations */}
              <div className="mb-5">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Рекомендации</h4>
                <div className="space-y-2.5">
                  {[
                    'Старайтесь отвечать быстро и четко',
                    'Будьте подробными при ответе',
                    'Узнайте об опыте работы с другими докторами',
                    'Завершайте приёмы на отлично'
                  ].map((recommendation: string, index: number) => (
                    <div key={index} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-xs flex-shrink-0 mt-0.5">
                        ✓
                      </div>
                      <p className="text-sm text-gray-700 leading-snug">
                        {recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats box */}
              <div className="bg-blue-50 rounded-xl p-4 mb-5">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">Ваш рейтинг</h4>
                <p className="text-sm text-gray-600 mb-1">
                  Данные в мае: <span className="font-semibold text-green-600">+0.2</span>
                </p>
                <p className="text-sm text-gray-600">
                  Успешно выполнено консультации: <span className="font-semibold text-blue-600">53</span>
                </p>
              </div>

              {/* Button */}
              <button 
                type="button"
                onClick={handleRatingModalClose}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-colors text-sm"
              >
                Проверять этапе
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Hero;