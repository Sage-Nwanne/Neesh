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
  const baseClasses = 'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
  
  const errorClasses = error ? 'border-red-500 focus:ring-red-400' : '';
  
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
