// GoSmile Color Palette
export const colors = {
  // Основная палитра GoSmile
  primary: {
    50: '#F0F4FF',
    100: '#E8F0FF', 
    200: '#D1E1FF',
    300: '#A8C7FF',
    400: '#7BA3FF',
    500: '#4F7EFF', // Основной цвет из логотипа
    600: '#3B5FCC',
    700: '#2D4799',
    800: '#1F3166',
    900: '#111B33',
  },
  
  // Дополнительные цвета
  secondary: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
  
  // Статусные цвета
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
  },
  
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
  },
  
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
  },
  
  // Нейтральные цвета
  white: '#FFFFFF',
  black: '#000000',
  
  // Градиенты
  gradients: {
    primary: 'linear-gradient(135deg, #4F7EFF 0%, #3B5FCC 100%)',
    light: 'linear-gradient(135deg, #F0F4FF 0%, #E8F0FF 100%)',
    dark: 'linear-gradient(135deg, #2D4799 0%, #1F3166 100%)',
  }
};

// Утилиты для работы с цветами
export const getColor = (colorPath: string): string => {
  const keys = colorPath.split('.');
  let result: any = colors;
  
  for (const key of keys) {
    result = result[key];
    if (!result) return '#4F7EFF'; // fallback to primary
  }
  
  return result;
};

// Экспорт основных цветов для быстрого доступа
export const primaryColor = colors.primary[500];
export const primaryHover = colors.primary[600];
export const primaryLight = colors.primary[100];
export const secondaryColor = colors.secondary[500];
export const successColor = colors.success[500];
export const warningColor = colors.warning[500];
export const errorColor = colors.error[500];