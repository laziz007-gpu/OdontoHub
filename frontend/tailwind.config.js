/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Новые цвета GoSmile
      colors: {
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
          500: '#22C55E',
          600: '#16A34A',
        },
        warning: {
          50: '#FFFBEB',
          500: '#F59E0B',
          600: '#D97706',
        },
        error: {
          50: '#FEF2F2',
          500: '#EF4444',
          600: '#DC2626',
        },
      },
      
      // Новые шрифты
      fontFamily: {
        'railway': ['Railway', 'sans-serif'],
        'space': ['Space Grotesk', 'sans-serif'],
        'sans': ['Railway', 'system-ui', 'sans-serif'],
        'heading': ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      
      // Дополнительные стили
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(79, 126, 255, 0.1), 0 4px 6px -2px rgba(79, 126, 255, 0.05)',
        'medium': '0 4px 25px -5px rgba(79, 126, 255, 0.15), 0 10px 10px -5px rgba(79, 126, 255, 0.1)',
        'strong': '0 10px 40px -10px rgba(79, 126, 255, 0.25)',
      },
      
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-soft': 'bounceSoft 0.6s ease-in-out',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSoft: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
          '40%, 43%': { transform: 'translate3d(0,-8px,0)' },
          '70%': { transform: 'translate3d(0,-4px,0)' },
          '90%': { transform: 'translate3d(0,-2px,0)' },
        },
      },
    },
  },
  plugins: [],
}