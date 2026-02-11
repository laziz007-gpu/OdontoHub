import React from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PatientImg from "../assets/img/photos/molodaa-model-muzcina 1.png";
import type { PatientHistoryProfile, MedicalInfo, Treatment } from "../types/patient";

const PatientHistory: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const profile: PatientHistoryProfile = {
        name: "Дункан Факофский",
        id: "P-000001",
        dob: "20.09.2000",
        gender: "Мужчина",
        phone: "+998 88 022 00 54",
        registrationDate: "25.10.2025",
        avatar: PatientImg
    };

    const medicalInfo: MedicalInfo = {
        allergy: "Пенициллин",
        chronicDisease: "Гастроит",
        medication: "Омепразол-утром",
        contraindication: "Нет",
        smoking: "Да. Редко"
    };

    const prescriptions = ["Нимесил", "Ополаскивание"];

    const treatments: Treatment[] = [
        { name: "Имплантация", dateRange: "9дек-15дек", appointmentsCount: "3 приёмов" },
        { name: "Имплантация", dateRange: "9дек-15дек", appointmentsCount: "3 приёмов" }
    ];

    const xrayImages: (string | null)[] = [null, null, null];

    return (
        <div className="min-h-screen bg-white text-[#000814] pb-32">
            {/* Header */}
            <div className="p-4 md:p-6 flex items-center gap-4 border-b border-gray-100">
                <button
                    onClick={() => navigate(-1)}
                    className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 text-[#000814] transition-all active:scale-95 shrink-0"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-2xl md:text-4xl font-black leading-tight tracking-tight uppercase text-blue-600">{profile.name}</h1>
            </div>

            <div className="px-4 md:px-6 lg:px-8 max-w-5xl mx-auto space-y-10 mt-6">
                {/* Profile Card */}
                <div className="bg-linear-to-br from-blue-600 to-blue-700 rounded-4xl p-6 md:p-8 flex flex-col md:flex-row gap-8 relative shadow-[0_10px_30px_rgba(37,99,235,0.2)] text-white">
                    <div className="flex-1 space-y-4">
                        <div className="space-y-0.5">
                            <p className="text-[10px] md:text-xs uppercase font-black tracking-widest opacity-70">ID-пациента:</p>
                            <p className="text-xl md:text-2xl font-black">{profile.id}</p>
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[10px] md:text-xs uppercase font-black tracking-widest opacity-70">Дата рождения:</p>
                            <p className="text-xl md:text-2xl font-black">{profile.dob}</p>
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[10px] md:text-xs uppercase font-black tracking-widest opacity-70">Пол:</p>
                            <p className="text-xl md:text-2xl font-black">{profile.gender}</p>
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[10px] md:text-xs uppercase font-black tracking-widest opacity-70">Контакт:</p>
                            <p className="text-xl md:text-2xl font-black">{profile.phone}</p>
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[10px] md:text-xs uppercase font-black tracking-widest opacity-70">Дата регистрации:</p>
                            <p className="text-xl md:text-2xl font-black">{profile.registrationDate}</p>
                        </div>
                    </div>
                    <div className="w-full md:w-64 aspect-square md:aspect-3/4 bg-blue-500/20 rounded-4xl overflow-hidden border-4 border-white/30 shadow-2xl self-center md:self-start">
                        <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                    </div>
                </div>

                {/* Medical Information */}
                <div className="space-y-6">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight text-blue-900">{t("patient.history.medical_info", "Медицинская информация")}</h2>
                    <div className="bg-gray-50 rounded-4xl p-6 md:p-10 space-y-6 border border-gray-100 shadow-sm">
                        <div className="space-y-1">
                            <p className="text-[10px] md:text-xs uppercase font-black tracking-widest opacity-50">Аллергии:</p>
                            <p className="text-xl md:text-2xl font-bold text-red-500">{medicalInfo.allergy}</p>
                        </div>
                        <div className="space-y-1 border-t border-gray-100 pt-4">
                            <p className="text-[10px] md:text-xs uppercase font-black tracking-widest opacity-50">Хронические заболевания:</p>
                            <p className="text-xl md:text-2xl font-bold">{medicalInfo.chronicDisease}</p>
                        </div>
                        <div className="space-y-1 border-t border-gray-100 pt-4">
                            <p className="text-[10px] md:text-xs uppercase font-black tracking-widest opacity-50">Медикаменты:</p>
                            <p className="text-xl md:text-2xl font-bold">{medicalInfo.medication}</p>
                        </div>
                        <div className="space-y-1 border-t border-gray-100 pt-4">
                            <p className="text-[10px] md:text-xs uppercase font-black tracking-widest opacity-50">Противопоказания:</p>
                            <p className="text-xl md:text-2xl font-bold">{medicalInfo.contraindication}</p>
                        </div>
                        <div className="space-y-1 border-t border-gray-100 pt-4">
                            <p className="text-[10px] md:text-xs uppercase font-black tracking-widest opacity-50">Курение:</p>
                            <p className="text-xl md:text-2xl font-bold">{medicalInfo.smoking}</p>
                        </div>
                    </div>
                </div>

                {/* Prescription */}
                <div className="space-y-6">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight text-blue-900">{t("patient.history.prescription", "Рецепт")}</h2>
                    <div className="bg-blue-50 rounded-4xl p-8 space-y-4 border border-blue-100 shadow-sm">
                        {prescriptions.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                                <div className="w-3 h-3 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.3)]" />
                                <p className="text-xl md:text-2xl font-bold text-blue-800">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Treatments */}
                <div className="space-y-6">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight text-blue-900">{t("patient.history.treatments", "Лечения")}</h2>
                    <div className="bg-white rounded-4xl border border-gray-100 shadow-md overflow-hidden">
                        <div className="divide-y divide-gray-50">
                            {treatments.map((treatment, idx) => (
                                <div key={idx} className="p-4 md:p-6 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex-1 grid grid-cols-3 items-center">
                                        <p className="text-sm md:text-xl font-bold text-gray-900">{treatment.name}</p>
                                        <p className="text-sm md:text-xl font-bold text-gray-500 text-center">{treatment.dateRange}</p>
                                        <p className="text-sm md:text-xl font-bold text-blue-600 text-right">{treatment.appointmentsCount}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 pt-2">
                            <button className="w-full bg-blue-600 text-white py-4 rounded-3xl font-black text-xl hover:bg-blue-700 transition-all active:scale-[0.98] shadow-[0_10px_20px_rgba(37,99,235,0.2)]">
                                Перейти
                            </button>
                        </div>
                    </div>
                </div>

                {/* X-Ray Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-blue-900">{t("patient.history.xray", "Рентген снимок")}</h2>
                        <button className="text-lg font-bold text-blue-600 opacity-70 hover:opacity-100 transition-opacity underline decoration-dotted">ещё</button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pb-20">
                        {xrayImages.map((image, idx) => (
                            <div key={idx} className="aspect-square bg-gray-50 rounded-4xl border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center text-xs font-bold text-gray-400 group hover:border-blue-300 hover:text-blue-500 transition-all">
                                {image ? (
                                    <img src={image} alt={`X-ray ${idx + 1}`} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-center px-4 uppercase tracking-tighter">Снимок {idx + 1}</span>
                                )}
                            </div>
                        ))}
                        <button className="aspect-square bg-blue-50 rounded-4xl flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-all active:scale-95 border-2 border-blue-100 shadow-sm">
                            <Plus size={48} strokeWidth={4} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientHistory;
