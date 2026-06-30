import React from 'react';
import { motion } from 'motion/react';
import AppSpinner from './AppSpinner';

export type BtnVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'admin';
export type BtnSize = 'sm' | 'md' | 'lg';

interface AppButtonProps {
  variant?: BtnVariant;
  size?: BtnSize;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  children?: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BtnVariant, string> = {
  primary:   'bg-[var(--color-primary)] text-white shadow-md hover:bg-[var(--color-primary-hover)]',
  secondary: 'bg-[var(--color-surface)] text-[var(--color-text-1)] border border-[var(--color-border)] hover:bg-[var(--color-surface-muted)]',
  danger:    'bg-[var(--color-danger)] text-white hover:brightness-110',
  ghost:     'bg-transparent text-[var(--color-text-2)] hover:bg-[var(--color-surface-muted)]',
  admin:     'bg-[var(--color-admin)] text-white hover:bg-[var(--color-admin-hover)]',
};

const sizeClasses: Record<BtnSize, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3.5 text-base gap-2',
};

export default function AppButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  onClick,
  type = 'button',
  children,
  className = '',
}: AppButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileHover={isDisabled ? {} : { scale: 1.02 }}
      whileTap={isDisabled ? {} : { scale: 0.97 }}
      className={[
        'inline-flex items-center justify-center font-semibold rounded-[var(--radius-pill)] transition-all duration-200 cursor-pointer select-none',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        isDisabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : '',
        className,
      ].filter(Boolean).join(' ')}
    >
      {loading ? (
        <AppSpinner size="sm" color={variant === 'secondary' || variant === 'ghost' ? 'primary' : 'white'} />
      ) : (
        leftIcon && <span className="flex items-center">{leftIcon}</span>
      )}
      {children}
      {rightIcon && !loading && <span className="flex items-center">{rightIcon}</span>}
    </motion.button>
  );
}
