import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  onClick?: () => void;
  onMouseEnter?: () => void;
  disabled?: boolean;
  className?: string;
}

export function Button2({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  onClick,
  onMouseEnter,
  disabled,
  className = ''
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-secondary)] shadow-sm',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-primary',
    ghost: 'text-gray-600 hover:bg-gray-400',
    success: 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)] shadow-sm'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3'
  };
  
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}
