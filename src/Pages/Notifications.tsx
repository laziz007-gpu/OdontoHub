import { useNavigate } from 'react-router-dom';
import Logo from '../assets/img/icons/NotifLogo.svg';

const Notifications = () => {
    const navigate = useNavigate();

    const notifications = [
        {
            id: 1,
            title: "OdontoHub",
            time: "8:34",
            message: "У вас через 1час приём",
            isNew: true
        },
        {
            id: 2,
            title: "OdontoHub",
            time: "8:34",
            message: "У вас через 2час приём",
            isNew: true
        }
    ];

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
                    {notifications.map((notif) => (
                        <div
                            key={notif.id}
                            className="bg-white rounded-[24px] md:rounded-[32px] p-4 md:p-6 lg:p-8 flex items-center gap-4 md:gap-6 shadow-sm border border-transparent hover:border-gray-100 transition-all cursor-pointer group active:scale-[0.98]"
                        >
                            {/* Avatar */}
                            <div className="relative shrink-0">
                                <div className="w-14 h-14 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden bg-blue-500 flex items-center justify-center p-2">
                                    <img src={Logo} alt="OdontoHub" className="w-full h-full object-contain" />
                                </div>
                                {notif.isNew && (
                                    <div className="absolute bottom-0 right-0 w-4 h-4 md:w-5 md:h-5 bg-[#11D76A] rounded-full border-4 border-white"></div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-base md:text-xl lg:text-2xl font-black text-[#1D1D2B] truncate">{notif.title}</h3>
                                    <span className="text-gray-400 text-xs md:text-sm lg:text-base">• {notif.time}</span>
                                </div>
                                <p className="text-gray-600 text-sm md:text-lg lg:text-xl font-medium line-clamp-2 leading-tight">
                                    {notif.message}
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
