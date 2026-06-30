import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

type StatColor = 'primary' | 'accent' | 'warning' | 'danger' | 'admin';

interface AppStatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: React.ReactNode;
  color?: StatColor;
  delay?: number;
}

const colorClasses: Record<StatColor, { bg: string; text: string; iconBg: string }> = {
  primary: { bg: 'bg-[var(--color-primary-subtle)]', text: 'text-[var(--color-primary)]', iconBg: 'bg-[var(--color-primary)]/10' },
  accent:  { bg: 'bg-[var(--color-accent-subtle)]',  text: 'text-[var(--color-accent)]',  iconBg: 'bg-[var(--color-accent)]/10' },
  warning: { bg: 'bg-[var(--color-warning-subtle)]', text: 'text-[var(--color-warning-dark)]', iconBg: 'bg-[var(--color-warning)]/10' },
  danger:  { bg: 'bg-[var(--color-danger-subtle)]',  text: 'text-[var(--color-danger)]',  iconBg: 'bg-[var(--color-danger)]/10' },
  admin:   { bg: 'bg-[var(--color-admin-subtle)]',   text: 'text-[var(--color-admin)]',   iconBg: 'bg-[var(--color-admin)]/10' },
};

function useCountUp(target: number, duration = 1200, delay = 0) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      const start = performance.now();
      const step = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(target * ease));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timer);
  }, [target, duration, delay]);
  return count;
}

export default function AppStatCard({ label, value, sub, icon, color = 'primary', delay = 0 }: AppStatCardProps) {
  const c = colorClasses[color];
  const isNumeric = typeof value === 'number';
  const countedValue = useCountUp(isNumeric ? (value as number) : 0, 1200, delay * 1000);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`${c.bg} rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-bold uppercase tracking-wider ${c.text}`}>{label}</span>
        {icon && (
          <span className={`${c.iconBg} ${c.text} w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center opacity-70`}>
            {icon}
          </span>
        )}
      </div>
      <div className={`font-[var(--font-display)] font-extrabold text-3xl leading-tight ${c.text}`}>
        {isNumeric ? countedValue.toLocaleString() : value}
      </div>
      {sub && <div className={`text-xs mt-1 opacity-70 ${c.text}`}>{sub}</div>}
    </motion.div>
  );
}
