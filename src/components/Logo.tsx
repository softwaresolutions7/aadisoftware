import React from 'react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', iconOnly = false, size = 'md' }) => {
  const iconSize = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10';
  const textScale = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';
  const subScale = size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-[11px]' : 'text-[10px]';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Modern Geometric A Symbol */}
      <div className={`relative ${iconSize} shrink-0 rounded-xl bg-gradient-to-br from-[#161D2F] via-[#0B0F19] to-[#080B12] p-0.5 border border-[#D4AF37]/40 shadow-lg shadow-black/40`}>
        <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow">
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F6EFD3" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#A8811F" />
            </linearGradient>
            <linearGradient id="blueGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
          </defs>
          {/* Geometric A outer legs */}
          <path
            d="M22 6L35 34H27.5L22 22.5L16.5 34H9L22 6Z"
            fill="url(#goldGradient)"
          />
          {/* Inner negative space triangle */}
          <polygon points="22,14 25.5,22 18.5,22" fill="#0B0F19" />
          {/* Modern tech bridge accent */}
          <rect x="15" y="25" width="14" height="2.5" rx="1" fill="url(#blueGlow)" />
        </svg>
      </div>

      {!iconOnly && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`${textScale} font-extrabold tracking-tight text-white font-sans`}>
              AADI
            </span>
            <span className="text-xs px-1.5 py-0.5 rounded text-[#D4AF37] font-semibold bg-[#D4AF37]/10 border border-[#D4AF37]/30 tracking-wider">
              SOLUTIONS
            </span>
          </div>
          <span className={`${subScale} text-slate-400 font-medium tracking-wider uppercase mt-1`}>
            Software Solutions
          </span>
        </div>
      )}
    </div>
  );
};
