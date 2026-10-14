import React from 'react';
import { useTrading } from '../context/TradingContext';
import {
  LayoutDashboard,
  Layers,
  Cpu,
  ShieldCheck,
  Radar,
  BookOpen,
  Settings,
  Shield,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const NAV = [
  { id: 'terminal',         icon: LayoutDashboard, label: 'Live Terminal' },
  { id: 'option_chain',     icon: Layers,          label: 'Option Chain' },
  { id: 'strategies',       icon: Cpu,             label: 'Strategies' },
  { id: 'risk_engine',      icon: ShieldCheck,     label: 'Risk Engine' },
  { id: 'scanner',          icon: Radar,           label: 'F&O Scanner' },
  { id: 'journal',          icon: BookOpen,        label: 'Journal' },
  { id: 'settings',         icon: Settings,        label: 'Settings' },
];

export const Sidebar = () => {
  const {
    activeTab, setActiveTab,
    positions, riskRules,
    scannerSignals, journalTrades,
    theme, toggleTheme,
    sidebarCollapsed, toggleSidebar
  } = useTrading();

  return (
    <aside className={`workstation-sidebar ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Navigation list */}
      <nav className="sidebar-nav">
        {!sidebarCollapsed && (
          <div className="sidebar-section-title">WORKSTATION</div>
        )}

        {NAV.map(({ id, icon: Icon, label }) => {
          const active = activeTab === id;
          let badge = null;
          if (id === 'terminal' && positions.length > 0) badge = positions.length;
          if (id === 'scanner') badge = scannerSignals.length;
          if (id === 'journal') badge = journalTrades.length;

          return (
            <button
              key={id}
              type="button"
              className={`sidebar-nav-item ${active ? 'active' : ''}`}
              onClick={() => setActiveTab(id)}
              title={sidebarCollapsed ? label : undefined}
            >
              <Icon
                size={15}
                className="sidebar-nav-icon"
              />
              {!sidebarCollapsed && (
                <>
                  <span className="sidebar-nav-label">
                    {label}
                  </span>
                  {badge !== null && (
                    <span className="font-num sidebar-badge">
                      {badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Area */}
      <div className="sidebar-footer">
        {!sidebarCollapsed ? (
          <>
            {/* Risk Discipline Card */}
            <div className="discipline-card">
              <div className="disc-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Shield size={12} style={{ color: 'var(--profit)' }} />
                  <span className="disc-title">RISK DISCIPLINE</span>
                </div>
                <span className="disc-status">ENFORCED</span>
              </div>

              <div className="disc-metrics">
                <div className="disc-row">
                  <span className="disc-lbl">Cap / Trade</span>
                  <span className="font-num disc-val">{riskRules.maxCapitalRiskPct}%</span>
                </div>
                <div className="disc-row">
                  <span className="disc-lbl">Open Positions</span>
                  <span className="font-num disc-val">{positions.length} / {riskRules.maxOpenTrades}</span>
                </div>
                <div className="disc-row">
                  <span className="disc-lbl">Trailing SL</span>
                  <span className="font-num disc-val text-profit">Auto (1:1.5)</span>
                </div>
              </div>
            </div>

            {/* Sidebar Secondary Theme Button */}
            <button
              type="button"
              className="btn btn-outline sidebar-theme-btn"
              onClick={toggleTheme}
            >
              {theme === 'light' ? (
                <>
                  <Moon size={12} style={{ color: 'var(--text-secondary)' }} />
                  <span>Dark Theme</span>
                </>
              ) : (
                <>
                  <Sun size={12} style={{ color: 'var(--warning)' }} />
                  <span>Light Theme</span>
                </>
              )}
            </button>
          </>
        ) : (
          <div className="collapsed-footer-actions">
            <button
              type="button"
              className="collapsed-action-btn"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              {theme === 'light' ? <Moon size={14} /> : <Sun size={14} style={{ color: 'var(--warning)' }} />}
            </button>
            <button
              type="button"
              className="collapsed-action-btn"
              onClick={toggleSidebar}
              title="Expand Sidebar (Ctrl+B)"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
