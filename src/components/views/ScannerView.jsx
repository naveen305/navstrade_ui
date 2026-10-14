import React from 'react';
import { useTrading } from '../../context/TradingContext';
import { Radar, ArrowRight, TrendingUp, TrendingDown, Activity } from 'lucide-react';

export const ScannerView = () => {
  const { scannerSignals, openOrderTicket, watchlist, setSelectedSymbol } = useTrading();

  const signalTag = (signal) => {
    if (signal.includes('Long') || signal.includes('Bullish')) return 'tag-up';
    if (signal.includes('Short') || signal.includes('Bear')) return 'tag-down';
    if (signal.includes('Range')) return 'tag-neutral';
    return 'tag-info';
  };

  const confColor = (conf) => {
    if (conf.includes('HIGH')) return 'var(--up)';
    if (conf.includes('MEDIUM')) return 'var(--warn)';
    return 'var(--text-muted)';
  };

  return (
    <div style={S.root}>
      {/* Header bar */}
      <div style={S.titleBar}>
        <Radar size={15} style={{ color: 'var(--text-secondary)' }} />
        <span style={S.pageTitle}>F&O Market Scanner</span>
        <div style={S.scanMeta}>
          <span className="live-dot" />
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Scanning 184 NSE F&O stocks · Every 3s</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="tag tag-warn">4 setups found</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Filters: OI buildup, Volume spike, Breakout</span>
        </div>
      </div>

      {/* Explanation strip */}
      <div style={S.explainBar}>
        <Activity size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          Scanner flags stocks with <strong style={{ color: 'var(--text-secondary)' }}>abnormal OI buildup</strong> (institutional activity),
          volume &gt;1.5× average, and IV conditions matching your strategy templates.
          Only trade signals marked <strong style={{ color: 'var(--up)' }}>HIGH confidence (≥80%)</strong>.
        </span>
      </div>

      {/* Scanner table */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <table className="data-table" style={{ fontSize: '12px' }}>
          <thead>
            <tr>
              <th>Symbol</th>
              <th style={{ textAlign: 'right' }}>Price</th>
              <th>Signal</th>
              <th style={{ textAlign: 'right' }}>OI Change</th>
              <th style={{ textAlign: 'right' }}>Volume Spike</th>
              <th style={{ textAlign: 'right' }}>PCR</th>
              <th>Confidence</th>
              <th>Suggested Setup</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {scannerSignals.map((sig, i) => {
              const matched = watchlist.find(w => w.symbol === sig.symbol);
              return (
                <tr key={i}>
                  <td style={{ fontWeight: 700, color: 'var(--text-white)' }}>{sig.symbol}</td>
                  <td className="font-data" style={{ textAlign: 'right' }}>₹{sig.price.toFixed(2)}</td>
                  <td><span className={`tag ${signalTag(sig.signal)}`}>{sig.signal}</span></td>
                  <td className="font-data" style={{ textAlign: 'right', color: 'var(--up)', fontWeight: 600 }}>{sig.oiChangePct}</td>
                  <td className="font-data" style={{ textAlign: 'right', color: 'var(--accent)' }}>{sig.volumeMultiplier}</td>
                  <td className="font-data" style={{ textAlign: 'right', color: Number(sig.pcr) >= 1 ? 'var(--up)' : 'var(--down)', fontWeight: 600 }}>
                    {sig.pcr}
                  </td>
                  <td>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: confColor(sig.confidence) }}>
                      {sig.confidence}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '11.5px' }}>{sig.suggestedAction}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ gap: '4px' }}
                      onClick={() => {
                        if (matched) setSelectedSymbol(matched);
                        openOrderTicket({
                          symbol: `${sig.symbol} — ${sig.suggestedAction}`,
                          action: 'BUY', price: 65, sl: 45, target: 110,
                          lotSize: matched?.lotSize || 100,
                          qty: matched?.lotSize || 100,
                          strategy: sig.suggestedAction
                        });
                      }}
                    >
                      Trade <ArrowRight size={11} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Educational call-out below */}
        <div style={S.footerNote}>
          <strong>How to use:</strong> Only act on HIGH confidence (≥80%) signals. Open the order ticket, verify the suggested defined-risk setup,
          let the automatic lot sizer cap your maximum loss to ≤1.5% of capital, then submit.
          Do not enter without a stop loss — the system enforces this at the order level.
        </div>
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
  scanMeta: { display: 'flex', alignItems: 'center', gap: '5px', marginLeft: '4px' },
  explainBar: {
    display: 'flex', alignItems: 'flex-start', gap: '8px',
    padding: '8px 14px', background: '#151515',
    borderBottom: '1px solid var(--border-1)', flexShrink: 0,
  },
  footerNote: {
    margin: '12px 14px',
    padding: '10px 12px',
    background: 'var(--bg-panel)',
    border: '1px solid var(--border-1)',
    borderRadius: '4px',
    fontSize: '11px',
    color: 'var(--text-muted)',
    lineHeight: '1.5',
  },
};
