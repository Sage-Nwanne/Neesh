import React from 'react';
import type { BaseComponentProps } from '../../lib/types';

interface TextareaProps extends BaseComponentProps {
  id?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  required?: boolean;
  name?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({
  className = '',
  id,
  value,
  onChange,
  placeholder,
  rows = 3,
  disabled = false,
  required = false,
  name,
  ...props
}, ref) => {
  return (
    <textarea
      ref={ref}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      required={required}
      className={`
        w-full px-2.5 py-2.5 text-base
        border-2 border-gray-200 rounded-lg
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        disabled:bg-gray-100 disabled:cursor-not-allowed
        resize-vertical
        transition-all duration-200
        ${className}
      `}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';
