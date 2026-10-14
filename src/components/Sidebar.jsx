import React from 'react';
import { useTrading } from '../context/TradingContext';
import {
  LayoutDashboard, Layers, Cpu, ShieldCheck, Radar, Shield, CheckCircle2
} from 'lucide-react';

const NAV = [
  { id: 'terminal',         icon: LayoutDashboard, label: 'Live Terminal' },
  { id: 'option_chain',     icon: Layers,          label: 'Option Chain' },
  { id: 'strategy_builder', icon: Cpu,             label: 'Strategies' },
  { id: 'risk_engine',      icon: ShieldCheck,     label: 'Risk Engine' },
  { id: 'scanner',          icon: Radar,           label: 'F&O Scanner' },
];

export const Sidebar = () => {
  const { activeTab, setActiveTab, positions, riskRules, scannerSignals } = useTrading();

  return (
    <aside style={S.sidebar}>
      {/* Navigation list */}
      <nav style={S.nav}>
        <div style={S.navHeader}>WORKSPACES</div>
        {NAV.map(({ id, icon: Icon, label }) => {
          const active = activeTab === id;
          let badge = null;
          if (id === 'terminal' && positions.length > 0) badge = { text: positions.length, isPill: true };
          if (id === 'risk_engine') badge = {
            text: riskRules.killSwitchActive ? 'LOCKED' : 'ACTIVE',
            color: riskRules.killSwitchActive ? 'var(--down)' : 'var(--text-secondary)'
          };
          if (id === 'scanner') badge = { text: scannerSignals.length, isPill: true };

          return (
            <button
              key={id}
              style={{
                ...S.navItem,
                ...(active ? S.navActive : {}),
              }}
              onClick={() => setActiveTab(id)}
            >
              <Icon
                size={14}
                style={{
                  color: active ? '#60a5fa' : 'var(--text-muted)',
                  flexShrink: 0
                }}
              />
              <span style={{
                fontSize: '11.5px',
                fontWeight: active ? 600 : 400,
                color: active ? 'var(--text-white)' : 'var(--text-secondary)',
                flex: 1,
                textAlign: 'left',
              }}>
                {label}
              </span>
              {badge && (
                <span
                  className="font-data"
                  style={{
                    fontSize: '9.5px',
                    fontWeight: 600,
                    color: badge.color || 'var(--text-muted)',
                    background: badge.isPill ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                    padding: badge.isPill ? '1px 5px' : '0',
                    borderRadius: '2px',
                    border: badge.isPill ? '1px solid var(--border-1)' : 'none',
                  }}
                >
                  {badge.text}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Institutional Execution Rules Footer */}
      <div style={S.footer}>
        <div style={S.rulesCard}>
          <div style={S.rulesHdr}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span className="live-dot" style={{ width: 4, height: 4 }} />
              <span style={S.rulesTitle}>RISK DISCIPLINE</span>
            </div>
            <span style={{ fontSize: '9px', color: 'var(--up)', fontWeight: 600 }}>ENFORCED</span>
          </div>

          <div style={S.rulesList}>
            <div style={S.ruleRow}>
              <span style={S.ruleLbl}>Cap Risk / Trade</span>
              <span className="font-data" style={S.ruleVal}>{riskRules.maxCapitalRiskPct}% (Max)</span>
            </div>
            <div style={S.ruleRow}>
              <span style={S.ruleLbl}>Max Open Pos</span>
              <span className="font-data" style={S.ruleVal}>{positions.length} / {riskRules.maxOpenTrades}</span>
            </div>
            <div style={S.ruleRow}>
              <span style={S.ruleLbl}>Auto Trailing SL</span>
              <span className="font-data" style={{ ...S.ruleVal, color: 'var(--up)' }}>Active (1:1.5)</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

const S = {
  sidebar: {
    width: 'var(--sidebar-w)',
    minWidth: 'var(--sidebar-w)',
    background: 'var(--bg-sidebar)',
    borderRight: '1px solid var(--border-1)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    flexShrink: 0,
    userSelect: 'none',
  },
  nav: {
    padding: '8px 6px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    flex: 1,
  },
  navHeader: {
    fontSize: '9px',
    fontWeight: 700,
    color: 'var(--text-muted)',
    letterSpacing: '0.08em',
    padding: '6px 8px 4px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 8px',
    borderRadius: '3px',
    background: 'transparent',
    border: '1px solid transparent',
    borderLeft: '2px solid transparent',
    cursor: 'pointer',
    width: '100%',
    transition: 'all 120ms ease',
  },
  navActive: {
    background: 'rgba(59, 130, 246, 0.08)',
    borderLeft: '2px solid #3b82f6',
    borderColor: 'var(--border-1)',
  },
  footer: {
    borderTop: '1px solid var(--border-1)',
    padding: '8px',
  },
  rulesCard: {
    padding: '8px',
    background: 'var(--bg-panel)',
    border: '1px solid var(--border-1)',
    borderRadius: '3px',
  },
  rulesHdr: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '6px',
    paddingBottom: '4px',
    borderBottom: '1px solid var(--border-1)',
  },
  rulesTitle: {
    fontSize: '9px',
    color: 'var(--text-secondary)',
    fontWeight: 700,
    letterSpacing: '0.06em',
  },
  rulesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  ruleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ruleLbl: {
    fontSize: '10px',
    color: 'var(--text-muted)',
  },
  ruleVal: {
    fontSize: '10.5px',
    color: 'var(--text-secondary)',
    fontWeight: 500,
  },
};
