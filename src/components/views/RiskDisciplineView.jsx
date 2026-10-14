import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { ShieldCheck, AlertTriangle, CheckCircle2, Lock, Sliders, Activity } from 'lucide-react';

export const RiskDisciplineView = () => {
  const { riskRules, updateRiskSettings, totalNetPnl, accountCapital, showToast } = useTrading();

  const [form, setForm] = useState({
    maxDailyLoss: riskRules.maxDailyLoss,
    maxCapitalRiskPct: riskRules.maxCapitalRiskPct,
    maxOpenTrades: riskRules.maxOpenTrades,
    autoTrailingSl: riskRules.autoTrailingSl,
  });

  const [saved, setSaved] = useState(false);

  const currentLoss = Math.max(0, -totalNetPnl);
  const drawnPct = Math.min(100, (currentLoss / Number(form.maxDailyLoss)) * 100);

  const handleSave = (e) => {
    e.preventDefault();
    updateRiskSettings({
      maxDailyLoss: Number(form.maxDailyLoss),
      maxCapitalRiskPct: Number(form.maxCapitalRiskPct),
      maxOpenTrades: Number(form.maxOpenTrades),
      autoTrailingSl: Boolean(form.autoTrailingSl),
    });
    setSaved(true);
    showToast('Risk parameters saved & armed at router level', 'success');
    setTimeout(() => setSaved(false), 2000);
  };

  const circuitBreakers = [
    {
      title: 'Anti-Revenge Cooldown (20 min)',
      desc: 'After 2 consecutive stop-outs, order placement is paused for 20 minutes to prevent impulsive re-entry.',
      active: true,
    },
    {
      title: 'Mandatory Stop-Loss Verification',
      desc: 'No order can reach Upstox API without an explicit hard stop loss price defined.',
      active: true,
    },
    {
      title: 'Dynamic Profit Locking (50% of peak ROI)',
      desc: 'Once a position hits 20% ROI, the trailing stop automatically moves to lock in 50% of peak unrealized profit.',
      active: true,
    },
    {
      title: 'Auto Square-Off at 15:15 IST',
      desc: 'Closes all intraday option buyer positions 15 minutes before cash market close to eliminate overnight gap risk.',
      active: true,
    },
    {
      title: 'Over-Sizing Protection',
      desc: `Orders requiring risk greater than ${form.maxCapitalRiskPct}% of capital are automatically downsized or rejected.`,
      active: true,
    },
  ];

  return (
    <div style={S.root}>
      {/* ── Toolbar ── */}
      <div style={S.toolbar}>
        <div style={S.toolLeft}>
          <ShieldCheck size={14} style={{ color: riskRules.killSwitchActive ? 'var(--down)' : 'var(--up)' }} />
          <span style={S.pageTitle}>Institutional Risk & Discipline Engine</span>
          <span className={riskRules.killSwitchActive ? 'tag tag-down' : 'tag tag-up'}>
            {riskRules.killSwitchActive ? 'KILL SWITCH TRIGGERED' : 'RISK GATES ACTIVE'}
          </span>
        </div>
        <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
          Rule enforcement: Client router & Upstox Pre-Trade Validation
        </div>
      </div>

      {/* ── Content Grid ── */}
      <div style={S.workspace}>

        {/* Left Column: Risk Controls Form */}
        <div style={S.leftCol}>
          <div style={S.panel}>
            <div style={S.panelHdr}>
              <span style={S.panelTitle}>EXECUTION RISK GATES</span>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>PARAMETERS</span>
            </div>

            <form onSubmit={handleSave} style={S.formBody}>
              {/* Daily Loss Limit */}
              <div style={S.fieldGroup}>
                <div style={S.fieldHeader}>
                  <label style={S.label}>Hard Daily Loss Limit (Kill Switch)</label>
                  <span className="font-data" style={{ fontSize: '11px', color: 'var(--down)', fontWeight: 600 }}>
                    -₹{Number(form.maxDailyLoss).toLocaleString('en-IN')}
                  </span>
                </div>
                <div style={S.fieldDesc}>
                  If today's losses reach this ceiling, the engine cancels all pending orders, squares off open positions, and locks the terminal.
                </div>
                <div style={S.inputWrap}>
                  <span style={S.inputPrefix}>₹</span>
                  <input
                    type="number"
                    className="form-input"
                    style={{ paddingLeft: '22px' }}
                    value={form.maxDailyLoss}
                    onChange={e => setForm(f => ({ ...f, maxDailyLoss: e.target.value }))}
                    min="1000"
                    step="500"
                    required
                  />
                </div>
                <div style={S.presetsRow}>
                  {[3000, 5000, 10000, 15000].map(val => (
                    <button
                      key={val}
                      type="button"
                      style={S.presetBtn}
                      onClick={() => setForm(f => ({ ...f, maxDailyLoss: val }))}
                    >
                      ₹{val.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Capital Risk Per Trade */}
              <div style={S.fieldGroup}>
                <div style={S.fieldHeader}>
                  <label style={S.label}>Max Capital Risk Per Trade</label>
                  <span className="font-data" style={{ fontSize: '11px', color: 'var(--text-white)', fontWeight: 600 }}>
                    {form.maxCapitalRiskPct}% (₹{(accountCapital * (form.maxCapitalRiskPct / 100)).toLocaleString('en-IN')})
                  </span>
                </div>
                <div style={S.fieldDesc}>
                  The automatic lot sizer caps contracts so stop-loss hit never exceeds this percentage of total account equity.
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="range"
                    min="0.5"
                    max="3.0"
                    step="0.25"
                    value={form.maxCapitalRiskPct}
                    onChange={e => setForm(f => ({ ...f, maxCapitalRiskPct: Number(e.target.value) }))}
                    style={{ flex: 1, accentColor: '#3b82f6' }}
                  />
                  <span className="font-data" style={{ fontSize: '11.5px', minWidth: '32px', textAlign: 'right', fontWeight: 600 }}>
                    {form.maxCapitalRiskPct}%
                  </span>
                </div>
              </div>

              {/* Max Concurrent Positions */}
              <div style={S.fieldGroup}>
                <div style={S.fieldHeader}>
                  <label style={S.label}>Max Concurrent Positions</label>
                  <span className="font-data" style={{ fontSize: '11px', color: 'var(--text-white)', fontWeight: 600 }}>
                    {form.maxOpenTrades} open
                  </span>
                </div>
                <div style={S.fieldDesc}>
                  Prevents over-trading and attention fragmentation. Rejects new order entries if limit is saturated.
                </div>
                <input
                  type="number"
                  className="form-input"
                  value={form.maxOpenTrades}
                  onChange={e => setForm(f => ({ ...f, maxOpenTrades: Number(e.target.value) }))}
                  min="1"
                  max="6"
                  required
                />
              </div>

              {/* Save Button */}
              <button
                type="submit"
                className="btn btn-primary"
                style={{ justifyContent: 'center', padding: '7px', marginTop: '4px' }}
              >
                {saved ? '✓ Parameters Saved & Armed' : 'Save & Arm Risk Parameters'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Drawdown Monitor & Circuit Breakers */}
        <div style={S.rightCol}>

          {/* Daily Drawdown Meter */}
          <div style={S.panel}>
            <div style={S.panelHdr}>
              <span style={S.panelTitle}>DAILY DRAWDOWN VS KILL-SWITCH LIMIT</span>
              <span className="font-data" style={{ fontSize: '10px', color: drawnPct >= 80 ? 'var(--down)' : 'var(--text-secondary)' }}>
                {drawnPct.toFixed(1)}% Consumed
              </span>
            </div>

            <div style={{ padding: '12px' }}>
              <div style={S.drawdownTrack}>
                <div
                  style={{
                    ...S.drawdownFill,
                    width: `${drawnPct}%`,
                    background: drawnPct >= 80 ? 'var(--down)' : drawnPct >= 50 ? 'var(--warn)' : 'var(--up)'
                  }}
                />
                {/* 50% Warning Line */}
                <div style={S.halfMarker} />
              </div>

              <div style={S.drawdownLabels}>
                <span className="font-data" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>₹0</span>
                <span className="font-data" style={{ fontSize: '10px', color: 'var(--warn)' }}>50% Caution (₹{(form.maxDailyLoss * 0.5).toLocaleString('en-IN')})</span>
                <span className="font-data" style={{ fontSize: '10px', color: 'var(--down)' }}>-₹{Number(form.maxDailyLoss).toLocaleString('en-IN')} (Halt)</span>
              </div>

              <div style={S.drawdownSummary}>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Today's Cumulative Losses:&nbsp;
                  <strong className="font-data" style={{ color: currentLoss > 0 ? 'var(--down)' : 'var(--up)' }}>
                    ₹{currentLoss.toFixed(2)}
                  </strong>
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                  Remaining risk room: <strong className="font-data" style={{ color: 'var(--text-primary)' }}>₹{Math.max(0, form.maxDailyLoss - currentLoss).toLocaleString('en-IN')}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Circuit Breakers List */}
          <div style={S.panel}>
            <div style={S.panelHdr}>
              <span style={S.panelTitle}>SYSTEMATIC BEHAVIORAL CIRCUIT BREAKERS</span>
              <span className="tag tag-up">ALL 5 ENFORCED</span>
            </div>

            <div style={S.circuitList}>
              {circuitBreakers.map((cb, i) => (
                <div key={i} style={S.circuitItem}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={13} style={{ color: 'var(--up)', flexShrink: 0 }} />
                      <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-white)' }}>
                        {cb.title}
                      </span>
                    </div>
                    <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--up)' }}>ACTIVE</span>
                  </div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', lineHeight: 1.4, paddingLeft: '19px' }}>
                    {cb.desc}
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
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
    userSelect: 'none',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '6px 12px',
    background: 'var(--bg-panel-2)',
    borderBottom: '1px solid var(--border-1)',
    height: '38px',
    flexShrink: 0,
  },
  toolLeft: { display: 'flex', alignItems: 'center', gap: '8px' },
  pageTitle: { fontSize: '12px', fontWeight: 700, color: 'var(--text-white)' },

  workspace: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
    gap: '1px',
    background: 'var(--border-1)',
  },
  leftCol: {
    width: '380px',
    background: 'var(--bg-base)',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    flexShrink: 0,
  },
  rightCol: {
    flex: 1,
    background: 'var(--bg-base)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
    overflowY: 'auto',
  },
  panel: {
    background: 'var(--bg-panel)',
    display: 'flex',
    flexDirection: 'column',
  },
  panelHdr: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '6px 10px',
    background: 'var(--bg-panel-2)',
    borderBottom: '1px solid var(--border-1)',
    height: '30px',
  },
  panelTitle: {
    fontSize: '9.5px',
    fontWeight: 700,
    color: 'var(--text-secondary)',
    letterSpacing: '0.05em',
  },
  formBody: {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '4px' },
  fieldHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontSize: '10.5px', fontWeight: 600, color: 'var(--text-white)' },
  fieldDesc: { fontSize: '10px', color: 'var(--text-muted)', lineHeight: 1.35, marginBottom: '2px' },
  inputWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
  inputPrefix: {
    position: 'absolute',
    left: '8px',
    fontSize: '11.5px',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-data)',
  },
  presetsRow: { display: 'flex', gap: '4px', marginTop: '4px' },
  presetBtn: {
    flex: 1,
    padding: '3px 0',
    background: 'var(--bg-panel-2)',
    border: '1px solid var(--border-1)',
    borderRadius: '2px',
    color: 'var(--text-secondary)',
    fontSize: '10px',
    fontFamily: 'var(--font-data)',
    cursor: 'pointer',
  },

  // Drawdown
  drawdownTrack: {
    height: '8px',
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-1)',
    borderRadius: '3px',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: '6px',
  },
  drawdownFill: {
    height: '100%',
    transition: 'width 0.4s ease',
  },
  halfMarker: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: '1px',
    background: 'rgba(255, 255, 255, 0.2)',
  },
  drawdownLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  drawdownSummary: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px',
    background: 'var(--bg-panel-2)',
    border: '1px solid var(--border-1)',
    borderRadius: '3px',
  },

  // Circuit List
  circuitList: {
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  circuitItem: {
    padding: '8px',
    background: 'var(--bg-panel-2)',
    border: '1px solid var(--border-1)',
    borderRadius: '3px',
  },
};
