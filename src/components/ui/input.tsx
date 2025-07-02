import * as React from 'react';
import { cn, numericFieldValue } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  scale?: 'xs' | 'sm';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, scale = 'sm', icon, type, value, onFocus, ...props }, ref) => {
    return (
      <div className='relative'>
        {icon}
        <input
          type={type}
          className={cn(
            'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            icon && 'pl-10',
            scale === 'xs' && 'h-min text-xs',
            className
          )}
          ref={ref}
          value={
            type === 'number' && typeof value === 'number'
              ? numericFieldValue(value)
              : value
          }
          onFocus={(e) => {
            type === 'number' && e.target.select();
            onFocus && onFocus(e);
          }}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
