import React from 'react';
import SearchIcon from '../assets/img/icons/Search.svg';
import Star from '../assets/img/icons/Star.svg';
import Qongiroq from '../assets/img/icons/Notification.svg';
import Settings from '../assets/img/icons/Settings.svg';
import Brat from '../assets/img/photos/MenuProfileImg.png';

export default function TopBar() {
  return (
    <div className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
      <div className="mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center gap-3 md:gap-5 lg:gap-6">

          {/* Search – mobil uchun ham katta va qulay */}
          <div className="relative flex-1 min-w-[220px] max-w-full order-1">
            <input
              type="text"
              placeholder="Поиск пациентов, приёмов..."
              className="w-full h-[52px] md:h-[58px] pl-12 pr-5 bg-gray-50 border border-gray-300 rounded-2xl 
                         text-gray-700 placeholder-gray-500 text-sm md:text-base 
                         focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent 
                         transition-all"
            />
            <img
              src={SearchIcon}
              alt="Search"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-gray-500"
            />
          </div>

          {/* Consultation Button */}
          <button className="flex-shrink-0 order-3 md:order-2 w-full sm:w-auto sm:min-w-[160px] md:w-[178px] 
                             h-[52px] md:h-[58px] bg-blue-600 hover:bg-blue-700 active:bg-blue-800 
                             text-white font-medium rounded-2xl transition-all shadow-sm text-sm md:text-base">
            Консультация
          </button>

          {/* Rating – mobil uchun ham ko'rinadi (sm dan boshlab) */}
          <div className="hidden sm:flex flex-shrink-0 order-4 md:order-3 h-[52px] md:h-[58px] 
                          px-4 md:px-5 items-center gap-2 md:gap-3 bg-gradient-to-r from-amber-400 to-orange-400 
                          text-white rounded-2xl shadow-sm">
            <img src={Star} alt="Star" className="w-8 h-8 md:w-9 md:h-9" />
            <div className="flex flex-col leading-none">
              <span className="font-bold text-lg md:text-xl">4.5</span>
              <span className="text-[10px] md:text-xs opacity-90">улучшить</span>
            </div>
          </div>

          {/* Notifications */}
          <button className="flex-shrink-0 order-5 md:order-4 w-[52px] md:w-[58px] h-[52px] md:h-[58px] 
                             flex items-center justify-center bg-gray-50 hover:bg-gray-100 
                             rounded-2xl transition-colors">
            <img src={Qongiroq} alt="Notifications" className="w-6 h-6 md:w-7 md:h-7" />
          </button>

          {/* Settings */}
          <button className="flex-shrink-0 order-6 md:order-5 w-[52px] md:w-[58px] h-[52px] md:h-[58px] 
                             flex items-center justify-center bg-gray-50 hover:bg-gray-100 
                             rounded-2xl transition-colors">
            <img src={Settings} alt="Settings" className="w-6 h-6 md:w-7 md:h-7" />
          </button>

          {/* Profile – mobil uchun ham ko'rinadi */}
          <div className="hidden sm:flex flex-shrink-0 order-7 md:order-6 h-[52px] md:h-[58px] 
                          pl-3 pr-4 md:pr-5 items-center gap-2 md:gap-3 bg-gray-900 text-white 
                          rounded-2xl shadow-sm hover:bg-gray-800 transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
              <img src={Brat} alt="Пулатов М" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm md:text-base">Пулатов М</span>
              <span className="text-xs text-gray-400 hidden md:block">Хирург</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}