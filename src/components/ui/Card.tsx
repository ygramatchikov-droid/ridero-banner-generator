'use client';

import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  clickable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', selected, clickable, children, ...props }, ref) => {
    const baseStyles = 'bg-white border-2 transition-all duration-200';
    const clickableStyles = clickable ? 'cursor-pointer hover:shadow-lg' : '';
    const selectedStyles = selected
      ? 'border-[#FF7E00] ring-2 ring-[#FFD8B3]'
      : 'border-[#E8EBED]';

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${clickableStyles} ${selectedStyles} ${className}`}
        style={{
          padding: '32px 40px',
          borderRadius: '4px',
          boxShadow: '0px 4px 16px rgba(70, 84, 91, 0.15)',
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
