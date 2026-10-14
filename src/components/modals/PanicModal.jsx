import React from 'react';
import { TriangleAlert, X } from 'lucide-react';
import { useTrading } from '../../context/TradingContext';

export const PanicModal = () => {
  const { panicModalOpen, setPanicModalOpen, positions, emergencySquareOffAll } = useTrading();
  if (!panicModalOpen) return null;
  const netPnl = positions.reduce((sum, position) => sum + position.pnl, 0);
  return <div className="modal-backdrop" onMouseDown={() => setPanicModalOpen(false)}>
    <div className="panic-modal" onMouseDown={(event) => event.stopPropagation()}>
      <div className="modal-header"><div><span><TriangleAlert size={15} /> EMERGENCY ACTION</span><h2>Square off every position?</h2></div><button onClick={() => setPanicModalOpen(false)} aria-label="Close"><X size={17} /></button></div>
      <p>This immediately sends exit instructions for all open simulated positions and cancels their linked stop and target orders.</p>
      <div className="panic-list">{positions.length ? positions.map((position) => <div key={position.id}><span>{position.symbol}</span><b className={position.pnl >= 0 ? 'positive' : 'negative'}>{position.pnl >= 0 ? '+' : '−'}₹{Math.abs(position.pnl).toLocaleString('en-IN')}</b></div>) : <div><span>No open positions</span></div>}</div>
      <div className="panic-total"><span>Unrealized P&amp;L on exit</span><b className={netPnl >= 0 ? 'positive' : 'negative'}>{netPnl >= 0 ? '+' : '−'}₹{Math.abs(netPnl).toLocaleString('en-IN')}</b></div>
      <div className="panic-actions"><button className="quiet-button" onClick={() => setPanicModalOpen(false)}>Cancel</button><button className="panic-confirm" onClick={emergencySquareOffAll}><TriangleAlert size={15} /> Confirm square off</button></div>
    </div>
  </div>;
};
