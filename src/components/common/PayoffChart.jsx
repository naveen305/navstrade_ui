import React from 'react';

export const PayoffChart = ({
  strategyId = 'strat-1',
  spotPrice = 25142,
  width = 380,
  height = 140,
  className = '',
  style = {},
}) => {
  // Payoff curves mapped to clean SVG coordinates
  const getPoints = () => {
    switch (strategyId) {
      case 'strat-1': // Bull Call Spread
        return [
          { x: 20, y: 105 },
          { x: 120, y: 105 },
          { x: 240, y: 35 },
          { x: 360, y: 35 },
        ];
      case 'strat-2': // Bear Put Spread
        return [
          { x: 20, y: 35 },
          { x: 140, y: 35 },
          { x: 260, y: 105 },
          { x: 360, y: 105 },
        ];
      case 'strat-3': // Iron Condor
        return [
          { x: 20, y: 105 },
          { x: 80, y: 105 },
          { x: 140, y: 40 },
          { x: 240, y: 40 },
          { x: 300, y: 105 },
          { x: 360, y: 105 },
        ];
      default: // Momentum Long
        return [
          { x: 20, y: 100 },
          { x: 140, y: 100 },
          { x: 360, y: 20 },
        ];
    }
  };

  const points = getPoints();
  const polylineStr = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', ...style }} className={className}>
      <svg
        width="100%"
        height={height}
        viewBox="0 0 380 140"
        preserveAspectRatio="none"
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-main)',
          borderRadius: 'var(--radius)',
        }}
      >
        {/* Zero P&L Axis */}
        <line
          x1="0"
          y1="70"
          x2="380"
          y2="70"
          stroke="var(--border-main)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <text
          x="8"
          y="66"
          fill="var(--text-muted)"
          fontSize="9"
          fontFamily="IBM Plex Mono"
        >
          ₹0 Breakeven
        </text>

        {/* Profit tint zone */}
        <rect x="0" y="0" width="380" height="70" fill="var(--profit-bg)" opacity="0.4" />
        {/* Loss tint zone */}
        <rect x="0" y="70" width="380" height="70" fill="var(--loss-bg)" opacity="0.4" />

        {/* Payoff Curve */}
        <polyline
          fill="none"
          stroke="var(--navy)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={polylineStr}
        />

        {/* Current Spot Vertical Line */}
        <line
          x1="190"
          y1="8"
          x2="190"
          y2="132"
          stroke="var(--warning)"
          strokeWidth="1"
          strokeDasharray="2 3"
          opacity="0.8"
        />
        <text
          x="194"
          y="18"
          fill="var(--warning)"
          fontSize="8.5"
          fontFamily="IBM Plex Mono"
          fontWeight="600"
        >
          Spot {spotPrice.toFixed(0)}
        </text>
      </svg>
    </div>
  );
};
