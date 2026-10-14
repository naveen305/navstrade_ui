import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { X, ArrowUpRight, ArrowDownRight, Crosshair, BarChart2, Clock } from 'lucide-react';

// Thin horizontal sparkline-style OI bar
const OiBar = ({ value, maxVal, color }) => (
  <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '6px', width: '100%' }}>
    <span style={{ fontFamily: 'var(--font-data)', fontSize: '11px', color: 'var(--text-primary)', minWidth: '42px', textAlign: 'right' }}>
      {(value / 100000).toFixed(1)}L
    </span>
    <div style={{ flex: 1, height: '3px', background: '#2a2a2a', borderRadius: '2px', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${Math.min(100, (value / maxVal) * 100)}%`, background: color, borderRadius: '2px', transition: 'width 0.5s ease' }} />
    </div>
  </div>
);

export const TerminalView = () => {
  const {
    watchlist, selectedSymbol, setSelectedSymbol,
    positions, closePosition, openOrderTicket,
    totalUnrealizedPnl, optionChain
  } = useTrading();

  const [tf, setTf] = useState('5m');
  const [bottomTab, setBottomTab] = useState('positions');

  // Portfolio Greeks
  const netDelta = positions.reduce((s, p) => s + (p.delta || 0) * Math.sign(p.qty), 0).toFixed(2);
  const netTheta = positions.reduce((s, p) => s + (p.theta || 0), 0).toFixed(1);
  const netVega  = positions.reduce((s, p) => s + (p.vega  || 0), 0).toFixed(1);

  return (
    <div style={S.root}>
      {/* ── 1. Instrument Ticker Strip ── */}
      <div style={S.tickerStrip}>
        {watchlist.map(item => {
          const up = item.change >= 0;
          const active = selectedSymbol.symbol === item.symbol;
          return (
            <button
              key={item.symbol}
              style={{ ...S.tickerCard, ...(active ? S.tickerActive : {}) }}
              onClick={() => setSelectedSymbol(item)}
            >
              <div style={S.tickerTop}>
                <span style={S.tickerSym}>{item.symbol}</span>
                <span style={S.tickerType}>{item.type}</span>
              </div>
              <div style={S.tickerBottom}>
                <span className="font-data" style={S.tickerPrice}>
                  ₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className="font-data" style={{ fontSize: '10.5px', color: up ? 'var(--up)' : 'var(--down)', fontWeight: 600 }}>
                  {up ? '+' : ''}{item.changePct?.toFixed(2)}%
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── 2. Main Workspace ── */}
      <div style={S.workspace}>

        {/* Left: Chart panel */}
        <div style={{ ...S.panel, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Chart toolbar */}
          <div style={S.chartToolbar}>
            <div style={S.chartTitleRow}>
              <span style={S.chartSym}>{selectedSymbol.symbol}</span>
              <span className="font-data" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-white)' }}>
                ₹{selectedSymbol.price?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span className="font-data" style={{ fontSize: '12px', color: selectedSymbol.change >= 0 ? 'var(--up)' : 'var(--down)' }}>
                {selectedSymbol.change >= 0 ? '+' : ''}{selectedSymbol.change?.toFixed(2)}
                &nbsp;({selectedSymbol.changePct?.toFixed(2)}%)
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {/* Timeframe selector */}
              <div style={S.tfGroup}>
                {['1m','3m','5m','15m','1D'].map(t => (
                  <button
                    key={t}
                    style={{ ...S.tfBtn, ...(tf === t ? S.tfActive : {}) }}
                    onClick={() => setTf(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div style={S.metaPill} className="font-data">VWAP&nbsp;<strong style={{ color: 'var(--text-primary)' }}>₹{selectedSymbol.vwap}</strong></div>
              <div style={S.metaPill} className="font-data">PCR&nbsp;<strong style={{ color: selectedSymbol.pcr >= 1 ? 'var(--up)' : 'var(--down)' }}>{selectedSymbol.pcr}</strong></div>
              <div style={S.metaPill} className="font-data">Max Pain&nbsp;<strong style={{ color: 'var(--warn)' }}>{selectedSymbol.maxPain}</strong></div>
            </div>
          </div>

          {/* Chart Canvas */}
          <div style={S.chartCanvas}>
            <svg width="100%" height="100%" viewBox="0 0 800 280" preserveAspectRatio="none">
              {/* Grid */}
              {[56, 112, 168, 224].map(y => (
                <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="#242424" strokeWidth="1" />
              ))}
              {[100,200,300,400,500,600,700].map(x => (
                <line key={x} x1={x} y1="0" x2={x} y2="280" stroke="#1e1e1e" strokeWidth="1" />
              ))}

              {/* Volume bars */}
              {[
                [30,40,true],[70,28,false],[110,52,true],[150,65,true],[190,35,false],
                [230,58,true],[270,80,true],[310,48,false],[350,62,true],[390,88,true],
                [430,72,true],[470,38,false],[510,58,true],[550,76,true],[590,52,false],
                [630,92,true],[670,108,true],[710,82,true],[750,68,false],[790,102,true],
              ].map(([x, h, up], i) => (
                <rect key={i} x={x-8} y={280-h} width="16" height={h}
                  fill={up ? 'rgba(38,166,154,0.15)' : 'rgba(239,83,80,0.15)'} rx="1" />
              ))}

              {/* Candles */}
              {[
                [30,185,170,162,198,true],[70,170,182,166,192,false],[110,182,158,152,188,true],
                [150,158,142,138,166,true],[190,142,152,137,162,false],[230,152,132,127,157,true],
                [270,132,116,109,140,true],[310,116,128,112,136,false],[350,128,107,103,133,true],
                [390,107,93,88,118,true],[430,93,88,79,102,true],[470,88,102,84,112,false],
                [510,102,83,78,107,true],[550,83,72,68,92,true],[590,72,82,68,92,false],
                [630,82,58,54,87,true],[670,58,48,43,65,true],[710,48,43,38,58,true],
                [750,43,53,39,62,false],[790,53,36,31,62,true],
              ].map(([x,o,c,h,l,up],i) => (
                <g key={i}>
                  <line x1={x} y1={h} x2={x} y2={l} stroke={up?'#26a69a':'#ef5350'} strokeWidth="1.5" />
                  <rect x={x-5} y={Math.min(o,c)} width="10" height={Math.max(2,Math.abs(o-c))}
                    fill={up?'#26a69a':'#ef5350'} rx="1" />
                </g>
              ))}

              {/* VWAP line */}
              <path d="M 30,182 Q 200,148 390,112 T 790,55" fill="none" stroke="#5c8df6" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7" />
              {/* Resistance */}
              <line x1="0" y1="32" x2="800" y2="32" stroke="#f0a500" strokeWidth="1" strokeDasharray="3 4" opacity="0.5" />
              <text x="6" y="27" fill="#f0a500" fontSize="9" fontFamily="JetBrains Mono" opacity="0.8">R1 · {selectedSymbol.maxPain + 100}</text>

              {/* Price tag */}
              <rect x="762" y="34" width="38" height="14" fill="#26a69a" rx="2" />
              <text x="781" y="44" fill="#fff" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="700">
                {selectedSymbol.price?.toFixed(0)}
              </text>
            </svg>
          </div>
        </div>

        {/* Right column */}
        <div style={S.rightCol}>

          {/* Portfolio Greeks */}
          <div style={S.panel}>
            <div style={S.panelHdr}><span style={S.panelTitle}><Crosshair size={12} style={{ marginRight: 5 }} />Portfolio Greeks</span></div>
            <div style={S.greeksGrid}>
              {[
                { label: 'Net Delta (Δ)', val: netDelta, color: Number(netDelta) >= 0 ? 'var(--up)' : 'var(--down)' },
                { label: 'Net Theta (Θ) / day', val: `₹${netTheta}`, color: 'var(--warn)' },
                { label: 'Net Vega (ν)', val: netVega, color: 'var(--accent)' },
                { label: 'Win Probability', val: '71.4%', color: 'var(--up)' },
              ].map(g => (
                <div key={g.label} style={S.greekCard}>
                  <div style={S.greekLabel}>{g.label}</div>
                  <div className="font-data" style={{ fontSize: '15px', fontWeight: 700, color: g.color }}>{g.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Entry */}
          <div style={S.panel}>
            <div style={S.panelHdr}>
              <span style={S.panelTitle}>Quick Order Entry</span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Auto-SL + Risk-Sized</span>
            </div>
            <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                {[
                  { label: 'ATM Call (CE)', action: 'BUY', type: 'CE', price: 93.80, sl: 80.0, target: 120.0 },
                  { label: 'ATM Put (PE)', action: 'BUY', type: 'PE', price: 114.50, sl: 98.0, target: 145.0 },
                  { label: 'Bull Spread', action: 'BUY', type: 'SPREAD', price: 45.60, sl: 30.0, target: 75.0 },
                  { label: 'Bear Spread', action: 'BUY', type: 'SPREAD', price: 37.70, sl: 25.0, target: 65.0 },
                ].map(o => (
                  <button
                    key={o.label}
                    className={o.action === 'BUY' ? 'btn btn-buy' : 'btn btn-sell'}
                    style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '8px 10px', gap: '2px', height: 'auto', fontSize: '11px' }}
                    onClick={() => openOrderTicket({
                      symbol: `${selectedSymbol.symbol} ${o.type === 'CE' ? '25150 CE' : o.type === 'PE' ? '25150 PE' : o.label}`,
                      action: o.action, price: o.price, sl: o.sl, target: o.target,
                      lotSize: selectedSymbol.lotSize, qty: selectedSymbol.lotSize,
                      strategy: o.label
                    })}
                  >
                    <span style={{ fontWeight: 600 }}>{o.label}</span>
                    <span style={{ fontSize: '10px', opacity: 0.7 }}>Max loss defined</span>
                  </button>
                ))}
              </div>
              <div style={S.autoRuleNote}>
                ✓ Lot size auto-capped to 1.5% capital risk · Auto square-off 15:15 IST
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Positions Dock ── */}
      <div style={S.dockWrap}>
        {/* Dock tab bar */}
        <div style={S.dockTabBar}>
          {[
            { id: 'positions', label: `Positions (${positions.length})` },
            { id: 'trailing',  label: 'Trailing SL Monitor' },
          ].map(t => (
            <button
              key={t.id}
              style={{ ...S.dockTab, ...(bottomTab === t.id ? S.dockTabActive : {}) }}
              onClick={() => setBottomTab(t.id)}
            >
              {t.label}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px', paddingRight: '10px' }}>
            <span className="font-data" style={{ fontSize: '11px', color: totalUnrealizedPnl >= 0 ? 'var(--up)' : 'var(--down)', fontWeight: 600 }}>
              Unrealized: {totalUnrealizedPnl >= 0 ? '+' : ''}₹{totalUnrealizedPnl.toFixed(2)}
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              <Clock size={10} style={{ marginRight: 3 }} />Auto exit: 15:15 IST
            </span>
          </div>
        </div>

        {/* Positions table */}
        <div style={S.dockTable}>
          {positions.length === 0 ? (
            <div style={S.emptyState}>
              <BarChart2 size={20} style={{ color: 'var(--text-muted)', marginBottom: 6 }} />
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No open positions</span>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Instrument</th>
                  <th>Strategy</th>
                  <th>Side</th>
                  <th style={{ textAlign: 'right' }}>Qty</th>
                  <th style={{ textAlign: 'right' }}>Entry</th>
                  <th style={{ textAlign: 'right' }}>LTP</th>
                  <th style={{ textAlign: 'right' }}>Stop Loss</th>
                  <th style={{ textAlign: 'right' }}>Target</th>
                  <th>Trailing SL</th>
                  <th style={{ textAlign: 'right' }}>P&L</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {positions.map(pos => {
                  const profit = pos.pnl >= 0;
                  return (
                    <tr key={pos.id}>
                      <td style={{ fontWeight: 600, color: 'var(--text-white)' }}>{pos.symbol}</td>
                      <td><span className="tag tag-info">{pos.strategy}</span></td>
                      <td>
                        <span className={pos.qty > 0 ? 'tag tag-up' : 'tag tag-down'}>
                          {pos.qty > 0 ? '↑ BUY' : '↓ SELL'}
                        </span>
                      </td>
                      <td className="font-data" style={{ textAlign: 'right' }}>{Math.abs(pos.qty)}</td>
                      <td className="font-data" style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>₹{pos.entryPrice.toFixed(2)}</td>
                      <td className="font-data" style={{ textAlign: 'right', fontWeight: 600, color: 'var(--text-white)' }}>₹{pos.currentPrice.toFixed(2)}</td>
                      <td className="font-data" style={{ textAlign: 'right', color: 'var(--down)' }}>₹{pos.sl.toFixed(2)}</td>
                      <td className="font-data" style={{ textAlign: 'right', color: 'var(--up)' }}>₹{pos.target.toFixed(2)}</td>
                      <td>
                        {pos.trailingSlActive
                          ? <span className="tag tag-info">Active · ₹{pos.trailingSlStep} step</span>
                          : <span className="tag tag-neutral">Fixed</span>}
                      </td>
                      <td className="font-data" style={{ textAlign: 'right', fontWeight: 700, color: profit ? 'var(--up)' : 'var(--down)' }}>
                        {profit ? '+' : ''}₹{pos.pnl.toFixed(2)}
                        <span style={{ fontSize: '10px', marginLeft: 4, opacity: 0.7 }}>({profit ? '+' : ''}{pos.pnlPct?.toFixed(1)}%)</span>
                      </td>
                      <td>
                        <button className="btn btn-sell btn-sm" onClick={() => closePosition(pos.id)}>Exit</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

const S = {
  root: { display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', gap: '0' },
  panel: { background: 'var(--bg-panel)', border: '1px solid var(--border-1)', borderRadius: '4px', overflow: 'hidden' },

  tickerStrip: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '1px',
    background: 'var(--border-1)',
    borderBottom: '1px solid var(--border-1)',
    flexShrink: 0,
  },
  tickerCard: {
    display: 'flex', flexDirection: 'column', gap: '2px',
    padding: '7px 12px',
    background: 'var(--bg-panel)',
    border: 'none', cursor: 'pointer',
    textAlign: 'left',
    transition: 'background 120ms ease',
  },
  tickerActive: { background: 'var(--bg-selected)', borderBottom: '2px solid var(--accent)' },
  tickerTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  tickerSym: { fontSize: '11.5px', fontWeight: 700, color: 'var(--text-white)' },
  tickerType: { fontSize: '9px', color: 'var(--text-muted)', background: '#2a2a2a', padding: '1px 4px', borderRadius: '2px' },
  tickerBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' },
  tickerPrice: { fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)' },

  workspace: { display: 'flex', flex: 1, gap: '1px', background: 'var(--border-1)', overflow: 'hidden', minHeight: 0 },
  rightCol: { width: '300px', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border-1)', overflow: 'hidden' },

  chartToolbar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '6px 12px', background: 'var(--bg-panel-2)',
    borderBottom: '1px solid var(--border-1)', flexShrink: 0,
  },
  chartTitleRow: { display: 'flex', alignItems: 'baseline', gap: '10px' },
  chartSym: { fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginRight: '4px' },

  tfGroup: { display: 'flex', background: '#1a1a1a', borderRadius: '3px', border: '1px solid var(--border-1)' },
  tfBtn: {
    padding: '3px 7px', background: 'transparent', border: 'none',
    color: 'var(--text-muted)', fontFamily: 'var(--font-data)', fontSize: '10.5px',
    cursor: 'pointer', borderRadius: '2px',
  },
  tfActive: { background: 'var(--accent)', color: '#fff', fontWeight: 600 },
  metaPill: {
    fontSize: '10.5px', color: 'var(--text-muted)',
    background: 'var(--bg-panel)', border: '1px solid var(--border-1)',
    padding: '2px 7px', borderRadius: '3px',
  },

  chartCanvas: { flex: 1, background: '#111111', overflow: 'hidden' },

  panelHdr: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '6px 10px', background: 'var(--bg-panel-2)',
    borderBottom: '1px solid var(--border-1)', height: '32px',
  },
  panelTitle: {
    fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)',
    textTransform: 'uppercase', letterSpacing: '0.05em',
    display: 'flex', alignItems: 'center',
  },

  greeksGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--border-1)' },
  greekCard: { background: 'var(--bg-panel)', padding: '8px 10px' },
  greekLabel: { fontSize: '9.5px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '3px' },

  autoRuleNote: {
    fontSize: '10px', color: 'var(--text-muted)',
    padding: '5px 6px',
    background: 'var(--bg-panel-2)',
    borderRadius: '3px',
    border: '1px solid var(--border-1)',
  },

  // Bottom dock
  dockWrap: {
    flexShrink: 0,
    borderTop: '1px solid var(--border-1)',
    background: 'var(--bg-panel)',
    maxHeight: '200px',
    display: 'flex',
    flexDirection: 'column',
  },
  dockTabBar: {
    display: 'flex', alignItems: 'center', gap: '2px',
    padding: '0 8px',
    borderBottom: '1px solid var(--border-1)',
    background: 'var(--bg-panel-2)',
    height: '32px', flexShrink: 0,
  },
  dockTab: {
    padding: '0 10px', height: '100%',
    background: 'transparent', border: 'none',
    color: 'var(--text-muted)', cursor: 'pointer',
    fontSize: '11px', fontWeight: 500,
    borderBottom: '2px solid transparent',
  },
  dockTabActive: { color: 'var(--text-primary)', borderBottomColor: 'var(--accent)' },
  dockTable: { overflow: 'auto', flex: 1 },
  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', color: 'var(--text-muted)' },
};
