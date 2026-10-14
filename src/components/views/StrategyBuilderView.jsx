import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { Cpu, ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const sentimentColor = (s) => {
  if (s === 'Bullish') return 'var(--up)';
  if (s === 'Bearish') return 'var(--down)';
  if (s === 'Momentum') return 'var(--accent)';
  return 'var(--text-muted)';
};

const sentimentTag = (s) => {
  if (s === 'Bullish') return 'tag-up';
  if (s === 'Bearish') return 'tag-down';
  if (s === 'Momentum') return 'tag-info';
  return 'tag-neutral';
};

export const StrategyBuilderView = () => {
  const { strategyTemplates, selectedSymbol, openOrderTicket } = useTrading();
  const [selected, setSelected] = useState(strategyTemplates[0].id);

  return (
    <div style={S.root}>
      {/* Header */}
      <div style={S.titleBar}>
        <Cpu size={15} style={{ color: 'var(--text-secondary)' }} />
        <span style={S.pageTitle}>Defined-Risk Strategy Pack</span>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '4px' }}>
          All strategies below have strictly capped maximum loss. No naked option gambling.
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Target:</span>
          <span className="font-data" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-white)' }}>
            {selectedSymbol.symbol} · ₹{selectedSymbol.price?.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Strategy Cards Grid */}
      <div style={S.grid}>
        {strategyTemplates.map(strat => {
          const active = selected === strat.id;
          return (
            <div
              key={strat.id}
              style={{ ...S.card, ...(active ? S.cardActive : {}) }}
              onClick={() => setSelected(strat.id)}
            >
              {/* Card header */}
              <div style={S.cardHeader}>
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: '5px' }}>
                    <span className={`tag ${sentimentTag(strat.sentiment)}`} style={{ marginRight: '5px' }}>
                      {strat.sentiment}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{strat.category}</span>
                  </div>
                  <h3 style={S.stratName}>{strat.name}</h3>
                </div>
              </div>

              {/* Description */}
              <p style={S.stratDesc}>{strat.description}</p>

              {/* Key metrics row */}
              <div style={S.metricsRow}>
                <div style={S.metricItem}>
                  <span style={S.metricLbl}>Historical Win Rate</span>
                  <span className="font-data" style={{ fontWeight: 700, fontSize: '14px', color: 'var(--up)' }}>{strat.winRate}</span>
                </div>
                <div style={S.metricDivider} />
                <div style={S.metricItem}>
                  <span style={S.metricLbl}>Risk : Reward</span>
                  <span className="font-data" style={{ fontWeight: 700, fontSize: '14px', color: 'var(--accent)' }}>{strat.riskReward}</span>
                </div>
                <div style={S.metricDivider} />
                <div style={S.metricItem}>
                  <span style={S.metricLbl}>Max Loss</span>
                  <span className="font-data" style={{ fontWeight: 600, fontSize: '11px', color: 'var(--warn)' }}>{strat.maxLoss}</span>
                </div>
              </div>

              {/* Execution legs */}
              <div style={S.legsBox}>
                <div style={S.legsTitle}>Execution Legs</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {strat.legs.map((leg, i) => (
                    <div key={i} style={S.legRow}>
                      <span className={`tag ${leg.action === 'BUY' ? 'tag-up' : 'tag-down'}`} style={{ minWidth: '36px', justifyContent: 'center' }}>
                        {leg.action}
                      </span>
                      <span className="font-data" style={{ fontSize: '11px', color: 'var(--text-primary)', fontWeight: 600 }}>
                        {leg.strikeOffset} {leg.type}
                      </span>
                      <span className="font-data" style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                        Δ {leg.delta}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <button
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '4px', padding: '8px' }}
                onClick={e => {
                  e.stopPropagation();
                  openOrderTicket({
                    symbol: `${selectedSymbol.symbol} — ${strat.name}`,
                    action: 'BUY', price: 45.00, sl: 25.00, target: 85.00,
                    lotSize: selectedSymbol.lotSize, qty: selectedSymbol.lotSize,
                    strategy: strat.name
                  });
                }}
              >
                Load into Risk-Sized Order Ticket
                <ArrowRight size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const S = {
  root: { display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' },
  titleBar: {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '9px 14px', background: 'var(--bg-panel)',
    borderBottom: '1px solid var(--border-1)', flexShrink: 0,
  },
  pageTitle: { fontSize: '13px', fontWeight: 700, color: 'var(--text-white)', flexShrink: 0 },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
    padding: '10px',
    overflow: 'auto',
    flex: 1,
  },
  card: {
    background: 'var(--bg-panel)',
    border: '1px solid var(--border-1)',
    borderRadius: '4px',
    padding: '14px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    transition: 'border-color 150ms ease',
  },
  cardActive: { borderColor: 'var(--accent)', background: 'rgba(92,141,246,0.03)' },

  cardHeader: { display: 'flex', alignItems: 'flex-start', gap: '8px' },
  stratName: { fontSize: '13.5px', fontWeight: 700, color: 'var(--text-white)' },
  stratDesc: { fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: '1.45' },

  metricsRow: {
    display: 'flex', alignItems: 'center',
    background: 'var(--bg-panel-2)', borderRadius: '4px',
    border: '1px solid var(--border-1)',
    overflow: 'hidden',
  },
  metricItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 16px', flex: 1 },
  metricLbl: { fontSize: '9px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' },
  metricDivider: { width: '1px', height: '32px', background: 'var(--border-1)' },

  legsBox: {
    background: '#161616',
    border: '1px solid var(--border-1)',
    borderRadius: '4px',
    padding: '8px 10px',
  },
  legsTitle: { fontSize: '9.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' },
  legRow: { display: 'flex', alignItems: 'center', gap: '8px' },
};
