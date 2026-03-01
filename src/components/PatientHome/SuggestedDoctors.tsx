import { useTranslation } from "react-i18next";
import { useAllDentists } from "../../api/profile";
import { useMyAppointments } from "../../api/appointments";
import DoctorImg from "../../assets/img/photos/Dentist.png";
import { Link, useNavigate } from "react-router-dom";
import { paths } from "../../Routes/path";

const SuggestedDoctors = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { data: dentists, isLoading: isLoadingDentists } = useAllDentists();
    const { data: appointments, isLoading: isLoadingAppointments } = useMyAppointments();

    const isLoading = isLoadingDentists || isLoadingAppointments;
    const hasUpcomingAppointments = appointments && appointments.length > 0;

    if (isLoading) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="h-8 w-48 bg-gray-200 rounded-lg" />
                <div className="flex gap-4 overflow-hidden">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="min-w-[200px] h-[280px] bg-gray-100 rounded-3xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (!dentists || dentists.length === 0 || hasUpcomingAppointments) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <h2 className="text-2xl font-black text-gray-900 leading-tight font-serif tracking-tight">
                    {t("patient.home.suggested_doctors", "Рекомендуемые врачи")}
                </h2>
                <Link to={paths.doctors} className="text-blue-600 font-bold hover:underline">
                    {t("patient.home.see_all", "Все")}
                </Link>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2">
                {dentists.map((doctor) => (
                    <div
                        key={doctor.id}
                        onClick={() => navigate(paths.booking, {
                            state: {
                                doctor: {
                                    name: doctor.full_name,
                                    direction: doctor.specialization || "Стоматолог",
                                    image: DoctorImg,
                                    specialty: doctor.specialization || "Общая стоматология",
                                    experience: "3 года",
                                    rating: "4.7"
                                }
                            }
                        })}
                        className="min-w-[240px] bg-linear-to-br from-blue-500 to-blue-600 rounded-[32px] p-6 text-white shadow-lg cursor-pointer transition-transform hover:scale-[1.02] active:scale-95"
                    >
                        <div className="bg-white rounded-[24px] w-24 h-24 mb-4 overflow-hidden flex items-center justify-center">
                            <img src={DoctorImg} alt={doctor.full_name} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="text-xl font-bold mb-1 truncate">{doctor.full_name}</h3>
                        <p className="text-white/80 text-sm mb-4">{doctor.specialization || "Стоматолог"}</p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 bg-yellow-400 rounded-full px-2 py-0.5 text-xs font-bold text-gray-900">
                                <span>✨</span>
                                <span>4.7</span>
                            </div>
                            <span className="text-sm font-semibold">Записаться →</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SuggestedDoctors;
