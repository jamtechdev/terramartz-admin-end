import { InputHTMLAttributes, forwardRef } from 'react';

const Checkbox = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', type = 'checkbox', ...props }, ref) => {
    return (
      <input
        type={type}
        className={`h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };