import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'white' | 'primary' | 'accent';
}

const sizeMap = { sm: 16, md: 22, lg: 32 };
const colorMap = {
  white: '#ffffff',
  primary: 'var(--color-primary)',
  accent: 'var(--color-accent)',
};

export default function Spinner({ size = 'md', color = 'primary' }: SpinnerProps) {
  const px = sizeMap[size];
  const stroke = colorMap[color];
  const r = (px - 4) / 2;
  const circ = 2 * Math.PI * r;

  return (
    <svg
      width={px}
      height={px}
      viewBox={`0 0 ${px} ${px}`}
      className="animate-spin"
      aria-label="Loading"
    >
      <circle
        cx={px / 2}
        cy={px / 2}
        r={r}
        fill="none"
        stroke={stroke}
        strokeWidth={2.5}
        strokeOpacity={0.25}
      />
      <circle
        cx={px / 2}
        cy={px / 2}
        r={r}
        fill="none"
        stroke={stroke}
        strokeWidth={2.5}
        strokeDasharray={`${circ * 0.75} ${circ * 0.25}`}
        strokeLinecap="round"
      />
    </svg>
  );
}
