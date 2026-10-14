// Indian Market (NSE F&O) Mock Data & Real-Time Feed Simulator
export const WATCHLIST = [
  {
    symbol: 'NIFTY 50',
    type: 'INDEX',
    price: 25142.30,
    change: 142.85,
    changePct: 0.57,
    lotSize: 25,
    iv: 13.4,
    pcr: 1.18,
    maxPain: 25100,
    vwap: 25088.40,
    dayHigh: 25180.20,
    dayLow: 24995.50
  },
  {
    symbol: 'BANKNIFTY',
    type: 'INDEX',
    price: 51870.50,
    change: -125.40,
    changePct: -0.24,
    lotSize: 15,
    iv: 15.8,
    pcr: 0.88,
    maxPain: 52000,
    vwap: 51940.10,
    dayHigh: 52110.00,
    dayLow: 51740.20
  },
  {
    symbol: 'RELIANCE',
    type: 'STOCK',
    price: 2984.60,
    change: 32.40,
    changePct: 1.10,
    lotSize: 250,
    iv: 18.2,
    pcr: 1.24,
    maxPain: 2960,
    vwap: 2970.50,
    dayHigh: 2995.00,
    dayLow: 2948.00
  },
  {
    symbol: 'HDFCBANK',
    type: 'STOCK',
    price: 1672.25,
    change: -8.15,
    changePct: -0.48,
    lotSize: 550,
    iv: 16.5,
    pcr: 0.92,
    maxPain: 1680,
    vwap: 1678.90,
    dayHigh: 1686.00,
    dayLow: 1665.40
  },
  {
    symbol: 'TATAMOTORS',
    type: 'STOCK',
    price: 938.50,
    change: 18.75,
    changePct: 2.04,
    lotSize: 1425,
    iv: 24.1,
    pcr: 1.45,
    maxPain: 920,
    vwap: 931.20,
    dayHigh: 942.00,
    dayLow: 919.80
  },
  {
    symbol: 'INFY',
    type: 'STOCK',
    price: 1885.10,
    change: 14.30,
    changePct: 0.76,
    lotSize: 400,
    iv: 20.3,
    pcr: 1.05,
    maxPain: 1880,
    vwap: 1877.40,
    dayHigh: 1898.00,
    dayLow: 1868.50
  }
];

// Sample Option Chain for NIFTY 50 (ATM around 25150)
export const INITIAL_OPTION_CHAIN = [
  {
    strike: 24900,
    ce: { ltp: 284.50, change: 84.0, oi: 1420500, oiChange: -185000, iv: 14.8, delta: 0.78, gamma: 0.0012, theta: -14.2, vega: 12.8, bid: 284.10, ask: 284.90 },
    pe: { ltp: 42.10, change: -28.5, oi: 4890200, oiChange: 650000, iv: 15.6, delta: -0.22, gamma: 0.0012, theta: -8.5, vega: 11.2, bid: 41.80, ask: 42.30 }
  },
  {
    strike: 25000,
    ce: { ltp: 198.20, change: 68.4, oi: 2850400, oiChange: -340000, iv: 13.9, delta: 0.65, gamma: 0.0016, theta: -17.8, vega: 15.2, bid: 197.80, ask: 198.50 },
    pe: { ltp: 62.40, change: -38.2, oi: 6120800, oiChange: 1280000, iv: 14.7, delta: -0.35, gamma: 0.0016, theta: -11.4, vega: 14.5, bid: 62.10, ask: 62.70 }
  },
  {
    strike: 25050,
    ce: { ltp: 159.40, change: 58.1, oi: 1980300, oiChange: -120000, iv: 13.6, delta: 0.58, gamma: 0.0018, theta: -19.2, vega: 16.1, bid: 159.00, ask: 159.75 },
    pe: { ltp: 76.80, change: -42.0, oi: 3450000, oiChange: 450000, iv: 14.2, delta: -0.42, gamma: 0.0018, theta: -13.1, vega: 15.6, bid: 76.40, ask: 77.10 }
  },
  {
    strike: 25100,
    ce: { ltp: 124.60, change: 48.2, oi: 3840000, oiChange: 210000, iv: 13.4, delta: 0.52, gamma: 0.0020, theta: -21.4, vega: 16.8, bid: 124.20, ask: 125.00 },
    pe: { ltp: 94.20, change: -46.5, oi: 4120000, oiChange: 320000, iv: 13.8, delta: -0.48, gamma: 0.0020, theta: -15.4, vega: 16.4, bid: 93.80, ask: 94.50 }
  },
  {
    strike: 25150, // ATM
    ce: { ltp: 93.80, change: 39.5, oi: 3420000, oiChange: 580000, iv: 13.2, delta: 0.45, gamma: 0.0021, theta: -22.8, vega: 17.2, bid: 93.40, ask: 94.10 },
    pe: { ltp: 114.50, change: -51.2, oi: 3670000, oiChange: -180000, iv: 13.5, delta: -0.55, gamma: 0.0021, theta: -18.2, vega: 17.0, bid: 114.10, ask: 114.90 }
  },
  {
    strike: 25200,
    ce: { ltp: 68.30, change: 31.0, oi: 5120000, oiChange: 890000, iv: 13.1, delta: 0.38, gamma: 0.0019, theta: -21.1, vega: 16.5, bid: 68.00, ask: 68.60 },
    pe: { ltp: 138.90, change: -56.8, oi: 2100000, oiChange: -420000, iv: 13.9, delta: -0.62, gamma: 0.0019, theta: -19.8, vega: 16.3, bid: 138.40, ask: 139.30 }
  },
  {
    strike: 25250,
    ce: { ltp: 48.20, change: 23.4, oi: 2980000, oiChange: 430000, iv: 13.3, delta: 0.30, gamma: 0.0017, theta: -18.6, vega: 15.4, bid: 47.90, ask: 48.50 },
    pe: { ltp: 168.40, change: -62.1, oi: 1450000, oiChange: -310000, iv: 14.3, delta: -0.70, gamma: 0.0017, theta: -20.5, vega: 15.1, bid: 167.90, ask: 168.90 }
  },
  {
    strike: 25300,
    ce: { ltp: 32.50, change: 16.8, oi: 6450000, oiChange: 1120000, iv: 13.7, delta: 0.22, gamma: 0.0014, theta: -15.4, vega: 13.8, bid: 32.20, ask: 32.80 },
    pe: { ltp: 202.10, change: -67.4, oi: 980000, oiChange: -190000, iv: 14.8, delta: -0.78, gamma: 0.0014, theta: -20.9, vega: 13.5, bid: 201.50, ask: 202.60 }
  }
];

