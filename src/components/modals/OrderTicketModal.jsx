import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { X, ShieldCheck, AlertCircle, CheckCircle2, Lock } from 'lucide-react';

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
  const [lots, setLots] = useState(1);
  const [trailing, setTrailing] = useState(true);

  const lotSize = orderModalData.lotSize || 25;
  const maxRiskRupees = +(accountCapital * (riskRules.maxCapitalRiskPct / 100)).toFixed(0);

  // Per share risk
  const riskPerShare = Math.max(0, action === 'BUY' ? price - sl : sl - price);
  const profitPerShare = Math.max(0, action === 'BUY' ? target - price : price - target);

  // Total risk calculations
  const totalQty = lots * lotSize;
  const totalRiskRupees = +(riskPerShare * totalQty).toFixed(0);
  const totalRiskPct = +((totalRiskRupees / accountCapital) * 100).toFixed(2);
  const totalProfitRupees = +(profitPerShare * totalQty).toFixed(0);
  const rrRatio = riskPerShare > 0 ? (profitPerShare / riskPerShare).toFixed(2) : '0.00';

  // Strict validation rules
  const hasValidSl = Boolean(sl) && Number(sl) > 0 && (
    action === 'BUY' ? Number(sl) < Number(price) : Number(sl) > Number(price)
  );

  const isOverCapitalLimit = totalRiskRupees > maxRiskRupees;
  const isKillSwitchActive = Boolean(riskRules.killSwitchActive);

  const canSubmit = hasValidSl && !isOverCapitalLimit && !isKillSwitchActive;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    submitOrder({
      symbol: orderModalData.symbol,
      action,
      price: Number(price),
      sl: Number(sl),
      target: Number(target),
      lotSize,
      qty: totalQty,
      trailingSlActive: trailing,
      strategy: orderModalData.strategy || 'Pre-set Defined Risk'
    });
  };

  return (
    <div style={B.backdrop} onClick={() => setOrderModalOpen(false)}>
      <div style={B.drawer} onClick={e => e.stopPropagation()}>
        {/* Drawer Header */}
        <div style={B.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldCheck size={16} style={{ color: 'var(--navy)' }} />
            <div>
              <span style={B.headerTitle}>Order Confirmation & Risk Pre-Clearance</span>
              <span style={B.headerSub}>SEBI & Upstox Pre-Trade Sizing Verification</span>
            </div>
          </div>
          <button
            style={B.closeBtn}
            onClick={() => setOrderModalOpen(false)}
            aria-label="Close Drawer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Kill Switch Alert Banner */}
        {isKillSwitchActive && (
          <div style={B.blockedBanner}>
            <Lock size={14} style={{ color: 'var(--loss)', flexShrink: 0 }} />
            <span style={{ fontSize: '11.5px', color: 'var(--loss)', fontWeight: 500 }}>
              Order entry is locked. Daily loss kill switch limit was triggered today.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={B.body}>
          {/* Instrument Summary */}
          <div style={B.instrumentCard}>
            <div>
              <span style={B.instSymbol}>{orderModalData.symbol}</span>
              <div style={B.instMeta}>
                Lot Size: <strong className="font-num">{lotSize}</strong> · NSE F&O
              </div>
            </div>
            <span style={B.strategyTag}>
              {orderModalData.strategy || 'Systematic Trade'}
            </span>
          </div>

          {/* Side Selector (BUY / SELL) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            <button
              type="button"
              style={{
                ...B.sideBtn,
                ...(action === 'BUY' ? B.sideBtnBuyActive : {})
              }}
              onClick={() => setAction('BUY')}
            >
              BUY / LONG
            </button>
            <button
              type="button"
              style={{
                ...B.sideBtn,
                ...(action === 'SELL' ? B.sideBtnSellActive : {})
              }}
              onClick={() => setAction('SELL')}
            >
              SELL / SHORT
            </button>
          </div>

          {/* Pricing Controls: Entry, SL, Target */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            <div>
              <label style={B.inputLabel}>Entry Price (₹)</label>
              <input
                type="number"
                step="0.05"
                className="form-input font-num"
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                required
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={B.inputLabel}>
                  Stop-Loss (₹) <span style={{ color: 'var(--loss)' }}>*</span>
                </label>
              </div>
              <input
                type="number"
                step="0.05"
                className="form-input font-num"
                style={{
                  borderColor: !hasValidSl ? 'var(--loss)' : 'var(--border-main)'
                }}
                value={sl}
                onChange={e => setSl(Number(e.target.value))}
                required
              />
            </div>

            <div>
              <label style={B.inputLabel}>Target (₹)</label>
              <input
                type="number"
                step="0.05"
                className="form-input font-num"
                value={target}
                onChange={e => setTarget(Number(e.target.value))}
                required
              />
            </div>
          </div>

          {/* Stop-Loss Mandatory Notice */}
          {!hasValidSl && (
            <div style={B.slWarningNotice}>
              <AlertCircle size={13} style={{ color: 'var(--loss)', flexShrink: 0 }} />
              <span style={{ fontSize: '11px', color: 'var(--loss)' }}>
                Mandatory Stop-Loss required: For {action}, SL must be {action === 'BUY' ? 'below' : 'above'} entry price (₹{price}).
              </span>
            </div>
          )}

          {/* Position Sizing Stepper */}
          <div style={B.sizerBox}>
            <div style={B.sizerHeader}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Position Sizing & Lot Count
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Total contracts: <strong className="font-num" style={{ color: 'var(--text-primary)' }}>{totalQty}</strong>
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={B.stepperWrap}>
                <button
                  type="button"
                  style={B.stepBtn}
                  onClick={() => setLots(Math.max(1, lots - 1))}
                >
                  −
                </button>
                <span className="font-num" style={B.stepDisplay}>
                  {lots} {lots === 1 ? 'lot' : 'lots'}
                </span>
                <button
                  type="button"
                  style={B.stepBtn}
                  onClick={() => setLots(lots + 1)}
                >
                  +
                </button>
              </div>

              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                (₹{(price * totalQty).toLocaleString('en-IN', { maximumFractionDigits: 0 })} capital allocated)
              </span>
            </div>
          </div>

          {/* Prominent Max Loss Confirmation Panel (Strict Requirement) */}
          <div style={{ ...B.riskCard, ...(isOverCapitalLimit ? B.riskCardOver : {}) }}>
            <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)', marginBottom: 6 }}>
              Risk Assessment & Capital Exposure
            </div>

            <div style={B.riskRow}>
              <span style={B.riskLabel}>Maximum Defined Loss (in Rupees):</span>
              <span className="font-num" style={{ fontSize: '13px', fontWeight: 600, color: isOverCapitalLimit ? 'var(--loss)' : 'var(--loss)' }}>
                -₹{totalRiskRupees.toLocaleString('en-IN')}
              </span>
            </div>

            <div style={B.riskRow}>
              <span style={B.riskLabel}>Max Loss (% of Total Capital):</span>
              <span className="font-num" style={{ fontSize: '13px', fontWeight: 600, color: isOverCapitalLimit ? 'var(--loss)' : 'var(--text-primary)' }}>
                {totalRiskPct}% <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>(Cap: {riskRules.maxCapitalRiskPct}%)</span>
              </span>
            </div>

            <div style={B.riskRow}>
              <span style={B.riskLabel}>Target Reward Potential:</span>
              <span className="font-num" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--profit)' }}>
                +₹{totalProfitRupees.toLocaleString('en-IN')} (1 : {rrRatio} R:R)
              </span>
            </div>

            {isOverCapitalLimit && (
              <div style={B.overLimitWarning}>
                <AlertCircle size={13} style={{ color: 'var(--loss)', flexShrink: 0 }} />
                <span>
                  Exceeds {riskRules.maxCapitalRiskPct}% account risk cap (-₹{maxRiskRupees.toLocaleString('en-IN')}). Reduce lot size.
                </span>
              </div>
            )}
          </div>

          {/* Auto Trailing Stop-Loss Option */}
          <label style={B.checkboxLabel}>
            <input
              type="checkbox"
              checked={trailing}
              onChange={e => setTrailing(e.target.checked)}
              style={{ accentColor: 'var(--navy)' }}
            />
            <span>Auto-trail stop-loss in favorable 5-point intervals after 1:1.5 R:R</span>
          </label>

          {/* Action Submission */}
          <div style={{ marginTop: 4 }}>
            <button
              type="submit"
              disabled={!canSubmit}
              className="btn btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '9px 12px',
                fontSize: '12.5px',
                fontWeight: 600,
                borderRadius: 'var(--radius)',
                opacity: canSubmit ? 1 : 0.45,
                cursor: canSubmit ? 'pointer' : 'not-allowed',
              }}
            >
              <ShieldCheck size={14} />
              Transmit Verified {action} Order to Upstox
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const B = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(20, 23, 28, 0.45)',
    backdropFilter: 'blur(2px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9000,
  },
  drawer: {
    width: '450px',
    maxWidth: '94vw',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-main)',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow-modal)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
    backgroundColor: 'var(--bg-surface)',
    borderBottom: '1px solid var(--border-main)',
  },
  headerTitle: {
    fontSize: '12.5px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    display: 'block',
  },
  headerSub: {
    fontSize: '10.5px',
    color: 'var(--text-muted)',
    display: 'block',
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
  blockedBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 14px',
    backgroundColor: 'var(--loss-bg)',
    borderBottom: '1px solid var(--border-light)',
  },
  body: {
    padding: '14px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  instrumentCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 10px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius)',
  },
  instSymbol: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    display: 'block',
  },
  instMeta: {
    fontSize: '10.5px',
    color: 'var(--text-muted)',
    marginTop: 1,
  },
  strategyTag: {
    fontSize: '10.5px',
    fontWeight: 600,
    color: 'var(--navy)',
    backgroundColor: 'var(--bg-main)',
    padding: '2px 7px',
    borderRadius: '3px',
    border: '1px solid var(--border-main)',
  },
  sideBtn: {
    padding: '6px',
    fontSize: '11.5px',
    fontWeight: 600,
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border-main)',
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all 120ms ease',
  },
  sideBtnBuyActive: {
    backgroundColor: 'var(--profit)',
    color: '#FFFFFF',
    borderColor: 'var(--profit)',
  },
  sideBtnSellActive: {
    backgroundColor: 'var(--loss)',
    color: '#FFFFFF',
    borderColor: 'var(--loss)',
  },
  inputLabel: {
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    display: 'block',
    marginBottom: 3,
  },
  slWarningNotice: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 10px',
    backgroundColor: 'var(--loss-bg)',
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius)',
  },
  sizerBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    padding: '8px 10px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius)',
  },
  sizerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepperWrap: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid var(--border-main)',
    borderRadius: 'var(--radius)',
    backgroundColor: 'var(--bg-surface)',
    overflow: 'hidden',
  },
  stepBtn: {
    padding: '3px 10px',
    border: 'none',
    background: 'none',
    fontSize: '13px',
    cursor: 'pointer',
    color: 'var(--text-primary)',
  },
  stepDisplay: {
    padding: '0 8px',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    minWidth: '60px',
    textAlign: 'center',
  },
  riskCard: {
    padding: '10px 12px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-main)',
    borderRadius: 'var(--radius)',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  riskCardOver: {
    borderColor: 'var(--loss)',
    backgroundColor: 'var(--loss-bg)',
  },
  riskRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  riskLabel: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
  },
  overLimitWarning: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    paddingTop: 4,
    borderTop: '1px solid var(--border-light)',
    fontSize: '10.5px',
    color: 'var(--loss)',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: '11px',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
  },
};
