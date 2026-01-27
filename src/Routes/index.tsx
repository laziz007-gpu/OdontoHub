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
                    }
                ]
            }
        ]
    }
])