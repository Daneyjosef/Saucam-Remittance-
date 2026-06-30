import React from 'react';
import { motion } from 'motion/react';

interface AppPageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as number[] } },
};

export default function AppPageHeader({ title, subtitle, action }: AppPageHeaderProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex items-center justify-between flex-wrap gap-3 mb-6"
    >
      <div>
        <motion.h1
          variants={item}
          className="m-0 font-[var(--font-display)] font-extrabold text-[var(--text-4xl)] text-[var(--color-text-1)] tracking-tight leading-tight"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            variants={item}
            className="m-0 mt-1 text-[var(--color-text-3)] text-sm"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
      {action && (
        <motion.div variants={item}>
          {action}
        </motion.div>
      )}
    </motion.div>
  );
}
