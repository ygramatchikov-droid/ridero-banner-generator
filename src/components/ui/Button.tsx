'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, disabled, ...props }, ref) => {
    const baseStyles = `
      inline-flex items-center justify-center
      font-bold uppercase tracking-wide
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
    `.replace(/\s+/g, ' ').trim();

    // Ridero design system: 2px border-radius, orange primary, hover inversion
    const variants = {
      primary: `
        bg-[#FF7E00] text-white border-2 border-[#FF7E00]
        hover:bg-white hover:text-[#FF7E00]
        focus:ring-[#FF7E00]
      `.replace(/\s+/g, ' ').trim(),
      secondary: `
        bg-[#80B027] text-white border-2 border-[#80B027]
        hover:bg-white hover:text-[#80B027]
        focus:ring-[#80B027]
      `.replace(/\s+/g, ' ').trim(),
      outline: `
        bg-white text-[#FF7E00] border-2 border-[#FF7E00]
        hover:bg-[#FF7E00] hover:text-white
        focus:ring-[#FF7E00]
      `.replace(/\s+/g, ' ').trim(),
    };

    // Ridero sizes: lg=48px, md=40px, sm=32px height
    const sizes = {
      sm: 'h-8 px-4 text-xs rounded-sm',      // 32px height
      md: 'h-10 px-6 text-sm rounded-sm',     // 40px height
      lg: 'h-12 px-8 text-base rounded-sm',   // 48px height
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        style={{
          fontFamily: "'PT Sans Caption', sans-serif",
          borderRadius: '2px',
        }}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
