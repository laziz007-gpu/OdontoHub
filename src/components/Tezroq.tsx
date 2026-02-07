import React from 'react';

// Action turi
type Action = {
  title: string;
};

const actions: Action[] = [
  { title: "Добавить приём" },
  { title: "Новая заметка"},
  { title: "Написать пациенту" },
  { title: "Добавить пациент" }
];

const Tezroq: React.FC = () => {
  return (
    <div>
      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-bold mb-6">Быстрые действия</h2>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <button
              key={index}
              className="bg-gray-50 hover:bg-gray-100 rounded-2xl p-6 text-center transition-colors"
            >
              <p className="font-semibold text-gray-900">{action.title}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Tezroq;