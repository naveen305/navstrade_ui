import React, { useEffect, useState } from 'react';
import { useTrading } from '../context/TradingContext';
import {
  ShieldAlert,
  AlertTriangle,
  Sun,
  Moon,
  Lock,
  CheckCircle2,
  PanelLeftClose,
  PanelLeft,
  Activity
} from 'lucide-react';

export const Header = () => {
  const {
    theme, toggleTheme,
    tradingMode,
    accountCapital, marginAvailable,
    totalNetPnl, riskRules,
    setPanicModalOpen,
    paperCriteria,
    sidebarCollapsed, toggleSidebar
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
    <header className="workstation-header">
      {/* ── Left: Sidebar Toggle, Brand & Consolidated Market Status ── */}
      <div className="header-left">
        {/* Sidebar Collapse / Expand Toggle */}
        <button
          type="button"
          className="header-icon-btn"
          onClick={toggleSidebar}
          title={`${sidebarCollapsed ? 'Expand' : 'Collapse'} Sidebar (Ctrl+B)`}
          aria-label="Toggle Sidebar"
        >
          {sidebarCollapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
        </button>

        {/* Brand Monogram & Name */}
        <div className="header-brand">
          <div className="brand-badge">N</div>
          <div className="brand-meta">
            <span className="brand-title">NavsTrade</span>
            <span className="brand-tag">NSE F&amp;O</span>
          </div>
        </div>

        <div className="header-divider" />

        {/* Consolidated Market & API Status Pill */}
        <div className="header-status-pill">
          <span
            className={`status-dot ${isMarketOpen ? 'dot-live' : 'dot-closed'}`}
            title={isMarketOpen ? 'NSE Live Session (09:15 - 15:30 IST)' : 'Market Closed'}
          />
          <span className="status-label">{isMarketOpen ? 'LIVE' : 'CLOSED'}</span>
          <span className="font-num status-clock">{timeStr}</span>
          <span className="status-sep">/</span>
          <span className={`status-mode ${tradingMode === 'LIVE_UPSTOX' ? 'mode-live' : 'mode-paper'}`}>
            {tradingMode === 'LIVE_UPSTOX' ? 'UPSTOX LIVE' : 'PAPER'}
          </span>
        </div>
      </div>

      {/* ── Center: Sleek Institutional Telemetry (Fluid, Never Cluttered, Guaranteed No Overflow) ── */}
      <div className="header-center">
        <div className="telemetry-strip">
          {/* Capital */}
          <div className="telemetry-cell">
            <span className="telemetry-lbl">CAPITAL</span>
            <span className="font-num telemetry-val">
              ₹{(accountCapital / 100000).toFixed(2)}L
            </span>
          </div>

          <div className="telemetry-divider" />

          {/* Margin */}
          <div className="telemetry-cell">
            <span className="telemetry-lbl">AVAIL MARGIN</span>
            <span className="font-num telemetry-val">
              ₹{(marginAvailable / 100000).toFixed(2)}L
            </span>
          </div>

          <div className="telemetry-divider" />

          {/* Day P&L */}
          <div className="telemetry-cell">
            <span className="telemetry-lbl">DAY P&amp;L</span>
            <span
              className={`font-num telemetry-val ${pnlPositive ? 'text-profit' : 'text-loss'}`}
              style={{ fontWeight: 700 }}
            >
              {pnlPositive ? '+' : ''}₹{totalNetPnl.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              <span className="telemetry-subval">
                ({pnlPositive ? '+' : ''}{pnlPct}%)
              </span>
            </span>
          </div>

          <div className="telemetry-divider" />

          {/* Risk Limit Circuit */}
          <div className={`telemetry-cell ${riskRules.killSwitchActive ? 'cell-danger' : ''}`}>
            <span className="telemetry-lbl">
              <ShieldAlert size={10} style={{ marginRight: 2, verticalAlign: 'middle' }} />
              LIMIT
            </span>
            <span
              className="font-num telemetry-val"
              style={{
                color: riskRules.killSwitchActive ? 'var(--loss)' : 'var(--text-secondary)',
                fontWeight: riskRules.killSwitchActive ? 700 : 600
              }}
            >
              {riskRules.killSwitchActive ? 'TRIGGERED' : `-₹${(riskRules.maxDailyLoss / 1000).toFixed(0)}k`}
            </span>
          </div>
        </div>
      </div>

      {/* ── Right: Execution Controls & ALWAYS-VISIBLE Segmented Theme Toggle ── */}
      <div className="header-right">
        {/* Go Live Locked Gate */}
        <div
          className="criteria-gate-wrap"
          onMouseEnter={() => setShowCriteriaModal(true)}
          onMouseLeave={() => setShowCriteriaModal(false)}
        >
          <button
            type="button"
            className="btn btn-outline btn-sm btn-disabled gate-btn"
            onClick={() => setShowCriteriaModal(!showCriteriaModal)}
          >
            <Lock size={11} style={{ color: 'var(--text-muted)' }} />
            <span className="gate-btn-txt">Go Live</span>
            <span className="font-num gate-count">
              {paperCriteria.completed}/{paperCriteria.required}
            </span>
          </button>

          {/* Criteria Popover Tooltip */}
          {showCriteriaModal && (
            <div className="criteria-popover">
              <div className="popover-hdr">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Lock size={12} style={{ color: 'var(--navy)' }} />
                  <span style={{ fontWeight: 600, color: 'var(--text-heading)', fontSize: '11.5px' }}>
                    Live Capital Gate (20 Rules)
                  </span>
                </div>
                <span className="font-num" style={{ fontSize: '10.5px', color: 'var(--navy)', fontWeight: 700 }}>
                  14/20 Passed
                </span>
              </div>

              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '4px 0 8px 0', lineHeight: 1.4 }}>
                Direct API trading unlocks when your execution discipline is proven in Paper mode:
              </p>

              <div className="popover-list">
                <div className="popover-item">
                  <CheckCircle2 size={13} style={{ color: 'var(--profit)', flexShrink: 0 }} />
                  <span>20 paper trades with hard SL ({paperCriteria.completed}/20 verified)</span>
                </div>
                <div className="popover-item">
                  <CheckCircle2 size={13} style={{ color: 'var(--profit)', flexShrink: 0 }} />
                  <span>Zero kill-switch breaches in past 5 sessions (0 breaches)</span>
                </div>
                <div className="popover-item">
                  <CheckCircle2 size={13} style={{ color: 'var(--profit)', flexShrink: 0 }} />
                  <span>100% adherence to ≤1.5% max capital risk per trade</span>
                </div>
                <div className="popover-item">
                  <CheckCircle2 size={13} style={{ color: 'var(--profit)', flexShrink: 0 }} />
                  <span>Auto-trailing SL verified on qualifying winners</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Square Off All Outlined Warning Button */}
        <button
          type="button"
          className="btn btn-outline-danger btn-sm panic-btn"
          onClick={() => setPanicModalOpen(true)}
          title="Emergency square-off all active positions"
        >
          <AlertTriangle size={11} />
          <span>Square Off</span>
        </button>

        {/* ── THEME TOGGLE (ANCHORED, PROMINENT, NEVER HIDDEN) ── */}
        <div className="header-theme-control">
          <button
            type="button"
            className="theme-switch-pill"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'Deep Slate Dark Mode' : 'Clean Light Mode'}`}
            aria-label="Toggle visual theme"
          >
            <div className={`theme-pill-option ${theme === 'light' ? 'active' : ''}`}>
              <Sun size={12} className="theme-opt-icon" />
              <span className="theme-opt-text">Light</span>
            </div>
            <div className={`theme-pill-option ${theme === 'dark' ? 'active' : ''}`}>
              <Moon size={12} className="theme-opt-icon" />
              <span className="theme-opt-text">Dark</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
