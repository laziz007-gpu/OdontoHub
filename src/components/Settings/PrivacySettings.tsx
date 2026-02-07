import React from 'react';

export const PrivacySettings: React.FC = () => {
    return (
        <div className="space-y-4">
            <button className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-2xl text-sm mb-6 transition-colors">
                Сменить пароль
            </button>

            <div className="bg-[#94A4FF] p-5 rounded-2xl cursor-pointer hover:opacity-90 transition-opacity">
                <h3 className="text-lg font-bold text-white mb-1">Активные сеансы</h3>
                <p className="text-sm text-white/90">Нажмите чтобы посмотреть устройства где подключён ваш аккаунт</p>
            </div>

            <div className="bg-white p-5 rounded-2xl cursor-pointer hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-[#1E2532] mb-1">Добавить устройство</h3>
                <p className="text-sm text-gray-400">Наведите камеру вашего смартфона чтобы подключить аккаунт</p>
            </div>

            <div className="bg-white p-5 rounded-2xl cursor-pointer hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-[#1E2532] mb-1">Резервный номер</h3>
                <p className="text-sm text-gray-400">Используется только для безопасности</p>
            </div>

            <div className="bg-white p-5 rounded-2xl cursor-pointer hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-red-500 underline mb-1">Удалить аккаунт</h3>
                <p className="text-sm text-gray-400">Полностью удаляются все данные этого аккаунта</p>
            </div>

            <div className="pt-20">
                <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-12 rounded-2xl text-sm transition-colors">
                    Выйти
                </button>
            </div>
        </div>
    );
};
