import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  size?: 'default' | 'icon' | 'sm' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 active:scale-95 cursor-pointer shadow-md",
          // Black border is applied to all variants
          "border-2 border-black",
          variant === 'outline'
            ? "bg-transparent text-white hover:bg-white/10"
            : "bg-[#C5A059] text-black hover:bg-[#C5A059]/90",
          size === 'icon' ? "h-10 w-10 p-0" : "",
          size === 'default' ? "px-6 py-2.5" : "",
          size === 'sm' ? "px-4 py-2 text-xs" : "",
          size === 'lg' ? "px-8 py-3 text-base" : "",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
