import { useState } from "react";
import { ArrowLeft, User, Calendar, Clock, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DentistImg from "../assets/img/photos/Dentist.png";
import type { Appointment } from "../types/patient";
import { paths } from "../Routes/path";

const PatientAppointments = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

    const appointments: Appointment[] = [
        // Upcoming Appointments
        {
            id: 1,
            title: "Удаление зуба мудрости",
            doctor: "Махмуд Пулатов",
            specialty: "Общий-профильный стоматолог",
            date: "30 сентябрь 2025год",
            time: "11:00-12:00",
            image: DentistImg,
            type: "upcoming"
        },
        {
            id: 2,
            title: "Осмотр",
            doctor: "Махмуд Пулатов",
            specialty: "Общий-профильный стоматолог",
            date: "5 сентябрь 2025год",
            time: "11:00-12:00",
            image: DentistImg,
            type: "upcoming"
        },
        {
            id: 3,
            title: "Удаление зуба мудрости",
            doctor: "Махмуд Пулатов",
            specialty: "Общий-профильный стоматолог",
            date: "27 июнь 2025год",
            time: "11:00-12:00",
            image: DentistImg,
            type: "upcoming"
        },
        // Past Appointments
        {
            id: 101,
            doctor: "Махмуд Пулатов",
            date: "27 июнь 2025год",
            time: "18:30",
            type: "past",
            status: "success",
            statusText: t("patient.appointments.success_status"),
            rating: 4.5
        },
        {
            id: 102,
            doctor: "Махмуд Пулатов",
            date: "27 июнь 2025год",
            time: "18:30",
            type: "past",
            status: "cancelled",
            statusText: t("patient.appointments.cancelled_status"),
            commentTitle: t("patient.appointments.comment_label"),
            comment: "Характер врача ужасное"
        },
        {
            id: 103,
            doctor: "Махмуд Пулатов",
            date: "27 июнь 2025год",
            time: "18:30",
            type: "past",
            status: "rescheduled",
            statusText: t("patient.appointments.rescheduled_status"),
            newDateTitle: t("patient.appointments.new_date_label"),
            newDate: "31 июнь 2025год | 18:30"
        }
    ];

    const filteredAppointments = appointments.filter(app => app.type === activeTab);

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <div className=" px-4 py-6 flex items-center justify-center relative">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute left-4 p-2 bg-gray-900 rounded-full text-white hover:bg-gray-800 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">{t("patient.appointments.title")}</h1>
            </div>

            {/* Tabs */}
            <div className="  border-gray-200">
                <div className="flex max-w-2xl mx-auto px-4">
                    <button
                        onClick={() => setActiveTab("upcoming")}
                        className={`flex-1 py-4 text-lg font-bold transition-all relative ${activeTab === "upcoming" ? "text-gray-900" : "text-gray-400"
                            }`}
                    >
                        {t("patient.appointments.upcoming_tab")}
                        {activeTab === "upcoming" && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-900 rounded-t-full" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab("past")}
                        className={`flex-1 py-4 text-lg font-bold transition-all relative ${activeTab === "past" ? "text-gray-900" : "text-gray-400"
                            }`}
                    >
                        {t("patient.appointments.past_tab")}
                        {activeTab === "past" && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-900 rounded-t-full" />
                        )}
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                    {filteredAppointments.map((app) => (
                        activeTab === "upcoming" ? (
                            <div
                                key={app.id}
                                onClick={() => navigate(paths.patientAppointmentDetail.replace(":id", app.id.toString()))}
                                className="bg-blue-600 rounded-4xl p-4 flex gap-4 text-white shadow-xl shadow-blue-500/20 group hover:scale-[1.01] transition-transform duration-300 cursor-pointer"
                            >
                                {/* Doctor Card */}
                                <div className="w-32 h-40 sm:w-40 sm:h-48 bg-white rounded-3xl p-1 shrink-0 overflow-hidden shadow-inner">
                                    <img
                                        src={app.image}
                                        alt={app.doctor}
                                        className="w-full h-full object-cover rounded-2xl"
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <h3 className="text-xl lg:text-3xl font-bold leading-tight mb-4">
                                            {app.title}
                                        </h3>

                                        <div className="space-y-1">
                                            <div className="flex items-start gap-2">
                                                <User size={18} className="mt-1" />
                                                <div>
                                                    <p className="font-bold text-sm lg:text-xl">{app.doctor}</p>
                                                    <p className="text-[10px] lg:text-sm opacity-80">{app.specialty}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer Info */}
                                    <div className="bg-white/20 backdrop-blur-md rounded-2xl py-2 px-3 sm:px-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] lg:text-sm font-bold border border-white/10">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={14} />
                                            <span>{app.date}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={14} />
                                            <span>{app.time}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div
                                key={app.id}
                                onClick={() => navigate(paths.patientAppointmentDetail.replace(":id", app.id.toString()))}
                                className="bg-blue-600 rounded-4xl p-6 sm:p-8 flex flex-col justify-between text-white relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300 min-h-[220px] cursor-pointer"
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div className="space-y-4">
                                        <p className="text-sm sm:text-lg font-medium opacity-90">{t("patient.appointments.doctor_label")}: {app.doctor}</p>
                                        <div className="space-y-1">
                                            <p className="text-sm sm:text-lg font-medium opacity-90">{t("patient.appointments.date_time_label")}:</p>
                                            <p className="text-sm sm:text-lg lg:text-xl font-bold">{app.date} | {app.time}</p>
                                        </div>
                                    </div>

                                    {app.status === "cancelled" && (
                                        <div className="text-right max-w-[200px]">
                                            <p className="text-xs sm:text-base font-bold opacity-90">{app.commentTitle}</p>
                                            <p className="text-[10px] sm:text-sm opacity-80">{app.comment}</p>
                                        </div>
                                    )}
                                    {app.status === "rescheduled" && (
                                        <div className="text-right max-w-[200px]">
                                            <p className="text-xs sm:text-base font-bold opacity-90">{app.newDateTitle}</p>
                                            <p className="text-[10px] sm:text-sm opacity-80">{app.newDate}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between items-center mt-8">
                                    <div className="flex items-center gap-1">
                                        <Star size={20} className={app.status === "success" ? "fill-white" : ""} />
                                        {app.rating && <span className="text-sm italic opacity-80">{app.rating}</span>}
                                    </div>
                                    <div className={`px-6 py-2 rounded-2xl font-bold text-sm lg:text-base absolute bottom-0 right-0 ${app.status === "success" ? "bg-emerald-500" :
                                        app.status === "cancelled" ? "bg-red-600" :
                                            "bg-amber-400 text-gray-900"
                                        }`}>
                                        {app.statusText}
                                    </div>
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PatientAppointments;
