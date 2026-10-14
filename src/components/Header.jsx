import React, { useEffect, useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

export const Header = () => {
  const {
    tradingMode, setTradingMode,
    accountCapital, marginAvailable,
    totalNetPnl, riskRules,
    setPanicModalOpen, showToast
  } = useTrading();

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const isMarketOpen = (() => {
    const h = now.getHours(), m = now.getMinutes();
    const mins = h * 60 + m;
    return mins >= 555 && mins <= 915; // 9:15 – 15:15
  })();

  const timeStr = now.toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  });

  const pnlPositive = totalNetPnl >= 0;

  const toggleMode = () => {
    if (tradingMode === 'PAPER') {
      if (window.confirm('Switch to LIVE Upstox API execution? Real capital will be at risk.')) {
        setTradingMode('LIVE_UPSTOX');
        showToast('Switched to Live Upstox execution', 'info');
      }
    } else {
      setTradingMode('PAPER');
      showToast('Switched to Paper Trading simulator', 'info');
    }
  };

  return (
    <header style={S.header}>
      {/* Left: Brand */}
      <div style={S.left}>
        <div style={S.brand}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <rect width="20" height="20" rx="3" fill="#5c8df6" fillOpacity="0.15" />
            <path d="M4 14 L8 8 L12 11 L16 5" stroke="#5c8df6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="16" cy="5" r="2" fill="#26a69a" />
          </svg>
          <span style={S.brandName}>NavsTrade</span>
          <span style={S.brandSub}>F&O Terminal</span>
        </div>

        <div style={S.sep} />

        {/* Market status */}
        <div style={S.chip}>
          <span className="live-dot" style={isMarketOpen ? {} : { background: 'var(--down)' }} />
          <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
            NSE F&O · {isMarketOpen ? 'Market Open' : 'Market Closed'}
          </span>
          <span style={S.clockText} className="font-data">{timeStr} IST</span>
        </div>

        {/* API mode chip */}
        <div style={{ ...S.chip, gap: '6px', cursor: 'pointer' }} onClick={toggleMode} title="Toggle Paper / Live">
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: tradingMode === 'LIVE_UPSTOX' ? 'var(--down)' : 'var(--accent)',
            display: 'inline-block'
          }} />
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Upstox API:
          </span>
          <span style={{
            fontSize: '11px', fontWeight: 600,
            color: tradingMode === 'LIVE_UPSTOX' ? 'var(--down)' : 'var(--up)'
          }}>
            {tradingMode === 'LIVE_UPSTOX' ? 'LIVE' : 'PAPER SIM'}
          </span>
        </div>
      </div>

      {/* Center: Financial telemetry */}
      <div style={S.center}>
        <div style={S.metricGroup}>
          <span style={S.metricLabel}>Capital</span>
          <span style={S.metricVal} className="font-data">
            ₹{accountCapital.toLocaleString('en-IN')}
          </span>
        </div>
        <div style={S.metaSep} />
        <div style={S.metricGroup}>
          <span style={S.metricLabel}>Margin Available</span>
          <span style={S.metricVal} className="font-data">
            ₹{marginAvailable.toLocaleString('en-IN')}
          </span>
        </div>
        <div style={S.metaSep} />
        <div style={S.metricGroup}>
          <span style={S.metricLabel}>Day P&L (MTM)</span>
          <span
            className="font-data"
            style={{
              ...S.metricVal,
              color: pnlPositive ? 'var(--up)' : 'var(--down)',
              fontWeight: 700
            }}
          >
            {pnlPositive ? '+' : ''}₹{totalNetPnl.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div style={S.metaSep} />
        <div style={{ ...S.metricGroup, ...( riskRules.killSwitchActive ? S.killActive : {}) }}>
          <span style={S.metricLabel}>
            <ShieldAlert size={10} style={{ marginRight: 3, verticalAlign: 'middle' }} />
            Kill Switch
          </span>
          <span style={{
            ...S.metricVal,
            color: riskRules.killSwitchActive ? 'var(--down)' : 'var(--text-secondary)',
            fontWeight: riskRules.killSwitchActive ? 700 : 400
          }}>
            {riskRules.killSwitchActive
              ? 'TRIGGERED — LOCKED'
              : `Armed · −₹${riskRules.maxDailyLoss.toLocaleString('en-IN')}`}
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div style={S.right}>
        <button
          className="btn btn-ghost btn-sm"
          style={{ fontSize: '11px' }}
          onClick={toggleMode}
        >
          {tradingMode === 'PAPER' ? '⏵  Go Live' : '⏸  Back to Paper'}
        </button>
        <button
          className="btn btn-danger btn-sm"
          style={{ fontWeight: 700, letterSpacing: '0.03em' }}
          onClick={() => setPanicModalOpen(true)}
        >
          <AlertTriangle size={12} />
          Square Off All
        </button>
      </div>
    </header>
  );
};

const S = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 'var(--header-h)',
    background: 'var(--bg-header)',
    borderBottom: '1px solid var(--border-1)',
    padding: '0 14px',
    gap: '12px',
    zIndex: 100,
    flexShrink: 0,
  },
  left: { display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 },
  right: { display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 },
  center: {
    display: 'flex',
    alignItems: 'center',
    gap: '0',
    flex: 1,
    justifyContent: 'center',
    background: 'var(--bg-panel)',
    border: '1px solid var(--border-1)',
    borderRadius: '4px',
    height: '30px',
    padding: '0 2px',
    overflow: 'hidden',
  },
  brand: { display: 'flex', alignItems: 'center', gap: '7px' },
  brandName: { fontWeight: 700, fontSize: '14px', color: 'var(--text-white)', letterSpacing: '-0.01em' },
  brandSub: { fontSize: '10px', color: 'var(--text-muted)', fontWeight: 400 },
  sep: { width: '1px', height: '18px', background: 'var(--border-1)', margin: '0 6px' },
  chip: {
    display: 'flex', alignItems: 'center', gap: '5px',
    background: 'var(--bg-panel)',
    border: '1px solid var(--border-1)',
    borderRadius: '4px',
    padding: '4px 9px',
    height: '28px',
  },
  clockText: { fontSize: '11px', color: 'var(--text-secondary)', marginLeft: '4px' },
  metricGroup: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '0 14px', height: '100%',
  },
  metricLabel: {
    fontSize: '9px', fontWeight: 600, color: 'var(--text-muted)',
    textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1
  },
  metricVal: { fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.6 },
  metaSep: { width: '1px', height: '24px', background: 'var(--border-1)' },
  killActive: {
    background: 'rgba(239, 83, 80, 0.08)',
    borderLeft: '2px solid var(--down)',
    paddingLeft: '14px',
  },
};
