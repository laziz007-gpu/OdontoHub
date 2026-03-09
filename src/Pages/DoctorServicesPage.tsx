import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api/api";

interface Service {
    id: number;
    name: string;
    price: number;
    currency: string;
}

const DoctorServicesPage = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await api.get<Service[]>('/services/');
            setServices(response.data);
        } catch (error) {
            console.error('Error fetching services:', error);
            // Fallback data
            setServices([
                { id: 1, name: "Консультация", price: 50000, currency: "UZS" },
                { id: 2, name: "Лечение кариеса", price: 150000, currency: "UZS" },
                { id: 3, name: "Чистка зубов", price: 100000, currency: "UZS" },
                { id: 4, name: "Отбеливание", price: 300000, currency: "UZS" },
                { id: 5, name: "Гигиена полости рта", price: 80000, currency: "UZS" },
                { id: 6, name: "Удаление зубного камня", price: 120000, currency: "UZS" },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ru-RU').format(price);
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
                        Услуги
                    </h1>
                </div>

                <div className="flex-1 px-4 space-y-3">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                        </div>
                    ) : (
                        services.map((service) => (
                            <div
                                key={service.id}
                                className="bg-white rounded-[20px] p-5 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-base font-bold text-[#1D1D2B] mb-1">
                                            {service.name}
                                        </h3>
                                        <p className="text-lg font-black text-[#4E70FF]">
                                            {formatPrice(service.price)} {service.currency}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => navigate('/booking')}
                                        className="bg-[#11D76A] text-white font-bold py-2 px-6 rounded-full text-sm hover:bg-[#0fc460] transition-all active:scale-95"
                                    >
                                        Записаться
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorServicesPage;
