import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUnreadCount, getNotifications, markAsRead } from '../../api/notifications';
import { Notification } from '../../types/notification';

const NotificationBadge = () => {
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchUnreadCount();
        
        // Poll for updates every 30 seconds
        const interval = setInterval(fetchUnreadCount, 30000);
        
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const fetchUnreadCount = async () => {
        try {
            const count = await getUnreadCount();
            setUnreadCount(count);
        } catch (err) {
            console.error('Error fetching unread count:', err);
        }
    };

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await getNotifications();
            setNotifications(data.slice(0, 6)); // Показываем только первые 6
        } catch (err) {
            console.error('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleClick = () => {
        if (!isOpen) {
            fetchNotifications();
        }
        setIsOpen(!isOpen);
    };

    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.is_read) {
            try {
                await markAsRead(notification.id);
                setNotifications(prev =>
                    prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n)
                );
                fetchUnreadCount();
            } catch (err) {
                console.error('Error marking notification as read:', err);
            }
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) {
            return `${diffMins} мин`;
        } else if (diffHours < 24) {
            return `${diffHours} ч`;
        } else {
            return `${diffDays} д`;
        }
    };

    const formatNotificationMessage = (notification: Notification): string => {
        const { notification_type, notification_data } = notification;
        
        switch (notification_type) {
            case 'appointment_reminder':
                return 'Следующий приём через 15 минут';
            case 'appointment_rescheduled':
                return `Перенес приём на ${notification_data?.new_time || ''}`;
            case 'appointment_cancelled':
                return `Отменил приём`;
            case 'analytics_check':
                return 'Напоминание: ежемесячная оплата';
            case 'rating_decreased':
                return `Рейтинг понизился до ${notification_data?.new_rating || ''}`;
            case 'rating_increased':
                return `Рейтинг повысился до ${notification_data?.new_rating || ''}`;
            case 'appointment_rated':
                return `Поставил вам ${notification_data?.rating || 5} ★★★★★`;
            case 'review_left':
                return 'Оставил подробный отзыв';
            case 'payment_reminder':
                return 'Ждёт вашего ответа уже 4+ часа';
            default:
                return notification.message;
        }
    };

    const getInitial = (title: string) => {
        if (title === 'OdontoHub') return 'O';
        return title.charAt(0).toUpperCase();
    };

    return (
        <div className="relative" ref={modalRef}>
            <button
                onClick={handleClick}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label={`${unreadCount} непрочитанных уведомлений`}
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Modal */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-[400px] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="text-xl font-black text-[#1D1D2B]">Notifications</h3>
                        {unreadCount > 0 && (
                            <span className="bg-blue-100 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">
                                {unreadCount} new
                            </span>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-[500px] overflow-y-auto">
                        {loading ? (
                            <div className="p-8 text-center text-gray-500">
                                Загрузка...
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                Нет уведомлений
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    onClick={() => handleNotificationClick(notif)}
                                    className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-b-0"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Avatar */}
                                        <div className="relative shrink-0">
                                            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                                                {getInitial(notif.title)}
                                            </div>
                                            {!notif.is_read && (
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <h4 className="font-bold text-[#1D1D2B] text-sm">
                                                    {notif.title}
                                                </h4>
                                                <span className="text-xs text-gray-400 shrink-0">
                                                    {formatTime(notif.created_at)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {formatNotificationMessage(notif)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="px-6 py-4 border-t border-gray-100">
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    navigate('/notifications');
                                }}
                                className="w-full text-center text-blue-600 font-bold text-sm hover:text-blue-700 transition-colors"
                            >
                                Show all
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBadge;
