import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { X, ShieldCheck, AlertTriangle } from 'lucide-react';

export const OrderTicketModal = () => {
  const { orderModalOpen, setOrderModalOpen, orderModalData, submitOrder, accountCapital, riskRules } = useTrading();

  if (!orderModalOpen || !orderModalData) return null;

  const [action, setAction]   = useState(orderModalData.action || 'BUY');
  const [price, setPrice]     = useState(orderModalData.price || 100);
  const [sl, setSl]           = useState(orderModalData.sl || +(orderModalData.price * 0.85).toFixed(1));
  const [target, setTarget]   = useState(orderModalData.target || +(orderModalData.price * 1.30).toFixed(1));
  const [lots, setLots]       = useState(1);
  const [trailing, setTrailing] = useState(true);

  const lotSize = orderModalData.lotSize || 25;
  const maxRisk = +(accountCapital * (riskRules.maxCapitalRiskPct / 100)).toFixed(0);
  const riskPS  = Math.max(0.1, Math.abs(price - sl));
  const profPS  = Math.max(0.1, Math.abs(target - price));
  const maxSafeLots = Math.max(1, Math.floor(maxRisk / (riskPS * lotSize)));
  const totalRisk   = +(riskPS * lotSize * lots).toFixed(0);
  const totalProfit = +(profPS * lotSize * lots).toFixed(0);
  const rr          = (profPS / riskPS).toFixed(2);
  const overLimit   = totalRisk > maxRisk;

  const submit = (e) => {
    e.preventDefault();
    if (overLimit) {
      alert(`Risk Limit Exceeded:\nThis trade risks ₹${totalRisk.toLocaleString('en-IN')}, over your cap of ₹${maxRisk.toLocaleString('en-IN')}.\nReduce to ≤${maxSafeLots} lot(s).`);
      return;
    }
    submitOrder({
      symbol: orderModalData.symbol, action,
      price: Number(price), sl: Number(sl), target: Number(target),
      lotSize, qty: lots * lotSize,
      trailingSlActive: trailing,
      strategy: orderModalData.strategy || 'Manual'
    });
  };

  return (
    <div style={B.backdrop}>
      <div style={B.modal}>
        {/* Modal header */}
        <div style={B.modalHdr}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <ShieldCheck size={14} style={{ color: 'var(--accent)' }} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-white)' }}>Risk-Verified Order Ticket</span>
          </div>
          <button style={B.closeBtn} onClick={() => setOrderModalOpen(false)}><X size={14} /></button>
        </div>

        <form onSubmit={submit} style={B.modalBody}>
          {/* Instrument info */}
          <div style={B.instrumentRow}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-white)' }}>{orderModalData.symbol}</span>
            <span className="tag tag-info">{orderModalData.strategy || 'Manual'}</span>
          </div>

          {/* Buy / Sell toggle */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
            {['BUY', 'SELL'].map(a => (
              <button
                key={a}
                type="button"
                className={a === 'BUY' ? 'btn btn-buy' : 'btn btn-sell'}
                style={{ justifyContent: 'center', padding: '8px', fontWeight: 700, opacity: action === a ? 1 : 0.35 }}
                onClick={() => setAction(a)}
              >
                {a === 'BUY' ? '↑ BUY / LONG' : '↓ SELL / SHORT'}
              </button>
            ))}
          </div>

          {/* Price inputs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {[
              { label: 'Entry Price (₹)', val: price, set: setPrice },
              { label: 'Stop Loss (₹)', val: sl, set: setSl },
              { label: 'Target (₹)', val: target, set: setTarget },
            ].map(f => (
              <div key={f.label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label className="form-label">{f.label}</label>
                <input type="number" step="0.05" className="form-input" value={f.val} onChange={e => f.set(Number(e.target.value))} required />
              </div>
            ))}
          </div>

          {/* Lot sizer */}
          <div style={B.sizer}>
            <div style={B.sizerHeader}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Lot Sizer
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-data)' }}>
                Safe max: <strong style={{ color: 'var(--up)' }}>{maxSafeLots}</strong> lot(s)
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Lots:</span>
              <div style={B.stepper}>
                <button type="button" style={B.stepBtn} onClick={() => setLots(Math.max(1, lots - 1))}>−</button>
                <span className="font-data" style={{ minWidth: '80px', textAlign: 'center', fontSize: '13px', fontWeight: 700 }}>
                  {lots} ({lots * lotSize} qty)
                </span>
                <button type="button" style={B.stepBtn} onClick={() => setLots(lots + 1)}>+</button>
              </div>
            </div>
          </div>

          {/* Risk calculation table */}
          <div style={{ ...B.riskBox, ...(overLimit ? B.riskDanger : B.riskOk) }}>
            {[
              { label: 'Capital Risk Cap (1.5%)', val: `₹${maxRisk.toLocaleString('en-IN')}`, color: 'var(--text-secondary)' },
              { label: 'This Trade — Max Loss (if SL hit)', val: `₹${totalRisk.toLocaleString('en-IN')}`, color: overLimit ? 'var(--down)' : 'var(--text-primary)' },
              { label: 'Target Profit', val: `₹${totalProfit.toLocaleString('en-IN')} (1 : ${rr} R:R)`, color: 'var(--up)' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '3px' }}>
                <span style={{ color: 'var(--text-muted)' }}>{r.label}</span>
                <span className="font-data" style={{ fontWeight: 700, color: r.color }}>{r.val}</span>
              </div>
            ))}
            {overLimit && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', color: 'var(--down)', fontSize: '11px', fontWeight: 600 }}>
                <AlertTriangle size={12} />
                Exceeds limit — reduce to ≤{maxSafeLots} lot(s)
              </div>
            )}
          </div>

          {/* Trailing SL */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
            <input type="checkbox" checked={trailing} onChange={e => setTrailing(e.target.checked)} style={{ accentColor: 'var(--up)' }} />
            Auto Trailing SL — Lock break-even at 1:1.5 R:R
          </label>

          {/* Submit */}
          <button
            type="submit"
            className={`btn ${action === 'BUY' ? 'btn-buy' : 'btn-sell'}`}
            disabled={overLimit}
            style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '13px', fontWeight: 700, opacity: overLimit ? 0.4 : 1 }}
          >
            <ShieldCheck size={15} />
            Confirm {action} Order
          </button>
        </form>
      </div>
    </div>
  );
};

