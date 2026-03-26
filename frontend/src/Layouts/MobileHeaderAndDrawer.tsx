import React, { useState, useEffect, type FC } from 'react';
import { Menu, X, LayoutDashboard, Users, Calendar, MessageCircle, type LucideIcon } from 'lucide-react';
import Logo from '../assets/img/icons/Logo3.svg'; // o'zingiznikini qo'ying
// import NotificationBadge from '../components/Shared/NotificationBadge';

interface MenuItem {
  icon: LucideIcon;
  label: string;
  id: string;
}

const MobileHeaderAndDrawer: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Scroll bloklash (mobil menyuni ochganda sahifa siljimaydi)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const menuItems: MenuItem[] = [
    { icon: LayoutDashboard, label: 'Панель управления', id: 'dashboard' },
    { icon: Users, label: 'Пациенты', id: 'patients' },
    { icon: Calendar, label: 'Приёмы', id: 'appointments' },
    { icon: MessageCircle, label: 'Чаты', id: 'chats' },
  ];

  return (
    <>
      {/* MOBIL HEADER — burger shu yerda */}
      <header className="
        lg:hidden fixed top-0 left-0 right-0 z-50 
        bg-white border-b border-gray-200 shadow-sm
      ">
        <div className="px-4 py-3.5 flex items-center justify-between">
          {/* Logo chapda */}
          <div className="flex items-center gap-3">
            <img src={Logo} alt="OdontoHUB" className="h-8 w-auto" />
          </div>

          {/* BURGER — o'ngda */}
          <div className="flex items-center gap-2">
            {/* <NotificationBadge /> */}
            <button
              onClick={() => setIsOpen(true)}
              className="p-2 -mr-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Menyuni ochish"
            >
              <Menu size={28} className="text-gray-800" />
            </button>
          </div>
        </div>
      </header>

      {/* DRAWER (yon panel) — burger bosilganda chiqadi */}
      <div
        className={`
          fixed inset-0 z-[100] lg:hidden transition-all duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      >
        {/* Orqa qoraytirish */}
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsOpen(false)}
        />

        {/* Sidebar panel */}
        <div
          className={`
            absolute top-0 bottom-0 left-0 w-[85vw] max-w-[320px] bg-white shadow-2xl
            transform transition-transform duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          {/* Header ichida yopish tugmasi + logo */}
          <div className="p-5 flex items-center justify-between border-b">
            <div className="flex items-center gap-3">
              <img src={Logo} alt="OdontoHUB" className="h-8 w-auto" />
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X size={28} className="text-gray-700" />
            </button>
          </div>

          {/* Menyu */}
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className="w-full flex items-center gap-4 px-5 py-4 rounded-xl text-left hover:bg-gray-50 active:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <item.icon size={24} className="text-gray-700" />
                <span className="text-base font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default MobileHeaderAndDrawer;