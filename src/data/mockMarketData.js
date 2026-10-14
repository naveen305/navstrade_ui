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

// Sample Option Chain for NIFTY 50 (ATM around 25150) - 16 Full Strikes
export const INITIAL_OPTION_CHAIN = [
  {
    strike: 24800,
    ce: { ltp: 372.40, change: 112.5, oi: 940000, oiChange: -310000, iv: 15.2, delta: 0.88, gamma: 0.0008, theta: -11.2, vega: 8.6, bid: 371.80, ask: 373.00 },
    pe: { ltp: 18.25, change: -19.4, oi: 5820000, oiChange: 840000, iv: 16.4, delta: -0.12, gamma: 0.0008, theta: -6.1, vega: 7.9, bid: 18.05, ask: 18.45 }
  },
  {
    strike: 24850,
    ce: { ltp: 326.80, change: 98.2, oi: 1120000, oiChange: -240000, iv: 15.0, delta: 0.83, gamma: 0.0010, theta: -12.6, vega: 10.4, bid: 326.20, ask: 327.40 },
    pe: { ltp: 24.60, change: -23.1, oi: 4950000, oiChange: 720000, iv: 16.0, delta: -0.17, gamma: 0.0010, theta: -7.2, vega: 9.5, bid: 24.40, ask: 24.80 }
  },
  {
    strike: 24900,
    ce: { ltp: 284.50, change: 84.0, oi: 1620000, oiChange: -185000, iv: 14.8, delta: 0.78, gamma: 0.0012, theta: -14.2, vega: 12.8, bid: 284.10, ask: 284.90 },
    pe: { ltp: 33.10, change: -28.5, oi: 4890000, oiChange: 650000, iv: 15.6, delta: -0.22, gamma: 0.0012, theta: -8.5, vega: 11.2, bid: 32.80, ask: 33.40 }
  },
  {
    strike: 24950,
    ce: { ltp: 242.10, change: 76.5, oi: 1980000, oiChange: -140000, iv: 14.3, delta: 0.72, gamma: 0.0014, theta: -15.9, vega: 14.1, bid: 241.60, ask: 242.60 },
    pe: { ltp: 45.80, change: -33.4, oi: 5410000, oiChange: 910000, iv: 15.1, delta: -0.28, gamma: 0.0014, theta: -10.0, vega: 13.0, bid: 45.50, ask: 46.10 }
  },
  {
    strike: 25000,
    ce: { ltp: 198.20, change: 68.4, oi: 2850000, oiChange: -340000, iv: 13.9, delta: 0.65, gamma: 0.0016, theta: -17.8, vega: 15.2, bid: 197.80, ask: 198.50 },
    pe: { ltp: 62.40, change: -38.2, oi: 6120000, oiChange: 1280000, iv: 14.7, delta: -0.35, gamma: 0.0016, theta: -11.4, vega: 14.5, bid: 62.10, ask: 62.70 }
  },
  {
    strike: 25050,
    ce: { ltp: 159.40, change: 58.1, oi: 2450000, oiChange: -120000, iv: 13.6, delta: 0.58, gamma: 0.0018, theta: -19.2, vega: 16.1, bid: 159.00, ask: 159.75 },
    pe: { ltp: 76.80, change: -42.0, oi: 3450000, oiChange: 450000, iv: 14.2, delta: -0.42, gamma: 0.0018, theta: -13.1, vega: 15.6, bid: 76.40, ask: 77.10 }
  },
  {
    strike: 25100,
    ce: { ltp: 124.60, change: 48.2, oi: 3840000, oiChange: 210000, iv: 13.4, delta: 0.52, gamma: 0.0020, theta: -21.4, vega: 16.8, bid: 124.20, ask: 125.00 },
    pe: { ltp: 94.20, change: -46.5, oi: 4120000, oiChange: 320000, iv: 13.8, delta: -0.48, gamma: 0.0020, theta: -15.4, vega: 16.4, bid: 93.80, ask: 94.50 }
  },
  {
    strike: 25150, // ATM (Spot is ~25142)
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
  },
  {
    strike: 25350,
    ce: { ltp: 21.40, change: 11.2, oi: 3720000, oiChange: 680000, iv: 14.1, delta: 0.16, gamma: 0.0011, theta: -12.5, vega: 11.6, bid: 21.15, ask: 21.65 },
    pe: { ltp: 241.80, change: -72.0, oi: 620000, oiChange: -140000, iv: 15.3, delta: -0.84, gamma: 0.0011, theta: -20.1, vega: 11.2, bid: 241.20, ask: 242.40 }
  },
  {
    strike: 25400,
    ce: { ltp: 13.90, change: 7.4, oi: 5210000, oiChange: 840000, iv: 14.6, delta: 0.11, gamma: 0.0009, theta: -9.8, vega: 9.4, bid: 13.70, ask: 14.10 },
    pe: { ltp: 284.50, change: -77.5, oi: 410000, oiChange: -95000, iv: 15.9, delta: -0.89, gamma: 0.0009, theta: -18.4, vega: 9.1, bid: 283.80, ask: 285.20 }
  },
  {
    strike: 25450,
    ce: { ltp: 8.80, change: 4.6, oi: 2150000, oiChange: 390000, iv: 15.2, delta: 0.08, gamma: 0.0007, theta: -7.5, vega: 7.2, bid: 8.65, ask: 8.95 },
    pe: { ltp: 328.00, change: -82.1, oi: 280000, oiChange: -60000, iv: 16.5, delta: -0.92, gamma: 0.0007, theta: -16.2, vega: 7.0, bid: 327.10, ask: 328.90 }
  },
  {
    strike: 25500,
    ce: { ltp: 5.60, change: 2.8, oi: 7890000, oiChange: 1450000, iv: 15.8, delta: 0.05, gamma: 0.0005, theta: -5.6, vega: 5.4, bid: 5.45, ask: 5.75 },
    pe: { ltp: 374.20, change: -86.4, oi: 190000, oiChange: -42000, iv: 17.1, delta: -0.95, gamma: 0.0005, theta: -13.8, vega: 5.2, bid: 373.20, ask: 375.10 }
  },
  {
    strike: 25550,
    ce: { ltp: 3.45, change: 1.6, oi: 1840000, oiChange: 210000, iv: 16.4, delta: 0.03, gamma: 0.0004, theta: -3.9, vega: 3.8, bid: 3.35, ask: 3.55 },
    pe: { ltp: 421.50, change: -90.2, oi: 110000, oiChange: -25000, iv: 17.8, delta: -0.97, gamma: 0.0004, theta: -11.5, vega: 3.6, bid: 420.20, ask: 422.80 }
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
    trailingTriggerPrice: 89.50,
    trailDistance: 5.0,
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
    trailingTriggerPrice: 24.40,
    trailDistance: 2.0,
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
    trailingTriggerPrice: null,
    trailDistance: 0,
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
  noSizeUpAfterWins: true,      // Disallows scaling up position size after a winning streak
  panicSquareOffConfirmed: false
};

// Institutional Defined-Risk Templates (With Backtest Evidence & Source)
export const STRATEGY_TEMPLATES = [
  {
    id: 'strat-1',
    name: 'Bull Call Spread (Defined Risk)',
    category: 'Directional / Moderately Bullish',
    backtestSummary: 'Backtested on 384 trades (NSE 2023–2025) · Quantitative Engine',
    winRate: '68%',
    riskReward: '1 : 2.1',
    breakeven: 'Strike + Net Debit paid (₹25,195)',
    description: 'Buy ATM Call + Sell OTM Call. Caps max loss strictly to the net debit paid while financing the trade with short call theta.',
    legs: [
      { action: 'BUY', strikeOffset: 'ATM (25150)', type: 'CE', delta: '~0.50' },
      { action: 'SELL', strikeOffset: 'OTM 25250 (+100)', type: 'CE', delta: '~0.30' }
    ],
    maxLoss: 'Defined (Net Premium ₹45.60)',
    maxProfit: 'Defined (Wing diff - Debit ₹54.40)',
    sentiment: 'Bullish'
  },
  {
    id: 'strat-2',
    name: 'Bear Put Spread (Defined Risk)',
    category: 'Directional / Moderately Bearish',
    backtestSummary: 'Backtested on 312 trades (NSE 2023–2025) · Quantitative Engine',
    winRate: '66%',
    riskReward: '1 : 2.2',
    breakeven: 'Strike - Net Debit paid (₹25,112)',
    description: 'Buy ATM Put + Sell OTM Put. Complete protection against sudden market reversals with strictly capped maximum loss.',
    legs: [
      { action: 'BUY', strikeOffset: 'ATM (25150)', type: 'PE', delta: '~ -0.50' },
      { action: 'SELL', strikeOffset: 'OTM 25050 (-100)', type: 'PE', delta: '~ -0.30' }
    ],
    maxLoss: 'Defined (Net Premium ₹37.70)',
    maxProfit: 'Defined (Wing diff - Debit ₹62.30)',
    sentiment: 'Bearish'
  },
  {
    id: 'strat-3',
    name: 'Iron Condor (Delta Neutral / Theta Harvest)',
    category: 'Non-Directional Range-Bound',
    backtestSummary: 'Backtested on 428 trades (NSE 2023–2025) · Quantitative Engine',
    winRate: '76%',
    riskReward: '1 : 1.4',
    breakeven: 'Lower Wing (24,965) & Upper Wing (25,335)',
    description: 'Sell OTM Call & Put spread. Collects time decay when stock or index trades inside a defined range with hard stop wings.',
    legs: [
      { action: 'BUY', strikeOffset: 'Far OTM 24900', type: 'PE', delta: '-0.15' },
      { action: 'SELL', strikeOffset: 'OTM 25000', type: 'PE', delta: '-0.30' },
      { action: 'SELL', strikeOffset: 'OTM 25300', type: 'CE', delta: '0.30' },
      { action: 'BUY', strikeOffset: 'Far OTM 25400', type: 'CE', delta: '0.15' }
    ],
    maxLoss: 'Defined (Wing Width - Credit Received)',
    maxProfit: 'Net Credit Received (₹35.00)',
    sentiment: 'Neutral'
  },
  {
    id: 'strat-4',
    name: 'High-Volume Breakout (Momentum Option Buying)',
    category: 'Trend Following',
    backtestSummary: 'Backtested on 516 trades (NSE 2023–2025) · Quantitative Engine',
    winRate: '54%',
    riskReward: '1 : 3.5',
    breakeven: 'Entry + 15% quick expansion',
    description: 'Only triggers when stock pierces 15-min Opening Range with >2x volume & heavy Call/Put OI unwinding. Strict trailing stop loss.',
    legs: [
      { action: 'BUY', strikeOffset: 'Slightly ITM / ATM', type: 'CE/PE', delta: '0.55-0.65' }
    ],
    maxLoss: 'Hard Stop-Loss (15% of premium)',
    maxProfit: 'Open Trailing',
    sentiment: 'Momentum'
  }
];

// Market Scanner Signals (Live OI & Technical Scan) - 10 Curated F&O Setups
export const SCANNER_SIGNALS = [
  {
    symbol: 'TATAMOTORS',
    price: 938.50,
    signal: 'Long Buildup',
    category: 'Bullish Buildup',
    confidence: 'HIGH (88%)',
    confidenceScore: 88,
    oiChangePct: '+14.2%',
    volumeMultiplier: '2.8x',
    pcr: 1.45,
    suggestedAction: 'Bull Call Spread 940/960'
  },
  {
    symbol: 'RELIANCE',
    price: 2984.60,
    signal: 'ORB Breakout (Bullish)',
    category: 'Breakout',
    confidence: 'HIGH (82%)',
    confidenceScore: 82,
    oiChangePct: '+8.6%',
    volumeMultiplier: '2.1x',
    pcr: 1.24,
    suggestedAction: 'ATM 2980 CE Momentum'
  },
  {
    symbol: 'HDFCBANK',
    price: 1672.25,
    signal: 'Short Buildup',
    category: 'Short Buildup',
    confidence: 'MEDIUM (74%)',
    confidenceScore: 74,
    oiChangePct: '+11.5%',
    volumeMultiplier: '1.4x',
    pcr: 0.92,
    suggestedAction: 'Bear Put Spread 1680/1660'
  },
  {
    symbol: 'INFY',
    price: 1885.10,
    signal: 'Range Consolidation',
    category: 'Range-Bound',
    confidence: 'HIGH (91%)',
    confidenceScore: 91,
    oiChangePct: '-2.1%',
    volumeMultiplier: '0.9x',
    pcr: 1.05,
    suggestedAction: 'Iron Condor 1840/1860/1900/1920'
  },
  {
    symbol: 'ICICIBANK',
    price: 1248.80,
    signal: 'Long Buildup',
    category: 'Bullish Buildup',
    confidence: 'HIGH (86%)',
    confidenceScore: 86,
    oiChangePct: '+9.4%',
    volumeMultiplier: '2.4x',
    pcr: 1.38,
    suggestedAction: 'Bull Call Spread 1250/1270'
  },
  {
    symbol: 'SBIN',
    price: 842.15,
    signal: 'Breakout Above 20 EMA',
    category: 'Breakout',
    confidence: 'HIGH (84%)',
    confidenceScore: 84,
    oiChangePct: '+12.8%',
    volumeMultiplier: '3.1x',
    pcr: 1.32,
    suggestedAction: 'ATM 840 CE Momentum'
  },
  {
    symbol: 'TCS',
    price: 4120.50,
    signal: 'Short Buildup',
    category: 'Short Buildup',
    confidence: 'HIGH (81%)',
    confidenceScore: 81,
    oiChangePct: '+7.9%',
    volumeMultiplier: '1.8x',
    pcr: 0.84,
    suggestedAction: 'Bear Put Spread 4120/4080'
  },
  {
    symbol: 'MARUTI',
    price: 12450.00,
    signal: 'Call OI Unwinding',
    category: 'Bullish Buildup',
    confidence: 'MEDIUM (76%)',
    confidenceScore: 76,
    oiChangePct: '-15.4%',
    volumeMultiplier: '1.9x',
    pcr: 1.48,
    suggestedAction: 'Bull Call Spread 12500/12700'
  },
  {
    symbol: 'BAJFINANCE',
    price: 7240.00,
    signal: 'Short Covering Rally',
    category: 'Breakout',
    confidence: 'HIGH (85%)',
    confidenceScore: 85,
    oiChangePct: '-8.2%',
    volumeMultiplier: '2.2x',
    pcr: 1.28,
    suggestedAction: 'ATM 7250 CE Momentum'
  },
  {
    symbol: 'LT',
    price: 3625.40,
    signal: 'Range Compression',
    category: 'Range-Bound',
    confidence: 'HIGH (89%)',
    confidenceScore: 89,
    oiChangePct: '+1.4%',
    volumeMultiplier: '0.8x',
    pcr: 1.02,
    suggestedAction: 'Iron Condor 3560/3600/3660/3700'
  }
];

// Trading Journal Entries with Emotions & Rationales
export const INITIAL_JOURNAL_TRADES = [
  {
    id: 'TRD-2026-081',
    date: '2026-10-14',
    time: '11:45 AM',
    symbol: 'TATAMOTORS 940 CE',
    strategy: 'Bull Call Spread',
    side: 'BUY',
    qty: 1425,
    entryPrice: 22.40,
    exitPrice: 27.20,
    pnl: 6840.00,
    rMultiple: '+2.1R',
    reason: 'Pierced 15m opening range high with 2.8x volume and aggressive Call OI addition at 940 strike.',
    emotion: 'Calm',
    screenshotUrl: '#',
    status: 'CLOSED'
  },
  {
    id: 'TRD-2026-080',
    date: '2026-10-14',
    time: '10:10 AM',
    symbol: 'NIFTY 25150 CE',
    strategy: 'Momentum Breakout',
    side: 'BUY',
    qty: 50,
    entryPrice: 84.50,
    exitPrice: 93.80,
    pnl: 465.00,
    rMultiple: '+0.8R',
    reason: 'Tested VWAP support after gap up; auto trailing SL locked initial gains.',
    emotion: 'Calm',
    screenshotUrl: '#',
    status: 'CLOSED'
  },
  {
    id: 'TRD-2026-079',
    date: '2026-10-13',
    time: '14:20 PM',
    symbol: 'BANKNIFTY 52000 PE',
    strategy: 'Bear Put Spread',
    side: 'BUY',
    qty: 30,
    entryPrice: 110.00,
    exitPrice: 88.00,
    pnl: -660.00,
    rMultiple: '-1.0R',
    reason: 'Anticipated reversal at resistance, but index held VWAP. Hard SL triggered and respected.',
    emotion: 'Calm',
    screenshotUrl: '#',
    status: 'CLOSED'
  },
  {
    id: 'TRD-2026-078',
    date: '2026-10-13',
    time: '11:05 AM',
    symbol: 'RELIANCE 2980 CE',
    strategy: 'Momentum Buy',
    side: 'BUY',
    qty: 250,
    entryPrice: 42.00,
    exitPrice: 35.00,
    pnl: -1750.00,
    rMultiple: '-0.9R',
    reason: 'Entered late after 4 consecutive green candles. Identified as FOMO impulse.',
    emotion: 'FOMO',
    screenshotUrl: '#',
    status: 'CLOSED'
  },
  {
    id: 'TRD-2026-077',
    date: '2026-10-10',
    time: '13:15 PM',
    symbol: 'INFY 1860/1900 Strangle',
    strategy: 'Iron Condor',
    side: 'SELL',
    qty: 400,
    entryPrice: 18.50,
    exitPrice: 8.20,
    pnl: 4120.00,
    rMultiple: '+1.6R',
    reason: 'Earnings post-announcement IV crush; stock consolidated tightly in 1870-1890 corridor.',
    emotion: 'Calm',
    screenshotUrl: '#',
    status: 'CLOSED'
  },
  {
    id: 'TRD-2026-076',
    date: '2026-10-09',
    time: '14:50 PM',
    symbol: 'HDFCBANK 1680 PE',
    strategy: 'Short Buildup',
    side: 'BUY',
    qty: 550,
    entryPrice: 16.00,
    exitPrice: 22.50,
    pnl: 3575.00,
    rMultiple: '+1.9R',
    reason: 'Sustained rejection at 1685 call wall; PCR dipped from 0.98 to 0.74.',
    emotion: 'Calm',
    screenshotUrl: '#',
    status: 'CLOSED'
  }
];

export const WEEKLY_ANALYTICS = {
  winRate: 68.4,
  totalTrades: 38,
  avgR: 1.82,
  maxDrawdown: 3200,
  profitFactor: 2.45,
  disciplineScore: 94,
  streakDays: 4,
  paperTradesCompleted: 14,
  paperTradesRequired: 20,
  killSwitchBreaches: 0,
  equityCurve: [
    { day: 'Mon', equity: 492000 },
    { day: 'Tue', equity: 495400 },
    { day: 'Wed', equity: 494800 },
    { day: 'Thu', equity: 498200 },
    { day: 'Fri', equity: 504200 },
    { day: 'Mon', equity: 502600 },
    { day: 'Tue', equity: 507100 },
  ]
};
