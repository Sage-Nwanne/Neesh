import React from 'react';
import type { BaseComponentProps } from '@/lib/types';

interface LabelProps extends BaseComponentProps {
  htmlFor?: string;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({
  className = '',
  ...props
}, ref) => (
  <label
    ref={ref}
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    {...props}
  />
));
Label.displayName = 'Label';
