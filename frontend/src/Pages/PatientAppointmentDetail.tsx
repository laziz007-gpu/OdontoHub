import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import DentistImg from "../assets/img/photos/Dentist.png";
import DoctorInfoCard from "../components/PatientAppointmentDetail/DoctorInfoCard";
import AppointmentDetailsCard from "../components/PatientAppointmentDetail/AppointmentDetailsCard";
import PriceCard from "../components/PatientAppointmentDetail/PriceCard";
import ReviewButton from "../components/PatientAppointmentDetail/ReviewButton";
import ActionButtons from "../components/PatientAppointmentDetail/ActionButtons";
import { useAppointment } from "../api/appointments";
import { useAllDentists } from "../api/profile";
import type { AppointmentDetail } from "../types/patient";

const PatientAppointmentDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { data: appointmentData, isLoading } = useAppointment(parseInt(id || '0'));
    const { data: allDentists = [] } = useAllDentists();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
        );
    }

    const accessToken = localStorage.getItem('access_token');
    const isLocalMode = accessToken?.startsWith('local_token_');

    let appointment: AppointmentDetail;
    let isActive = false;

    if (isLocalMode) {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const local = appointments.find((a: any) => a.id.toString() === id);
        if (local) {
            const dentist = allDentists.find(d => d.id === local.doctor_id);
            isActive = local.status === 'upcoming';
            appointment = {
                title: local.service || "Консультация",
                date: local.date,
                time: local.time,
                doctor: {
                    id: local.doctor_id,
                    name: dentist?.full_name || local.doctor_name || "Доктор",
                    direction: dentist?.specialization || "Стоматология",
                    experience: "5 лет",
                    rating: "4.7",
                    image: DentistImg,
                    phone: dentist?.phone || "+998901234567",
                    clinic: dentist?.clinic,
                    address: dentist?.address,
                    telegram: dentist?.telegram,
                    instagram: dentist?.instagram,
                    whatsapp: dentist?.whatsapp,
                    work_hours: dentist?.work_hours,
                },
                details: {
                    status: local.status === "upcoming" ? "запланирован" : "завершён",
                    date: local.date,
                    duration: "40 минут",
                    tip: local.comment || "Нет подсказок",
                    notes: local.comment || "Нету заметок"
                },
                price: local.price ? `${local.price.toLocaleString('ru-RU')} UZS` : "Не указано"
            };
        } else {
            isActive = false;
            appointment = {
                title: "Консультация", date: "", time: "",
                doctor: { name: "Доктор", direction: "Стоматология", experience: "5 лет", rating: "4.7", image: DentistImg, phone: "" },
                details: { status: "завершён", date: "", duration: "", tip: "", notes: "" },
                price: "Не указано"
            };
        }
    } else if (appointmentData) {
        const startDate = new Date(appointmentData.start_time);
        const endDate = new Date(appointmentData.end_time);
        const duration = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));
        isActive = appointmentData.status === "pending" || appointmentData.status === "confirmed";
        appointment = {
            title: appointmentData.service || "Консультация",
            date: startDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }),
            time: startDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
            doctor: {
                name: appointmentData.dentist_name || "Доктор",
                direction: "Стоматология",
                experience: "5 лет",
                rating: "4.7",
                image: DentistImg,
                phone: "+998901234567"
            },
            details: {
                status: appointmentData.status === "pending" ? "запланирован" :
                    appointmentData.status === "completed" ? "завершён" :
                    appointmentData.status === "cancelled" ? "отменён" : "запланирован",
                date: startDate.toLocaleDateString('ru-RU'),
                duration: `${duration} минут`,
                tip: appointmentData.notes || "Нет подсказок",
                notes: appointmentData.notes || "Нету заметок"
            },
            price: appointmentData.price ? `${appointmentData.price.toLocaleString('ru-RU')} UZS` : "Не указано"
        };
    } else {
        isActive = false;
        appointment = {
            title: "Консультация", date: "", time: "",
            doctor: { name: "Доктор", direction: "Стоматология", experience: "5 лет", rating: "4.7", image: DentistImg, phone: "" },
            details: { status: "завершён", date: "", duration: "", tip: "", notes: "" },
            price: "Не указано"
        };
    }

    return (
        <div className="min-h-screen bg-[#F5F7FA] p-4 md:p-8 max-w-5xl mx-auto w-full flex flex-col font-sans pb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 md:mb-12">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-[#1D1D2B] shadow-sm hover:bg-gray-50 transition-all active:scale-95"
                    >
                        <FaArrowLeft />
                    </button>
                    <div className="flex flex-col">
                        <h1 className="text-[#1D1D2B] text-2xl md:text-3xl font-black leading-tight">
                            {appointment.title}
                        </h1>
                        <p className="text-gray-400 text-sm md:text-base font-bold">
                            {appointment.date} | {appointment.time}
                        </p>
                    </div>
                </div>
                <div className="hidden md:block">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                        isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                        {isActive ? 'Предстоит' : appointment.details.status}
                    </span>
                </div>
            </div>

            <div className="flex flex-col space-y-6 lg:space-y-8">
                <div className="transition-transform hover:scale-[1.01]">
                    <DoctorInfoCard doctor={appointment.doctor} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    <div>
                        <AppointmentDetailsCard details={appointment.details} />
                    </div>
                    <div className="space-y-6 flex flex-col">
                        <div className="bg-white rounded-[2rem] lg:rounded-[2.5rem] p-1 shadow-sm border border-gray-50 overflow-hidden">
                            <PriceCard price={appointment.price} service={appointment.title} />
                        </div>
                        <div>
                            {isActive
                                ? <ActionButtons phone={appointment.doctor.phone} doctorName={appointment.doctor.name} />
                                : <ReviewButton />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientAppointmentDetail;
