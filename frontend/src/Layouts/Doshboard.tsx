import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Users, Calendar, MessageCircle, LayoutDashboard, Bell, Menu, X } from "lucide-react";
import GoSmileLogo from "../components/Shared/GoSmileLogo";
import { paths } from "../Routes/path";
import { useTranslation } from "react-i18next";
import { useMyAppointments } from "../api/appointments";
import { useAllPatients } from "../api/profile";
import { useUnreadCount } from "../api/notifications";

type MenuItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  path: string;
};

export default function Sidebar() {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { t } = useTranslation();

  // Fetch real data
  const { data: appointments } = useMyAppointments();
  const { data: patients } = useAllPatients();

  // Calculate today's stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayAppointments = appointments?.filter((apt: any) => {
    const aptDate = new Date(apt.start_time);
    return aptDate >= today && aptDate < tomorrow;
  }).length || 0;

  // Calculate today's new patients
  const newPatientsToday = patients?.filter((p: any) => {
    if (!p.created_at) return false;
    const createdDate = new Date(p.created_at);
    createdDate.setHours(0, 0, 0, 0);
    return createdDate.getTime() === today.getTime();
  }).length || 0;

  // Mobile drawer ochilganda body scrollni bloklash
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const menuItems: MenuItem[] = [
    { id: "dashboard", label: t('sidebar.dashboard'), icon: LayoutDashboard, path: paths.menu },
    { id: "patients", label: t('sidebar.patients'), icon: Users, path: paths.patient },
    { id: "appointments", label: t('sidebar.appointments'), icon: Calendar, path: paths.appointments },
    { id: "chats", label: t('sidebar.chats'), icon: MessageCircle, path: paths.chats },
    { id: "notifications", label: t('sidebar.notifications', 'Уведомления'), icon: Bell, path: '/notifications' },
  ];

  const { data: unreadCount = 0 } = useUnreadCount();

  const SidebarInner = ({ isDrawer = false }: { isDrawer?: boolean }) => (
    <div className="flex min-h-full flex-col bg-white">
      {/* Header qismi */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-4 py-5 sm:px-5 sm:py-6 lg:border-none">
        <Link to={paths.menu} className="flex w-full min-w-0 items-center overflow-hidden">
          <GoSmileLogo variant="full" size="xl" auto />
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
      <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-5 sm:px-4 sm:py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.id === 'chats' && location.pathname.startsWith('/chats'));

          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => {
                if (isDrawer) setIsMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive
                ? "bg-[#1e2235] text-white font-semibold shadow-md"
                : "text-gray-800 hover:bg-gray-50 active:bg-gray-100"
                }`}
            >
              <div className="relative shrink-0">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {item.id === 'notifications' && unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <span className="text-[15px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Fokus kartasi */}
      <div className="relative m-3 mt-0 overflow-hidden rounded-3xl bg-linear-to-br from-gray-900 to-gray-800 p-5 text-white shadow-xl sm:m-5 sm:p-6">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
        </div>
        <div className="relative z-10 text-center">
          <h3 className="text-lg font-bold mb-4">{t('sidebar.focus_title')}</h3>
          <div className="space-y-1.5 text-base font-medium">
            <p>{todayAppointments} {todayAppointments === 1 ? t('sidebar.focus_appointment_single') : t('sidebar.focus_appointments_plural')}</p>
            <p>{newPatientsToday} {newPatientsToday === 1 ? t('sidebar.focus_new_patient_single') : t('sidebar.focus_new_patients_plural')}</p>
          </div>
          <Link to={paths.analytics}>
            <button className="mt-5 w-full bg-white text-gray-900 py-3 rounded-2xl font-semibold shadow hover:bg-gray-100 transition-colors">
              {t('sidebar.analytics')}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="z-10 hidden bg-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[280px] lg:shrink-0 lg:border-r lg:border-gray-100">
        <SidebarInner />
      </aside>

      {/* Mobile header */}
      <header className="fixed inset-x-0 top-0 z-40 border-b bg-white shadow-sm lg:hidden">
        <div className="flex h-20 items-center justify-between px-4">
          <Link to={paths.menu} className="flex min-w-0 items-center">
            <GoSmileLogo variant="full" size="sm" auto />
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
          className={`absolute inset-y-0 left-0 w-[88vw] max-w-xs bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isMobileOpen ? "translate-x-0" : "-translate-x-full"
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
