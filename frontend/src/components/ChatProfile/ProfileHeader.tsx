import { ArrowLeft, MoreVertical, Trash2, Star, Megaphone, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProfileHeaderProps {
    isMenuOpen: boolean;
    onMenuToggle: () => void;
}

const ProfileHeader = ({ isMenuOpen, onMenuToggle }: ProfileHeaderProps) => {
    const navigate = useNavigate();

    return (
        <div className="flex justify-between items-center mb-2">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 hover:text-gray-600 transition-colors">
                <ArrowLeft size={24} strokeWidth={2.5} />
            </button>
            <div className="relative">
                <button
                    onClick={onMenuToggle}
                    className="p-2 -mr-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                    <MoreVertical size={28} />
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={onMenuToggle}
                        ></div>
                        <div className="absolute right-0 top-10 w-[180px] bg-[#5B7FFF] rounded-2xl shadow-xl overflow-hidden z-20 animate-in fade-in zoom-in duration-200">
                            {[
                                { label: 'Удалить чат', icon: <Trash2 size={16} /> },
                                { label: 'В избранные', icon: <Star size={16} /> },
                                { label: 'Уведомление', icon: <Megaphone size={16} /> },
                                { label: 'В контакты', icon: <UserPlus size={16} /> }
                            ].map((item, i) => (
                                <button
                                    key={i}
                                    className={`w-full flex items-center justify-between px-5 py-3 text-white font-bold text-[13px] hover:bg-white/10 transition-colors
                                        ${i !== 3 ? 'border-b border-white/20' : ''}`}
                                >
                                    <span>{item.label}</span>
                                    {item.icon}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProfileHeader;
