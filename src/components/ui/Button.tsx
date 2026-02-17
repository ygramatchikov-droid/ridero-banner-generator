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
      font-normal
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:cursor-not-allowed disabled:!bg-[#FFD8B3] disabled:!border-[#FFD8B3] disabled:!text-white
      active:opacity-90
    `.replace(/\s+/g, ' ').trim();

    // Ridero design system: 1px border, 2px letter-spacing, orange primary, hover inversion
    const variants = {
      primary: `
        bg-[#FF7E00] text-white border border-[#FF7E00]
        hover:bg-white hover:text-[#FF7E00]
        focus:ring-[#FF7E00]
      `.replace(/\s+/g, ' ').trim(),
      secondary: `
        bg-[#80B027] text-white border border-[#80B027]
        hover:bg-white hover:text-[#80B027]
        focus:ring-[#80B027]
      `.replace(/\s+/g, ' ').trim(),
      outline: `
        bg-white text-[#FF7E00] border border-[#FF7E00]
        hover:bg-[#FF7E00] hover:text-white
        focus:ring-[#FF7E00]
      `.replace(/\s+/g, ' ').trim(),
    };

    // All buttons 48px on mobile; on desktop: sm=32, md=40, lg=48
    const sizes = {
      sm: 'h-12 sm:h-8 px-4 rounded-sm',
      md: 'h-12 sm:h-10 px-6 rounded-sm',
      lg: 'h-12 px-8 rounded-sm',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        style={{
          fontFamily: "'PT Sans', 'Helvetica Neue', sans-serif",
          fontSize: '18px',
          lineHeight: '24px',
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
