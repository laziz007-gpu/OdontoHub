import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import logo from "../assets/img/icons/Logo.svg"
import { paths } from '../Routes/path';

type Language = 'uz' | 'ru' | 'kz' | 'en';

const Welcome = () => {
  const { i18n, t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<Language | ''>('');

  const handleLanguageSelect = (lang: Language): void => {
  setSelectedLanguage(lang);

  // Используем lang напрямую
  i18n.changeLanguage(lang);
  localStorage.setItem('language', lang);
  
};


  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Фоновое изображение с blur эффектом */}
      <div 
        className="absolute inset-0 bg-cover bg-center scale-110"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1920&q=80')",
          filter: 'blur(3px)',
        }}
      />
      
      {/* Синий overlay */}
      <div className="absolute inset-0 bg-blue-600 opacity-80" />

      {/* Контент */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        
        {/* Иконка */}
        <div className="mb-8">
          <img src={logo} alt="" />
        </div>

        {/* Заголовок */}
        <div className="text-center mb-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-2">
            OdontoHub
          </h1>
          <p className="text-2xl text-white font-serif italic opacity-90">
            {t('dd')}
          </p>
        </div>

        {/* Карточка выбора языка */}
        <div className="mt-12 w-full max-w-md">
          <h2 className="text-white text-xl mb-6 text-center font-medium">
            {t('chooselang')}
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
          <Link
              to={selectedLanguage ? paths.role : '#'}
              onClick={(e) => {
              if (!selectedLanguage) e.preventDefault();
              }}
            className={`block text-center w-full py-4 px-6 rounded-full text-lg font-medium transition-all duration-200 ${
              selectedLanguage
                ? 'bg-white text-blue-600 hover:shadow-lg hover:scale-105'
                : 'bg-white/20 text-white/50 cursor-not-allowed backdrop-blur-sm'
            }`}
          >
            Далее
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;