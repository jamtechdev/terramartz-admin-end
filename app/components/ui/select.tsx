import React, { forwardRef, useState, SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
}

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  value?: string;
}

interface SelectValueProps {
  placeholder?: string;
  value?: string;
}

interface SelectContentProps {
  children: React.ReactNode;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  onValueChange?: (value: string) => void;
}

interface SelectItemProps {
  children: React.ReactNode;
  value: string;
  onClick?: (value: string) => void;
  onValueChange?: (value: string) => void;
  setIsOpen?: (open: boolean) => void;
  className?: string;
}

const Select = ({ children, value, onValueChange, onChange, ...props }: SelectProps & React.HTMLAttributes<HTMLDivElement>) => {
  const [isOpen, setIsOpen] = useState(false);

  const childrenArray = React.Children.toArray(children);
  
  const hasSpecialComponents = childrenArray.some((child: any) => {
    if (!React.isValidElement(child)) return false;
    const childType = child.type;
    return childType === SelectTrigger || 
           (typeof childType === 'function' && childType.name === 'SelectTrigger');
  });

  if (hasSpecialComponents) {
    return (
      <div {...props}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as any, {
              value,
              isOpen,
              setIsOpen,
              onValueChange,
            });
          }
          return child;
        })}
      </div>
    );
  }

  return (
    <select
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      value={value}
      onChange={onChange}
      {...props as any}
    >
      {children}
    </select>
  );
};

const SelectTrigger = forwardRef<HTMLDivElement, SelectTriggerProps>(
  ({ children, className = '', isOpen, setIsOpen, ...props }, ref) => (
    <div
      ref={ref}
      onClick={() => setIsOpen?.(!isOpen)}
      className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);
SelectTrigger.displayName = 'SelectTrigger';

const SelectValue = ({ placeholder, value }: SelectValueProps) => (
  <span>{value || placeholder}</span>
);

const SelectContent = ({ children, isOpen }: SelectContentProps) => {
  if (!isOpen) return null;

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 text-gray-900 shadow-md mt-1">
        {React.Children.map(children, (child) => {
          return child;
        })}
      </div>
    </div>
  );
};

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ children, value, onClick, onValueChange, setIsOpen, className = '', ...props }, ref) => (
    <div
      ref={ref}
      onClick={() => {
        onValueChange?.(value);
        setIsOpen?.(false);
        onClick?.(value);
      }}
      className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);
SelectItem.displayName = 'SelectItem';

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };