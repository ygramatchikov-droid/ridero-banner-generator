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
            className="block text-sm font-bold text-[#46545B] mb-2 uppercase tracking-wide"
            style={{ fontFamily: "'PT Sans Caption', sans-serif", fontSize: '12px' }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 border-2 border-[#E8EBED] text-[#46545B] placeholder-[#8A9BA3] focus:outline-none focus:border-[#FF7E00] transition-colors ${error ? 'border-red-500' : ''} ${className}`}
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
