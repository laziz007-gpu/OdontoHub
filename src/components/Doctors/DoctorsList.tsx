import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { paths } from '../../Routes/path';
import DoctorCard from './DoctorCard';
import DoctorFilters from './DoctorFilters';
import { useAllDentists } from '../../api/profile';
import type { Doctor } from '../../types/patient';
import DoctorImg from "../../assets/img/photos/Dentist.png";

const DoctorsList: React.FC = () => {
    const { t } = useTranslation();
    
    // Fetch dentists from API
    const { data: dentists, isLoading, isError } = useAllDentists();
    const [searchTerm, setSearchTerm] = useState("");
    const [location, setLocation] = useState("tashkent");
    const [district, setDistrict] = useState("yunusabad");
    const [rating, setRating] = useState("");

    const navigate = useNavigate();

    // Convert backend dentist data to Doctor type
    const doctors: Doctor[] = dentists?.map(d => ({
        name: d.full_name,
        direction: d.specialization || "Стоматолог",
        experience: "5 лет", // Can be calculated from backend if needed
        rating: "4.8", // Can come from backend reviews if available
        image: DoctorImg, // Can use d.photo_url if backend provides it
        specialty: d.specialization || "Общая стоматология",
        address: d.address || "Ташкент",
        phone: d.phone,
        clinic: d.clinic,
        work_hours: d.work_hours
    })) || [];

    const handleBook = (doctor: Doctor) => {
        // Check if local mode
        const accessToken = localStorage.getItem('access_token');
        const isLocalMode = accessToken?.startsWith('local_token_');

        if (isLocalMode) {
            // Create appointment directly
            const newAppointment = {
                id: Date.now(),
                doctor_name: doctor.name,
                service: "Консультация",
                date: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU'),
                time: "10:00",
                status: "upcoming",
                comment: "",
                created_at: new Date().toISOString()
            };

            // Get existing appointments
            const existingAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
            existingAppointments.push(newAppointment);
            localStorage.setItem('appointments', JSON.stringify(existingAppointments));

            // Show success message and navigate
            alert(t("patient.alerts.appointment_created"));
            navigate('/calendar');
            return;
        }

        // API mode - navigate to booking page
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

            {isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto space-y-4 pb-24 no-scrollbar">
                    {doctors.map((doctor, index) => (
                        <DoctorCard key={index} doctor={doctor} onBook={handleBook} />
                    ))}
                    {doctors.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">Врачи не найдены</p>
                        </div>
                    )}
                </div>
            )}

            <div className="fixed bottom-4 sm:bottom-6 left-0 right-0 flex justify-center z-10 px-4">
                <button
                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=стоматология+${district}+${location}`, '_blank')}
                    className="bg-[#11D76A] text-white font-bold text-base sm:text-lg md:text-xl py-3 sm:py-4 px-8 sm:px-12 md:px-16 rounded-full shadow-[0_4px_20px_rgba(17,215,106,0.3)] hover:bg-[#0fc460] transition-all w-max active:scale-95 hover:shadow-[0_6px_24px_rgba(17,215,106,0.4)]"
                >
                    На карте
                </button>
            </div>
        </div>
    );
};

export default DoctorsList;
