import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DentistImg from "../assets/img/photos/Dentist.png";
import AppointmentTabs from "../components/PatientAppointments/AppointmentTabs";
import UpcomingAppointmentCard from "../components/PatientAppointments/UpcomingAppointmentCard";
import PastAppointmentCard from "../components/PatientAppointments/PastAppointmentCard";
import type { Appointment } from "../types/patient";

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
            <div className="px-4 py-6 flex items-center justify-center relative">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute left-4 p-2 bg-gray-900 rounded-full text-white hover:bg-gray-800 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">{t("patient.appointments.title")}</h1>
            </div>

            <AppointmentTabs activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                    {filteredAppointments.map((app) => (
                        activeTab === "upcoming" ? (
                            <UpcomingAppointmentCard key={app.id} appointment={app} />
                        ) : (
                            <PastAppointmentCard key={app.id} appointment={app} />
                        )
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PatientAppointments;
