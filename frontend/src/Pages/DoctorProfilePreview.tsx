import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Video, AlertCircle } from "lucide-react";
import React, { useState } from "react";
import ComplaintModal from "../components/Complaints/ComplaintModal";
import DentistImg from "../assets/img/photos/Dentist.png";

const DoctorProfilePreview = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
    
    // Get doctor data from navigation state
    const doctorFromState = location.state?.doctor;

    const doctorData = doctorFromState ? {
        id: doctorFromState.id,
        name: doctorFromState.name,
        phone: doctorFromState.phone || "+998 (90) 123 45 67",
        gender: "Мужчина",
        birthDate: "20.09.2000",
        age: "26 лет",
        email: doctorFromState.email || "example@gmail.com",
        address: doctorFromState.address || "ул. Амира Темура, 11кв, 20дом",
        education: "ТашПМИ(Факультет)",
        clinic: doctorFromState.clinic || "Не указано",
        specialty: doctorFromState.specialty || doctorFromState.direction || "Стоматолог",
        experience: doctorFromState.experience || "5 лет",
        image: doctorFromState.image || DentistImg,
        telegram: doctorFromState.telegram,
        instagram: doctorFromState.instagram,
        whatsapp: doctorFromState.whatsapp,
        work_hours: doctorFromState.work_hours,
        verification_status: doctorFromState.verification_status,
        diploma_number: doctorFromState.diploma_number,
        diploma_photo_url: doctorFromState.diploma_photo_url,
    } : {
        id: 1,
        name: "Махмуд Пулатов",
        phone: "+998 (90) 123 45 67",
        gender: "Мужчина",
        birthDate: "20.09.2000",
        age: "26 лет",
        email: "example@gmail.com",
        address: "ул. Амира Темура, 11кв, 20дом",
        education: "ТашПМИ(Факультет)",
        clinic: "Не указано",
        specialty: "Ортодонтия",
        experience: "5 лет",
        image: DentistImg,
        verification_status: "approved",
        diploma_photo_url: null
    };

    const handleBook = async () => {
        navigate('/booking', { 
            state: { 
                doctor: {
                    id: doctorData.id,
                    name: doctorData.name,
                    value: doctorData.id?.toString(),
                    phone: doctorData.phone,
                    specialty: doctorData.specialty,
                    image: doctorData.image
                }
            } 
        });
    };

    return (
        <div className="min-h-screen bg-[#F5F7FF] pb-10">
            <div className="max-w-xl mx-auto w-full flex flex-col min-h-screen">
                <div className="flex items-center justify-between p-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 text-[#1D1D2B] hover:bg-white/50 rounded-full transition-colors"
                    >
                        <ArrowLeft size={24} strokeWidth={2.5} />
                    </button>
                    <h1 className="text-xl md:text-2xl font-black text-[#1D1D2B] text-center flex-1 pr-8">
                        Профиль стоматолога
                    </h1>
                </div>

                <div className="flex-1 px-4 space-y-4">
                    <div className="flex flex-col items-center">
                        <div className="w-[180px] h-[180px] md:w-[220px] md:h-[220px] rounded-full overflow-hidden border-8 border-white shadow-xl mb-4">
                            <img src={doctorData.image} alt="Doctor" className="w-full h-full object-cover" />
                        </div>

                        <div className="w-full bg-white rounded-[24px] p-5 shadow-sm">
                            <h2 className="text-xl font-black text-[#1D1D2B]">{doctorData.name}</h2>
                            <p className="text-xs font-bold text-gray-400 mt-1">{doctorData.phone}</p>
                            {doctorData.diploma_photo_url && (
                                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E8F8F0] text-[#11D76A] rounded-xl border border-[#11D76A]/20">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM16.707 9.293C16.316 8.902 15.684 8.902 15.293 9.293L10.5 14.086L8.707 12.293C8.316 11.902 7.684 11.902 7.293 12.293C6.902 12.684 6.902 13.316 7.293 13.707L9.793 16.207C10.184 16.598 10.816 16.598 11.207 16.207L16.707 10.707C17.098 10.316 17.098 9.684 16.707 9.293Z" fill="currentColor"/>
                                    </svg>
                                    <span className="text-xs font-black">Diplomi bor</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-[24px] p-6 shadow-sm space-y-4">
                        <div>
                            <p className="text-[10px] font-black uppercase text-gray-300 tracking-widest">Пол</p>
                            <p className="text-lg font-black text-[#1D1D2B] mt-1">{doctorData.gender}</p>
                        </div>
                        <div className="pt-2">
                            <p className="text-[10px] font-black uppercase text-gray-300 tracking-widest">Дата рождения</p>
                            <p className="text-lg font-black text-[#1D1D2B] mt-1">
                                {doctorData.age} ({doctorData.birthDate})
                            </p>
                        </div>
                    </div>

                    <button 
                        onClick={() => navigate('/doctor-services', { 
                            state: { dentist_id: doctorFromState?.id } 
                        })}
                        className="w-full bg-[#4E70FF] text-white py-5 px-8 rounded-[24px] flex items-center justify-between group active:scale-[0.98] transition-all shadow-lg shadow-blue-500/20"
                    >
                        <span className="text-xl font-black text-black">Услуги</span>
                        <div className="p-1 border-2 border-white rounded-lg bg-black">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </button>

                    <button 
                        onClick={() => navigate('/doctor-cases')}
                        className="w-full bg-[#FFBC00] text-white py-5 px-8 rounded-[24px] flex items-center justify-between group active:scale-[0.98] transition-all shadow-lg shadow-amber-500/20"
                    >
                        <span className="text-xl font-black text-black">Кейсы</span>
                        <div className="p-1 border-2 border-white rounded-lg bg-black">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </button>

                    <button 
                        onClick={() => navigate('/video-call', { 
                            state: { 
                                participant: {
                                    name: doctorData.name,
                                    role: 'dentist'
                                }
                            } 
                        })}
                        className="w-full bg-[#10B981] text-white py-5 px-8 rounded-[24px] flex items-center justify-between group active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/20"
                    >
                        <span className="text-xl font-black text-white">Онлайн консультация</span>
                        <div className="p-2 bg-white rounded-lg">
                            <Video size={24} className="text-[#10B981]" />
                        </div>
                    </button>

                    <div className="bg-white rounded-[24px] p-8 shadow-sm space-y-5">
                        <div className="flex items-start gap-4">
                            <span className="text-[11px] font-bold text-gray-400 whitespace-nowrap pt-1 min-w-[70px]">Тел.номер</span>
                            <span className="text-[13px] font-bold text-[#1D1D2B] leading-tight">{doctorData.phone || "Не указано"}</span>
                        </div>
                        <div className="flex items-start gap-4">
                            <span className="text-[11px] font-bold text-gray-400 whitespace-nowrap pt-1 min-w-[70px]">Адрес</span>
                            <span className="text-[13px] font-bold text-[#1D1D2B] leading-tight">{doctorData.address || "Не указано"}</span>
                        </div>
                        <div className="flex items-start gap-4">
                            <span className="text-[11px] font-bold text-gray-400 whitespace-nowrap pt-1 min-w-[70px]">Клиника</span>
                            <span className="text-[13px] font-bold text-[#1D1D2B] leading-tight">{doctorData.clinic || "Не указано"}</span>
                        </div>
                        {doctorData.work_hours && (
                            <div className="flex items-start gap-4">
                                <span className="text-[11px] font-bold text-gray-400 whitespace-nowrap pt-1 min-w-[70px]">Часы работы</span>
                                <span className="text-[13px] font-bold text-[#1D1D2B] leading-tight">{doctorData.work_hours}</span>
                            </div>
                        )}
                        {doctorData.telegram && (
                            <div className="flex items-start gap-4">
                                <span className="text-[11px] font-bold text-gray-400 whitespace-nowrap pt-1 min-w-[70px]">Telegram</span>
                                <span className="text-[13px] font-bold text-[#4361EE] leading-tight">{doctorData.telegram}</span>
                            </div>
                        )}
                        {doctorData.whatsapp && (
                            <div className="flex items-start gap-4">
                                <span className="text-[11px] font-bold text-gray-400 whitespace-nowrap pt-1 min-w-[70px]">WhatsApp</span>
                                <span className="text-[13px] font-bold text-[#1D1D2B] leading-tight">{doctorData.whatsapp}</span>
                            </div>
                        )}
                        {doctorData.instagram && (
                            <div className="flex items-start gap-4">
                                <span className="text-[11px] font-bold text-gray-400 whitespace-nowrap pt-1 min-w-[70px]">Instagram</span>
                                <span className="text-[13px] font-bold text-[#1D1D2B] leading-tight">{doctorData.instagram}</span>
                            </div>
                        )}
                    </div>

                    <div className="pt-6 pb-12">
                        <button
                            onClick={handleBook}
                            className="w-full py-6 rounded-[24px] text-xl font-black transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-3 bg-[#11D76A] text-white hover:shadow-emerald-500/40 shadow-emerald-500/30"
                        >
                            Записаться
                        </button>
                    </div>

                    <div className="pb-12">
                        <button
                            onClick={() => setIsComplaintModalOpen(true)}
                            className="w-full py-4 rounded-[24px] text-base font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-red-500 bg-red-50 hover:bg-red-100"
                        >
                            <AlertCircle size={20} />
                            Shifokor ustidan shikoyat qilish
                        </button>
                    </div>
                </div>
            </div>

            <ComplaintModal 
                isOpen={isComplaintModalOpen} 
                onClose={() => setIsComplaintModalOpen(false)} 
                dentistId={doctorData.id} 
                dentistName={doctorData.name} 
            />
        </div>
    );
};

export default DoctorProfilePreview;
