import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  WATCHLIST,
  INITIAL_OPTION_CHAIN,
  INITIAL_POSITIONS,
  INITIAL_RISK_RULES,
  STRATEGY_TEMPLATES,
  SCANNER_SIGNALS
} from '../data/mockMarketData';

const TradingContext = createContext();

export const TradingProvider = ({ children }) => {
  // Navigation & Mode
  const [activeTab, setActiveTab] = useState('terminal');
  const [tradingMode, setTradingMode] = useState('PAPER'); // 'PAPER' | 'LIVE_UPSTOX'
  const [selectedSymbol, setSelectedSymbol] = useState(WATCHLIST[0]); // NIFTY 50

  // Market & Order State
  const [watchlist, setWatchlist] = useState(WATCHLIST);
  const [optionChain, setOptionChain] = useState(INITIAL_OPTION_CHAIN);
  const [positions, setPositions] = useState(INITIAL_POSITIONS);
  const [riskRules, setRiskRules] = useState(INITIAL_RISK_RULES);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderModalData, setOrderModalData] = useState(null);
  const [panicModalOpen, setPanicModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Capital State
  const [accountCapital, setAccountCapital] = useState(500000.00);
  const [marginAvailable, setMarginAvailable] = useState(418250.00);

  // Total Realtime P&L calculation
  const totalUnrealizedPnl = positions.reduce((acc, pos) => acc + (pos.pnl || 0), 0);
  const totalNetPnl = riskRules.dailyRealizedPnl + totalUnrealizedPnl;

  // Real-time market tick simulator (institutional feel)
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Tick watchlist slightly
      setWatchlist(prev =>
        prev.map(item => {
          const delta = (Math.random() - 0.49) * (item.price * 0.0006);
          const newPrice = +(item.price + delta).toFixed(2);
          const newChange = +(item.change + delta).toFixed(2);
          const newPct = +((newChange / (newPrice - newChange)) * 100).toFixed(2);
          return {
            ...item,
            price: newPrice,
            change: newChange,
            changePct: newPct,
            tickDir: delta >= 0 ? 'up' : 'down'
          };
        })
      );

      // 2. Tick active positions
      setPositions(prev =>
        prev.map(pos => {
          const tickDelta = (Math.random() - 0.48) * (pos.currentPrice * 0.002);
          const newPrice = Math.max(0.05, +(pos.currentPrice + tickDelta).toFixed(2));
          const pnlDelta = (newPrice - pos.entryPrice) * pos.qty;
          const pnlPct = +(((newPrice - pos.entryPrice) / pos.entryPrice) * 100).toFixed(1);

          return {
            ...pos,
            currentPrice: newPrice,
            pnl: +pnlDelta.toFixed(2),
            pnlPct: pnlPct,
            tickDir: tickDelta >= 0 ? 'up' : 'down'
          };
        })
      );

      // 3. Tick Option Chain ATM strikes slightly
      setOptionChain(prev =>
        prev.map(row => {
          const ceDelta = (Math.random() - 0.48) * 0.4;
          const peDelta = (Math.random() - 0.52) * 0.4;
          return {
            ...row,
            ce: {
              ...row.ce,
              ltp: Math.max(0.1, +(row.ce.ltp + ceDelta).toFixed(2)),
              change: +(row.ce.change + ceDelta).toFixed(2)
            },
            pe: {
              ...row.pe,
              ltp: Math.max(0.1, +(row.pe.ltp + peDelta).toFixed(2)),
              change: +(row.pe.change + peDelta).toFixed(2)
            }
          };
        })
      );
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Check Kill Switch condition
  useEffect(() => {
    if (totalNetPnl <= -riskRules.maxDailyLoss && !riskRules.killSwitchActive) {
      setRiskRules(prev => ({
        ...prev,
        killSwitchActive: true
      }));
      showToast('⚠️ KILL-SWITCH TRIGGERED: Max daily loss hit! All open positions squared off & terminal locked.', 'danger');
      // Emergency square off all open positions
      setPositions([]);
    }
  }, [totalNetPnl, riskRules.maxDailyLoss, riskRules.killSwitchActive]);

  // Toast Notification Helper
  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Close a single position
  const closePosition = (id) => {
    const target = positions.find(p => p.id === id);
    if (!target) return;

    setPositions(prev => prev.filter(p => p.id !== id));
    setRiskRules(prev => ({
      ...prev,
      dailyRealizedPnl: +(prev.dailyRealizedPnl + target.pnl).toFixed(2)
    }));
    showToast(`Closed ${target.symbol} with P&L: ₹${target.pnl.toLocaleString('en-IN')}`, target.pnl >= 0 ? 'success' : 'danger');
  };

  // Instant Emergency Panic Square-off All
  const emergencySquareOffAll = () => {
    const totalPnlClosing = positions.reduce((acc, p) => acc + p.pnl, 0);
    setPositions([]);
    setRiskRules(prev => ({
      ...prev,
      dailyRealizedPnl: +(prev.dailyRealizedPnl + totalPnlClosing).toFixed(2),
      panicSquareOffConfirmed: true
    }));
    setPanicModalOpen(false);
    showToast('🚨 EMERGENCY SQUARE-OFF EXECUTED: All positions closed and pending orders cancelled.', 'danger');
  };

  // Open Order Placement modal
  const openOrderTicket = (prefillData = {}) => {
    if (riskRules.killSwitchActive) {
      showToast('❌ Order Rejected: Kill Switch is active for the day!', 'danger');
      return;
    }
    setOrderModalData(prefillData);
    setOrderModalOpen(true);
  };

  // Submit Order from Modal
  const submitOrder = (order) => {
    const newPos = {
      id: `POS-${Math.floor(100 + Math.random() * 900)}`,
      symbol: order.symbol,
      strategy: order.strategy || 'Manual Order',
      type: order.action,
      qty: order.action === 'BUY' ? order.qty : -order.qty,
      lotSize: order.lotSize,
      entryPrice: order.price,
      currentPrice: order.price,
      sl: order.sl,
      target: order.target,
      trailingSlActive: order.trailingSlActive || true,
      trailingSlStep: 2.0,
      pnl: 0,
      pnlPct: 0,
      delta: 0.50,
      theta: -18.5,
      vega: 14.2,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setPositions(prev => [newPos, ...prev]);
    setOrderModalOpen(false);
    showToast(`✅ Order Executed: ${order.action} ${order.qty}x ${order.symbol} @ ₹${order.price}`, 'success');
  };

  // Update Risk Rules
  const updateRiskSettings = (newSettings) => {
    setRiskRules(prev => ({ ...prev, ...newSettings }));
    showToast('🛡️ Risk Guard & Kill Switch rules updated successfully!', 'success');
  };

  return (
    <TradingContext.Provider
      value={{
        activeTab,
        setActiveTab,
        tradingMode,
        setTradingMode,
        selectedSymbol,
        setSelectedSymbol,
        watchlist,
        optionChain,
        positions,
        riskRules,
        accountCapital,
        marginAvailable,
        totalUnrealizedPnl,
        totalNetPnl,
        orderModalOpen,
        setOrderModalOpen,
        orderModalData,
        panicModalOpen,
        setPanicModalOpen,
        toastMessage,
        showToast,
        closePosition,
        emergencySquareOffAll,
        openOrderTicket,
        submitOrder,
        updateRiskSettings,
        strategyTemplates: STRATEGY_TEMPLATES,
        scannerSignals: SCANNER_SIGNALS
      }}
    >
      {children}
    </TradingContext.Provider>
  );
};

export const useTrading = () => useContext(TradingContext);
