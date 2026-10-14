import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { Layers, Eye, Plus, ShoppingCart, HelpCircle } from 'lucide-react';

export const OptionChainView = () => {
  const {
    optionChain,
    selectedSymbol,
    openOrderTicket
  } = useTrading();

  const [greekFilter, setGreekFilter] = useState('ALL'); // 'ALL' | 'DELTA_THETA' | 'OI_ONLY'

  // Calculate total Call and Put Open Interest
  const totalCallOI = optionChain.reduce((acc, row) => acc + row.ce.oi, 0);
  const totalPutOI = optionChain.reduce((acc, row) => acc + row.pe.oi, 0);
  const pcrRatio = (totalPutOI / totalCallOI).toFixed(2);

  return (
    <div className="option-chain-container">
      {/* Header bar with PCR and Max Pain info */}
      <div className="terminal-card chain-summary-bar">
        <div className="chain-info-left">
          <div className="chain-title-row">
            <Layers size={18} className="text-cyan" />
            <span className="chain-title">{selectedSymbol.symbol} REAL-TIME OPTION CHAIN</span>
            <span className="badge badge-purple">EXPIRY: CURRENT WEEK</span>
          </div>
          <span className="text-secondary text-sm">
            Spot Price: <strong className="mono text-cyan">₹{selectedSymbol.price}</strong> | Strike Interval: 50 pts
          </span>
        </div>

        <div className="chain-metrics-right">
          <div className="chain-metric-card">
            <span className="cm-label">OVERALL PCR (PUT/CALL)</span>
            <span className={`cm-val mono font-bold ${Number(pcrRatio) >= 1 ? 'text-profit' : 'text-loss'}`}>
              {pcrRatio} ({Number(pcrRatio) >= 1 ? 'Bullish Support' : 'Call Resistance'})
            </span>
          </div>

          <div className="chain-metric-card">
            <span className="cm-label">MAX PAIN STRIKE</span>
            <span className="cm-val mono font-bold text-amber">
              {selectedSymbol.maxPain} (Expiry Magnet)
            </span>
          </div>

          <div className="chain-metric-card">
            <span className="cm-label">TOTAL CALL OI vs PUT OI</span>
            <span className="cm-val mono">
              {(totalCallOI / 100000).toFixed(1)}L <span className="text-muted">vs</span> {(totalPutOI / 100000).toFixed(1)}L
            </span>
          </div>
        </div>
      </div>

      {/* Main Strike Ladder Table */}
      <div className="terminal-card chain-table-card">
        <div className="chain-table-scroll">
          <table className="terminal-table chain-table">
            <thead>
              <tr>
                {/* CALLS (CE) HEADER */}
                <th colSpan="6" className="ce-header text-center">CALL OPTIONS (CE) - BULLISH</th>
                {/* STRIKE */}
                <th className="strike-header text-center">STRIKE</th>
                {/* PUTS (PE) HEADER */}
                <th colSpan="6" className="pe-header text-center">PUT OPTIONS (PE) - BEARISH</th>
              </tr>
              <tr className="sub-headers">
                <th>OI (Lakhs)</th>
                <th>IV %</th>
                <th>DELTA (Δ)</th>
                <th>THETA (Θ)</th>
                <th>CHG</th>
                <th>LTP (₹)</th>

                <th className="strike-sub text-center">PRICE</th>

                <th>LTP (₹)</th>
                <th>CHG</th>
                <th>DELTA (Δ)</th>
                <th>THETA (Θ)</th>
                <th>IV %</th>
                <th>OI (Lakhs)</th>
              </tr>
            </thead>
            <tbody>
              {optionChain.map((row) => {
                const isATM = row.strike === 25150;
                const isITM_CE = row.strike < selectedSymbol.price;
                const isITM_PE = row.strike > selectedSymbol.price;

                return (
                  <tr
                    key={row.strike}
                    className={`chain-row ${isATM ? 'atm-strike-row' : ''}`}
                  >
                    {/* CALLS DATA */}
                    <td className={`mono ${isITM_CE ? 'itm-cell' : ''}`}>
                      <div className="oi-cell">
                        <span>{(row.ce.oi / 100000).toFixed(2)}</span>
                        <div
                          className="oi-bar oi-bar-ce"
                          style={{ width: `${Math.min(100, (row.ce.oi / 7000000) * 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className={`mono ${isITM_CE ? 'itm-cell' : ''}`}>{row.ce.iv}%</td>
                    <td className={`mono text-profit ${isITM_CE ? 'itm-cell' : ''}`}>{row.ce.delta}</td>
                    <td className={`mono text-amber ${isITM_CE ? 'itm-cell' : ''}`}>₹{row.ce.theta}</td>
                    <td className={`mono ${row.ce.change >= 0 ? 'text-profit' : 'text-loss'} ${isITM_CE ? 'itm-cell' : ''}`}>
                      {row.ce.change >= 0 ? '+' : ''}{row.ce.change}
                    </td>
                    <td className={`mono font-bold clickable-price ce-price ${isITM_CE ? 'itm-cell' : ''}`}
                      onClick={() => openOrderTicket({
                        symbol: `${selectedSymbol.symbol} ${row.strike} CE`,
                        action: 'BUY',
                        price: row.ce.ltp,
                        sl: +(row.ce.ltp * 0.82).toFixed(1),
                        target: +(row.ce.ltp * 1.35).toFixed(1),
                        lotSize: selectedSymbol.lotSize,
                        qty: selectedSymbol.lotSize,
                        strategy: 'Option Chain Call Selection'
                      })}
                      title="Click to launch Buy Call order ticket"
                    >
                      ₹{row.ce.ltp.toFixed(2)}
                      <ShoppingCart size={11} className="inline-cart-icon" />
                    </td>

                    {/* STRIKE PILLAR */}
                    <td className={`mono text-center strike-cell ${isATM ? 'atm-strike-badge' : ''}`}>
                      {row.strike}
                      {isATM && <span className="atm-pill">ATM</span>}
                    </td>

                    {/* PUTS DATA */}
                    <td className={`mono font-bold clickable-price pe-price ${isITM_PE ? 'itm-cell' : ''}`}
                      onClick={() => openOrderTicket({
                        symbol: `${selectedSymbol.symbol} ${row.strike} PE`,
                        action: 'BUY',
                        price: row.pe.ltp,
                        sl: +(row.pe.ltp * 0.82).toFixed(1),
                        target: +(row.pe.ltp * 1.35).toFixed(1),
                        lotSize: selectedSymbol.lotSize,
                        qty: selectedSymbol.lotSize,
                        strategy: 'Option Chain Put Selection'
                      })}
                      title="Click to launch Buy Put order ticket"
                    >
                      ₹{row.pe.ltp.toFixed(2)}
                      <ShoppingCart size={11} className="inline-cart-icon" />
                    </td>
                    <td className={`mono ${row.pe.change >= 0 ? 'text-profit' : 'text-loss'} ${isITM_PE ? 'itm-cell' : ''}`}>
                      {row.pe.change >= 0 ? '+' : ''}{row.pe.change}
                    </td>
                    <td className={`mono text-loss ${isITM_PE ? 'itm-cell' : ''}`}>{row.pe.delta}</td>
                    <td className={`mono text-amber ${isITM_PE ? 'itm-cell' : ''}`}>₹{row.pe.theta}</td>
                    <td className={`mono ${isITM_PE ? 'itm-cell' : ''}`}>{row.pe.iv}%</td>
                    <td className={`mono ${isITM_PE ? 'itm-cell' : ''}`}>
                      <div className="oi-cell">
                        <span>{(row.pe.oi / 100000).toFixed(2)}</span>
                        <div
                          className="oi-bar oi-bar-pe"
                          style={{ width: `${Math.min(100, (row.pe.oi / 7000000) * 100)}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .option-chain-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 12px;
          height: calc(100vh - 56px);
          overflow-y: auto;
        }

        .chain-summary-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
        }

        .chain-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 4px;
        }

        .chain-title {
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: #ffffff;
        }

        .chain-metrics-right {
          display: flex;
          gap: 12px;
        }

        .chain-metric-card {
          background: var(--bg-surface-2);
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
          padding: 6px 12px;
          display: flex;
          flex-direction: column;
        }

        .cm-label {
          font-size: 9.5px;
          font-weight: 700;
          color: var(--text-muted);
        }

        .cm-val {
          font-size: 12.5px;
        }

        .chain-table-card {
          overflow: hidden;
        }

        .chain-table-scroll {
          max-height: calc(100vh - 190px);
          overflow-y: auto;
        }

        .chain-table {
          font-size: 11.5px;
        }

        .ce-header {
          background: rgba(16, 185, 129, 0.15) !important;
          color: var(--profit-green) !important;
          border-right: 1px solid var(--border-medium);
        }

        .pe-header {
          background: rgba(244, 63, 94, 0.15) !important;
          color: var(--loss-red) !important;
          border-left: 1px solid var(--border-medium);
        }

        .strike-header {
          background: var(--bg-surface-3) !important;
          color: var(--neon-cyan) !important;
          min-width: 90px;
        }

        .sub-headers th {
          font-size: 9.5px;
          background: var(--bg-surface-2);
        }

        .strike-cell {
          background: var(--bg-surface-2);
          font-weight: 800;
          font-size: 13px;
          color: var(--text-highlight);
          border-left: 1px solid var(--border-medium);
          border-right: 1px solid var(--border-medium);
        }

        .atm-strike-row {
          background: rgba(0, 240, 255, 0.08) !important;
          border-top: 1px solid var(--neon-cyan);
          border-bottom: 1px solid var(--neon-cyan);
        }

        .atm-strike-badge {
          background: var(--neon-cyan) !important;
          color: #000 !important;
          position: relative;
        }

        .atm-pill {
          display: inline-block;
          font-size: 8.5px;
          font-weight: 900;
          background: #000;
          color: var(--neon-cyan);
          padding: 1px 4px;
          border-radius: 3px;
          margin-left: 4px;
        }

        .itm-cell {
          background: rgba(255, 255, 255, 0.02);
        }

        .clickable-price {
          cursor: pointer;
          transition: background var(--trans-fast);
          padding: 6px 10px;
          border-radius: 4px;
        }

        .ce-price:hover {
          background: var(--profit-green-bg) !important;
          color: var(--profit-green);
        }

        .pe-price:hover {
          background: var(--loss-red-bg) !important;
          color: var(--loss-red);
        }

        .inline-cart-icon {
          margin-left: 5px;
          opacity: 0.6;
        }

        .oi-cell {
          position: relative;
          display: flex;
          align-items: center;
          height: 18px;
        }

        .oi-bar {
          position: absolute;
          left: 0;
          bottom: 0;
          height: 3px;
          border-radius: 2px;
          opacity: 0.7;
        }

        .oi-bar-ce {
          background: var(--profit-green);
        }

        .oi-bar-pe {
          background: var(--loss-red);
        }
      `}</style>
    </div>
  );
};
