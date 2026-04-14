/**
 * Утилиты для работы с логотипом GoSmile
 */

/**
 * Определяет, нужно ли использовать белый цвет логотипа на основе фона
 * @param backgroundColor - цвет фона (hex, rgb, или CSS класс)
 * @returns true если нужен белый логотип
 */
export const shouldUseWhiteLogo = (backgroundColor?: string): boolean => {
  if (!backgroundColor) return false;
  
  // Проверяем CSS классы
  const blueBackgroundClasses = [
    'bg-primary',
    'bg-blue',
    'gradient-primary',
    'bg-gradient',
    'from-blue',
    'to-blue',
    'from-primary',
    'to-primary'
  ];
  
  const hasBlueBackground = blueBackgroundClasses.some(cls => 
    backgroundColor.includes(cls)
  );
  
  if (hasBlueBackground) return true;
  
  // Проверяем hex цвета
  if (backgroundColor.startsWith('#')) {
    const brightness = getColorBrightness(backgroundColor);
    return brightness < 128; // Темный фон = белый логотип
  }
  
  // Проверяем rgb цвета
  if (backgroundColor.startsWith('rgb')) {
    const brightness = getRgbBrightness(backgroundColor);
    return brightness < 128;
  }
  
  return false;
};

/**
 * Вычисляет яркость hex цвета
 */
const getColorBrightness = (hex: string): number => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  return (r * 299 + g * 587 + b * 114) / 1000;
};

/**
 * Вычисляет яркость rgb цвета
 */
const getRgbBrightness = (rgb: string): number => {
  const matches = rgb.match(/\d+/g);
  if (!matches || matches.length < 3) return 255;
  
  const r = parseInt(matches[0]);
  const g = parseInt(matches[1]);
  const b = parseInt(matches[2]);
  
  return (r * 299 + g * 587 + b * 114) / 1000;
};

/**
 * Получает правильный цвет логотипа для контекста
 */
export const getLogoColor = (context?: 'light' | 'dark' | 'auto', backgroundColor?: string): string => {
  if (context === 'light') return '#FFFFFF';
  if (context === 'dark') return '#4F7EFF';
  
  // Автоматическое определение
  if (context === 'auto' && backgroundColor) {
    return shouldUseWhiteLogo(backgroundColor) ? '#FFFFFF' : '#4F7EFF';
  }
  
  return '#4F7EFF'; // По умолчанию синий
};

/**
 * Типы для пропсов логотипа
 */
export interface LogoColorProps {
  context?: 'light' | 'dark' | 'auto';
  backgroundColor?: string;
  className?: string;
}

/**
 * Хук для автоматического определения цвета логотипа
 */
export const useLogoColor = (props: LogoColorProps) => {
  const { context = 'auto', backgroundColor, className = '' } = props;
  
  // Проверяем className на наличие синих фонов
  const backgroundFromClass = className || backgroundColor;
  
  const shouldBeWhite = context === 'light' || 
    (context === 'auto' && shouldUseWhiteLogo(backgroundFromClass));
  
  return {
    color: shouldBeWhite ? '#FFFFFF' : '#4F7EFF',
    isWhite: shouldBeWhite,
    isDark: !shouldBeWhite
  };
};