// Active Sample Positions (Reflecting Systematic Trades)
export const INITIAL_POSITIONS = [
  {
    id: 'POS-101',
    symbol: 'NIFTY 25150 CE',
    strategy: 'Momentum Breakout',
    type: 'BUY',
    qty: 50, // 2 lots
    lotSize: 25,
    entryPrice: 84.50,
    currentPrice: 93.80,
    sl: 72.00,
    target: 110.00,
    trailingSlActive: true,
    trailingSlStep: 5.0,
    pnl: 465.00,
    pnlPct: 11.0,
    delta: 0.45,
    theta: -22.8,
    vega: 17.2,
    time: '10:14 AM'
  },
  {
    id: 'POS-102',
    symbol: 'TATAMOTORS 930 CE',
    strategy: 'Bull Call Spread (Leg 1)',
    type: 'BUY',
    qty: 1425, // 1 lot
    lotSize: 1425,
    entryPrice: 22.40,
    currentPrice: 26.80,
    sl: 18.00,
    target: 32.00,
    trailingSlActive: true,
    trailingSlStep: 2.0,
    pnl: 6270.00,
    pnlPct: 19.6,
    delta: 0.62,
    theta: -4.2,
    vega: 8.5,
    time: '09:42 AM'
  },
  {
    id: 'POS-103',
    symbol: 'TATAMOTORS 950 CE',
    strategy: 'Bull Call Spread (Leg 2 - Hedge)',
    type: 'SELL',
    qty: -1425, // -1 lot
    lotSize: 1425,
    entryPrice: 12.10,
    currentPrice: 14.50,
    sl: 18.50,
    target: 6.00,
    trailingSlActive: false,
    trailingSlStep: 0,
    pnl: -3420.00,
    pnlPct: -19.8,
    delta: -0.38,
    theta: 3.8,
    vega: -6.2,
    time: '09:42 AM'
  }
];

// Anti-Emotion Institutional Risk Guard Rules
export const INITIAL_RISK_RULES = {
  maxDailyLoss: 5000,           // Hard Kill Switch at -₹5,000
  dailyRealizedPnl: 3315.00,     // Current Day P&L
  killSwitchActive: false,       // Becomes true if maxDailyLoss breached
  maxCapitalRiskPct: 1.5,       // Max 1.5% capital risked per trade
  maxOpenTrades: 3,             // Prevents over-trading
  revengeCooldownActive: false, // Activated after 2 back-to-back losses
  cooldownRemainingMins: 0,
  disciplineScore: 94,          // Score based on sticking to rules
  autoTrailingSl: true,
  panicSquareOffConfirmed: false
};

