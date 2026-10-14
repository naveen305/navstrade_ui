import React, { useState, useEffect } from 'react';
import { useTrading } from '../../context/TradingContext';
import { X, ShieldCheck, AlertTriangle, Calculator, CheckCircle2 } from 'lucide-react';

export const OrderTicketModal = () => {
  const {
    orderModalOpen,
    setOrderModalOpen,
    orderModalData,
    submitOrder,
    accountCapital,
    riskRules
  } = useTrading();

  if (!orderModalOpen || !orderModalData) return null;

  const [action, setAction] = useState(orderModalData.action || 'BUY');
  const [price, setPrice] = useState(orderModalData.price || 100);
  const [sl, setSl] = useState(orderModalData.sl || +(orderModalData.price * 0.85).toFixed(1));
  const [target, setTarget] = useState(orderModalData.target || +(orderModalData.price * 1.30).toFixed(1));
  const lotSize = orderModalData.lotSize || 25;
  const [lots, setLots] = useState(1);
  const [trailingSl, setTrailingSl] = useState(true);

  // Maximum allowed risk based on 1.5% rule
  const maxAllowedRisk = +(accountCapital * (riskRules.maxCapitalRiskPct / 100)).toFixed(0);

  // Loss per share if SL hits
  const riskPerShare = Math.max(0.1, Math.abs(price - sl));

  // Recommended safe lot calculation
  const calculatedMaxSafeLots = Math.max(1, Math.floor(maxAllowedRisk / (riskPerShare * lotSize)));

  // Total potential loss on this trade
  const totalPotentialLoss = +(riskPerShare * lotSize * lots).toFixed(0);

  // Total potential profit if Target hits
  const profitPerShare = Math.max(0.1, Math.abs(target - price));
  const totalPotentialProfit = +(profitPerShare * lotSize * lots).toFixed(0);

  // Risk : Reward ratio
  const riskRewardRatio = (profitPerShare / riskPerShare).toFixed(2);

  const isRiskViolation = totalPotentialLoss > maxAllowedRisk;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRiskViolation) {
      alert(`⚠️ RISK REJECTION:\nThis order risks ₹${totalPotentialLoss}, which exceeds your strict discipline limit of ₹${maxAllowedRisk} (1.5% of capital).\nReduce lots to ${calculatedMaxSafeLots} or adjust your Stop Loss.`);
      return;
    }

    submitOrder({
      symbol: orderModalData.symbol,
      action: action,
      price: Number(price),
      sl: Number(sl),
      target: Number(target),
      lotSize: lotSize,
      qty: lots * lotSize,
      trailingSlActive: trailingSl,
      strategy: orderModalData.strategy || 'Systematic Disciplinary Order'
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="terminal-card order-modal">
        <div className="terminal-card-header modal-header">
          <div className="modal-title-group">
            <Calculator size={16} className="text-cyan" />
            <span className="modal-title">INSTITUTIONAL RISK-SIZED ORDER TICKET</span>
          </div>
          <button className="close-btn" onClick={() => setOrderModalOpen(false)}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="terminal-card-body modal-body">
          {/* Symbol & Strategy Banner */}
          <div className="order-target-banner">
            <div>
              <span className="ot-symbol font-bold">{orderModalData.symbol}</span>
              <span className="ot-strat badge badge-purple">{orderModalData.strategy || 'Manual Entry'}</span>
            </div>
            <div className="ot-lotsize mono text-muted">
              1 Lot = {lotSize} Qty
            </div>
          </div>

          {/* Action Tabs: BUY vs SELL */}
          <div className="side-toggle-group">
            <button
              type="button"
              className={`side-btn ${action === 'BUY' ? 'side-buy-active' : ''}`}
              onClick={() => setAction('BUY')}
            >
              BUY (LONG)
            </button>
            <button
              type="button"
              className={`side-btn ${action === 'SELL' ? 'side-sell-active' : ''}`}
              onClick={() => setAction('SELL')}
            >
              SELL (SHORT)
            </button>
          </div>

          {/* Price, SL, Target Inputs */}
          <div className="inputs-grid">
            <div className="input-group">
              <label className="input-label">EXECUTION PRICE (₹)</label>
              <input
                type="number"
                step="0.05"
                className="form-input mono"
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label text-loss">HARD STOP-LOSS (₹)</label>
              <input
                type="number"
                step="0.05"
                className="form-input mono"
                value={sl}
                onChange={e => setSl(Number(e.target.value))}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label text-profit">TARGET (₹)</label>
              <input
                type="number"
                step="0.05"
                className="form-input mono"
                value={target}
                onChange={e => setTarget(Number(e.target.value))}
                required
              />
            </div>
          </div>

          {/* Institutional Lot Sizer - Anti-Overleveraging */}
          <div className="lot-sizer-section">
            <div className="sizer-header">
              <span className="sizer-title">
                <ShieldCheck size={14} className="text-profit" />
                AUTOMATIC LOT SIZER (CAPITAL PROTECTION)
              </span>
              <span className="mono text-muted text-xs">
                Safe Max: <strong>{calculatedMaxSafeLots} Lots</strong>
              </span>
            </div>

            <div className="sizer-control-row">
              <label className="text-secondary font-bold">Number of Lots:</label>
              <div className="lot-stepper">
                <button
                  type="button"
                  className="step-btn"
                  onClick={() => setLots(Math.max(1, lots - 1))}
                >
                  -
                </button>
                <span className="lot-count mono font-bold">{lots} ({lots * lotSize} Qty)</span>
                <button
                  type="button"
                  className="step-btn"
                  onClick={() => setLots(lots + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Risk Check Indicator Box */}
            <div className={`risk-check-box ${isRiskViolation ? 'rc-danger' : 'rc-safe'}`}>
              <div className="rc-row">
                <span>Max Allowed Risk (1.5% Cap):</span>
                <span className="mono font-bold">₹{maxAllowedRisk.toLocaleString('en-IN')}</span>
              </div>
              <div className="rc-row">
                <span>Total Potential Loss on SL:</span>
                <span className={`mono font-bold ${isRiskViolation ? 'text-loss' : 'text-primary'}`}>
                  ₹{totalPotentialLoss.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="rc-row">
                <span>Target Profit / R:R:</span>
                <span className="mono text-profit font-bold">
                  ₹{totalPotentialProfit.toLocaleString('en-IN')} (1 : {riskRewardRatio})
                </span>
              </div>

              {isRiskViolation && (
                <div className="risk-warning-callout">
                  <AlertTriangle size={14} className="text-loss" />
                  <span>DISCIPLINE REJECTION: Exceeds 1.5% risk limit! Reduce to ≤{calculatedMaxSafeLots} lots.</span>
                </div>
              )}
            </div>
          </div>

          {/* Trailing SL Automation Checkbox */}
          <label className="trailing-option">
            <input
              type="checkbox"
              checked={trailingSl}
              onChange={e => setTrailingSl(e.target.checked)}
              className="checkbox-input"
            />
            <span className="text-secondary text-xs">
              Enable Automated Trailing SL (Locks Break-Even at 1:1.5 R:R, prevents green trades turning red)
            </span>
          </label>

          {/* Submission Button */}
          <button
            type="submit"
            className={`btn ${action === 'BUY' ? 'btn-success' : 'btn-danger'} modal-submit-btn`}
            disabled={isRiskViolation}
          >
            <ShieldCheck size={16} />
            <span>SUBMIT VERIFIED {action} ORDER</span>
          </button>
        </form>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .order-modal {
          width: 500px;
          max-width: 95vw;
          background: var(--bg-surface-1);
          border-color: var(--border-cyan);
          box-shadow: 0 0 32px rgba(0, 240, 255, 0.2);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-title-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .modal-title {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: #ffffff;
        }

        .close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }

        .close-btn:hover {
          color: #ffffff;
        }

        .modal-body {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .order-target-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--bg-surface-2);
          padding: 10px 14px;
          border-radius: 6px;
          border: 1px solid var(--border-subtle);
        }

        .ot-symbol {
          font-size: 13.5px;
          color: #ffffff;
          margin-right: 8px;
        }

        .side-toggle-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }

        .side-btn {
          padding: 8px;
          font-weight: 700;
          font-size: 12px;
          border-radius: 5px;
          border: 1px solid var(--border-medium);
          background: var(--bg-surface-2);
          color: var(--text-secondary);
          cursor: pointer;
        }

        .side-buy-active {
          background: var(--profit-green) !important;
          color: #000 !important;
          border-color: var(--profit-green) !important;
        }

        .side-sell-active {
          background: var(--loss-red) !important;
          color: #fff !important;
          border-color: var(--loss-red) !important;
        }

        .inputs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .input-label {
          font-size: 9.5px;
          font-weight: 700;
        }

        .lot-sizer-section {
          background: var(--bg-surface-2);
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .sizer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sizer-title {
          font-size: 10.5px;
          font-weight: 700;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .sizer-control-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .lot-stepper {
          display: flex;
          align-items: center;
          background: var(--bg-surface-3);
          border-radius: 4px;
          border: 1px solid var(--border-subtle);
        }

        .step-btn {
          background: transparent;
          border: none;
          color: #ffffff;
          font-size: 16px;
          font-weight: bold;
          padding: 4px 12px;
          cursor: pointer;
        }

        .lot-count {
          padding: 0 10px;
          font-size: 12.5px;
        }

        .risk-check-box {
          border-radius: 5px;
          padding: 8px 10px;
          font-size: 11px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .rc-safe {
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .rc-danger {
          background: rgba(244, 63, 94, 0.15);
          border: 1px solid var(--loss-red);
        }

        .rc-row {
          display: flex;
          justify-content: space-between;
        }

        .risk-warning-callout {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 4px;
          font-weight: 700;
          color: var(--loss-red);
        }

        .trailing-option {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .modal-submit-btn {
          padding: 10px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .modal-submit-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          filter: grayscale(1);
        }
      `}</style>
    </div>
  );
};
