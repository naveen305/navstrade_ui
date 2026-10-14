import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { Crosshair, Clock, ShieldCheck, ChevronRight, BarChart2, TrendingUp } from 'lucide-react';
import { StatBadge } from '../common/StatBadge';
import { EmptyState } from '../common/EmptyState';

export const TerminalView = () => {
  const {
    watchlist, selectedSymbol, setSelectedSymbol,
    positions, closePosition, openOrderTicket,
    totalUnrealizedPnl
  } = useTrading();

  const [tf, setTf] = useState('5m');
  const [activeBottomTab, setActiveBottomTab] = useState('positions'); // 'positions' | 'trailing'
  const [showEma9, setShowEma9] = useState(true);
  const [showEma21, setShowEma21] = useState(true);
  const [showVwap, setShowVwap] = useState(true);
  const [hoveredCandle, setHoveredCandle] = useState(null);

  // Portfolio Greeks
  const netDelta = positions.reduce((s, p) => s + (p.delta || 0) * Math.sign(p.qty), 0).toFixed(2);
  const netTheta = positions.reduce((s, p) => s + (p.theta || 0), 0).toFixed(1);
  const netVega  = positions.reduce((s, p) => s + (p.vega  || 0), 0).toFixed(1);

  // 32 Precision Intraday 5m Candles
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
  const chartHeight = 225;
  const chartWidth = 720;
  const candleW = 11;
  const stepX = chartWidth / candles.length;

  const toY = (val) => chartHeight - ((val - minPrice) / priceRange) * chartHeight;
  const activeCandle = hoveredCandle || candles[candles.length - 1];

  return (
    <div style={S.root}>
      {/* ── 1. Index & Ticker Strip ── */}
      <div style={S.tickerStrip}>
        {watchlist.map(item => {
          const up = item.change >= 0;
          const active = selectedSymbol.symbol === item.symbol;
          return (
            <button
              key={item.symbol}
              type="button"
              style={{ ...S.tickerCard, ...(active ? S.tickerCardActive : {}) }}
              onClick={() => setSelectedSymbol(item)}
            >
              <div style={S.tickerTop}>
                <span style={S.tickerSym}>{item.symbol}</span>
                <span style={S.tickerType}>{item.type}</span>
              </div>
              <div style={S.tickerBottom}>
                <span className="font-num" style={S.tickerPrice}>
                  ₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span
                  className="font-num num-fade"
                  style={{
                    fontSize: '10.5px',
                    color: up ? 'var(--profit)' : 'var(--loss)',
                    fontWeight: 500,
                  }}
                >
                  {up ? '+' : ''}{item.changePct?.toFixed(2)}%
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── 2. Main Workspace ── */}
      <div style={S.workspace}>

        {/* Left: Candlestick Chart */}
        <div style={S.chartPanel}>
          {/* Chart Toolbar */}
          <div style={S.chartToolbar}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-heading)' }}>
                {selectedSymbol.symbol}
              </span>
              <span className="font-num" style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                ₹{selectedSymbol.price?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span
                className="font-num"
                style={{
                  fontSize: '11px',
                  color: selectedSymbol.change >= 0 ? 'var(--profit)' : 'var(--loss)',
                  fontWeight: 500,
                }}
              >
                {selectedSymbol.change >= 0 ? '+' : ''}{selectedSymbol.change?.toFixed(2)} ({selectedSymbol.changePct?.toFixed(2)}%)
              </span>
            </div>

            {/* OHLC Bar */}
            <div style={S.ohlcBar} className="font-num">
              <span>O: <strong style={{ color: 'var(--text-primary)' }}>{activeCandle.o.toFixed(1)}</strong></span>
              <span>H: <strong style={{ color: 'var(--text-primary)' }}>{activeCandle.h.toFixed(1)}</strong></span>
              <span>L: <strong style={{ color: 'var(--text-primary)' }}>{activeCandle.l.toFixed(1)}</strong></span>
              <span>C: <strong style={{ color: activeCandle.c >= activeCandle.o ? 'var(--profit)' : 'var(--loss)' }}>{activeCandle.c.toFixed(1)}</strong></span>
              <span>Vol: <strong style={{ color: 'var(--text-secondary)' }}>{activeCandle.vol}K</strong></span>
            </div>

            {/* Timeframe & Overlays */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={S.tfGroup}>
                {['1m', '3m', '5m', '15m', '1D'].map(t => (
                  <button
                    key={t}
                    type="button"
                    style={{ ...S.tfBtn, ...(tf === t ? S.tfBtnActive : {}) }}
                    onClick={() => setTf(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* EMA & VWAP Overlays Toggle */}
              <div style={S.overlayGroup}>
                <button
                  type="button"
                  style={{ ...S.overlayPill, opacity: showEma9 ? 1 : 0.4 }}
                  onClick={() => setShowEma9(!showEma9)}
                  title="Toggle 9 EMA"
                >
                  <span style={{ width: 6, height: 2, backgroundColor: 'var(--navy)', display: 'inline-block', marginRight: 3 }} />
                  EMA 9
                </button>
                <button
                  type="button"
                  style={{ ...S.overlayPill, opacity: showEma21 ? 1 : 0.4 }}
                  onClick={() => setShowEma21(!showEma21)}
                  title="Toggle 21 EMA"
                >
                  <span style={{ width: 6, height: 2, backgroundColor: 'var(--warning)', display: 'inline-block', marginRight: 3 }} />
                  EMA 21
                </button>
                <button
                  type="button"
                  style={{ ...S.overlayPill, opacity: showVwap ? 1 : 0.4 }}
                  onClick={() => setShowVwap(!showVwap)}
                  title="Toggle VWAP"
                >
                  <span style={{ width: 6, height: 2, backgroundColor: '#8A929F', display: 'inline-block', marginRight: 3 }} />
                  VWAP
                </button>
              </div>
            </div>
          </div>

          {/* SVG Candlestick Canvas with Precision Price Axis */}
          <div style={S.chartCanvasWrap}>
            <div style={S.svgArea}>
              <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
                {/* Horizontal Grid lines */}
                {[25000, 25050, 25100, 25150].map(p => {
                  const y = toY(p);
                  return (
                    <line key={p} x1="0" y1={y} x2={chartWidth} y2={y} stroke="var(--border-subtle)" strokeWidth="1" strokeDasharray="3 3" />
                  );
                })}

                {/* VWAP Overlay */}
                {showVwap && (
                  <line
                    x1="0"
                    y1={toY(selectedSymbol.vwap || 25088)}
                    x2={chartWidth}
                    y2={toY(selectedSymbol.vwap || 25088)}
                    stroke="#8A929F"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                )}

                {/* Volume Histogram */}
                {candles.map((c, i) => {
                  const x = i * stepX + stepX / 2;
                  const isUp = c.c >= c.o;
                  const volH = (c.vol / 100) * 40;
                  return (
                    <rect
                      key={`vol-${i}`}
                      x={x - 4}
                      y={chartHeight - volH}
                      width="8"
                      height={volH}
                      fill={isUp ? 'var(--profit)' : 'var(--loss)'}
                      opacity="0.18"
                      rx="1"
                    />
                  );
                })}

                {/* EMA 9 Curve */}
                {showEma9 && (
                  <path
                    d={candles.map((c, i) => {
                      const x = i * stepX + stepX / 2;
                      const y = toY(c.c - 4);
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="var(--navy)"
                    strokeWidth="1.25"
                    opacity="0.8"
                  />
                )}

                {/* EMA 21 Curve */}
                {showEma21 && (
                  <path
                    d={candles.map((c, i) => {
                      const x = i * stepX + stepX / 2;
                      const y = toY(c.o * 0.4 + c.c * 0.6 - 10);
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="var(--warning)"
                    strokeWidth="1.25"
                    opacity="0.8"
                  />
                )}

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
                  const candleColor = isUp ? 'var(--profit)' : 'var(--loss)';

                  return (
                    <g
                      key={`candle-${i}`}
                      onMouseEnter={() => setHoveredCandle(c)}
                      onMouseLeave={() => setHoveredCandle(null)}
                      style={{ cursor: 'crosshair' }}
                    >
                      {/* Upper & Lower Wick */}
                      <line x1={x} y1={yH} x2={x} y2={yL} stroke={candleColor} strokeWidth="1" />
                      {/* Real Body */}
                      <rect
                        x={x - candleW / 2}
                        y={bodyTop}
                        width={candleW}
                        height={bodyH}
                        fill={candleColor}
                        rx="1"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Right-Side Price Axis */}
            <div style={S.priceAxis}>
              {[25200, 25150, 25100, 25050, 25000].map(p => (
                <div key={p} className="font-num" style={S.priceTick}>
                  {p}
                </div>
              ))}
              {/* Live Spot Pin */}
              <div
                className="font-num"
                style={{
                  ...S.pricePin,
                  top: `${((maxPrice - selectedSymbol.price) / priceRange) * 100}%`,
                }}
              >
                {selectedSymbol.price?.toFixed(1)}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Portfolio Greeks & Defined-Risk Order Entry */}
        <div style={S.rightPanel}>

          {/* Portfolio Greeks Card */}
          <div style={S.panelCard}>
            <div style={S.panelCardHdr}>
              <span style={S.panelCardTitle}>Portfolio Greeks</span>
              <span style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>NET EXPOSURE</span>
            </div>

            <div style={S.greeksGrid}>
              <div style={S.greekItem}>
                <span style={S.greekLbl}>Net Delta (Δ)</span>
                <span className="font-num" style={S.greekVal}>
                  {Number(netDelta) >= 0 ? `+${netDelta}` : netDelta}
                </span>
                <span style={S.greekSub}>Directional sensitivity</span>
              </div>
              <div style={S.greekItem}>
                <span style={S.greekLbl}>Net Theta (Θ) / day</span>
                <span className="font-num" style={{ ...S.greekVal, color: Number(netTheta) < -25 ? 'var(--loss)' : 'var(--text-primary)' }}>
                  ₹{netTheta}
                </span>
                <span style={S.greekSub}>Time decay rate</span>
              </div>
              <div style={S.greekItem}>
                <span style={S.greekLbl}>Net Vega (ν)</span>
                <span className="font-num" style={S.greekVal}>
                  +{netVega}
                </span>
                <span style={S.greekSub}>IV sensitivity</span>
              </div>
              <div style={S.greekItem}>
                <span style={S.greekLbl}>Max Risk / Trade</span>
                <span className="font-num" style={S.greekVal}>
                  1.5%
                </span>
                <span style={S.greekSub}>Capital cap enforced</span>
              </div>
            </div>
          </div>

          {/* Defined-Risk Quick Order Entry */}
          <div style={S.panelCard}>
            <div style={S.panelCardHdr}>
              <span style={S.panelCardTitle}>Defined-Risk Order Entry</span>
              <span className="badge badge-profit" style={{ fontSize: '9px' }}>SL ENFORCED</span>
            </div>

            <div style={S.orderEntryBody}>
              <div style={S.orderBtnsGrid}>
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
                    sub: 'Hedge / Short',
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
                    type="button"
                    style={S.quickOrderBtn}
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-heading)' }}>{o.label}</span>
                      <span className="font-num" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>₹{o.price.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{o.sub}</span>
                      <span style={{ fontSize: '9.5px', color: 'var(--profit)' }}>Auto-Sized</span>
                    </div>
                  </button>
                ))}
              </div>

              <div style={S.riskNotice}>
                <ShieldCheck size={12} style={{ color: 'var(--profit)', flexShrink: 0 }} />
                <span>Risk capped strictly to ≤1.5% equity. Cannot submit without stop-loss.</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── 3. Bottom Tabs: Open Positions & Trailing SL Monitor ── */}
      <div style={S.bottomDock}>
        <div style={S.bottomTabBar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <button
              type="button"
              style={{ ...S.dockTab, ...(activeBottomTab === 'positions' ? S.dockTabActive : {}) }}
              onClick={() => setActiveBottomTab('positions')}
            >
              Open Positions ({positions.length})
            </button>
            <button
              type="button"
              style={{ ...S.dockTab, ...(activeBottomTab === 'trailing' ? S.dockTabActive : {}) }}
              onClick={() => setActiveBottomTab('trailing')}
            >
              Trailing SL Monitor ({positions.filter(p => p.trailingSlActive).length})
            </button>
          </div>

          <div style={S.dockMeta}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Unrealized MTM:</span>
            <span
              className="font-num num-fade"
              style={{
                fontSize: '11.5px',
                fontWeight: 600,
                color: totalUnrealizedPnl >= 0 ? 'var(--profit)' : 'var(--loss)'
              }}
            >
              {totalUnrealizedPnl >= 0 ? '+' : ''}₹{totalUnrealizedPnl.toFixed(2)}
            </span>
            <div style={S.dockMetaSep} />
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
              <Clock size={11} style={{ marginRight: 3, verticalAlign: 'middle' }} />
              Auto Square-Off: 15:15 IST
            </span>
          </div>
        </div>

        {/* Tab 1: Positions Table */}
        {activeBottomTab === 'positions' && (
          <div style={S.dockTableWrap}>
            {positions.length === 0 ? (
              <EmptyState
                icon={BarChart2}
                title="No active open positions"
                description="Orders placed via Terminal or Strategy Pack with predefined stop-loss will show here."
              />
            ) : (
              <table className="calm-table">
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
                    <th style={{ textAlign: 'right' }}>P&L</th>
                    <th style={{ textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map(pos => {
                    const profit = pos.pnl >= 0;
                    return (
                      <tr key={pos.id}>
                        <td style={{ fontWeight: 600, color: 'var(--text-heading)' }}>{pos.symbol}</td>
                        <td>
                          <span className="badge badge-neutral">{pos.strategy}</span>
                        </td>
                        <td>
                          <span className={pos.qty > 0 ? 'badge badge-profit' : 'badge badge-loss'}>
                            {pos.qty > 0 ? 'BUY' : 'SELL'}
                          </span>
                        </td>
                        <td className="font-num" style={{ textAlign: 'right' }}>{Math.abs(pos.qty)}</td>
                        <td className="font-num" style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>
                          ₹{pos.entryPrice.toFixed(2)}
                        </td>
                        <td className="font-num num-fade" style={{ textAlign: 'right', fontWeight: 600 }}>
                          ₹{pos.currentPrice.toFixed(2)}
                        </td>
                        <td className="font-num" style={{ textAlign: 'right', color: 'var(--loss)' }}>
                          ₹{pos.sl.toFixed(2)}
                        </td>
                        <td className="font-num" style={{ textAlign: 'right', color: 'var(--profit)' }}>
                          ₹{pos.target.toFixed(2)}
                        </td>
                        <td>
                          {pos.trailingSlActive ? (
                            <span className="badge badge-navy">
                              Active (₹{pos.trailingSlStep || 2})
                            </span>
                          ) : (
                            <span className="badge badge-neutral">Fixed SL</span>
                          )}
                        </td>
                        <td
                          className="font-num num-fade"
                          style={{
                            textAlign: 'right',
                            fontWeight: 600,
                            color: profit ? 'var(--profit)' : 'var(--loss)'
                          }}
                        >
                          {profit ? '+' : ''}₹{pos.pnl.toFixed(2)}
                          <span style={{ fontSize: '10px', marginLeft: 4, opacity: 0.85 }}>
                            ({profit ? '+' : ''}{pos.pnlPct.toFixed(1)}%)
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            style={{ padding: '2px 7px', fontSize: '10.5px' }}
                            onClick={() => closePosition(pos.id)}
                            title="Close position calmly"
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
        )}

        {/* Tab 2: Trailing SL Monitor */}
        {activeBottomTab === 'trailing' && (
          <div style={S.dockTableWrap}>
            <table className="calm-table">
              <thead>
                <tr>
                  <th>Instrument</th>
                  <th>Current SL Trigger</th>
                  <th>Trail Distance</th>
                  <th>Break-Even Lock</th>
                  <th>Trail Logic</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {positions.map(pos => (
                  <tr key={`trail-${pos.id}`}>
                    <td style={{ fontWeight: 600, color: 'var(--text-heading)' }}>{pos.symbol}</td>
                    <td className="font-num" style={{ color: 'var(--loss)', fontWeight: 600 }}>
                      ₹{pos.sl.toFixed(2)}
                    </td>
                    <td className="font-num">
                      ₹{pos.trailingSlStep || 2.0} per step
                    </td>
                    <td>
                      <span className="badge badge-profit">
                        Locked at Cost (₹{pos.entryPrice.toFixed(2)})
                      </span>
                    </td>
                    <td style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                      Auto-moves stop up by step value on each +1:1.5 R:R milestone
                    </td>
                    <td>
                      <span className="badge badge-navy">
                        {pos.trailingSlActive ? 'MONITORING' : 'OFF'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
  tickerStrip: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'var(--bg-card)',
    borderBottom: '1px solid var(--border-main)',
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
    backgroundColor: 'transparent',
    border: '1px solid transparent',
    borderRadius: 'var(--radius)',
    cursor: 'pointer',
    minWidth: '135px',
    textAlign: 'left',
    height: '36px',
    transition: 'all 120ms ease',
  },
  tickerCardActive: {
    backgroundColor: 'var(--bg-surface)',
    borderColor: 'var(--border-main)',
  },
  tickerTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' },
  tickerSym: { fontSize: '11px', fontWeight: 600, color: 'var(--text-heading)' },
  tickerType: { fontSize: '8.5px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em' },
  tickerBottom: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' },
  tickerPrice: { fontSize: '11.5px', color: 'var(--text-secondary)' },

  workspace: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
    borderBottom: '1px solid var(--border-main)',
  },
  chartPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--bg-card)',
    borderRight: '1px solid var(--border-main)',
    overflow: 'hidden',
  },
  chartToolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '6px 12px',
    backgroundColor: 'var(--bg-card)',
    borderBottom: '1px solid var(--border-subtle)',
    height: '36px',
    flexShrink: 0,
  },
  ohlcBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  tfGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '1px',
    backgroundColor: 'var(--bg-surface)',
    padding: '2px',
    borderRadius: 'var(--radius)',
  },
  tfBtn: {
    padding: '2px 7px',
    fontSize: '11px',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    borderRadius: 'var(--radius-sm)',
  },
  tfBtnActive: {
    backgroundColor: 'var(--bg-card)',
    color: 'var(--text-heading)',
    fontWeight: 600,
  },
  overlayGroup: { display: 'flex', alignItems: 'center', gap: '3px' },
  overlayPill: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '10.5px',
    color: 'var(--text-secondary)',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-main)',
    padding: '2px 6px',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
  },

  chartCanvasWrap: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'var(--bg-card)',
  },
  svgArea: { flex: 1, height: '100%', position: 'relative' },
  priceAxis: {
    width: '56px',
    height: '100%',
    borderLeft: '1px solid var(--border-subtle)',
    backgroundColor: 'var(--bg-surface)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '8px 4px',
    position: 'relative',
    flexShrink: 0,
  },
  priceTick: {
    fontSize: '10.5px',
    color: 'var(--text-muted)',
    textAlign: 'right',
  },
  pricePin: {
    position: 'absolute',
    right: 0,
    backgroundColor: 'var(--profit)',
    color: '#FFFFFF',
    fontSize: '10px',
    fontWeight: 600,
    padding: '1px 4px',
    borderRadius: '2px 0 0 2px',
    transform: 'translateY(-50%)',
  },

  rightPanel: {
    width: '280px',
    backgroundColor: 'var(--bg-page)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '8px',
    overflowY: 'auto',
    flexShrink: 0,
  },
  panelCard: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-main)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  panelCardHdr: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '6px 10px',
    backgroundColor: 'var(--bg-card)',
    borderBottom: '1px solid var(--border-subtle)',
    minHeight: '28px',
  },
  panelCardTitle: {
    fontSize: '10.5px',
    fontWeight: 700,
    color: 'var(--text-heading)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  greeksGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1px',
    backgroundColor: 'var(--border-subtle)',
  },
  greekItem: {
    padding: '8px 10px',
    backgroundColor: 'var(--bg-card)',
  },
  greekLbl: {
    fontSize: '9px',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    display: 'block',
    marginBottom: '2px',
  },
  greekVal: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-heading)',
    display: 'block',
  },
  greekSub: {
    fontSize: '9px',
    color: 'var(--text-muted)',
    marginTop: '2px',
  },

  orderEntryBody: {
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  orderBtnsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  quickOrderBtn: {
    display: 'flex',
    flexDirection: 'column',
    padding: '6px 8px',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-main)',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 120ms ease',
  },
  riskNotice: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '9.5px',
    color: 'var(--text-muted)',
    padding: '4px 6px',
    backgroundColor: 'var(--bg-surface)',
    borderRadius: 'var(--radius-sm)',
    lineHeight: 1.3,
  },

  bottomDock: {
    height: '185px',
    backgroundColor: 'var(--bg-card)',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
  },
  bottomTabBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 8px',
    backgroundColor: 'var(--bg-surface)',
    borderBottom: '1px solid var(--border-main)',
    height: '30px',
    flexShrink: 0,
  },
  dockTab: {
    padding: '4px 10px',
    fontSize: '11.5px',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    fontWeight: 500,
  },
  dockTabActive: {
    color: 'var(--text-heading)',
    borderBottomColor: 'var(--navy)',
    fontWeight: 600,
  },
  dockMeta: { display: 'flex', alignItems: 'center', gap: '8px' },
  dockMetaSep: { width: 1, height: 12, backgroundColor: 'var(--border-main)' },
  dockTableWrap: { flex: 1, overflow: 'auto' },
};
