'use client';

import { useTranslations } from 'next-intl';
import { toast } from '@/components/Shared/Toast';

type Action = {
  titleKey: string;
  action: 'appointment' | 'patient' | 'note' | 'message';
};

const Tezroq: React.FC = () => {
  const t = useTranslations();

  const actions: Action[] = [
    { titleKey: 'dashboard.quick_actions.add_appointment', action: 'appointment' },
    { titleKey: 'dashboard.quick_actions.new_note', action: 'note' },
    { titleKey: 'dashboard.quick_actions.message_patient', action: 'message' },
    { titleKey: 'dashboard.quick_actions.add_patient', action: 'patient' },
  ];

  const handleActionClick = (action: Action) => {
    if (action.action === 'message') {
      toast.info(t('patient.alerts.function_in_development'));
    } else {
      toast.info(t('patient.alerts.function_in_development'));
    }
  };

  return (
    <div>
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">{t('dashboard.quick_actions.title')}</h2>
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleActionClick(action)}
              className="bg-gray-50 hover:bg-gray-100 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-center transition-colors relative"
            >
              <p className="font-semibold text-gray-900 text-xs sm:text-base">{t(action.titleKey)}</p>
              {action.action === 'message' && (
                <span className="absolute top-1 right-1 sm:top-2 sm:right-2 text-[10px] sm:text-xs bg-yellow-100 text-yellow-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium">
                  В разработке
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tezroq;
