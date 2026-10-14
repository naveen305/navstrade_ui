import React, { useEffect, useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { ShieldAlert, AlertTriangle, Sun, Moon, Lock, CheckCircle2, ChevronDown } from 'lucide-react';
import { StatBadge } from './common/StatBadge';

export const Header = () => {
  const {
    theme, toggleTheme,
    tradingMode, setTradingMode,
    accountCapital, marginAvailable,
    totalNetPnl, riskRules,
    setPanicModalOpen, showToast,
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
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: isMarketOpen ? 'var(--profit)' : 'var(--text-muted)',
              display: 'inline-block',
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

      {/* ── Center Telemetry Strip ── */}
      <div style={S.center}>
        <div style={S.telemetryItem}>
          <span style={S.telemetryLabel}>Capital</span>
          <span className="font-num num-fade" style={S.telemetryVal}>
            ₹{accountCapital.toLocaleString('en-IN')}
          </span>
        </div>

        <div style={S.telemetrySep} />

        <div style={S.telemetryItem}>
          <span style={S.telemetryLabel}>Margin Available</span>
          <span className="font-num num-fade" style={S.telemetryVal}>
            ₹{marginAvailable.toLocaleString('en-IN')}
          </span>
        </div>

        <div style={S.telemetrySep} />

        <div style={S.telemetryItem}>
          <span style={S.telemetryLabel}>Day P&L</span>
          <span
            className="font-num num-fade"
            style={{
              ...S.telemetryVal,
              color: pnlPositive ? 'var(--profit)' : 'var(--loss)',
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

        <div
          style={{
            ...S.telemetryItem,
            ...(riskRules.killSwitchActive ? S.telemetryKill : {})
          }}
        >
          <span style={S.telemetryLabel}>
            <ShieldAlert size={10} style={{ marginRight: 3, verticalAlign: 'middle', color: riskRules.killSwitchActive ? 'var(--loss)' : 'var(--text-muted)' }} />
            Kill-Switch
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
        {/* Go Live Button (Disabled until criteria met) */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className={`btn btn-outline btn-sm ${!paperCriteria.isMet ? 'btn-disabled' : ''}`}
            onClick={() => setShowCriteriaModal(!showCriteriaModal)}
            title="Go Live is gated until paper-trading discipline criteria are met"
            style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <Lock size={11} style={{ opacity: 0.7 }} />
            <span>Go Live</span>
            <span className="font-num" style={{ fontSize: '9.5px', opacity: 0.8 }}>
              ({paperCriteria.completed}/{paperCriteria.required})
            </span>
          </button>

          {/* Criteria Popover */}
          {showCriteriaModal && (
            <div style={S.criteriaPopover}>
              <div style={S.criteriaHdr}>
                <span style={{ fontWeight: 600, color: 'var(--text-heading)' }}>Live Trading Gate</span>
                <button
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', color: 'var(--text-muted)' }}
                  onClick={() => setShowCriteriaModal(false)}
                >
                  ✕
                </button>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: 1.35 }}>
                To prevent emotional capital loss, live execution with Upstox API unlocks after verified discipline in Paper mode:
              </p>
              <div style={S.criteriaItem}>
                <CheckCircle2 size={12} style={{ color: paperCriteria.completed >= paperCriteria.required ? 'var(--profit)' : 'var(--text-muted)' }} />
                <span>Complete 20 paper trades with strict SL ({paperCriteria.completed}/20 done)</span>
              </div>
              <div style={S.criteriaItem}>
                <CheckCircle2 size={12} style={{ color: 'var(--profit)' }} />
                <span>Zero kill-switch breaches in past 5 sessions (0 breaches)</span>
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
          <AlertTriangle size={11} />
          Square Off All
        </button>

        {/* Theme Toggle (Light / Dark) */}
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={toggleTheme}
          style={{ padding: '4px 7px' }}
          title={`Switch to ${theme === 'light' ? 'Deep Slate Dark Mode' : 'Warm Off-White Light Mode'}`}
        >
          {theme === 'light' ? <Moon size={12} /> : <Sun size={12} />}
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
    padding: '0 12px',
    gap: '12px',
    zIndex: 100,
    flexShrink: 0,
    userSelect: 'none',
  },
  left: { display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 },
  right: { display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 },
  brand: { display: 'flex', alignItems: 'center', gap: '7px' },
  brandMonogram: {
    width: '22px',
    height: '22px',
    backgroundColor: 'var(--navy)',
    color: '#FFFFFF',
    borderRadius: 'var(--radius-sm)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 700,
    fontFamily: 'var(--font-ui)',
  },
  brandName: {
    fontSize: '12.5px',
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
  divider: { width: 1, height: 16, backgroundColor: 'var(--border-main)', margin: '0 2px' },
  chip: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '3px 8px',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-main)',
    borderRadius: 'var(--radius)',
    height: '24px',
  },
  clock: { fontSize: '11px', color: 'var(--text-secondary)', marginLeft: '3px' },

  center: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    maxWidth: '680px',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-main)',
    borderRadius: 'var(--radius)',
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
    fontSize: '9px',
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  telemetryVal: {
    fontSize: '11.5px',
    fontWeight: 500,
    color: 'var(--text-primary)',
  },
  telemetrySep: { width: 1, height: 14, backgroundColor: 'var(--border-main)' },
  telemetryKill: {
    backgroundColor: 'var(--loss-bg)',
  },

  criteriaPopover: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '6px',
    width: '280px',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-main)',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow-modal)',
    padding: '10px 12px',
    zIndex: 200,
  },
  criteriaHdr: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '11.5px',
    marginBottom: '6px',
    borderBottom: '1px solid var(--border-subtle)',
    paddingBottom: '4px',
  },
  criteriaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '10.5px',
    color: 'var(--text-secondary)',
    marginBottom: '4px',
  },
};
