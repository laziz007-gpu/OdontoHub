import { HiArrowUp, HiArrowDown } from "react-icons/hi";
import { useTranslation } from "react-i18next";

type Stat = {
  value: number;
  titleKey: string;
  change: number;
};

export default function Consultatsiya() {
  const { t } = useTranslation();

  // Stats will be loaded from API in future - currently hidden
  const stats: Stat[] = [];

  return (
    <div className="flex flex-col md:flex-row gap-6 mb-8" style={{ display: 'none' }}>
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
