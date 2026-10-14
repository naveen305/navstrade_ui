import React from 'react';

export const StatBadge = ({
  variant = 'neutral', // 'profit' | 'loss' | 'warning' | 'navy' | 'neutral'
  label,
  children,
  className = '',
  style = {},
}) => {
  const variantClass = {
    profit: 'badge-profit',
    loss: 'badge-loss',
    warning: 'badge-warning',
    navy: 'badge-navy',
    neutral: 'badge-neutral',
  }[variant] || 'badge-neutral';

  return (
    <span className={`badge ${variantClass} ${className}`} style={style}>
      {label && <span style={{ opacity: 0.8, marginRight: 2 }}>{label}</span>}
      {children}
    </span>
  );
};
