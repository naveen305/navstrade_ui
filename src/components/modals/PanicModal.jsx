import React from 'react';
import { useTrading } from '../../context/TradingContext';
import { AlertTriangle, X } from 'lucide-react';

export const PanicModal = () => {
  const { panicModalOpen, setPanicModalOpen, positions, emergencySquareOffAll } = useTrading();
  if (!panicModalOpen) return null;

  const totalPnl = positions.reduce((s, p) => s + p.pnl, 0);

  return (
    <div style={P.backdrop}>
      <div style={P.modal}>
        <div style={P.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={14} style={{ color: 'var(--down)' }} />
            <span style={{ fontWeight: 700, fontSize: '12px', color: 'var(--text-white)' }}>
              Emergency Square-Off (Market Execution)
            </span>
          </div>
          <button style={P.closeBtn} onClick={() => setPanicModalOpen(false)}>
            <X size={13} />
          </button>
        </div>

        <div style={P.body}>
          <div style={P.warnBox}>
            <p style={{ fontSize: '11.5px', color: 'var(--text-white)', fontWeight: 600, marginBottom: '3px' }}>
              Confirm immediate square-off for all {positions.length} active position(s)?
            </p>
            <p style={{ fontSize: '10.5px', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
              Market orders will be sent instantly to Upstox API. All open limit and SL orders will be cancelled.
            </p>
          </div>

          {positions.length > 0 && (
            <div style={P.positionList}>
              {positions.map(p => (
                <div key={p.id} style={P.posRow}>
                  <span style={{ fontWeight: 600, fontSize: '11px', color: 'var(--text-white)' }}>{p.symbol}</span>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{Math.abs(p.qty)} qty</span>
                  <span className="font-data" style={{ marginLeft: 'auto', fontSize: '11.5px', fontWeight: 600, color: p.pnl >= 0 ? 'var(--up)' : 'var(--down)' }}>
                    {p.pnl >= 0 ? '+' : ''}₹{p.pnl.toFixed(2)}
                  </span>
                </div>
              ))}
              <div style={{ ...P.posRow, borderTop: '1px solid var(--border-2)', marginTop: '4px', paddingTop: '6px' }}>
                <span style={{ fontWeight: 700, fontSize: '11px', color: 'var(--text-white)' }}>Total Realized MTM on Exit</span>
                <span className="font-data" style={{ marginLeft: 'auto', fontWeight: 700, fontSize: '12px', color: totalPnl >= 0 ? 'var(--up)' : 'var(--down)' }}>
                  {totalPnl >= 0 ? '+' : ''}₹{totalPnl.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '6px' }}>
            <button
              className="btn btn-ghost"
              style={{ justifyContent: 'center', padding: '7px' }}
              onClick={() => setPanicModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              style={{
                justifyContent: 'center',
                padding: '7px',
                fontWeight: 600,
                background: 'var(--down)',
                color: '#fff'
              }}
              onClick={emergencySquareOffAll}
            >
              <AlertTriangle size={12} />
              Confirm — Exit All Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const P = {
  backdrop: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.65)',
    backdropFilter: 'blur(3px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 9000,
  },
  modal: {
    width: '420px', maxWidth: '95vw',
    background: 'var(--bg-panel)',
    border: '1px solid var(--border-2)',
    borderRadius: '4px',
    overflow: 'hidden',
    boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '8px 12px', background: 'rgba(244, 63, 94, 0.08)',
    borderBottom: '1px solid rgba(244, 63, 94, 0.2)',
  },
  closeBtn: { background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' },
  body: { padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' },
  warnBox: {
    padding: '8px 10px',
    background: 'rgba(244, 63, 94, 0.05)',
    border: '1px solid rgba(244, 63, 94, 0.2)',
    borderRadius: '3px',
  },
  positionList: {
    background: 'var(--bg-surface)', border: '1px solid var(--border-1)',
    borderRadius: '3px', padding: '6px 8px',
    display: 'flex', flexDirection: 'column', gap: '4px',
    maxHeight: '150px', overflowY: 'auto',
  },
  posRow: { display: 'flex', alignItems: 'center', gap: '8px' },
};
