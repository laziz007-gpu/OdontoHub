import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DentistImg from "../assets/img/photos/Dentist.png";

const PatientAppointmentDetail = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    // In a real app, you would fetch the appointment data by ID
    const appointment = {
        title: "Удаление зуба мудрости",
        date: "30 сентябрь",
        time: "16:00",
        doctor: {
            name: "Махмуд Пулатов",
            direction: "Ортодонтия",
            experience: "3 года",
            rating: "4.7",
            image: DentistImg
        },
        details: {
            status: "запланирован",
            date: "25.10.2025",
            duration: "40 минут",
            tip: "Принести снимки рентгена",
            notes: "Нету заметок"
        },
        price: "500.000сум"
    };

    return (
        <div className="min-h-screen flex flex-col max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="px-4 py-8 flex flex-col gap-2 relative">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2.5 bg-[#1D1D2B] rounded-full text-white hover:bg-gray-800 transition-colors shrink-0"
                    >
                        <ArrowLeft size={22} />
                    </button>
                    <div className="flex flex-col">
                        <h1 className="text-2xl lg:text-4xl font-black text-gray-900 leading-tight">
                            {appointment.title}
                        </h1>
                        <p className="text-lg lg:text-2xl font-bold text-gray-900 opacity-90">
                            {appointment.date} | {appointment.time}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 px-4 pb-24 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
                    {/* Left Column: Doctor Info & Price */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Doctor Info Card */}
                        <div className="bg-[#4361EE] rounded-4xl p-5 flex gap-4 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
                            <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white rounded-4xl p-1 shrink-0 overflow-hidden shadow-inner flex items-center justify-center">
                                <img
                                    src={appointment.doctor.image}
                                    alt={appointment.doctor.name}
                                    className="w-full h-full object-cover rounded-4xl"
                                />
                            </div>
                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div className="space-y-1">
                                    <h3 className="text-lg sm:text-xl lg:text-2xl font-extrabold">{appointment.doctor.name}</h3>
                                    <div className="space-y-0.5 mt-2">
                                        <p className="text-[10px] sm:text-xs lg:text-sm font-bold opacity-90 uppercase tracking-wider">{t("patient.appointment_detail.direction_label")}: {appointment.doctor.direction}</p>
                                        <p className="text-[10px] sm:text-xs lg:text-sm font-bold opacity-90 uppercase tracking-wider">{t("patient.appointment_detail.experience_label")}: {appointment.doctor.experience}</p>
                                        <p className="text-[10px] sm:text-xs lg:text-sm font-bold opacity-90 uppercase tracking-wider">{t("patient.appointment_detail.rating_label")}: {appointment.doctor.rating}</p>
                                    </div>
                                </div>
                                <button className="bg-white text-[#4361EE] px-4 py-1.5 rounded-full text-[10px] sm:text-xs lg:text-sm font-black self-start mt-2 hover:bg-gray-50 transition-colors flex items-center gap-2">
                                    {t("patient.appointment_detail.view_doctor")} <ArrowLeft size={12} className="rotate-180" />
                                </button>
                            </div>
                        </div>

                        {/* Price Card */}
                        <div className="bg-[#4361EE] rounded-4xl p-6 lg:p-10 text-white space-y-1 shadow-xl shadow-blue-500/20">
                            <p className="text-lg lg:text-xl font-extrabold opacity-90">{t("patient.appointment_detail.price")}:</p>
                            <h2 className="text-4xl lg:text-6xl font-black">{appointment.price}</h2>
                        </div>
                    </div>

                    {/* Right Column: Details & Actions */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Details Section */}
                        <div className="bg-white rounded-[2.5rem] p-8 border-2 border-[#1D1D2B]/10 space-y-6">
                            <div className="flex flex-col gap-1">
                                <p className="text-base sm:text-lg lg:text-xl font-extrabold text-gray-900">
                                    <span className="opacity-70 font-bold">{t("patient.appointment_detail.status_label")}:</span> {appointment.details.status}
                                </p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-base sm:text-lg lg:text-xl font-extrabold text-gray-900">
                                    <span className="opacity-70 font-bold">{t("patient.appointment_detail.when_label")}:</span> {appointment.details.date}
                                </p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-base sm:text-lg lg:text-xl font-extrabold text-gray-900">
                                    <span className="opacity-70 font-bold">{t("patient.appointment_detail.duration_label")}:</span> {appointment.details.duration}
                                </p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-base sm:text-lg lg:text-xl font-extrabold text-gray-900">
                                    <span className="opacity-70 font-bold">{t("patient.appointment_detail.tip_label")}:</span> {appointment.details.tip}
                                </p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-base sm:text-lg lg:text-xl font-extrabold text-gray-900">
                                    <span className="opacity-70 font-bold">{t("patient.appointment_detail.notes_label")}:</span> {appointment.details.notes}
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
                            <button className="bg-[#00E676] text-white py-5 lg:py-7 rounded-4xl text-lg lg:text-2xl font-black shadow-lg shadow-emerald-500/20 hover:brightness-105 active:scale-[0.98] transition-all">
                                {t("patient.appointment_detail.contact_btn")}
                            </button>
                            <button className="bg-[#FFB703] text-white py-5 lg:py-7 rounded-4xl text-lg lg:text-2xl font-black shadow-lg shadow-amber-500/20 hover:brightness-105 active:scale-[0.98] transition-all">
                                {t("patient.appointment_detail.reschedule_btn")}
                            </button>
                            <button className="col-span-2 bg-[#F44336] text-white py-5 lg:py-7 rounded-4xl text-lg lg:text-2xl font-black shadow-lg shadow-red-500/20 hover:brightness-105 active:scale-[0.98] transition-all">
                                {t("patient.appointment_detail.cancel_btn")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientAppointmentDetail;
