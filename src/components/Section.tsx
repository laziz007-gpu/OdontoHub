"use client";

import { useState, type FC } from "react";
import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import { useTranslation } from "react-i18next";

type Tab = { id: string; labelKey: string };
type TimeSlot = { id: number; time: string; active: boolean };
type Appointment = { id: number; name: string; time: string };

const Section: FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>("day");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const tabs: Tab[] = [
    { id: "day", labelKey: "dashboard.appointments_card.tabs.day" },
    { id: "week", labelKey: "dashboard.appointments_card.tabs.week" },
    { id: "month", labelKey: "dashboard.appointments_card.tabs.month" },
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
    const dayName = t(`dashboard.appointments_card.weekdays.${date.getDay()}`);
    const day = date.getDate();
    const month = t(`dashboard.appointments_card.months.${date.getMonth()}`);

    return `${month} ${day}, ${dayName}`;
  };

  return (
    <div className="sticky top-6 w-full bg-white rounded-3xl shadow-sm p-6 flex flex-col gap-5 h-fit max-h-[calc(100vh-48px)] overflow-y-auto custom-scrollbar">
      <h2 className="text-2xl font-bold text-gray-900">{t('dashboard.appointments_card.title')}</h2>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      {/* Time Slots */}
      <div className="flex gap-3 justify-center">
        {timeSlots.map((slot) => (
          <div
            key={slot.id}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
              slot.active
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
          <p className="text-xs text-gray-500 font-medium mb-0.5">{t('dashboard.appointments_card.today')}</p>
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
            className={`flex items-center justify-between py-4 ${
              index !== appointments.length - 1 ? "border-b border-gray-100" : ""
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