import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

type StatColor = 'primary' | 'accent' | 'warning' | 'danger' | 'admin' | 'info';

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: React.ReactNode;
  color?: StatColor;
  delay?: number;
}

const colorMap: Record<StatColor, { text: string; bg: string; border: string }> = {
  primary: { text: 'var(--color-primary)',      bg: 'var(--color-primary-subtle)',  border: 'rgba(30,58,138,0.15)'  },
  accent:  { text: 'var(--color-accent)',        bg: 'var(--color-accent-subtle)',   border: 'rgba(22,163,74,0.15)'  },
  warning: { text: 'var(--color-warning-dark)',  bg: 'var(--color-warning-subtle)',  border: 'rgba(245,158,11,0.2)'  },
  danger:  { text: 'var(--color-danger)',        bg: 'var(--color-danger-subtle)',   border: 'rgba(220,38,38,0.15)'  },
  admin:   { text: 'var(--color-admin)',         bg: 'var(--color-admin-subtle)',    border: 'rgba(79,70,229,0.15)'  },
  info:    { text: 'var(--color-info)',          bg: 'var(--color-info-subtle)',     border: 'rgba(3,105,161,0.15)'  },
};

function useCountUp(target: number, duration = 800, delay = 0) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (started.current) return;
      started.current = true;
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setCount(Math.round(eased * target));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timer);
  }, [target, duration, delay]);

  return count;
}

export default function StatCard({ label, value, sub, icon, color = 'primary', delay = 0 }: StatCardProps) {
  const c = colorMap[color];
  const isNumeric = typeof value === 'number';
  const counted = useCountUp(isNumeric ? (value as number) : 0, 700, delay * 1000);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, boxShadow: 'var(--shadow-lg)' }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 'var(--radius-lg)' }}
      className="p-5 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <span
          style={{ color: c.text, fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', textTransform: 'uppercase', letterSpacing: '0.08em' }}
        >
          {label}
        </span>
        {icon && (
          <span style={{ color: c.text, opacity: 0.5 }} className="flex items-center">
            {icon}
          </span>
        )}
      </div>
      <p
        style={{ color: c.text, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-extrabold)', fontSize: 'var(--text-5xl)', lineHeight: 1, margin: 0 }}
      >
        {isNumeric ? counted.toLocaleString() : value}
      </p>
      {sub && (
        <p style={{ color: c.text, opacity: 0.65, fontSize: 'var(--text-sm)', margin: '6px 0 0' }}>
          {sub}
        </p>
      )}
    </motion.div>
  );
}
