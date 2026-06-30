import React from 'react';
import { motion } from 'motion/react';

interface AppCardProps {
  hover?: boolean;
  glass?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  accent?: string;
}

const paddingMap = { sm: 'p-3', md: 'p-5', lg: 'p-6' };

export default function AppCard({
  hover = false,
  glass = false,
  padding = 'md',
  className = '',
  onClick,
  children,
  accent,
}: AppCardProps) {
  const clickable = !!onClick;

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover || clickable ? { y: -3, boxShadow: 'var(--shadow-lg)' } : {}}
      whileTap={clickable ? { scale: 0.99 } : {}}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={[
        'rounded-[var(--radius-lg)] border transition-all duration-200',
        glass
          ? 'bg-white/80 backdrop-blur-xl border-white/60'
          : 'bg-[var(--color-surface)] border-[var(--color-border)] shadow-[var(--shadow-card)]',
        paddingMap[padding],
        clickable ? 'cursor-pointer' : '',
        className,
      ].filter(Boolean).join(' ')}
      style={accent ? { borderLeft: `4px solid ${accent}` } : undefined}
    >
      {children}
    </motion.div>
  );
}
