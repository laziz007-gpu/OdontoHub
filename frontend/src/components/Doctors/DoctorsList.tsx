import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
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
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);
    const [mapQuery, setMapQuery] = useState<string>('');
    const [mapTitle, setMapTitle] = useState<string>('Локация');

    const navigate = useNavigate();

    const parseCoordinates = (value?: string | null): { lat: number; lng: number } | null => {
        if (!value) return null;
        const parts = value.split(',');
        if (parts.length !== 2) return null;
        const lat = Number(parts[0].trim());
        const lng = Number(parts[1].trim());
        if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
        return { lat, lng };
    };

    const getDoctorCoords = (doctor: Doctor): { lat: number; lng: number } | null => {
        const lat = Number(doctor.latitude);
        const lng = Number(doctor.longitude);
        if (Number.isFinite(lat) && Number.isFinite(lng)) {
            return { lat, lng };
        }
        return parseCoordinates(doctor.address);
    };

    const openMapModal = (query: string, title: string) => {
        setMapQuery(query);
        setMapTitle(title);
        setIsMapModalOpen(true);
    };

    // Convert backend dentist data to Doctor type
    const doctors: Doctor[] = dentists?.map(d => {
        const coordsFromAddress = parseCoordinates(d.address);
        const numericLat = typeof d.latitude === 'number' ? d.latitude : Number(d.latitude);
        const numericLng = typeof d.longitude === 'number' ? d.longitude : Number(d.longitude);
        const lat = Number.isFinite(numericLat) ? numericLat : coordsFromAddress?.lat;
        const lng = Number.isFinite(numericLng) ? numericLng : coordsFromAddress?.lng;
        const looksLikeCoords = !!coordsFromAddress;

        return {
            id: d.id,
            name: d.full_name,
            direction: d.specialization || "Стоматолог",
            experience: "5 лет",
            rating: "4.8",
            image: DoctorImg,
            specialty: d.specialization || "Общая стоматология",
            address: looksLikeCoords ? (d.clinic || "Тошкент") : (d.address || d.clinic || "Манзил кўрсатилмаган"),
            phone: d.phone,
            clinic: d.clinic,
            work_hours: d.work_hours,
            works_photos: d.works_photos,
            telegram: d.telegram,
            instagram: d.instagram,
            whatsapp: d.whatsapp,
            latitude: lat ?? undefined,
            longitude: lng ?? undefined,
        };
    }) || [];

    const handleBook = (doctor: Doctor) => {
        // Always navigate to booking page to select date/time
        navigate(paths.booking, { state: { doctor } });
    };

    const handleOpenDoctorMap = (doctor: Doctor) => {
        const coords = getDoctorCoords(doctor);
        if (coords) {
            openMapModal(`${coords.lat},${coords.lng}`, doctor.name || 'Локация врача');
            return;
        }

        const rawAddress = doctor.address || doctor.clinic || 'Тошкент';
        openMapModal(rawAddress, doctor.name || 'Локация врача');
    };

    return (
        <div className="flex flex-col">
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
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                </div>
            ) : (
                <div className="space-y-3 pb-32">
                    {doctors.map((doctor, index) => (
                        <DoctorCard
                            key={index}
                            doctor={doctor}
                            onBook={handleBook}
                            onOpenMap={handleOpenDoctorMap}
                        />
                    ))}
                    {doctors.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">Врачи не найдены</p>
                        </div>
                    )}
                </div>
            )}

            <div className="fixed bottom-24 sm:bottom-6 left-0 right-0 flex justify-center z-10 px-4 pointer-events-none">
                <button
                    onClick={() => {
                        const points = doctors
                            .map((d) => getDoctorCoords(d))
                            .filter((p): p is { lat: number; lng: number } => !!p);

                        if (points.length === 0) {
                            openMapModal(`стоматология ${district} ${location}`, 'Стоматологи на карте');
                            return;
                        }

                        const first = points[0];
                        openMapModal(`${first.lat},${first.lng}`, 'Стоматолог на карте');
                    }}
                    className="pointer-events-auto bg-[#11D76A] text-white font-bold text-sm sm:text-base py-2.5 sm:py-3 px-8 sm:px-10 rounded-full shadow-[0_4px_20px_rgba(17,215,106,0.3)] hover:bg-[#0fc460] transition-all active:scale-95"
                >
                    На карте
                </button>
            </div>

            {isMapModalOpen && (
                <div className="fixed inset-0 z-[100] bg-black/55 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-2xl">
                        <div className="flex items-center justify-between px-4 py-3 border-b">
                            <h3 className="font-bold text-[#1D1D2B]">{mapTitle}</h3>
                            <button
                                onClick={() => setIsMapModalOpen(false)}
                                className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="h-[65vh] min-h-[360px]">
                            <iframe
                                src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=15&output=embed`}
                                className="w-full h-full"
                                style={{ border: 0 }}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="doctor-location-map"
                            />
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default DoctorsList;
