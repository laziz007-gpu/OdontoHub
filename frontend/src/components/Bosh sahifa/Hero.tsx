import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { paths } from '../../Routes/path';
import { useTranslation } from 'react-i18next';
import type { RootState } from '../../store/store';
import { getUnreadCount, getNotifications, markAsRead } from '../../api/notifications';
import type { Notification as NotifType } from '../../api/notifications';

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
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [unread, setUnread] = useState(0);
  const [notifList, setNotifList] = useState<NotifType[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const typeLabels: Record<string, string> = {
    appointment_confirmed: 'Qabul tasdiqlandi',
    appointment_cancelled: 'Bekor qilindi',
    appointment_reminder: 'Eslatma',
    review_received: 'Yangi baho',
    system_message: 'Tizim',
  };

  const formatTime = (d: string) => {
    const utcString = d.endsWith('Z') || d.includes('+') ? d : d + 'Z';
    const diff = Date.now() - new Date(utcString).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'Hozir';
    if (m < 60) return `${m} daqiqa oldin`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} soat oldin`;
    return `${Math.floor(h / 24)} kun oldin`;
  };

  const handleNotifClick = async (n: NotifType) => {
    if (!n.is_read) {
      await markAsRead(n.id).catch(() => {});
      setNotifList(prev => prev.map(x => x.id === n.id ? { ...x, is_read: true } : x));
      setUnread(prev => Math.max(0, prev - 1));
    }
  };

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  useEffect(() => {
    if (isNotifOpen) {
      setNotifLoading(true);
      getNotifications().then(data => { setNotifList(data.slice(0, 10)); setNotifLoading(false); }).catch(() => setNotifLoading(false));
    }
  }, [isNotifOpen]);

  const ratingModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getUnreadCount().then(setUnread).catch(() => {});
    const interval = setInterval(() => getUnreadCount().then(setUnread).catch(() => {}), 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (onSearch) onSearch(value);
  };

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
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="w-11 h-11 rounded-xl border transition-all flex items-center justify-center hover:bg-gray-50 bg-white relative"
                >
                  <img src={NotificationIcon} className="w-6 h-6" />
                  {unread > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </button>

                {isNotifOpen && (
                  <div className="absolute right-0 mt-3 w-[380px] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden z-50">
                    <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-bold text-gray-900">Bildirishnomalar</h3>
                      {unread > 0 && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-semibold">
                          {unread} yangi
                        </span>
                      )}
                    </div>
                    <div className="max-h-[360px] overflow-y-auto">
                      {notifLoading ? (
                        <div className="py-8 text-center text-gray-400 text-sm">Yuklanmoqda...</div>
                      ) : notifList.length === 0 ? (
                        <div className="py-8 text-center text-gray-400 text-sm">Bildirishnomalar yo'q</div>
                      ) : notifList.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => handleNotifClick(n)}
                          className={`px-5 py-3.5 flex gap-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 transition-colors ${!n.is_read ? 'bg-blue-50/50' : ''}`}
                        >
                          <div className="w-9 h-9 rounded-full bg-[#5377f7] flex items-center justify-center shrink-0">
                            <img src={NotificationIcon} className="w-4 h-4 brightness-0 invert" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                              <span className="text-xs font-bold text-[#5377f7] uppercase">{typeLabels[n.type] || n.type}</span>
                              <span className="text-[10px] text-gray-400">{formatTime(n.created_at)}</span>
                            </div>
                            <p className="text-sm font-bold text-gray-900">{n.title}</p>
                            <p className="text-xs text-gray-500 line-clamp-1">{n.message}</p>
                          </div>
                          {!n.is_read && <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1" />}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => { navigate(paths.notifications); setIsNotifOpen(false); }}
                      className="w-full py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors border-t border-gray-100"
                    >
                      Hammasini ko'rish
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
