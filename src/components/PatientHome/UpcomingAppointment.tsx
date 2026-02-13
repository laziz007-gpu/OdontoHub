import { ArrowUpRight, Users, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";

const UpcomingAppointment = () => {
    const { t } = useTranslation();

    return (
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
    );
};

export default UpcomingAppointment;
