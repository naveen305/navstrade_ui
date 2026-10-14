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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} style={{ color: 'var(--down)' }} />
            <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-white)' }}>Emergency Square-Off</span>
          </div>
          <button style={P.closeBtn} onClick={() => setPanicModalOpen(false)}><X size={14} /></button>
        </div>

        <div style={P.body}>
          <div style={P.warnBox}>
            <p style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '4px' }}>
              Immediately close all {positions.length} open position(s)?
            </p>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              All positions will be exited at market price and all pending orders cancelled via Upstox API.
            </p>
          </div>

          {positions.length > 0 && (
            <div style={P.positionList}>
              {positions.map(p => (
                <div key={p.id} style={P.posRow}>
                  <span style={{ fontWeight: 600, fontSize: '12px' }}>{p.symbol}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{Math.abs(p.qty)} qty</span>
                  <span className="font-data" style={{ marginLeft: 'auto', fontSize: '12px', fontWeight: 700, color: p.pnl >= 0 ? 'var(--up)' : 'var(--down)' }}>
                    {p.pnl >= 0 ? '+' : ''}₹{p.pnl.toFixed(2)}
                  </span>
                </div>
              ))}
              <div style={{ ...P.posRow, borderTop: '1px solid var(--border-2)', marginTop: '4px', paddingTop: '8px' }}>
                <span style={{ fontWeight: 700 }}>Total P&L on Exit</span>
                <span className="font-data" style={{ marginLeft: 'auto', fontWeight: 800, fontSize: '13px', color: totalPnl >= 0 ? 'var(--up)' : 'var(--down)' }}>
                  {totalPnl >= 0 ? '+' : ''}₹{totalPnl.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '8px' }}>
            <button className="btn btn-ghost" style={{ justifyContent: 'center', padding: '10px' }} onClick={() => setPanicModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-danger" style={{ justifyContent: 'center', padding: '10px', fontWeight: 700 }} onClick={emergencySquareOffAll}>
              <AlertTriangle size={14} />
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
    background: 'rgba(0,0,0,0.75)',
    backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 9000,
  },
  modal: {
    width: '420px',
    background: 'var(--bg-panel)',
    border: '1px solid var(--down)',
    borderRadius: '6px',
    overflow: 'hidden',
    boxShadow: '0 16px 48px rgba(0,0,0,0.75)',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '10px 14px', background: 'rgba(239,83,80,0.08)',
    borderBottom: '1px solid rgba(239,83,80,0.2)',
  },
  closeBtn: { background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' },
  body: { padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' },
  warnBox: {
    padding: '10px 12px',
    background: 'rgba(239,83,80,0.06)',
    border: '1px solid rgba(239,83,80,0.2)',
    borderRadius: '4px',
  },
  positionList: {
    background: '#161616', border: '1px solid var(--border-1)',
    borderRadius: '4px', padding: '8px 10px',
    display: 'flex', flexDirection: 'column', gap: '6px',
    maxHeight: '160px', overflow: 'auto',
  },
  posRow: { display: 'flex', alignItems: 'center', gap: '10px' },
};
