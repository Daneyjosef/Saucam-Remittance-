import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface AppInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  loading?: boolean;
  autoComplete?: string;
  className?: string;
  inputClassName?: string;
  id?: string;
}

export default function AppInput({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  disabled,
  loading,
  autoComplete,
  className = '',
  inputClassName = '',
  id,
}: AppInputProps) {
  const [focused, setFocused] = useState(false);
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-[var(--color-text-2)] uppercase tracking-wider"
        >
          {label}{required && <span className="text-[var(--color-danger)] ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-primary)] flex items-center pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled || loading}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={[
            'w-full px-3.5 py-3 rounded-[var(--radius-md)] border text-sm transition-all duration-200 outline-none',
            'bg-[var(--color-surface-subtle)] text-[var(--color-text-1)]',
            'placeholder:text-[var(--color-text-4)]',
            leftIcon ? 'pl-10' : '',
            rightIcon ? 'pr-10' : '',
            error
              ? 'border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-2 focus:ring-[var(--color-danger)]/15'
              : focused
              ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/15 bg-white'
              : 'border-[var(--color-border)]',
            disabled || loading ? 'opacity-50 cursor-not-allowed bg-[var(--color-surface-muted)]' : '',
            inputClassName,
          ].filter(Boolean).join(' ')}
        />
        {rightIcon && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center text-[var(--color-text-3)]">
            {rightIcon}
          </span>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="text-xs text-[var(--color-danger)] font-medium mt-0.5"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      {hint && !error && (
        <p className="text-xs text-[var(--color-text-4)] mt-0.5">{hint}</p>
      )}
    </div>
  );
}
