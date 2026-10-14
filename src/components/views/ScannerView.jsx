import React from 'react';
import { useTrading } from '../../context/TradingContext';
import { Radar, Zap, TrendingUp, TrendingDown, Volume2, ArrowRight } from 'lucide-react';

export const ScannerView = () => {
  const { scannerSignals, openOrderTicket, setSelectedSymbol, watchlist, setActiveTab } = useTrading();

  const handleSelectSignal = (signal) => {
    const matchedWatchlist = watchlist.find(w => w.symbol === signal.symbol);
    if (matchedWatchlist) {
      setSelectedSymbol(matchedWatchlist);
    }
    openOrderTicket({
      symbol: `${signal.symbol} ${signal.suggestedAction}`,
      action: 'BUY',
      price: 65.00,
      sl: 45.00,
      target: 110.00,
      lotSize: matchedWatchlist ? matchedWatchlist.lotSize : 100,
      qty: matchedWatchlist ? matchedWatchlist.lotSize : 100,
      strategy: signal.suggestedAction
    });
  };

  return (
    <div className="scanner-container">
      {/* Scanner Header */}
      <div className="terminal-card scanner-header-card">
        <div className="sh-left">
          <div className="sh-icon-box">
            <Radar size={26} className="text-amber" />
          </div>
          <div>
            <h2 className="sh-title">INSTITUTIONAL F&O MARKET SCANNER</h2>
            <p className="sh-desc">
              Scans 180+ NSE F&O stocks every 3 seconds for <strong>abnormal Open Interest (OI) buildup</strong>,
              institutional block volume, and volatility breakouts. Only trade with big money flow.
            </p>
          </div>
        </div>

        <div className="scanner-stats">
          <span className="badge badge-amber">LIVE SCAN: 184 STOCKS</span>
          <span className="mono text-profit font-bold">4 HIGH PROBABILITY SETUPS</span>
        </div>
      </div>

      {/* Signals Table */}
      <div className="terminal-card">
        <table className="terminal-table scanner-table">
          <thead>
            <tr>
              <th>SYMBOL</th>
              <th>PRICE</th>
              <th>SIGNAL TYPE</th>
              <th>OI BUILDUP</th>
              <th>VOLUME SPIKE</th>
              <th>PCR</th>
              <th>CONFIDENCE</th>
              <th>SUGGESTED DEFINED SETUP</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {scannerSignals.map((sig, idx) => (
              <tr key={idx}>
                <td className="font-bold">{sig.symbol}</td>
                <td className="mono">₹{sig.price.toFixed(2)}</td>
                <td>
                  <span className={`badge ${sig.signal.includes('Long') || sig.signal.includes('Bullish') ? 'badge-green' : sig.signal.includes('Short') ? 'badge-red' : 'badge-cyan'}`}>
                    {sig.signal}
                  </span>
                </td>
                <td className="mono font-bold text-profit">{sig.oiChangePct}</td>
                <td className="mono text-cyan">{sig.volumeMultiplier}</td>
                <td className="mono font-bold">{sig.pcr}</td>
                <td>
                  <span className="badge badge-green">{sig.confidence}</span>
                </td>
                <td className="font-bold text-secondary">{sig.suggestedAction}</td>
                <td>
                  <button
                    className="btn btn-primary scanner-act-btn"
                    onClick={() => handleSelectSignal(sig)}
                  >
                    <span>SIZE & TRADE</span>
                    <ArrowRight size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .scanner-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 12px;
          height: calc(100vh - 56px);
          overflow-y: auto;
        }

        .scanner-header-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 18px;
        }

        .sh-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .sh-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          background: var(--alert-amber-bg);
          border: 1px solid rgba(245, 158, 11, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sh-title {
          font-size: 14px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: 0.05em;
        }

        .sh-desc {
          font-size: 11.5px;
          color: var(--text-secondary);
          max-width: 740px;
        }

        .scanner-stats {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
          font-size: 11px;
        }

        .scanner-table td {
          padding: 12px 10px;
        }

        .scanner-act-btn {
          font-size: 11px;
          padding: 4px 10px;
        }
      `}</style>
    </div>
  );
};
