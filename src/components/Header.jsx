import React, { useEffect, useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { ShieldAlert, AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';

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
    return mins >= 555 && mins <= 915; // 9:15 – 15:15 IST
  })();

  const timeStr = now.toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  });

  const pnlPositive = totalNetPnl >= 0;
  const pnlPct = ((totalNetPnl / accountCapital) * 100).toFixed(2);

  const toggleMode = () => {
    if (tradingMode === 'PAPER') {
      if (window.confirm('Switch to LIVE Upstox API execution? Real capital will be at risk.')) {
        setTradingMode('LIVE_UPSTOX');
        showToast('Switched to Live Upstox API Execution', 'info');
      }
    } else {
      setTradingMode('PAPER');
      showToast('Switched to Paper Trading Simulator', 'info');
    }
  };

  return (
    <header style={S.header}>
      {/* ── Brand & Connectivity ── */}
      <div style={S.left}>
        <div style={S.brand}>
          <div style={S.brandLogo}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8', letterSpacing: '-0.05em' }}>N</span>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#10b981', letterSpacing: '-0.05em' }}>T</span>
          </div>
          <div>
            <div style={S.brandTitle}>NAVSTRADE</div>
            <div style={S.brandSub}>INSTITUTIONAL F&O TERMINAL</div>
          </div>
        </div>

        <div style={S.divider} />

        {/* Market Status */}
        <div style={S.statusPill}>
          <span className="live-dot" style={isMarketOpen ? {} : { background: 'var(--down)' }} />
          <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
            NSE F&O · {isMarketOpen ? 'Live' : 'Closed'}
          </span>
          <span className="font-data" style={S.clock}>{timeStr} IST</span>
        </div>

        {/* Upstox API Pill */}
        <button
          type="button"
          style={S.apiPill}
          onClick={toggleMode}
          title="Click to toggle Paper Simulation / Live API"
        >
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: tradingMode === 'LIVE_UPSTOX' ? 'var(--down)' : '#38bdf8'
          }} />
          <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>API:</span>
          <span className="font-data" style={{
            fontSize: '10.5px', fontWeight: 600,
            color: tradingMode === 'LIVE_UPSTOX' ? 'var(--down)' : 'var(--text-white)'
          }}>
            {tradingMode === 'LIVE_UPSTOX' ? 'UPSTOX LIVE' : 'PAPER SIM'}
          </span>
        </button>
      </div>

      {/* ── Center Telemetry Strip ── */}
      <div style={S.center}>
        <div style={S.telemetryItem}>
          <span style={S.telemetryLabel}>Capital</span>
          <span className="font-data" style={S.telemetryVal}>
            ₹{accountCapital.toLocaleString('en-IN')}
          </span>
        </div>

        <div style={S.telemetrySep} />

        <div style={S.telemetryItem}>
          <span style={S.telemetryLabel}>Margin Available</span>
          <span className="font-data" style={S.telemetryVal}>
            ₹{marginAvailable.toLocaleString('en-IN')}
          </span>
        </div>

        <div style={S.telemetrySep} />

        <div style={S.telemetryItem}>
          <span style={S.telemetryLabel}>Day MTM P&L</span>
          <span
            className="font-data"
            style={{
              ...S.telemetryVal,
              color: pnlPositive ? 'var(--up)' : 'var(--down)',
              fontWeight: 600,
            }}
          >
            {pnlPositive ? '+' : ''}₹{totalNetPnl.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            <span style={{ fontSize: '10px', marginLeft: 4, opacity: 0.85 }}>
              ({pnlPositive ? '+' : ''}{pnlPct}%)
            </span>
          </span>
        </div>

        <div style={S.telemetrySep} />

        <div style={{
          ...S.telemetryItem,
          ...(riskRules.killSwitchActive ? S.telemetryKill : {})
        }}>
          <span style={S.telemetryLabel}>
            <ShieldAlert size={9} style={{ marginRight: 3, verticalAlign: 'middle', color: riskRules.killSwitchActive ? 'var(--down)' : 'var(--text-muted)' }} />
            Kill Switch Guard
          </span>
          <span
            className="font-data"
            style={{
              ...S.telemetryVal,
              color: riskRules.killSwitchActive ? 'var(--down)' : 'var(--text-secondary)',
              fontWeight: riskRules.killSwitchActive ? 700 : 500,
            }}
          >
            {riskRules.killSwitchActive ? 'TRIPPED (TERMINAL LOCKED)' : `Armed · −₹${riskRules.maxDailyLoss.toLocaleString('en-IN')}`}
          </span>
        </div>
      </div>

      {/* ── Right Actions ── */}
      <div style={S.right}>
        <button
          className="btn btn-ghost btn-sm"
          style={{ fontSize: '10.5px' }}
          onClick={toggleMode}
        >
          {tradingMode === 'PAPER' ? '⏵ Go Live' : '⏸ Paper'}
        </button>

        <button
          className="btn btn-danger btn-sm"
          style={{
            fontWeight: 600,
            fontSize: '10.5px',
            background: 'rgba(244, 63, 94, 0.08)',
            borderColor: 'rgba(244, 63, 94, 0.35)',
            color: '#fb7185'
          }}
          onClick={() => setPanicModalOpen(true)}
          title="Emergency square-off all active positions"
        >
          <AlertTriangle size={11} />
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
    padding: '0 12px',
    gap: '12px',
    zIndex: 100,
    flexShrink: 0,
    userSelect: 'none',
  },
  left: { display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 },
  right: { display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 },
  brand: { display: 'flex', alignItems: 'center', gap: '7px' },
  brandLogo: {
    width: 22, height: 22,
    background: '#161d2a',
    border: '1px solid #28354b',
    borderRadius: '3px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: '12px',
    fontWeight: 700,
    color: 'var(--text-white)',
    letterSpacing: '0.04em',
    lineHeight: 1.1,
  },
  brandSub: {
    fontSize: '8px',
    color: 'var(--text-muted)',
    letterSpacing: '0.08em',
    fontWeight: 600,
  },
  divider: { width: 1, height: 16, background: 'var(--border-1)', margin: '0 2px' },
  statusPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '3px 7px',
    background: 'var(--bg-panel)',
    border: '1px solid var(--border-1)',
    borderRadius: '3px',
    height: '24px',
  },
  clock: { fontSize: '10.5px', color: 'var(--text-secondary)', marginLeft: '3px' },
  apiPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '3px 8px',
    background: 'var(--bg-panel)',
    border: '1px solid var(--border-1)',
    borderRadius: '3px',
    height: '24px',
    cursor: 'pointer',
    color: 'inherit',
    transition: 'border-color 120ms ease',
  },

  center: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    maxWidth: '680px',
    background: 'var(--bg-panel)',
    border: '1px solid var(--border-1)',
    borderRadius: '3px',
    height: '26px',
    padding: '0 6px',
    overflow: 'hidden',
  },
  telemetryItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '0 10px',
    height: '100%',
  },
  telemetryLabel: {
    fontSize: '8.5px',
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  telemetryVal: {
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--text-primary)',
  },
  telemetrySep: { width: 1, height: 14, background: 'var(--border-1)' },
  telemetryKill: {
    background: 'rgba(244, 63, 94, 0.08)',
  },
};
