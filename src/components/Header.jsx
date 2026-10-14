import React, { useEffect, useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { ShieldAlert, AlertTriangle, Sun, Moon, Lock, CheckCircle2, ChevronDown, Info } from 'lucide-react';

export const Header = () => {
  const {
    theme, toggleTheme,
    tradingMode,
    accountCapital, marginAvailable,
    totalNetPnl, riskRules,
    setPanicModalOpen,
    paperCriteria
  } = useTrading();

  const [now, setNow] = useState(new Date());
  const [showCriteriaModal, setShowCriteriaModal] = useState(false);

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

  return (
    <header style={S.header}>
      {/* ── Brand, Status & Mode ── */}
      <div style={S.left}>
        <div style={S.brand}>
          <div style={S.brandMonogram}>N</div>
          <div>
            <div style={S.brandName}>NavsTrade</div>
            <div style={S.brandSub}>OPTIONS WORKSTATION · NSE</div>
          </div>
        </div>

        <div style={S.divider} />

        {/* Market Status & IST Clock */}
        <div style={S.chip}>
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              backgroundColor: isMarketOpen ? 'var(--profit)' : 'var(--text-muted)',
              display: 'inline-block',
              flexShrink: 0
            }}
          />
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            {isMarketOpen ? 'Market Open' : 'Market Closed'}
          </span>
          <span className="font-num" style={S.clock}>
            {timeStr} IST
          </span>
        </div>

        {/* API Mode Badge */}
        <div style={S.chip}>
          <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Mode:</span>
          <span
            className="font-num"
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: tradingMode === 'LIVE_UPSTOX' ? 'var(--loss)' : 'var(--navy)'
            }}
          >
            {tradingMode === 'LIVE_UPSTOX' ? 'LIVE (UPSTOX)' : 'PAPER SIM'}
          </span>
        </div>
      </div>

      {/* ── Center Telemetry Strip (Single line, generous height, no bottom clipping) ── */}
      <div style={S.center}>
        <div style={S.telemetryItem}>
          <span style={S.telemetryLabel}>CAPITAL</span>
          <span className="font-num num-fade" style={S.telemetryVal}>
            ₹{accountCapital.toLocaleString('en-IN')}
          </span>
        </div>

        <div style={S.telemetrySep} />

        <div style={S.telemetryItem}>
          <span style={S.telemetryLabel}>MARGIN AVAILABLE</span>
          <span className="font-num num-fade" style={S.telemetryVal}>
            ₹{marginAvailable.toLocaleString('en-IN')}
          </span>
        </div>

        <div style={S.telemetrySep} />

        <div style={S.telemetryItem}>
          <span style={S.telemetryLabel}>DAY P&L</span>
          <span
            className="font-num num-fade"
            style={{
              ...S.telemetryVal,
              color: pnlPositive ? 'var(--profit)' : 'var(--loss)',
              fontWeight: 600,
            }}
          >
            {pnlPositive ? '+' : ''}₹{totalNetPnl.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span style={{ fontSize: '10.5px', marginLeft: 4, opacity: 0.9 }}>
              ({pnlPositive ? '+' : ''}{pnlPct}%)
            </span>
          </span>
        </div>

        <div style={S.telemetrySep} />

        <div
          style={{
            ...S.telemetryItem,
            ...(riskRules.killSwitchActive ? S.telemetryKill : {})
          }}
        >
          <span style={S.telemetryLabel}>
            <ShieldAlert size={11} style={{ marginRight: 3, verticalAlign: 'middle', color: riskRules.killSwitchActive ? 'var(--loss)' : 'var(--text-muted)' }} />
            KILL-SWITCH
          </span>
          <span
            className="font-num"
            style={{
              ...S.telemetryVal,
              color: riskRules.killSwitchActive ? 'var(--loss)' : 'var(--text-secondary)',
              fontWeight: riskRules.killSwitchActive ? 700 : 500,
            }}
          >
            {riskRules.killSwitchActive ? 'TRIGGERED (HALT)' : `Armed (-₹${riskRules.maxDailyLoss.toLocaleString('en-IN')})`}
          </span>
        </div>
      </div>

      {/* ── Right Actions ── */}
      <div style={S.right}>
        {/* Go Live Button with Explicit 20 Criteria Tooltip Popover */}
        <div
          style={{ position: 'relative' }}
          onMouseEnter={() => setShowCriteriaModal(true)}
          onMouseLeave={() => setShowCriteriaModal(false)}
        >
          <button
            type="button"
            className="btn btn-outline btn-sm btn-disabled"
            onClick={() => setShowCriteriaModal(!showCriteriaModal)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-main)'
            }}
          >
            <Lock size={12} style={{ color: 'var(--text-muted)' }} />
            <span>Go Live</span>
            <span className="font-num" style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--navy)' }}>
              ({paperCriteria.completed}/{paperCriteria.required})
            </span>
          </button>

          {/* Criteria Popover Tooltip */}
          {showCriteriaModal && (
            <div style={S.criteriaPopover}>
              <div style={S.criteriaHdr}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Lock size={12} style={{ color: 'var(--navy)' }} />
                  <span style={{ fontWeight: 600, color: 'var(--text-heading)', fontSize: '11.5px' }}>
                    Live Capital Gate (20 Discipline Criteria)
                  </span>
                </div>
                <span className="font-num" style={{ fontSize: '10px', color: 'var(--navy)', fontWeight: 600 }}>
                  14/20 Passed
                </span>
              </div>

              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '4px 0 8px 0', lineHeight: 1.4 }}>
                To eradicate impulsive beginner losses, live broker execution via Upstox API unlocks only when all 20 risk rules are proven in paper mode:
              </p>

              <div style={S.criteriaList}>
                <div style={S.criteriaItem}>
                  <CheckCircle2 size={13} style={{ color: 'var(--profit)', flexShrink: 0 }} />
                  <span>20 paper trades completed with defined SL ({paperCriteria.completed}/20 done)</span>
                </div>
                <div style={S.criteriaItem}>
                  <CheckCircle2 size={13} style={{ color: 'var(--profit)', flexShrink: 0 }} />
                  <span>Zero kill-switch breaches in past 5 sessions (0 breaches)</span>
                </div>
                <div style={S.criteriaItem}>
                  <CheckCircle2 size={13} style={{ color: 'var(--profit)', flexShrink: 0 }} />
                  <span>100% adherence to ≤1.5% max capital risk per trade</span>
                </div>
                <div style={S.criteriaItem}>
                  <CheckCircle2 size={13} style={{ color: 'var(--profit)', flexShrink: 0 }} />
                  <span>Auto-trailing SL verified on qualifying winners</span>
                </div>
                <div style={S.criteriaItem}>
                  <CheckCircle2 size={13} style={{ color: 'var(--profit)', flexShrink: 0 }} />
                  <span>SEBI mandatory F&O risk disclosure acknowledged</span>
                </div>
              </div>

              <div style={S.criteriaFooter}>
                <span>Complete 6 more paper trades with stop-losses to unlock live trading.</span>
              </div>
            </div>
          )}
        </div>

        {/* Square Off All Outlined Red Button */}
        <button
          type="button"
          className="btn btn-outline-danger btn-sm"
          style={{ fontWeight: 600 }}
          onClick={() => setPanicModalOpen(true)}
          title="Emergency square-off all active positions"
        >
          <AlertTriangle size={12} />
          Square Off All
        </button>

        {/* Theme Toggle (Light / Dark) */}
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={toggleTheme}
          style={{ padding: '5px 8px' }}
          title={`Switch to ${theme === 'light' ? 'Deep Slate Dark Mode' : 'Clean Light Mode'}`}
        >
          {theme === 'light' ? <Moon size={13} /> : <Sun size={13} />}
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
    backgroundColor: 'var(--bg-header)',
    borderBottom: '1px solid var(--border-main)',
    padding: '0 16px',
    gap: '14px',
    zIndex: 100,
    flexShrink: 0,
    userSelect: 'none',
  },
  left: { display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 },
  right: { display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 },
  brand: { display: 'flex', alignItems: 'center', gap: '8px' },
  brandMonogram: {
    width: '24px',
    height: '24px',
    backgroundColor: 'var(--navy)',
    color: '#FFFFFF',
    borderRadius: 'var(--radius-sm)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 700,
    fontFamily: 'var(--font-ui)',
  },
  brandName: {
    fontSize: '13px',
    fontWeight: 700,
    color: 'var(--text-heading)',
    letterSpacing: '-0.01em',
    lineHeight: 1.15,
  },
  brandSub: {
    fontSize: '8px',
    color: 'var(--text-muted)',
    letterSpacing: '0.06em',
    fontWeight: 600,
  },
  divider: { width: 1, height: 18, backgroundColor: 'var(--border-main)', margin: '0 2px' },
  chip: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 9px',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-main)',
    borderRadius: 'var(--radius)',
    height: '28px',
  },
  clock: { fontSize: '11px', color: 'var(--text-secondary)', marginLeft: '3px' },

  center: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-evenly',
    maxWidth: '720px',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-main)',
    borderRadius: 'var(--radius)',
    height: '32px',
    padding: '0 10px',
    overflow: 'visible',
  },
  telemetryItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    padding: '0 8px',
    whiteSpace: 'nowrap',
  },
  telemetryLabel: {
    fontSize: '9.5px',
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  telemetryVal: {
    fontSize: '12px',
    fontWeight: 500,
    color: 'var(--text-primary)',
    lineHeight: 1.2,
  },
  telemetrySep: { width: 1, height: 16, backgroundColor: 'var(--border-main)' },
  telemetryKill: {
    backgroundColor: 'var(--loss-bg)',
    borderRadius: 'var(--radius-sm)',
    padding: '2px 6px',
  },

  criteriaPopover: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '6px',
    width: '320px',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-main)',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow-modal)',
    padding: '12px 14px',
    zIndex: 500,
  },
  criteriaHdr: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
    borderBottom: '1px solid var(--border-subtle)',
    paddingBottom: '6px',
  },
  criteriaList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  criteriaItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '7px',
    fontSize: '11px',
    color: 'var(--text-secondary)',
    lineHeight: 1.35,
  },
  criteriaFooter: {
    marginTop: '10px',
    paddingTop: '8px',
    borderTop: '1px solid var(--border-subtle)',
    fontSize: '10.5px',
    color: 'var(--navy)',
    fontWeight: 500,
  },
};
