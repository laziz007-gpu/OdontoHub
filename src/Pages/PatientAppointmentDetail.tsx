import React from 'react';
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import DentistImg from "../assets/img/photos/Dentist.png";
import DoctorInfoCard from "../components/PatientAppointmentDetail/DoctorInfoCard";
import AppointmentDetailsCard from "../components/PatientAppointmentDetail/AppointmentDetailsCard";
import PriceCard from "../components/PatientAppointmentDetail/PriceCard";
import ReviewButton from "../components/PatientAppointmentDetail/ReviewButton";
import ActionButtons from "../components/PatientAppointmentDetail/ActionButtons";
import { useAppointment } from "../api/appointments";
import type { AppointmentDetail } from "../types/patient";

const PatientAppointmentDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    
    // Fetch appointment from backend
    const { data: appointmentData, isLoading } = useAppointment(parseInt(id || '0'));

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
        );
    }

    // Check if local mode
    const accessToken = localStorage.getItem('access_token');
    const isLocalMode = accessToken?.startsWith('local_token_');

    // Mock data for local mode or fallback
    const isUpcoming = id !== '101' && id !== '102' && id !== '103';

    const mockAppointment: AppointmentDetail = isUpcoming ? {
        title: "Удаление зуба мудрости",
        date: "30 сентябрь",
        time: "16:00",
        doctor: {
            name: "Махмуд Пулатов",
            direction: "Ортодонтия",
            experience: "3 года",
            rating: "4.7",
            image: DentistImg,
            phone: "+998901234567"
        },
        details: {
            status: "запланирован",
            date: "25.10.2025",
            duration: "40 минут",
            tip: "Принести снимки рентгена",
            notes: "Нету заметок"
        },
        price: "500.000сум"
    } : {
        title: "Осмотр",
        date: "25 сентябрь",
        time: "16:00",
        doctor: {
            name: "Махмуд Пулатов",
            direction: "Ортодонтия",
            experience: "3 года",
            rating: "4.7",
            image: DentistImg,
            phone: "+998901234567"
        },
        details: {
            status: "завершён",
            date: "25.10.2025",
            duration: "20 минут",
            tip: "Пусто",
            notes: ""
        },
        price: "20.000сум"
    };

    // Use real data if available
    let appointment: AppointmentDetail;
    
    if (isLocalMode) {
        // Load from localStorage
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const localAppointment = appointments.find((a: any) => a.id.toString() === id);
        
        if (localAppointment) {
            appointment = {
                title: localAppointment.service || "Консультация",
                date: localAppointment.date,
                time: localAppointment.time,
                doctor: {
                    name: localAppointment.doctor_name || "Доктор",
                    direction: "Стоматология",
                    experience: "5 лет",
                    rating: "4.7",
                    image: DentistImg,
                    phone: "+998901234567"
                },
                details: {
                    status: localAppointment.status === "upcoming" ? "запланирован" : "завершён",
                    date: localAppointment.date,
                    duration: "40 минут",
                    tip: localAppointment.comment || "Нет подсказок",
                    notes: localAppointment.comment || "Нету заметок"
                },
                price: localAppointment.price ? `${localAppointment.price.toLocaleString('ru-RU')} UZS` : "Не указано"
            };
        } else {
            appointment = mockAppointment;
        }
    } else if (!appointmentData) {
        appointment = mockAppointment;
    } else {
        // Convert backend data to AppointmentDetail format
        const startDate = new Date(appointmentData.start_time);
        const endDate = new Date(appointmentData.end_time);
        const duration = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));
        
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
    }

    return (
        <div className="min-h-screen bg-[#F5F7FA] p-4 md:p-8 max-w-5xl mx-auto w-full flex flex-col font-sans">
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
                        (appointmentData?.status === "pending" || appointmentData?.status === "confirmed" || isLocalMode) ? 
                        'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                    }`}>
                        {(appointmentData?.status === "pending" || appointmentData?.status === "confirmed" || isLocalMode) ? 
                            'Предстоит' : 'Завершено'
                        }
                    </span>
                </div>
            </div>

            <div className="flex flex-col space-y-6 lg:space-y-8">
                {/* Doctor Info Card - Full Width, Larger on Desktop */}
                <div className="transition-transform hover:scale-[1.01]">
                    <DoctorInfoCard doctor={appointment.doctor} />
                </div>

                {/* Two Column Layout for Details and Price/Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* Left: Details */}
                    <div>
                        <AppointmentDetailsCard details={appointment.details} />
                    </div>

                    {/* Right: Price & Actions Stacked Vertically */}
                    <div className="space-y-6 flex flex-col">
                        <div className="bg-white rounded-[2rem] lg:rounded-[2.5rem] p-1 shadow-sm border border-gray-50 overflow-hidden">
                            <PriceCard price={appointment.price} service={appointment.title} />
                        </div>
                        <div>
                            {(appointmentData?.status === "pending" || appointmentData?.status === "confirmed" || isLocalMode) ? 
                                <ActionButtons phone={appointment.doctor.phone} /> : 
                                <ReviewButton />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientAppointmentDetail;

