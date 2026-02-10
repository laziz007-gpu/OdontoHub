import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home, Calendar, MessageSquare, FileText, User } from "lucide-react";
import { paths } from "../Routes/path";
import Logo from "../assets/img/icons/Logo2.svg";
const PatientNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const navItems = [
        { icon: <Home size={24} />, path: paths.patientHome, label: t("patient.navbar.home") },
        { icon: <Calendar size={24} />, path: paths.patientCalendar, label: t("patient.navbar.appointments") },
        { icon: <MessageSquare size={24} />, path: paths.patientChats, label: t("patient.navbar.chats") },
        { icon: <FileText size={24} />, path: paths.patientHistory, label: t("patient.navbar.history") },
        { icon: <User size={24} />, path: paths.patientProfileSettings, label: t("patient.navbar.profile") },
    ];

    return (
        <>
            {/* Mobile Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0  px-4 py-2 flex justify-around items-center z-50 sm:hidden">
                {navItems.map((item, index) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={index}
                            onClick={() => navigate(item.path)}
                            className={`flex flex-col items-center gap-1 transition-colors ${isActive ? "text-blue-600" : "text-gray-400"
                                }`}
                        >
                            <div className={`p-2 rounded-xl transition-all ${isActive ? "bg-blue-50 text-blue-600" : ""
                                }`}>
                                {item.icon}
                            </div>
                            {isActive && <span className="text-[10px] font-medium">{item.label}</span>}
                        </button>
                    );
                })}
            </nav>

            {/* Desktop Sidebar Navigation */}
            <aside className="hidden sm:flex fixed left-0 top-0 bottom-0 w-20 lg:w-64 bg-white border-r border-gray-200 flex-col py-8 z-50">
                <div className="px-6 mb-10 hidden lg:block">
                    <img src={Logo} alt="" />
                </div>
                <div className="px-4 lg:px-6 space-y-4">
                    {navItems.map((item, index) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={index}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-4 p-3 lg:px-4 rounded-2xl transition-all duration-300 group ${isActive
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                                    : "text-gray-400 hover:bg-gray-100"
                                    }`}
                            >
                                <div className={`${isActive ? "text-white" : "group-hover:text-blue-600 transition-colors"}`}>
                                    {item.icon}
                                </div>
                                <span className={`font-bold text-sm lg:text-base hidden lg:block`}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </aside>
        </>
    );
};

export default PatientNavbar;
