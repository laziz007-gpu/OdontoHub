import { Link } from "react-router-dom";
import ScrollUp from "../../assets/img/icons/Scroll Up.svg";
import Doctor from "../../assets/img/icons/healthicons_doctor-male.svg";
import Consultation from "../../assets/img/icons/Consultation.svg";
import Notification2 from "../../assets/img/icons/Notification2.svg";
import { paths } from "../../Routes/path";
import type { QuickAction } from "../../types/patient";

const QuickActionsGrid = () => {
    const quickActions: QuickAction[] = [
        { label: "Запись к стоматологу", icon: ScrollUp, color: "bg-blue-600 text-white", path: paths.booking },
        { label: "Врачи", icon: Doctor, color: "bg-white text-blue-600", path: paths.doctors },
        { label: "Мой стоматолог", icon: Consultation, color: "bg-emerald-400 text-white", path: paths.myDentist },
        // Temporarily disabled - uncomment to enable notifications:
        // { label: "Уведомление", icon: Notification2, color: "bg-amber-400 text-white", path: paths.notifications },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {quickActions.map((action, idx) => (
                <Link
                    key={idx}
                    to={action.path}
                    className={`${action.color} rounded-4xl p-6 md:p-10 flex flex-col justify-between min-h-[160px] md:min-h-[220px] lg:min-h-[280px] shadow-md transition-all duration-500 border border-transparent hover:scale-[1.02]`}
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
                </Link>
            ))}
        </div>
    );
};

export default QuickActionsGrid;
