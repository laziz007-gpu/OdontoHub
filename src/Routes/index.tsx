import { createBrowserRouter } from "react-router-dom";
import { paths } from "./path";
import Welcome from "../Pages/Welcome"
import PublickRoute from "../HOC/PublickRoute";
import Role from "../Pages/Role";

export const router = createBrowserRouter([
    {
        path: paths.welcome,
        element: <PublickRoute/>,
        children: [{
            index: true,
            element: <Welcome/>
        }]
    },
    {
        path:paths.role,
        element: <PublickRoute/>,
        children:[{
            index: true,
            element: <Role/>
        }]
    }
])