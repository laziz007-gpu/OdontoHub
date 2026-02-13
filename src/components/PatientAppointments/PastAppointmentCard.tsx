import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { paths } from "../../Routes/path";
import type { Appointment } from "../../types/patient";

interface PastAppointmentCardProps {
    appointment: Appointment;
}

const PastAppointmentCard = ({ appointment }: PastAppointmentCardProps) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div
            onClick={() => navigate(paths.patientAppointmentDetail.replace(":id", appointment.id.toString()))}
            className="bg-blue-600 rounded-4xl p-6 sm:p-8 flex flex-col justify-between text-white relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300 min-h-[220px] cursor-pointer"
        >
            <div className="flex justify-between items-start gap-4">
                <div className="space-y-4">
                    <p className="text-sm sm:text-lg font-medium opacity-90">{t("patient.appointments.doctor_label")}: {appointment.doctor}</p>
                    <div className="space-y-1">
                        <p className="text-sm sm:text-lg font-medium opacity-90">{t("patient.appointments.date_time_label")}:</p>
                        <p className="text-sm sm:text-lg lg:text-xl font-bold">{appointment.date} | {appointment.time}</p>
                    </div>
                </div>

                {appointment.status === "cancelled" && (
                    <div className="text-right max-w-[200px]">
                        <p className="text-xs sm:text-base font-bold opacity-90">{appointment.commentTitle}</p>
                        <p className="text-[10px] sm:text-sm opacity-80">{appointment.comment}</p>
                    </div>
                )}
                {appointment.status === "rescheduled" && (
                    <div className="text-right max-w-[200px]">
                        <p className="text-xs sm:text-base font-bold opacity-90">{appointment.newDateTitle}</p>
                        <p className="text-[10px] sm:text-sm opacity-80">{appointment.newDate}</p>
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center mt-8">
                <div className="flex items-center gap-1">
                    <Star size={20} className={appointment.status === "success" ? "fill-white" : ""} />
                    {appointment.rating && <span className="text-sm italic opacity-80">{appointment.rating}</span>}
                </div>
                <div className={`px-6 py-2 rounded-2xl font-bold text-sm lg:text-base absolute bottom-0 right-0 ${appointment.status === "success" ? "bg-emerald-500" :
                    appointment.status === "cancelled" ? "bg-red-600" :
                        "bg-amber-400 text-gray-900"
                    }`}>
                    {appointment.statusText}
                </div>
            </div>
        </div>
    );
};

export default PastAppointmentCard;
