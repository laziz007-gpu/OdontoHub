import React from 'react';
import logoAniq from '../../assets/img/icons/LOGOANIQ.png';

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
  auto = false,
}) => {
  const sizeMap = {
    sm: { fullWidth: 220, fullHeight: 68, iconWidth: 68, iconHeight: 56 },
    md: { fullWidth: 260, fullHeight: 80, iconWidth: 80, iconHeight: 68 },
    lg: { fullWidth: 340, fullHeight: 104, iconWidth: 104, iconHeight: 88 },
    xl: { fullWidth: 520, fullHeight: 160, iconWidth: 160, iconHeight: 136 },
  };

  const current = sizeMap[size];
  const imageHeight = variant === 'icon' ? current.iconHeight : current.fullHeight;
  const imageWidth = variant === 'icon' ? current.iconWidth : current.fullWidth;
  const invertOnDark = white || (auto && (
    className.includes('bg-primary') ||
    className.includes('bg-blue') ||
    className.includes('gradient-primary') ||
    className.includes('bg-gradient')
  ));

  return (
    <img
      src={logoAniq}
      alt="GoSmile"
      className={`block max-w-full object-contain ${invertOnDark ? 'brightness-0 invert' : ''} ${className}`}
      style={{ width: `${imageWidth}px`, height: `${imageHeight}px` }}
    />
  );
};

export default GoSmileLogo;
