import DoctorsList from '../components/Doctors/DoctorsList';
import { useEffect, useState } from 'react';

const Doctors = () => {
    const [isFirstTime, setIsFirstTime] = useState(false);

    useEffect(() => {
        const firstTime = localStorage.getItem('is_first_time');
        if (firstTime === 'true') {
            setIsFirstTime(true);
            // Remove the flag after showing
            setTimeout(() => {
                localStorage.removeItem('is_first_time');
                setIsFirstTime(false);
            }, 5000);
        }
    }, []);

    return (
        <div className="h-screen bg-gray-100/50 p-4 max-w-7xl mx-auto w-full flex flex-col pt-6">
            {isFirstTime && (
                <div className="mb-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl p-6 shadow-lg animate-in slide-in-from-top duration-500">
                    <h2 className="text-2xl font-black text-white mb-2">Добро пожаловать! 👋</h2>
                    <p className="text-white/90 font-semibold text-base">
                        Выберите стоматолога из списка ниже для записи на приём
                    </p>
                </div>
            )}
            <div className="flex items-center gap-2 mb-4">
                {/* Back button could be added here if needed, but navigation is usually handled by layout or browser */}
            </div>
            <DoctorsList />
        </div>
    );
};

export default Doctors;
