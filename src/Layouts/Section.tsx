import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';

// Tab turi
type Tab = {
  id: string;
  label: string;
};

// Appointment turi
type Appointment = {
  id: number;
  name: string;
  time: string;
  active: boolean;
};

export default function Section() {
  const [activeTab, setActiveTab] = useState<string>('day');
  
  const tabs: Tab[] = [
    { id: 'day', label: 'День' },
    { id: 'week', label: 'Неделя' },
    { id: 'month', label: 'Месяц' }
  ];

  const appointments: Appointment[] = [
    { id: 1, name: "Алишер Насруллаев", time: "9:00-10:00", active: false },
    { id: 2, name: "Алишер Насруллаев", time: "10:00-11:00", active: false },
    { id: 3, name: "Алишер Насруллаев", time: "14:00-15:00", active: true },
    { id: 4, name: "Алишер Насруллаев", time: "16:00-17:00", active: false },
    { id: 5, name: "Алишер Насруллаев", time: "20:00-21:00", active: false }
  ];

  return (
    <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-5">Приёмы</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === tab.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Time buttons */}
      <div className="flex gap-3 mb-5">
        <button className="px-5 py-2 rounded-xl font-medium text-sm bg-blue-100 text-blue-600">9:00</button>
        <button className="px-5 py-2 rounded-xl font-medium text-sm bg-gray-100 text-gray-600">20:00</button>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between mb-5 px-2">
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="text-center">
          <p className="text-sm text-gray-500">Сегодня</p>
          <p className="font-semibold text-gray-900">Декабрь 20, Суббота</p>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className={`flex items-center gap-3 p-3 rounded-2xl ${
              apt.active ? 'bg-blue-50 border-2 border-blue-500' : 'bg-gray-50'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0"></div>
            <div className="flex-1">
              <p className={`font-semibold text-sm ${apt.active ? 'text-blue-600' : 'text-gray-900'}`}>
                {apt.name}
              </p>
              <p className={`text-xs ${apt.active ? 'text-blue-500' : 'text-gray-500'}`}>{apt.time}</p>
            </div>
            <button className="p-1">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
