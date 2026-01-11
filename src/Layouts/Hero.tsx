// layouts/Hero.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';

import NotificationIcon from '../assets/img/icons/Notification.svg';
import SettingsIcon from '../assets/img/icons/Settings.svg';
import StarIcon from '../assets/img/icons/Star.svg';

export default function Hero() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const ratingModalRef = useRef<HTMLDivElement>(null);

  // Tashqariga bosilganda dropdown yopiladi
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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
            <button className="h-[52px] px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-2xl">
              Консультация
            </button>

            {/* Reyting - Modal ochish uchun */}
            <button 
              onClick={() => setIsRatingModalOpen(true)}
              className="flex h-[52px] px-5 items-center gap-3 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-2xl hover:from-amber-500 hover:to-orange-500 transition-all"
            >
              <img src={StarIcon} className="w-6 h-6" alt="Star" />
              <div className="flex flex-col leading-none">
                <span className="font-bold text-xl">4.5</span>
                <span className="text-xs opacity-90">улучшить</span>
              </div>
            </button>

            {/* Notification icon */}
            <button className="w-[52px] h-[52px] flex items-center justify-center bg-gray-50 rounded-2xl relative">
              <img src={NotificationIcon} className="w-6 h-6" alt="Notification" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-blue-600 rounded-full ring-2 ring-white" />
            </button>

            <div className="relative" ref={settingsRef}>
              <button 
                onClick={() => setIsSettingsOpen(!isSettingsOpen)} 
                className="w-11 h-11 flex items-center justify-center rounded-xl bg-white border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow transition-all duration-200"
              >
                <img src={SettingsIcon} alt="Settings" className="w-5 h-5 opacity-80" />
              </button>
              {isSettingsOpen && (
                <div 
                  className="absolute right-0 mt-2 w-[420px] bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden z-50" 
                  style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                >
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Уведомления
                    </h2>
                    <button
                      onClick={() => setIsSettingsOpen(false)}
                      className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                    >
                      ×
                    </button>
                  </div>
                  <div className="px-6 pt-4 pb-3 border-b border-gray-100 bg-gray-50/40">
                    <div className="inline-flex items-center gap-1.5 p-1 bg-gray-100 rounded-lg">
                      <button className="px-4 py-1.5 text-sm font-medium rounded-md bg-white shadow-sm text-gray-900">
                        Все
                      </button>
                      <button className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition">
                        Непрочитанные
                      </button>
                      <button className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition">
                        Обновления
                      </button>
                    </div>

                    <button className="ml-4 px-4 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 transition">
                      Очистить все
                    </button>
                  </div>
                  <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-100">
                    {[
                      { from: 'Odonto', message: 'Следующий приём через 15 минут', time: '5 мин' },
                      { from: 'Пациент Алишер', message: 'Поставил вам 5 ★★★★★', time: '12 мин' },
                      { from: 'Пациент Гулнора', message: 'Оставил подробный отзыв', time: '27 мин' },
                      { from: 'Odonto', message: 'Напоминание: ежемесячная оплата', time: '1 ч' },
                      { from: 'Пациент Зарина', message: 'Перенес приём на 14:30', time: '2 ч' },
                      { from: 'Пациент Фарход', message: 'Ждёт вашего ответа уже 4+ часа', time: '4 ч' },
                    ].map((notif, i) => (
                      <div
                        key={i}
                        className="px-6 py-4 hover:bg-gray-50/80 transition-colors group flex items-start gap-4"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-lg font-semibold shrink-0">
                          {notif.from.startsWith('Odonto') ? 'O' : notif.from.charAt(0)}
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

                  <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50 text-center">
                    <button className="text-sm text-gray-500 hover:text-gray-700 transition">
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div ref={ratingModalRef} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden">
            
            {/* Gradient card bilan qism */}
            <div className="flex items-center justify-center p-6 bg-gray-50">
              <div className="bg-gradient-to-br from-amber-400 to-orange-400 rounded-2xl w-full max-w-xs p-8 text-center text-white relative">
                <button 
                  onClick={() => setIsRatingModalOpen(false)}
                  className="absolute top-3 right-3 text-white/80 hover:text-white text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition"
                >
                  ×
                </button>
                <img src={StarIcon} className="w-12 h-12 mx-auto mb-3" alt="Star" />
                <div className="text-5xl font-bold mb-1">4.5</div>
                <div className="text-base font-medium opacity-90">Ваша средняя оценка</div>
              </div>
            </div>

            {/* Content qismi */}
            <div className="px-6 py-5">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Как повысить ваш рейтинг?
              </h3>
              <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                Рейтинг влияет на вашу позицию в списке врачей и самое главное качества обслуживания
              </p>

              {/* Recommendations */}
              <div className="mb-5">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Рекомендации</h4>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-xs flex-shrink-0 mt-0.5">✓</div>
                    <p className="text-sm text-gray-700 leading-snug">Старайтесь отвечать быстро и четко</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-xs flex-shrink-0 mt-0.5">✓</div>
                    <p className="text-sm text-gray-700 leading-snug">Будьте подробными при ответе</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-xs flex-shrink-0 mt-0.5">✓</div>
                    <p className="text-sm text-gray-700 leading-snug">Узнайте об опыте работы с другими докторами</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-xs flex-shrink-0 mt-0.5">✓</div>
                    <p className="text-sm text-gray-700 leading-snug">Завершайте приёмы на отлично</p>
                  </div>
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
                onClick={() => setIsRatingModalOpen(false)}
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
}