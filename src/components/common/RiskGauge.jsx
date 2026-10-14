import React from 'react';

export const RiskGauge = ({
  currentLoss = 0,
  maxDailyLoss = 5000,
  label = 'Daily Drawdown vs Kill-Switch',
  showLabels = true,
  className = '',
  style = {},
}) => {
  const loss = Math.max(0, currentLoss);
  const pct = Math.min(100, Math.max(0, (loss / maxDailyLoss) * 100));

  const isWarning = pct >= 50 && pct < 85;
  const isDanger = pct >= 85;

  const barColor = isDanger
    ? 'var(--loss)'
    : isWarning
    ? 'var(--warning)'
    : 'var(--profit)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%', ...style }} className={className}>
      {showLabels && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>
            {label}
          </span>
          <span className="font-num" style={{ fontSize: '11.5px', color: isDanger ? 'var(--loss)' : 'var(--text-primary)', fontWeight: 600 }}>
            {pct.toFixed(1)}% <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>(₹{loss.toFixed(0)} / ₹{maxDailyLoss.toLocaleString('en-IN')})</span>
          </span>
        </div>
      )}

      {/* Track */}
      <div
        style={{
          height: '6px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-main)',
          borderRadius: '3px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            backgroundColor: barColor,
            borderRadius: '2px',
            transition: 'width 250ms ease, background-color 200ms ease',
          }}
        />
        {/* 50% caution tick */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: '1px',
            backgroundColor: 'var(--border-main)',
          }}
        />
      </div>

      {showLabels && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)' }} className="font-num">
          <span>₹0</span>
          <span>50% Caution (₹{(maxDailyLoss * 0.5).toLocaleString('en-IN')})</span>
          <span style={{ color: 'var(--loss)' }}>-₹{maxDailyLoss.toLocaleString('en-IN')} (Halt)</span>
        </div>
      )}
    </div>
  );
};
