import React from 'react';
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import CheckupDoctorCard from '../components/CheckupBookingDetail/CheckupDoctorCard';
import CheckupInfoCard from '../components/CheckupBookingDetail/CheckupInfoCard';
import CheckupPriceCard from '../components/CheckupBookingDetail/CheckupPriceCard';
import CheckupReviewButton from '../components/CheckupBookingDetail/CheckupReviewButton';

const CheckupPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F8F9FB] p-6 flex flex-col items-center w-full">
            <div className="w-full max-w-md flex flex-col gap-6">

                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 bg-[#1D1D2B] rounded-full flex items-center justify-center text-white shrink-0 shadow-md hover:bg-gray-800 transition-colors"
                    >
                        <FaArrowLeft className="text-xl" />
                    </button>
                    <div className="flex flex-col">
                        <h1 className="text-[#1D1D2B] text-[28px] font-black leading-tight">
                            Осмотр
                        </h1>
                        <p className="text-[#1D1D2B] text-[18px] font-bold">
                            25 сентябрь | 16:00
                        </p>
                    </div>
                </div>

                {/* Components Stack */}
                <div className="flex flex-col gap-5 w-full">
                    <CheckupDoctorCard />
                    <CheckupInfoCard />
                    <CheckupPriceCard />
                    <CheckupReviewButton />
                </div>

            </div>
        </div>
    );
};

export default CheckupPage;
