import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';

export const OptionChainView = () => {
  const { optionChain, selectedSymbol, openOrderTicket } = useTrading();
  const [hoveredStrike, setHoveredStrike] = useState(null);

  const totalCallOI = optionChain.reduce((a, r) => a + r.ce.oi, 0);
  const totalPutOI  = optionChain.reduce((a, r) => a + r.pe.oi, 0);
  const pcr = (totalPutOI / totalCallOI).toFixed(2);
  const maxOI = Math.max(...optionChain.flatMap(r => [r.ce.oi, r.pe.oi]));

  const makeOrder = (row, side, action = 'BUY') => ({
    symbol: `${selectedSymbol.symbol} ${row.strike} ${side}`,
    action,
    price: side === 'CE' ? row.ce.ltp : row.pe.ltp,
    sl: +(side === 'CE' ? row.ce.ltp * 0.82 : row.pe.ltp * 0.82).toFixed(1),
    target: +(side === 'CE' ? row.ce.ltp * 1.35 : row.pe.ltp * 1.35).toFixed(1),
    lotSize: selectedSymbol.lotSize,
    qty: selectedSymbol.lotSize,
    strategy: `${side} ${row.strike} ${action}`
  });

  return (
    <div style={S.root}>
      {/* ── Summary & Sentiment Toolbar ── */}
      <div style={S.summaryBar}>
        <div style={S.summaryLeft}>
          <span style={S.chainTitle}>{selectedSymbol.symbol} · Option Chain</span>
          <span className="tag tag-neutral">WEEKLY EXPIRY</span>
          <div style={S.spotPill}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>SPOT</span>
            <span className="font-data" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-white)' }}>
              ₹{selectedSymbol.price?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Telemetry Metrics */}
        <div style={S.summaryMetrics}>
          <div style={S.metricCard}>
            <span style={S.metricLbl}>Put / Call Ratio (PCR)</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span className="font-data" style={{ fontSize: '12.5px', fontWeight: 600, color: Number(pcr) >= 1 ? 'var(--up)' : 'var(--down)' }}>
                {pcr}
              </span>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                {Number(pcr) >= 1 ? 'Bullish' : 'Bearish'}
              </span>
            </div>
          </div>

          <div style={S.metricCard}>
            <span style={S.metricLbl}>Max Pain Strike</span>
            <span className="font-data" style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-white)' }}>
              {selectedSymbol.maxPain}
            </span>
          </div>

          <div style={S.metricCard}>
            <span style={S.metricLbl}>Total Call vs Put OI</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="font-data" style={{ fontSize: '11px', color: 'var(--up)', fontWeight: 600 }}>
                {(totalCallOI / 100000).toFixed(1)}L
              </span>
              <div style={S.oiRatioTrack}>
                <div style={{ ...S.oiRatioFill, width: `${(totalCallOI / (totalCallOI + totalPutOI)) * 100}%` }} />
              </div>
              <span className="font-data" style={{ fontSize: '11px', color: 'var(--down)', fontWeight: 600 }}>
                {(totalPutOI / 100000).toFixed(1)}L
              </span>
            </div>
          </div>

          <div style={S.metricCard}>
            <span style={S.metricLbl}>IV Rank</span>
            <span className="font-data" style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-white)' }}>
              {selectedSymbol.iv}%
            </span>
          </div>
        </div>
      </div>

      {/* ── Dense Option Chain Table ── */}
      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead>
            {/* Super-Header */}
            <tr>
              <th colSpan={7} style={S.thCallSuper}>CALLS (CE)</th>
              <th style={S.thStrikeSuper}>STRIKE</th>
              <th colSpan={7} style={S.thPutSuper}>PUTS (PE)</th>
            </tr>
            {/* Column Headers */}
            <tr>
              <th style={{ ...S.th, textAlign: 'left', width: '70px' }}>OI Bar</th>
              <th style={{ ...S.th, textAlign: 'right' }}>OI (L)</th>
              <th style={{ ...S.th, textAlign: 'right' }}>Chg (OI)</th>
              <th style={{ ...S.th, textAlign: 'right' }}>IV %</th>
              <th style={{ ...S.th, textAlign: 'right' }}>Delta</th>
              <th style={{ ...S.th, textAlign: 'right' }}>Chg ₹</th>
              <th style={{ ...S.th, textAlign: 'right', borderRight: '1px solid var(--border-2)' }}>LTP ₹</th>

              <th style={S.thStrike}>Strike</th>

              <th style={{ ...S.th, textAlign: 'left', borderLeft: '1px solid var(--border-2)' }}>LTP ₹</th>
              <th style={{ ...S.th, textAlign: 'right' }}>Chg ₹</th>
              <th style={{ ...S.th, textAlign: 'right' }}>Delta</th>
              <th style={{ ...S.th, textAlign: 'right' }}>IV %</th>
              <th style={{ ...S.th, textAlign: 'right' }}>Chg (OI)</th>
              <th style={{ ...S.th, textAlign: 'right' }}>OI (L)</th>
              <th style={{ ...S.th, textAlign: 'right', width: '70px' }}>OI Bar</th>
            </tr>
          </thead>

          <tbody>
            {optionChain.map(row => {
              const isATM = row.strike === 25150;
              const itmCE = row.strike < (selectedSymbol.price || 25142);
              const itmPE = row.strike > (selectedSymbol.price || 25142);
              const isHovered = hoveredStrike === row.strike;

              return (
                <tr
                  key={row.strike}
                  onMouseEnter={() => setHoveredStrike(row.strike)}
                  onMouseLeave={() => setHoveredStrike(null)}
                  style={{
                    background: isATM ? 'rgba(59, 130, 246, 0.06)' : isHovered ? 'var(--bg-row-hover)' : 'transparent',
                    borderTop: isATM ? '1px solid rgba(59, 130, 246, 0.3)' : undefined,
                    borderBottom: isATM ? '1px solid rgba(59, 130, 246, 0.3)' : undefined,
                  }}
                >
                  {/* CE: OI Bar */}
                  <td style={{ ...S.td, background: itmCE ? 'rgba(16, 185, 129, 0.025)' : undefined }}>
                    <div style={S.oiBarTrack}>
                      <div style={{ ...S.oiBarFill, width: `${(row.ce.oi / maxOI) * 100}%`, background: 'var(--up)' }} />
                    </div>
                  </td>

                  {/* CE: OI */}
                  <td className="font-data" style={{ ...S.td, textAlign: 'right', background: itmCE ? 'rgba(16, 185, 129, 0.025)' : undefined }}>
                    {(row.ce.oi / 100000).toFixed(1)}
                  </td>

                  {/* CE: OI Change */}
                  <td className="font-data" style={{ ...S.td, textAlign: 'right', color: row.ce.oiChange >= 0 ? 'var(--up)' : 'var(--down)', background: itmCE ? 'rgba(16, 185, 129, 0.025)' : undefined }}>
                    {row.ce.oiChange >= 0 ? '+' : ''}{(row.ce.oiChange / 1000).toFixed(0)}k
                  </td>

                  {/* CE: IV */}
                  <td className="font-data" style={{ ...S.td, textAlign: 'right', color: 'var(--text-muted)', background: itmCE ? 'rgba(16, 185, 129, 0.025)' : undefined }}>
                    {row.ce.iv}%
                  </td>

                  {/* CE: Delta */}
                  <td className="font-data" style={{ ...S.td, textAlign: 'right', color: 'var(--text-secondary)', background: itmCE ? 'rgba(16, 185, 129, 0.025)' : undefined }}>
                    {row.ce.delta}
                  </td>

                  {/* CE: Price Change */}
                  <td className="font-data" style={{ ...S.td, textAlign: 'right', color: row.ce.change >= 0 ? 'var(--up)' : 'var(--down)', background: itmCE ? 'rgba(16, 185, 129, 0.025)' : undefined }}>
                    {row.ce.change >= 0 ? '+' : ''}{row.ce.change.toFixed(1)}
                  </td>

                  {/* CE: LTP (Clickable) */}
                  <td
                    className="font-data"
                    style={{
                      ...S.td,
                      textAlign: 'right',
                      fontWeight: 600,
                      color: 'var(--text-white)',
                      cursor: 'pointer',
                      borderRight: '1px solid var(--border-2)',
                      background: itmCE ? 'rgba(16, 185, 129, 0.04)' : undefined
                    }}
                    onClick={() => openOrderTicket(makeOrder(row, 'CE', 'BUY'))}
                    title="Click to place Buy order for this Call strike"
                  >
                    <span style={S.ltpChip}>{row.ce.ltp.toFixed(2)}</span>
                  </td>

                  {/* ── STRIKE PIN ── */}
                  <td
                    className="font-data"
                    style={{
                      ...S.td,
                      textAlign: 'center',
                      fontWeight: 700,
                      fontSize: '11.5px',
                      background: isATM ? 'rgba(59, 130, 246, 0.12)' : 'var(--bg-surface)',
                      color: isATM ? '#60a5fa' : 'var(--text-white)',
                    }}
                  >
                    {row.strike}
                    {isATM && <span style={S.atmBadge}>ATM</span>}
                  </td>

                  {/* PE: LTP (Clickable) */}
                  <td
                    className="font-data"
                    style={{
                      ...S.td,
                      textAlign: 'left',
                      fontWeight: 600,
                      color: 'var(--text-white)',
                      cursor: 'pointer',
                      borderLeft: '1px solid var(--border-2)',
                      background: itmPE ? 'rgba(244, 63, 94, 0.04)' : undefined
                    }}
                    onClick={() => openOrderTicket(makeOrder(row, 'PE', 'BUY'))}
                    title="Click to place Buy order for this Put strike"
                  >
                    <span style={S.ltpChip}>{row.pe.ltp.toFixed(2)}</span>
                  </td>

                  {/* PE: Price Change */}
                  <td className="font-data" style={{ ...S.td, textAlign: 'right', color: row.pe.change >= 0 ? 'var(--up)' : 'var(--down)', background: itmPE ? 'rgba(244, 63, 94, 0.025)' : undefined }}>
                    {row.pe.change >= 0 ? '+' : ''}{row.pe.change.toFixed(1)}
                  </td>

                  {/* PE: Delta */}
                  <td className="font-data" style={{ ...S.td, textAlign: 'right', color: 'var(--text-secondary)', background: itmPE ? 'rgba(244, 63, 94, 0.025)' : undefined }}>
                    {row.pe.delta}
                  </td>

                  {/* PE: IV */}
                  <td className="font-data" style={{ ...S.td, textAlign: 'right', color: 'var(--text-muted)', background: itmPE ? 'rgba(244, 63, 94, 0.025)' : undefined }}>
                    {row.pe.iv}%
                  </td>

                  {/* PE: OI Change */}
                  <td className="font-data" style={{ ...S.td, textAlign: 'right', color: row.pe.oiChange >= 0 ? 'var(--up)' : 'var(--down)', background: itmPE ? 'rgba(244, 63, 94, 0.025)' : undefined }}>
                    {row.pe.oiChange >= 0 ? '+' : ''}{(row.pe.oiChange / 1000).toFixed(0)}k
                  </td>

                  {/* PE: OI */}
                  <td className="font-data" style={{ ...S.td, textAlign: 'right', background: itmPE ? 'rgba(244, 63, 94, 0.025)' : undefined }}>
                    {(row.pe.oi / 100000).toFixed(1)}
                  </td>

                  {/* PE: OI Bar */}
                  <td style={{ ...S.td, background: itmPE ? 'rgba(244, 63, 94, 0.025)' : undefined }}>
                    <div style={S.oiBarTrack}>
                      <div style={{ ...S.oiBarFill, width: `${(row.pe.oi / maxOI) * 100}%`, background: 'var(--down)' }} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
  summaryBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '6px 12px',
    background: 'var(--bg-panel-2)',
    borderBottom: '1px solid var(--border-1)',
    height: '38px',
    flexShrink: 0,
  },
  summaryLeft: { display: 'flex', alignItems: 'center', gap: '8px' },
  chainTitle: { fontSize: '12px', fontWeight: 700, color: 'var(--text-white)' },
  spotPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '2px 8px',
    background: 'var(--bg-panel)',
    border: '1px solid var(--border-1)',
    borderRadius: '3px',
  },
  summaryMetrics: { display: 'flex', alignItems: 'center', gap: '14px' },
  metricCard: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' },
  metricLbl: { fontSize: '8.5px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' },
  oiRatioTrack: {
    width: '36px',
    height: '4px',
    background: 'rgba(244, 63, 94, 0.3)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  oiRatioFill: {
    height: '100%',
    background: 'var(--up)',
  },

  // Table
  tableWrap: { flex: 1, overflow: 'auto', background: 'var(--bg-panel)' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '11px' },
  thCallSuper: {
    padding: '4px',
    background: 'rgba(16, 185, 129, 0.06)',
    color: 'var(--up)',
    fontSize: '9.5px',
    fontWeight: 700,
    letterSpacing: '0.06em',
    textAlign: 'center',
    borderRight: '1px solid var(--border-2)',
  },
  thStrikeSuper: {
    padding: '4px',
    background: 'var(--bg-surface)',
    color: 'var(--text-secondary)',
    fontSize: '9.5px',
    fontWeight: 700,
    textAlign: 'center',
    width: '80px',
  },
  thPutSuper: {
    padding: '4px',
    background: 'rgba(244, 63, 94, 0.06)',
    color: 'var(--down)',
    fontSize: '9.5px',
    fontWeight: 700,
    letterSpacing: '0.06em',
    textAlign: 'center',
    borderLeft: '1px solid var(--border-2)',
  },
  th: {
    background: 'var(--bg-panel-2)',
    color: 'var(--text-muted)',
    fontSize: '9.5px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    padding: '4px 6px',
    borderBottom: '1px solid var(--border-1)',
    position: 'sticky',
    top: 21,
    zIndex: 2,
    whiteSpace: 'nowrap',
  },
  thStrike: {
    background: 'var(--bg-surface)',
    color: 'var(--text-secondary)',
    fontSize: '9.5px',
    fontWeight: 600,
    textAlign: 'center',
    padding: '4px 6px',
    position: 'sticky',
    top: 21,
    zIndex: 2,
    borderBottom: '1px solid var(--border-1)',
  },
  td: {
    padding: '4px 6px',
    borderBottom: '1px solid var(--border-1)',
    whiteSpace: 'nowrap',
  },
  ltpChip: {
    padding: '1px 4px',
    borderRadius: '2px',
    transition: 'background 120ms ease',
  },
  atmBadge: {
    fontSize: '8px',
    fontWeight: 700,
    background: '#3b82f6',
    color: '#fff',
    padding: '1px 3px',
    borderRadius: '2px',
    marginLeft: '4px',
  },
  oiBarTrack: {
    width: '100%',
    height: '3px',
    background: 'rgba(255, 255, 255, 0.04)',
    borderRadius: '1px',
    overflow: 'hidden',
  },
  oiBarFill: {
    height: '100%',
    borderRadius: '1px',
  },
};
