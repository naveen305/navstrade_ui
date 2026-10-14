import React from 'react';
import { useTrading } from '../../context/TradingContext';
import { AlertOctagon, X, AlertTriangle, ShieldX } from 'lucide-react';

export const PanicModal = () => {
  const {
    panicModalOpen,
    setPanicModalOpen,
    positions,
    emergencySquareOffAll
  } = useTrading();

  if (!panicModalOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="terminal-card panic-modal">
        <div className="terminal-card-header panic-modal-header">
          <div className="panic-header-left">
            <AlertOctagon size={20} className="text-loss" />
            <span className="panic-modal-title">EMERGENCY KILL-SWITCH: IMMEDIATE SQUARE OFF</span>
          </div>
          <button className="close-btn" onClick={() => setPanicModalOpen(false)}>
            <X size={16} />
          </button>
        </div>

        <div className="terminal-card-body panic-modal-body">
          <div className="panic-warning-banner">
            <AlertTriangle size={24} className="text-loss" />
            <div>
              <p className="panic-warning-title">ARE YOU ABSOLUTELY SURE?</p>
              <p className="panic-warning-sub">
                This will trigger an <strong>immediate Market Exit</strong> for all {positions.length} open position(s)
                and cancel all resting orders across Upstox API.
              </p>
            </div>
          </div>

          <div className="panic-positions-list">
            <span className="panic-list-title">POSITIONS TO BE TERMINATED:</span>
            {positions.length === 0 ? (
              <p className="text-muted text-xs">No active open positions found.</p>
            ) : (
              positions.map(p => (
                <div key={p.id} className="panic-position-item">
                  <span className="font-bold">{p.symbol}</span>
                  <span className="mono">{p.qty > 0 ? `BUY ${p.qty}` : `SELL ${Math.abs(p.qty)}`}</span>
                  <span className={`mono font-bold ${p.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                    {p.pnl >= 0 ? '+' : ''}₹{p.pnl.toLocaleString('en-IN')}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="panic-actions">
            <button
              className="btn btn-outline cancel-panic-btn"
              onClick={() => setPanicModalOpen(false)}
            >
              CANCEL / ABORT
            </button>
            <button
              className="btn btn-danger confirm-panic-btn"
              onClick={emergencySquareOffAll}
            >
              <ShieldX size={16} />
              <span>CONFIRM IMMEDIATE SQUARE-OFF</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .panic-modal {
          width: 520px;
          max-width: 95vw;
          border-color: var(--loss-red) !important;
          box-shadow: 0 0 36px rgba(244, 63, 94, 0.45) !important;
          animation: shake 0.3s ease-in-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-4px); }
          40%, 80% { transform: translateX(4px); }
        }

        .panic-modal-header {
          background: rgba(244, 63, 94, 0.15) !important;
          border-bottom: 1px solid var(--loss-red) !important;
        }

        .panic-header-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .panic-modal-title {
          font-size: 12px;
          font-weight: 800;
          color: #ff6b81;
          letter-spacing: 0.05em;
        }

        .panic-modal-body {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .panic-warning-banner {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px;
          background: rgba(244, 63, 94, 0.12);
          border: 1px solid rgba(244, 63, 94, 0.3);
          border-radius: 6px;
        }

        .panic-warning-title {
          font-size: 13px;
          font-weight: 800;
          color: #ffffff;
        }

        .panic-warning-sub {
          font-size: 11px;
          color: var(--text-secondary);
          margin-top: 2px;
          line-height: 1.35;
        }

        .panic-positions-list {
          background: var(--bg-surface-2);
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
          padding: 10px;
          max-height: 140px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .panic-list-title {
          font-size: 9.5px;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        .panic-position-item {
          display: flex;
          justify-content: space-between;
          font-size: 11.5px;
          padding: 4px 6px;
          background: var(--bg-surface-3);
          border-radius: 4px;
        }

        .panic-actions {
          display: grid;
          grid-template-columns: 1fr 1.6fr;
          gap: 8px;
          margin-top: 4px;
        }

        .confirm-panic-btn {
          padding: 10px;
          font-size: 12.5px;
          font-weight: 800;
        }

        .cancel-panic-btn {
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};
