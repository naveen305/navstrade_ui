import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import {
  TrendingUp,
  TrendingDown,
  Crosshair,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Maximize2,
  Info,
  CheckCircle2,
  XCircle,
  Sliders,
  DollarSign
} from 'lucide-react';

export const TerminalView = () => {
  const {
    watchlist,
    selectedSymbol,
    setSelectedSymbol,
    positions,
    closePosition,
    openOrderTicket,
    totalUnrealizedPnl
  } = useTrading();

  const [timeframe, setTimeframe] = useState('5m');
  const [activeBottomTab, setActiveBottomTab] = useState('positions');

  // Calculate Net Portfolio Greeks
  const netDelta = positions.reduce((acc, p) => acc + (p.delta || 0) * (p.qty > 0 ? 1 : -1), 0).toFixed(2);
  const netTheta = positions.reduce((acc, p) => acc + (p.theta || 0), 0).toFixed(1);
  const netVega = positions.reduce((acc, p) => acc + (p.vega || 0), 0).toFixed(1);

  return (
    <div className="terminal-view-container">
      {/* 1. Watchlist Ticker Ribbon */}
      <div className="ticker-ribbon">
        {watchlist.map(item => {
          const isSelected = selectedSymbol.symbol === item.symbol;
          const isPositive = item.change >= 0;
          return (
            <div
              key={item.symbol}
              className={`ticker-card ${isSelected ? 'ticker-selected' : ''} ${item.tickDir ? `flash-${item.tickDir}` : ''}`}
              onClick={() => setSelectedSymbol(item)}
            >
              <div className="ticker-top">
                <span className="ticker-symbol">{item.symbol}</span>
                <span className="ticker-type">{item.type}</span>
              </div>
              <div className="ticker-bottom">
                <span className="ticker-price mono">₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                <span className={`ticker-change mono ${isPositive ? 'text-profit' : 'text-loss'}`}>
                  {isPositive ? '+' : ''}{item.changePct}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Main Dual-Panel Workspace */}
      <div className="main-workspace-grid">
        {/* Left: Professional Chart & Indicators */}
        <div className="terminal-card chart-panel">
          <div className="terminal-card-header chart-header">
            <div className="chart-title-group">
              <span className="chart-symbol-badge">{selectedSymbol.symbol}</span>
              <span className="chart-spot-price mono">
                ₹{selectedSymbol.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span className={`chart-spot-change mono ${selectedSymbol.change >= 0 ? 'text-profit' : 'text-loss'}`}>
                ({selectedSymbol.change >= 0 ? '+' : ''}{selectedSymbol.change} | {selectedSymbol.changePct}%)
              </span>
            </div>

            <div className="chart-controls">
              <div className="timeframe-selector">
                {['1m', '3m', '5m', '15m', '1D'].map(tf => (
                  <button
                    key={tf}
                    className={`tf-btn ${timeframe === tf ? 'tf-active' : ''}`}
                    onClick={() => setTimeframe(tf)}
                  >
                    {tf}
                  </button>
                ))}
              </div>
              <div className="indicator-pill">VWAP: ₹{selectedSymbol.vwap}</div>
              <div className="indicator-pill text-cyan">PCR: {selectedSymbol.pcr}</div>
              <div className="indicator-pill text-amber">Max Pain: {selectedSymbol.maxPain}</div>
            </div>
          </div>

          {/* Institutional Candlestick Canvas Simulation */}
          <div className="chart-canvas-area">
            <svg className="chart-svg" viewBox="0 0 760 300" preserveAspectRatio="none">
              <defs>
                <linearGradient id="bullGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="vwapLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#00f0ff" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="60" x2="760" y2="60" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              <line x1="0" y1="120" x2="760" y2="120" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              <line x1="0" y1="180" x2="760" y2="180" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              <line x1="0" y1="240" x2="760" y2="240" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

              {/* Volume Profile Bars at Bottom */}
              {[
                { x: 40, h: 45, up: true }, { x: 75, h: 30, up: false }, { x: 110, h: 55, up: true },
                { x: 145, h: 70, up: true }, { x: 180, h: 40, up: false }, { x: 215, h: 60, up: true },
                { x: 250, h: 85, up: true }, { x: 285, h: 50, up: false }, { x: 320, h: 65, up: true },
                { x: 355, h: 90, up: true }, { x: 390, h: 75, up: true }, { x: 425, h: 40, up: false },
                { x: 460, h: 60, up: true }, { x: 495, h: 80, up: true }, { x: 530, h: 55, up: false },
                { x: 565, h: 95, up: true }, { x: 600, h: 110, up: true }, { x: 635, h: 85, up: true },
                { x: 670, h: 70, up: false }, { x: 705, h: 105, up: true }
              ].map((v, i) => (
                <rect
                  key={i}
                  x={v.x - 10}
                  y={300 - v.h}
                  width="20"
                  height={v.h}
                  fill={v.up ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'}
                  rx="2"
                />
              ))}

              {/* Simulated Candlesticks */}
              {[
                { x: 40, o: 190, c: 175, h: 165, l: 200, up: true },
                { x: 75, o: 175, c: 185, h: 170, l: 195, up: false },
                { x: 110, o: 185, c: 160, h: 155, l: 190, up: true },
                { x: 145, o: 160, c: 145, h: 140, l: 170, up: true },
                { x: 180, o: 145, c: 155, h: 140, l: 165, up: false },
                { x: 215, o: 155, c: 135, h: 130, l: 160, up: true },
                { x: 250, o: 135, c: 120, h: 110, l: 145, up: true },
                { x: 285, o: 120, c: 130, h: 115, l: 140, up: false },
                { x: 320, o: 130, c: 110, h: 105, l: 135, up: true },
                { x: 355, o: 110, c: 95, h: 90, l: 120, up: true },
                { x: 390, o: 95, c: 90, h: 80, l: 105, up: true },
                { x: 425, o: 90, c: 105, h: 85, l: 115, up: false },
                { x: 460, o: 105, c: 85, h: 80, l: 110, up: true },
                { x: 495, o: 85, c: 75, h: 70, l: 95, up: true },
                { x: 530, o: 75, c: 85, h: 70, l: 95, up: false },
                { x: 565, o: 85, c: 60, h: 55, l: 90, up: true },
                { x: 600, o: 60, c: 50, h: 45, l: 70, up: true },
                { x: 635, o: 50, c: 45, h: 40, l: 60, up: true },
                { x: 670, o: 45, c: 55, h: 40, l: 65, up: false },
                { x: 705, o: 55, c: 38, h: 32, l: 65, up: true }
              ].map((c, idx) => (
                <g key={idx}>
                  {/* High/Low Wick */}
                  <line
                    x1={c.x}
                    y1={c.h}
                    x2={c.x}
                    y2={c.l}
                    stroke={c.up ? '#10b981' : '#f43f5e'}
                    strokeWidth="1.5"
                  />
                  {/* Real Body */}
                  <rect
                    x={c.x - 7}
                    y={Math.min(c.o, c.c)}
                    width="14"
                    height={Math.max(4, Math.abs(c.o - c.c))}
                    fill={c.up ? '#10b981' : '#f43f5e'}
                    rx="1.5"
                  />
                </g>
              ))}

              {/* Institutional VWAP Curved Overlay */}
              <path
                d="M 40,185 Q 200,150 360,115 T 705,58"
                fill="none"
                stroke="url(#vwapLine)"
                strokeWidth="2"
                strokeDasharray="5 3"
              />

              {/* Dynamic Resistance Target Line */}
              <line x1="0" y1="35" x2="760" y2="35" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />
              <text x="15" y="30" fill="#f59e0b" fontSize="10" fontFamily="JetBrains Mono">
                R1 / Target Resistance (25,200)
              </text>
            </svg>

            {/* Price Cursor Floating Tag */}
            <div className="chart-floating-price mono">
              ₹{selectedSymbol.price}
            </div>
          </div>
        </div>

        {/* Right: Institutional Risk Radar & Fast Order Launcher */}
        <div className="right-tools-col">
          {/* Greeks & Risk Radar */}
          <div className="terminal-card risk-radar-card">
            <div className="terminal-card-header">
              <span className="terminal-card-title">
                <Crosshair size={14} className="text-cyan" />
                PORTFOLIO GREEKS RADAR
              </span>
              <span className="badge badge-cyan">LIVE SENSITIVITY</span>
            </div>
            <div className="terminal-card-body greeks-grid">
              <div className="greek-box">
                <span className="greek-label">NET DELTA (Δ)</span>
                <span className={`greek-value mono ${Number(netDelta) >= 0 ? 'text-profit' : 'text-loss'}`}>
                  {netDelta}
                </span>
                <span className="greek-sub">Directional bias</span>
              </div>

              <div className="greek-box">
                <span className="greek-label">NET THETA (Θ)</span>
                <span className="greek-value mono text-amber">
                  ₹{netTheta}/day
                </span>
                <span className="greek-sub">Daily time decay</span>
              </div>

              <div className="greek-box">
                <span className="greek-label">NET VEGA (ν)</span>
                <span className="greek-value mono text-cyan">
                  {netVega}
                </span>
                <span className="greek-sub">Per 1% IV shift</span>
              </div>

              <div className="greek-box">
                <span className="greek-label">WIN PROBABILITY</span>
                <span className="greek-value mono text-profit">
                  71.4%
                </span>
                <span className="greek-sub">PoP calculation</span>
              </div>
            </div>
          </div>

          {/* Quick Institutional Execution Dock */}
          <div className="terminal-card exec-launcher-card">
            <div className="terminal-card-header">
              <span className="terminal-card-title">
                <Target size={14} className="text-profit" />
                ANTI-EMOTION FAST EXECUTION
              </span>
              <span className="badge badge-green">1-CLICK DEFINED RISK</span>
            </div>

            <div className="terminal-card-body exec-buttons-grid">
              {/* Buy ATM Call with Auto SL */}
              <button
                className="btn btn-outline quick-exec-btn buy-call-btn"
                onClick={() => openOrderTicket({
                  symbol: `${selectedSymbol.symbol} 25150 CE`,
                  action: 'BUY',
                  price: 93.80,
                  sl: 80.00,
                  target: 120.00,
                  lotSize: selectedSymbol.lotSize,
                  qty: selectedSymbol.lotSize,
                  strategy: 'Automated Momentum Breakout'
                })}
              >
                <div className="q-exec-top">
                  <ArrowUpRight size={14} className="text-profit" />
                  <span className="font-bold">BUY ATM CALL</span>
                </div>
                <div className="q-exec-sub mono">Auto SL (-15%) & Target</div>
              </button>

              {/* Buy ATM Put with Auto SL */}
              <button
                className="btn btn-outline quick-exec-btn buy-put-btn"
                onClick={() => openOrderTicket({
                  symbol: `${selectedSymbol.symbol} 25150 PE`,
                  action: 'BUY',
                  price: 114.50,
                  sl: 98.00,
                  target: 145.00,
                  lotSize: selectedSymbol.lotSize,
                  qty: selectedSymbol.lotSize,
                  strategy: 'Automated Breakdown Put'
                })}
              >
                <div className="q-exec-top">
                  <ArrowDownRight size={14} className="text-loss" />
                  <span className="font-bold">BUY ATM PUT</span>
                </div>
                <div className="q-exec-sub mono">Auto SL (-15%) & Target</div>
              </button>

              {/* 1-Click Bull Call Spread (Hedged) */}
              <button
                className="btn btn-outline quick-exec-btn spread-btn"
                onClick={() => openOrderTicket({
                  symbol: `${selectedSymbol.symbol} Bull Call Spread (25150/25250)`,
                  action: 'BUY',
                  price: 45.60,
                  sl: 30.00,
                  target: 75.00,
                  lotSize: selectedSymbol.lotSize,
                  qty: selectedSymbol.lotSize,
                  strategy: 'Bull Call Spread (Defined Risk)'
                })}
              >
                <div className="q-exec-top">
                  <span className="badge badge-cyan">HEDGED</span>
                  <span className="font-bold">BULL SPREAD</span>
                </div>
                <div className="q-exec-sub mono">Capped Max Loss: ₹1,140</div>
              </button>

              {/* 1-Click Bear Put Spread (Hedged) */}
              <button
                className="btn btn-outline quick-exec-btn spread-btn"
                onClick={() => openOrderTicket({
                  symbol: `${selectedSymbol.symbol} Bear Put Spread (25150/25050)`,
                  action: 'BUY',
                  price: 37.70,
                  sl: 25.00,
                  target: 65.00,
                  lotSize: selectedSymbol.lotSize,
                  qty: selectedSymbol.lotSize,
                  strategy: 'Bear Put Spread (Defined Risk)'
                })}
              >
                <div className="q-exec-top">
                  <span className="badge badge-cyan">HEDGED</span>
                  <span className="font-bold">BEAR SPREAD</span>
                </div>
                <div className="q-exec-sub mono">Capped Max Loss: ₹940</div>
              </button>
            </div>

            <div className="risk-assurance-note">
              <CheckCircle2 size={13} className="text-profit" />
              <span>Strict Rule: Order sizing automatically locked to ≤1.5% max capital loss.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Dock: Positions & Order Activity */}
      <div className="terminal-card bottom-dock">
        <div className="terminal-card-header dock-header">
          <div className="dock-tabs">
            <button
              className={`dock-tab ${activeBottomTab === 'positions' ? 'dock-tab-active' : ''}`}
              onClick={() => setActiveBottomTab('positions')}
            >
              ACTIVE POSITIONS ({positions.length})
              <span className={`dock-pnl-chip mono ${totalUnrealizedPnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                {totalUnrealizedPnl >= 0 ? '+' : ''}₹{totalUnrealizedPnl.toFixed(2)}
              </span>
            </button>
            <button
              className={`dock-tab ${activeBottomTab === 'trailing' ? 'dock-tab-active' : ''}`}
              onClick={() => setActiveBottomTab('trailing')}
            >
              TRAILING SL AUTOMATION (ACTIVE)
            </button>
          </div>

          <div className="dock-meta-info">
            <span className="mono text-muted">
              Auto Square-off Time: <strong>15:15 IST</strong>
            </span>
          </div>
        </div>

        <div className="dock-table-container">
          {positions.length === 0 ? (
            <div className="empty-positions">
              <ShieldAlert size={24} className="text-muted" />
              <span>No open positions. Zero overnight or unmanaged risk.</span>
            </div>
          ) : (
            <table className="terminal-table">
              <thead>
                <tr>
                  <th>INSTRUMENT</th>
                  <th>STRATEGY</th>
                  <th>SIDE / QTY</th>
                  <th>ENTRY PRICE</th>
                  <th>LTP (LIVE)</th>
                  <th>STOP LOSS</th>
                  <th>TARGET</th>
                  <th>TRAILING SL</th>
                  <th>UNREALIZED P&L</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {positions.map(pos => {
                  const isProfitable = pos.pnl >= 0;
                  return (
                    <tr key={pos.id} className={pos.tickDir ? `flash-${pos.tickDir}` : ''}>
                      <td className="font-bold">{pos.symbol}</td>
                      <td>
                        <span className="badge badge-purple">{pos.strategy}</span>
                      </td>
                      <td>
                        <span className={`badge ${pos.qty > 0 ? 'badge-green' : 'badge-red'}`}>
                          {pos.qty > 0 ? 'BUY' : 'SELL'} {Math.abs(pos.qty)}
                        </span>
                      </td>
                      <td className="mono">₹{pos.entryPrice.toFixed(2)}</td>
                      <td className="mono font-bold">₹{pos.currentPrice.toFixed(2)}</td>
                      <td className="mono text-loss">₹{pos.sl.toFixed(2)}</td>
                      <td className="mono text-profit">₹{pos.target.toFixed(2)}</td>
                      <td>
                        {pos.trailingSlActive ? (
                          <span className="badge badge-cyan">ACTIVE (Step: ₹{pos.trailingSlStep})</span>
                        ) : (
                          <span className="badge badge-amber">FIXED</span>
                        )}
                      </td>
                      <td className="mono font-bold">
                        <span className={isProfitable ? 'text-profit' : 'text-loss'}>
                          {isProfitable ? '+' : ''}₹{pos.pnl.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          {' '}({isProfitable ? '+' : ''}{pos.pnlPct}%)
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger btn-exit"
                          onClick={() => closePosition(pos.id)}
                          title="Instant Market Square-off"
                        >
                          EXIT
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <style>{`
        .terminal-view-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 12px;
          height: calc(100vh - 56px);
          overflow-y: auto;
        }

        /* 1. Ticker Ribbon */
        .ticker-ribbon {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 8px;
        }

        .ticker-card {
          background: var(--bg-surface-1);
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
          padding: 8px 12px;
          cursor: pointer;
          transition: all var(--trans-fast);
        }

        .ticker-card:hover {
          border-color: var(--border-medium);
          background: var(--bg-surface-2);
        }

        .ticker-selected {
          border-color: var(--border-cyan) !important;
          background: rgba(0, 240, 255, 0.06) !important;
        }

        .ticker-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .ticker-symbol {
          font-weight: 700;
          font-size: 11.5px;
          color: var(--text-primary);
        }

        .ticker-type {
          font-size: 9px;
          font-weight: 700;
          color: var(--text-muted);
          background: var(--bg-surface-3);
          padding: 1px 4px;
          border-radius: 3px;
        }

        .ticker-bottom {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        .ticker-price {
          font-size: 12.5px;
          font-weight: 700;
        }

        .ticker-change {
          font-size: 11px;
          font-weight: 600;
        }

        /* 2. Main Workspace Grid */
        .main-workspace-grid {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 12px;
          min-height: 380px;
        }

        .chart-panel {
          display: flex;
          flex-direction: column;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chart-title-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .chart-symbol-badge {
          font-weight: 800;
          font-size: 14px;
          color: #ffffff;
        }

        .chart-spot-price {
          font-size: 14px;
          font-weight: 700;
          color: var(--neon-cyan);
        }

        .chart-spot-change {
          font-size: 11.5px;
        }

        .chart-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .timeframe-selector {
          display: flex;
          background: var(--bg-surface-3);
          border-radius: 4px;
          padding: 2px;
        }

        .tf-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 700;
          padding: 3px 6px;
          cursor: pointer;
          border-radius: 3px;
        }

        .tf-active {
          background: var(--neon-cyan);
          color: #000;
        }

        .indicator-pill {
          font-size: 10px;
          font-family: var(--font-mono);
          background: var(--bg-surface-3);
          padding: 3px 8px;
          border-radius: 4px;
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
        }

        .chart-canvas-area {
          position: relative;
          flex: 1;
          background: #060911;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .chart-svg {
          width: 100%;
          height: 100%;
          min-height: 280px;
        }

        .chart-floating-price {
          position: absolute;
          right: 12px;
          top: 35px;
          background: var(--profit-green);
          color: #000;
          font-weight: 800;
          font-size: 11px;
          padding: 2px 6px;
          border-radius: 3px;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.4);
        }

        .right-tools-col {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .greeks-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          padding: 10px 14px;
        }

        .greek-box {
          background: var(--bg-surface-2);
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
          padding: 8px;
          display: flex;
          flex-direction: column;
        }

        .greek-label {
          font-size: 9.5px;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        .greek-value {
          font-size: 14px;
          font-weight: 800;
          margin: 2px 0;
        }

        .greek-sub {
          font-size: 9px;
          color: var(--text-muted);
        }

        .exec-buttons-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .quick-exec-btn {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 10px;
          border-radius: 6px;
          text-align: left;
        }

        .q-exec-top {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11.5px;
        }

        .q-exec-sub {
          font-size: 9.5px;
          color: var(--text-muted);
          margin-top: 4px;
        }

        .buy-call-btn:hover {
          border-color: var(--profit-green);
          background: var(--profit-green-bg);
        }

        .buy-put-btn:hover {
          border-color: var(--loss-red);
          background: var(--loss-red-bg);
        }

        .spread-btn:hover {
          border-color: var(--neon-cyan);
          background: var(--neon-cyan-bg);
        }

        .risk-assurance-note {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          color: var(--text-secondary);
          padding: 8px 14px 12px;
          border-top: 1px solid var(--border-subtle);
        }

        /* 3. Bottom Dock */
        .bottom-dock {
          min-height: 180px;
        }

        .dock-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 14px;
        }

        .dock-tabs {
          display: flex;
          gap: 8px;
        }

        .dock-tab {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          padding: 6px 10px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .dock-tab-active {
          background: var(--bg-surface-3);
          color: var(--text-primary);
        }

        .dock-pnl-chip {
          background: var(--bg-surface-1);
          padding: 1px 6px;
          border-radius: 4px;
          font-size: 10.5px;
        }

        .dock-table-container {
          max-height: 190px;
          overflow-y: auto;
        }

        .btn-exit {
          padding: 3px 8px;
          font-size: 10.5px;
          font-weight: 700;
        }

        .empty-positions {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 30px;
          gap: 8px;
          color: var(--text-muted);
          font-size: 12px;
        }
      `}</style>
    </div>
  );
};
