import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  AlertTriangle,
  Brain,
  Sliders,
  CheckCircle2,
  Clock,
  HeartPulse,
  Flame,
  ZapOff
} from 'lucide-react';

export const RiskDisciplineView = () => {
  const {
    riskRules,
    updateRiskSettings,
    totalNetPnl,
    accountCapital
  } = useTrading();

  const [maxLossInput, setMaxLossInput] = useState(riskRules.maxDailyLoss);
  const [maxTradesInput, setMaxTradesInput] = useState(riskRules.maxOpenTrades);
  const [maxCapitalRiskPct, setMaxCapitalRiskPct] = useState(riskRules.maxCapitalRiskPct);
  const [autoTrailing, setAutoTrailing] = useState(riskRules.autoTrailingSl);

  const handleSave = (e) => {
    e.preventDefault();
    updateRiskSettings({
      maxDailyLoss: Number(maxLossInput),
      maxOpenTrades: Number(maxTradesInput),
      maxCapitalRiskPct: Number(maxCapitalRiskPct),
      autoTrailingSl: autoTrailing
    });
  };

  const lossBurnPct = Math.min(100, Math.max(0, (Math.abs(Math.min(0, totalNetPnl)) / riskRules.maxDailyLoss) * 100));

  return (
    <div className="risk-engine-container">
      {/* Top Banner explaining the Anti-Emotion Philosophy */}
      <div className="terminal-card philosophy-banner">
        <div className="banner-left">
          <div className="brain-shield-icon">
            <Brain size={28} className="text-cyan" />
          </div>
          <div className="banner-text">
            <h2 className="banner-title">INSTITUTIONAL ANTI-EMOTION DISCIPLINE ENGINE</h2>
            <p className="banner-desc">
              90% of retail option traders lose money not due to bad market analysis, but due to <strong>emotional breakdowns</strong>:
              revenge trading, holding losers, and over-leveraging. This engine hardcodes institutional discipline directly into the Upstox API execution pipeline.
            </p>
          </div>
        </div>

        <div className="banner-status-badge">
          <span className="pulse-indicator pulse-cyan" />
          <span className="mono font-bold text-cyan">
            {riskRules.killSwitchActive ? 'KILL-SWITCH TRIPPED (LOCKED)' : 'DISCIPLINE SHIELD ACTIVE'}
          </span>
        </div>
      </div>

      {/* Grid of Rules and Settings */}
      <div className="risk-grid">
        {/* Left Column: Hard Parameters Control */}
        <div className="terminal-card settings-card">
          <div className="terminal-card-header">
            <span className="terminal-card-title">
              <Sliders size={14} className="text-cyan" />
              NON-NEGOTIABLE RISK GATES
            </span>
            <span className="badge badge-cyan">UPSTOX ROUTER GATES</span>
          </div>

          <form onSubmit={handleSave} className="terminal-card-body settings-form">
            {/* Rule 1: Kill Switch Threshold */}
            <div className="form-group">
              <div className="group-label-row">
                <label className="form-label">
                  1. HARD DAILY LOSS KILL-SWITCH (₹)
                </label>
                <span className="mono text-loss font-bold">Max -₹{maxLossInput}</span>
              </div>
              <p className="form-help">
                If cumulative daily loss reaches this limit, the terminal immediately closes all positions and locks trading until next session.
              </p>
              <input
                type="number"
                className="form-input mono"
                value={maxLossInput}
                onChange={e => setMaxLossInput(e.target.value)}
                min="1000"
                step="500"
              />
            </div>

            {/* Rule 2: Risk Per Trade Limit */}
            <div className="form-group">
              <div className="group-label-row">
                <label className="form-label">
                  2. MAX CAPITAL RISK PER TRADE (%)
                </label>
                <span className="mono text-cyan font-bold">{maxCapitalRiskPct}% (₹{(accountCapital * (maxCapitalRiskPct / 100)).toLocaleString('en-IN')})</span>
              </div>
              <p className="form-help">
                Position sizer automatically restricts the number of lots you can buy so your SL distance never risks more than this percentage.
              </p>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.25"
                value={maxCapitalRiskPct}
                onChange={e => setMaxCapitalRiskPct(e.target.value)}
                className="slider-input"
              />
            </div>

            {/* Rule 3: Max Concurrent Trades */}
            <div className="form-group">
              <div className="group-label-row">
                <label className="form-label">
                  3. MAX CONCURRENT OPEN TRADES
                </label>
                <span className="mono font-bold text-amber">{maxTradesInput} Positions</span>
              </div>
              <p className="form-help">
                Stops over-trading and split focus. Prevents entering new positions once limit is reached.
              </p>
              <input
                type="number"
                className="form-input mono"
                value={maxTradesInput}
                onChange={e => setMaxTradesInput(e.target.value)}
                min="1"
                max="5"
              />
            </div>

            {/* Rule 4: Trailing Stop Loss Automation */}
            <div className="form-group toggle-group">
              <div>
                <label className="form-label">4. AUTO-LOCK PROFIT & TRAILING SL</label>
                <p className="form-help">Automatically shifts Stop-Loss to Cost (Break-Even) once 1:1.5 Risk:Reward target is hit.</p>
              </div>
              <input
                type="checkbox"
                checked={autoTrailing}
                onChange={e => setAutoTrailing(e.target.checked)}
                className="checkbox-input"
              />
            </div>

            <button type="submit" className="btn btn-primary save-btn">
              <ShieldCheck size={14} />
              <span>LOCK & APPLY RISK GATES</span>
            </button>
          </form>
        </div>

        {/* Right Column: Live Risk Monitor & Psychological Circuit Breakers */}
        <div className="risk-right-col">
          {/* Daily Drawdown Gauge */}
          <div className="terminal-card drawdown-card">
            <div className="terminal-card-header">
              <span className="terminal-card-title">
                <HeartPulse size={14} className="text-loss" />
                DAILY DRAWDOWN GAUGE
              </span>
              <span className="mono text-secondary">
                LIMIT: ₹{riskRules.maxDailyLoss.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="terminal-card-body">
              <div className="drawdown-bar-track">
                <div
                  className="drawdown-bar-fill"
                  style={{ width: `${lossBurnPct}%` }}
                />
              </div>
              <div className="drawdown-labels mono">
                <span>₹0 Safe</span>
                <span className={lossBurnPct > 50 ? 'text-loss font-bold' : 'text-muted'}>
                  Current Loss Consumed: {lossBurnPct.toFixed(1)}%
                </span>
                <span className="text-loss font-bold">₹{riskRules.maxDailyLoss} Lockout</span>
              </div>
            </div>
          </div>

          {/* Psychology & Anti-Revenge Circuit Breakers */}
          <div className="terminal-card circuit-card">
            <div className="terminal-card-header">
              <span className="terminal-card-title">
                <ZapOff size={14} className="text-amber" />
                PSYCHOLOGICAL CIRCUIT BREAKERS
              </span>
              <span className="badge badge-amber">ACTIVE</span>
            </div>

            <div className="terminal-card-body audit-list">
              <div className="audit-item pass">
                <CheckCircle2 size={16} className="text-profit" />
                <div className="audit-text">
                  <span className="audit-title">Anti-Revenge 20-Min Cooldown</span>
                  <span className="audit-desc">Locks execution for 20 mins if 2 consecutive stop-losses trigger. Prevents anger trading.</span>
                </div>
              </div>

              <div className="audit-item pass">
                <CheckCircle2 size={16} className="text-profit" />
                <div className="audit-text">
                  <span className="audit-title">Mandatory Pre-Trade Stop Loss</span>
                  <span className="audit-desc">No order can be submitted to Upstox without a predefined mathematical SL attached.</span>
                </div>
              </div>

              <div className="audit-item pass">
                <CheckCircle2 size={16} className="text-profit" />
                <div className="audit-text">
                  <span className="audit-title">Profit Locking Rule</span>
                  <span className="audit-desc">Greed inhibitor: System locks 50% of peak gains on positions that exceed 20% ROI.</span>
                </div>
              </div>

              <div className="audit-item pass">
                <CheckCircle2 size={16} className="text-profit" />
                <div className="audit-text">
                  <span className="audit-title">Auto Intraday Square-Off at 15:15 IST</span>
                  <span className="audit-desc">Closes all speculative option buyer legs before market close. Zero overnight gap risk.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .risk-engine-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 12px;
          height: calc(100vh - 56px);
          overflow-y: auto;
        }

        .philosophy-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          background: linear-gradient(90deg, rgba(0, 240, 255, 0.08) 0%, rgba(13, 18, 29, 0.95) 100%);
          border-color: rgba(0, 240, 255, 0.25);
        }

        .banner-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .brain-shield-icon {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          background: rgba(0, 240, 255, 0.12);
          border: 1px solid rgba(0, 240, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .banner-title {
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: #ffffff;
          margin-bottom: 3px;
        }

        .banner-desc {
          font-size: 11.5px;
          color: var(--text-secondary);
          max-width: 820px;
          line-height: 1.4;
        }

        .banner-status-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--bg-surface-2);
          padding: 8px 14px;
          border-radius: 6px;
          border: 1px solid var(--border-cyan);
          font-size: 11px;
        }

        .risk-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .settings-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .group-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .form-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: var(--text-primary);
        }

        .form-help {
          font-size: 10.5px;
          color: var(--text-muted);
          line-height: 1.3;
        }

        .form-input {
          background: var(--bg-surface-2);
          border: 1px solid var(--border-medium);
          border-radius: 5px;
          color: #ffffff;
          font-size: 13px;
          padding: 8px 10px;
          outline: none;
          transition: border-color var(--trans-fast);
        }

        .form-input:focus {
          border-color: var(--neon-cyan);
        }

        .slider-input {
          accent-color: var(--neon-cyan);
          cursor: pointer;
        }

        .toggle-group {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background: var(--bg-surface-2);
          border-radius: 6px;
          border: 1px solid var(--border-subtle);
        }

        .checkbox-input {
          width: 18px;
          height: 18px;
          accent-color: var(--profit-green);
          cursor: pointer;
        }

        .save-btn {
          margin-top: 6px;
          padding: 10px;
          font-size: 13px;
        }

        .risk-right-col {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .drawdown-bar-track {
          height: 12px;
          background: var(--bg-surface-3);
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 8px;
          border: 1px solid var(--border-subtle);
        }

        .drawdown-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981 0%, #f59e0b 60%, #f43f5e 100%);
          border-radius: 6px;
          transition: width 0.4s ease;
        }

        .drawdown-labels {
          display: flex;
          justify-content: space-between;
          font-size: 10px;
        }

        .audit-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .audit-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px;
          border-radius: 6px;
          background: var(--bg-surface-2);
          border: 1px solid var(--border-subtle);
        }

        .audit-title {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .audit-desc {
          display: block;
          font-size: 10.5px;
          color: var(--text-muted);
          margin-top: 2px;
        }
      `}</style>
    </div>
  );
};
