import React from 'react';
import {
  BarChart3,
  BookOpen,
  Bot,
  ChartNoAxesCombined,
  ChevronRight,
  Gauge,
  Layers3,
  Radar,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { useTrading } from '../context/TradingContext';

const primaryNavigation = [
  { id: 'terminal', label: 'Control desk', icon: Gauge },
  { id: 'scanner', label: 'Setups', icon: Radar },
  { id: 'option_chain', label: 'Option chain', icon: Layers3 },
  { id: 'strategies', label: 'Playbooks', icon: Bot },
];

const secondaryNavigation = [
  { id: 'risk_engine', label: 'Risk vault', icon: ShieldCheck },
  { id: 'journal', label: 'Review journal', icon: BookOpen },
  { id: 'settings', label: 'Connections', icon: Settings },
];

export const Sidebar = () => {
  const { activeTab, setActiveTab, sidebarCollapsed, positions, riskRules, weeklyAnalytics } = useTrading();
  const renderNavigation = (items) => items.map(({ id, label, icon: Icon }) => (
    <button
      className={`sidebar-link ${activeTab === id ? 'active' : ''}`}
      key={id}
      onClick={() => setActiveTab(id)}
      aria-label={label}
      title={sidebarCollapsed ? label : undefined}
    >
      <Icon size={18} />
      {!sidebarCollapsed && <span>{label}</span>}
      {!sidebarCollapsed && id === 'terminal' && positions.length > 0 && <b>{positions.length}</b>}
    </button>
  ));

  return (
    <aside className={`app-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      {!sidebarCollapsed && <div className="sidebar-eyebrow">WORKSPACE</div>}
      <nav className="sidebar-nav">{renderNavigation(primaryNavigation)}</nav>
      {!sidebarCollapsed && <div className="sidebar-divider" />}
      <nav className="sidebar-nav sidebar-nav-secondary">{renderNavigation(secondaryNavigation)}</nav>
      <div className="sidebar-bottom">
        {!sidebarCollapsed ? (
          <div className="discipline-meter">
            <div className="discipline-meter-head">
              <span><ShieldCheck size={15} /> DISCIPLINE</span>
              <strong>{weeklyAnalytics.disciplineScore}</strong>
            </div>
            <div className="meter-track"><i style={{ width: `${weeklyAnalytics.disciplineScore}%` }} /></div>
            <p>{riskRules.maxCapitalRiskPct}% risk cap · {positions.length}/{riskRules.maxOpenTrades} positions</p>
          </div>
        ) : (
          <div className="sidebar-collapsed-shield"><ChartNoAxesCombined size={18} /></div>
        )}
        {!sidebarCollapsed && <div className="sidebar-account"><span>UPSTOX GATEWAY</span><strong><i /> Connected</strong></div>}
        {sidebarCollapsed && <ChevronRight size={15} className="sidebar-collapse-chevron" />}
      </div>
    </aside>
  );
};
