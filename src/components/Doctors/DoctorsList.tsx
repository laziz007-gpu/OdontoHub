import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../Routes/path';
import DoctorCard from './DoctorCard';
import DoctorFilters from './DoctorFilters';
import type { Doctor } from '../../types/patient';
import DoctorImg from "../../assets/img/photos/Dentist.png";

const DoctorsList: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [location, setLocation] = useState("tashkent");
    const [district, setDistrict] = useState("yunusabad");
    const [rating, setRating] = useState("");

    // Mock data based on screenshot
    const doctors: Doctor[] = [
        {
            name: "Махмуд Пулатов",
            direction: "Ортодонтия",
            experience: "3 года",
            rating: "4.7",
            image: DoctorImg,
            specialty: "Ортодонтия"
        },
        {
            name: "Махмуд Пулатов",
            direction: "Ортодонтия",
            experience: "3 года",
            rating: "4.7",
            image: DoctorImg, // Using same image for demo
            specialty: "Ортодонтия"
        },
        {
            name: "Махмуд Пулатов",
            direction: "Ортодонтия",
            experience: "3 года",
            rating: "4.7",
            image: DoctorImg,
            specialty: "Ортодонтия"
        }
    ];

    const navigate = useNavigate();

    const handleBook = (doctor: Doctor) => {
        // In a real app, we'd pass the doctor ID or object via state
        navigate(paths.booking, { state: { doctor } });
    };

    return (
        <div className="flex flex-col h-full">
            <DoctorFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                location={location}
                onLocationChange={setLocation}
                district={district}
                onDistrictChange={setDistrict}
                rating={rating}
                onRatingChange={setRating}
            />

            <div className="flex-1 overflow-y-auto space-y-4 pb-24 no-scrollbar">
                {doctors.map((doctor, index) => (
                    <DoctorCard key={index} doctor={doctor} onBook={handleBook} />
                ))}
            </div>

            <div className="fixed bottom-6 left-0 right-0 flex justify-center z-10 px-4">
                <button
                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=стоматология+${district}+${location}`, '_blank')}
                    className="bg-[#11D76A] text-white font-bold text-lg py-4 px-12 rounded-full shadow-[0_4px_20px_rgba(17,215,106,0.3)] hover:bg-[#0fc460] transition-colors w-max active:scale-95"
                >
                    На карте
                </button>
            </div>
        </div>
    );
};

export default DoctorsList;
