import React, { useState, useRef, useEffect } from 'react';
import { Search, Star, MessageSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { paths } from '../../Routes/path';
import { useTranslation } from 'react-i18next';
import type { RootState } from '../../store/store';
import { getUnreadCount, getNotifications, markAsRead } from '../../api/notifications';
import { useDentistStats, useDentistProfile } from '../../api/profile';
import { useDentistReviews } from '../../api/reviews';
import type { Notification as NotifType } from '../../api/notifications';

import NotificationIcon from '../../assets/img/icons/Notification.svg';
import SettingsIcon from '../../assets/img/icons/Settings.svg';
import StarIcon from '../../assets/img/icons/Star.svg';
import DentistImg from '../../assets/img/photos/Dentist.png';

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
  const ratingModalRef = useRef<HTMLDivElement>(null);

  // Dynamic Data
  const { data: stats } = useDentistStats();
  const { data: dentistProfile } = useDentistProfile();
  const dentistId = dentistProfile?.id || (user as any)?.dentist_profile?.id || (user as any)?.dentist_id || (user as any)?.id;
  const { data: reviewsData, isLoading: reviewsLoading } = useDentistReviews(dentistId);

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
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setIsNotifOpen(false);
      if (ratingModalRef.current && !ratingModalRef.current.contains(e.target as Node)) setIsRatingModalOpen(false);
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
      <header className="w-full bg-white border-b border-gray-100 shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between gap-6">
            <div className="relative flex-1 max-w-md">
              <input
                value={searchValue}
                onChange={handleSearch}
                placeholder={t('dashboard.search_placeholder')}
                className="w-full h-[52px] pl-12 pr-5 bg-gray-50 border border-gray-200 rounded-2xl text-sm"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsRatingModalOpen(true)}
                className="hidden lg:flex h-[52px] px-5 items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] active:scale-95"
              >
                <img src={StarIcon} className="w-6 h-6 brightness-0 invert" />
                <div className="flex flex-col items-start leading-none gap-0.5">
                  <span className="font-black text-xl">{stats?.average_rating || '0.0'}</span>
                  <span className="text-[10px] uppercase font-bold opacity-80">{stats?.total_reviews || 0} ta sharh</span>
                </div>
              </button>

              {/* Notifications */}
              <div className="relative" ref={notifRef}>
                <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="w-11 h-11 rounded-xl border transition-all flex items-center justify-center hover:bg-gray-50 bg-white relative">
                  <img src={NotificationIcon} className="w-6 h-6" />
                  {unread > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </button>
                {isNotifOpen && (
                  <div className="absolute right-0 mt-3 w-[380px] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                      <h3 className="font-bold text-gray-900">Bildirishnomalar</h3>
                      {unread > 0 && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-semibold">{unread} yangi</span>}
                    </div>
                    <div className="max-h-[360px] overflow-y-auto custom-scrollbar">
                      {notifLoading ? <div className="py-8 text-center text-gray-400 text-sm italic">Yuklanmoqda...</div> : notifList.length === 0 ? <div className="py-8 text-center text-gray-400 text-sm">Bildirishnomalar yo'q</div> : 
                        notifList.map(n => (
                        <div key={n.id} onClick={() => handleNotifClick(n)} className={`px-5 py-3.5 flex gap-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 transition-colors ${!n.is_read ? 'bg-blue-50/50' : ''}`}>
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${n.type === 'review_received' ? 'bg-amber-400' : 'bg-[#5377f7]'}`}>
                            {n.type === 'review_received' ? <Star size={16} className="text-white" /> : <img src={NotificationIcon} className="w-4 h-4 brightness-0 invert" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                              <span className={`text-[10px] font-bold uppercase ${n.type === 'review_received' ? 'text-amber-500' : 'text-[#5377f7]'}`}>{typeLabels[n.type] || n.type}</span>
                              <span className="text-[10px] text-gray-400 font-medium">{formatTime(n.created_at)}</span>
                            </div>
                            <p className="text-sm font-bold text-gray-900 truncate">{n.title}</p>
                            <p className="text-xs text-gray-500 line-clamp-1">{n.message}</p>
                          </div>
                          {!n.is_read && <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1" />}
                        </div>
                      ))}
                    </div>
                    <button onClick={() => { navigate(paths.notifications); setIsNotifOpen(false); }} className="w-full py-3 text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors border-t border-gray-100">Hammasini ko'rish</button>
                  </div>
                )}
              </div>

              <Link to={paths.settings} className="w-11 h-11 border rounded-xl flex items-center justify-center transition-opacity hover:opacity-70 bg-white">
                <img src={SettingsIcon} className="w-5 h-5 opacity-70" />
              </Link>

              <Link to={user?.role === 'dentist' ? paths.profile : paths.patientProfileSettings} className="flex h-[52px] pl-2 pr-4 items-center gap-3 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-gray-200">
                <div className="w-9 h-9 rounded-xl overflow-hidden border border-gray-700">
                  <img src={DentistImg} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="hidden md:flex flex-col leading-tight">
                  <span className="font-bold text-xs truncate max-w-[120px]">{user?.full_name || 'Shifokor'}</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Boshqaruv</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ⭐ RATING MODAL (Actual Reviews) */}
      {isRatingModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div ref={ratingModalRef} className="bg-white rounded-[32px] w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-blue-600 rounded-3xl flex flex-col items-center justify-center text-white shadow-xl shadow-blue-500/30">
                  <span className="text-3xl font-black">{stats?.average_rating || '0.0'}</span>
                  <span className="text-[10px] font-bold uppercase opacity-80 italic">O'rtacha</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900">Bemorlar fikri</h3>
                  <p className="text-gray-500 text-sm font-medium">Jami {stats?.total_reviews || 0} ta baho qoldirilgan</p>
                </div>
              </div>
              <button onClick={() => setIsRatingModalOpen(false)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 border border-gray-100 transition-all hover:rotate-90">✕</button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-white">
              {reviewsLoading ? (
                <div className="py-20 text-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto" /></div>
              ) : !reviewsData?.reviews?.length ? (
                <div className="py-20 text-center text-gray-400">
                  <MessageSquare size={48} className="mx-auto mb-4 opacity-10" />
                  <p className="font-bold italic">Hali sharhlar mavjud emas</p>
                </div>
              ) : (
                reviewsData.reviews.map(review => (
                  <div key={review.id} className="p-5 bg-gray-50 rounded-3xl border border-gray-100/50 transition-all hover:bg-white hover:shadow-md group">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-black text-gray-900 mb-0.5">{review.patient_name || 'Bemor'}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{new Date(review.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-0.5 px-3 py-1.5 bg-white rounded-full border border-gray-100 shadow-sm">
                        <Star size={14} className="text-amber-400 fill-amber-400" />
                        <span className="text-xs font-black text-gray-900 ml-1">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 font-medium leading-relaxed italic">
                      "{review.comment || 'Izoh qoldirilmagan'}"
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-center">
              <button onClick={() => setIsRatingModalOpen(false)} className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all active:scale-95 shadow-lg">Tushunarli</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;
