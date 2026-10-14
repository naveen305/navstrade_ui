import React from 'react';
import { useTrading } from '../../context/TradingContext';
import { AlertTriangle, X } from 'lucide-react';

export const PanicModal = () => {
  const { panicModalOpen, setPanicModalOpen, positions, emergencySquareOffAll } = useTrading();
  if (!panicModalOpen) return null;

  const totalPnl = positions.reduce((s, p) => s + p.pnl, 0);

  return (
    <div style={P.backdrop} onClick={() => setPanicModalOpen(false)}>
      <div style={P.modal} onClick={e => e.stopPropagation()}>
        <div style={P.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={15} style={{ color: 'var(--loss)' }} />
            <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
              Confirm Square Off All Open Positions
            </span>
          </div>
          <button style={P.closeBtn} onClick={() => setPanicModalOpen(false)}>
            <X size={14} />
          </button>
        </div>

        <div style={P.body}>
          <div style={P.warnBox}>
            <p style={{ fontSize: '12px', color: 'var(--loss)', fontWeight: 600, margin: '0 0 4px 0' }}>
              Warning: Immediate market order execution
            </p>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
              This will immediately submit market square-off orders for all {positions.length} active position(s) and cancel all pending stop-loss and target limit orders.
            </p>
          </div>

          {positions.length > 0 ? (
            <div style={P.positionList}>
              {positions.map(p => (
                <div key={p.id} style={P.posRow}>
                  <span style={{ fontWeight: 600, fontSize: '11.5px', color: 'var(--text-primary)' }}>{p.symbol}</span>
                  <span className="font-num" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{Math.abs(p.qty)} qty</span>
                  <span className="font-num" style={{ marginLeft: 'auto', fontSize: '12px', fontWeight: 600, color: p.pnl >= 0 ? 'var(--profit)' : 'var(--loss)' }}>
                    {p.pnl >= 0 ? '+' : ''}₹{p.pnl.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
              <div style={{ ...P.posRow, borderTop: '1px solid var(--border-main)', marginTop: 4, paddingTop: 8 }}>
                <span style={{ fontWeight: 600, fontSize: '11.5px', color: 'var(--text-primary)' }}>Net Unrealized P&L on Exit</span>
                <span className="font-num" style={{ marginLeft: 'auto', fontWeight: 600, fontSize: '13px', color: totalPnl >= 0 ? 'var(--profit)' : 'var(--loss)' }}>
                  {totalPnl >= 0 ? '+' : ''}₹{totalPnl.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          ) : (
            <div style={{ padding: '16px', textAlign: 'center', fontSize: '11.5px', color: 'var(--text-muted)' }}>
              No active open positions to square off.
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 8, marginTop: 4 }}>
            <button
              className="btn btn-outline"
              style={{ justifyContent: 'center', padding: '8px' }}
              onClick={() => setPanicModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              style={{
                justifyContent: 'center',
                padding: '8px',
                fontWeight: 600,
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
              onClick={emergencySquareOffAll}
            >
              <AlertTriangle size={13} />
              Confirm — Square Off All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const P = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(20, 23, 28, 0.45)',
    backdropFilter: 'blur(2px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9000,
  },
  modal: {
    width: '420px',
    maxWidth: '94vw',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-main)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-modal)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
    borderBottom: '1px solid var(--border-main)',
    backgroundColor: 'var(--bg-surface)',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
  },
  body: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  warnBox: {
    padding: '10px 12px',
    backgroundColor: 'var(--loss-bg)',
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius)',
  },
  positionList: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-main)',
    borderRadius: 'var(--radius)',
    padding: '8px 10px',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    maxHeight: '160px',
    overflowY: 'auto',
  },
  posRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
};
