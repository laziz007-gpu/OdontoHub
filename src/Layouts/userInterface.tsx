// src/layouts/UserInterface.tsx
import React from 'react';
import Header from '../components/Header';        // sizning Header komponentingiz

interface UserInterfaceProps {
  children: React.ReactNode;
}

export default function UserInterface({ children }: UserInterfaceProps) {
  return (
    <div className="flex min-h-screen bg-[#F0F3FF]">
      {/* Chap tarafdagi doimiy sidebar */}
      <aside className="hidden lg:block lg:w-[280px] lg:border-r lg:border-gray-100 lg:bg-white">
        <Header />   {/* ← Bu yerda sizning Header (sidebar) komponentingiz */}
      </aside>

      {/* Asosiy kontent */}
      <div className="flex-1 flex flex-col">
        {/* Mobil uchun header (faqat kichik ekranlarda ko‘rinadi) */}
        <div className="lg:hidden">
          <Header />  {/* yoki mobil versiyani alohida qilishingiz mumkin */}
        </div>

        {/* Bu yerga har bir page keladi (Menu, Dashboard va h.k.) */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}