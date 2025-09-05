import React, { useState, useRef, useEffect } from 'react';
import type { BaseComponentProps } from '../../lib/types';

interface SelectProps extends BaseComponentProps {
  value?: string;
  onValueChange?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}

interface SelectTriggerProps extends BaseComponentProps {
  children: React.ReactNode;
}

interface SelectContentProps extends BaseComponentProps {
  children: React.ReactNode;
}

interface SelectItemProps extends BaseComponentProps {
  value: string;
  children: React.ReactNode;
}

interface SelectValueProps extends BaseComponentProps {
  placeholder?: string;
}

// Context for Select state
const SelectContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}>({
  isOpen: false,
  setIsOpen: () => {},
});

export const Select: React.FC<SelectProps> = ({
  children,
  value,
  onValueChange,
  onOpenChange,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };

  return (
    <SelectContext.Provider value={{ value, onValueChange, isOpen, setIsOpen: handleOpenChange }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger: React.FC<SelectTriggerProps> = ({
  children,
  className = ''
}) => {
  const { isOpen, setIsOpen } = React.useContext(SelectContext);

  return (
    <button
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      className={`
        select-trigger w-full px-2.5 py-2.5 text-left text-base
        border-2 border-gray-200 rounded-lg
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        bg-white hover:bg-gray-50
        flex items-center justify-between
        transition-all duration-200
        ${className}
      `}
    >
      {children}
      <svg
        className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
};

export const SelectContent: React.FC<SelectContentProps> = ({ 
  children, 
  className = '' 
}) => {
  const { isOpen, setIsOpen } = React.useContext(SelectContext);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={contentRef}
      className={`
        select-content absolute top-full left-0 right-0 z-50 mt-1
        bg-white border-2 border-gray-200 rounded-lg shadow-lg
        max-h-60 overflow-auto w-full
        ${className}
      `}
      style={{ width: '100%', minWidth: '100%' }}
    >
      {children}
    </div>
  );
};

export const SelectItem: React.FC<SelectItemProps> = ({ 
  value, 
  children, 
  className = '' 
}) => {
  const { onValueChange, setIsOpen } = React.useContext(SelectContext);

  const handleClick = () => {
    onValueChange?.(value);
    setIsOpen(false);
  };

  return (
    <div
      onClick={handleClick}
      className={`
        px-2.5 py-2.5 text-base cursor-pointer
        hover:font-bold focus:font-bold
        transition-all duration-200 text-center
        flex items-center justify-center w-full
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export const SelectValue: React.FC<SelectValueProps> = ({ 
  placeholder = 'Select...' 
}) => {
  const { value } = React.useContext(SelectContext);

  return (
    <span className={value ? 'text-gray-900' : 'text-gray-500'}>
      {value || placeholder}
    </span>
  );
};
