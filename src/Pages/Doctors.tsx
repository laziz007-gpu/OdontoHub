
import DoctorsList from '../components/Doctors/DoctorsList';

const Doctors = () => {
    return (
        <div className="h-screen bg-gray-100/50 p-4 max-w-7xl mx-auto w-full flex flex-col pt-6">
            <div className="flex items-center gap-2 mb-4">
                {/* Back button could be added here if needed, but navigation is usually handled by layout or browser */}
            </div>
            <DoctorsList />
        </div>
    );
};

export default Doctors;
