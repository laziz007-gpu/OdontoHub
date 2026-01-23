import React from "react";
import { Routes, Route } from "react-router-dom";
import MenuPage from "../pages/Menu";
import OdamPage from "../pages/Odam";

import PatientProfilePage from "../pages/PatientProfilePage";

const MenuRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<MenuPage />} />
      <Route path="/patsent" element={<OdamPage />} />
      <Route path="/patsent/:id" element={<PatientProfilePage />} />
    </Routes>
  );
};

export default MenuRoute;