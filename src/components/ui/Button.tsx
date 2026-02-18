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

    // btn-48 (lg): h-48 everywhere; desktop: Caption bold uppercase tracking
    // btn-40 (md): h-40 desktop, h-48 mobile; PT Sans Regular everywhere
    const sizes = {
      sm: 'h-12 sm:h-8 px-4',
      md: 'h-12 sm:h-10 px-6',
      lg: 'h-12 px-8 sm:font-bold sm:uppercase sm:tracking-[2px]',
    };

    // lg buttons get PT Sans Caption on desktop via CSS class
    const fontClass = size === 'lg' ? 'btn-lg-font' : '';

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fontClass} ${className}`}
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
