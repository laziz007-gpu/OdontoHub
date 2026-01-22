import React from "react";
import { Routes, Route } from "react-router-dom";
import MenuPage from "../pages/Menu";
import OdamPage from "../pages/Odam";

const MenuRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<MenuPage />} />
      <Route path="/patsent" element={<OdamPage />} />
    </Routes>
  );
};

export default MenuRoute;