import { Outlet } from "react-router-dom";

import PatientNavbar from "../components/Bosh sahifa/PatientNavbar";

const PatientLayout = () => {
    return (
        <div className="app-shell min-h-screen pb-24 sm:pb-0 sm:pl-24 lg:pl-72">
            <PatientNavbar />
            <main className="relative mx-auto min-h-screen max-w-7xl p-4 md:p-8 lg:p-10">
                <Outlet />
            </main>
        </div>
    );
};

export default PatientLayout;
