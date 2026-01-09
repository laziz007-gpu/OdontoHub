import { createBrowserRouter } from "react-router-dom";
import { paths } from "./path";
import Welcome from "../Pages/Welcome"

export const router = createBrowserRouter([
    {
        path: paths.welcome,
        children: [
            {
                index: true,
                element: <Welcome/>
            }
        ]
    }
])