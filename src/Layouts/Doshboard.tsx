// components/Sidebar.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Users,
  Calendar,
  MessageCircle,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import Logo from "../assets/img/icons/Logo3.svg";

type MenuItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  path: string;
};

export default function Sidebar() {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Mobile drawer ochilganda body scrollni bloklash
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const menuItems: MenuItem[] = [
    { id: "dashboard", label: "Панель управления", icon: LayoutDashboard, path: "/" },
    { id: "patients", label: "Пациенты", icon: Users, path: "/patsent" },
    { id: "appointments", label: "Приёмы", icon: Calendar, path: "/appointments" },
    { id: "chats", label: "Чаты", icon: MessageCircle, path: "/chats" },
  ];

  const SidebarInner = ({ isDrawer = false }: { isDrawer?: boolean }) => (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header qismi */}
      <div className="sticky top-0 z-10 bg-white border-b lg:border-none p-5 sm:p-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={Logo} alt="OdontoHUB" className="w-[216px] h-[52px] w-auto" />
        </Link>
        {isDrawer && (
          <button
            className="p-2 -mr-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Yopish"
          >
            <X size={26} />
          </button>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => {
                if (isDrawer) setIsMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? "bg-[#1e2235] text-white font-semibold shadow-md"
                  : "text-gray-800 hover:bg-gray-50 active:bg-gray-100"
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
              <span className="text-[15px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Fokus kartasi */}
      <div className="m-5 p-6 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 blur-2xl scale-125 rotate-6" />
        </div>
        <div className="relative z-10 text-center">
          <h3 className="text-lg font-bold mb-4">Сегодняшний фокус</h3>
          <div className="space-y-1.5 text-base font-medium">
            <p>7 приёмов</p>
            <p>3 онлайн-консульт.</p>
            <p>2 новых пациента</p>
          </div>
          <button className="mt-5 w-full bg-white text-gray-900 py-3 rounded-2xl font-semibold shadow hover:bg-gray-100 transition-colors">
            Аналитика
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-[280px] lg:flex-shrink-0 lg:border-r lg:border-gray-100 lg:h-screen lg:sticky lg:top-0 bg-white z-10">
        <SidebarInner />
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-40 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between px-4 py-3.5">
          <Link to="/" className="flex items-center gap-3">
            <img src={Logo} alt="OdontoHUB" className="h-7 w-auto" />
          </Link>
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 -mr-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Menyuni ochish"
          >
            <Menu size={26} className="text-gray-800" />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-50 lg:hidden ${isMobileOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isMobileOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setIsMobileOpen(false)}
        />

        {/* Sidebar panel */}
        <aside
          className={`absolute inset-y-0 left-0 w-[85vw] max-w-xs bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="h-full overflow-y-auto">
            <SidebarInner isDrawer />
          </div>
        </aside>
      </div>
    </>
  );
}