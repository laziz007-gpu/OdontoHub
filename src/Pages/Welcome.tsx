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
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-around px-4 py-8">

        {/* 1. Логотип */}
        <div className="flex flex-col items-center">
          <img src={logo} alt="" className="w-20 h-20" />
        </div>

        {/* 2. Название и Слоган */}
        <div className="text-center">
          <h1 className="text-7xl md:text-9xl font-bold text-white tracking-tight">
            OdontoHub
          </h1>
          <p className="text-4xl md:text-6xl text-white -mt-2 opacity-95" style={{ fontFamily: "'Great Vibes', cursive" }}>
            {t('dd')}
          </p>
        </div>

        {/* 3. Настройки интерфейса (Язык + Далее) */}
        <div className="w-full max-w-sm">
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10">
            <h2 className="text-white text-lg mb-4 text-center font-medium opacity-90">
              {t('chooselang')}
            </h2>

            {/* Кнопки языков */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => handleLanguageSelect('uz')}
                className={`py-3 px-2 rounded-2xl text-base font-medium transition-all duration-200 border-2 ${selectedLanguage === 'uz'
                  ? 'bg-white/30 border-white text-white shadow-lg'
                  : 'bg-white/10 border-transparent text-white/80 hover:bg-white/20'
                  }`}
              >
                O'zbek
              </button>

              <button
                onClick={() => handleLanguageSelect('ru')}
                className={`py-3 px-2 rounded-2xl text-base font-medium transition-all duration-200 border-2 ${selectedLanguage === 'ru'
                  ? 'bg-white/30 border-white text-white shadow-lg'
                  : 'bg-white/10 border-transparent text-white/80 hover:bg-white/20'
                  }`}
              >
                Русский
              </button>

              <button
                onClick={() => handleLanguageSelect('en')}
                className={`py-3 px-2 rounded-2xl text-base font-medium transition-all duration-200 border-2 ${selectedLanguage === 'en'
                  ? 'bg-white/30 border-white text-white shadow-lg'
                  : 'bg-white/10 border-transparent text-white/80 hover:bg-white/20'
                  }`}
              >
                English
              </button>

              <button
                onClick={() => handleLanguageSelect('kz')}
                className={`py-3 px-2 rounded-2xl text-base font-medium transition-all duration-200 border-2 ${selectedLanguage === 'kz'
                  ? 'bg-white/30 border-white text-white shadow-lg'
                  : 'bg-white/10 border-transparent text-white/80 hover:bg-white/20'
                  }`}
              >
                Қазақша
              </button>
            </div>

            {/* Кнопка "Далее" - появляется только после выбора языка */}
            {selectedLanguage && (
              <Link
                to={paths.role}
                className="block text-center w-full py-4 px-6 rounded-2xl text-xl font-bold transition-all duration-300 bg-white text-blue-600 shadow-xl hover:scale-[1.02] active:scale-95 animate-in fade-in slide-in-from-bottom-2"
              >
                {t('next')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;