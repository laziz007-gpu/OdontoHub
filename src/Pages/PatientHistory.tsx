import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PatientImg from "../assets/img/photos/molodaa-model-muzcina 1.png";
import ProfileCard from "../components/PatientHistory/ProfileCard";
import MedicalInfoCard from "../components/PatientHistory/MedicalInfoCard";
import PrescriptionCard from "../components/PatientHistory/PrescriptionCard";
import TreatmentsTable from "../components/PatientHistory/TreatmentsTable";
import XRaySection from "../components/PatientHistory/XRaySection";
import type { PatientHistoryProfile, MedicalInfo, Treatment } from "../types/patient";

const PatientHistory: React.FC = () => {
    const navigate = useNavigate();

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
                <ProfileCard profile={profile} />
                <MedicalInfoCard medicalInfo={medicalInfo} />
                <PrescriptionCard prescriptions={prescriptions} />
                <TreatmentsTable treatments={treatments} />
                <XRaySection xrayImages={xrayImages} />
            </div>
        </div>
    );
};

export default PatientHistory;
