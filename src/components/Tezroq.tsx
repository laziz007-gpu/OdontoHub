import { useTranslation } from 'react-i18next';

// Action turi
type Action = {
  titleKey: string;
};

const Tezroq: React.FC = () => {
  const { t } = useTranslation();

  const actions: Action[] = [
    { titleKey: "dashboard.quick_actions.add_appointment" },
    { titleKey: "dashboard.quick_actions.new_note" },
    { titleKey: "dashboard.quick_actions.message_patient" },
    { titleKey: "dashboard.quick_actions.add_patient" }
  ];

  return (
    <div>
      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-bold mb-6">{t('dashboard.quick_actions.title')}</h2>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <button
              key={index}
              className="bg-gray-50 hover:bg-gray-100 rounded-2xl p-6 text-center transition-colors"
            >
              <p className="font-semibold text-gray-900">{t(action.titleKey)}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Tezroq;