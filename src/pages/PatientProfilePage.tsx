import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Bell, Globe, Shield, HelpCircle, Headphones, Info, ChevronRight, LogOut, Check, X } from "lucide-react";
import DentistImg from "../assets/img/photos/Dentist.png";

const PatientProfilePage = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

    const languages = [
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

    const menuItems = [
        { icon: <Bell size={24} />, label: t("patient.profile.notification"), color: "bg-white", textColor: "text-gray-900" },
        {
            icon: <Globe size={24} />,
            label: t("patient.profile.language"),
            onClick: () => setIsLanguageModalOpen(true),
            value: languages.find(l => l.code === i18n.language)?.name || "Русский"
        },
    ];

    const supportItems = [
        { icon: <Shield size={20} />, label: t("settings.support_items.privacy_policy"), path: "#" },
        { icon: <HelpCircle size={20} />, label: t("settings.support_items.faq"), path: "#" },
        { icon: <Headphones size={20} />, label: t("settings.support_items.contact"), path: "#" },
        { icon: <Info size={20} />, label: t("settings.support_items.about"), path: "#" },
    ];

    return (
        <div className="min-h-screen bg-[#F5F7FF] pb-32">
            {/* Centered Container */}
            <div className="max-w-xl mx-auto w-full px-4">
                {/* Header */}
                <div className="py-8 flex items-center justify-center relative">
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute left-0 p-3 bg-[#1D1D2B] rounded-full text-white hover:bg-gray-800 transition-all active:scale-95 shadow-lg"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-3xl font-black text-[#1D1D2B] tracking-tight">{t("patient.profile.title")}</h1>
                </div>

                {/* Profile Section */}
                <div className="flex flex-col items-center space-y-6">
                    {/* Large Avatar */}
                    <div className="relative group">
                        <div className="w-56 h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-8 border-white shadow-2xl transition-transform duration-500 group-hover:scale-105">
                            <img
                                src={DentistImg}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute inset-0 bg-black/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </div>

                    {/* Name & Phone Card */}
                    <div className="bg-white rounded-4xl p-8 w-full shadow-sm text-center md:text-left">
                        <h2 className="text-2xl font-black text-[#1D1D2B] leading-tight">Дункан Факовский</h2>
                        <p className="text-base font-bold text-gray-400 mt-1 tracking-wide">+998 (90) 123 45 67</p>
                    </div>

                    {/* Personal Stats Card */}
                    <div className="bg-white rounded-4xl p-8 w-full shadow-sm space-y-6">
                        <div className="space-y-1">
                            <p className="text-xs font-black uppercase text-gray-300 tracking-[0.15em]">{t("patient.profile.gender")}</p>
                            <p className="text-xl font-black text-[#1D1D2B]">{t("patient.profile.male")}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-black uppercase text-gray-300 tracking-[0.15em]">{t("patient.profile.birth_date")}</p>
                            <p className="text-xl font-black text-[#1D1D2B]">26 лет (20.09.2000)</p>
                        </div>
                    </div>

                    {/* Settings Cards */}
                    <div className="w-full space-y-4">
                        {menuItems.map((item, idx) => (
                            <div
                                key={idx}
                                onClick={item.onClick}
                                className="bg-white rounded-4xl p-6 flex items-center justify-between shadow-sm cursor-pointer hover:bg-gray-50 transition-all active:scale-[0.98] group"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-[#F5F7FF] rounded-2xl flex items-center justify-center text-[#1D1D2B] group-hover:bg-[#4361EE] group-hover:text-white transition-colors">
                                        {item.icon}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xl font-black text-[#1D1D2B]">{item.label}</span>
                                        {item.value && <span className="text-sm font-bold text-blue-500">{item.value}</span>}
                                    </div>
                                </div>
                                <ChevronRight className="text-gray-300 group-hover:text-[#4361EE] transition-colors" size={28} />
                            </div>
                        ))}
                    </div>

                    {/* Support Block */}
                    <div className="bg-white rounded-[2.5rem] p-4 w-full shadow-sm overflow-hidden">
                        {supportItems.map((item, idx) => (
                            <div
                                key={idx}
                                className={`flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-all hover:px-7
                                    ${idx !== supportItems.length - 1 ? 'border-b border-gray-50' : ''}`}
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 bg-[#F5F7FF] rounded-xl flex items-center justify-center text-[#1D1D2B]">
                                        {item.icon}
                                    </div>
                                    <span className="text-lg font-extrabold text-[#1D1D2B] tracking-tight">{item.label}</span>
                                </div>
                                <ArrowLeft className="text-gray-300 rotate-180" size={20} />
                            </div>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full space-y-4 pt-4">
                        <button className="w-full bg-[#4361EE] text-white py-6 rounded-full text-xl font-black shadow-xl shadow-blue-500/30 hover:brightness-105 active:scale-[0.98] transition-all">
                            {t("patient.profile.edit")}
                        </button>
                        <button className="w-full bg-[#1D1D2B] text-white py-6 rounded-full text-xl font-black shadow-xl hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-4">
                            <LogOut size={24} />
                            {t("patient.profile.logout")}
                        </button>
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
        </div>
    );
};

export default PatientProfilePage;
