import React from 'react';
import type { BaseComponentProps } from '../../lib/types';

interface CheckboxProps extends BaseComponentProps {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({
  className = '',
  id,
  checked = false,
  onCheckedChange,
  disabled = false,
  name,
  ...props
}, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCheckedChange?.(e.target.checked);
  };

  return (
    <div className="relative inline-flex items-center">
      <input
        ref={ref}
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className={`
          w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded
          focus:ring-blue-500 focus:ring-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      />
      {checked && (
        <svg
          className="absolute w-3 h-3 text-white pointer-events-none"
          style={{ left: '2px', top: '2px' }}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';
