import React, { useEffect, useState, type FC } from 'react';
import { Calendar, LayoutDashboard, Menu, MessageCircle, Users, X, type LucideIcon } from 'lucide-react';

import GoSmileLogo from '../assets/img/icons/logo1.png';

interface MenuItem {
  icon: LucideIcon;
  label: string;
  id: string;
}

const MobileHeaderAndDrawer: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const menuItems: MenuItem[] = [
    { icon: LayoutDashboard, label: 'Панель управления', id: 'dashboard' },
    { icon: Users, label: 'Пациенты', id: 'patients' },
    { icon: Calendar, label: 'Приёмы', id: 'appointments' },
    { icon: MessageCircle, label: 'Чаты', id: 'chats' },
  ];

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/40 bg-white/70 shadow-sm backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-3">
            <img src={GoSmileLogo} alt="GoSmile" />
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="rounded-lg p-2 transition-colors hover:bg-white"
            aria-label="Открыть меню"
          >
            <Menu size={28} className="text-[#42507f]" />
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[100] transition-all duration-300 lg:hidden ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div
          className={`absolute inset-0 bg-[#1f2758]/35 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsOpen(false)}
        />

        <div
          className={`absolute bottom-0 left-0 top-0 w-[85vw] max-w-[320px] bg-transparent p-3 shadow-2xl transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="app-panel flex h-full flex-col rounded-[32px] border border-white/70">
            <div className="flex items-center justify-between border-b border-white/50 p-5">
              <div className="flex items-center gap-3">
                <img src={GoSmileLogo} alt="GoSmile" />
              </div>
              <button onClick={() => setIsOpen(false)} className="rounded-full p-2 hover:bg-white/60">
                <X size={28} className="text-[#42507f]" />
              </button>
            </div>

            <nav className="space-y-2 p-4">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  className="flex w-full items-center gap-4 rounded-xl px-5 py-4 text-left transition-colors hover:bg-white/70 active:bg-white"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon size={24} className="text-[#42507f]" />
                  <span className="font-railway text-base font-semibold text-[#42507f]">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileHeaderAndDrawer;
