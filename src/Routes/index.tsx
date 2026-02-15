import { createBrowserRouter } from "react-router-dom";
import { paths } from "./path";
import Welcome from "../Pages/Welcome"
import PublickRoute from "../HOC/PublickRoute";
import Role from "../Pages/Role";

import Patsant from "../Pages/Patsant";
import Menu from "../Pages/Menu";
import MainLayout from "../Layouts/MainLayout";
import PatientProfile from "../Pages/PatientProfile";
import DoctorProfile from "../Pages/DoctorProfile";
import Settings from "../Pages/Settings";
import Appointments from "../Pages/Appointments";
import Analitic from "../Pages/Analitic";
import Finance from "../Pages/Finance";
import Chats from "../Pages/Chats";

import PatientLayout from "../Layouts/PatientLayout";
import PatientHome from "../Pages/PatientHome";
import PatientAppointments from "../Pages/PatientAppointments";
import PatientAppointmentDetail from "../Pages/PatientAppointmentDetail";
import PatientChats from "../Pages/PatientChats";
import PatientChatDetail from "../Pages/PatientChatDetail";
import PatientProfilePage from "../Pages/PatientProfilePage";
import PatientHistory from "../Pages/PatientHistory";
import Doctors from "../Pages/Doctors";
import Specialties from "../Pages/Specialties";
import Notifications from "../Pages/Notifications";
import Booking from "../Pages/Booking";
import CheckupBookingPreview from "../Pages/CheckupBookingPreview";
import DoctorProfilePreview from "../Pages/DoctorProfilePreview";
import ChatProfilePage from "../Pages/ChatProfilePage";
import TreatmentsListPage from "../Pages/TreatmentsListPage";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <PublickRoute />,
        children: [
            {
                index: true,
                element: <Welcome />
            },
            {
                path: paths.role,
                element: <Role />
            },
            {
                element: <MainLayout />,
                children: [
                    {
                        path: paths.menu,
                        element: <Menu />
                    },
                    {
                        path: paths.patient,
                        element: <Patsant />
                    },
                    {
                        path: paths.patientProfile,
                        element: <PatientProfile />
                    },
                    {
                        path: paths.profile,
                        element: <DoctorProfile />
                    },
                    {
                        path: paths.settings,
                        element: <Settings />
                    },
                    {
                        path: paths.appointments,
                        element: <Appointments />
                    },
                    {
                        path: paths.analytics,
                        element: <Analitic />
                    },
                    {
                        path: paths.finance,
                        element: <Finance />
                    },
                    {
                        path: paths.chats,
                        element: <Chats />
                    },
                    {
                        path: paths.chatDetail,
                        element: <Chats />
                    }
                ]
            }
        ]
    },
    {
        element: <PatientLayout />,
        children: [
            {
                path: paths.patientHome,
                element: <PatientHome />
            },
            {
                path: paths.patientCalendar,
                element: <PatientAppointments />
            },
            {
                path: paths.patientAppointmentDetail,
                element: <PatientAppointmentDetail />
            },
            {
                path: paths.patientHistory,
                element: <PatientHistory />
            },
            {
                path: paths.patientProfileSettings,
                element: <PatientProfilePage />
            },
            {
                path: paths.patientChats,
                element: <PatientChats />
            },
            {
                path: paths.patientChatDetail,
                element: <PatientChatDetail />
            },
            {
                path: paths.patientChatProfile,
                element: <ChatProfilePage />
            },
            {
                path: paths.doctors,
                element: <Doctors />
            },
            {
                path: paths.specialties,
                element: <Specialties />
            },
            {
                path: paths.notifications,
                element: <Notifications />
            },
            {
                path: paths.booking,
                element: <Booking />
            },
            {
                path: paths.checkupPreview,
                element: <CheckupBookingPreview />
            },
            {
                path: paths.myDentist,
                element: <DoctorProfilePreview />
            },
            {
                path: paths.treatments,
                element: <TreatmentsListPage />
            }
        ]
    }
])