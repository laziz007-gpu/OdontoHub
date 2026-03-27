import React from 'react';
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import DentistImg from "../../assets/img/photos/Dentist.png";
import DoctorInfoCard from "./DoctorInfoCard";
import AppointmentDetailsCard from "./AppointmentDetailsCard";
import PriceCard from "./PriceCard";
import ActionButtons from "./ActionButtons";

const CheckupDetailView = () => {
    const navigate = useNavigate();

    const appointment = {
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
    };

    return (
        <>
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 bg-[#1D1D2B] rounded-full flex items-center justify-center text-white shrink-0 shadow-md hover:bg-gray-800 transition-colors"
                >
                    <FaArrowLeft />
                </button>
                <div className="flex flex-col">
                    <h1 className="text-[#1D1D2B] text-2xl font-black leading-tight">
                        {appointment.title}
                    </h1>
                    <p className="text-[#1D1D2B] text-lg font-bold">
                        {appointment.date} | {appointment.time}
                    </p>
                </div>
            </div>

            <div className="space-y-6 pb-12">
                <DoctorInfoCard doctor={appointment.doctor} />
                <AppointmentDetailsCard details={appointment.details} />
                <PriceCard price={appointment.price} />
                <ActionButtons />
            </div>
        </>
    );
};

export default CheckupDetailView;
