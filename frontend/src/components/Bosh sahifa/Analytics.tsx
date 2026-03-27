import { HiArrowUp, HiArrowDown } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { useMyAppointments } from "../../api/appointments";
import { useAllPatients } from "../../api/profile";
import { useMemo } from "react";

type Stat = {
  value: number;
  titleKey: string;
  change: number;
};

export default function Analytics() {
  const { t } = useTranslation();
  const { data: appointments } = useMyAppointments();
  const { data: patients } = useAllPatients();

  const stats: Stat[] = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    // Appointments today
    const todayAppointments = appointments?.filter((app: any) => {
      const appDate = new Date(app.start_time);
      return appDate >= today && appDate <= todayEnd;
    }).length || 0;

    // Appointments this month
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthAppointments = appointments?.filter((app: any) => {
      const appDate = new Date(app.start_time);
      return appDate >= firstDayOfMonth;
    }).length || 0;

    // New patients this week - просто показываем общее количество пациентов
    const weekPatients = patients?.length || 0;

    return [
      { value: todayAppointments, titleKey: "dashboard.stats.consultations_today", change: 0 },
      { value: monthAppointments, titleKey: "dashboard.stats.appointments_month", change: 0 },
      { value: weekPatients, titleKey: "dashboard.stats.new_patients_week", change: 0 },
    ];
  }, [appointments, patients]);

  return (
    <div className="flex flex-col md:flex-row gap-6 mb-8">
      {stats.map((item) => {
        const isPositive = item.change > 0;
        const isNegative = item.change < 0;
        const hasChange = item.change !== 0;

        const changeColor = isPositive
          ? "text-green-500"
          : isNegative
            ? "text-red-500"
            : "text-gray-400";

        return (
          <div
            key={item.titleKey}
            className="bg-white rounded-2xl px-6 py-5 flex-1 shadow-md"
          >
            {/* Yuqori qator */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-5xl font-bold text-gray-900">
                {item.value}
              </h2>

              {hasChange && (
                <div className={`flex items-center gap-1 ${changeColor}`}>
                  <span className="text-lg font-bold">
                    {isPositive ? `+${item.change}` : item.change}
                  </span>
                  {isPositive && <HiArrowUp className="w-5 h-5" />}
                  {isNegative && <HiArrowDown className="w-5 h-5" />}
                </div>
              )}
            </div>

            {/* Pastki qator */}
            <p className="text-gray-600 text-sm font-medium">
              {t(item.titleKey)}
            </p>
          </div>
        );
      })}
    </div>
  );
}
