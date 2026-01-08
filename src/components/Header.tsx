import React from 'react';
import { Users, Calendar, MessageCircle, LayoutDashboard, Menu, X } from 'lucide-react';
import Logo from '../assets/img/icons/Logo3.svg';

export default function Header() {
  const [activeItem, setActiveItem] = React.useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Панель управления', icon: LayoutDashboard },
    { id: 'patients', label: 'Пациенты', icon: Users },
    { id: 'appointments', label: 'Приёмы', icon: Calendar },
    { id: 'chats', label: 'Чаты', icon: MessageCircle },
  ];

  const SidebarContent = () => (
    <>
      {/* Menu Items */}
      <nav className="flex-1 px-4 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveItem(item.id);
                setIsMobileMenuOpen(false); // mobilda yopish
              }}
              className={`w-full flex items-center gap-4 px-5 py-4 mb-3 rounded-2xl transition-all font-medium text-lg ${
                isActive ? 'bg-gray-900 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className=''>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Today's Focus Card */}
      <div className="m-6 p-6 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-2xl text-white shadow-lg">
        <h3 className="text-lg font-bold mb-4">Сегодняшний фокус</h3>
        <div className="space-y-2 mb-4">
          <p className="text-sm font-semibold">0 приёмов</p>
          <p className="text-sm font-semibold">0 онлайн-консульт.</p>
          <p className="text-sm font-semibold">0 новых пациентов</p>
        </div>
        <button className="w-full bg-white text-blue-600 py-2 px-4 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors">
          Аналитика
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:h-screen lg:bg-white lg:shadow-lg lg:flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <img src={Logo} alt="OdontoHUB" className="w-[180px] h-auto" />
        </div>
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-3 rounded-xl hover:bg-gray-100 transition"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <div className="w-12" /> {/* balans uchun */}
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sidebar Drawer */}
          <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-2xl z-50 overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <img src={Logo} alt="OdontoHUB" className="w-28 h-auto" />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}
