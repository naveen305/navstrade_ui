import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  WATCHLIST,
  INITIAL_OPTION_CHAIN,
  INITIAL_POSITIONS,
  INITIAL_RISK_RULES,
  STRATEGY_TEMPLATES,
  SCANNER_SIGNALS,
  INITIAL_JOURNAL_TRADES,
  WEEKLY_ANALYTICS
} from '../data/mockMarketData';

const TradingContext = createContext();

export const TradingProvider = ({ children }) => {
  // Theme: Light by default (as explicitly requested: warm off-white #F7F6F3 background)
  const [theme, setTheme] = useState('light'); // 'light' | 'dark'

  // Navigation & Mode
  const [activeTab, setActiveTab] = useState('terminal');
  const [tradingMode, setTradingMode] = useState('PAPER'); // 'PAPER' | 'LIVE_UPSTOX'
  const [selectedSymbol, setSelectedSymbol] = useState(WATCHLIST[0]); // NIFTY 50

  // Market & Order State
  const [watchlist, setWatchlist] = useState(WATCHLIST);
  const [optionChain, setOptionChain] = useState(INITIAL_OPTION_CHAIN);
  const [positions, setPositions] = useState(INITIAL_POSITIONS);
  const [riskRules, setRiskRules] = useState(INITIAL_RISK_RULES);
  const [strategyTemplates] = useState(STRATEGY_TEMPLATES);
  const [scannerSignals] = useState(SCANNER_SIGNALS);
  const [journalTrades, setJournalTrades] = useState(INITIAL_JOURNAL_TRADES);
  const [weeklyAnalytics] = useState(WEEKLY_ANALYTICS);

  // Modals & Banners
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderModalData, setOrderModalData] = useState(null);
  const [panicModalOpen, setPanicModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [riskBanner, setRiskBanner] = useState(null); // Calm full-width banner when limit hit

  // Capital State
  const [accountCapital, setAccountCapital] = useState(500000.00);
  const [marginAvailable, setMarginAvailable] = useState(418250.00);

  // Criteria for Go Live
  const paperCriteria = {
    completed: weeklyAnalytics.paperTradesCompleted,
    required: weeklyAnalytics.paperTradesRequired,
    killSwitchBreaches: weeklyAnalytics.killSwitchBreaches,
    isMet: weeklyAnalytics.paperTradesCompleted >= weeklyAnalytics.paperTradesRequired && weeklyAnalytics.killSwitchBreaches === 0
  };

  // Settings
  const [settings, setSettings] = useState({
    broker: 'Upstox v2 API',
    clientId: '284910',
    apiKey: 'ups_sec_9942a',
    apiSecret: '••••••••••••••••',
    redirectUri: 'https://127.0.0.1:5173/auth/callback',
    webhookStatus: 'Connected (200 OK)',
    soundEffects: false,
    lockRulesUntilEOD: true,
  });

  // Total Realtime P&L calculation
  const totalUnrealizedPnl = positions.reduce((acc, pos) => acc + (pos.pnl || 0), 0);
  const totalNetPnl = riskRules.dailyRealizedPnl + totalUnrealizedPnl;

  // Toggle Theme
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Sync theme with HTML root class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  // Real-time market tick simulator
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Tick watchlist slightly and synchronize selectedSymbol
      setWatchlist(prev => {
        const next = prev.map(item => {
          const delta = (Math.random() - 0.49) * (item.price * 0.0005);
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
        });
        setSelectedSymbol(curr => next.find(w => w.symbol === curr.symbol) || curr);
        return next;
      });

      // 2. Tick active positions
      setPositions(prev =>
        prev.map(pos => {
          if (pos.isSpread) {
            const spreadDelta = (Math.random() - 0.48) * 0.12;
            const newSpreadVal = Math.max(0.2, +(pos.currentPrice + spreadDelta).toFixed(2));
            const pnlDelta = (newSpreadVal - pos.entryPrice) * pos.qty;
            const pnlPct = +(((newSpreadVal - pos.entryPrice) / pos.entryPrice) * 100).toFixed(1);

            return {
              ...pos,
              currentPrice: newSpreadVal,
              pnl: +pnlDelta.toFixed(2),
              pnlPct: pnlPct,
              tickDir: spreadDelta >= 0 ? 'up' : 'down',
              legs: pos.legs?.map((leg, idx) => {
                const legDelta = idx === 0 ? spreadDelta * 1.2 : -spreadDelta * 0.2;
                const newLegPrice = Math.max(0.1, +(leg.currentPrice + legDelta).toFixed(2));
                const legPnl = (newLegPrice - leg.entryPrice) * leg.qty;
                return {
                  ...leg,
                  currentPrice: newLegPrice,
                  pnl: +legPnl.toFixed(2),
                };
              })
            };
          }

          const tickDelta = (Math.random() - 0.48) * (pos.currentPrice * 0.0018);
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
          const ceDelta = (Math.random() - 0.48) * 0.35;
          const peDelta = (Math.random() - 0.52) * 0.35;
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
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  // Check Kill Switch condition
  useEffect(() => {
    if (totalNetPnl <= -riskRules.maxDailyLoss && !riskRules.killSwitchActive) {
      setRiskRules(prev => ({
        ...prev,
        killSwitchActive: true
      }));
      setRiskBanner({
        type: 'KILL_SWITCH',
        title: 'Daily Loss Limit Reached (-₹5,000)',
        message: 'Order entry has been safely paused for this session to protect your capital. All open positions were closed per predefined discipline parameters.'
      });
      // Close all open positions calmly
      setPositions([]);
    }
  }, [totalNetPnl, riskRules.maxDailyLoss, riskRules.killSwitchActive]);

  // Toast Notification Helper
  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3500);
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

    // Add to journal automatically
    const newJournal = {
      id: `TRD-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      symbol: target.symbol,
      strategy: target.strategy,
      side: target.qty > 0 ? 'BUY' : 'SELL',
      qty: Math.abs(target.qty),
      entryPrice: target.entryPrice,
      exitPrice: target.currentPrice,
      pnl: target.pnl,
      rMultiple: `${target.pnl >= 0 ? '+' : ''}${(target.pnl / 1500).toFixed(1)}R`,
      reason: 'Systematic exit via Terminal Close button.',
      emotion: 'Calm',
      status: 'CLOSED'
    };
    setJournalTrades(prev => [newJournal, ...prev]);

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
    showToast(`Emergency square-off executed. Realized P&L: ₹${totalPnlClosing.toFixed(2)}`, 'info');
  };

  // Open Order Ticket Modal
  const openOrderTicket = (data) => {
    if (riskRules.killSwitchActive) {
      showToast('Order entry is currently paused: Daily loss limit active.', 'warn');
      return;
    }
    setOrderModalData(data);
    setOrderModalOpen(true);
  };

  // Submit Order
  const submitOrder = (order) => {
    // Check max open positions
    if (positions.length >= riskRules.maxOpenTrades) {
      alert(`Max open position limit (${riskRules.maxOpenTrades}) reached. Close an existing position first to manage risk.`);
      return;
    }

    const newPos = {
      id: `POS-${Date.now().toString().slice(-3)}`,
      symbol: order.symbol,
      strategy: order.strategy || 'Manual Trade',
      type: order.action,
      qty: order.action === 'BUY' ? order.qty : -order.qty,
      lotSize: order.lotSize,
      entryPrice: order.price,
      currentPrice: order.price,
      sl: order.sl,
      target: order.target,
      maxLoss: order.maxLossRupees || Math.abs(order.price - order.sl) * order.qty,
      trailingSlActive: order.trailingSlActive,
      trailingSlStep: 2.0,
      pnl: 0,
      pnlPct: 0,
      delta: 0.50,
      theta: -18.0,
      vega: 12.0,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      reason: order.reason || 'Systematic entry with defined risk parameters'
    };

    setPositions(prev => [newPos, ...prev]);
    setMarginAvailable(prev => Math.max(0, prev - (order.price * order.qty)));
    setOrderModalOpen(false);
    showToast(`Order transmitted to ${tradingMode === 'PAPER' ? 'Simulator' : 'Upstox'}: ${order.action} ${order.symbol}`, 'success');
  };

  // Trigger Kill Switch (Calm Risk Limit Hit)
  const triggerKillSwitch = (reason = 'Daily loss limit reached (-₹5,000.00).') => {
    setRiskRules(prev => ({
      ...prev,
      killSwitchActive: true
    }));
    setRiskBanner({
      message: `${reason} In accordance with institutional risk discipline, order entry is calmly paused for the remainder of today's session. Capital preservation protocol engaged.`,
      type: 'limit_hit'
    });
    showToast('Risk discipline gate engaged: Daily limit reached. Order entry paused.', 'warn');
  };

  const clearRiskBanner = () => {
    setRiskRules(prev => ({
      ...prev,
      killSwitchActive: false
    }));
    setRiskBanner(null);
    showToast('Risk limit status reset.', 'info');
  };

  // Update Risk Engine Settings
  const updateRiskSettings = (newSettings) => {
    setRiskRules(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  return (
    <TradingContext.Provider
      value={{
        theme, setTheme, toggleTheme,
        activeTab, setActiveTab,
        tradingMode, setTradingMode,
        selectedSymbol, setSelectedSymbol,
        watchlist,
        optionChain,
        positions,
        riskRules,
        strategyTemplates,
        scannerSignals,
        journalTrades, setJournalTrades,
        weeklyAnalytics,
        paperCriteria,
        settings, setSettings,
        orderModalOpen, setOrderModalOpen,
        orderModalData, openOrderTicket,
        panicModalOpen, setPanicModalOpen,
        toastMessage, showToast,
        riskBanner, setRiskBanner,
        accountCapital, setAccountCapital,
        marginAvailable,
        totalUnrealizedPnl,
        totalNetPnl,
        closePosition,
        emergencySquareOffAll,
        submitOrder,
        updateRiskSettings,
        triggerKillSwitch,
        clearRiskBanner,
      }}
    >
      {children}
    </TradingContext.Provider>
  );
};

export const useTrading = () => {
  const context = useContext(TradingContext);
  if (!context) throw new Error('useTrading must be used within TradingProvider');
  return context;
};
