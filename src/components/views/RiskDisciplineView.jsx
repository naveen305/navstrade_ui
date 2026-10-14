import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { ShieldCheck, AlertTriangle, CheckCircle2, Lock, Sliders, Activity, Bell, Info } from 'lucide-react';
import { RiskGauge } from '../common/RiskGauge';
import { Card } from '../common/Card';

export const RiskDisciplineView = () => {
  const {
    riskRules,
    updateRiskSettings,
    totalNetPnl,
    accountCapital,
    showToast,
    triggerKillSwitch,
    clearRiskBanner
  } = useTrading();

  const [form, setForm] = useState({
    maxDailyLoss: riskRules.maxDailyLoss || 5000,
    maxCapitalRiskPct: riskRules.maxCapitalRiskPct || 1.5,
    maxOpenTrades: riskRules.maxOpenTrades || 3,
    autoTrailingSl: riskRules.autoTrailingSl ?? true,
    noSizeUpAfterWins: riskRules.noSizeUpAfterWins ?? true,
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
      noSizeUpAfterWins: Boolean(form.noSizeUpAfterWins),
    });
    setSaved(true);
    showToast('Risk parameters saved & verified at router level', 'success');
    setTimeout(() => setSaved(false), 2000);
  };

  const circuitBreakers = [
    {
      id: 'cooldown',
      title: 'Anti-Revenge Cooldown (20 min)',
      desc: 'After 2 consecutive stop-outs, order placement is paused for 20 minutes to prevent impulsive re-entry.',
      active: true,
      category: 'Psychological Guard'
    },
    {
      id: 'mandatory_sl',
      title: 'Mandatory Stop-Loss Enforcement',
      desc: 'No order can reach the Upstox API without an explicit hard stop-loss price defined.',
      active: true,
      category: 'Capital Protection'
    },
    {
      id: 'profit_lock',
      title: 'Dynamic Profit Locking (50% of peak ROI)',
      desc: 'Once a position hits 20% ROI, trailing stop automatically moves to lock in 50% of peak unrealized profit.',
      active: true,
      category: 'Execution Discipline'
    },
    {
      id: 'auto_squareoff',
      title: 'Auto Square-Off at 15:15 IST',
      desc: 'Closes all intraday option buyer positions 15 minutes before cash market close to eliminate overnight gap risk.',
      active: true,
      category: 'Terminal Timing'
    },
    {
      id: 'oversizing',
      title: 'Over-Sizing Protection Guard',
      desc: `Orders requiring risk greater than ${form.maxCapitalRiskPct}% of capital are automatically downsized or rejected.`,
      active: true,
      category: 'Position Sizing'
    },
    {
      id: 'no_sizeup',
      title: 'No Size-Up After Winning Streaks',
      desc: 'Prohibits scaling up lot sizes following a winning streak. Maintains constant risk-of-ruin posture.',
      active: form.noSizeUpAfterWins,
      category: 'Behavioral Bias'
    },
  ];

  return (
    <div style={S.root}>
      {/* ── Sub-header Toolbar ── */}
      <div style={S.toolbar}>
        <div style={S.toolLeft}>
          <ShieldCheck size={16} style={{ color: riskRules.killSwitchActive ? 'var(--loss)' : 'var(--profit)' }} />
          <div>
            <span style={S.pageTitle}>Institutional Risk & Discipline Engine</span>
            <span style={S.pageSubtitle}>
              SEBI compliance aligned · Upstox pre-trade validation · Zero naked exposure
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              padding: '3px 8px',
              borderRadius: '3px',
              backgroundColor: riskRules.killSwitchActive ? 'var(--loss-bg)' : 'var(--profit-bg)',
              color: riskRules.killSwitchActive ? 'var(--loss)' : 'var(--profit)',
              border: '1px solid var(--border-light)'
            }}
          >
            {riskRules.killSwitchActive ? 'KILL-SWITCH TRIGGERED (ORDER ENTRY BLOCKED)' : 'RISK GATES ARMED & HEALTHY'}
          </span>

          <button
            className="btn btn-outline"
            style={{ fontSize: '11px', padding: '3px 8px', color: 'var(--text-secondary)' }}
            onClick={() => {
              if (riskRules.killSwitchActive) {
                clearRiskBanner();
              } else {
                triggerKillSwitch('Daily loss limit simulated breach (₹5,000 threshold reached)');
              }
            }}
          >
            {riskRules.killSwitchActive ? 'Reset Simulated Limit' : 'Simulate Limit Hit'}
          </button>
        </div>
      </div>

      {/* ── Main Workspace ── */}
      <div style={S.workspace}>
        {/* Left Column: Editable Risk Limit Controls */}
        <div style={S.leftCol}>
          <div style={S.cardBox}>
            <div style={S.cardHeader}>
              <div>
                <span style={S.cardTitle}>EXECUTION RISK GATES</span>
                <span style={S.cardSub}>Client-side hard constraints applied before API dispatch</span>
              </div>
            </div>

            <form onSubmit={handleSave} style={S.formBody}>
              {/* Daily Loss Limit */}
              <div style={S.fieldGroup}>
                <div style={S.fieldHeader}>
                  <label style={S.label}>Daily Loss Kill Switch Limit</label>
                  <span className="font-num" style={{ fontSize: '12px', color: 'var(--loss)', fontWeight: 600 }}>
                    -₹{Number(form.maxDailyLoss).toLocaleString('en-IN')}
                  </span>
                </div>
                <div style={S.fieldDesc}>
                  If today's losses reach this ceiling, the engine cancels pending orders, squares off open positions, and locks the terminal.
                </div>
                <div style={S.inputWrap}>
                  <span style={S.inputPrefix}>₹</span>
                  <input
                    type="number"
                    className="form-input font-num"
                    style={{ paddingLeft: '24px' }}
                    value={form.maxDailyLoss}
                    onChange={e => setForm(f => ({ ...f, maxDailyLoss: e.target.value }))}
                    min="1000"
                    step="500"
                    required
                  />
                </div>
                <div style={S.presetsRow}>
                  {[3000, 5000, 8000, 10000].map(val => (
                    <button
                      key={val}
                      type="button"
                      style={{
                        ...S.presetBtn,
                        ...(Number(form.maxDailyLoss) === val ? S.presetBtnActive : {})
                      }}
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
                  <label style={S.label}>Max Risk Per Trade (% of Capital)</label>
                  <span className="font-num" style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 600 }}>
                    {form.maxCapitalRiskPct}% (₹{(accountCapital * (form.maxCapitalRiskPct / 100)).toLocaleString('en-IN')})
                  </span>
                </div>
                <div style={S.fieldDesc}>
                  Position sizing engine dynamically restricts lot count so worst-case stop-loss hit cannot exceed this threshold.
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="range"
                    min="0.5"
                    max="3.0"
                    step="0.25"
                    value={form.maxCapitalRiskPct}
                    onChange={e => setForm(f => ({ ...f, maxCapitalRiskPct: Number(e.target.value) }))}
                    style={{ flex: 1, accentColor: 'var(--navy)' }}
                  />
                  <span className="font-num" style={{ fontSize: '12px', minWidth: '36px', textAlign: 'right', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {form.maxCapitalRiskPct}%
                  </span>
                </div>
              </div>

              {/* Max Open Positions */}
              <div style={S.fieldGroup}>
                <div style={S.fieldHeader}>
                  <label style={S.label}>Max Open Concurrent Positions</label>
                  <span className="font-num" style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 600 }}>
                    {form.maxOpenTrades} positions cap
                  </span>
                </div>
                <div style={S.fieldDesc}>
                  Prevents over-trading and split focus. Rejects new order submissions if current positions reach capacity.
                </div>
                <input
                  type="number"
                  className="form-input font-num"
                  value={form.maxOpenTrades}
                  onChange={e => setForm(f => ({ ...f, maxOpenTrades: Number(e.target.value) }))}
                  min="1"
                  max="6"
                  required
                />
              </div>

              {/* Auto Trailing SL Switch */}
              <div style={S.fieldGroup}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <label style={{ ...S.label, marginBottom: 2 }}>Auto Trailing Stop-Loss Engine</label>
                    <div style={{ ...S.fieldDesc, marginBottom: 0 }}>
                      Automatically trails stop-loss in favorable 5-point increments.
                    </div>
                  </div>
                  <label style={S.toggleSwitch}>
                    <input
                      type="checkbox"
                      checked={form.autoTrailingSl}
                      onChange={e => setForm(f => ({ ...f, autoTrailingSl: e.target.checked }))}
                    />
                    <span style={S.sliderRound}></span>
                  </label>
                </div>
              </div>

              {/* No Size-Up After Wins Switch */}
              <div style={S.fieldGroup}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <label style={{ ...S.label, marginBottom: 2 }}>No Size-Up After Winning Trades</label>
                    <div style={{ ...S.fieldDesc, marginBottom: 0 }}>
                      Enforces flat position sizing to prevent euphoria-driven risk spikes.
                    </div>
                  </div>
                  <label style={S.toggleSwitch}>
                    <input
                      type="checkbox"
                      checked={form.noSizeUpAfterWins}
                      onChange={e => setForm(f => ({ ...f, noSizeUpAfterWins: e.target.checked }))}
                    />
                    <span style={S.sliderRound}></span>
                  </label>
                </div>
              </div>

              {/* Save & Arm Button */}
              <div style={{ paddingTop: 6 }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '8px 12px',
                    fontWeight: 600,
                    fontSize: '12.5px',
                    borderRadius: 'var(--radius)'
                  }}
                >
                  {saved ? '✓ Parameters Saved & Router Armed' : 'Save & Arm Risk Parameters'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Drawdown Progress & Circuit Breaker Checklist */}
        <div style={S.rightCol}>
          {/* Daily Drawdown Meter */}
          <div style={S.cardBox}>
            <div style={S.cardHeader}>
              <div>
                <span style={S.cardTitle}>DAILY DRAWDOWN CONSUMPTION</span>
                <span style={S.cardSub}>Real-time monitoring against hard kill-switch trigger</span>
              </div>
              <span className="font-num" style={{ fontSize: '12px', fontWeight: 600, color: drawnPct >= 80 ? 'var(--loss)' : 'var(--text-secondary)' }}>
                {drawnPct.toFixed(1)}% Consumed
              </span>
            </div>

            <div style={{ padding: '14px 16px' }}>
              <RiskGauge
                currentLoss={currentLoss}
                maxDailyLoss={Number(form.maxDailyLoss)}
                showLabels={true}
              />

              <div style={S.drawdownStatsRow}>
                <div style={S.drawdownStatItem}>
                  <span style={S.drawdownStatLabel}>Current Realized Loss</span>
                  <span className="font-num" style={{ fontSize: '13px', fontWeight: 600, color: currentLoss > 0 ? 'var(--loss)' : 'var(--profit)' }}>
                    ₹{currentLoss.toFixed(2)}
                  </span>
                </div>

                <div style={S.drawdownStatItem}>
                  <span style={S.drawdownStatLabel}>Remaining Risk Room</span>
                  <span className="font-num" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    ₹{Math.max(0, Number(form.maxDailyLoss) - currentLoss).toLocaleString('en-IN')}
                  </span>
                </div>

                <div style={S.drawdownStatItem}>
                  <span style={S.drawdownStatLabel}>Kill Switch Trigger</span>
                  <span className="font-num" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--loss)' }}>
                    -₹{Number(form.maxDailyLoss).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Checklist of 6 Circuit Breakers */}
          <div style={{ ...S.cardBox, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={S.cardHeader}>
              <div>
                <span style={S.cardTitle}>SYSTEMATIC CIRCUIT BREAKERS (6 ARMED)</span>
                <span style={S.cardSub}>Algorithmic barriers designed to eliminate emotional decision-making</span>
              </div>
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: 600,
                  padding: '2px 7px',
                  borderRadius: '3px',
                  backgroundColor: 'var(--profit-bg)',
                  color: 'var(--profit)',
                  border: '1px solid var(--border-light)'
                }}
              >
                100% COMPLIANT
              </span>
            </div>

            <div style={S.circuitList}>
              {circuitBreakers.map((cb) => (
                <div key={cb.id} style={S.circuitItem}>
                  <div style={S.circuitItemTop}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <CheckCircle2 size={14} style={{ color: cb.active ? 'var(--profit)' : 'var(--text-muted)' }} />
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {cb.title}
                      </span>
                    </div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      {cb.category}
                    </span>
                  </div>
                  <div style={S.circuitDesc}>{cb.desc}</div>
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
    backgroundColor: 'var(--bg-main)',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 16px',
    backgroundColor: 'var(--bg-surface)',
    borderBottom: '1px solid var(--border-main)',
    flexShrink: 0,
  },
  toolLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  pageTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    display: 'block',
  },
  pageSubtitle: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    display: 'block',
  },
  workspace: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
    padding: '12px 16px',
    gap: 14,
  },
  leftCol: {
    width: '45%',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  rightCol: {
    width: '55%',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    overflowY: 'auto',
  },
  cardBox: {
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-main)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 14px',
    borderBottom: '1px solid var(--border-main)',
    backgroundColor: 'var(--bg-surface)',
  },
  cardTitle: {
    fontSize: '11.5px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: 'var(--text-primary)',
    display: 'block',
  },
  cardSub: {
    fontSize: '10.5px',
    color: 'var(--text-muted)',
    display: 'block',
  },
  formBody: {
    padding: '14px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
  },
  fieldHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  fieldDesc: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    lineHeight: 1.4,
    marginBottom: 4,
  },
  inputWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputPrefix: {
    position: 'absolute',
    left: '10px',
    fontSize: '12px',
    color: 'var(--text-muted)',
    pointerEvents: 'none',
  },
  presetsRow: {
    display: 'flex',
    gap: 6,
    marginTop: 4,
  },
  presetBtn: {
    flex: 1,
    padding: '4px 6px',
    fontSize: '10.5px',
    border: '1px solid var(--border-main)',
    borderRadius: 'var(--radius)',
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 120ms ease',
  },
  presetBtnActive: {
    borderColor: 'var(--navy)',
    color: 'var(--navy)',
    fontWeight: 600,
  },
  drawdownStatsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 10,
    marginTop: 14,
    paddingTop: 12,
    borderTop: '1px solid var(--border-light)',
  },
  drawdownStatItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  drawdownStatLabel: {
    fontSize: '10px',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    marginBottom: 2,
  },
  circuitList: {
    padding: '10px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    overflowY: 'auto',
  },
  circuitItem: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius)',
    padding: '9px 12px',
  },
  circuitItemTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  circuitDesc: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    lineHeight: 1.4,
    paddingLeft: 21,
  },
  toggleSwitch: {
    position: 'relative',
    display: 'inline-block',
    width: '32px',
    height: '18px',
  },
  sliderRound: {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'var(--border-main)',
    borderRadius: '18px',
    transition: '0.2s',
  },
};
