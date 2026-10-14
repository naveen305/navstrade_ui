import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { BookOpen, TrendingUp, ShieldAlert, Award, Image, Filter, Plus, Calendar, Tag, Check, ExternalLink } from 'lucide-react';

export const JournalView = () => {
  const { journalTrades, weeklyAnalytics, showToast } = useTrading();
  const [selectedEmotion, setSelectedEmotion] = useState('ALL');
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [showNewEntryModal, setShowNewEntryModal] = useState(false);

  // New trade form state
  const [newEntry, setNewEntry] = useState({
    symbol: 'NIFTY 25200 CE',
    strategy: 'Bull Call Spread',
    side: 'BUY',
    qty: 50,
    entryPrice: 92.00,
    exitPrice: 108.50,
    pnl: 825.00,
    rMultiple: '+1.4R',
    reason: 'Price consolidated above VWAP with 15m breakout volume.',
    emotion: 'Calm',
  });

  const filteredTrades = journalTrades.filter(t => {
    if (selectedEmotion === 'ALL') return true;
    return t.emotion.toUpperCase() === selectedEmotion;
  });

  const emotionBadgeStyle = (emotion) => {
    switch (emotion) {
      case 'Calm':
        return {
          bg: 'var(--profit-bg)',
          color: 'var(--profit)',
          border: '1px solid var(--border-light)',
        };
      case 'FOMO':
        return {
          bg: 'var(--loss-bg)',
          color: 'var(--loss)',
          border: '1px solid var(--border-light)',
        };
      case 'Revenge':
        return {
          bg: 'rgba(178, 58, 72, 0.15)',
          color: 'var(--loss)',
          border: '1px solid var(--loss)',
          fontWeight: 700,
        };
      case 'Bored':
        return {
          bg: 'var(--bg-secondary)',
          color: 'var(--warning)',
          border: '1px solid var(--border-light)',
        };
      default:
        return {
          bg: 'var(--bg-secondary)',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-main)',
        };
    }
  };

  // Equity Curve SVG calculation
  const curve = weeklyAnalytics.equityCurve || [];
  const minEquity = Math.min(...curve.map(c => c.equity)) - 2000;
  const maxEquity = Math.max(...curve.map(c => c.equity)) + 2000;
  const range = maxEquity - minEquity || 1;

  const svgWidth = 680;
  const svgHeight = 130;
  const paddingX = 40;
  const paddingY = 20;

  const points = curve.map((c, i) => {
    const x = paddingX + (i / (curve.length - 1)) * (svgWidth - paddingX * 2);
    const y = svgHeight - paddingY - ((c.equity - minEquity) / range) * (svgHeight - paddingY * 2);
    return { x, y, ...c };
  });

  const polylineStr = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div style={S.root}>
      {/* ── Sub-header Toolbar ── */}
      <div style={S.toolbar}>
        <div style={S.toolLeft}>
          <BookOpen size={16} style={{ color: 'var(--navy)' }} />
          <div>
            <span style={S.pageTitle}>Systematic Trade Journal & Psychology Analytics</span>
            <span style={S.pageSubtitle}>
              Post-trade attribution · Emotion classification · Equity progression
            </span>
          </div>
        </div>

        {/* Emotion Filter Tabs */}
        <div style={S.filterGroup}>
          {[
            { id: 'ALL', label: `All Trades (${journalTrades.length})` },
            { id: 'CALM', label: 'Calm / Disciplined' },
            { id: 'FOMO', label: 'FOMO Impulse' },
            { id: 'REVENGE', label: 'Revenge Trade' },
            { id: 'BORED', label: 'Boredom Entry' },
          ].map(f => (
            <button
              key={f.id}
              style={{
                ...S.filterBtn,
                ...(selectedEmotion === f.id ? S.filterBtnActive : {})
              }}
              onClick={() => setSelectedEmotion(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <button
          className="btn btn-outline"
          style={{ fontSize: '11.5px', padding: '4px 10px', gap: 4 }}
          onClick={() => setShowNewEntryModal(true)}
        >
          <Plus size={12} />
          New Log Entry
        </button>
      </div>

      {/* ── Main Scrollable Area ── */}
      <div style={S.mainContent}>
        {/* Top: Weekly Analytics Cards + Equity Curve */}
        <div style={S.topAnalyticsGrid}>
          {/* 4 Key Stat Cards */}
          <div style={S.statCard}>
            <span style={S.statLabel}>Weekly Win Rate</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
              <span className="font-num" style={{ fontSize: '20px', fontWeight: 600, color: 'var(--profit)' }}>
                {weeklyAnalytics.winRate}%
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                ({weeklyAnalytics.totalTrades} closed)
              </span>
            </div>
            <span style={S.statSub}>Target: &gt;60% with defined R:R</span>
          </div>

          <div style={S.statCard}>
            <span style={S.statLabel}>Average Realized R</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
              <span className="font-num" style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)' }}>
                +{weeklyAnalytics.avgR}R
              </span>
              <span style={{ fontSize: '11px', color: 'var(--profit)' }}>
                (PF: {weeklyAnalytics.profitFactor})
              </span>
            </div>
            <span style={S.statSub}>Expected value per trade</span>
          </div>

          <div style={S.statCard}>
            <span style={S.statLabel}>Max Weekly Drawdown</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
              <span className="font-num" style={{ fontSize: '20px', fontWeight: 600, color: 'var(--loss)' }}>
                -₹{weeklyAnalytics.maxDrawdown.toLocaleString('en-IN')}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                (0.64% cap)
              </span>
            </div>
            <span style={S.statSub}>Kill switch limit: ₹5,000</span>
          </div>

          <div style={S.statCard}>
            <span style={S.statLabel}>Psychology Discipline Score</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
              <span className="font-num" style={{ fontSize: '20px', fontWeight: 600, color: 'var(--navy)' }}>
                {weeklyAnalytics.disciplineScore} / 100
              </span>
              <span style={{ fontSize: '11px', color: 'var(--profit)' }}>
                (Streak: {weeklyAnalytics.streakDays}d)
              </span>
            </div>
            <span style={S.statSub}>Adherence to stop-loss & sizing</span>
          </div>
        </div>

        {/* Equity Curve SVG Panel */}
        <div style={S.equityCard}>
          <div style={S.equityHeader}>
            <div>
              <span style={S.cardTitle}>Cumulative Equity Progression</span>
              <span style={S.cardSub}>Starting Capital: ₹4,90,000 → Current Equity: ₹5,07,100 (+₹17,100 / +3.49%)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 2, backgroundColor: 'var(--navy)', display: 'inline-block' }} />
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Account Equity (₹)</span>
              </div>
            </div>
          </div>

          <div style={{ padding: '8px 16px 14px 16px' }}>
            <svg width="100%" height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none">
              {/* Horizontal grid lines */}
              {[0.25, 0.5, 0.75].map((factor, idx) => {
                const y = paddingY + factor * (svgHeight - paddingY * 2);
                const val = Math.round(maxEquity - factor * range);
                return (
                  <g key={idx}>
                    <line x1={paddingX} y1={y} x2={svgWidth - paddingX} y2={y} stroke="var(--border-main)" strokeWidth="0.8" strokeDasharray="3 3" />
                    <text x={paddingX - 6} y={y + 3} fill="var(--text-muted)" fontSize="9" textAnchor="end" fontFamily="IBM Plex Mono">
                      ₹{(val / 1000).toFixed(0)}k
                    </text>
                  </g>
                );
              })}

              {/* Equity Line */}
              <polyline
                fill="none"
                stroke="var(--navy)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={polylineStr}
              />

              {/* Data points & labels */}
              {points.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="3" fill="var(--bg-surface)" stroke="var(--navy)" strokeWidth="2" />
                  <text x={p.x} y={svgHeight - 4} fill="var(--text-muted)" fontSize="9" textAnchor="middle" fontFamily="IBM Plex Mono">
                    {p.day}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Trade Log Table */}
        <div style={S.tableCard}>
          <div style={S.tableCardHeader}>
            <div>
              <span style={S.cardTitle}>Trade Log & Behavioral Attribution</span>
              <span style={S.cardSub}>Recorded rationales, stop adherence, and emotional states</span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Showing {filteredTrades.length} trades
            </span>
          </div>

          <table className="calm-table">
            <thead>
              <tr>
                <th style={{ width: '13%' }}>Date & Time</th>
                <th style={{ width: '16%' }}>Instrument</th>
                <th style={{ width: '14%' }}>Strategy</th>
                <th style={{ width: '7%', textAlign: 'center' }}>Side</th>
                <th style={{ width: '9%', textAlign: 'right' }}>Qty</th>
                <th style={{ width: '9%', textAlign: 'right' }}>Entry</th>
                <th style={{ width: '9%', textAlign: 'right' }}>Exit</th>
                <th style={{ width: '11%', textAlign: 'right' }}>Realized P&L</th>
                <th style={{ width: '8%', textAlign: 'center' }}>Return</th>
                <th style={{ width: '11%', textAlign: 'center' }}>Emotion</th>
                <th style={{ width: '6%', textAlign: 'center' }}>Chart</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrades.map((t) => {
                const isProfit = t.pnl >= 0;
                const emStyle = emotionBadgeStyle(t.emotion);

                return (
                  <React.Fragment key={t.id}>
                    <tr
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedTrade(selectedTrade?.id === t.id ? null : t)}
                    >
                      <td style={{ color: 'var(--text-secondary)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 500 }}>{t.date}</span>
                          <span className="font-num" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{t.time}</span>
                        </div>
                      </td>

                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {t.symbol}
                      </td>

                      <td style={{ color: 'var(--text-secondary)' }}>
                        {t.strategy}
                      </td>

                      <td style={{ textAlign: 'center' }}>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '1px 5px',
                            borderRadius: '3px',
                            backgroundColor: t.side === 'BUY' ? 'var(--profit-bg)' : 'var(--loss-bg)',
                            color: t.side === 'BUY' ? 'var(--profit)' : 'var(--loss)',
                          }}
                        >
                          {t.side}
                        </span>
                      </td>

                      <td className="font-num" style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>
                        {t.qty}
                      </td>

                      <td className="font-num" style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>
                        ₹{t.entryPrice.toFixed(2)}
                      </td>

                      <td className="font-num" style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>
                        ₹{t.exitPrice.toFixed(2)}
                      </td>

                      <td
                        className="font-num"
                        style={{
                          textAlign: 'right',
                          fontWeight: 600,
                          color: isProfit ? 'var(--profit)' : 'var(--loss)'
                        }}
                      >
                        {isProfit ? '+' : ''}₹{t.pnl.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>

                      <td className="font-num" style={{ textAlign: 'center', fontWeight: 600, color: isProfit ? 'var(--profit)' : 'var(--loss)' }}>
                        {t.rMultiple}
                      </td>

                      <td style={{ textAlign: 'center' }}>
                        <span
                          style={{
                            fontSize: '10.5px',
                            padding: '2px 7px',
                            borderRadius: '3px',
                            display: 'inline-block',
                            backgroundColor: emStyle.bg,
                            color: emStyle.color,
                            border: emStyle.border,
                            fontWeight: emStyle.fontWeight || 500,
                          }}
                        >
                          {t.emotion}
                        </span>
                      </td>

                      <td style={{ textAlign: 'center' }}>
                        <button
                          className="btn btn-ghost"
                          style={{ padding: '3px 6px', color: 'var(--navy)' }}
                          title="View Setup Screenshot"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTrade(t);
                          }}
                        >
                          <Image size={13} />
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Trade Rationale Drawer */}
                    {selectedTrade?.id === t.id && (
                      <tr style={{ backgroundColor: 'var(--bg-secondary)' }}>
                        <td colSpan={11} style={{ padding: '10px 16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1, paddingRight: 20 }}>
                              <span style={{ fontSize: '10.5px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: 3 }}>
                                Trade Rationale & Post-Execution Reflection:
                              </span>
                              <p style={{ fontSize: '12px', color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>
                                "{t.reason}"
                              </p>
                              {t.emotion === 'FOMO' && (
                                <p style={{ fontSize: '11px', color: 'var(--loss)', marginTop: 4, margin: '4px 0 0 0' }}>
                                  ⚠️ Psychological Warning: Identified as FOMO impulse entry. Avoid chasing after consecutive extended candles.
                                </p>
                              )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Ticket ID: #{t.id}</span>
                              <span style={{ fontSize: '10.5px', color: 'var(--profit)' }}>Status: {t.status}</span>
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
        </div>
      </div>

      {/* ── New Log Entry Modal ── */}
      {showNewEntryModal && (
        <div style={S.modalOverlay} onClick={() => setShowNewEntryModal(false)}>
          <div style={S.modalCard} onClick={e => e.stopPropagation()}>
            <div style={S.modalHeader}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Log Trade to Discipline Journal
              </span>
              <button
                className="btn btn-ghost"
                style={{ padding: '2px 6px' }}
                onClick={() => setShowNewEntryModal(false)}
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                showToast('Trade entry logged with psychological attribution', 'success');
                setShowNewEntryModal(false);
              }}
              style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={S.modalLabel}>Instrument / Symbol</label>
                  <input
                    type="text"
                    className="form-input font-num"
                    value={newEntry.symbol}
                    onChange={e => setNewEntry({ ...newEntry, symbol: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={S.modalLabel}>Strategy Template</label>
                  <select
                    className="form-input"
                    value={newEntry.strategy}
                    onChange={e => setNewEntry({ ...newEntry, strategy: e.target.value })}
                  >
                    <option value="Bull Call Spread">Bull Call Spread</option>
                    <option value="Bear Put Spread">Bear Put Spread</option>
                    <option value="Iron Condor">Iron Condor</option>
                    <option value="Momentum Breakout">Momentum Breakout</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <div>
                  <label style={S.modalLabel}>Entry Price (₹)</label>
                  <input
                    type="number"
                    step="0.05"
                    className="form-input font-num"
                    value={newEntry.entryPrice}
                    onChange={e => setNewEntry({ ...newEntry, entryPrice: Number(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <label style={S.modalLabel}>Exit Price (₹)</label>
                  <input
                    type="number"
                    step="0.05"
                    className="form-input font-num"
                    value={newEntry.exitPrice}
                    onChange={e => setNewEntry({ ...newEntry, exitPrice: Number(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <label style={S.modalLabel}>Realized P&L (₹)</label>
                  <input
                    type="number"
                    className="form-input font-num"
                    value={newEntry.pnl}
                    onChange={e => setNewEntry({ ...newEntry, pnl: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={S.modalLabel}>Emotional State During Execution</label>
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  {['Calm', 'FOMO', 'Revenge', 'Bored'].map(em => (
                    <button
                      key={em}
                      type="button"
                      style={{
                        flex: 1,
                        padding: '6px',
                        fontSize: '11px',
                        border: '1px solid var(--border-main)',
                        borderRadius: 'var(--radius)',
                        backgroundColor: newEntry.emotion === em ? 'var(--navy)' : 'var(--bg-secondary)',
                        color: newEntry.emotion === em ? '#FFFFFF' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontWeight: newEntry.emotion === em ? 600 : 400
                      }}
                      onClick={() => setNewEntry({ ...newEntry, emotion: em })}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={S.modalLabel}>Trade Setup Rationale & Lesson</label>
                <textarea
                  className="form-input"
                  rows="3"
                  style={{ resize: 'none' }}
                  value={newEntry.reason}
                  onChange={e => setNewEntry({ ...newEntry, reason: e.target.value })}
                  placeholder="Why was this trade entered? Was the stop loss respected without intervention?"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowNewEntryModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save to Journal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
    gap: 12,
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
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
  },
  filterBtn: {
    background: 'none',
    border: '1px solid var(--border-main)',
    borderRadius: 'var(--radius)',
    padding: '3px 8px',
    fontSize: '11.5px',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all 120ms ease',
  },
  filterBtnActive: {
    background: 'var(--bg-secondary)',
    borderColor: 'var(--navy)',
    color: 'var(--navy)',
    fontWeight: 600,
  },
  mainContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '12px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  topAnalyticsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 12,
  },
  statCard: {
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-main)',
    borderRadius: 'var(--radius)',
    padding: '12px 14px',
    display: 'flex',
    flexDirection: 'column',
  },
  statLabel: {
    fontSize: '10.5px',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: 'var(--text-muted)',
  },
  statSub: {
    fontSize: '10px',
    color: 'var(--text-muted)',
    marginTop: 4,
  },
  equityCard: {
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-main)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
  },
  equityHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 16px',
    borderBottom: '1px solid var(--border-main)',
  },
  tableCard: {
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-main)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
  },
  tableCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 16px',
    borderBottom: '1px solid var(--border-main)',
  },
  cardTitle: {
    fontSize: '12px',
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
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalCard: {
    width: '460px',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-main)',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow-modal)',
    overflow: 'hidden',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 16px',
    borderBottom: '1px solid var(--border-main)',
  },
  modalLabel: {
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--text-primary)',
    display: 'block',
    marginBottom: 3,
  },
};
