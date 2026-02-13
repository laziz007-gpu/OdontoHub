import { User, Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { paths } from "../../Routes/path";
import type { Appointment } from "../../types/patient";

interface UpcomingAppointmentCardProps {
    appointment: Appointment;
}

const UpcomingAppointmentCard = ({ appointment }: UpcomingAppointmentCardProps) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(paths.patientAppointmentDetail.replace(":id", appointment.id.toString()))}
            className="bg-blue-600 rounded-4xl p-4 flex gap-4 text-white shadow-xl shadow-blue-500/20 group hover:scale-[1.01] transition-transform duration-300 cursor-pointer"
        >
            {/* Doctor Card */}
            <div className="w-32 h-40 sm:w-40 sm:h-48 bg-white rounded-3xl p-1 shrink-0 overflow-hidden shadow-inner">
                <img
                    src={appointment.image}
                    alt={appointment.doctor}
                    className="w-full h-full object-cover rounded-2xl"
                />
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                    <h3 className="text-xl lg:text-3xl font-bold leading-tight mb-4">
                        {appointment.title}
                    </h3>

                    <div className="space-y-1">
                        <div className="flex items-start gap-2">
                            <User size={18} className="mt-1" />
                            <div>
                                <p className="font-bold text-sm lg:text-xl">{appointment.doctor}</p>
                                <p className="text-[10px] lg:text-sm opacity-80">{appointment.specialty}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="bg-white/20 backdrop-blur-md rounded-2xl py-2 px-3 sm:px-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] lg:text-sm font-bold border border-white/10">
                    <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        <span>{appointment.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock size={14} />
                        <span>{appointment.time}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpcomingAppointmentCard;
