import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../store/slices/userSlice";
import { paths } from "../Routes/path";
import type { RootState } from "../store/store";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Bell, Globe, Shield, HelpCircle, Headphones, Info, ChevronRight, LogOut, Check, X, Camera } from "lucide-react";
import DentistImg from "../assets/img/photos/Dentist.png";
import type { Language, MenuItem, SupportItem } from "../types/patient";
import EditProfileModal from "../components/Shared/EditProfileModal";

const PatientProfilePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const user = useSelector((state: RootState) => state.user.user);

    const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [userData, setUserData] = useState({
        name: user?.full_name || "Дункан Факовский",
        phone: user?.phone || "+998 (90) 123 45 67",
        gender: "Мужчина",
        age: "26 лет",
        address: "г. Ташкент",
        avatar: DentistImg
    });

    useEffect(() => {
        if (user) {
            setUserData(prev => ({
                ...prev,
                name: user.full_name || prev.name,
                phone: user.phone || prev.phone
            }));
        }
    }, [user]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const languages: Language[] = [
        { code: "ru", name: "Русский", flag: "🇷🇺" },
        { code: "uz", name: "O'zbekcha", flag: "🇺🇿" },
        { code: "en", name: "English", flag: "🇺🇸" },
        { code: "kz", name: "Қазақша", flag: "🇰🇿" },
    ];

    const changeLanguage = (code: string) => {
        i18n.changeLanguage(code);
        localStorage.setItem('appLanguage', code);
        setIsLanguageModalOpen(false);
    };

    const handleSaveProfile = (newData: any) => {
        setUserData(prev => ({ ...prev, ...newData }));
        setIsEditModalOpen(false);
    };

    const handleLogout = () => {
        // 1. Очищаем токен
        localStorage.removeItem('access_token');
        // 2. Очищаем Redux state
        dispatch(clearUser());
        // 3. Редирект на вход
        navigate(paths.login, { replace: true });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setUserData(prev => ({ ...prev, avatar: url }));
        }
    };

    const triggerAvatarUpload = () => {
        fileInputRef.current?.click();
    };

    const menuItems: MenuItem[] = [
        { icon: <Bell size={24} />, label: t("patient.profile.notification"), color: "bg-white", textColor: "text-gray-900" },
        {
            icon: <Globe size={24} />,
            label: t("patient.profile.language"),
            onClick: () => setIsLanguageModalOpen(true),
            value: languages.find(l => l.code === i18n.language)?.name || "Русский"
        },
    ];

    const supportItems: SupportItem[] = [
        { icon: <Shield size={20} />, label: t("settings.support_items.privacy_policy"), path: "#" },
        { icon: <HelpCircle size={20} />, label: t("settings.support_items.faq"), path: "#" },
        { icon: <Headphones size={20} />, label: t("settings.support_items.contact"), path: "#" },
        { icon: <Info size={20} />, label: t("settings.support_items.about"), path: "#" },
    ];

    return (
        <div className="min-h-screen bg-[#F5F7FF] pb-32">
            {/* Centered Container */}
            {/* Centered Container */}
            {/* Centered Main Content Area */}
            <div className="max-w-5xl mx-auto w-full px-4 md:px-6">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    className="hidden"
                    accept="image/*"
                />
                {/* Header */}
                <div className="py-8 flex items-center justify-between relative mb-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-3 bg-white border border-gray-100 rounded-2xl text-[#1D1D2B] hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl md:text-3xl font-black text-[#1D1D2B] tracking-tight">{t("patient.profile.title")}</h1>
                    <div className="w-12"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Panel: Profile Overview (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                            {/* Avatar */}
                            <div className="relative mb-6">
                                <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white shadow-xl">
                                    <img
                                        src={userData.avatar}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <button
                                    onClick={triggerAvatarUpload}
                                    className="absolute bottom-2 right-2 p-3 bg-[#4361EE] text-white rounded-2xl shadow-lg border-4 border-white hover:scale-110 transition-transform"
                                >
                                    <Camera size={20} />
                                </button>
                            </div>

                            <h2 className="text-2xl font-black text-[#1D1D2B]">{userData.name}</h2>
                            <p className="text-gray-400 font-bold mt-1">{userData.phone}</p>

                            <div className="w-full mt-8 pt-8 border-t border-gray-50 grid grid-cols-2 gap-4">
                                <div className="text-left">
                                    <p className="text-[10px] font-black uppercase text-gray-300 tracking-widest">{t("patient.profile.gender")}</p>
                                    <p className="text-sm font-bold text-[#1D1D2B] mt-1">{userData.gender === "Мужчина" ? t("patient.profile.male") : t("patient.profile.female")}</p>
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] font-black uppercase text-gray-300 tracking-widest">{t("patient.profile.birth_date")}</p>
                                    <p className="text-sm font-bold text-[#1D1D2B] mt-1">{userData.age}</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons in Left Panel */}
                        <div className="space-y-4">
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="w-full bg-[#4361EE] text-white py-5 rounded-[2rem] text-lg font-black shadow-lg shadow-blue-500/20 hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
                            >
                                {t("patient.profile.edit")}
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full bg-white text-[#EA4335] border-2 border-transparent hover:border-[#EA4335]/10 py-5 rounded-[2rem] text-lg font-black transition-all flex items-center justify-center gap-3 cursor-pointer"
                            >
                                <LogOut size={20} />
                                {t("patient.profile.logout")}
                            </button>
                        </div>
                    </div>

                    {/* Right Panel: Settings & Options (8 cols) */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Settings Group */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-6">{t("patient.profile.settings")}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                                {menuItems.map((item, idx) => (
                                    <div
                                        key={idx}
                                        onClick={item.onClick}
                                        className="bg-white rounded-[2rem] p-5 flex items-center justify-between shadow-sm cursor-pointer hover:shadow-md hover:translate-x-1 transition-all group border border-gray-50"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-[#F5F7FF] rounded-2xl flex items-center justify-center text-[#1D1D2B] group-hover:bg-[#4361EE] group-hover:text-white transition-colors">
                                                {item.icon}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-lg font-black text-[#1D1D2B]">{item.label}</span>
                                                {item.value && <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">{item.value}</span>}
                                            </div>
                                        </div>
                                        <ChevronRight className="text-gray-300 group-hover:text-[#4361EE] transition-colors" size={24} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Support Group */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-6">{t("patient.profile.support")}</h3>
                            <div className="bg-white rounded-[2.5rem] p-2 shadow-sm border border-gray-50">
                                {supportItems.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-all rounded-3xl group
                                            ${idx !== supportItems.length - 1 ? 'border-b border-gray-50 sm:border-b-0' : ''}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-[#F5F7FF] rounded-xl flex items-center justify-center text-[#1D1D2B] group-hover:text-[#4361EE] transition-colors">
                                                {item.icon}
                                            </div>
                                            <span className="text-base font-bold text-[#1D1D2B]">{item.label}</span>
                                        </div>
                                        <ChevronRight size={18} className="text-gray-300 group-hover:text-[#4361EE] transition-all" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Language Selection Modal */}
            {isLanguageModalOpen && (
                <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsLanguageModalOpen(false)}></div>
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 relative z-10 animate-in slide-in-from-bottom duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black text-[#1D1D2B]">{t("patient.profile.select_language")}</h3>
                            <button
                                onClick={() => setIsLanguageModalOpen(false)}
                                className="p-2 bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => changeLanguage(lang.code)}
                                    className={`w-full flex items-center justify-between p-5 rounded-3xl transition-all border-2
                                        ${i18n.language === lang.code
                                            ? "border-[#4361EE] bg-blue-50/50"
                                            : "border-gray-50 bg-gray-50/50 hover:border-gray-200"}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl">{lang.flag}</span>
                                        <span className={`text-xl font-black ${i18n.language === lang.code ? "text-[#4361EE]" : "text-[#1D1D2B]"}`}>
                                            {lang.name}
                                        </span>
                                    </div>
                                    {i18n.language === lang.code && (
                                        <div className="bg-[#4361EE] text-white p-1 rounded-full">
                                            <Check size={16} strokeWidth={4} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Profile Modal */}
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                initialData={userData}
                onSave={handleSaveProfile}
                avatar={userData.avatar}
                triggerAvatarUpload={triggerAvatarUpload}
            />
        </div>
    );
};

export default PatientProfilePage;