const B = {
  backdrop: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.72)',
    backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 8000,
  },
  modal: {
    width: '480px', maxWidth: '95vw',
    background: 'var(--bg-panel)',
    border: '1px solid var(--border-2)',
    borderRadius: '6px',
    overflow: 'hidden',
    boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
  },
  modalHdr: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '10px 14px', background: 'var(--bg-panel-2)',
    borderBottom: '1px solid var(--border-1)',
  },
  closeBtn: { background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  modalBody: { padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' },
  instrumentRow: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', background: '#161616', borderRadius: '4px', border: '1px solid var(--border-1)' },

  sizer: { background: '#161616', border: '1px solid var(--border-1)', borderRadius: '4px', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '8px' },
  sizerHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  stepper: { display: 'flex', alignItems: 'center', background: 'var(--bg-panel-2)', border: '1px solid var(--border-2)', borderRadius: '4px', overflow: 'hidden' },
  stepBtn: { padding: '6px 14px', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '18px', cursor: 'pointer', fontWeight: 300 },

  riskBox: { padding: '10px 12px', borderRadius: '4px', border: '1px solid' },
  riskOk: { background: 'rgba(38,166,154,0.05)', borderColor: 'var(--up-border)' },
  riskDanger: { background: 'rgba(239,83,80,0.08)', borderColor: 'var(--down-border)' },
};
