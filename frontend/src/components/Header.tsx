import React, { useState } from 'react';
import { Calendar, LayoutDashboard, Menu, MessageCircle, Users, X } from 'lucide-react';

import { useDentistStats } from '../api/profile';
import GoSmileLogo from '../assets/img/icons/logo1.png';

type MenuItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
};

export default function Header() {
  const [activeItem, setActiveItem] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const { data: stats } = useDentistStats();

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Панель управления', icon: LayoutDashboard },
    { id: 'patients', label: 'Пациенты', icon: Users },
    { id: 'appointments', label: 'Приёмы', icon: Calendar },
    { id: 'chats', label: 'Чаты', icon: MessageCircle },
  ];

  const SidebarContent: React.FC = () => (
    <div className="flex h-full flex-col">
      <nav className="flex-1 px-4 py-8">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveItem(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`mb-2 flex w-full items-center gap-4 rounded-[22px] px-5 py-4 transition-all duration-200 ${
                isActive
                  ? 'bg-[linear-gradient(135deg,#6679ff_0%,#5667ff_100%)] text-white shadow-[0_16px_34px_rgba(86,103,255,0.28)]'
                  : 'text-[#42507f] hover:bg-white/70'
              }`}
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`font-railway whitespace-nowrap text-[17px] ${isActive ? 'font-bold' : 'font-semibold'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="m-4 mb-8 rounded-[32px] bg-[linear-gradient(135deg,#6577ff_0%,#8b7cf6_100%)] p-6 text-center text-white shadow-[0_24px_50px_rgba(90,96,195,0.28)]">
        <div className="relative z-10">
          <h3 className="mb-6 font-space text-[19px] font-bold">Сегодняшний фокус</h3>
          <div className="space-y-1 font-railway text-[19px] font-extrabold leading-tight tracking-tight">
            <p>{stats?.appointments_today || 0} приёмов</p>
            <p>3 онлайн-консульт.</p>
            <p>{stats?.new_patients_this_week || 0} новых пациентов</p>
          </div>
        </div>

        <button className="relative z-10 mt-6 w-full rounded-[18px] bg-white px-4 py-3.5 font-space text-[15px] font-bold text-[#5667ff] shadow-sm transition-colors hover:bg-gray-50">
          Аналитика
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden border-r border-white/50 bg-transparent lg:flex lg:h-screen lg:w-[280px] lg:flex-col lg:p-4">
        <div className="app-panel flex h-full flex-col rounded-[32px] border border-white/70">
          <div className="p-8 pb-2">
            <div className="flex items-center gap-2">
              <img src={GoSmileLogo} alt="GoSmile" />
            </div>
          </div>
          <SidebarContent />
        </div>
      </aside>

      <div className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-white/40 bg-white/70 p-4 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-2">
          <img src={GoSmileLogo} alt="GoSmile" />
        </div>
        <button onClick={() => setIsMobileMenuOpen(true)} className="rounded-lg bg-white/60 p-2">
          <Menu className="h-6 w-6 text-[#1e2235]" />
        </button>
      </div>

      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-[#1f2758]/35 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="fixed bottom-0 left-0 top-0 z-50 flex w-[280px] flex-col bg-transparent p-3 shadow-2xl">
            <div className="app-panel flex h-full flex-col rounded-[32px] border border-white/70">
              <div className="flex items-center justify-between border-b border-white/50 p-6">
                <div className="flex items-center gap-2">
                  <img src={GoSmileLogo} alt="GoSmile" />
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="rounded-full p-2 hover:bg-white/60">
                  <X size={24} />
                </button>
              </div>
              <SidebarContent />
            </div>
          </aside>
        </>
      )}
    </>
  );
}
