"use client";

import { useState, useMemo, type FC } from "react";
import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMyAppointments } from "../../api/appointments";
import { useNavigate } from "react-router-dom";

type Appointment = { id: number; name: string; time: string };

const Section: FC = () => {
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const navigate = useNavigate();

  const { data: apiAppointments, isLoading } = useMyAppointments();

  const appointments = useMemo(() => {
    if (!apiAppointments || !Array.isArray(apiAppointments)) return [];
    
    // Format selected date for comparison (YYYY-MM-DD)
    const selectedDateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
    
    return apiAppointments
      .filter(app => {
        // Filter by selected date
        const appointmentDate = new Date(app.start_time);
        const appointmentDateStr = `${appointmentDate.getFullYear()}-${(appointmentDate.getMonth() + 1).toString().padStart(2, '0')}-${appointmentDate.getDate().toString().padStart(2, '0')}`;
        return appointmentDateStr === selectedDateStr;
      })
      .map(app => {
        const startDate = new Date(app.start_time);
        const endDate = new Date(app.end_time);
        const startTime = `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`;
        const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;

        return {
          id: app.id,
          name: app.patient_name || 'Пациент',
          time: `${startTime}-${endTime}`
        };
      });
  }, [apiAppointments, currentDate]);

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
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      ) : appointments.length > 0 ? (
        <div className="flex flex-col gap-0 mt-2">
          {appointments.map((apt, index) => (
            <div
              key={apt.id}
              onClick={() => navigate('/appointments')}
              className={`flex items-center justify-between py-4 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors ${
                index !== appointments.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center font-bold text-gray-600">
                  {apt.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">
                    {apt.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {apt.time}
                  </p>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/appointments');
                }}
                className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-400 font-medium">Нет записей</p>
          <p className="text-gray-300 text-sm mt-1">На выбранную дату записей нет</p>
        </div>
      )}
    </div>
  );
}

export default Section;