import { Outlet } from "react-router-dom";
import PatientNavbar from "../components/PatientNavbar";

const PatientLayout = () => {
    return (
        <div className="min-h-screen  pb-20 sm:pb-0 sm:pl-20 lg:pl-64">
            <PatientNavbar />
            <main className="max-w-7xl mx-auto min-h-screen bg-gray-50 relative p-4 md:p-8 lg:p-12">
                <Outlet />
            </main>
        </div>
    );
};

export default PatientLayout;
