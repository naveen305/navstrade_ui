import React, { useEffect, useState } from 'react';
import {
  Bell,
  CircleHelp,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldAlert,
  Sun,
  TriangleAlert,
} from 'lucide-react';
import { useTrading } from '../context/TradingContext';

export const Header = () => {
  const {
    theme,
    toggleTheme,
    sidebarCollapsed,
    toggleSidebar,
    tradingMode,
    totalNetPnl,
    riskRules,
    setPanicModalOpen,
  } = useTrading();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const pnlIsPositive = totalNetPnl >= 0;
  const time = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return (
    <header className="app-header">
      <div className="header-brand-group">
        <button className="header-icon" onClick={toggleSidebar} aria-label="Toggle navigation">
          {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
        <div className="brand-mark">N</div>
        <div className="brand-copy">
          <strong>NAVSTRADE</strong>
          <span>DISCIPLINE OS</span>
        </div>
        <span className="header-rule" />
        <div className="market-status"><i /> NSE F&amp;O <span>•</span> {time} IST</div>
      </div>

      <div className="header-center-message">
        <ShieldAlert size={14} />
        <span>{riskRules.killSwitchActive ? 'Trading paused by your daily loss rule' : 'Your rules are active before every order'}</span>
      </div>

      <div className="header-actions">
        <span className={`mode-chip ${tradingMode === 'PAPER' ? 'paper' : 'live'}`}>
          <span className="mode-dot" /> {tradingMode === 'PAPER' ? 'PAPER MODE' : 'LIVE · UPSTOX'}
        </span>
        <span className={`header-pnl ${pnlIsPositive ? 'positive' : 'negative'}`}>
          {pnlIsPositive ? '+' : '−'}₹{Math.abs(totalNetPnl).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
        </span>
        <button className="header-icon" title="Notifications" aria-label="Notifications"><Bell size={17} /></button>
        <button className="header-icon" title="Help" aria-label="Help"><CircleHelp size={17} /></button>
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
        <button className="squareoff-button" onClick={() => setPanicModalOpen(true)}>
          <TriangleAlert size={14} /> Square off
        </button>
      </div>
    </header>
  );
};
