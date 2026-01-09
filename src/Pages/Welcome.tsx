import { useState } from 'react';
import logo from "../assets/img/icons/Logo.svg";
import welcomeImg from "../assets/img/photos/WelcomeImg.png"

const LanguageSelection = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const handleLanguageSelect = (lang: string) => {
    setSelectedLanguage(lang);
  };

  const handleContinue = () => {
    if (selectedLanguage) {
      alert(`Выбран язык: ${selectedLanguage}`);
      // Здесь будет переход на следующую страницу
      // navigate('/role-selection');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Фоновое изображение с blur эффектом */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${welcomeImg})`,
          filter: 'blur(3px)',
          transform: 'scale(1.1)'
        }}
      />
      
      {/* Синий overlay */}
      <div className="absolute inset-0 bg-blue-600 opacity-80" />

      {/* Контент */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        
        {/* Иконка */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <svg 
              className="w-12 h-12 text-blue-600" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              {logo}
            </svg>
          </div>
        </div>

        {/* Заголовок */}
        <div className="text-center mb-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-2">
            OdontoHub
          </h1>
          <p className="text-2xl text-white font-serif italic opacity-90">
            Цифровая стоматология
          </p>
        </div>

        {/* Карточка выбора языка */}
        <div className="mt-12 w-full max-w-md">
          <h2 className="text-white text-xl mb-6 text-center font-medium">
            Выберите язык интерфейса
          </h2>

          {/* Кнопки языков */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => handleLanguageSelect('uz')}
              className={`flex-1 py-4 px-6 rounded-full text-lg font-medium transition-all duration-200 ${
                selectedLanguage === 'uz'
                  ? 'bg-white text-blue-600 shadow-lg scale-105'
                  : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
              }`}
            >
              O'zbek
            </button>
            
            <button
              onClick={() => handleLanguageSelect('ru')}
              className={`flex-1 py-4 px-6 rounded-full text-lg font-medium transition-all duration-200 ${
                selectedLanguage === 'ru'
                  ? 'bg-white text-blue-600 shadow-lg scale-105'
                  : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
              }`}
            >
              Русский
            </button>
          </div>

          {/* Кнопка "Далее" */}
          <button
            onClick={handleContinue}
            disabled={!selectedLanguage}
            className={`w-full py-4 px-6 rounded-full text-lg font-medium transition-all duration-200 ${
              selectedLanguage
                ? 'bg-white text-blue-600 hover:shadow-lg hover:scale-105'
                : 'bg-white/20 text-white/50 cursor-not-allowed backdrop-blur-sm'
            }`}
          >
            Далее
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;
