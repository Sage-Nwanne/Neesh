import React from 'react';
import type { BaseComponentProps } from '@/lib/types';

interface InputProps extends BaseComponentProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  className = '',
  type = 'text',
  error = false,
  ...props
}, ref) => {
  const baseClasses = 'flex h-12 w-full rounded-lg border-2 border-gray-200 bg-white px-2.5 py-2.5 text-base ring-offset-white file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200';
  
  const errorClasses = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '';
  
  return (
    <input
      type={type}
      className={`${baseClasses} ${errorClasses} ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';
