import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import Rasm from "../../assets/img/icons/image 4 (1).svg";
import Rasm2 from "../../assets/img/icons/image 4.svg";
import Rasm3 from "../../assets/img/icons/image 4 (2).svg";
import Rasm4 from "../../assets/img/icons/image 4 (3).svg";
import type { Service } from "../../types/patient";

const ServicesGrid = () => {
    const { t } = useTranslation();

    const services: Service[] = [
        { icon: Rasm, label: "Все" },
        { icon: Rasm2, label: "Лечение" },
        { icon: Rasm3, label: "Гигиена" },
        { icon: Rasm4, label: "Хирургия" },
    ];

    return (
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
    );
};

export default ServicesGrid;
