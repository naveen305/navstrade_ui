import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { ShieldCheck, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export const RiskDisciplineView = () => {
  const { riskRules, updateRiskSettings, totalNetPnl, accountCapital } = useTrading();

  const [form, setForm] = useState({
    maxDailyLoss: riskRules.maxDailyLoss,
    maxCapitalRiskPct: riskRules.maxCapitalRiskPct,
    maxOpenTrades: riskRules.maxOpenTrades,
    autoTrailingSl: riskRules.autoTrailingSl,
  });

  const drawnPct = Math.min(100, Math.max(0, (Math.abs(Math.min(0, totalNetPnl)) / riskRules.maxDailyLoss) * 100));

  const rules = [
    {
      id: 'revenge',
      title: 'Anti-Revenge Cooldown (20 min)',
      desc: 'After 2 consecutive stop-losses, new order entry is blocked for 20 minutes to prevent impulsive re-entry.',
      status: 'active',
    },
    {
      id: 'mandatory_sl',
      title: 'Mandatory Stop Loss',
      desc: 'No order can be submitted without a predefined stop loss. Naked option buying without SL is blocked at the router level.',
      status: 'active',
    },
    {
      id: 'profit_lock',
      title: 'Profit Locking (50% of peak gain)',
      desc: 'When a position gains 20% ROI, 50% of peak profit is locked by moving the trailing SL. Prevents giving back profits.',
      status: 'active',
    },
    {
      id: 'auto_sqoff',
      title: 'Auto Square-Off at 15:15 IST',
      desc: 'All option buyer legs are closed before end of day. Eliminates overnight gap risk and expiry-day theta blowups.',
      status: 'active',
    },
    {
      id: 'oversize',
      title: 'Over-sizing Guard',
      desc: `Any order that risks more than ${form.maxCapitalRiskPct}% of capital is rejected before reaching Upstox API.`,
      status: 'active',
    },
  ];

  return (
    <div style={S.root}>
      {/* Page title bar */}
      <div style={S.titleBar}>
        <div style={S.titleLeft}>
          <ShieldCheck size={16} style={{ color: riskRules.killSwitchActive ? 'var(--down)' : 'var(--up)' }} />
          <span style={S.pageTitle}>Risk & Discipline Engine</span>
          <span style={{ ...S.tag, ...(riskRules.killSwitchActive ? S.tagDanger : S.tagOk) }}>
            {riskRules.killSwitchActive ? 'Kill Switch TRIPPED' : 'Shield Active'}
          </span>
        </div>
        <p style={S.pageDesc}>
          Institutional guardrails hardcoded into execution. Replaces human emotion with systematic rules.
          Over 90% of retail F&O traders lose due to emotional breakdowns — not bad analysis.
        </p>
      </div>

      <div style={S.body}>
        {/* Left: Settings */}
        <div style={S.leftCol}>
          <div style={S.panel}>
            <div style={S.panelHdr}><span style={S.panelTitle}>Risk Gate Parameters</span></div>
            <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Rule 1: Kill switch threshold */}
              <div style={S.formGroup}>
                <div style={S.formLabelRow}>
                  <label style={S.formLabel}>Hard Daily Loss Limit (Kill Switch)</label>
                  <span className="font-data" style={{ fontSize: '12px', color: 'var(--down)', fontWeight: 600 }}>
                    −₹{Number(form.maxDailyLoss).toLocaleString('en-IN')}
                  </span>
                </div>
                <p style={S.formHelp}>
                  If cumulative daily losses hit this number, all positions are squared off and trading is locked for the session.
                </p>
                <input
                  type="number"
                  className="form-input"
                  value={form.maxDailyLoss}
                  onChange={e => setForm(f => ({ ...f, maxDailyLoss: e.target.value }))}
                  min="1000" step="500"
                />
              </div>

              {/* Rule 2: Capital risk per trade */}
              <div style={S.formGroup}>
                <div style={S.formLabelRow}>
                  <label style={S.formLabel}>Max Capital Risk Per Trade</label>
                  <span className="font-data" style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 600 }}>
                    {form.maxCapitalRiskPct}% · ₹{(accountCapital * (form.maxCapitalRiskPct / 100)).toLocaleString('en-IN')}
                  </span>
                </div>
                <p style={S.formHelp}>
                  Lot sizer caps maximum contracts so SL loss never exceeds this %. Prevents over-leveraging driven by overconfidence.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="range" min="0.5" max="3.0" step="0.25"
                    value={form.maxCapitalRiskPct}
                    onChange={e => setForm(f => ({ ...f, maxCapitalRiskPct: Number(e.target.value) }))}
                    style={{ flex: 1, accentColor: 'var(--accent)' }}
                  />
                  <span className="font-data" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', minWidth: '30px' }}>{form.maxCapitalRiskPct}%</span>
                </div>
              </div>

              {/* Rule 3: Max concurrent trades */}
              <div style={S.formGroup}>
                <div style={S.formLabelRow}>
                  <label style={S.formLabel}>Max Concurrent Open Positions</label>
                  <span className="font-data" style={{ fontSize: '12px', color: 'var(--warn)', fontWeight: 600 }}>
                    {form.maxOpenTrades} max
                  </span>
                </div>
                <p style={S.formHelp}>
                  Caps the number of simultaneous positions. Prevents split attention and overtrading on volatile days.
                </p>
                <input
                  type="number"
                  className="form-input"
                  value={form.maxOpenTrades}
                  onChange={e => setForm(f => ({ ...f, maxOpenTrades: e.target.value }))}
                  min="1" max="5"
                />
              </div>

              {/* Rule 4: Trailing SL toggle */}
              <div style={S.toggleRow}>
                <div>
                  <div style={S.formLabel}>Auto-Trail to Break-Even</div>
                  <p style={S.formHelp}>Moves SL to entry cost once 1:1.5 R:R is reached. Prevents profitable trades turning into losses.</p>
                </div>
                <label style={S.toggleWrap}>
                  <input
                    type="checkbox"
                    checked={form.autoTrailingSl}
                    onChange={e => setForm(f => ({ ...f, autoTrailingSl: e.target.checked }))}
                    style={{ display: 'none' }}
                  />
                  <div style={{ ...S.toggle, ...(form.autoTrailingSl ? S.toggleOn : S.toggleOff) }}>
                    <div style={{ ...S.toggleThumb, ...(form.autoTrailingSl ? S.thumbOn : {}) }} />
                  </div>
                </label>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => updateRiskSettings({ ...form, maxDailyLoss: Number(form.maxDailyLoss), maxOpenTrades: Number(form.maxOpenTrades) })}
                style={{ width: '100%', padding: '9px', justifyContent: 'center' }}
              >
                <ShieldCheck size={14} />
                Save & Apply Risk Gates
              </button>
            </div>
          </div>
        </div>

        {/* Right: Gauges + Circuit Breakers */}
        <div style={S.rightCol}>
          {/* Drawdown gauge */}
          <div style={S.panel}>
            <div style={S.panelHdr}>
              <span style={S.panelTitle}>Daily Loss Drawdown</span>
              <span className="font-data" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Limit: ₹{riskRules.maxDailyLoss.toLocaleString('en-IN')}
              </span>
            </div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '11px' }}>
                <span style={{ color: 'var(--text-muted)' }}>₹0</span>
                <span className="font-data" style={{ color: drawnPct > 60 ? 'var(--down)' : 'var(--text-secondary)', fontWeight: 600 }}>
                  {drawnPct.toFixed(1)}% consumed
                </span>
                <span style={{ color: 'var(--down)' }}>₹{riskRules.maxDailyLoss.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ height: '10px', background: '#222', borderRadius: '5px', overflow: 'hidden', border: '1px solid var(--border-1)' }}>
                <div style={{
                  height: '100%',
                  width: `${drawnPct}%`,
                  background: drawnPct > 75 ? 'var(--down)' : drawnPct > 50 ? 'var(--warn)' : 'var(--up)',
                  borderRadius: '5px',
                  transition: 'width 0.4s ease',
                }} />
              </div>
              {drawnPct === 0 && (
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
                  No losses consumed today. Kill switch is armed at −₹{riskRules.maxDailyLoss.toLocaleString('en-IN')}.
                </p>
              )}
            </div>
          </div>

          {/* Circuit Breakers */}
          <div style={S.panel}>
            <div style={S.panelHdr}>
              <span style={S.panelTitle}>Psychological Circuit Breakers</span>
              <span style={S.tagOk}>All Active</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {rules.map((rule, i) => (
                <div key={rule.id} style={{ ...S.ruleRow, borderBottom: i < rules.length - 1 ? '1px solid var(--border-1)' : 'none' }}>
                  <CheckCircle size={14} style={{ color: 'var(--up)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>{rule.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{rule.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const S = {
  root: { display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' },
  panel: { background: 'var(--bg-panel)', border: '1px solid var(--border-1)', borderRadius: '4px', overflow: 'hidden' },
  panelHdr: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '7px 12px', background: 'var(--bg-panel-2)',
    borderBottom: '1px solid var(--border-1)', height: '34px',
  },
  panelTitle: { fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' },

  titleBar: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '10px 14px', background: 'var(--bg-panel)',
    borderBottom: '1px solid var(--border-1)', flexShrink: 0,
  },
  titleLeft: { display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 },
  pageTitle: { fontSize: '13px', fontWeight: 700, color: 'var(--text-white)' },
  pageDesc: { fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: '1.4', maxWidth: '600px' },

  tag: { fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '3px', fontFamily: 'var(--font-data)' },
  tagOk: { background: 'var(--up-bg)', color: 'var(--up)', border: '1px solid var(--up-border)' },
  tagDanger: { background: 'var(--down-bg)', color: 'var(--down)', border: '1px solid var(--down-border)', animation: 'none' },

  body: { display: 'grid', gridTemplateColumns: '400px 1fr', gap: '10px', padding: '10px', flex: 1, overflow: 'auto' },
  leftCol: { display: 'flex', flexDirection: 'column', gap: '10px' },
  rightCol: { display: 'flex', flexDirection: 'column', gap: '10px' },

  formGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  formLabelRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  formLabel: { fontSize: '10.5px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' },
  formHelp: { fontSize: '10.5px', color: 'var(--text-muted)', lineHeight: '1.4' },

  toggleRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '10px', background: 'var(--bg-panel-2)', borderRadius: '4px', border: '1px solid var(--border-1)' },
  toggleWrap: { cursor: 'pointer', flexShrink: 0 },
  toggle: { width: '34px', height: '18px', borderRadius: '9px', padding: '2px', cursor: 'pointer', transition: 'background 200ms' },
  toggleOn: { background: 'var(--up)' },
  toggleOff: { background: '#333' },
  toggleThumb: { width: '14px', height: '14px', borderRadius: '50%', background: '#fff', transition: 'transform 200ms' },
  thumbOn: { transform: 'translateX(16px)' },

  ruleRow: { display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 12px' },
};
