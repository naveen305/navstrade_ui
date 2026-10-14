import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { Cpu, CheckCircle2, TrendingUp, TrendingDown, ShieldCheck, ArrowRight } from 'lucide-react';

export const StrategyBuilderView = () => {
  const { strategyTemplates, selectedSymbol, openOrderTicket } = useTrading();
  const [selectedStrategy, setSelectedStrategy] = useState(strategyTemplates[0]);

  return (
    <div className="strategy-builder-container">
      {/* Overview Header */}
      <div className="terminal-card strat-intro-card">
        <div className="strat-intro-left">
          <div className="strat-icon-box">
            <Cpu size={26} className="text-cyan" />
          </div>
          <div>
            <h2 className="strat-main-title">INSTITUTIONAL DEFINED-RISK STRATEGY PACK</h2>
            <p className="strat-sub-text">
              Eliminate naked option gambling. All institutional strategies below feature <strong>strictly capped maximum loss</strong>,
              defined break-evens, and mathematical edge over retail random guesswork.
            </p>
          </div>
        </div>
        <div className="strat-spot-badge">
          <span className="text-muted">Target Asset:</span>
          <span className="mono font-bold text-cyan">{selectedSymbol.symbol} (₹{selectedSymbol.price})</span>
        </div>
      </div>

      {/* Strategies Grid */}
      <div className="strategies-grid">
        {strategyTemplates.map((strat) => {
          const isSelected = selectedStrategy.id === strat.id;
          return (
            <div
              key={strat.id}
              className={`terminal-card strategy-card ${isSelected ? 'strategy-card-selected' : ''}`}
              onClick={() => setSelectedStrategy(strat)}
            >
              <div className="terminal-card-header strat-card-header">
                <div>
                  <span className="badge badge-purple">{strat.category}</span>
                  <h3 className="strat-name">{strat.name}</h3>
                </div>
                <span className={`badge ${strat.sentiment === 'Bullish' ? 'badge-green' : strat.sentiment === 'Bearish' ? 'badge-red' : 'badge-cyan'}`}>
                  {strat.sentiment}
                </span>
              </div>

              <div className="terminal-card-body strat-card-body">
                <p className="strat-desc">{strat.description}</p>

                {/* Key Metrics */}
                <div className="strat-metrics-row">
                  <div className="strat-metric">
                    <span className="sm-label">HISTORICAL WIN RATE</span>
                    <span className="sm-val mono text-profit font-bold">{strat.winRate}</span>
                  </div>
                  <div className="strat-metric">
                    <span className="sm-label">RISK : REWARD</span>
                    <span className="sm-val mono text-cyan font-bold">{strat.riskReward}</span>
                  </div>
                  <div className="strat-metric">
                    <span className="sm-label">MAX RISK PROFILE</span>
                    <span className="sm-val mono text-amber font-bold">{strat.maxLoss}</span>
                  </div>
                </div>

                {/* Legs Breakdown */}
                <div className="legs-container">
                  <span className="legs-title">EXECUTION LEGS:</span>
                  <div className="legs-list">
                    {strat.legs.map((leg, i) => (
                      <div key={i} className="leg-item">
                        <span className={`badge ${leg.action === 'BUY' ? 'badge-green' : 'badge-red'}`}>
                          {leg.action}
                        </span>
                        <span className="mono font-bold">{leg.strikeOffset} {leg.type}</span>
                        <span className="mono text-muted text-xs">Delta: {leg.delta}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action button */}
                <button
                  className="btn btn-primary deploy-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    openOrderTicket({
                      symbol: `${selectedSymbol.symbol} ${strat.name}`,
                      action: 'BUY',
                      price: 45.00,
                      sl: 25.00,
                      target: 85.00,
                      lotSize: selectedSymbol.lotSize,
                      qty: selectedSymbol.lotSize,
                      strategy: strat.name
                    });
                  }}
                >
                  <span>LOAD INTO ORDER SIZER</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .strategy-builder-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 12px;
          height: calc(100vh - 56px);
          overflow-y: auto;
        }

        .strat-intro-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 18px;
          gap: 16px;
        }

        .strat-intro-left {
          display: flex;
          align-items: center;
          gap: 14px;
          flex: 1;
        }

        .strat-icon-box {
          width: 44px;
          height: 44px;
          min-width: 44px;
          border-radius: 8px;
          background: var(--strategy-purple-bg);
          border: 1px solid rgba(168, 85, 247, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .strat-main-title {
          font-size: 13.5px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: 0.05em;
          margin-bottom: 3px;
        }

        .strat-sub-text {
          font-size: 11px;
          color: var(--text-secondary);
          max-width: 780px;
          line-height: 1.4;
        }

        .strat-spot-badge {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
          font-size: 11px;
          white-space: nowrap;
          background: var(--bg-surface-2);
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid var(--border-subtle);
        }

        .strategies-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .strategy-card {
          cursor: pointer;
          transition: all var(--trans-fast);
        }

        .strategy-card:hover {
          border-color: var(--border-bright);
        }

        .strategy-card-selected {
          border-color: var(--neon-cyan) !important;
          box-shadow: 0 0 16px rgba(0, 240, 255, 0.15);
        }

        .strat-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 12px 14px;
        }

        .strat-name {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-highlight);
          margin-top: 6px;
        }

        .strat-card-body {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .strat-desc {
          font-size: 11.5px;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .strat-metrics-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          background: var(--bg-surface-2);
          padding: 8px 10px;
          border-radius: 6px;
          border: 1px solid var(--border-subtle);
        }

        .strat-metric {
          display: flex;
          flex-direction: column;
        }

        .sm-label {
          font-size: 8.5px;
          font-weight: 700;
          color: var(--text-muted);
        }

        .sm-val {
          font-size: 12px;
        }

        .legs-container {
          background: rgba(0, 0, 0, 0.25);
          border-radius: 6px;
          padding: 8px 10px;
          border: 1px solid var(--border-subtle);
        }

        .legs-title {
          font-size: 9.5px;
          font-weight: 800;
          color: var(--text-muted);
          display: block;
          margin-bottom: 6px;
        }

        .legs-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .leg-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
        }

        .deploy-btn {
          width: 100%;
          padding: 9px;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
};
