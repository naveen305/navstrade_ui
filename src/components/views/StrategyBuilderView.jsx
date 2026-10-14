import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { Cpu, ArrowRight, ShieldCheck, Check, Info } from 'lucide-react';

export const StrategyBuilderView = () => {
  const { strategyTemplates, selectedSymbol, openOrderTicket } = useTrading();
  const [selectedId, setSelectedId] = useState(strategyTemplates[0].id);
  const [filter, setFilter] = useState('ALL');

  const activeStrat = strategyTemplates.find(s => s.id === selectedId) || strategyTemplates[0];

  const filtered = strategyTemplates.filter(s => {
    if (filter === 'ALL') return true;
    if (filter === 'BULLISH') return s.sentiment === 'Bullish';
    if (filter === 'BEARISH') return s.sentiment === 'Bearish';
    if (filter === 'NEUTRAL') return s.sentiment === 'Neutral';
    if (filter === 'MOMENTUM') return s.sentiment === 'Momentum';
    return true;
  });

  // Payoff curves for SVG diagram
  const getPayoffPoints = (stratId) => {
    if (stratId === 'strat-1') {
      // Bull Call Spread
      return [
        { x: 30, y: 110 }, { x: 120, y: 110 }, { x: 260, y: 30 }, { x: 370, y: 30 }
      ];
    } else if (stratId === 'strat-2') {
      // Bear Put Spread
      return [
        { x: 30, y: 30 }, { x: 140, y: 30 }, { x: 280, y: 110 }, { x: 370, y: 110 }
      ];
    } else if (stratId === 'strat-3') {
      // Iron Condor
      return [
        { x: 30, y: 110 }, { x: 90, y: 110 }, { x: 150, y: 40 }, { x: 250, y: 40 }, { x: 310, y: 110 }, { x: 370, y: 110 }
      ];
    } else {
      // Momentum Breakout
      return [
        { x: 30, y: 100 }, { x: 140, y: 100 }, { x: 370, y: 20 }
      ];
    }
  };

  const payoffPoints = getPayoffPoints(activeStrat.id);
  const pointsString = payoffPoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div style={S.root}>
      {/* ── Toolbar ── */}
      <div style={S.toolbar}>
        <div style={S.toolLeft}>
          <Cpu size={14} style={{ color: 'var(--text-secondary)' }} />
          <span style={S.pageTitle}>Defined-Risk Strategy Pack</span>
          <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
            Hard loss caps enforced · No naked options
          </span>
        </div>

        {/* Filter Pills */}
        <div style={S.filterGroup}>
          {[
            { id: 'ALL', label: 'All (4)' },
            { id: 'BULLISH', label: 'Bullish' },
            { id: 'BEARISH', label: 'Bearish' },
            { id: 'NEUTRAL', label: 'Range-Bound' },
            { id: 'MOMENTUM', label: 'Breakout' },
          ].map(f => (
            <button
              key={f.id}
              style={{ ...S.filterBtn, ...(filter === f.id ? S.filterBtnActive : {}) }}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div style={S.toolRight}>
          <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Underlying:</span>
          <span className="font-data" style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-white)' }}>
            {selectedSymbol.symbol} (₹{selectedSymbol.price?.toLocaleString('en-IN')})
          </span>
        </div>
      </div>

      {/* ── Main Workspace: Strategies Grid + Payoff Desk ── */}
      <div style={S.workspace}>

        {/* Left: Strategy Cards */}
        <div style={S.cardsList}>
          {filtered.map(strat => {
            const active = strat.id === selectedId;
            return (
              <div
                key={strat.id}
                style={{ ...S.card, ...(active ? S.cardActive : {}) }}
                onClick={() => setSelectedId(strat.id)}
              >
                <div style={S.cardHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="tag tag-neutral">{strat.sentiment}</span>
                    <span style={S.cardCategory}>{strat.category}</span>
                  </div>
                  {active && (
                    <span style={S.selectedBadge}>SELECTED</span>
                  )}
                </div>

                <div style={S.cardTitle}>{strat.name}</div>
                <div style={S.cardDesc}>{strat.description}</div>

                {/* Key Metrics */}
                <div style={S.metricStrip}>
                  <div style={S.metricBlock}>
                    <span style={S.metricLbl}>Win Rate</span>
                    <span className="font-data" style={S.metricVal}>{strat.winRate}</span>
                  </div>
                  <div style={S.metricSep} />
                  <div style={S.metricBlock}>
                    <span style={S.metricLbl}>R : R</span>
                    <span className="font-data" style={S.metricVal}>{strat.riskReward}</span>
                  </div>
                  <div style={S.metricSep} />
                  <div style={S.metricBlock}>
                    <span style={S.metricLbl}>Risk Profile</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{strat.maxLoss}</span>
                  </div>
                </div>

                {/* Execution Legs */}
                <div style={S.legsRow}>
                  {strat.legs.map((leg, i) => (
                    <span key={i} style={S.legPill}>
                      <span style={{ color: leg.action === 'BUY' ? 'var(--up)' : 'var(--down)', fontWeight: 700 }}>
                        {leg.action}
                      </span>
                      &nbsp;{leg.strikeOffset} {leg.type}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Interactive Payoff Diagram & Deployment Panel */}
        <div style={S.payoffPanel}>
          <div style={S.payoffHdr}>
            <span style={S.payoffTitle}>STRATEGY PAYOFF PROFILE & RISK SIMULATION</span>
            <span className="tag tag-info">{activeStrat.sentiment}</span>
          </div>

          <div style={S.payoffBody}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-white)' }}>{activeStrat.name}</h3>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{activeStrat.category}</p>
              </div>

              <div style={S.riskSizingPill}>
                <ShieldCheck size={12} style={{ color: 'var(--up)' }} />
                <span>Auto-Sized to 1.5% Cap</span>
              </div>
            </div>

            {/* Payoff Graph */}
            <div style={S.chartBox}>
              <div style={S.chartTitleRow}>
                <span style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>PAYOFF AT EXPIRY (P&L CURVE)</span>
                <span style={{ fontSize: '9.5px', color: 'var(--text-secondary)' }}>Breakeven Zone Defined</span>
              </div>

              <svg width="100%" height="140" viewBox="0 0 400 140" preserveAspectRatio="none">
                {/* Zero line (Breakeven) */}
                <line x1="0" y1="70" x2="400" y2="70" stroke="#2a3142" strokeWidth="1" strokeDasharray="3 3" />
                <text x="8" y="66" fill="#64748b" fontSize="9" fontFamily="JetBrains Mono">₹0 (Breakeven)</text>

                {/* Profit Zone Shade */}
                <rect x="0" y="0" width="400" height="70" fill="rgba(16, 185, 129, 0.03)" />
                {/* Loss Zone Shade */}
                <rect x="0" y="70" width="400" height="70" fill="rgba(244, 63, 94, 0.03)" />

                {/* Payoff Curve */}
                <polyline
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  points={pointsString}
                />

                {/* Current Spot Indicator */}
                <line x1="200" y1="10" x2="200" y2="130" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
                <text x="204" y="22" fill="#f59e0b" fontSize="8.5" fontFamily="JetBrains Mono">Current Spot</text>
              </svg>
            </div>

            {/* Strategic Summary Grid */}
            <div style={S.payoffGrid}>
              <div style={S.payoffCard}>
                <span style={S.payoffCardLbl}>MAX PROFIT</span>
                <span className="font-data" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--up)' }}>
                  {activeStrat.maxProfit}
                </span>
              </div>
              <div style={S.payoffCard}>
                <span style={S.payoffCardLbl}>MAX RISK</span>
                <span className="font-data" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--down)' }}>
                  {activeStrat.maxLoss}
                </span>
              </div>
              <div style={S.payoffCard}>
                <span style={S.payoffCardLbl}>PROBABILITY OF PROFIT</span>
                <span className="font-data" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-white)' }}>
                  {activeStrat.winRate}
                </span>
              </div>
              <div style={S.payoffCard}>
                <span style={S.payoffCardLbl}>RISK TO REWARD</span>
                <span className="font-data" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-white)' }}>
                  {activeStrat.riskReward}
                </span>
              </div>
            </div>

            {/* Execution Legs Detail */}
            <div style={S.legsDetailBox}>
              <div style={S.legsDetailHdr}>ORDER BASKET LEGS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {activeStrat.legs.map((leg, i) => (
                  <div key={i} style={S.legDetailRow}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className={leg.action === 'BUY' ? 'tag tag-up' : 'tag tag-down'}>
                        {leg.action}
                      </span>
                      <span className="font-data" style={{ fontSize: '11px', color: 'var(--text-white)', fontWeight: 600 }}>
                        {selectedSymbol.symbol} {leg.strikeOffset} {leg.type}
                      </span>
                    </div>
                    <span className="font-data" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      Delta {leg.delta}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Clean, Refined Deployment Action Button */}
            <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
              <button
                className="btn btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '7px',
                  fontWeight: 600,
                  fontSize: '12px',
                  borderRadius: '3px',
                }}
                onClick={() => {
                  openOrderTicket({
                    symbol: `${selectedSymbol.symbol} — ${activeStrat.name}`,
                    action: 'BUY',
                    price: 45.00,
                    sl: 25.00,
                    target: 85.00,
                    lotSize: selectedSymbol.lotSize,
                    qty: selectedSymbol.lotSize,
                    strategy: activeStrat.name
                  });
                }}
              >
                Configure & Deploy Strategy
                <ArrowRight size={13} style={{ marginLeft: 4 }} />
              </button>
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
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    background: 'var(--bg-base)',
    padding: '2px',
    borderRadius: '3px',
  },
  filterBtn: {
    padding: '2px 8px',
    fontSize: '10.5px',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    borderRadius: '2px',
  },
  filterBtnActive: {
    background: 'var(--bg-panel)',
    color: 'var(--text-white)',
    fontWeight: 600,
  },
  toolRight: { display: 'flex', alignItems: 'center', gap: '6px' },

  // Workspace
  workspace: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
    gap: '1px',
    background: 'var(--border-1)',
  },
  cardsList: {
    flex: 1,
    overflowY: 'auto',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    background: 'var(--bg-base)',
  },
  card: {
    background: 'var(--bg-panel)',
    border: '1px solid var(--border-1)',
    borderRadius: '3px',
    padding: '10px 12px',
    cursor: 'pointer',
    transition: 'all 120ms ease',
  },
  cardActive: {
    borderColor: '#3b82f6',
    background: 'var(--bg-panel-2)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '4px',
  },
  cardCategory: { fontSize: '9.5px', color: 'var(--text-muted)' },
  selectedBadge: {
    fontSize: '8.5px',
    fontWeight: 700,
    color: '#60a5fa',
    letterSpacing: '0.04em',
  },
  cardTitle: { fontSize: '12.5px', fontWeight: 700, color: 'var(--text-white)', marginBottom: '3px' },
  cardDesc: { fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '8px' },
  metricStrip: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '6px 8px',
    background: 'var(--bg-base)',
    border: '1px solid var(--border-1)',
    borderRadius: '3px',
    marginBottom: '8px',
  },
  metricBlock: { display: 'flex', flexDirection: 'column' },
  metricLbl: { fontSize: '8.5px', color: 'var(--text-muted)', textTransform: 'uppercase' },
  metricVal: { fontSize: '12px', fontWeight: 600, color: 'var(--text-white)' },
  metricSep: { width: 1, height: 16, background: 'var(--border-1)' },
  legsRow: { display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' },
  legPill: {
    fontSize: '9.5px',
    color: 'var(--text-secondary)',
    background: 'var(--bg-base)',
    padding: '2px 6px',
    borderRadius: '2px',
    border: '1px solid var(--border-1)',
  },

  // Payoff Panel
  payoffPanel: {
    width: '440px',
    background: 'var(--bg-panel)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    flexShrink: 0,
  },
  payoffHdr: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '6px 12px',
    background: 'var(--bg-panel-2)',
    borderBottom: '1px solid var(--border-1)',
    height: '32px',
  },
  payoffTitle: {
    fontSize: '9.5px',
    fontWeight: 700,
    color: 'var(--text-secondary)',
    letterSpacing: '0.05em',
  },
  payoffBody: {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflowY: 'auto',
    gap: '10px',
  },
  riskSizingPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '3px 7px',
    background: 'rgba(16, 185, 129, 0.08)',
    border: '1px solid rgba(16, 185, 129, 0.25)',
    borderRadius: '3px',
    fontSize: '10px',
    color: 'var(--up)',
    fontWeight: 600,
  },
  chartBox: {
    background: 'var(--bg-base)',
    border: '1px solid var(--border-1)',
    borderRadius: '3px',
    padding: '8px',
  },
  chartTitleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '6px',
  },
  payoffGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '6px',
  },
  payoffCard: {
    padding: '6px 8px',
    background: 'var(--bg-panel-2)',
    border: '1px solid var(--border-1)',
    borderRadius: '3px',
    display: 'flex',
    flexDirection: 'column',
  },
  payoffCardLbl: {
    fontSize: '8.5px',
    color: 'var(--text-muted)',
    fontWeight: 600,
    letterSpacing: '0.04em',
    marginBottom: '2px',
  },
  legsDetailBox: {
    padding: '8px',
    background: 'var(--bg-base)',
    border: '1px solid var(--border-1)',
    borderRadius: '3px',
  },
  legsDetailHdr: {
    fontSize: '8.5px',
    color: 'var(--text-muted)',
    fontWeight: 700,
    letterSpacing: '0.05em',
    marginBottom: '6px',
  },
  legDetailRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '3px 0',
  },
};
