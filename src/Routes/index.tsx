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
                element: <div>History Page (Soon)</div>
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
            }
        ]
    }
])