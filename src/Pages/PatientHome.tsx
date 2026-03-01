import SearchBar from "../components/PatientHome/SearchBar";
import UpcomingAppointment from "../components/PatientHome/UpcomingAppointment";
import ServicesGrid from "../components/PatientHome/ServicesGrid";
import QuickActionsGrid from "../components/PatientHome/QuickActionsGrid";
import SuggestedDoctors from "../components/PatientHome/SuggestedDoctors";

const PatientHome = () => {
    return (
        <div className="p-4 space-y-8 pb-24 max-w-7xl mx-auto w-full">
            <SearchBar />
            <UpcomingAppointment />
            <SuggestedDoctors />
            <ServicesGrid />
            <QuickActionsGrid />
        </div>
    );
};

export default PatientHome;
