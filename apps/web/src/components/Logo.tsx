import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  darkText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '', darkText = true }) => {
  const iconSizes = { sm: 'w-6 h-6', md: 'w-7 h-7', lg: 'w-9 h-9' };
  const textSizes = { sm: 'text-sm', md: 'text-lg', lg: 'text-xl' };
  const textColor = darkText ? 'text-[#0F0F0F]' : 'text-[#FFFDF2]';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]}`}>
        <svg viewBox="0 0 32 32" fill="none" className="w-full h-full" strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M8 16C8 11.5817 11.5817 8 16 8C20.4183 8 24 11.5817 24 16C24 20.4183 20.4183 24 16 24C10 24 6 20 6 16C6 10 10 4 16 4C22.6274 4 28 9.37258 28 16"
            stroke="url(#fl-grad)"
            strokeWidth="3"
          />
          <circle cx="28" cy="16" r="2.5" fill="#F59E0B" />
          <defs>
            <linearGradient id="fl-grad" x1="4" y1="4" x2="28" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F59E0B" />
              <stop offset="0.6" stopColor="#D97706" />
              <stop offset="1" stopColor="#92400E" stopOpacity="0.6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {showText && (
        <span className={`font-extrabold tracking-tight ${textColor} ${textSizes[size]}`}>
          Fieldloop
        </span>
      )}
    </div>
  );
};
