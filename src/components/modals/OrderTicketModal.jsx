import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Check, CircleAlert, LockKeyhole, ShieldCheck, X } from 'lucide-react';
import { useTrading } from '../../context/TradingContext';

const inr = (value, digits = 0) => `₹${Math.abs(value || 0).toLocaleString('en-IN', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;

export const OrderTicketModal = () => {
  const { orderModalOpen, setOrderModalOpen, orderModalData, submitOrder, accountCapital, riskRules } = useTrading();
  const [action, setAction] = useState('BUY');
  const [price, setPrice] = useState(100);
  const [stopLoss, setStopLoss] = useState(85);
  const [target, setTarget] = useState(125);
  const [lots, setLots] = useState(1);
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!orderModalData) return;
    const nextPrice = Number(orderModalData.price || 100);
    setAction(orderModalData.action || 'BUY');
    setPrice(nextPrice);
    setStopLoss(Number(orderModalData.sl || (nextPrice * .85).toFixed(1)));
    setTarget(Number(orderModalData.target || (nextPrice * 1.25).toFixed(1)));
    setLots(1);
    setReason(orderModalData.reason || 'Rule-backed entry with a defined invalidation');
  }, [orderModalData, orderModalOpen]);

  const lotSize = orderModalData?.lotSize || 25;
  const riskPerUnit = Math.max(.05, action === 'BUY' ? price - stopLoss : stopLoss - price);
  const rewardPerUnit = Math.max(.05, action === 'BUY' ? target - price : price - target);
  const contracts = lots * lotSize;
  const maxAllowedRisk = accountCapital * (riskRules.maxCapitalRiskPct / 100);
  const definedRisk = riskPerUnit * contracts;
  const maxLots = Math.max(1, Math.floor(maxAllowedRisk / (riskPerUnit * lotSize)));
  const validStop = action === 'BUY' ? stopLoss < price : stopLoss > price;
  const riskIsSafe = definedRisk <= maxAllowedRisk;
  const isBlocked = riskRules.killSwitchActive;
  const rewardRisk = useMemo(() => (rewardPerUnit / riskPerUnit).toFixed(2), [rewardPerUnit, riskPerUnit]);
  const submit = (event) => {
    event.preventDefault();
    if (!validStop || !riskIsSafe || isBlocked || reason.trim().length < 4) return;
    submitOrder({
      symbol: orderModalData.symbol,
      action,
      price: Number(price),
      sl: Number(stopLoss),
      target: Number(target),
      lotSize,
      qty: contracts,
      trailingSlActive: true,
      strategy: orderModalData.strategy || 'Rule-based order',
      reason: reason.trim(),
      maxLossRupees: definedRisk,
    });
  };

  if (!orderModalOpen || !orderModalData) return null;

  return <div className="modal-backdrop" onMouseDown={() => setOrderModalOpen(false)}>
    <form className="order-modal" onSubmit={submit} onMouseDown={(event) => event.stopPropagation()}>
      <div className="modal-header">
        <div><span><ShieldCheck size={15} /> PRE-TRADE CHECK</span><h2>Build a protected order</h2></div>
        <button type="button" onClick={() => setOrderModalOpen(false)} aria-label="Close"><X size={17} /></button>
      </div>
      {isBlocked && <div className="modal-warning"><LockKeyhole size={15} /> Daily loss protection is active. Order entry is paused.</div>}
      <div className="order-instrument"><div><strong>{orderModalData.symbol}</strong><span>{orderModalData.strategy || 'Systematic trade'} · {lotSize} per lot</span></div><span className="modal-paper">PAPER</span></div>
      <div className="order-body">
        <div className="order-side-switch"><button type="button" className={action === 'BUY' ? 'selected buy' : ''} onClick={() => setAction('BUY')}>BUY / LONG</button><button type="button" className={action === 'SELL' ? 'selected sell' : ''} onClick={() => setAction('SELL')}>SELL / SHORT</button></div>
        <div className="order-fields"><label><span>Entry</span><input type="number" step=".05" value={price} onChange={(event) => setPrice(Number(event.target.value))} /></label><label><span>Hard stop</span><input className={!validStop ? 'invalid' : ''} type="number" step=".05" value={stopLoss} onChange={(event) => setStopLoss(Number(event.target.value))} /></label><label><span>Target</span><input type="number" step=".05" value={target} onChange={(event) => setTarget(Number(event.target.value))} /></label></div>
        {!validStop && <div className="modal-warning"><CircleAlert size={15} /> For a {action.toLowerCase()} order, the hard stop must sit {action === 'BUY' ? 'below' : 'above'} entry.</div>}
        <div className="lot-control"><div><span>POSITION SIZE</span><strong>{lots} {lots === 1 ? 'lot' : 'lots'} <small>· {contracts} contracts</small></strong><p>Safe maximum: {maxLots} lots at your current stop.</p></div><div className="lot-stepper"><button type="button" onClick={() => setLots(Math.max(1, lots - 1))}>−</button><b>{lots}</b><button type="button" onClick={() => setLots(lots + 1)}>+</button></div></div>
        <label className="reason-field"><span>Why does this trade exist?</span><input value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Write the setup condition" /></label>
        <div className={`order-risk-card ${riskIsSafe ? 'safe' : 'unsafe'}`}><div><span>MAXIMUM LOSS</span><strong>{inr(definedRisk)}</strong><small>{((definedRisk / accountCapital) * 100).toFixed(2)}% of capital · limit {riskRules.maxCapitalRiskPct}%</small></div><div><span>REWARD IF TARGET HITS</span><strong>{inr(rewardPerUnit * contracts)}</strong><small>1 : {rewardRisk} reward / risk</small></div></div>
      </div>
      <div className="modal-footer"><span><Check size={14} /> Stop is attached before placement</span><button className="button-primary" disabled={!validStop || !riskIsSafe || isBlocked || reason.trim().length < 4}>Confirm paper order <ArrowRight size={15} /></button></div>
    </form>
  </div>;
};
