import React from 'react';
import { useTrading } from '../context/TradingContext';
import {
  LayoutDashboard, Layers, Cpu, ShieldCheck, Radar, TrendingUp
} from 'lucide-react';

const NAV = [
  { id: 'terminal',          icon: LayoutDashboard, label: 'Terminal' },
  { id: 'option_chain',      icon: Layers,          label: 'Option Chain' },
  { id: 'strategy_builder',  icon: Cpu,             label: 'Strategies' },
  { id: 'risk_engine',       icon: ShieldCheck,     label: 'Risk Engine' },
  { id: 'scanner',           icon: Radar,           label: 'Scanner' },
];

export const Sidebar = () => {
  const { activeTab, setActiveTab, positions, riskRules } = useTrading();

  return (
    <aside style={S.sidebar}>
      {/* Navigation */}
      <nav style={S.nav}>
        {NAV.map(({ id, icon: Icon, label }) => {
          const active = activeTab === id;
          // Live badge
          let badge = null;
          if (id === 'terminal' && positions.length > 0) badge = { text: positions.length, color: 'var(--accent)' };
          if (id === 'risk_engine') badge = {
            text: riskRules.killSwitchActive ? '!' : 'OK',
            color: riskRules.killSwitchActive ? 'var(--down)' : 'var(--up)'
          };
          if (id === 'scanner') badge = { text: '4', color: 'var(--warn)' };

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
                size={15}
                style={{ color: active ? 'var(--text-white)' : 'var(--text-muted)', flexShrink: 0 }}
              />
              <span style={{
                fontSize: '12px', fontWeight: active ? 600 : 400,
                color: active ? 'var(--text-white)' : 'var(--text-secondary)',
                flex: 1, textAlign: 'left',
              }}>
                {label}
              </span>
              {badge && (
                <span style={{
                  fontSize: '10px', fontWeight: 700,
                  color: badge.color,
                  fontFamily: 'var(--font-data)',
                }}>
                  {badge.text}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom discipline metric */}
      <div style={S.footer}>
        <div style={S.disciplineBox}>
          <div style={S.discHeader}>
            <TrendingUp size={11} style={{ color: 'var(--text-muted)' }} />
            <span style={S.discLabel}>Discipline Score</span>
            <span style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: 700, color: 'var(--up)', fontFamily: 'var(--font-data)' }}>
              {riskRules.disciplineScore}%
            </span>
          </div>
          <div style={S.progTrack}>
            <div style={{ ...S.progFill, width: `${riskRules.disciplineScore}%` }} />
          </div>
          <div style={S.discSub}>4-day disciplined streak</div>
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
  },
  nav: {
    padding: '8px 6px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
    flex: 1,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
    padding: '7px 10px',
    borderRadius: '4px',
    background: 'transparent',
    border: '1px solid transparent',
    cursor: 'pointer',
    width: '100%',
    transition: 'all 120ms ease',
  },
  navActive: {
    background: 'var(--bg-selected)',
    border: '1px solid var(--border-2)',
  },
  footer: {
    borderTop: '1px solid var(--border-1)',
    padding: '10px 10px 12px',
  },
  disciplineBox: {
    padding: '8px 10px',
    background: 'var(--bg-panel)',
    border: '1px solid var(--border-1)',
    borderRadius: '4px',
  },
  discHeader: { display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px' },
  discLabel: { fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' },
  progTrack: { height: '4px', background: '#2a2a2a', borderRadius: '2px', overflow: 'hidden', marginBottom: '5px' },
  progFill: {
    height: '100%',
    background: 'var(--up)',
    borderRadius: '2px',
    transition: 'width 0.4s ease',
  },
  discSub: { fontSize: '10px', color: 'var(--text-muted)' },
};
