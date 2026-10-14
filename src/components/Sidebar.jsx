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
  Shield
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
  const { activeTab, setActiveTab, positions, riskRules, scannerSignals, journalTrades } = useTrading();

  return (
    <aside style={S.sidebar}>
      {/* Navigation list */}
      <nav style={S.nav}>
        <div style={S.navSectionTitle}>WORKSTATION</div>
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
              style={{
                ...S.navItem,
                ...(active ? S.navItemActive : {}),
              }}
              onClick={() => setActiveTab(id)}
            >
              <Icon
                size={14}
                style={{
                  color: active ? 'var(--navy)' : 'var(--text-muted)',
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: active ? 600 : 400,
                  color: active ? 'var(--text-heading)' : 'var(--text-secondary)',
                  flex: 1,
                  textAlign: 'left',
                }}
              >
                {label}
              </span>
              {badge !== null && (
                <span
                  className="font-num"
                  style={{
                    fontSize: '10px',
                    fontWeight: 500,
                    color: active ? 'var(--navy)' : 'var(--text-muted)',
                    backgroundColor: active ? 'var(--navy-bg)' : 'var(--bg-surface)',
                    padding: '1px 5px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Risk Discipline Summary Card */}
      <div style={S.footer}>
        <div style={S.disciplineCard}>
          <div style={S.discHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Shield size={12} style={{ color: 'var(--profit)' }} />
              <span style={S.discTitle}>RISK DISCIPLINE</span>
            </div>
            <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--profit)' }}>
              ENFORCED
            </span>
          </div>

          <div style={S.discMetrics}>
            <div style={S.discRow}>
              <span style={S.discLbl}>Cap / Trade</span>
              <span className="font-num" style={S.discVal}>{riskRules.maxCapitalRiskPct}%</span>
            </div>
            <div style={S.discRow}>
              <span style={S.discLbl}>Open Positions</span>
              <span className="font-num" style={S.discVal}>{positions.length} / {riskRules.maxOpenTrades}</span>
            </div>
            <div style={S.discRow}>
              <span style={S.discLbl}>Trailing SL</span>
              <span className="font-num" style={{ ...S.discVal, color: 'var(--profit)' }}>Auto (1:1.5)</span>
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
    backgroundColor: 'var(--bg-sidebar)',
    borderRight: '1px solid var(--border-main)',
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
  navSectionTitle: {
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
    borderRadius: 'var(--radius)',
    backgroundColor: 'transparent',
    border: '1px solid transparent',
    cursor: 'pointer',
    width: '100%',
    transition: 'all 120ms ease',
  },
  navItemActive: {
    backgroundColor: 'var(--bg-card)',
    borderColor: 'var(--border-main)',
  },
  footer: {
    borderTop: '1px solid var(--border-main)',
    padding: '8px',
  },
  disciplineCard: {
    padding: '8px 10px',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-main)',
    borderRadius: 'var(--radius)',
  },
  discHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '6px',
    paddingBottom: '4px',
    borderBottom: '1px solid var(--border-subtle)',
  },
  discTitle: {
    fontSize: '9.5px',
    fontWeight: 700,
    color: 'var(--text-heading)',
    letterSpacing: '0.04em',
  },
  discMetrics: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  discRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  discLbl: {
    fontSize: '10px',
    color: 'var(--text-muted)',
  },
  discVal: {
    fontSize: '11px',
    color: 'var(--text-primary)',
    fontWeight: 500,
  },
};
