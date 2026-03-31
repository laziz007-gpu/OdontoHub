import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
    const routeLocation = useLocation();
    const navigate = useNavigate();
    
    // Fetch dentists from API
    const { data: dentists, isLoading } = useAllDentists();
    
    // Initialize from navigation state if available
    const [searchTerm, setSearchTerm] = useState("");
    const [activeSpecialtyId, setActiveSpecialtyId] = useState(() => {
        const state = routeLocation.state as { specialtyId?: string };
        return state?.specialtyId || "";
    });

    useEffect(() => {
        const state = routeLocation.state as { specialtyId?: string };
        if (state?.specialtyId) {
            setActiveSpecialtyId(state.specialtyId);
            setSearchTerm(""); // Keep search bar empty per user request
            window.history.replaceState({}, document.title);
        }
    }, [routeLocation.state]);

    const [locationFilter, setLocationFilter] = useState("tashkent");
    const [district, setDistrict] = useState("all");
    const [rating, setRating] = useState("");
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);
    const [mapQuery, setMapQuery] = useState<string>('');
    const [mapTitle, setMapTitle] = useState<string>('Локация');

    // Cross-language specialty mapping to ensure filtering works regardless of UI language
    const specializationMap: Record<string, string[]> = {
        therapist: ['терапевт', 'terapevt', 'therapist'],
        surgeon: ['хирург', 'xirurg', 'surgeon'],
        orthopedist: ['ортопед', 'ortoped', 'orthopedist', 'ortopedik'],
        orthodontist: ['ортодонт', 'ortodont', 'orthodontist'],
        periodontist: ['пародонтолог', 'parodontolog', 'periodontist'],
        pediatric: ['детский', 'bolalar', 'pediatric'],
        hygienist: ['гигиенист', 'gigiyenist', 'hygienist'],
        aesthetic: ['эстетик', 'estetik', 'aesthetic']
    };

    const isMatch = (docSpec: string | null | undefined, search: string, enforcedId?: string) => {
        if (!docSpec) return false;
        const dl = docSpec.toLowerCase();
        
        // 1. If we have an enforced ID (from direct click), check its aliases
        if (enforcedId && specializationMap[enforcedId]) {
            if (specializationMap[enforcedId].some(a => dl.includes(a))) return true;
        }

        if (!search) return false;
        const sl = search.toLowerCase();
        
        // 2. Direct string match
        if (dl.includes(sl) || sl.includes(dl)) return true;

        // 3. Cross-language categorical match
        for (const [key, aliases] of Object.entries(specializationMap)) {
            const isDocInCat = aliases.some(a => dl.includes(a));
            const isSearchInCat = aliases.some(a => sl.includes(a));
            if (isDocInCat && isSearchInCat) return true;
        }
        
        return false;
    };


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
    const doctors: Doctor[] = (dentists || [])
        .filter(d => {
            // 1. Strict Category Filter (if selected via grid)
            if (activeSpecialtyId) {
                if (!isMatch(d.specialization, "", activeSpecialtyId)) return false;
            }

            // 2. Search Term Filter (manual user input)
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                const nameMatch = d.full_name?.toLowerCase().includes(searchLower);
                // In manual search, we check both name and specialization strings
                const specMatch = isMatch(d.specialization, searchTerm);
                if (!nameMatch && !specMatch) return false;
            }

            // 3. District Filter
            if (district && district !== 'all') {
                const districtLower = district.toLowerCase();
                const addressStr = ((d.address || '') + ' ' + (d.clinic || '')).toLowerCase();
                if (districtLower === 'yunusabad' && !addressStr.includes('юнусабад') && !addressStr.includes('yunusobod')) return false;
                if (districtLower === 'chilonzor' && !addressStr.includes('чиланзар') && !addressStr.includes('chilonzor')) return false;
                if (districtLower === 'mirabad' && !addressStr.includes('мирабад') && !addressStr.includes('mirobod')) return false;
                if (districtLower === 'sergeli' && !addressStr.includes('сергели') && !addressStr.includes('sergeli')) return false;
            }
            return true;
        })
        .map(d => {
            const coordsFromAddress = parseCoordinates(d.address);
            const numericLat = typeof d.latitude === 'number' ? d.latitude : Number(d.latitude);
            const numericLng = typeof d.longitude === 'number' ? d.longitude : Number(d.longitude);
            const lat = Number.isFinite(numericLat) ? numericLat : coordsFromAddress?.lat;
            const lng = Number.isFinite(numericLng) ? numericLng : coordsFromAddress?.lng;
            const looksLikeCoords = !!coordsFromAddress;
            const docRating = (d as any).rating != null ? (d as any).rating : 0;

            return {
                id: d.id,
                name: d.full_name,
                direction: d.specialization || "Стоматолог",
                experience: (d as any).experience_years ? `${(d as any).experience_years} yil tajriba` : "5 yil tajriba",
                rating: docRating,
                review_count: (d as any).review_count || 0,
                image: DoctorImg,
                specialty: d.specialization || "Umumiy stomatologiya",
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
        })
        .sort((a, b) => {
            if (rating === 'high') return Number(b.rating) - Number(a.rating);
            if (rating === 'low') return Number(a.rating) - Number(b.rating);
            return 0; // default order
        });

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
                onSearchChange={(val) => {
                    setSearchTerm(val);
                    if (val) setActiveSpecialtyId(""); // Clear category if user starts typing manually
                }}
                location={locationFilter}
                onLocationChange={setLocationFilter}
                district={district}
                onDistrictChange={setDistrict}
                rating={rating}
                onRatingChange={setRating}
            />

            {activeSpecialtyId && (
                <div className="flex items-center gap-2 mb-4 px-1">
                    <div className="bg-blue-50 text-[#4D71F8] px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 border border-blue-100">
                        <span>{t(`patient.specialties.items.${activeSpecialtyId}.name`)}</span>
                        <button 
                            onClick={() => setActiveSpecialtyId("")}
                            className="hover:bg-blue-100 rounded-full p-0.5 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>
                    <span className="text-gray-400 text-xs font-semibold">
                        {t('patient.specialties.found_count', { count: doctors.length })}
                    </span>
                </div>
            )}

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
                            <p className="text-gray-500 text-lg">{t('patients_list.table.not_found')}</p>
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
                    {t('doctor_profile.all')} {t('doctor_profile.contacts')} {/** Map indicator */}
                </button>
            </div>

            {isMapModalOpen && (
                <div className="fixed inset-0 z-100 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4">
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
