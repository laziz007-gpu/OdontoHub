import { Search, Bell, Stethoscope, Sparkles, Scissors, ArrowUpRight, Users, MessageSquare, Calendar, Shield, Leaf, Plus } from "lucide-react";
import Rasm from "../assets/img/icons/image 4 (1).svg"
import Rasm2 from "../assets/img/icons/image 4.svg"
import Rasm3 from "../assets/img/icons/image 4 (2).svg"
import Rasm4 from "../assets/img/icons/image 4 (3).svg"
import ScrollUp from "../assets/img/icons/Scroll Up.svg"
import Doctor from "../assets/img/icons/healthicons_doctor-male.svg"
import Consultation from "../assets/img/icons/Consultation.svg"
import Notification2 from "../assets/img/icons/Notification2.svg"
import { useTranslation } from "react-i18next";
import { paths } from "../Routes/path";
import type { Service, QuickAction } from "../types/patient";

const PatientHome = () => {
    const { t } = useTranslation();
    const services: Service[] = [
        { icon: Rasm, label: "Все" },
        { icon: Rasm2, label: "Лечение" },
        { icon: Rasm3, label: "Гигиена" },
        { icon: Rasm4, label: "Хирургия" },
    ];

    const quickActions: QuickAction[] = [
        { label: "Запись к стоматологу", icon: ScrollUp, color: "bg-blue-600 text-white", path: "#" },
        { label: "Врачи", icon: Doctor, color: "bg-white text-blue-600", path: "#" },
        { label: "Чат", icon: Consultation, color: "bg-emerald-400 text-white", path: paths.chats },
        { label: "Уведомление", icon: Notification2, color: "bg-amber-400 text-white", path: paths.patientAppointmentDetail.replace(":id", "1") },
    ];

    return (
        <div className="p-4 space-y-8 pb-24 max-w-7xl mx-auto w-full">
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto w-full">
                <input
                    type="text"
                    placeholder={t("patient.home.search")}
                    className="w-full bg-white border-none rounded-full py-5 pl-14 pr-6 text-lg font-bold text-gray-700 shadow-xl shadow-blue-500/5 focus:ring-2 focus:ring-blue-500/20"
                />
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
            </div>

            {/* Upcoming Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl md:text-3xl font-extrabold text-gray-900 tracking-tight">{t("patient.home.upcoming")}</h2>
                    <button className="text-blue-600 font-bold text-sm md:text-lg flex items-center gap-1 hover:gap-2 transition-all">
                        {t("analytics.filter.all")}
                        <ArrowUpRight size={20} />
                    </button>
                </div>
                <div className="bg-blue-600 rounded-4xl p-6 lg:p-10 text-white space-y-6 shadow-xl shadow-blue-500/20 relative overflow-hidden group">
                    <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>

                    <div className="flex flex-col md:flex-row md:items-center gap-6 lg:gap-10 relative z-10">
                        <div className="w-20 h-20 lg:w-32 lg:h-32 rounded-2xl md:rounded-4xl overflow-hidden bg-white/20 ring-4 ring-white/10 shrink-0">
                            <img
                                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop"
                                alt="Doctor"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        <div className="flex-1 space-y-2 lg:space-y-4">
                            <h3 className="text-xl lg:text-4xl font-black">Удаление зуба мудрости</h3>
                            <div className="flex items-center gap-2 opacity-90 text-sm lg:text-xl">
                                <Users size={20} className="lg:size-6" />
                                <span className="font-bold">Махмуд Пулатов</span>
                            </div>
                            <p className="text-xs lg:text-base opacity-75 font-bold tracking-wide uppercase">Общий-профильный стоматолог</p>
                        </div>
                        <div className="hidden md:block">
                            <button className="bg-white text-blue-600 px-8 py-4 rounded-2xl lg:rounded-3xl font-black text-sm lg:text-lg hover:bg-blue-50 transition-all active:scale-95">
                                Подробнее
                            </button>
                        </div>
                    </div>

                    <div className="bg-white/15 backdrop-blur-xl rounded-2xl lg:rounded-3xl py-4 px-6 lg:px-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs lg:text-lg font-black border border-white/10 relative z-10">
                        <div className="flex items-center gap-3">
                            <Calendar size={16} className="lg:size-6" />
                            <span>27 июнь 2025год</span>
                        </div>
                        <div className="w-px h-6 bg-white/20 hidden sm:block"></div>
                        <div className="flex items-center gap-3">
                            <span className="opacity-80">До prityoma:</span>
                            <span className="font-mono text-sm lg:text-xl tracking-wider">20 kun 15:47:38</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl md:text-3xl font-extrabold text-gray-900 tracking-tight">{t("patient.home.services")}</h2>
                    <button className="p-2.5 bg-white rounded-full shadow-lg text-blue-600 hover:scale-110 active:scale-95 transition-all">
                        <Plus size={24} />
                    </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                    {services.map((service, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-4xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 md:p-8 lg:p-12 flex flex-col items-center justify-center gap-4 md:gap-6 cursor-pointer group border border-gray-100 hover:border-gray-200 active:scale-95"
                        >
                            <div className="flex items-center justify-center text-gray-700 group-hover:text-blue-600 transition-colors">
                                <div className="scale-[1.5] md:scale-[2] lg:scale-[2.5]">
                                    <img className="w-[36px] h-[36px]" src={service.icon} alt="" />
                                </div>
                            </div>
                            <span className="text-xs md:text-sm lg:text-lg text-gray-700 font-extrabold text-center group-hover:text-blue-600 transition-colors uppercase tracking-wider">
                                {service.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {quickActions.map((action, idx) => (
                    <div
                        key={idx}
                        className={`${action.color} rounded-4xl p-6 md:p-10 flex flex-col justify-between min-h-[160px] md:min-h-[220px] lg:min-h-[280px] shadow-md transition-all duration-500 border border-transparent`}
                    >
                        <div className="flex flex-col items-center justify-center py-2 h-full">
                            <div className="flex mb-4 lg:mb-8">
                                <img className="w-[80px] h-[80px] lg:w-[120px] lg:h-[120px] object-contain" src={action.icon} alt="" />
                            </div>

                            <div className="flex items-center justify-center">
                                <span className="text-base md:text-xl lg:text-2xl font-black leading-tight text-center tracking-tight">
                                    {action.label}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PatientHome;
