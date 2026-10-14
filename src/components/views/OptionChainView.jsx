import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { StatBadge } from '../common/StatBadge';

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
          <StatBadge variant="neutral">WEEKLY EXPIRY</StatBadge>
          <div style={S.spotPill}>
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>SPOT</span>
            <span className="font-num" style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-heading)' }}>
              ₹{selectedSymbol.price?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Telemetry Metrics: PCR, Max Pain, Total OI, IV Rank */}
        <div style={S.summaryMetrics}>
          <div style={S.metricCard}>
            <span style={S.metricLbl}>Put / Call Ratio (PCR)</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span className="font-num" style={{ fontSize: '12.5px', fontWeight: 600, color: Number(pcr) >= 1 ? 'var(--profit)' : 'var(--loss)' }}>
                {pcr}
              </span>
              <span style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>
                {Number(pcr) >= 1 ? 'Bullish' : 'Bearish'}
              </span>
            </div>
          </div>

          <div style={S.metricCard}>
            <span style={S.metricLbl}>Max Pain Strike</span>
            <span className="font-num" style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-heading)' }}>
              {selectedSymbol.maxPain}
            </span>
          </div>

          <div style={S.metricCard}>
            <span style={S.metricLbl}>Total Call vs Put OI</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="font-num" style={{ fontSize: '11px', color: 'var(--profit)', fontWeight: 600 }}>
                {(totalCallOI / 100000).toFixed(1)}L
              </span>
              <div style={S.oiRatioTrack}>
                <div style={{ ...S.oiRatioFill, width: `${(totalCallOI / (totalCallOI + totalPutOI)) * 100}%` }} />
              </div>
              <span className="font-num" style={{ fontSize: '11px', color: 'var(--loss)', fontWeight: 600 }}>
                {(totalPutOI / 100000).toFixed(1)}L
              </span>
            </div>
          </div>

          <div style={S.metricCard}>
            <span style={S.metricLbl}>IV Rank</span>
            <span className="font-num" style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-heading)' }}>
              {selectedSymbol.iv}%
            </span>
          </div>
        </div>
      </div>

      {/* ── Option Chain Table (Calls | Strike | Puts) ── */}
      <div style={S.tableWrap}>
        <table className="calm-table">
          <thead>
            {/* Super Header Row */}
            <tr>
              <th colSpan={7} style={S.thCallSuper}>CALLS (CE)</th>
              <th style={S.thStrikeSuper}>STRIKE</th>
              <th colSpan={7} style={S.thPutSuper}>PUTS (PE)</th>
            </tr>
            {/* Column Labels */}
            <tr>
              <th style={{ textAlign: 'left', width: '70px' }}>OI Depth</th>
              <th style={{ textAlign: 'right' }}>OI (L)</th>
              <th style={{ textAlign: 'right' }}>Chg (OI)</th>
              <th style={{ textAlign: 'right' }}>IV %</th>
              <th style={{ textAlign: 'right' }}>Delta</th>
              <th style={{ textAlign: 'right' }}>Chg ₹</th>
              <th style={{ textAlign: 'right', borderRight: '1px solid var(--border-main)' }}>LTP ₹</th>

              <th style={S.thStrike}>Strike</th>

              <th style={{ textAlign: 'left', borderLeft: '1px solid var(--border-main)' }}>LTP ₹</th>
              <th style={{ textAlign: 'right' }}>Chg ₹</th>
              <th style={{ textAlign: 'right' }}>Delta</th>
              <th style={{ textAlign: 'right' }}>IV %</th>
              <th style={{ textAlign: 'right' }}>Chg (OI)</th>
              <th style={{ textAlign: 'right' }}>OI (L)</th>
              <th style={{ textAlign: 'right', width: '70px' }}>OI Depth</th>
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
                    backgroundColor: isATM
                      ? 'var(--navy-bg)'
                      : isHovered
                      ? 'var(--bg-surface-hover)'
                      : 'transparent',
                    borderTop: isATM ? '1px solid var(--navy-border)' : undefined,
                    borderBottom: isATM ? '1px solid var(--navy-border)' : undefined,
                  }}
                >
                  {/* CE: OI Depth Bar */}
                  <td style={{ background: itmCE ? 'var(--profit-bg)' : undefined }}>
                    <div style={S.oiBarTrack}>
                      <div style={{ ...S.oiBarFill, width: `${(row.ce.oi / maxOI) * 100}%`, backgroundColor: 'var(--profit)' }} />
                    </div>
                  </td>

                  {/* CE: OI */}
                  <td className="font-num" style={{ textAlign: 'right', background: itmCE ? 'var(--profit-bg)' : undefined }}>
                    {(row.ce.oi / 100000).toFixed(1)}
                  </td>

                  {/* CE: OI Change */}
                  <td className="font-num" style={{ textAlign: 'right', color: row.ce.oiChange >= 0 ? 'var(--profit)' : 'var(--loss)', background: itmCE ? 'var(--profit-bg)' : undefined }}>
                    {row.ce.oiChange >= 0 ? '+' : ''}{(row.ce.oiChange / 1000).toFixed(0)}k
                  </td>

                  {/* CE: IV */}
                  <td className="font-num" style={{ textAlign: 'right', color: 'var(--text-muted)', background: itmCE ? 'var(--profit-bg)' : undefined }}>
                    {row.ce.iv}%
                  </td>

                  {/* CE: Delta */}
                  <td className="font-num" style={{ textAlign: 'right', color: 'var(--text-secondary)', background: itmCE ? 'var(--profit-bg)' : undefined }}>
                    {row.ce.delta}
                  </td>

                  {/* CE: Price Change */}
                  <td className="font-num num-fade" style={{ textAlign: 'right', color: row.ce.change >= 0 ? 'var(--profit)' : 'var(--loss)', background: itmCE ? 'var(--profit-bg)' : undefined }}>
                    {row.ce.change >= 0 ? '+' : ''}{row.ce.change.toFixed(1)}
                  </td>

                  {/* CE: LTP (Clickable) */}
                  <td
                    className="font-num num-fade"
                    style={{
                      textAlign: 'right',
                      fontWeight: 600,
                      color: 'var(--text-heading)',
                      cursor: 'pointer',
                      borderRight: '1px solid var(--border-main)',
                      background: itmCE ? 'var(--profit-bg)' : undefined
                    }}
                    onClick={() => openOrderTicket(makeOrder(row, 'CE', 'BUY'))}
                    title="Click to place Buy order for this Call strike"
                  >
                    <span style={S.ltpChip}>{row.ce.ltp.toFixed(2)}</span>
                  </td>

                  {/* ── STRIKE PIN ── */}
                  <td
                    className="font-num"
                    style={{
                      textAlign: 'center',
                      fontWeight: 700,
                      fontSize: '12px',
                      backgroundColor: isATM ? 'var(--navy-bg)' : 'var(--bg-surface)',
                      color: isATM ? 'var(--navy)' : 'var(--text-heading)',
                      borderRight: '1px solid var(--border-main)',
                      borderLeft: '1px solid var(--border-main)',
                    }}
                  >
                    {row.strike}
                    {isATM && (
                      <span
                        style={{
                          fontSize: '8.5px',
                          fontWeight: 700,
                          backgroundColor: 'var(--navy)',
                          color: '#FFFFFF',
                          padding: '1px 4px',
                          borderRadius: '2px',
                          marginLeft: '4px',
                        }}
                      >
                        ATM
                      </span>
                    )}
                  </td>

                  {/* PE: LTP (Clickable) */}
                  <td
                    className="font-num num-fade"
                    style={{
                      textAlign: 'left',
                      fontWeight: 600,
                      color: 'var(--text-heading)',
                      cursor: 'pointer',
                      borderLeft: '1px solid var(--border-main)',
                      background: itmPE ? 'var(--loss-bg)' : undefined
                    }}
                    onClick={() => openOrderTicket(makeOrder(row, 'PE', 'BUY'))}
                    title="Click to place Buy order for this Put strike"
                  >
                    <span style={S.ltpChip}>{row.pe.ltp.toFixed(2)}</span>
                  </td>

                  {/* PE: Price Change */}
                  <td className="font-num num-fade" style={{ textAlign: 'right', color: row.pe.change >= 0 ? 'var(--profit)' : 'var(--loss)', background: itmPE ? 'var(--loss-bg)' : undefined }}>
                    {row.pe.change >= 0 ? '+' : ''}{row.pe.change.toFixed(1)}
                  </td>

                  {/* PE: Delta */}
                  <td className="font-num" style={{ textAlign: 'right', color: 'var(--text-secondary)', background: itmPE ? 'var(--loss-bg)' : undefined }}>
                    {row.pe.delta}
                  </td>

                  {/* PE: IV */}
                  <td className="font-num" style={{ textAlign: 'right', color: 'var(--text-muted)', background: itmPE ? 'var(--loss-bg)' : undefined }}>
                    {row.pe.iv}%
                  </td>

                  {/* PE: OI Change */}
                  <td className="font-num" style={{ textAlign: 'right', color: row.pe.oiChange >= 0 ? 'var(--profit)' : 'var(--loss)', background: itmPE ? 'var(--loss-bg)' : undefined }}>
                    {row.pe.oiChange >= 0 ? '+' : ''}{(row.pe.oiChange / 1000).toFixed(0)}k
                  </td>

                  {/* PE: OI */}
                  <td className="font-num" style={{ textAlign: 'right', background: itmPE ? 'var(--loss-bg)' : undefined }}>
                    {(row.pe.oi / 100000).toFixed(1)}
                  </td>

                  {/* PE: OI Depth Bar */}
                  <td style={{ background: itmPE ? 'var(--loss-bg)' : undefined }}>
                    <div style={S.oiBarTrack}>
                      <div style={{ ...S.oiBarFill, width: `${(row.pe.oi / maxOI) * 100}%`, backgroundColor: 'var(--loss)' }} />
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
    backgroundColor: 'var(--bg-card)',
    borderBottom: '1px solid var(--border-main)',
    height: '40px',
    flexShrink: 0,
  },
  summaryLeft: { display: 'flex', alignItems: 'center', gap: '8px' },
  chainTitle: { fontSize: '12.5px', fontWeight: 700, color: 'var(--text-heading)' },
  spotPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '2px 8px',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-main)',
    borderRadius: 'var(--radius-sm)',
  },
  summaryMetrics: { display: 'flex', alignItems: 'center', gap: '16px' },
  metricCard: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' },
  metricLbl: { fontSize: '8.5px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' },
  oiRatioTrack: {
    width: '36px',
    height: '4px',
    backgroundColor: 'var(--loss-bg)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  oiRatioFill: {
    height: '100%',
    backgroundColor: 'var(--profit)',
  },

  tableWrap: { flex: 1, overflow: 'auto', backgroundColor: 'var(--bg-card)' },
  thCallSuper: {
    padding: '4px',
    backgroundColor: 'var(--profit-bg)',
    color: 'var(--profit)',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.04em',
    textAlign: 'center',
    borderRight: '1px solid var(--border-main)',
  },
  thStrikeSuper: {
    padding: '4px',
    backgroundColor: 'var(--bg-surface)',
    color: 'var(--text-heading)',
    fontSize: '10px',
    fontWeight: 700,
    textAlign: 'center',
    width: '80px',
  },
  thPutSuper: {
    padding: '4px',
    backgroundColor: 'var(--loss-bg)',
    color: 'var(--loss)',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.04em',
    textAlign: 'center',
    borderLeft: '1px solid var(--border-main)',
  },
  thStrike: {
    backgroundColor: 'var(--bg-surface)',
    color: 'var(--text-heading)',
    fontSize: '10.5px',
    fontWeight: 600,
    textAlign: 'center',
    padding: '5px 8px',
    borderBottom: '1px solid var(--border-main)',
    borderRight: '1px solid var(--border-main)',
    borderLeft: '1px solid var(--border-main)',
  },
  ltpChip: {
    padding: '1px 4px',
    borderRadius: 'var(--radius-sm)',
    transition: 'background-color 120ms ease',
  },
  oiBarTrack: {
    width: '100%',
    height: '3px',
    backgroundColor: 'var(--bg-surface)',
    borderRadius: '1px',
    overflow: 'hidden',
  },
  oiBarFill: {
    height: '100%',
    borderRadius: '1px',
  },
};
