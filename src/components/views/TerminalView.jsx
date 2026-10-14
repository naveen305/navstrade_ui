import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { Crosshair, BarChart2, Clock, ShieldCheck, ChevronRight } from 'lucide-react';

export const TerminalView = () => {
  const {
    watchlist, selectedSymbol, setSelectedSymbol,
    positions, closePosition, openOrderTicket,
    totalUnrealizedPnl
  } = useTrading();

  const [tf, setTf] = useState('5m');
  const [bottomTab, setBottomTab] = useState('positions');
  const [hoveredCandle, setHoveredCandle] = useState(null);

  // Portfolio Greeks calculation
  const netDelta = positions.reduce((s, p) => s + (p.delta || 0) * Math.sign(p.qty), 0).toFixed(2);
  const netTheta = positions.reduce((s, p) => s + (p.theta || 0), 0).toFixed(1);
  const netVega  = positions.reduce((s, p) => s + (p.vega  || 0), 0).toFixed(1);

  // 32 Precision Candlesticks for 5m intraday action
  const candles = [
    { time: '09:15', o: 25010, h: 25045, l: 24995, c: 25035, vol: 62 },
    { time: '09:20', o: 25035, h: 25060, l: 25015, c: 25020, vol: 45 },
    { time: '09:25', o: 25020, h: 25055, l: 25010, c: 25050, vol: 54 },
    { time: '09:30', o: 25050, h: 25075, l: 25030, c: 25065, vol: 70 },
    { time: '09:35', o: 25065, h: 25080, l: 25040, c: 25045, vol: 40 },
    { time: '09:40', o: 25045, h: 25070, l: 25035, c: 25060, vol: 48 },
    { time: '09:45', o: 25060, h: 25095, l: 25055, c: 25090, vol: 82 },
    { time: '09:50', o: 25090, h: 25110, l: 25080, c: 25085, vol: 52 },
    { time: '09:55', o: 25085, h: 25105, l: 25070, c: 25100, vol: 60 },
    { time: '10:00', o: 25100, h: 25120, l: 25085, c: 25115, vol: 66 },
    { time: '10:05', o: 25115, h: 25125, l: 25095, c: 25105, vol: 38 },
    { time: '10:10', o: 25105, h: 25118, l: 25080, c: 25090, vol: 44 },
    { time: '10:15', o: 25090, h: 25110, l: 25085, c: 25105, vol: 50 },
    { time: '10:20', o: 25105, h: 25130, l: 25100, c: 25125, vol: 78 },
    { time: '10:25', o: 25125, h: 25140, l: 25115, c: 25135, vol: 85 },
    { time: '10:30', o: 25135, h: 25145, l: 25120, c: 25130, vol: 55 },
    { time: '10:35', o: 25130, h: 25150, l: 25125, c: 25145, vol: 72 },
    { time: '10:40', o: 25145, h: 25165, l: 25135, c: 25155, vol: 88 },
    { time: '10:45', o: 25155, h: 25160, l: 25138, c: 25140, vol: 46 },
    { time: '10:50', o: 25140, h: 25155, l: 25130, c: 25150, vol: 58 },
    { time: '10:55', o: 25150, h: 25175, l: 25145, c: 25165, vol: 92 },
    { time: '11:00', o: 25165, h: 25180, l: 25155, c: 25170, vol: 84 },
    { time: '11:05', o: 25170, h: 25175, l: 25150, c: 25158, vol: 50 },
    { time: '11:10', o: 25158, h: 25168, l: 25142, c: 25150, vol: 42 },
    { time: '11:15', o: 25150, h: 25162, l: 25135, c: 25140, vol: 48 },
    { time: '11:20', o: 25140, h: 25158, l: 25138, c: 25152, vol: 62 },
    { time: '11:25', o: 25152, h: 25170, l: 25148, c: 25165, vol: 74 },
    { time: '11:30', o: 25165, h: 25180, l: 25160, c: 25175, vol: 80 },
    { time: '11:35', o: 25175, h: 25180, l: 25155, c: 25160, vol: 54 },
    { time: '11:40', o: 25160, h: 25172, l: 25150, c: 25168, vol: 60 },
    { time: '11:45', o: 25168, h: 25175, l: 25140, c: 25145, vol: 68 },
    { time: '11:50', o: 25145, h: 25155, l: 25135, c: 25142, vol: 58 },
  ];

  const minPrice = 24980;
  const maxPrice = 25200;
  const priceRange = maxPrice - minPrice;
  const chartHeight = 230;
  const chartWidth = 720;
  const candleW = 12;
  const stepX = chartWidth / candles.length;

  const toY = (val) => chartHeight - ((val - minPrice) / priceRange) * chartHeight;

  // Active display bar
  const activeCandle = hoveredCandle || candles[candles.length - 1];

  return (
    <div style={S.root}>
      {/* ── 1. Instrument Watchlist Strip ── */}
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
              <div style={S.tickerRow1}>
                <span style={S.tickerSym}>{item.symbol}</span>
                <span style={S.tickerType}>{item.type}</span>
              </div>
              <div style={S.tickerRow2}>
                <span className="font-data" style={S.tickerPrice}>
                  ₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className="font-data" style={{ fontSize: '10px', color: up ? 'var(--up)' : 'var(--down)', fontWeight: 600 }}>
                  {up ? '+' : ''}{item.changePct?.toFixed(2)}%
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── 2. Terminal Center Grid ── */}
      <div style={S.workspace}>

        {/* Left: Chart */}
        <div style={S.chartPanel}>
          {/* Chart Header Bar */}
          <div style={S.chartToolbar}>
            <div style={S.chartSymInfo}>
              <span style={S.chartSym}>{selectedSymbol.symbol}</span>
              <span className="font-data" style={S.chartMainPrice}>
                ₹{selectedSymbol.price?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span className="font-data" style={{ fontSize: '11px', color: selectedSymbol.change >= 0 ? 'var(--up)' : 'var(--down)', fontWeight: 500 }}>
                {selectedSymbol.change >= 0 ? '+' : ''}{selectedSymbol.change?.toFixed(2)} ({selectedSymbol.changePct?.toFixed(2)}%)
              </span>
            </div>

            {/* OHLC Stats Header */}
            <div style={S.ohlcBar} className="font-data">
              <span>O: <strong style={{ color: 'var(--text-white)' }}>{activeCandle.o.toFixed(1)}</strong></span>
              <span>H: <strong style={{ color: 'var(--text-white)' }}>{activeCandle.h.toFixed(1)}</strong></span>
              <span>L: <strong style={{ color: 'var(--text-white)' }}>{activeCandle.l.toFixed(1)}</strong></span>
              <span>C: <strong style={{ color: activeCandle.c >= activeCandle.o ? 'var(--up)' : 'var(--down)' }}>{activeCandle.c.toFixed(1)}</strong></span>
              <span>Vol: <strong style={{ color: 'var(--text-secondary)' }}>{activeCandle.vol}K</strong></span>
            </div>

            {/* Timeframe selector */}
            <div style={S.tfGroup}>
              {['1m', '3m', '5m', '15m', '1D'].map(t => (
                <button
                  key={t}
                  style={{ ...S.tfBtn, ...(tf === t ? S.tfActive : {}) }}
                  onClick={() => setTf(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Candlestick Canvas with Y-Axis */}
          <div style={S.chartContainer}>
            <div style={S.chartSvgWrap}>
              <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
                {/* Horizontal Grid Lines */}
                {[25000, 25050, 25100, 25150].map(p => {
                  const y = toY(p);
                  return (
                    <line key={p} x1="0" y1={y} x2={chartWidth} y2={y} stroke="#1b202c" strokeWidth="1" strokeDasharray="2 3" />
                  );
                })}

                {/* Day Reference Lines */}
                {/* VWAP */}
                <line x1="0" y1={toY(selectedSymbol.vwap || 25088)} x2={chartWidth} y2={toY(selectedSymbol.vwap || 25088)}
                  stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

                {/* Day High */}
                <line x1="0" y1={toY(selectedSymbol.dayHigh || 25180)} x2={chartWidth} y2={toY(selectedSymbol.dayHigh || 25180)}
                  stroke="var(--warn)" strokeWidth="1" strokeDasharray="2 4" opacity="0.3" />

                {/* Volume Histogram */}
                {candles.map((c, i) => {
                  const x = i * stepX + stepX / 2;
                  const isUp = c.c >= c.o;
                  const volH = (c.vol / 100) * 45;
                  return (
                    <rect
                      key={`vol-${i}`}
                      x={x - 4}
                      y={chartHeight - volH}
                      width="8"
                      height={volH}
                      fill={isUp ? 'rgba(16, 185, 129, 0.18)' : 'rgba(244, 63, 94, 0.18)'}
                      rx="1"
                    />
                  );
                })}

                {/* 20 EMA Smooth Line */}
                <path
                  d={candles.map((c, i) => {
                    const x = i * stepX + stepX / 2;
                    // Mock 20 EMA smoothing
                    const emaVal = c.o * 0.3 + c.c * 0.7 - 5;
                    const y = toY(emaVal);
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="rgba(56, 189, 248, 0.55)"
                  strokeWidth="1.5"
                />

                {/* Candlesticks */}
                {candles.map((c, i) => {
                  const x = i * stepX + stepX / 2;
                  const isUp = c.c >= c.o;
                  const yO = toY(c.o);
                  const yC = toY(c.c);
                  const yH = toY(c.h);
                  const yL = toY(c.l);
                  const bodyTop = Math.min(yO, yC);
                  const bodyH = Math.max(1.5, Math.abs(yO - yC));
                  const color = isUp ? 'var(--up)' : 'var(--down)';

                  return (
                    <g
                      key={`candle-${i}`}
                      onMouseEnter={() => setHoveredCandle(c)}
                      onMouseLeave={() => setHoveredCandle(null)}
                      style={{ cursor: 'crosshair' }}
                    >
                      {/* Upper & Lower Wick */}
                      <line x1={x} y1={yH} x2={x} y2={yL} stroke={color} strokeWidth="1" />
                      {/* Real Body */}
                      <rect
                        x={x - candleW / 2}
                        y={bodyTop}
                        width={candleW}
                        height={bodyH}
                        fill={color}
                        rx="1"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Right-Side Precision Price Axis */}
            <div style={S.priceAxis}>
              {[25200, 25150, 25100, 25050, 25000].map(p => (
                <div key={p} className="font-data" style={S.priceAxisTick}>
                  {p}
                </div>
              ))}
              {/* Current Price Marker */}
              <div
                className="font-data"
                style={{
                  ...S.priceMarker,
                  top: `${((maxPrice - selectedSymbol.price) / priceRange) * 100}%`
                }}
              >
                {selectedSymbol.price?.toFixed(1)}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Greeks & Quick Entry */}
        <div style={S.rightCol}>

          {/* Portfolio Greeks Panel */}
          <div style={S.panel}>
            <div style={S.panelHdr}>
              <span style={S.panelTitle}>
                <Crosshair size={11} style={{ marginRight: 4 }} />
                Portfolio Greeks
              </span>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>NET EXPOSURE</span>
            </div>

            <div style={S.greeksGrid}>
              <div style={S.greekCard}>
                <div style={S.greekLabel}>Net Delta (Δ)</div>
                <div className="font-data" style={S.greekVal}>
                  {Number(netDelta) >= 0 ? `+${netDelta}` : netDelta}
                </div>
                <div style={S.greekSub}>Neutral range</div>
              </div>

              <div style={S.greekCard}>
                <div style={S.greekLabel}>Net Theta (Θ) / day</div>
                <div className="font-data" style={{ ...S.greekVal, color: Number(netTheta) < -30 ? 'var(--warn)' : 'var(--text-white)' }}>
                  ₹{netTheta}
                </div>
                <div style={S.greekSub}>Decay rate</div>
              </div>

              <div style={S.greekCard}>
                <div style={S.greekLabel}>Net Vega (ν)</div>
                <div className="font-data" style={S.greekVal}>
                  +{netVega}
                </div>
                <div style={S.greekSub}>Vol sensitivity</div>
              </div>

              <div style={S.greekCard}>
                <div style={S.greekLabel}>Max Risk / Trade</div>
                <div className="font-data" style={S.greekVal}>
                  1.5%
                </div>
                <div style={S.greekSub}>Strict cap</div>
              </div>
            </div>
          </div>

          {/* Quick Order Entry Panel */}
          <div style={S.panel}>
            <div style={S.panelHdr}>
              <span style={S.panelTitle}>Defined-Risk Order Entry</span>
              <span style={{ fontSize: '9px', color: 'var(--up)', fontWeight: 600 }}>SL ENFORCED</span>
            </div>

            <div style={S.quickOrderBody}>
              <div style={S.quickOrderGrid}>
                {[
                  {
                    label: 'ATM 25150 CE',
                    sub: 'Momentum Long',
                    type: 'CE',
                    action: 'BUY',
                    price: 93.80,
                    sl: 80.0,
                    target: 120.0
                  },
                  {
                    label: 'ATM 25150 PE',
                    sub: 'Hedging / Short',
                    type: 'PE',
                    action: 'BUY',
                    price: 114.50,
                    sl: 98.0,
                    target: 145.0
                  },
                  {
                    label: 'Bull Call Spread',
                    sub: '25150 / 25250 CE',
                    type: 'SPREAD',
                    action: 'BUY',
                    price: 45.60,
                    sl: 30.0,
                    target: 75.0
                  },
                  {
                    label: 'Bear Put Spread',
                    sub: '25150 / 25050 PE',
                    type: 'SPREAD',
                    action: 'BUY',
                    price: 37.70,
                    sl: 25.0,
                    target: 65.0
                  },
                ].map(o => (
                  <button
                    key={o.label}
                    style={S.quickBtn}
                    onClick={() => openOrderTicket({
                      symbol: `${selectedSymbol.symbol} ${o.label}`,
                      action: o.action,
                      price: o.price,
                      sl: o.sl,
                      target: o.target,
                      lotSize: selectedSymbol.lotSize,
                      qty: selectedSymbol.lotSize,
                      strategy: o.label
                    })}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={S.quickBtnLabel}>{o.label}</span>
                      <span className="font-data" style={S.quickBtnPrice}>₹{o.price.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
                      <span style={S.quickBtnSub}>{o.sub}</span>
                      <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Auto-Sized</span>
                    </div>
                  </button>
                ))}
              </div>

              <div style={S.riskNotice}>
                <ShieldCheck size={11} style={{ color: 'var(--up)', flexShrink: 0 }} />
                <span>Orders auto-capped to 1.5% capital loss. Auto exit at 15:15 IST.</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── 3. Bottom Positions Dock ── */}
      <div style={S.dockWrap}>
        <div style={S.dockTabBar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <button
              style={{ ...S.dockTab, ...(bottomTab === 'positions' ? S.dockTabActive : {}) }}
              onClick={() => setBottomTab('positions')}
            >
              Open Positions ({positions.length})
            </button>
            <button
              style={{ ...S.dockTab, ...(bottomTab === 'trailing' ? S.dockTabActive : {}) }}
              onClick={() => setBottomTab('trailing')}
            >
              Trailing SL Monitor
            </button>
          </div>

          <div style={S.dockMeta}>
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Net Unrealized MTM:</span>
            <span
              className="font-data"
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: totalUnrealizedPnl >= 0 ? 'var(--up)' : 'var(--down)'
              }}
            >
              {totalUnrealizedPnl >= 0 ? '+' : ''}₹{totalUnrealizedPnl.toFixed(2)}
            </span>
            <span style={S.dockMetaSep} />
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              <Clock size={10} style={{ marginRight: 3, verticalAlign: 'middle' }} />
              Auto Square-Off: 15:15 IST
            </span>
          </div>
        </div>

        {/* Positions Table */}
        <div style={S.dockTableWrap}>
          {positions.length === 0 ? (
            <div style={S.emptyState}>
              <BarChart2 size={18} style={{ color: 'var(--text-muted)', marginBottom: 4 }} />
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>No open positions</span>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Instrument</th>
                  <th>Strategy</th>
                  <th>Side</th>
                  <th style={{ textAlign: 'right' }}>Qty</th>
                  <th style={{ textAlign: 'right' }}>Avg Price</th>
                  <th style={{ textAlign: 'right' }}>LTP</th>
                  <th style={{ textAlign: 'right' }}>Stop Loss</th>
                  <th style={{ textAlign: 'right' }}>Target</th>
                  <th>Trailing Mode</th>
                  <th style={{ textAlign: 'right' }}>P&L (MTM)</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {positions.map(pos => {
                  const profit = pos.pnl >= 0;
                  return (
                    <tr key={pos.id}>
                      <td style={{ fontWeight: 600, color: 'var(--text-white)' }}>{pos.symbol}</td>
                      <td>
                        <span className="tag tag-neutral">{pos.strategy}</span>
                      </td>
                      <td>
                        <span className={pos.qty > 0 ? 'tag tag-up' : 'tag tag-down'}>
                          {pos.qty > 0 ? 'BUY' : 'SELL'}
                        </span>
                      </td>
                      <td className="font-data" style={{ textAlign: 'right' }}>{Math.abs(pos.qty)}</td>
                      <td className="font-data" style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>
                        ₹{pos.entryPrice.toFixed(2)}
                      </td>
                      <td className="font-data" style={{ textAlign: 'right', fontWeight: 600, color: 'var(--text-white)' }}>
                        ₹{pos.currentPrice.toFixed(2)}
                      </td>
                      <td className="font-data" style={{ textAlign: 'right', color: 'var(--down)' }}>
                        ₹{pos.sl.toFixed(2)}
                      </td>
                      <td className="font-data" style={{ textAlign: 'right', color: 'var(--up)' }}>
                        ₹{pos.target.toFixed(2)}
                      </td>
                      <td>
                        {pos.trailingSlActive ? (
                          <span className="tag tag-info">
                            Trailing (₹{pos.trailingStep || 5})
                          </span>
                        ) : (
                          <span className="tag tag-neutral">Fixed SL</span>
                        )}
                      </td>
                      <td
                        className="font-data"
                        style={{
                          textAlign: 'right',
                          fontWeight: 600,
                          color: profit ? 'var(--up)' : 'var(--down)'
                        }}
                      >
                        {profit ? '+' : ''}₹{pos.pnl.toFixed(2)}
                        <span style={{ fontSize: '10px', marginLeft: 4, opacity: 0.85 }}>
                          ({profit ? '+' : ''}{pos.pnlPct.toFixed(1)}%)
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{
                            padding: '2px 6px',
                            fontSize: '10px',
                            color: '#fb7185',
                            borderColor: 'rgba(244, 63, 94, 0.25)'
                          }}
                          onClick={() => closePosition(pos.id)}
                          title="Close position"
                        >
                          Close
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

  // Ticker Strip
  tickerStrip: {
    display: 'flex',
    alignItems: 'center',
    background: 'var(--bg-surface)',
    borderBottom: '1px solid var(--border-1)',
    height: '42px',
    overflowX: 'auto',
    flexShrink: 0,
    padding: '0 4px',
    gap: '2px',
  },
  tickerCard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '4px 10px',
    background: 'transparent',
    border: '1px solid transparent',
    borderRadius: '3px',
    cursor: 'pointer',
    minWidth: '130px',
    textAlign: 'left',
    height: '36px',
    transition: 'all 120ms ease',
  },
  tickerActive: {
    background: 'var(--bg-panel)',
    borderColor: 'var(--border-2)',
  },
  tickerRow1: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' },
  tickerSym: { fontSize: '11px', fontWeight: 600, color: 'var(--text-white)' },
  tickerType: { fontSize: '8.5px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em' },
  tickerRow2: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' },
  tickerPrice: { fontSize: '11px', color: 'var(--text-secondary)' },

  // Workspace
  workspace: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
    gap: '1px',
    background: 'var(--border-1)',
  },

  // Chart Panel
  chartPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--bg-panel)',
    overflow: 'hidden',
  },
  chartToolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '6px 12px',
    background: 'var(--bg-panel-2)',
    borderBottom: '1px solid var(--border-1)',
    height: '34px',
    flexShrink: 0,
  },
  chartSymInfo: { display: 'flex', alignItems: 'center', gap: '8px' },
  chartSym: { fontSize: '12px', fontWeight: 700, color: 'var(--text-white)' },
  chartMainPrice: { fontSize: '13.5px', fontWeight: 700, color: 'var(--text-white)' },
  ohlcBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '10.5px',
    color: 'var(--text-muted)',
  },
  tfGroup: { display: 'flex', alignItems: 'center', gap: '1px', background: 'var(--bg-base)', padding: '1px', borderRadius: '3px' },
  tfBtn: {
    padding: '2px 7px',
    fontSize: '10.5px',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    borderRadius: '2px',
  },
  tfActive: {
    background: 'var(--bg-panel)',
    color: 'var(--text-white)',
    fontWeight: 600,
  },

  // Chart canvas
  chartContainer: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  chartSvgWrap: {
    flex: 1,
    height: '100%',
    position: 'relative',
  },
  priceAxis: {
    width: '54px',
    height: '100%',
    borderLeft: '1px solid var(--border-1)',
    background: 'var(--bg-panel-2)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '8px 4px',
    position: 'relative',
    flexShrink: 0,
  },
  priceAxisTick: {
    fontSize: '10px',
    color: 'var(--text-muted)',
    textAlign: 'right',
  },
  priceMarker: {
    position: 'absolute',
    right: 0,
    background: '#10b981',
    color: '#fff',
    fontSize: '9.5px',
    fontWeight: 700,
    padding: '1px 4px',
    borderRadius: '2px 0 0 2px',
    transform: 'translateY(-50%)',
  },

  // Right column
  rightCol: {
    width: '280px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
    background: 'var(--border-1)',
    flexShrink: 0,
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
    padding: '5px 10px',
    background: 'var(--bg-panel-2)',
    borderBottom: '1px solid var(--border-1)',
    height: '28px',
  },
  panelTitle: {
    fontSize: '10px',
    fontWeight: 700,
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    display: 'flex',
    alignItems: 'center',
  },
  greeksGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1px',
    background: 'var(--border-1)',
  },
  greekCard: {
    padding: '8px 10px',
    background: 'var(--bg-panel)',
  },
  greekLabel: {
    fontSize: '9px',
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: '2px',
  },
  greekVal: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-white)',
  },
  greekSub: {
    fontSize: '8.5px',
    color: 'var(--text-muted)',
    marginTop: '2px',
  },

  // Quick order
  quickOrderBody: { padding: '8px', display: 'flex', flexDirection: 'column', gap: '6px' },
  quickOrderGrid: { display: 'flex', flexDirection: 'column', gap: '4px' },
  quickBtn: {
    display: 'flex',
    flexDirection: 'column',
    padding: '6px 8px',
    background: 'var(--bg-panel-2)',
    border: '1px solid var(--border-2)',
    borderRadius: '3px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 120ms ease',
  },
  quickBtnLabel: { fontSize: '11px', fontWeight: 600, color: 'var(--text-white)' },
  quickBtnPrice: { fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' },
  quickBtnSub: { fontSize: '9px', color: 'var(--text-muted)' },
  riskNotice: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '9.5px',
    color: 'var(--text-muted)',
    padding: '4px 6px',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '3px',
  },

  // Bottom dock
  dockWrap: {
    height: '180px',
    background: 'var(--bg-panel)',
    borderTop: '1px solid var(--border-1)',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
  },
  dockTabBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 8px',
    background: 'var(--bg-panel-2)',
    borderBottom: '1px solid var(--border-1)',
    height: '28px',
    flexShrink: 0,
  },
  dockTab: {
    padding: '4px 10px',
    fontSize: '11px',
    background: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    fontWeight: 500,
  },
  dockTabActive: {
    color: 'var(--text-white)',
    borderBottomColor: '#3b82f6',
    fontWeight: 600,
  },
  dockMeta: { display: 'flex', alignItems: 'center', gap: '8px' },
  dockMetaSep: { width: 1, height: 12, background: 'var(--border-1)' },
  dockTableWrap: { flex: 1, overflow: 'auto' },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: '20px',
  },
};
