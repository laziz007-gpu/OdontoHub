
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Menu from '../pages/Menu'
const router = createBrowserRouter([
  {
    path: "/",
    element: <Menu/>,
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
