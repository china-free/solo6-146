import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const variantClasses = {
  primary: 'btn-neon-primary',
  secondary: 'btn-neon-secondary',
  outline: 'btn-neon-outline',
  ghost: 'bg-transparent text-white border border-transparent hover:bg-white/10 rounded-lg font-semibold transition-all duration-300',
  danger:
    'bg-gradient-to-r from-red-500 to-rose-600 text-white border-none rounded-lg font-semibold cursor-pointer transition-all duration-300 shadow-lg shadow-red-500/30 hover:-translate-y-0.5 hover:shadow-red-500/50 active:translate-y-0',
};

const sizeClasses = {
  sm: '!px-3 !py-1.5 !text-sm',
  md: '',
  lg: '!px-6 !py-3 !text-lg',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  disabled,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={cn(
        variantClasses[variant],
        sizeClasses[size],
        disabled && 'opacity-50 cursor-not-allowed !hover:translate-y-0',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
