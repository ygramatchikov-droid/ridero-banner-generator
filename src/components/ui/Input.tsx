'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            className="block text-[#46545B] mb-2"
            style={{ fontFamily: "'PT Sans', sans-serif", fontSize: '18px', lineHeight: '24px' }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 border border-[#C1C3C4] text-[#46545B] placeholder-[#8A9BA3] hover:border-[#7F939C] focus:outline-none focus:border-[#ff7e00] transition-colors ${error ? 'border-red-500' : ''} ${className}`}
          style={{
            fontFamily: "'PT Sans', sans-serif",
            borderRadius: '2px',
            fontSize: '16px',
          }}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
