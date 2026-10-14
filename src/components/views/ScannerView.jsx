import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { Radar, ArrowRight, Activity, Filter, CheckCircle2 } from 'lucide-react';

export const ScannerView = () => {
  const { scannerSignals, openOrderTicket, watchlist, setSelectedSymbol } = useTrading();
  const [activeCategory, setActiveCategory] = useState('ALL');

  const filtered = scannerSignals.filter(sig => {
    if (activeCategory === 'ALL') return true;
    if (activeCategory === 'HIGH_CONF') return sig.confidenceScore >= 80;
    if (activeCategory === 'BULLISH') return sig.category === 'Bullish Buildup';
    if (activeCategory === 'BEARISH') return sig.category === 'Short Buildup';
    if (activeCategory === 'BREAKOUT') return sig.category === 'Breakout';
    if (activeCategory === 'RANGE') return sig.category === 'Range-Bound';
    return true;
  });

  const signalTag = (category) => {
    if (category === 'Bullish Buildup') return 'tag-up';
    if (category === 'Short Buildup') return 'tag-down';
    if (category === 'Breakout') return 'tag-info';
    return 'tag-neutral';
  };

  return (
    <div style={S.root}>
      {/* ── Toolbar ── */}
      <div style={S.toolbar}>
        <div style={S.toolLeft}>
          <Radar size={14} style={{ color: 'var(--text-secondary)' }} />
          <span style={S.pageTitle}>F&O Institutional Activity Scanner</span>
          <div style={S.liveBadge}>
            <span className="live-dot" />
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Scanning 184 NSE F&O Stocks</span>
          </div>
        </div>

        {/* Category Filters */}
        <div style={S.filterGroup}>
          {[
            { id: 'ALL', label: `All (${scannerSignals.length})` },
            { id: 'HIGH_CONF', label: 'High Conf ≥80%' },
            { id: 'BULLISH', label: 'Bullish Buildup' },
            { id: 'BEARISH', label: 'Short Buildup' },
            { id: 'BREAKOUT', label: 'Breakouts' },
            { id: 'RANGE', label: 'Range-Bound' },
          ].map(f => (
            <button
              key={f.id}
              style={{ ...S.filterBtn, ...(activeCategory === f.id ? S.filterBtnActive : {}) }}
              onClick={() => setActiveCategory(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
          {filtered.length} Setups Found
        </div>
      </div>

      {/* ── Educational Strategy Strip ── */}
      <div style={S.alertStrip}>
        <Activity size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>
          System flags abnormal OI accumulation, 15m volume spikes (&gt;1.5x), and PCR divergence.
          Only trade signals matching predefined defined-risk templates with mandatory stop-losses.
        </span>
      </div>

      {/* ── Dense Scanner Table ── */}
      <div style={S.tableWrap}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th style={{ textAlign: 'right' }}>Price (₹)</th>
              <th>Signal Type</th>
              <th style={{ textAlign: 'right' }}>OI Change</th>
              <th style={{ textAlign: 'right' }}>Vol Multiple</th>
              <th style={{ textAlign: 'right' }}>PCR</th>
              <th style={{ textAlign: 'center' }}>Confidence</th>
              <th>Suggested Strategy Leg</th>
              <th style={{ textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((sig, i) => {
              const matched = watchlist.find(w => w.symbol === sig.symbol);
              const isHigh = sig.confidenceScore >= 80;

              return (
                <tr key={i}>
                  <td style={{ fontWeight: 600, color: 'var(--text-white)' }}>
                    {sig.symbol}
                  </td>
                  <td className="font-data" style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>
                    ₹{sig.price.toFixed(2)}
                  </td>
                  <td>
                    <span className={`tag ${signalTag(sig.category)}`}>
                      {sig.signal}
                    </span>
                  </td>
                  <td
                    className="font-data"
                    style={{
                      textAlign: 'right',
                      fontWeight: 600,
                      color: sig.oiChangePct.startsWith('+') ? 'var(--up)' : 'var(--down)'
                    }}
                  >
                    {sig.oiChangePct}
                  </td>
                  <td className="font-data" style={{ textAlign: 'right', color: 'var(--text-primary)' }}>
                    {sig.volumeMultiplier}
                  </td>
                  <td
                    className="font-data"
                    style={{
                      textAlign: 'right',
                      fontWeight: 600,
                      color: Number(sig.pcr) >= 1 ? 'var(--up)' : 'var(--down)'
                    }}
                  >
                    {sig.pcr}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span
                      className="font-data"
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        color: isHigh ? 'var(--up)' : 'var(--warn)',
                        background: isHigh ? 'var(--up-bg)' : 'var(--warn-bg)',
                        padding: '1.5px 5px',
                        borderRadius: '2px',
                        border: isHigh ? '1px solid var(--up-border)' : '1px solid var(--warn-border)'
                      }}
                    >
                      {sig.confidenceScore}%
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-primary)', fontSize: '11px' }}>
                    {sig.suggestedAction}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{
                        padding: '2px 8px',
                        fontSize: '10px',
                        gap: '3px',
                        color: '#60a5fa',
                        borderColor: 'rgba(59, 130, 246, 0.3)'
                      }}
                      onClick={() => {
                        if (matched) setSelectedSymbol(matched);
                        openOrderTicket({
                          symbol: `${sig.symbol} — ${sig.suggestedAction}`,
                          action: 'BUY',
                          price: +(sig.price * 0.05).toFixed(1),
                          sl: +(sig.price * 0.035).toFixed(1),
                          target: +(sig.price * 0.08).toFixed(1),
                          lotSize: matched?.lotSize || 100,
                          qty: matched?.lotSize || 100,
                          strategy: sig.suggestedAction
                        });
                      }}
                    >
                      Deploy Ticket
                      <ArrowRight size={10} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Footer Guidance ── */}
      <div style={S.footer}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CheckCircle2 size={12} style={{ color: 'var(--up)' }} />
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            Institutional Filter Rule: Scanner auto-rejects any trade exceeding 1.5% maximum capital risk. Stop losses are hardcoded on order transmission.
          </span>
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
  liveBadge: { display: 'flex', alignItems: 'center', gap: '5px', marginLeft: '6px' },
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
  alertStrip: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    background: 'var(--bg-panel)',
    borderBottom: '1px solid var(--border-1)',
    flexShrink: 0,
  },
  tableWrap: { flex: 1, overflow: 'auto', background: 'var(--bg-panel)' },
  footer: {
    padding: '6px 12px',
    background: 'var(--bg-panel-2)',
    borderTop: '1px solid var(--border-1)',
    flexShrink: 0,
  },
};
