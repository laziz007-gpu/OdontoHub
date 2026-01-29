"use client";

import React, { useState, type FC } from "react";
import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";

type Tab = { id: string; label: string };
type TimeSlot = { id: number; time: string; active: boolean };
type Appointment = { id: number; name: string; time: string };

const Section: FC = () => {
  const [activeTab, setActiveTab] = useState<string>("day");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const tabs: Tab[] = [
    { id: "day", label: "День" },
    { id: "week", label: "Неделя" },
    { id: "month", label: "Месяц" },
  ];

  const timeSlots: TimeSlot[] = [
    { id: 1, time: "9:00", active: true },
    { id: 2, time: "20:00", active: false },
  ];

  const appointments: Appointment[] = [
    { id: 1, name: "Алишер Насруллаев", time: "9:00-10:00" },
    { id: 2, name: "Алишер Насруллаев", time: "9:00-10:00" },
    { id: 3, name: "Алишер Насруллаев", time: "14:00-15:00" },
    { id: 4, name: "Алишер Насруллаев", time: "14:00-15:00" },
    { id: 5, name: "Алишер Насруллаев", time: "16:00-18:00" },
  ];

  const goToPreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const formatDate = (date: Date) => {
    const days = [
      "Воскресенье",
      "Понедельник",
      "Вторник",
      "Среда",
      "Четверг",
      "Пятница",
      "Суббота",
    ];

    const months = [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь",
    ];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];

    return `${month} ${day}, ${dayName}`;
  };

  return (
    <div className="w-full bg-white rounded-3xl shadow-sm p-6 flex flex-col gap-5 sticky top-6">
      <h2 className="text-2xl font-bold text-gray-900">Приёмы</h2>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Time Slots */}
      <div className="flex gap-3 justify-center">
        {timeSlots.map((slot) => (
          <div
            key={slot.id}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${slot.active
              ? "bg-blue-500 text-white"
              : "bg-blue-100 text-blue-600"
              }`}
          >
            {slot.time}
          </div>
        ))}
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={goToPreviousDay}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-400" />
        </button>

        <div className="text-center">
          <p className="text-xs text-gray-500 font-medium mb-0.5">Сегодня</p>
          <p className="text-sm font-bold text-gray-900">{formatDate(currentDate)}</p>
        </div>

        <button
          onClick={goToNextDay}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Appointments List */}
      <div className="flex flex-col gap-0 mt-2">
        {appointments.map((apt, index) => (
          <div
            key={apt.id}
            className={`flex items-center justify-between py-4 ${index !== appointments.length - 1 ? "border-b border-gray-100" : ""
              }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gray-200 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm text-gray-900">
                  {apt.name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {apt.time}
                </p>
              </div>
            </div>
            <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Section;