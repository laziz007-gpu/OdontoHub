import React, { useState } from 'react';
import { Users, Calendar, MessageCircle, LayoutDashboard, Menu, X } from 'lucide-react';
import Logo from '../assets/img/icons/Logo3.svg';

// Menu item turi
type MenuItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
};

export default function Header() {
  const [activeItem, setActiveItem] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Панель управления', icon: LayoutDashboard },
    { id: 'patients', label: 'Пациенты', icon: Users },
    { id: 'appointments', label: 'Приёмы', icon: Calendar },
    { id: 'chats', label: 'Чаты', icon: MessageCircle },
  ];

  // Sidebar content
  const SidebarContent: React.FC = () => (
    <div className="flex flex-col h-full bg-white">
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
              className={`w-full flex items-center gap-4 px-5 py-4 mb-2 rounded-[22px] transition-all duration-200 ${
                isActive
                  ? 'bg-[#1e2235] text-white shadow-lg'
                  : 'text-[#1e2235] hover:bg-gray-50'
              }`}
            >
              <div className="w-6 h-6 flex items-center justify-center shrink-0">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[17px] whitespace-nowrap ${isActive ? 'font-bold' : 'font-semibold'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="mx-4 mb-8 p-6 rounded-[32px] relative overflow-hidden bg-black text-center min-h-[220px] flex flex-col justify-between shadow-2xl">
        <div className="absolute inset-0 opacity-60">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-orange-500 blur-2xl transform scale-150 rotate-12"></div>
        </div>

        <div className="relative z-10">
          <h3 className="text-[19px] font-bold text-white mb-6">Сегодняшний фокус</h3>
          <div className="space-y-1 text-white text-[19px] font-extrabold leading-tight tracking-tight">
            <p>7 приёмов</p>
            <p>3 онлайн-консульт.</p>
            <p>2 новых пациентов</p>
          </div>
        </div>

        <button className="relative z-10 mt-6 w-full bg-white text-[#4e6ef2] py-3.5 px-4 rounded-[18px] font-bold text-[15px] shadow-sm hover:bg-gray-50 transition-colors">
          Аналитика
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-[280px] lg:h-screen lg:bg-white lg:flex-col border-r border-gray-100">
        <div className="p-8 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg"></div>
            <img src={Logo} alt="Logo" />
          </div>
        </div>
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white p-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg"></div>
          <img src={Logo} alt="Logo" />
        </div>
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 rounded-lg bg-gray-50">
          <Menu className="w-6 h-6 text-[#1e2235]" />
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="fixed left-0 top-0 bottom-0 w-[280px] bg-white z-50 flex flex-col shadow-2xl">
            <div className="p-6 flex justify-between items-center border-b">
              <div className="flex items-center gap-2"></div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={24} />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}
