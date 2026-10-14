import React, { useState, useMemo } from 'react';
import { useTrading } from '../../context/TradingContext';
import { Radar, ArrowRight, ArrowUpDown, ChevronUp, ChevronDown, Info, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ScannerView = () => {
  const { scannerSignals, openOrderTicket, watchlist, setSelectedSymbol } = useTrading();
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [sortField, setSortField] = useState('confidenceScore');
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' | 'desc'

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSorted = useMemo(() => {
    let list = scannerSignals.filter(sig => {
      if (activeCategory === 'ALL') return true;
      if (activeCategory === 'HIGH_CONF') return sig.confidenceScore >= 80;
      if (activeCategory === 'BULLISH') return sig.category === 'Bullish Buildup';
      if (activeCategory === 'BEARISH') return sig.category === 'Short Buildup';
      if (activeCategory === 'BREAKOUT') return sig.category === 'Breakout';
      if (activeCategory === 'RANGE') return sig.category === 'Range-Bound';
      return true;
    });

    list.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'oiChangePct') {
        valA = parseFloat(a.oiChangePct);
        valB = parseFloat(b.oiChangePct);
      } else if (sortField === 'volumeMultiplier') {
        valA = parseFloat(a.volumeMultiplier);
        valB = parseFloat(b.volumeMultiplier);
      } else if (sortField === 'pcr') {
        valA = parseFloat(a.pcr);
        valB = parseFloat(b.pcr);
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [scannerSignals, activeCategory, sortField, sortDirection]);

  const signalStyle = (category) => {
    if (category === 'Bullish Buildup') {
      return { bg: 'var(--profit-bg)', color: 'var(--profit)', border: '1px solid var(--border-light)' };
    }
    if (category === 'Short Buildup') {
      return { bg: 'var(--loss-bg)', color: 'var(--loss)', border: '1px solid var(--border-light)' };
    }
    if (category === 'Breakout') {
      return { bg: 'var(--bg-secondary)', color: 'var(--navy)', border: '1px solid var(--border-main)' };
    }
    return { bg: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border-light)' };
  };

  const renderSortArrow = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown size={11} style={{ opacity: 0.35, marginLeft: 3 }} />;
    }
    return sortDirection === 'asc'
      ? <ChevronUp size={12} style={{ color: 'var(--navy)', marginLeft: 3 }} />
      : <ChevronDown size={12} style={{ color: 'var(--navy)', marginLeft: 3 }} />;
  };

  return (
    <div style={S.root}>
      {/* ── Sub-header Toolbar ── */}
      <div style={S.toolbar}>
        <div style={S.toolLeft}>
          <Radar size={15} style={{ color: 'var(--navy)' }} />
          <div>
            <span style={S.pageTitle}>F&O Institutional Scanner</span>
            <span style={S.pageSubtitle}>
              Continuous scan across 184 NSE F&O underlyings · Real-time volume spikes & OI shifts
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div style={S.filterGroup}>
          {[
            { id: 'ALL', label: `All (${scannerSignals.length})` },
            { id: 'HIGH_CONF', label: 'Confidence ≥ 80%' },
            { id: 'BULLISH', label: 'Bullish Buildup' },
            { id: 'BEARISH', label: 'Short Buildup' },
            { id: 'BREAKOUT', label: 'Breakouts' },
            { id: 'RANGE', label: 'Range-Bound' },
          ].map(f => (
            <button
              key={f.id}
              style={{
                ...S.filterBtn,
                ...(activeCategory === f.id ? S.filterBtnActive : {})
              }}
              onClick={() => setActiveCategory(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          Showing <strong className="font-num" style={{ color: 'var(--text-primary)' }}>{filteredAndSorted.length}</strong> qualified setups
        </div>
      </div>

      {/* ── Table Container ── */}
      <div style={S.tableContainer}>
        <table className="calm-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('symbol')} style={{ cursor: 'pointer', width: '13%' }}>
                <div style={S.thFlex}>
                  <span>Symbol</span>
                  {renderSortArrow('symbol')}
                </div>
              </th>
              <th onClick={() => handleSort('price')} style={{ cursor: 'pointer', textAlign: 'right', width: '11%' }}>
                <div style={{ ...S.thFlex, justifyContent: 'flex-end' }}>
                  <span>Price (₹)</span>
                  {renderSortArrow('price')}
                </div>
              </th>
              <th onClick={() => handleSort('signal')} style={{ cursor: 'pointer', width: '14%' }}>
                <div style={S.thFlex}>
                  <span>Signal</span>
                  {renderSortArrow('signal')}
                </div>
              </th>
              <th onClick={() => handleSort('oiChangePct')} style={{ cursor: 'pointer', textAlign: 'right', width: '11%' }}>
                <div style={{ ...S.thFlex, justifyContent: 'flex-end' }}>
                  <span>OI Change</span>
                  {renderSortArrow('oiChangePct')}
                </div>
              </th>
              <th onClick={() => handleSort('volumeMultiplier')} style={{ cursor: 'pointer', textAlign: 'right', width: '11%' }}>
                <div style={{ ...S.thFlex, justifyContent: 'flex-end' }}>
                  <span>Vol Spike</span>
                  {renderSortArrow('volumeMultiplier')}
                </div>
              </th>
              <th onClick={() => handleSort('pcr')} style={{ cursor: 'pointer', textAlign: 'right', width: '9%' }}>
                <div style={{ ...S.thFlex, justifyContent: 'flex-end' }}>
                  <span>PCR</span>
                  {renderSortArrow('pcr')}
                </div>
              </th>
              <th onClick={() => handleSort('confidenceScore')} style={{ cursor: 'pointer', width: '14%' }}>
                <div style={S.thFlex}>
                  <span>Confidence</span>
                  {renderSortArrow('confidenceScore')}
                </div>
              </th>
              <th style={{ width: '17%' }}>Suggested Setup</th>
              <th style={{ textAlign: 'center', width: '10%' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.map((sig, i) => {
              const matched = watchlist.find(w => w.symbol === sig.symbol);
              const isBull = sig.oiChangePct.startsWith('+');
              const styleObj = signalStyle(sig.category);

              return (
                <tr key={i}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {sig.symbol}
                  </td>

                  <td className="font-num" style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>
                    ₹{sig.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>

                  <td>
                    <span
                      style={{
                        fontSize: '10.5px',
                        fontWeight: 600,
                        padding: '2px 7px',
                        borderRadius: '3px',
                        backgroundColor: styleObj.bg,
                        color: styleObj.color,
                        border: styleObj.border,
                        display: 'inline-block'
                      }}
                    >
                      {sig.signal}
                    </span>
                  </td>

                  <td
                    className="font-num"
                    style={{
                      textAlign: 'right',
                      fontWeight: 600,
                      color: isBull ? 'var(--profit)' : 'var(--loss)'
                    }}
                  >
                    {sig.oiChangePct}
                  </td>

                  <td className="font-num" style={{ textAlign: 'right', color: 'var(--text-primary)' }}>
                    {sig.volumeMultiplier}
                  </td>

                  <td
                    className="font-num"
                    style={{
                      textAlign: 'right',
                      fontWeight: 500,
                      color: Number(sig.pcr) >= 1 ? 'var(--profit)' : 'var(--loss)'
                    }}
                  >
                    {sig.pcr}
                  </td>

                  {/* Confidence bar plus number */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div
                        style={{
                          flex: 1,
                          height: '5px',
                          backgroundColor: 'var(--bg-main)',
                          border: '1px solid var(--border-main)',
                          borderRadius: '2.5px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${sig.confidenceScore}%`,
                            backgroundColor:
                              sig.confidenceScore >= 80
                                ? 'var(--profit)'
                                : sig.confidenceScore >= 65
                                ? 'var(--navy)'
                                : 'var(--warning)',
                            borderRadius: '2px',
                          }}
                        />
                      </div>
                      <span
                        className="font-num"
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          minWidth: '28px',
                          color: 'var(--text-primary)',
                        }}
                      >
                        {sig.confidenceScore}%
                      </span>
                    </div>
                  </td>

                  <td style={{ color: 'var(--text-secondary)', fontSize: '11.5px' }}>
                    {sig.suggestedAction}
                  </td>

                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="btn btn-outline"
                      style={{
                        padding: '3px 8px',
                        fontSize: '11px',
                        borderRadius: 'var(--radius)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 3,
                        borderColor: 'var(--border-main)',
                        color: 'var(--navy)',
                      }}
                      onClick={() => {
                        if (matched) setSelectedSymbol(matched);
                        openOrderTicket({
                          symbol: `${sig.symbol} — ${sig.suggestedAction}`,
                          action: 'BUY',
                          price: +(sig.price * 0.04).toFixed(1),
                          sl: +(sig.price * 0.028).toFixed(1),
                          target: +(sig.price * 0.065).toFixed(1),
                          lotSize: matched?.lotSize || 100,
                          qty: matched?.lotSize || 100,
                          strategy: sig.suggestedAction,
                          maxLossRupees: 1200,
                          maxLossPct: 1.0,
                        });
                      }}
                    >
                      Trade
                      <ArrowRight size={11} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Explanatory Note on Confidence Computation (Strict User Requirement) ── */}
      <div style={S.footerNote}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <Info size={14} style={{ color: 'var(--navy)', marginTop: 2, flexShrink: 0 }} />
          <div>
            <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>
              Confidence Score Methodology
            </span>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '2px 0 0 0', lineHeight: 1.45 }}>
              Confidence is quantitatively computed from 4 weighted variables: <strong>35%</strong> OI buildup acceleration rate, <strong>25%</strong> 15-minute volume relative to 20-period moving average, <strong>20%</strong> Put-Call Ratio (PCR) momentum divergence, and <strong>20%</strong> VWAP structural alignment. Scores ≥80% indicate high institutional order-flow confluence.
            </p>
          </div>
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
  tableContainer: {
    flex: 1,
    overflowY: 'auto',
    backgroundColor: 'var(--bg-surface)',
  },
  thFlex: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  },
  footerNote: {
    padding: '10px 16px',
    backgroundColor: 'var(--bg-surface)',
    borderTop: '1px solid var(--border-main)',
    flexShrink: 0,
  },
};