// Institutional Defined-Risk Templates
export const STRATEGY_TEMPLATES = [
  {
    id: 'strat-1',
    name: 'Bull Call Spread (Defined Risk)',
    category: 'Directional / Moderately Bullish',
    winRate: '68%',
    riskReward: '1 : 2.1',
    description: 'Buy ATM Call + Sell OTM Call. Caps max loss strictly to the net debit paid while financing the trade with short call theta.',
    legs: [
      { action: 'BUY', strikeOffset: 'ATM', type: 'CE', delta: '~0.50' },
      { action: 'SELL', strikeOffset: 'OTM (+1.5%)', type: 'CE', delta: '~0.30' }
    ],
    maxLoss: 'Defined (Net Premium)',
    maxProfit: 'Defined (Strike Diff - Net Premium)',
    sentiment: 'Bullish'
  },
  {
    id: 'strat-2',
    name: 'Bear Put Spread (Defined Risk)',
    category: 'Directional / Moderately Bearish',
    winRate: '66%',
    riskReward: '1 : 2.2',
    description: 'Buy ATM Put + Sell OTM Put. Complete protection against sudden market reversals with capped maximum loss.',
    legs: [
      { action: 'BUY', strikeOffset: 'ATM', type: 'PE', delta: '~ -0.50' },
      { action: 'SELL', strikeOffset: 'OTM (-1.5%)', type: 'PE', delta: '~ -0.30' }
    ],
    maxLoss: 'Defined (Net Premium)',
    maxProfit: 'Defined (Strike Diff - Net Premium)',
    sentiment: 'Bearish'
  },
  {
    id: 'strat-3',
    name: 'Iron Condor (Delta Neutral / Theta Harvest)',
    category: 'Non-Directional Range-Bound',
    winRate: '76%',
    riskReward: '1 : 1.4',
    description: 'Sell OTM Call & Put spread. Collects time decay when stock or index trades inside a defined range with hard stop wings.',
    legs: [
      { action: 'BUY', strikeOffset: 'Far OTM Put', type: 'PE', delta: '-0.15' },
      { action: 'SELL', strikeOffset: 'OTM Put', type: 'PE', delta: '-0.30' },
      { action: 'SELL', strikeOffset: 'OTM Call', type: 'CE', delta: '0.30' },
      { action: 'BUY', strikeOffset: 'Far OTM Call', type: 'CE', delta: '0.15' }
    ],
    maxLoss: 'Defined (Wing Width - Credit)',
    maxProfit: 'Net Credit Received',
    sentiment: 'Neutral'
  },
  {
    id: 'strat-4',
    name: 'High-Volume Breakout (Momentum Option Buying)',
    category: 'Trend Following',
    winRate: '54%',
    riskReward: '1 : 3.5',
    description: 'Only triggers when stock pierces 15-min Opening Range with >2x volume & heavy Call/Put OI unwinding. Strict trailing stop loss.',
    legs: [
      { action: 'BUY', strikeOffset: 'Slightly ITM / ATM', type: 'CE/PE', delta: '0.55-0.65' }
    ],
    maxLoss: 'Hard Stop-Loss (15% of premium)',
    maxProfit: 'Open Trailing',
    sentiment: 'Momentum'
  }
];

// Market Scanner Signals (Live OI & Technical Scan)
export const SCANNER_SIGNALS = [
  {
    symbol: 'TATAMOTORS',
    price: 938.50,
    signal: 'Long Buildup',
    confidence: 'HIGH (88%)',
    oiChangePct: '+14.2%',
    volumeMultiplier: '2.8x',
    pcr: 1.45,
    suggestedAction: 'Bull Call Spread 940/960'
  },
  {
    symbol: 'RELIANCE',
    price: 2984.60,
    signal: 'ORB Breakout (Bullish)',
    confidence: 'HIGH (82%)',
    oiChangePct: '+8.6%',
    volumeMultiplier: '2.1x',
    pcr: 1.24,
    suggestedAction: 'ATM 2980 CE Momentum'
  },
  {
    symbol: 'HDFCBANK',
    price: 1672.25,
    signal: 'Short Buildup',
    confidence: 'MEDIUM (74%)',
    oiChangePct: '+11.5%',
    volumeMultiplier: '1.4x',
    pcr: 0.92,
    suggestedAction: 'Bear Put Spread 1680/1660'
  },
  {
    symbol: 'INFY',
    price: 1885.10,
    signal: 'Range-Bound Consolidation',
    confidence: 'HIGH (91%)',
    oiChangePct: '-2.1%',
    volumeMultiplier: '0.9x',
    pcr: 1.05,
    suggestedAction: 'Iron Condor 1840/1860/1900/1920'
  }
];
