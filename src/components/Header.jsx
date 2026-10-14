import React, { useState, useEffect } from 'react';
import { useTrading } from '../context/TradingContext';
import {
  ShieldAlert,
  Zap,
  Activity,
  AlertTriangle,
  Lock,
  Unlock,
  Radio,
  Clock,
  Wallet,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

export const Header = () => {
  const {
    tradingMode,
    setTradingMode,
    accountCapital,
    marginAvailable,
    totalNetPnl,
    riskRules,
    setPanicModalOpen,
    showToast
  } = useTrading();

  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleModeToggle = () => {
    if (tradingMode === 'PAPER') {
      const confirmSwitch = window.confirm(
        '⚠️ LIVE EXECUTION WARNING:\nYou are switching to REAL Upstox API execution. Real money will be at risk. Ensure your Upstox Access Token is configured.\n\nProceed to LIVE Mode?'
      );
      if (confirmSwitch) {
        setTradingMode('LIVE_UPSTOX');
        showToast('🟢 Switched to LIVE Upstox API Execution', 'info');
      }
    } else {
      setTradingMode('PAPER');
      showToast('🛡️ Switched back to SAFE Paper Trading Simulator', 'info');
    }
  };

  const isProfitable = totalNetPnl >= 0;

  return (
    <header className="terminal-header">
      {/* Brand & Market Status */}
      <div className="header-left">
        <div className="brand-logo">
          <div className="logo-icon">
            <Zap size={18} className="logo-bolt" />
          </div>
          <div className="brand-text">
            <span className="brand-title">NAVS<span className="brand-cyan">TRADE</span></span>
            <span className="brand-badge">INSTITUTIONAL v2.4</span>
          </div>
        </div>

        <div className="header-divider" />

        <div className="market-status-chip">
          <span className="pulse-indicator pulse-green" />
          <span className="market-text">NSE F&O LIVE</span>
          <span className="market-time mono"><Clock size={11} /> {timeStr} IST</span>
        </div>

        <div className="upstox-api-chip">
          <Radio size={12} className={tradingMode === 'LIVE_UPSTOX' ? 'text-profit' : 'text-cyan'} />
          <span>UPSTOX API: <strong>{tradingMode === 'LIVE_UPSTOX' ? 'CONNECTED' : 'SANDBOX SIMULATOR'}</strong></span>
        </div>
      </div>

      {/* Financial Telemetry (MTM, Margin, Kill Switch) */}
      <div className="header-center">
        {/* Available Margin */}
        <div className="telemetry-item">
          <span className="telemetry-label"><Wallet size={12} /> MARGIN AVAILABLE</span>
          <span className="telemetry-val mono">₹{marginAvailable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>

        {/* Net Today's P&L */}
        <div className={`telemetry-item mtm-card ${isProfitable ? 'mtm-profit' : 'mtm-loss'}`}>
          <div className="mtm-label-row">
            <span className="telemetry-label">DAY NET MTM (P&L)</span>
            {isProfitable ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          </div>
          <span className={`telemetry-val mtm-number mono ${isProfitable ? 'text-profit' : 'text-loss'}`}>
            {isProfitable ? '+' : ''}₹{totalNetPnl.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Anti-Emotion Kill Switch Indicator */}
        <div className={`telemetry-item killswitch-chip ${riskRules.killSwitchActive ? 'killswitch-tripped' : 'killswitch-armed'}`}>
          <div className="killswitch-header">
            <ShieldAlert size={13} />
            <span>DISCIPLINE GUARD</span>
          </div>
          <div className="killswitch-body mono">
            {riskRules.killSwitchActive ? (
              <span className="text-loss font-bold">LOCKED: LIMIT HIT</span>
            ) : (
              <span>MAX LOSS: ₹{riskRules.maxDailyLoss.toLocaleString('en-IN')}</span>
            )}
          </div>
        </div>
      </div>

      {/* Actions & Panic Controls */}
      <div className="header-right">
        {/* Paper vs Live Mode Toggle */}
        <button
          className={`btn mode-toggle-btn ${tradingMode === 'LIVE_UPSTOX' ? 'mode-live' : 'mode-paper'}`}
          onClick={handleModeToggle}
          title="Toggle between Paper Trading Simulator and Live Upstox API Execution"
        >
          {tradingMode === 'LIVE_UPSTOX' ? (
            <>
              <Unlock size={13} />
              <span>LIVE UPSTOX</span>
            </>
          ) : (
            <>
              <Lock size={13} />
              <span>PAPER TRADING</span>
            </>
          )}
        </button>

        {/* BIG PANIC EMERGENCY SQUARE-OFF BUTTON */}
        <button
          className="btn btn-danger panic-button"
          onClick={() => setPanicModalOpen(true)}
          title="Emergency Stop: Closes all open positions and locks new entries immediately"
        >
          <AlertTriangle size={14} />
          <span>SQUARE OFF ALL</span>
        </button>
      </div>

      <style>{`
        .terminal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 16px;
          background: var(--bg-surface-1);
          border-bottom: 1px solid var(--border-medium);
          position: sticky;
          top: 0;
          z-index: 100;
          height: 56px;
        }

        .header-left, .header-center, .header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .logo-icon {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          background: linear-gradient(135deg, rgba(0, 240, 255, 0.2) 0%, rgba(0, 114, 255, 0.4) 100%);
          border: 1px solid var(--border-cyan);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 12px rgba(0, 240, 255, 0.2);
        }

        .logo-bolt {
          color: var(--neon-cyan);
        }

        .brand-title {
          font-weight: 800;
          font-size: 15px;
          letter-spacing: 0.08em;
          color: #ffffff;
        }

        .brand-cyan {
          color: var(--neon-cyan);
        }

        .brand-badge {
          display: block;
          font-size: 8.5px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }

        .header-divider {
          width: 1px;
          height: 24px;
          background: var(--border-subtle);
        }

        .market-status-chip, .upstox-api-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--bg-surface-2);
          padding: 4px 10px;
          border-radius: 4px;
          border: 1px solid var(--border-subtle);
          font-size: 11px;
          color: var(--text-secondary);
        }

        .market-time {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--neon-cyan);
          margin-left: 4px;
        }

        .telemetry-item {
          display: flex;
          flex-direction: column;
          padding: 4px 12px;
          background: var(--bg-surface-2);
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
        }

        .telemetry-label {
          font-size: 9.5px;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .telemetry-val {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-highlight);
        }

        .mtm-card {
          min-width: 150px;
          border-color: rgba(255, 255, 255, 0.15);
        }

        .mtm-profit {
          background: linear-gradient(180deg, rgba(16, 185, 129, 0.12) 0%, rgba(13, 18, 29, 0.6) 100%);
          border-color: rgba(16, 185, 129, 0.35);
        }

        .mtm-loss {
          background: linear-gradient(180deg, rgba(244, 63, 94, 0.12) 0%, rgba(13, 18, 29, 0.6) 100%);
          border-color: rgba(244, 63, 94, 0.35);
        }

        .mtm-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .mtm-number {
          font-size: 15px;
        }

        .killswitch-chip {
          border-radius: 6px;
          min-width: 140px;
        }

        .killswitch-armed {
          background: rgba(0, 240, 255, 0.04);
          border-color: rgba(0, 240, 255, 0.25);
        }

        .killswitch-armed .killswitch-header {
          color: var(--neon-cyan);
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 9.5px;
          font-weight: 700;
        }

        .killswitch-tripped {
          background: rgba(244, 63, 94, 0.18);
          border-color: var(--loss-red);
          animation: livePulse 1.5s infinite;
        }

        .killswitch-tripped .killswitch-header {
          color: var(--loss-red);
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 9.5px;
          font-weight: 800;
        }

        .mode-toggle-btn {
          font-size: 11px;
          padding: 6px 12px;
          border-radius: 6px;
          font-weight: 700;
        }

        .mode-paper {
          background: rgba(16, 185, 129, 0.12);
          border-color: rgba(16, 185, 129, 0.3);
          color: var(--profit-green);
        }

        .mode-paper:hover {
          background: rgba(16, 185, 129, 0.2);
        }

        .mode-live {
          background: rgba(244, 63, 94, 0.2);
          border-color: var(--loss-red);
          color: #ff6b81;
          box-shadow: 0 0 10px rgba(244, 63, 94, 0.3);
        }

        .panic-button {
          font-weight: 700;
          letter-spacing: 0.05em;
          animation: subtlePulse 3s infinite ease-in-out;
        }

        @keyframes subtlePulse {
          0%, 100% { box-shadow: 0 0 10px rgba(244, 63, 94, 0.3); }
          50% { box-shadow: 0 0 18px rgba(244, 63, 94, 0.6); }
        }
      `}</style>
    </header>
  );
};
