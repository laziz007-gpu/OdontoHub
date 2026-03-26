import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Logo from '../assets/img/icons/NotifLogo.svg';
import { getNotifications, markAsRead } from '../api/notifications';
import { Notification } from '../types/notification';

const Notifications = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await getNotifications();
            setNotifications(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching notifications:', err);
            setError('Не удалось загрузить уведомления');
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.is_read) {
            try {
                await markAsRead(notification.id);
                setNotifications(prev =>
                    prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n)
                );
            } catch (err) {
                console.error('Error marking notification as read:', err);
            }
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    };

    const formatNotificationMessage = (notification: Notification): string => {
        const { notification_type, metadata } = notification;
        
        switch (notification_type) {
            case 'appointment_reminder':
                return 'Следующий приём через 30 минут';
            case 'appointment_rescheduled':
                return `${metadata.patient_name} перенёс приём на ${metadata.new_date}`;
            case 'appointment_cancelled':
                return `${metadata.patient_name} отменил приём, причина: ${metadata.reason || 'причины нет'}`;
            case 'analytics_check':
                return 'Проверьте свои результаты работ в разделе аналитика';
            case 'rating_decreased':
                return `Рейтинг понизился до ${metadata.rating}`;
            case 'rating_increased':
                return `Рейтинг повысился до ${metadata.rating}`;
            case 'appointment_rated':
                return `${metadata.patient_name} оценил приём ${metadata.stars}✨`;
            case 'review_left':
                return `${metadata.patient_name} оставил отзыв: ${metadata.review}`;
            case 'payment_reminder':
                return 'Напоминание об оплате (3 дня до окончания)';
            default:
                return notification.message;
        }
    };

    return (
        <div className="min-h-screen bg-[#E8E8E8] flex flex-col">
            {/* Header */}
            <div className="bg-white px-4 py-6 flex items-center gap-4 sticky top-0 z-20 rounded-b-[40px] shadow-sm">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center justify-center bg-[#1D1D2B] rounded-full p-2 transition-transform active:scale-95"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#1D1D2B]">Уведомления</h1>
            </div>

            {/* Notification List */}
            <div className="flex-1 p-4 md:p-6 lg:p-10 space-y-4">
                <div className="max-w-4xl mx-auto w-full space-y-4">
                    {loading && (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Загрузка...</p>
                        </div>
                    )}
                    
                    {error && (
                        <div className="text-center py-8">
                            <p className="text-red-500">{error}</p>
                        </div>
                    )}
                    
                    {!loading && !error && notifications.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Нет уведомлений</p>
                        </div>
                    )}
                    
                    {!loading && !error && notifications.map((notif) => (
                        <div
                            key={notif.id}
                            onClick={() => handleNotificationClick(notif)}
                            className="bg-white rounded-[24px] md:rounded-[32px] p-4 md:p-6 lg:p-8 flex items-center gap-4 md:gap-6 shadow-sm border border-transparent hover:border-gray-100 transition-all cursor-pointer group active:scale-[0.98]"
                        >
                            {/* Avatar */}
                            <div className="relative shrink-0">
                                <div className="w-14 h-14 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden bg-blue-500 flex items-center justify-center p-2">
                                    <img src={Logo} alt="OdontoHub" className="w-full h-full object-contain" />
                                </div>
                                {!notif.is_read && (
                                    <div className="absolute bottom-0 right-0 w-4 h-4 md:w-5 md:h-5 bg-[#11D76A] rounded-full border-4 border-white"></div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-base md:text-xl lg:text-2xl font-black text-[#1D1D2B] truncate">{notif.title}</h3>
                                    <span className="text-gray-400 text-xs md:text-sm lg:text-base">• {formatTime(notif.created_at)}</span>
                                </div>
                                <p className="text-gray-600 text-sm md:text-lg lg:text-xl font-medium line-clamp-2 leading-tight">
                                    {formatNotificationMessage(notif)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
