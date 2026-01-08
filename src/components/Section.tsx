import React from 'react';
import { ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';

export default function AppointmentsPanel() {
  const [activeTab, setActiveTab] = React.useState('day');
  const [selectedTime, setSelectedTime] = React.useState('9:00');

  const tabs = [
    { id: 'day', label: 'День' },
    { id: 'week', label: 'Неделя' },
    { id: 'month', label: 'Месяц' }
  ];

  const timeSlots = ['9:00', '20:00'];

  const appointments = [
    { id: 1, name: 'Алишер Насруллаев', time: '9:00-10:00', status: 'default' },
    { id: 2, name: 'Алишер Насруллаев', time: '10:00-11:00', status: 'default' },
    { id: 3, name: 'Алишер Насруллаев', time: '14:00-15:00', status: 'active' },
    { id: 4, name: 'Алишер Насруллаев', time: '16:00-17:00', status: 'default' },
    { id: 5, name: 'Алишер Насруллаев', time: '20:00-21:00', status: 'default' }
  ];

  return (
    <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg p-6 ml-[875px] mt-6">
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-900 mb-5">Приёмы</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Time Slots */}
      <div className="flex items-center gap-3 mb-5">
        {timeSlots.map((time) => (
          <button
            key={time}
            onClick={() => setSelectedTime(time)}
            className={`px-5 py-2 rounded-xl font-medium text-sm transition-all ${
              selectedTime === time
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {time}
          </button>
        ))}
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between mb-5 px-2">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="text-center">
          <p className="text-sm text-gray-500">Сегодня</p>
          <p className="font-semibold text-gray-900">Декабрь 20, Суббота</p>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
              appointment.status === 'active'
                ? 'bg-blue-50 border-2 border-blue-500'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0"></div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-sm truncate ${
                appointment.status === 'active' ? 'text-blue-600' : 'text-gray-900'
              }`}>
                {appointment.name}
              </p>
              <p className={`text-xs ${
                appointment.status === 'active' ? 'text-blue-500' : 'text-gray-500'
              }`}>
                {appointment.time}
              </p>
            </div>

            {/* Menu Button */}
            <button className="p-1 hover:bg-white rounded-lg transition-colors flex-shrink-0">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}