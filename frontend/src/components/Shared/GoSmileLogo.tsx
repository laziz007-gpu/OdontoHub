import React from 'react';

interface GoSmileLogoProps {
  variant?: 'full' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  white?: boolean;
  auto?: boolean;
}

const GoSmileLogo: React.FC<GoSmileLogoProps> = ({ 
  variant = 'full', 
  size = 'md', 
  className = '',
  white = false,
  auto = false
}) => {
  // Автоматическое определение цвета по классам в className или родительском элементе
  const shouldUseWhite = white || (auto && (
    className.includes('bg-primary') || 
    className.includes('bg-blue') || 
    className.includes('gradient-primary') ||
    className.includes('bg-gradient')
  ));

  const color = shouldUseWhite ? '#FFFFFF' : '#4F7EFF';
  
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12', 
    lg: 'h-16',
    xl: 'h-20',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl', 
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  // Ваш оригинальный дизайн логотипа
  return (
    <div className={`flex items-center gap-3 ${className}`} style={{ height: sizeClasses[size].replace('h-', '') + 'rem' }}>
      {/* Чашка с ручкой - точно как в вашем дизайне */}
      <div className="relative flex items-center">
        {/* Звездочка сверху */}
        <div 
          className="absolute -top-1 left-1/2 transform -translate-x-1/2"
          style={{ 
            width: '8px', 
            height: '8px',
            background: color,
            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
          }}
        />
        
        {/* Основная чашка */}
        <div 
          className="relative"
          style={{
            width: size === 'sm' ? '24px' : size === 'md' ? '32px' : size === 'lg' ? '40px' : '48px',
            height: size === 'sm' ? '20px' : size === 'md' ? '26px' : size === 'lg' ? '32px' : '38px',
            backgroundColor: 'transparent',
            border: `${size === 'sm' ? '2px' : '3px'} solid ${color}`,
            borderRadius: '0 0 50% 50%',
            borderTop: 'none'
          }}
        >
          {/* Ручка чашки */}
          <div 
            className="absolute -right-2 top-1"
            style={{
              width: size === 'sm' ? '8px' : size === 'md' ? '10px' : size === 'lg' ? '12px' : '14px',
              height: size === 'sm' ? '12px' : size === 'md' ? '16px' : size === 'lg' ? '20px' : '24px',
              border: `${size === 'sm' ? '2px' : '3px'} solid ${color}`,
              borderLeft: 'none',
              borderRadius: '0 50% 50% 0'
            }}
          />
        </div>
      </div>
      
      {/* Текст GoSmile */}
      <span 
        className={`font-heading font-bold ${textSizes[size]}`}
        style={{ color }}
      >
        GoSmile
      </span>
      
      {/* Звездочка в конце */}
      <div 
        style={{ 
          width: size === 'sm' ? '6px' : size === 'md' ? '8px' : size === 'lg' ? '10px' : '12px',
          height: size === 'sm' ? '6px' : size === 'md' ? '8px' : size === 'lg' ? '10px' : '12px',
          background: color,
          clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
        }}
      />
    </div>
  );
};

export default GoSmileLogo;