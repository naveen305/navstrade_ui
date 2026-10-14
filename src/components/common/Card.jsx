import React from 'react';

export const Card = ({
  title,
  subtitle,
  rightAction,
  children,
  className = '',
  style = {},
  noPadding = false,
  headerBorder = true,
}) => {
  return (
    <div
      className={`card ${className}`}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-main)',
        borderRadius: 'var(--radius)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        ...style,
      }}
    >
      {(title || subtitle || rightAction) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '7px 12px',
            backgroundColor: 'var(--bg-card)',
            borderBottom: headerBorder ? '1px solid var(--border-subtle)' : 'none',
            minHeight: '34px',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            {title && (
              <span
                style={{
                  fontSize: '11.5px',
                  fontWeight: 600,
                  color: 'var(--text-heading)',
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                }}
              >
                {title}
              </span>
            )}
            {subtitle && (
              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                {subtitle}
              </span>
            )}
          </div>
          {rightAction && <div>{rightAction}</div>}
        </div>
      )}
      <div
        style={{
          padding: noPadding ? 0 : '10px 12px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
};
