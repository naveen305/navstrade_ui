import React from 'react';
import { useTrading } from '../../context/TradingContext';
import { ShoppingCart, Info } from 'lucide-react';

export const OptionChainView = () => {
  const { optionChain, selectedSymbol, openOrderTicket } = useTrading();

  const totalCallOI = optionChain.reduce((a, r) => a + r.ce.oi, 0);
  const totalPutOI  = optionChain.reduce((a, r) => a + r.pe.oi, 0);
  const pcr = (totalPutOI / totalCallOI).toFixed(2);
  const maxOI = Math.max(...optionChain.flatMap(r => [r.ce.oi, r.pe.oi]));

  const makeOrder = (row, side) => ({
    symbol: `${selectedSymbol.symbol} ${row.strike} ${side}`,
    action: 'BUY',
    price: side === 'CE' ? row.ce.ltp : row.pe.ltp,
    sl: +(side === 'CE' ? row.ce.ltp * 0.82 : row.pe.ltp * 0.82).toFixed(1),
    target: +(side === 'CE' ? row.ce.ltp * 1.35 : row.pe.ltp * 1.35).toFixed(1),
    lotSize: selectedSymbol.lotSize,
    qty: selectedSymbol.lotSize,
    strategy: `${side} ${row.strike} Selection`
  });

  return (
    <div style={S.root}>
      {/* Summary bar */}
      <div style={S.summaryBar}>
        <div style={S.summaryLeft}>
          <span style={S.chainTitle}>{selectedSymbol.symbol} · Option Chain</span>
          <span className="tag tag-info" style={{ marginLeft: 8 }}>Current Week Expiry</span>
          <span style={S.spotInfo} className="font-data">
            Spot&nbsp;<strong style={{ color: 'var(--text-white)' }}>₹{selectedSymbol.price?.toLocaleString('en-IN')}</strong>
          </span>
        </div>
        <div style={S.summaryMetrics}>
          <div style={S.smCard}>
            <span style={S.smLabel}>PCR</span>
            <span className="font-data" style={{ fontWeight: 700, fontSize: '13px', color: Number(pcr) >= 1 ? 'var(--up)' : 'var(--down)' }}>
              {pcr}
            </span>
            <span style={S.smSub}>{Number(pcr) >= 1 ? 'Bullish bias' : 'Call resistance'}</span>
          </div>
          <div style={S.smCard}>
            <span style={S.smLabel}>Max Pain</span>
            <span className="font-data" style={{ fontWeight: 700, fontSize: '13px', color: 'var(--warn)' }}>
              {selectedSymbol.maxPain}
            </span>
            <span style={S.smSub}>Expiry magnet</span>
          </div>
          <div style={S.smCard}>
            <span style={S.smLabel}>Total Call OI vs Put OI</span>
            <span className="font-data" style={{ fontWeight: 600, fontSize: '12px' }}>
              <span style={{ color: 'var(--up)' }}>{(totalCallOI/100000).toFixed(1)}L</span>
              <span style={{ color: 'var(--text-muted)', margin: '0 4px' }}>vs</span>
              <span style={{ color: 'var(--down)' }}>{(totalPutOI/100000).toFixed(1)}L</span>
            </span>
          </div>
          <div style={S.smCard}>
            <span style={S.smLabel}>IV Rank</span>
            <span className="font-data" style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>
              {selectedSymbol.iv}%
            </span>
            <span style={S.smSub}>30-day percentile: 42nd</span>
          </div>
        </div>
      </div>

      {/* Main Chain Table */}
      <div style={{ flex: 1, overflow: 'auto', background: 'var(--bg-panel)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11.5px' }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 5 }}>
            {/* Section header row */}
            <tr>
              <th colSpan={6} style={{ ...S.th, background: 'rgba(38,166,154,0.08)', color: 'var(--up)', textAlign: 'center', padding: '5px', fontSize: '10px', borderRight: '2px solid var(--border-2)' }}>
                CALL OPTIONS (CE)
              </th>
              <th style={{ ...S.th, background: '#1e1e1e', textAlign: 'center', color: 'var(--text-secondary)', padding: '5px', minWidth: '80px' }}>
                STRIKE
              </th>
              <th colSpan={6} style={{ ...S.th, background: 'rgba(239,83,80,0.08)', color: 'var(--down)', textAlign: 'center', padding: '5px', fontSize: '10px', borderLeft: '2px solid var(--border-2)' }}>
                PUT OPTIONS (PE)
              </th>
            </tr>
            {/* Column labels */}
            <tr>
              {['OI (L)', 'Δ Delta', 'Θ Theta', 'IV%', 'Chg', 'LTP ₹'].map(h => (
                <th key={h} style={{ ...S.th, textAlign: 'right', borderRight: h === 'LTP ₹' ? '2px solid var(--border-2)' : undefined }}>{h}</th>
              ))}
              <th style={{ ...S.th, textAlign: 'center', background: '#1e1e1e', color: 'var(--text-secondary)' }}>Price</th>
              {['LTP ₹', 'Chg', 'IV%', 'Θ Theta', 'Δ Delta', 'OI (L)'].map((h, i) => (
                <th key={h+i} style={{ ...S.th, textAlign: i === 0 ? 'left' : 'right', borderLeft: i === 0 ? '2px solid var(--border-2)' : undefined }}>{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {optionChain.map(row => {
              const isATM = row.strike === 25150;
              const itmCE = row.strike < selectedSymbol.price;
              const itmPE = row.strike > selectedSymbol.price;
              const rowBg = isATM ? 'rgba(92,141,246,0.06)' : 'transparent';

              return (
                <tr key={row.strike} style={{ background: rowBg, borderTop: isATM ? '1px solid rgba(92,141,246,0.3)' : undefined, borderBottom: isATM ? '1px solid rgba(92,141,246,0.3)' : undefined }}>
                  {/* CE Side */}
                  <td style={{ ...S.td, textAlign: 'right', background: itmCE ? 'rgba(38,166,154,0.04)' : undefined }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                      <div style={{ width: `${(row.ce.oi/maxOI)*56}px`, height: '3px', background: 'var(--up)', borderRadius: '1px', opacity: 0.6 }} />
                      <span className="font-data">{(row.ce.oi/100000).toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="font-data" style={{ ...S.td, textAlign: 'right', color: 'var(--up)', background: itmCE ? 'rgba(38,166,154,0.04)' : undefined }}>{row.ce.delta}</td>
                  <td className="font-data" style={{ ...S.td, textAlign: 'right', color: 'var(--warn)', background: itmCE ? 'rgba(38,166,154,0.04)' : undefined }}>₹{row.ce.theta}</td>
                  <td className="font-data" style={{ ...S.td, textAlign: 'right', color: 'var(--text-secondary)', background: itmCE ? 'rgba(38,166,154,0.04)' : undefined }}>{row.ce.iv}%</td>
                  <td className="font-data" style={{ ...S.td, textAlign: 'right', color: row.ce.change >= 0 ? 'var(--up)' : 'var(--down)', background: itmCE ? 'rgba(38,166,154,0.04)' : undefined }}>
                    {row.ce.change >= 0 ? '+' : ''}{row.ce.change?.toFixed(2)}
                  </td>
                  <td
                    className="font-data"
                    style={{ ...S.td, textAlign: 'right', fontWeight: 700, color: 'var(--text-white)', cursor: 'pointer', borderRight: '2px solid var(--border-2)', background: itmCE ? 'rgba(38,166,154,0.04)' : undefined }}
                    onClick={() => openOrderTicket(makeOrder(row, 'CE'))}
                    title="Click to open Buy CE order"
                  >
                    {row.ce.ltp?.toFixed(2)}&nbsp;<ShoppingCart size={9} style={{ opacity: 0.5 }} />
                  </td>

                  {/* Strike */}
                  <td style={{ ...S.td, textAlign: 'center', fontWeight: 700, fontSize: '12px', background: '#1e1e1e', color: isATM ? 'var(--accent)' : 'var(--text-primary)', position: 'relative' }} className="font-data">
                    {row.strike}
                    {isATM && <span style={S.atmPill}>ATM</span>}
                  </td>

                  {/* PE Side */}
                  <td
                    className="font-data"
                    style={{ ...S.td, textAlign: 'left', fontWeight: 700, color: 'var(--text-white)', cursor: 'pointer', borderLeft: '2px solid var(--border-2)', background: itmPE ? 'rgba(239,83,80,0.04)' : undefined }}
                    onClick={() => openOrderTicket(makeOrder(row, 'PE'))}
                    title="Click to open Buy PE order"
                  >
                    {row.pe.ltp?.toFixed(2)}&nbsp;<ShoppingCart size={9} style={{ opacity: 0.5 }} />
                  </td>
                  <td className="font-data" style={{ ...S.td, textAlign: 'right', color: row.pe.change >= 0 ? 'var(--up)' : 'var(--down)', background: itmPE ? 'rgba(239,83,80,0.04)' : undefined }}>
                    {row.pe.change >= 0 ? '+' : ''}{row.pe.change?.toFixed(2)}
                  </td>
                  <td className="font-data" style={{ ...S.td, textAlign: 'right', color: 'var(--text-secondary)', background: itmPE ? 'rgba(239,83,80,0.04)' : undefined }}>{row.pe.iv}%</td>
                  <td className="font-data" style={{ ...S.td, textAlign: 'right', color: 'var(--warn)', background: itmPE ? 'rgba(239,83,80,0.04)' : undefined }}>₹{row.pe.theta}</td>
                  <td className="font-data" style={{ ...S.td, textAlign: 'right', color: 'var(--down)', background: itmPE ? 'rgba(239,83,80,0.04)' : undefined }}>{row.pe.delta}</td>
                  <td style={{ ...S.td, textAlign: 'right', background: itmPE ? 'rgba(239,83,80,0.04)' : undefined }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                      <span className="font-data">{(row.pe.oi/100000).toFixed(1)}</span>
                      <div style={{ width: `${(row.pe.oi/maxOI)*56}px`, height: '3px', background: 'var(--down)', borderRadius: '1px', opacity: 0.6 }} />
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
  root: { display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: 'var(--bg-base)' },
  summaryBar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '8px 14px', background: 'var(--bg-panel)',
    borderBottom: '1px solid var(--border-1)', flexShrink: 0, gap: '12px',
  },
  summaryLeft: { display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 },
  chainTitle: { fontSize: '13px', fontWeight: 700, color: 'var(--text-white)' },
  spotInfo: { fontSize: '12px', color: 'var(--text-secondary)', marginLeft: '10px' },
  summaryMetrics: { display: 'flex', gap: '1px', background: 'var(--border-1)', borderRadius: '4px', overflow: 'hidden' },
  smCard: {
    display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
    padding: '5px 12px', background: 'var(--bg-panel-2)',
    minWidth: '120px',
  },
  smLabel: { fontSize: '9px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' },
  smSub: { fontSize: '9px', color: 'var(--text-muted)' },
  th: {
    background: 'var(--bg-panel-2)', color: 'var(--text-muted)',
    fontSize: '10px', fontWeight: 600, letterSpacing: '0.04em',
    padding: '5px 8px', borderBottom: '1px solid var(--border-2)',
    whiteSpace: 'nowrap',
  },
  td: { padding: '5px 8px', borderBottom: '1px solid var(--border-1)', whiteSpace: 'nowrap' },
  atmPill: {
    position: 'absolute', top: '50%', left: '50%',
    transform: 'translate(18px, -50%)',
    fontSize: '8px', fontWeight: 700,
    background: 'var(--accent)', color: '#fff',
    padding: '1px 4px', borderRadius: '2px',
  },
};
