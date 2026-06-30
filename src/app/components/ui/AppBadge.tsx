import React from 'react';

type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'primary' | 'admin';
type BadgeSize = 'sm' | 'md';

interface AppBadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-[var(--color-success-bg)] text-[var(--color-success)] border border-[var(--color-success-border)]',
  danger:  'bg-[var(--color-danger-bg)] text-[var(--color-danger)] border border-[var(--color-danger-border)]',
  warning: 'bg-[var(--color-warning-bg)] text-[var(--color-warning-dark)] border border-[var(--color-warning-border)]',
  info:    'bg-[var(--color-info-bg)] text-[var(--color-info)] border border-[var(--color-info-border)]',
  neutral: 'bg-[var(--color-surface-muted)] text-[var(--color-text-3)] border border-[var(--color-border)]',
  primary: 'bg-[var(--color-primary-subtle)] text-[var(--color-primary)] border border-[var(--color-primary-subtle)]',
  admin:   'bg-[var(--color-admin-subtle)] text-[var(--color-admin)] border border-[var(--color-purple-border)]',
};

const dotColors: Record<BadgeVariant, string> = {
  success: 'bg-[var(--color-success)]',
  danger:  'bg-[var(--color-danger)]',
  warning: 'bg-[var(--color-warning)]',
  info:    'bg-[var(--color-info)]',
  neutral: 'bg-[var(--color-text-4)]',
  primary: 'bg-[var(--color-primary)]',
  admin:   'bg-[var(--color-admin)]',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'text-[10px] px-1.5 py-0.5 gap-1',
  md: 'text-xs px-2 py-0.5 gap-1.5',
};

export default function AppBadge({ variant = 'neutral', size = 'md', dot = false, children, className = '' }: AppBadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-[var(--radius-pill)] font-bold',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].filter(Boolean).join(' ')}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}
