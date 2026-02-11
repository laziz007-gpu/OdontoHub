import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import DentistImg from "../assets/img/photos/Dentist.png";
import type { AppointmentDetail } from "../types/patient";

const PatientAppointmentDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    // Determine data based on appointment ID (upcoming < 100, past >= 100)
    const isPast = id ? parseInt(id) >= 100 : false;

    const appointment: AppointmentDetail = isPast ? {
        title: "Осмотр",
        date: "25 сентябрь",
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
            duration: "20 минут",
            tip: "Нет",
            notes: "Нету заметок"
        },
        price: "20.000сум"
    } : {
        title: "Удаление зуба мудрости",
        date: "25 сентябрь",
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
            notes: "Нетu заметок"
        },
        price: "500.000сум"
    };

    return (
        <div className="min-h-screen flex flex-col max-w-7xl mx-auto w-full bg-[#FAFAFA]">
            {/* Header */}
            <div className="px-4 py-8 flex flex-col gap-2 relative">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-3 bg-[#1D1D2B] rounded-full text-white hover:bg-gray-800 transition-colors shrink-0 shadow-lg"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex flex-col">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#1D1D2B] leading-tight">
                            {appointment.title}
                        </h1>
                        <p className="text-base md:text-xl lg:text-2xl font-bold text-[#1D1D2B]/80">
                            {appointment.date} | {appointment.time}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 px-4 pb-24 md:px-6 lg:px-8 max-w-3xl mx-auto w-full space-y-6">
                {/* Doctor Info Card */}
                <div className="bg-[#4361EE] rounded-[2.5rem] p-4 md:p-6 flex items-center gap-4 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-3xl p-1 shrink-0 overflow-hidden shadow-inner flex items-center justify-center">
                        <img
                            src={appointment.doctor.image}
                            alt={appointment.doctor.name}
                            className="w-full h-full object-cover rounded-[1.25rem]"
                        />
                    </div>
                    <div className="flex-1 flex flex-col justify-center gap-1">
                        <h3 className="text-lg md:text-xl lg:text-2xl font-black truncate">{appointment.doctor.name}</h3>
                        <div className="space-y-0.5">
                            <p className="text-[10px] md:text-xs lg:text-sm font-bold opacity-90">Направление: {appointment.doctor.direction}</p>
                            <p className="text-[10px] md:text-xs lg:text-sm font-bold opacity-90">Опыт работы: {appointment.doctor.experience}</p>
                            <p className="text-[10px] md:text-xs lg:text-sm font-bold opacity-90">Оценка: {appointment.doctor.rating}</p>
                        </div>
                        <button className="bg-white text-[#4361EE] px-4 py-1.5 rounded-2xl text-[10px] md:text-xs font-black self-start mt-2 hover:bg-gray-50 transition-colors flex items-center gap-2">
                            Перейти <ArrowLeft size={12} className="rotate-180" />
                        </button>
                    </div>
                </div>

                {/* Details Section */}
                <div className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-gray-100 shadow-sm space-y-4 md:space-y-6">
                    <div className="flex flex-wrap gap-2 text-sm md:text-lg lg:text-xl font-bold text-[#1D1D2B]">
                        <span className="text-[#1D1D2B]/60 font-black">Статус:</span>
                        <span>{appointment.details.status}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm md:text-lg lg:text-xl font-bold text-[#1D1D2B]">
                        <span className="text-[#1D1D2B]/60 font-black">Когда:</span>
                        <span>{appointment.details.date}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm md:text-lg lg:text-xl font-bold text-[#1D1D2B]">
                        <span className="text-[#1D1D2B]/60 font-black">Примерная длительность:</span>
                        <span>{appointment.details.duration}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm md:text-lg lg:text-xl font-bold text-[#1D1D2B]">
                        <span className="text-[#1D1D2B]/60 font-black">Подсказка:</span>
                        <span>{appointment.details.tip}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm md:text-lg lg:text-xl font-bold text-[#1D1D2B]">
                        <span className="text-[#1D1D2B]/60 font-black">Заметки:</span>
                        <span>{appointment.details.notes}</span>
                    </div>
                </div>

                {/* Price Card */}
                <div className="bg-[#4361EE] rounded-[2.5rem] p-6 md:p-10 text-white space-y-1 shadow-xl shadow-blue-500/20">
                    <p className="text-base md:text-xl font-black">цена:</p>
                    <h2 className="text-3xl md:text-6xl font-black tracking-tight">{appointment.price}</h2>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <button className="bg-[#00E676] text-white py-4 md:py-6 rounded-3xl md:rounded-4xl text-base md:text-2xl font-black shadow-lg shadow-emerald-500/10 hover:brightness-105 active:scale-[0.98] transition-all">
                        Связаться
                    </button>
                    <button className="bg-[#FFB703] text-white py-4 md:py-6 rounded-3xl md:rounded-4xl text-base md:text-2xl font-black shadow-lg shadow-amber-500/10 hover:brightness-105 active:scale-[0.98] transition-all">
                        Перенести
                    </button>
                    <button className="col-span-2 bg-[#F44336] text-white py-4 md:py-6 rounded-3xl md:rounded-4xl text-base md:text-2xl font-black shadow-lg shadow-red-500/10 hover:brightness-105 active:scale-[0.98] transition-all">
                        Отмененить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PatientAppointmentDetail;
