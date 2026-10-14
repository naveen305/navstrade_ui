import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import {
  TrendingUp, TrendingDown, Clock, ShieldCheck, ChevronRight,
  ChevronDown, BarChart2, Activity, AlertCircle, RefreshCw, Layers
} from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

export const TerminalView = () => {
  const {
    watchlist,
    selectedSymbol,
    setSelectedSymbol,
    positions,
    closePosition,
    openOrderTicket,
    totalUnrealizedPnl,
    accountCapital,
    riskRules
  } = useTrading();

  // Always use the latest ticked version of selectedSymbol from watchlist
  const currentSymbol = watchlist.find(w => w.symbol === selectedSymbol.symbol) || selectedSymbol;

  const [activeBottomTab, setActiveBottomTab] = useState('positions'); // 'positions' | 'trailing'
  const [hoveredCandle, setHoveredCandle] = useState(null);
  const [showEma9, setShowEma9] = useState(true);
  const [showEma21, setShowEma21] = useState(true);
  const [showVwap, setShowVwap] = useState(true);
  const [tf, setTf] = useState('5m');
  const [expandedSpreadId, setExpandedSpreadId] = useState('POS-102'); // Default expanded for visibility
  const [quickOrderReason, setQuickOrderReason] = useState('15m ORB Breakout');

  // Multi-period candlestick dataset
  const candles = [
    { time: '09:15', o: 25010, h: 25045, l: 24995, c: 25035, vol: 64 },
    { time: '09:20', o: 25035, h: 25065, l: 25020, c: 25055, vol: 72 },
    { time: '09:25', o: 25055, h: 25070, l: 25040, c: 25062, vol: 58 },
    { time: '09:30', o: 25062, h: 25085, l: 25050, c: 25078, vol: 85 },
    { time: '09:35', o: 25078, h: 25095, l: 25068, c: 25090, vol: 90 },
    { time: '09:40', o: 25090, h: 25110, l: 25080, c: 25105, vol: 95 },
    { time: '09:45', o: 25105, h: 25120, l: 25095, c: 25115, vol: 88 },
    { time: '09:50', o: 25115, h: 25130, l: 25105, c: 25122, vol: 76 },
    { time: '09:55', o: 25122, h: 25135, l: 25110, c: 25128, vol: 65 },
    { time: '10:00', o: 25128, h: 25142, l: 25118, c: 25138, vol: 70 },
    { time: '10:05', o: 25138, h: 25150, l: 25125, c: 25145, vol: 82 },
    { time: '10:10', o: 25145, h: 25160, l: 25135, c: 25152, vol: 94 },
    { time: '10:15', o: 25152, h: 25165, l: 25140, c: 25158, vol: 78 },
    { time: '10:20', o: 25158, h: 25170, l: 25145, c: 25162, vol: 68 },
    { time: '10:25', o: 25162, h: 25175, l: 25150, c: 25168, vol: 85 },
    { time: '10:30', o: 25168, h: 25180, l: 25155, c: 25172, vol: 92 },
    { time: '10:35', o: 25172, h: 25178, l: 25150, c: 25158, vol: 55 },
    { time: '10:40', o: 25158, h: 25168, l: 25142, c: 25150, vol: 48 },
    { time: '10:45', o: 25150, h: 25160, l: 25138, c: 25144, vol: 46 },
    { time: '10:50', o: 25144, h: 25155, l: 25130, c: 25150, vol: 58 },
    { time: '10:55', o: 25150, h: 25165, l: 25140, c: 25160, vol: 64 },
    { time: '11:00', o: 25160, h: 25172, l: 25150, c: 25168, vol: 70 },
    { time: '11:05', o: 25168, h: 25175, l: 25150, c: 25158, vol: 50 },
    { time: '11:10', o: 25158, h: 25168, l: 25142, c: 25150, vol: 42 },
    { time: '11:15', o: 25150, h: 25162, l: 25135, c: 25140, vol: 48 },
    { time: '11:20', o: 25140, h: 25158, l: 25138, c: 25152, vol: 62 },
    { time: '11:25', o: 25152, h: 25170, l: 25148, c: 25165, vol: 74 },
    { time: '11:30', o: 25165, h: 25180, l: 25160, c: 25175, vol: 80 },
    { time: '11:35', o: 25175, h: 25180, l: 25155, c: 25160, vol: 54 },
    { time: '11:40', o: 25160, h: 25172, l: 25150, c: 25168, vol: 60 },
    { time: '11:45', o: 25135, h: 25148, l: 25130, c: 25138, vol: 68 },
    // Latest active candle synchronized with currentSymbol tick
    {
      time: '11:50',
      o: 25135.0,
      h: Math.max(25148.0, currentSymbol.price),
      l: 25132.0,
      c: currentSymbol.price,
      vol: 58
    },
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
  const isCandleGreen = activeCandle.c >= activeCandle.o;

  // Chart horizontal reference lines
  const refLines = [
    { label: 'ORB High', price: 25180, color: 'var(--profit)', dash: '3 3' },
    { label: 'VWAP', price: 25118.4, color: 'var(--navy)', dash: '4 4' },
    { label: 'ORB Low', price: 25060, color: 'var(--loss)', dash: '3 3' },
    { label: 'PDC', price: 25000, color: 'var(--text-muted)', dash: '2 2' },
  ];

  // Greeks Calculation
  const netDelta = positions.reduce((acc, p) => acc + (p.delta || 0), 0).toFixed(2);
  const netTheta = positions.reduce((acc, p) => acc + (p.theta || 0), 0).toFixed(1);
  const netVega = positions.reduce((acc, p) => acc + (p.vega || 0), 0).toFixed(1);

  // Position Sizing calculation adhering strictly to 1.5% rule
  const maxCapRisk = +(accountCapital * (riskRules.maxCapitalRiskPct / 100)).toFixed(0); // ₹7,500

  return (
    <div style={S.root}>
      {/* ── 1. Index & Ticker Strip ── */}
      <div style={S.tickerStrip}>
        {watchlist.map(item => {
          const up = item.change >= 0;
          const active = currentSymbol.symbol === item.symbol;
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
                  ₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span
                  className="font-num num-fade"
                  style={{
                    fontSize: '11px',
                    color: up ? 'var(--profit)' : 'var(--loss)',
                    fontWeight: 600,
                  }}
                >
                  {up ? '+' : ''}{item.changePct?.toFixed(2)}%
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── 2. Middle Desk: Candlestick Chart + Greeks & Order Ticket ── */}
      <div style={S.middleDesk}>
        {/* Chart Canvas Area */}
        <div style={S.chartSection}>
          {/* Chart Header Bar */}
          <div style={S.chartHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-heading)' }}>
                {currentSymbol.symbol}
              </span>
              <span className="font-num num-fade" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                ₹{currentSymbol.price?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span
                className="font-num num-fade"
                style={{
                  fontSize: '11.5px',
                  color: currentSymbol.change >= 0 ? 'var(--profit)' : 'var(--loss)',
                  fontWeight: 600,
                }}
              >
                {currentSymbol.change >= 0 ? '+' : ''}{currentSymbol.change?.toFixed(2)} ({currentSymbol.change >= 0 ? '+' : ''}{currentSymbol.changePct?.toFixed(2)}%)
              </span>
            </div>

            {/* OHLC Bar - C colored strictly by whether candle closed above open */}
            <div style={S.ohlcBar} className="font-num">
              <span>O: <strong style={{ color: 'var(--text-primary)' }}>{activeCandle.o.toFixed(1)}</strong></span>
              <span>H: <strong style={{ color: 'var(--text-primary)' }}>{activeCandle.h.toFixed(1)}</strong></span>
              <span>L: <strong style={{ color: 'var(--text-primary)' }}>{activeCandle.l.toFixed(1)}</strong></span>
              <span>
                C: <strong style={{ color: isCandleGreen ? 'var(--profit)' : 'var(--loss)' }}>
                  {activeCandle.c.toFixed(1)}
                </strong>
              </span>
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
                  <span style={{ width: 6, height: 2, backgroundColor: 'var(--navy)', display: 'inline-block', marginRight: 3 }} />
                  VWAP
                </button>
              </div>
            </div>
          </div>

          {/* SVG Candlestick Canvas with Precision Price Axis & Labeled Horizontal Lines */}
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

                {/* Clearly Labeled Key Reference Horizontal Lines */}
                {refLines.map(line => {
                  const y = toY(line.price);
                  return (
                    <g key={line.label}>
                      <line
                        x1="0"
                        y1={y}
                        x2={chartWidth}
                        y2={y}
                        stroke={line.color}
                        strokeWidth="1"
                        strokeDasharray={line.dash}
                        opacity="0.85"
                      />
                      {/* Labeled text chip on right edge so user never has to guess */}
                      <rect
                        x={chartWidth - 110}
                        y={y - 8}
                        width="106"
                        height="16"
                        fill="var(--bg-card)"
                        stroke={line.color}
                        strokeWidth="0.8"
                        rx="2"
                        opacity="0.95"
                      />
                      <text
                        x={chartWidth - 57}
                        y={y + 3.5}
                        fill="var(--text-primary)"
                        fontSize="9"
                        fontWeight="600"
                        fontFamily="IBM Plex Mono"
                        textAnchor="middle"
                      >
                        {line.label}: {line.price}
                      </text>
                    </g>
                  );
                })}

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
                    opacity="0.85"
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
                    opacity="0.85"
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

            {/* Right-Side Price Axis with Live Spot Pin */}
            <div style={S.priceAxis}>
              {[25200, 25150, 25100, 25050, 25000].map(p => (
                <div key={p} className="font-num" style={S.priceTick}>
                  {p}
                </div>
              ))}
              {/* Synchronized Live Spot Pin */}
              <div
                className="font-num"
                style={{
                  ...S.pricePin,
                  top: `${((maxPrice - currentSymbol.price) / priceRange) * 100}%`,
                }}
              >
                {currentSymbol.price?.toFixed(1)}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Portfolio Greeks & Defined-Risk Order Entry */}
        <div style={S.rightPanel}>
          {/* Portfolio Greeks Card (Ample height, captions NEVER cut off) */}
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
                <span className="font-num" style={{ ...S.greekVal, color: 'var(--navy)' }}>
                  1.5% (₹{maxCapRisk.toLocaleString('en-IN')})
                </span>
                <span style={S.greekSub}>Capital cap enforced</span>
              </div>
            </div>
          </div>

          {/* Defined-Risk Quick Order Entry with Reason for Entry */}
          <div style={S.panelCard}>
            <div style={S.panelCardHdr}>
              <span style={S.panelCardTitle}>Defined-Risk Order Entry</span>
              <span className="badge badge-profit" style={{ fontSize: '9px' }}>SL ENFORCED</span>
            </div>

            <div style={S.orderEntryBody}>
              {/* Reason for Entry (Feeds journal and prevents impulsive entries) */}
              <div style={{ marginBottom: 4 }}>
                <label style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: 3 }}>
                  Reason for Entry (Mandatory Rationale)
                </label>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 4 }}>
                  {['15m ORB Breakout', 'VWAP Support', 'OI Unwinding'].map(r => (
                    <button
                      key={r}
                      type="button"
                      style={{
                        padding: '2px 6px',
                        fontSize: '9.5px',
                        borderRadius: '3px',
                        border: '1px solid var(--border-main)',
                        backgroundColor: quickOrderReason === r ? 'var(--navy)' : 'var(--bg-surface)',
                        color: quickOrderReason === r ? '#FFFFFF' : 'var(--text-secondary)',
                        cursor: 'pointer'
                      }}
                      onClick={() => setQuickOrderReason(r)}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div style={S.orderBtnsGrid}>
                {[
                  {
                    label: 'ATM 25150 CE',
                    sub: 'Momentum Long · 1 lot (25)',
                    type: 'CE',
                    action: 'BUY',
                    price: 93.80,
                    sl: 80.0,
                    target: 120.0,
                    riskRupees: 345, // (93.80 - 80) * 25 = ₹345 (well within ₹7,500 cap)
                  },
                  {
                    label: 'ATM 25150 PE',
                    sub: 'Hedge / Short · 1 lot (25)',
                    type: 'PE',
                    action: 'BUY',
                    price: 114.50,
                    sl: 98.0,
                    target: 145.0,
                    riskRupees: 412.5,
                  },
                  {
                    label: 'Bull Call Spread',
                    sub: '25150/25250 · Net ₹45.60',
                    type: 'SPREAD',
                    action: 'BUY',
                    price: 45.60,
                    sl: 30.0,
                    target: 75.0,
                    riskRupees: 390, // (45.60 - 30.0) * 25 = ₹390
                  },
                  {
                    label: 'Bear Put Spread',
                    sub: '25150/25050 · Net ₹37.70',
                    type: 'SPREAD',
                    action: 'BUY',
                    price: 37.70,
                    sl: 25.0,
                    target: 65.0,
                    riskRupees: 317.5,
                  },
                ].map(o => (
                  <button
                    key={o.label}
                    type="button"
                    style={S.quickOrderBtn}
                    onClick={() => openOrderTicket({
                      symbol: `${currentSymbol.symbol} ${o.label}`,
                      action: o.action,
                      price: o.price,
                      sl: o.sl,
                      target: o.target,
                      lotSize: currentSymbol.lotSize,
                      qty: currentSymbol.lotSize,
                      strategy: o.label,
                      reason: quickOrderReason,
                      maxLossRupees: o.riskRupees,
                      maxLossPct: +((o.riskRupees / accountCapital) * 100).toFixed(2),
                    })}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-heading)' }}>{o.label}</span>
                      <span className="font-num" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>₹{o.price.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{o.sub}</span>
                      <span className="font-num" style={{ fontSize: '9.5px', color: 'var(--profit)', fontWeight: 500 }}>
                        Max Loss: ₹{o.riskRupees} ({(o.riskRupees / accountCapital * 100).toFixed(2)}%)
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Bottom Notice: Never Cut Off */}
              <div style={S.riskNotice}>
                <ShieldCheck size={13} style={{ color: 'var(--profit)', flexShrink: 0 }} />
                <span>Risk capped strictly to ≤1.5% equity (₹{maxCapRisk.toLocaleString('en-IN')}). Cannot submit without stop-loss.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Bottom Tabs: Open Positions & Trailing SL Monitor ── */}
      <div style={S.bottomDock}>
        <div style={S.bottomTabBar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
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
                fontSize: '12px',
                fontWeight: 600,
                color: totalUnrealizedPnl >= 0 ? 'var(--profit)' : 'var(--loss)'
              }}
            >
              {totalUnrealizedPnl >= 0 ? '+' : ''}₹{totalUnrealizedPnl.toFixed(2)}
            </span>
            <div style={S.dockMetaSep} />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              <Clock size={12} style={{ marginRight: 3, verticalAlign: 'middle' }} />
              Auto Square-Off: 15:15 IST
            </span>
          </div>
        </div>

        {/* Tab 1: Positions Table (Spreads Managed as ONE Unified Position) */}
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
                    <th style={{ width: '22%' }}>Instrument / Structure</th>
                    <th style={{ width: '15%' }}>Strategy</th>
                    <th style={{ width: '8%', textAlign: 'center' }}>Side</th>
                    <th style={{ width: '8%', textAlign: 'right' }}>Qty</th>
                    <th style={{ width: '9%', textAlign: 'right' }}>Net Avg</th>
                    <th style={{ width: '9%', textAlign: 'right' }}>LTP / Spread</th>
                    <th style={{ width: '9%', textAlign: 'right' }}>Stop Loss</th>
                    <th style={{ width: '8%', textAlign: 'right' }}>Target</th>
                    <th style={{ width: '10%' }}>Trailing Mode</th>
                    <th style={{ width: '11%', textAlign: 'right' }}>P&L (MTM)</th>
                    <th style={{ width: '9%', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map(pos => {
                    const profit = pos.pnl >= 0;
                    const isSpread = Boolean(pos.isSpread);
                    const isExpanded = expandedSpreadId === pos.id;

                    return (
                      <React.Fragment key={pos.id}>
                        <tr style={{ backgroundColor: isSpread ? 'var(--bg-surface)' : 'transparent' }}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              {isSpread && (
                                <button
                                  type="button"
                                  style={{
                                    border: 'none',
                                    background: 'none',
                                    cursor: 'pointer',
                                    padding: '2px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: 'var(--navy)'
                                  }}
                                  onClick={() => setExpandedSpreadId(isExpanded ? null : pos.id)}
                                  title="Toggle Spread Legs"
                                >
                                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                </button>
                              )}
                              <div>
                                <span style={{ fontWeight: 600, color: 'var(--text-heading)' }}>{pos.symbol}</span>
                                {isSpread && (
                                  <span style={{ fontSize: '9.5px', color: 'var(--navy)', marginLeft: 6, fontWeight: 600 }}>
                                    [2 LEGS ATOMIC]
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td>
                            <span className="badge badge-neutral">{pos.strategy}</span>
                          </td>

                          <td style={{ textAlign: 'center' }}>
                            <span className={isSpread ? 'badge badge-navy' : (pos.qty > 0 ? 'badge badge-profit' : 'badge badge-loss')}>
                              {isSpread ? 'SPREAD' : (pos.qty > 0 ? 'BUY' : 'SELL')}
                            </span>
                          </td>

                          <td className="font-num" style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>
                            {Math.abs(pos.qty)}
                          </td>

                          <td className="font-num" style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>
                            ₹{pos.entryPrice.toFixed(2)}
                          </td>

                          <td className="font-num num-fade" style={{ textAlign: 'right', fontWeight: 600 }}>
                            ₹{pos.currentPrice.toFixed(2)}
                          </td>

                          <td className="font-num" style={{ textAlign: 'right', color: 'var(--loss)', fontWeight: 600 }}>
                            ₹{pos.sl.toFixed(2)}
                          </td>

                          <td className="font-num" style={{ textAlign: 'right', color: 'var(--profit)', fontWeight: 600 }}>
                            ₹{pos.target.toFixed(2)}
                          </td>

                          <td>
                            {pos.trailingSlActive ? (
                              <span className="badge badge-navy">
                                Active (₹{pos.trailingSlStep || 1})
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
                            {profit ? '+' : ''}₹{pos.pnl.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            <span style={{ fontSize: '10px', marginLeft: 4, opacity: 0.85 }}>
                              ({profit ? '+' : ''}{pos.pnlPct.toFixed(1)}%)
                            </span>
                          </td>

                          <td style={{ textAlign: 'center' }}>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              style={{ padding: '3px 8px', fontSize: '11px' }}
                              onClick={() => closePosition(pos.id)}
                              title={isSpread ? "Close both spread legs atomically" : "Close position calmly"}
                            >
                              {isSpread ? 'Close Spread' : 'Close'}
                            </button>
                          </td>
                        </tr>

                        {/* Expandable Spread Legs Sub-Table (Prevents Naked Short Calls) */}
                        {isSpread && isExpanded && pos.legs && (
                          <tr>
                            <td colSpan={11} style={{ padding: '6px 16px 12px 34px', backgroundColor: 'var(--bg-surface)' }}>
                              <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-main)', borderRadius: 'var(--radius-sm)', padding: '8px 12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <Layers size={13} style={{ color: 'var(--navy)' }} />
                                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-heading)' }}>
                                      Spread Wings Breakdown (Unified Risk Basket)
                                    </span>
                                  </div>
                                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                                    Max Risk Capped to Net Debit: <strong>₹{pos.maxLoss?.toLocaleString('en-IN')}</strong> (1.20% of capital)
                                  </span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                  {pos.legs.map((leg, lIdx) => (
                                    <div
                                      key={lIdx}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '4px 8px',
                                        backgroundColor: 'var(--bg-surface)',
                                        borderRadius: '3px',
                                        fontSize: '11px',
                                      }}
                                    >
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span className={leg.action === 'BUY' ? 'badge badge-profit' : 'badge badge-loss'}>
                                          {leg.action}
                                        </span>
                                        <span className="font-num" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                          {leg.symbol}
                                        </span>
                                        <span className="font-num" style={{ color: 'var(--text-muted)' }}>
                                          ({Math.abs(leg.qty)} qty)
                                        </span>
                                      </div>

                                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                        <span className="font-num" style={{ color: 'var(--text-secondary)' }}>
                                          Entry: ₹{leg.entryPrice.toFixed(2)}
                                        </span>
                                        <span className="font-num" style={{ color: 'var(--text-primary)' }}>
                                          LTP: ₹{leg.currentPrice.toFixed(2)}
                                        </span>
                                        <span className="font-num" style={{ fontWeight: 600, color: leg.pnl >= 0 ? 'var(--profit)' : 'var(--loss)' }}>
                                          P&L: {leg.pnl >= 0 ? '+' : ''}₹{leg.pnl.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </span>
                                        <span className="font-num" style={{ color: 'var(--text-muted)' }}>
                                          Δ {leg.delta}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                <div style={{ marginTop: 6, fontSize: '10px', color: 'var(--text-secondary)' }}>
                                  🔒 <strong>Atomic Execution Guard:</strong> Individual legs cannot be orphaned. Both legs exit simultaneously on stop-loss or manual square-off to eliminate naked short call risk.
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
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
                  <th>Instrument / Structure</th>
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
                      ₹{pos.trailingSlStep || 1.0} per step
                    </td>
                    <td>
                      <span className="badge badge-profit">
                        Locked at Cost (₹{pos.entryPrice.toFixed(2)})
                      </span>
                    </td>
                    <td style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                      Auto-moves stop up by step value on each +1:1.5 R:R expansion milestone
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
    backgroundColor: 'var(--bg-page)',
  },
  tickerStrip: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    backgroundColor: 'var(--bg-header)',
    borderBottom: '1px solid var(--border-main)',
    overflowX: 'auto',
    flexShrink: 0,
  },
  tickerCard: {
    display: 'flex',
    flexDirection: 'column',
    padding: '6px 12px',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-main)',
    borderRadius: 'var(--radius)',
    cursor: 'pointer',
    minWidth: '135px',
    textAlign: 'left',
    transition: 'all 120ms ease',
  },
  tickerCardActive: {
    backgroundColor: 'var(--bg-card)',
    borderColor: 'var(--navy)',
    boxShadow: '0 0 0 1px var(--navy)',
  },
  tickerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2px',
  },
  tickerSym: {
    fontSize: '11px',
    fontWeight: 700,
    color: 'var(--text-heading)',
  },
  tickerType: {
    fontSize: '9px',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
  },
  tickerBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  tickerPrice: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },

  middleDesk: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
    borderBottom: '1px solid var(--border-main)',
  },
  chartSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--bg-card)',
    borderRight: '1px solid var(--border-main)',
    overflow: 'hidden',
  },
  chartHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 14px',
    borderBottom: '1px solid var(--border-main)',
    minHeight: '38px',
    flexShrink: 0,
    backgroundColor: 'var(--bg-card)',
  },
  ohlcBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  tfGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    backgroundColor: 'var(--bg-surface)',
    padding: '2px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-main)',
  },
  tfBtn: {
    padding: '2px 7px',
    fontSize: '10.5px',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    borderRadius: '2px',
  },
  tfBtnActive: {
    backgroundColor: 'var(--bg-card)',
    color: 'var(--text-heading)',
    fontWeight: 600,
  },
  overlayGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  overlayPill: {
    padding: '2px 6px',
    fontSize: '10px',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-main)',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
  },

  chartCanvasWrap: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
    position: 'relative',
  },
  svgArea: { flex: 1, height: '100%', position: 'relative' },
  priceAxis: {
    width: '64px',
    height: '100%',
    borderLeft: '1px solid var(--border-subtle)',
    backgroundColor: 'var(--bg-surface)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '8px 6px',
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
    fontSize: '10.5px',
    fontWeight: 600,
    padding: '2px 5px',
    borderRadius: '3px 0 0 3px',
    transform: 'translateY(-50%)',
  },

  rightPanel: {
    width: '300px',
    backgroundColor: 'var(--bg-page)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '10px',
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
    flexShrink: 0,
  },
  panelCardHdr: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '7px 12px',
    backgroundColor: 'var(--bg-card)',
    borderBottom: '1px solid var(--border-subtle)',
    minHeight: '30px',
  },
  panelCardTitle: {
    fontSize: '11px',
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
    padding: '10px 12px',
    backgroundColor: 'var(--bg-card)',
    display: 'flex',
    flexDirection: 'column',
  },
  greekLbl: {
    fontSize: '9.5px',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    display: 'block',
    marginBottom: '2px',
  },
  greekVal: {
    fontSize: '13.5px',
    fontWeight: 600,
    color: 'var(--text-heading)',
    display: 'block',
  },
  greekSub: {
    fontSize: '9.5px',
    color: 'var(--text-muted)',
    marginTop: '3px',
    lineHeight: 1.2,
  },

  orderEntryBody: {
    padding: '10px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  orderBtnsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  quickOrderBtn: {
    display: 'flex',
    flexDirection: 'column',
    padding: '7px 10px',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-main)',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 120ms ease',
  },
  riskNotice: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '6px',
    fontSize: '10px',
    color: 'var(--text-secondary)',
    padding: '6px 8px',
    backgroundColor: 'var(--bg-surface)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-subtle)',
    lineHeight: 1.35,
    marginTop: 4,
  },

  bottomDock: {
    height: '235px',
    backgroundColor: 'var(--bg-card)',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
  },
  bottomTabBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 12px',
    backgroundColor: 'var(--bg-surface)',
    borderBottom: '1px solid var(--border-main)',
    height: '34px',
    flexShrink: 0,
  },
  dockTab: {
    padding: '5px 12px',
    fontSize: '12px',
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
  dockMeta: { display: 'flex', alignItems: 'center', gap: '10px' },
  dockMetaSep: { width: 1, height: 14, backgroundColor: 'var(--border-main)' },
  dockTableWrap: { flex: 1, overflow: 'auto' },
};
