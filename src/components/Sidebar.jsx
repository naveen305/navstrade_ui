import React from 'react';
import { useTrading } from '../context/TradingContext';
import {
  LayoutDashboard,
  Layers,
  ShieldCheck,
  Cpu,
  Radar,
  BarChart3,
  Award,
  Flame
} from 'lucide-react';

export const Sidebar = () => {
  const { activeTab, setActiveTab, riskRules, positions } = useTrading();

  const navItems = [
    {
      id: 'terminal',
      label: 'Live Terminal',
      icon: LayoutDashboard,
      badge: positions.length > 0 ? `${positions.length} Active` : null,
      badgeColor: 'badge-cyan'
    },
    {
      id: 'option_chain',
      label: 'Option Chain & Greeks',
      icon: Layers,
      badge: 'Live OI',
      badgeColor: 'badge-purple'
    },
    {
      id: 'strategy_builder',
      label: 'Defined-Risk Strategies',
      icon: Cpu,
      badge: 'Hedged',
      badgeColor: 'badge-green'
    },
    {
      id: 'risk_engine',
      label: 'Discipline & Kill Switch',
      icon: ShieldCheck,
      badge: riskRules.killSwitchActive ? 'LOCKED' : 'ARMED',
      badgeColor: riskRules.killSwitchActive ? 'badge-red' : 'badge-green'
    },
    {
      id: 'scanner',
      label: 'F&O Market Scanner',
      icon: Radar,
      badge: '4 Hits',
      badgeColor: 'badge-amber'
    }
  ];

  return (
    <aside className="terminal-sidebar">
      <div className="sidebar-nav">
        <div className="sidebar-group-title">CORE MODULES</div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-btn ${isActive ? 'nav-active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <div className="nav-btn-left">
                <Icon size={16} className="nav-icon" />
                <span className="nav-label">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`badge ${item.badgeColor}`}>{item.badge}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Trader Discipline Scorecard (Anti-Emotion Anchor) */}
      <div className="sidebar-discipline-card">
        <div className="discipline-header">
          <Award size={15} className="text-cyan" />
          <span>DISCIPLINE AUDIT</span>
        </div>
        <div className="discipline-metric-row">
          <span className="text-secondary">Patience / Rule Score</span>
          <span className="text-profit mono font-bold">{riskRules.disciplineScore}%</span>
        </div>
        <div className="discipline-progress-track">
          <div
            className="discipline-progress-fill"
            style={{ width: `${riskRules.disciplineScore}%` }}
          />
        </div>
        <div className="discipline-subtext">
          <Flame size={12} className="text-amber" />
          <span>Streak: 4 consecutive disciplined days</span>
        </div>
      </div>

      <style>{`
        .terminal-sidebar {
          width: 250px;
          min-width: 250px;
          background: var(--bg-surface-1);
          border-right: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 14px 10px;
          height: calc(100vh - 56px);
        }

        .sidebar-group-title {
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          padding: 6px 12px 10px;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 9px 12px;
          border-radius: 6px;
          background: transparent;
          border: 1px solid transparent;
          color: var(--text-secondary);
          cursor: pointer;
          font-family: var(--font-sans);
          font-size: 12.5px;
          font-weight: 600;
          transition: all var(--trans-fast);
          width: 100%;
        }

        .nav-btn-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .nav-icon {
          color: var(--text-muted);
          transition: color var(--trans-fast);
        }

        .nav-btn:hover {
          background: var(--bg-surface-2);
          color: var(--text-primary);
        }

        .nav-btn:hover .nav-icon {
          color: var(--neon-cyan);
        }

        .nav-active {
          background: linear-gradient(90deg, rgba(0, 240, 255, 0.12) 0%, rgba(0, 240, 255, 0.02) 100%);
          border-color: rgba(0, 240, 255, 0.3);
          color: var(--text-highlight);
        }

        .nav-active .nav-icon {
          color: var(--neon-cyan);
        }

        .sidebar-discipline-card {
          background: var(--bg-surface-2);
          border: 1px solid var(--border-subtle);
          border-radius: 8px;
          padding: 12px;
        }

        .discipline-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }

        .discipline-metric-row {
          display: flex;
          justify-content: space-between;
          font-size: 11.5px;
          margin-bottom: 6px;
        }

        .discipline-progress-track {
          height: 6px;
          background: var(--bg-surface-3);
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .discipline-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981 0%, #00f0ff 100%);
          border-radius: 3px;
          transition: width 0.4s ease;
        }

        .discipline-subtext {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10.5px;
          color: var(--text-muted);
        }
      `}</style>
    </aside>
  );
};
