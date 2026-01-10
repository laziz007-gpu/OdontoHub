import React from 'react';
import { Search } from 'lucide-react';
import Bell from '../assets/img/icons/Settings.svg'
import Notification from '../assets/img/icons/Notification.svg'
import Star from '../assets/img/icons/Star.svg'
export default function Hero() {
  return (
    <div className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
      <div className="mx-auto px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Поиск"
              className="w-full h-[52px] pl-12 pr-5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-700 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          </div>

          <button className="h-[52px] px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-2xl transition-all shadow-sm">
            Консультация
          </button>

          <div className="flex h-[52px] px-5 items-center gap-3 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-2xl shadow-sm">
           <img src={Star} alt="" />
            <div className="flex flex-col leading-none">
              <span className="font-bold text-xl">4.5</span>
              <span className="text-xs opacity-90">улучшить рейтинг</span>
            </div>
          </div>

          <button className="w-[52px] h-[52px] flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-2xl relative">
            <img src={Notification} className="w-6 h-6 text-gray-700" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full"></span>
          </button>

          <button className="w-[52px] h-[52px] flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-2xl">
            <img src={Bell} className="w-6 h-6 text-gray-700" />
          </button>

          <div className="flex h-[52px] pl-3 pr-5 items-center gap-3 bg-gray-900 text-white rounded-2xl cursor-pointer hover:bg-gray-800">
            <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center font-bold">П</div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">Пулатов М</span>
              <span className="text-xs text-gray-400">Хирург</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}