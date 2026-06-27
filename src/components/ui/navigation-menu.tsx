import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export function NavigationMenu({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <nav className={cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className)}>
      {children}
    </nav>
  );
}

export function NavigationMenuList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <ul className={cn("group flex flex-1 list-none items-center justify-center space-x-1", className)}>
      {children}
    </ul>
  );
}

export function NavigationMenuItem({ children, className }: { children: React.ReactNode; className?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li
      className={cn("relative", className)}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if ((child.type as any).displayName === 'NavigationMenuTrigger') {
            return React.cloneElement(child as any, { isOpen, setIsOpen });
          }
          if ((child.type as any).displayName === 'NavigationMenuContent') {
            return React.cloneElement(child as any, { isOpen });
          }
        }
        return child;
      })}
    </li>
  );
}

export const NavigationMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { isOpen?: boolean; setIsOpen?: (open: boolean) => void }
>(({ className, children, isOpen, setIsOpen, ...props }, ref) => {
  return (
    <button
      ref={ref}
      onClick={() => setIsOpen?.(!isOpen)}
      className={cn(
        "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-colors hover:text-[#9E2A2B] text-[#F5F2EB] gap-1.5",
        className
      )}
      {...props}
    >
      <span>{children}</span>
      <ChevronDown
        className="h-4 w-4 shrink-0 transition-transform duration-300 text-[#C5A059] group-hover:text-[#9E2A2B]"
        style={{
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
      />
    </button>
  );
});
NavigationMenuTrigger.displayName = 'NavigationMenuTrigger';

export const NavigationMenuContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { isOpen?: boolean }
>(({ className, children, isOpen, ...props }, ref) => {
  if (!isOpen) return null;
  return (
    <div
      ref={ref}
      className={cn(
        "absolute left-0 top-full z-50 mt-1 w-max rounded-xl bg-[#1C1C1C] border border-[#C5A059]/30 p-2 shadow-2xl animate-fade-in",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
NavigationMenuContent.displayName = 'NavigationMenuContent';

export const NavigationMenuLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { asChild?: boolean }
>(({ className, children, asChild, ...props }, ref) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as any, {
      ref,
      className: cn(className, (children as any).props.className),
      ...props,
    });
  }
  return (
    <a
      ref={ref}
      className={cn(
        "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
});
NavigationMenuLink.displayName = 'NavigationMenuLink';
