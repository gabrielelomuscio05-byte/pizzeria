import { cn } from '@/lib/utils';

export function MenuToggleIcon({ open, className, duration = 300 }: { open: boolean; className?: string; duration?: number }) {
  return (
    <div className={cn("relative flex flex-col items-center justify-center w-5 h-5 cursor-pointer", className)}>
      <span
        style={{ transitionDuration: `${duration}ms` }}
        className={cn(
          "absolute h-0.5 w-full bg-current transform transition-all duration-300",
          open ? "rotate-45" : "-translate-y-1.5"
        )}
      />
      <span
        style={{ transitionDuration: `${duration}ms` }}
        className={cn(
          "absolute h-0.5 w-full bg-current transition-all duration-300",
          open ? "opacity-0 scale-0" : "opacity-100 scale-100"
        )}
      />
      <span
        style={{ transitionDuration: `${duration}ms` }}
        className={cn(
          "absolute h-0.5 w-full bg-current transform transition-all duration-300",
          open ? "-rotate-45" : "translate-y-1.5"
        )}
      />
    </div>
  );
}
