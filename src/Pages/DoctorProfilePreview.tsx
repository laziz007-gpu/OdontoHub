import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import DentistImg from "../assets/img/photos/Dentist.png";

const DoctorProfilePreview = () => {
    const navigate = useNavigate();

    const doctorData = {
        name: "Откир Комилов",
        phone: "+998 (90) 123 45 67",
        gender: "Мужчина",
        birthDate: "20.09.2000",
        age: "26 лет",
        email: "example@gmail.com",
        address: "ул. Амира Темура, 11кв, 20дом",
        education: "ТашПМИ(Факультет)",
        clinic: "Не указано"
    };

    return (
        <div className="min-h-screen bg-[#F5F7FF] pb-10">
            {/* Main Container - Responsive width */}
            <div className="max-w-xl mx-auto w-full flex flex-col min-h-screen">

                {/* Header */}
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

                {/* Content Area */}
                <div className="flex-1 px-4 space-y-4">

                    {/* Doctor Image & Basic Info */}
                    <div className="flex flex-col items-center">
                        <div className="w-[180px] h-[180px] md:w-[220px] md:h-[220px] rounded-full overflow-hidden border-8 border-white shadow-xl mb-4">
                            <img src={DentistImg} alt="Doctor" className="w-full h-full object-cover" />
                        </div>

                        <div className="w-full bg-white rounded-[24px] p-5 shadow-sm">
                            <h2 className="text-xl font-black text-[#1D1D2B]">{doctorData.name}</h2>
                            <p className="text-xs font-bold text-gray-400 mt-1">{doctorData.phone}</p>
                        </div>
                    </div>

                    {/* Gender & Age Info Card */}
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

                    {/* Services Action Button */}
                    <button className="w-full bg-[#4E70FF] text-white py-5 px-8 rounded-[24px] flex items-center justify-between group active:scale-[0.98] transition-all shadow-lg shadow-blue-500/20">
                        <span className="text-xl font-black text-black">Услуги</span>
                        <div className="p-1 border-2 border-white rounded-lg bg-black">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </button>

                    {/* Cases Action Button */}
                    <button className="w-full bg-[#FFBC00] text-white py-5 px-8 rounded-[24px] flex items-center justify-between group active:scale-[0.98] transition-all shadow-lg shadow-amber-500/20">
                        <span className="text-xl font-black text-black">Кейсы</span>
                        <div className="p-1 border-2 border-white rounded-lg bg-black">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </button>

                    {/* Detailed Contact Info */}
                    <div className="bg-white rounded-[24px] p-8 shadow-sm space-y-5">
                        <div className="flex items-start gap-4">
                            <span className="text-[11px] font-bold text-gray-400 whitespace-nowrap pt-1">Тел.номер</span>
                            <span className="text-[13px] font-bold text-[#1D1D2B] leading-tight">{doctorData.phone}</span>
                        </div>
                        <div className="flex items-start gap-4">
                            <span className="text-[11px] font-bold text-gray-400 whitespace-nowrap pt-1">Email</span>
                            <span className="text-[13px] font-bold text-[#1D1D2B] leading-tight">{doctorData.email}</span>
                        </div>
                        <div className="flex items-start gap-4">
                            <span className="text-[11px] font-bold text-gray-400 whitespace-nowrap pt-1 text-right min-w-[50px]">Адрес</span>
                            <span className="text-[13px] font-bold text-[#1D1D2B] leading-tight">{doctorData.address}</span>
                        </div>
                        <div className="flex items-start gap-4">
                            <span className="text-[11px] font-bold text-gray-400 whitespace-nowrap pt-1">Образование</span>
                            <span className="text-[13px] font-bold text-[#1D1D2B] leading-tight">{doctorData.education}</span>
                        </div>
                        <div className="flex items-start gap-4">
                            <span className="text-[11px] font-bold text-gray-400 whitespace-nowrap pt-1 text-right min-w-[50px]">Клиника</span>
                            <span className="text-[13px] font-bold text-[#1D1D2B] leading-tight">{doctorData.clinic}</span>
                        </div>
                    </div>

                    {/* Main Action Button */}
                    <div className="pt-6 pb-12">
                        <button className="w-full bg-[#11D76A] text-white py-6 rounded-[24px] text-xl font-black shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all active:scale-[0.98]">
                            Записаться
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DoctorProfilePreview;
