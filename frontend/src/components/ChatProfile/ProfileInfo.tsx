import { MessageSquare, Phone, Video } from "lucide-react";

interface ProfileInfoProps {
    avatar: string;
    name: string;
    status: string;
    phone: string;
}

const ProfileInfo = ({ avatar, name, status, phone }: ProfileInfoProps) => {
    return (
        <div className="flex flex-col items-center text-center">
            <div className="relative mb-6">
                <div className="w-[140px] h-[140px] rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="absolute bottom-2 right-2 w-7 h-7 bg-emerald-400 border-4 border-white rounded-full"></div>
            </div>

            <h2 className="text-3xl font-black text-[#5B7FFF] mb-1">{name}</h2>
            <p className="text-sm font-bold text-gray-400 mb-8">{status}</p>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-4 w-full mb-10">
                {[
                    { icon: <MessageSquare size={26} fill="currentColor" />, label: 'Сообщения' },
                    { icon: <Phone size={26} fill="currentColor" />, label: 'Звонок' },
                    { icon: <Video size={26} fill="currentColor" />, label: 'Видео' }
                ].map((action, idx) => (
                    <button key={idx} className="bg-[#EFEEEE] rounded-[24px] py-4 flex flex-col items-center gap-1 group transition-all active:scale-95">
                        <div className="text-[#5B7FFF]">
                            {action.icon}
                        </div>
                        <span className="text-[#5B7FFF] text-[13px] font-bold">{action.label}</span>
                    </button>
                ))}
            </div>

            {/* Contact & Links */}
            <div className="w-full flex items-center justify-between pt-2">
                <div className="text-left">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Телефон</p>
                    <p className="text-xl font-black text-[#1D1D2B]">{phone}</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-[#5B7FFF] text-white px-5 py-2.5 rounded-xl text-sm font-black shadow-md shadow-blue-500/20 active:scale-95 transition-all">
                        Ссылка
                    </button>
                    <button className="bg-[#5B7FFF] text-white px-5 py-2.5 rounded-xl text-sm font-black shadow-md shadow-blue-500/20 active:scale-95 transition-all">
                        QR-kod
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileInfo;
