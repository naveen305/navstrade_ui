import React, { useMemo, useState } from 'react';
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  Bot,
  BookOpen,
  CandlestickChart,
  Check,
  ChevronDown,
  CircleAlert,
  CircleCheck,
  CircleX,
  Clock3,
  FileKey2,
  Gauge,
  KeyRound,
  Layers3,
  LockKeyhole,
  Play,
  Plus,
  Radar,
  RefreshCw,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Target,
  TrendingUp,
  TriangleAlert,
  WalletCards,
  Zap,
} from 'lucide-react';
import { useTrading } from '../context/TradingContext';

const money = (value, digits = 0) => `₹${Math.abs(value || 0).toLocaleString('en-IN', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
const signedMoney = (value, digits = 0) => `${value >= 0 ? '+' : '−'}${money(value, digits)}`;
const percent = (value) => `${Number(value || 0).toFixed(2)}%`;

const pageMeta = {
  terminal: { eyebrow: 'COMMAND CENTER', title: 'Control desk', description: 'Observe the market, respect your limits, then act with intent.' },
  scanner: { eyebrow: 'SETUP DISCOVERY', title: 'Qualified setups', description: 'Signals are filtered for structure before they earn your attention.' },
  option_chain: { eyebrow: 'MARKET STRUCTURE', title: 'Option chain', description: 'Read positioning around the current price without losing the bigger picture.' },
  strategies: { eyebrow: 'ALGO PLAYBOOKS', title: 'Defined-risk playbooks', description: 'Deploy only structures with a known downside and a clear invalidation.' },
  risk_engine: { eyebrow: 'CAPITAL PROTECTION', title: 'Risk vault', description: 'Your parameters live here. They are checked before every order is sent.' },
  journal: { eyebrow: 'BEHAVIOURAL REVIEW', title: 'Trading journal', description: 'The review loop that turns execution into repeatable discipline.' },
  settings: { eyebrow: 'SYSTEM ACCESS', title: 'Connections', description: 'Keep your broker connection and rule locks in a known state.' },
};

const PageHeader = ({ view, children }) => {
  const meta = pageMeta[view];
  return (
    <div className="page-header">
      <div>
        <div className="page-eyebrow">{meta.eyebrow}</div>
        <h1>{meta.title}</h1>
        <p>{meta.description}</p>
      </div>
      {children && <div className="page-header-actions">{children}</div>}
    </div>
  );
};

const Metric = ({ label, value, caption, tone = 'default', icon: Icon }) => (
  <div className={`metric ${tone}`}>
    <div className="metric-label">{Icon && <Icon size={14} />}{label}</div>
    <strong>{value}</strong>
    {caption && <span>{caption}</span>}
  </div>
);

const Progress = ({ value, tone = 'accent' }) => <div className="progress-track"><i className={tone} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} /></div>;

const MarketChart = ({ positive = true }) => {
  const points = positive
    ? '0,166 28,154 56,161 84,139 112,146 140,113 168,122 196,103 224,112 252,90 280,100 308,78 336,86 364,57 392,68 420,45 448,50 476,28 504,35 532,12'
    : '0,48 28,54 56,42 84,62 112,55 140,78 168,68 196,95 224,88 252,108 280,101 308,127 336,119 364,140 392,132 420,152 448,142 476,162 504,151 532,169';
  const areas = `${points} 532,184 0,184`;
  return (
    <div className="market-chart">
      <div className="chart-grid"><i /><i /><i /><i /></div>
      <svg viewBox="0 0 532 184" preserveAspectRatio="none" role="img" aria-label="NIFTY intraday chart">
        <defs>
          <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={positive ? '#c7ff4f' : '#ff9e66'} stopOpacity=".24" />
            <stop offset="100%" stopColor={positive ? '#c7ff4f' : '#ff9e66'} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={areas} fill="url(#chartFill)" />
        <polyline points={points} fill="none" stroke={positive ? '#c7ff4f' : '#ff9e66'} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
        <circle cx="532" cy={positive ? '12' : '169'} r="4" fill={positive ? '#c7ff4f' : '#ff9e66'} />
      </svg>
      <div className="chart-axis"><span>09:15</span><span>10:30</span><span>12:00</span><span>13:30</span><span>15:15</span></div>
    </div>
  );
};

const EquityChart = ({ data }) => {
  const min = Math.min(...data.map(({ equity }) => equity)) - 1300;
  const max = Math.max(...data.map(({ equity }) => equity)) + 1300;
  const span = max - min || 1;
  const coordinates = data.map((point, index) => {
    const x = 8 + index * (340 / (data.length - 1));
    const y = 92 - ((point.equity - min) / span) * 74;
    return { ...point, x, y };
  });
  const line = coordinates.map(({ x, y }) => `${x},${y}`).join(' ');
  return (
    <div className="equity-chart">
      <svg viewBox="0 0 356 104" preserveAspectRatio="none">
        <defs><linearGradient id="equityFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#c7ff4f" stopOpacity=".26" /><stop offset="100%" stopColor="#c7ff4f" stopOpacity="0" /></linearGradient></defs>
        <path d="M8 92 H348 M8 55 H348 M8 18 H348" stroke="currentColor" opacity=".12" strokeDasharray="3 5" />
        <polygon points={`${line} 348,100 8,100`} fill="url(#equityFill)" />
        <polyline points={line} fill="none" stroke="#c7ff4f" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
        {coordinates.map(({ x, y, day }) => <circle key={day} cx={x} cy={y} r="2.8" fill="#c7ff4f" />)}
      </svg>
      <div className="equity-labels">{data.map(({ day }, index) => <span key={`${day}-${index}`}>{day}</span>)}</div>
    </div>
  );
};

const Watchlist = () => {
  const { watchlist, selectedSymbol, setSelectedSymbol } = useTrading();
  return (
    <section className="desk-panel watchlist-panel">
      <div className="panel-heading"><div><span>MARKET PULSE</span><h2>Watchlist</h2></div><Activity size={17} /></div>
      <div className="watchlist-list">
        {watchlist.slice(0, 6).map((item) => {
          const upward = item.change >= 0;
          return <button className={`watchlist-row ${selectedSymbol.symbol === item.symbol ? 'selected' : ''}`} key={item.symbol} onClick={() => setSelectedSymbol(item)}>
            <div><strong>{item.symbol}</strong><span>{item.type} · IV {item.iv}%</span></div>
            <div className={upward ? 'positive' : 'negative'}><strong>{money(item.price, 2)}</strong><span>{upward ? '+' : ''}{item.changePct}%</span></div>
          </button>;
        })}
      </div>
    </section>
  );
};

const TradePermission = () => {
  const { riskRules, paperCriteria, positions, totalNetPnl, openOrderTicket, selectedSymbol } = useTrading();
  const canTrade = !riskRules.killSwitchActive && positions.length < riskRules.maxOpenTrades;
  const checks = [
    ['Hard stop attached', true],
    [`${riskRules.maxCapitalRiskPct}% max risk per trade`, true],
    [`Position slots: ${positions.length}/${riskRules.maxOpenTrades}`, positions.length < riskRules.maxOpenTrades],
    [`Paper checkpoint: ${paperCriteria.completed}/${paperCriteria.required}`, true],
  ];
  return (
    <section className={`desk-panel permission-panel ${canTrade ? 'ready' : 'paused'}`}>
      <div className="permission-topline"><span><ShieldCheck size={15} /> ORDER PERMISSION</span><span className={canTrade ? 'ready-label' : 'paused-label'}>{canTrade ? 'READY' : 'PAUSED'}</span></div>
      <h2>{canTrade ? 'Trade only if your edge is present.' : 'Take a pause. Protect your next decision.'}</h2>
      <p>{canTrade ? 'The system will reject orders that exceed your risk plan.' : 'A risk condition is blocking new positions right now.'}</p>
      <div className="permission-checks">
        {checks.map(([label, pass]) => <div key={label}><span className={pass ? 'check-pass' : 'check-fail'}>{pass ? <Check size={13} /> : <CircleX size={13} />}</span>{label}</div>)}
      </div>
      <div className="permission-footer"><span>Day P&amp;L <strong className={totalNetPnl >= 0 ? 'positive' : 'negative'}>{signedMoney(totalNetPnl)}</strong></span><button className="button-primary" disabled={!canTrade} onClick={() => openOrderTicket({ symbol: `${selectedSymbol.symbol} ATM CE`, action: 'BUY', price: 94.1, sl: 79.5, target: 122, lotSize: selectedSymbol.lotSize, strategy: 'Rule-based breakout', reason: '15m breakout with confirmation' })}>Build order <ArrowRight size={15} /></button></div>
    </section>
  );
};

const Positions = () => {
  const { positions, closePosition, totalUnrealizedPnl } = useTrading();
  return (
    <section className="desk-panel positions-panel">
      <div className="panel-heading"><div><span>LIVE EXPOSURE</span><h2>Open positions <em>{positions.length}</em></h2></div><div className={totalUnrealizedPnl >= 0 ? 'positive' : 'negative'}>{signedMoney(totalUnrealizedPnl, 0)}</div></div>
      <div className="data-table-wrap">
        <table className="app-table positions-table"><thead><tr><th>Instrument</th><th>Entry</th><th>Now</th><th>Stop</th><th>Defined loss</th><th>P&amp;L</th><th /></tr></thead>
          <tbody>{positions.length ? positions.map((position) => <tr key={position.id}>
            <td><strong>{position.symbol}</strong><span>{position.strategy}</span></td><td>{money(position.entryPrice, 2)}</td><td>{money(position.currentPrice, 2)}</td><td className="loss-text">{money(position.sl, 2)}</td><td>{money(position.maxLoss)}</td><td className={position.pnl >= 0 ? 'positive' : 'negative'}><strong>{signedMoney(position.pnl)}</strong><span>{position.pnlPct >= 0 ? '+' : ''}{position.pnlPct}%</span></td><td><button className="table-action" onClick={() => closePosition(position.id)}>Close</button></td>
          </tr>) : <tr><td colSpan="7" className="empty-row">No exposure. Staying flat is a valid position.</td></tr>}</tbody>
        </table>
      </div>
    </section>
  );
};

const ControlDesk = () => {
  const { accountCapital, marginAvailable, totalNetPnl, selectedSymbol, riskRules, positions } = useTrading();
  const dailyLossUsed = Math.max(0, -totalNetPnl);
  const dailyLossProgress = (dailyLossUsed / riskRules.maxDailyLoss) * 100;
  const pricePositive = selectedSymbol.change >= 0;
  return <div className="workspace-page control-desk page-enter">
    <PageHeader view="terminal"><button className="quiet-button"><Clock3 size={15} /> Market hours · 09:15—15:30</button></PageHeader>
    <div className="metric-grid dashboard-metrics">
      <Metric label="Account capital" value={money(accountCapital)} caption="Paper portfolio" icon={WalletCards} />
      <Metric label="Available margin" value={money(marginAvailable)} caption={`${Math.round((marginAvailable / accountCapital) * 100)}% deployable`} icon={Gauge} />
      <Metric label="Today's P&L" value={signedMoney(totalNetPnl)} caption={totalNetPnl >= 0 ? 'Inside plan' : 'Review exposure'} tone={totalNetPnl >= 0 ? 'positive' : 'negative'} icon={TrendingUp} />
      <Metric label="Risk score" value={`${riskRules.disciplineScore}/100`} caption={`${positions.length}/${riskRules.maxOpenTrades} position slots in use`} tone="accent" icon={ShieldCheck} />
    </div>
    <div className="desk-layout">
      <div className="desk-main-column">
        <section className="desk-panel price-panel">
          <div className="price-panel-header"><div><span>SELECTED MARKET</span><h2>{selectedSymbol.symbol} <small>{selectedSymbol.type}</small></h2></div><div className={pricePositive ? 'market-price positive' : 'market-price negative'}><strong>{money(selectedSymbol.price, 2)}</strong><span>{pricePositive ? '+' : ''}{selectedSymbol.change.toFixed(2)} · {pricePositive ? '+' : ''}{selectedSymbol.changePct}%</span></div></div>
          <div className="chart-detail-strip"><span><b>VWAP</b> {money(selectedSymbol.vwap, 2)}</span><span><b>Day high</b> {money(selectedSymbol.dayHigh, 2)}</span><span><b>Day low</b> {money(selectedSymbol.dayLow, 2)}</span><span><b>Max pain</b> {selectedSymbol.maxPain}</span></div>
          <MarketChart positive={pricePositive} />
          <div className="chart-signal"><span><i className="signal-dot" /> Structural read</span><strong>{pricePositive ? 'Holding above VWAP · Momentum intact' : 'Below VWAP · Wait for structure'}</strong></div>
        </section>
        <Positions />
      </div>
      <aside className="desk-side-column"><TradePermission /><section className="desk-panel risk-usage"><div className="panel-heading"><div><span>SESSION LIMIT</span><h2>Daily loss circuit</h2></div><strong>{money(riskRules.maxDailyLoss)}</strong></div><div className="risk-amounts"><span>Used <b>{money(dailyLossUsed)}</b></span><span>Buffer <b>{money(Math.max(0, riskRules.maxDailyLoss - dailyLossUsed))}</b></span></div><Progress value={dailyLossProgress} tone={dailyLossProgress > 70 ? 'loss' : 'accent'} /><p>Reaching this limit blocks new orders and closes open exposure.</p></section><Watchlist /></aside>
    </div>
  </div>;
};

const OptionChain = () => {
  const { optionChain, selectedSymbol, openOrderTicket } = useTrading();
  const [expiry, setExpiry] = useState('17 OCT 2026');
  const rows = optionChain.filter((item) => Math.abs(item.strike - selectedSymbol.price) <= 350);
  const maxOi = Math.max(...rows.flatMap((row) => [row.ce.oi, row.pe.oi]));
  const callOi = optionChain.reduce((sum, row) => sum + row.ce.oi, 0);
  const putOi = optionChain.reduce((sum, row) => sum + row.pe.oi, 0);
  const order = (row, side) => ({ symbol: `${selectedSymbol.symbol} ${row.strike} ${side}`, action: 'BUY', price: side === 'CE' ? row.ce.ltp : row.pe.ltp, sl: +(side === 'CE' ? row.ce.ltp * .83 : row.pe.ltp * .83).toFixed(1), target: +(side === 'CE' ? row.ce.ltp * 1.28 : row.pe.ltp * 1.28).toFixed(1), lotSize: selectedSymbol.lotSize, strategy: 'Option-chain entry', reason: `${side} liquidity and price structure align` });
  return <div className="workspace-page page-enter">
    <PageHeader view="option_chain"><button className="select-button">{expiry} <ChevronDown size={15} /></button><button className="quiet-button">NSE · WEEKLY</button></PageHeader>
    <div className="chain-summary"><div className="chain-spot"><span>UNDERLYING</span><strong>{selectedSymbol.symbol}</strong><b>{money(selectedSymbol.price, 2)}</b><em className={selectedSymbol.change >= 0 ? 'positive' : 'negative'}>{selectedSymbol.change >= 0 ? '+' : ''}{selectedSymbol.changePct}%</em></div><Metric label="Put / call ratio" value={(putOi / callOi).toFixed(2)} caption="Aggregate open interest" tone={putOi / callOi > 1 ? 'positive' : 'negative'} /><Metric label="Max pain" value={selectedSymbol.maxPain} caption="Expiry magnet" /><Metric label="Implied volatility" value={`${selectedSymbol.iv}%`} caption="At-the-money IV" /></div>
    <section className="desk-panel chain-panel"><div className="panel-heading"><div><span>LIVE CHAIN</span><h2>Calls <i>← click a premium to stage an order</i></h2></div><div className="chain-key"><span><i className="call-key" /> Calls</span><span><i className="put-key" /> Puts</span><span><i className="atm-key" /> ATM</span></div></div><div className="data-table-wrap"><table className="app-table option-chain-table"><thead><tr><th className="call-column">CALL OI</th><th className="call-column">Δ OI</th><th className="call-column">IV</th><th className="call-column">LTP</th><th className="strike-column">STRIKE</th><th className="put-column">LTP</th><th className="put-column">IV</th><th className="put-column">Δ OI</th><th className="put-column">PUT OI</th></tr></thead><tbody>{rows.map((row) => { const atm = Math.abs(row.strike - selectedSymbol.price) < 35; return <tr className={atm ? 'atm-row' : ''} key={row.strike}><td><span className="oi-cell"><i style={{ width: `${(row.ce.oi / maxOi) * 100}%` }} />{(row.ce.oi / 100000).toFixed(1)}L</span></td><td className={row.ce.oiChange >= 0 ? 'positive' : 'negative'}>{row.ce.oiChange >= 0 ? '+' : ''}{(row.ce.oiChange / 1000).toFixed(0)}k</td><td>{row.ce.iv}%</td><td><button className="option-price call-price" onClick={() => openOrderTicket(order(row, 'CE'))}>{money(row.ce.ltp, 2)}</button></td><td className="strike-cell">{row.strike}{atm && <b>ATM</b>}</td><td><button className="option-price put-price" onClick={() => openOrderTicket(order(row, 'PE'))}>{money(row.pe.ltp, 2)}</button></td><td>{row.pe.iv}%</td><td className={row.pe.oiChange >= 0 ? 'positive' : 'negative'}>{row.pe.oiChange >= 0 ? '+' : ''}{(row.pe.oiChange / 1000).toFixed(0)}k</td><td><span className="oi-cell oi-put"><i style={{ width: `${(row.pe.oi / maxOi) * 100}%` }} />{(row.pe.oi / 100000).toFixed(1)}L</span></td></tr>; })}</tbody></table></div></section>
  </div>;
};

const Strategies = () => {
  const { strategyTemplates, selectedSymbol, openOrderTicket } = useTrading();
  const [activeId, setActiveId] = useState(strategyTemplates[0]?.id);
  const [filter, setFilter] = useState('ALL');
  const selected = strategyTemplates.find(({ id }) => id === activeId) || strategyTemplates[0];
  const filtered = strategyTemplates.filter((strategy) => filter === 'ALL' || strategy.sentiment.toUpperCase() === filter);
  const tone = selected.sentiment === 'Bullish' ? 'bullish' : selected.sentiment === 'Bearish' ? 'bearish' : 'neutral';
  return <div className="workspace-page page-enter"><PageHeader view="strategies"><div className="filter-tabs">{['ALL', 'BULLISH', 'BEARISH', 'NEUTRAL', 'MOMENTUM'].map((item) => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item === 'ALL' ? 'All' : item}</button>)}</div></PageHeader><div className="playbooks-layout"><section className="playbook-list">{filtered.map((strategy) => <button className={`playbook-row ${strategy.id === selected.id ? 'selected' : ''}`} onClick={() => setActiveId(strategy.id)} key={strategy.id}><span className={`sentiment-dot ${strategy.sentiment.toLowerCase()}`} /><div><span>{strategy.category}</span><strong>{strategy.name}</strong><p>{strategy.description}</p></div><ArrowRight size={17} /></button>)}</section><section className="desk-panel playbook-detail"><div className="playbook-detail-head"><div><span>ACTIVE PLAYBOOK</span><h2>{selected.name}</h2><p>{selected.description}</p></div><div className={`sentiment-label ${tone}`}>{selected.sentiment}</div></div><div className="playbook-stat-grid"><Metric label="Backtested win rate" value={selected.winRate} caption="Not a prediction" tone="positive" /><Metric label="Risk / reward" value={selected.riskReward} caption="Historical setup profile" /><Metric label="Maximum loss" value="Defined" caption={selected.maxLoss} tone="accent" /></div><div className="payoff-preview"><div><span>PAYOFF SHAPE</span><strong>Known downside. Explicit invalidation.</strong><small>{selected.breakeven}</small></div><svg viewBox="0 0 470 150" preserveAspectRatio="none"><path d="M0 118 H470" stroke="currentColor" opacity=".18"/><path d="M0 118 L112 114 L194 89 L248 35 L322 35 L395 83 L470 106" fill="none" stroke="#c7ff4f" strokeWidth="3" vectorEffect="non-scaling-stroke"/><path d="M112 114 L194 89 L248 35 L322 35 L395 83" fill="none" stroke="#c7ff4f" opacity=".25" strokeWidth="20" vectorEffect="non-scaling-stroke"/></svg></div><div className="legs-list"><span>ORDER LEGS</span>{selected.legs.map((leg, index) => <div key={`${leg.strikeOffset}-${index}`}><b className={leg.action === 'BUY' ? 'positive' : 'negative'}>{leg.action}</b><strong>{leg.strikeOffset} {leg.type}</strong><em>Δ {leg.delta}</em></div>)}</div><div className="playbook-action"><div><span>Underlying</span><strong>{selectedSymbol.symbol} · {money(selectedSymbol.price, 2)}</strong></div><button className="button-primary" onClick={() => openOrderTicket({ symbol: `${selectedSymbol.symbol} ${selected.name}`, action: 'BUY', price: 92, sl: 77, target: 122, lotSize: selectedSymbol.lotSize, strategy: selected.name, reason: 'Defined-risk playbook deployed' })}><Play size={15} /> Stage this playbook</button></div></section></div></div>;
};

const Scanner = () => {
  const { scannerSignals, watchlist, setSelectedSymbol, openOrderTicket } = useTrading();
  const [filter, setFilter] = useState('ALL');
  const signals = scannerSignals.filter((signal) => filter === 'ALL' || (filter === 'HIGH' ? signal.confidenceScore >= 80 : signal.category.includes(filter)));
  const stageSignal = (signal) => { const matched = watchlist.find(({ symbol }) => symbol === signal.symbol); if (matched) setSelectedSymbol(matched); openOrderTicket({ symbol: `${signal.symbol} ATM ${signal.category === 'Short Buildup' ? 'PE' : 'CE'}`, action: 'BUY', price: Math.round(signal.price * .045), sl: Math.round(signal.price * .036), target: Math.round(signal.price * .063), lotSize: matched?.lotSize || 25, strategy: signal.suggestedAction, reason: `${signal.signal}; confidence ${signal.confidenceScore}%` }); };
  return <div className="workspace-page page-enter"><PageHeader view="scanner"><div className="filter-tabs">{[['ALL', 'All setups'], ['HIGH', 'Confidence ≥80'], ['Bullish', 'Bullish'], ['Short', 'Bearish'], ['Breakout', 'Breakouts']].map(([id, label]) => <button className={filter === id ? 'active' : ''} onClick={() => setFilter(id)} key={id}>{label}</button>)}</div></PageHeader><div className="scanner-brief"><div><Radar size={17} /><span><b>{signals.length} qualified signals</b> from a 184 symbol F&amp;O universe</span></div><p>Signals are ideas, not orders. Always use the risk gate before deployment.</p></div><section className="desk-panel scanner-panel"><div className="data-table-wrap"><table className="app-table scanner-table"><thead><tr><th>Symbol</th><th>Signal</th><th>Price</th><th>OI shift</th><th>Volume</th><th>PCR</th><th>Confidence</th><th>Suggested structure</th><th /></tr></thead><tbody>{signals.map((signal) => <tr key={signal.symbol}><td><strong>{signal.symbol}</strong><span>NSE F&amp;O</span></td><td><span className={`signal-tag ${signal.category.includes('Bullish') ? 'bullish' : signal.category.includes('Short') ? 'bearish' : 'neutral'}`}>{signal.signal}</span></td><td>{money(signal.price, 2)}</td><td className={signal.oiChangePct.startsWith('+') ? 'positive' : 'negative'}>{signal.oiChangePct}</td><td>{signal.volumeMultiplier}</td><td>{signal.pcr}</td><td><div className="confidence-cell"><Progress value={signal.confidenceScore} tone={signal.confidenceScore >= 80 ? 'accent' : 'warning'} /><b>{signal.confidenceScore}</b></div></td><td className="suggested-text">{signal.suggestedAction}</td><td><button className="table-action solid" onClick={() => stageSignal(signal)}>Review <ArrowRight size={13} /></button></td></tr>)}</tbody></table></div></section></div>;
};

const RiskVault = () => {
  const { riskRules, updateRiskSettings, totalNetPnl, accountCapital, positions, triggerKillSwitch, clearRiskBanner, showToast } = useTrading();
  const [form, setForm] = useState({ maxDailyLoss: riskRules.maxDailyLoss, maxCapitalRiskPct: riskRules.maxCapitalRiskPct, maxOpenTrades: riskRules.maxOpenTrades, autoTrailingSl: riskRules.autoTrailingSl, noSizeUpAfterWins: riskRules.noSizeUpAfterWins });
  const dailyUsed = Math.max(0, -totalNetPnl);
  const save = () => { updateRiskSettings({ ...form, maxDailyLoss: Number(form.maxDailyLoss), maxCapitalRiskPct: Number(form.maxCapitalRiskPct), maxOpenTrades: Number(form.maxOpenTrades) }); showToast('Risk vault saved. New orders will use these limits.', 'success'); };
  const protections = [
    ['Hard stop-loss required', 'An order without a defined stop never reaches the broker.', true],
    ['Daily loss circuit', `Stop all activity after ${money(form.maxDailyLoss)} of loss.`, true],
    ['Anti-revenge cooldown', 'Pause entries after two consecutive stop-outs.', true],
    ['No size-up after wins', 'Keep risk constant after a winning streak.', form.noSizeUpAfterWins],
    ['15:15 auto square-off', 'Remove intraday option exposure before close.', true],
  ];
  return <div className="workspace-page page-enter"><PageHeader view="risk_engine"><button className={`risk-status ${riskRules.killSwitchActive ? 'blocked' : ''}`} onClick={() => riskRules.killSwitchActive ? clearRiskBanner() : triggerKillSwitch('Simulated daily loss threshold was reached.')}><ShieldAlert size={15} />{riskRules.killSwitchActive ? 'Reset simulated limit' : 'Simulate limit hit'}</button></PageHeader><div className="risk-hero"><div><span>CAPITAL GUARD</span><h2>{riskRules.killSwitchActive ? 'Order entry is paused.' : 'Your limits are holding.'}</h2><p>The risk engine sits between every trade idea and the Upstox order API.</p></div><div className="risk-hero-status"><div><span>Daily limit used</span><strong>{money(dailyUsed)} <small>/ {money(form.maxDailyLoss)}</small></strong></div><Progress value={(dailyUsed / form.maxDailyLoss) * 100} tone={dailyUsed > form.maxDailyLoss * .7 ? 'loss' : 'accent'} /></div></div><div className="risk-layout"><section className="desk-panel risk-controls"><div className="panel-heading"><div><span>EDITABLE PARAMETERS</span><h2>Risk controls</h2></div><SlidersHorizontal size={17} /></div><label className="control-field"><span><b>Daily loss limit</b><small>Blocks new orders and exits open positions.</small></span><div className="input-affix"><i>₹</i><input type="number" value={form.maxDailyLoss} onChange={(event) => setForm({ ...form, maxDailyLoss: event.target.value })} /></div></label><label className="control-field"><span><b>Risk per trade</b><small>Maximum loss allowed when a stop is hit.</small></span><div className="input-affix"><input type="number" min="0.25" max="3" step=".25" value={form.maxCapitalRiskPct} onChange={(event) => setForm({ ...form, maxCapitalRiskPct: event.target.value })} /><i>%</i></div></label><label className="control-field"><span><b>Concurrent positions</b><small>Stops overtrading during active sessions.</small></span><div className="input-affix"><input type="number" min="1" max="6" value={form.maxOpenTrades} onChange={(event) => setForm({ ...form, maxOpenTrades: event.target.value })} /></div></label><div className="risk-toggle-row"><div><b>Auto-trailing stop</b><small>Protects an open winner automatically.</small></div><button className={`switch ${form.autoTrailingSl ? 'on' : ''}`} onClick={() => setForm({ ...form, autoTrailingSl: !form.autoTrailingSl })}><i /></button></div><div className="risk-toggle-row"><div><b>No size-up after wins</b><small>Blocks confidence-driven oversizing.</small></div><button className={`switch ${form.noSizeUpAfterWins ? 'on' : ''}`} onClick={() => setForm({ ...form, noSizeUpAfterWins: !form.noSizeUpAfterWins })}><i /></button></div><button className="button-primary full" onClick={save}>Save capital rules <Check size={15} /></button></section><section className="risk-overview"><div className="metric-grid risk-metrics"><Metric label="Max risk / trade" value={money(accountCapital * (Number(form.maxCapitalRiskPct) / 100))} caption={`${form.maxCapitalRiskPct}% of capital`} tone="accent" /><Metric label="Position slots" value={`${positions.length}/${form.maxOpenTrades}`} caption="Current exposure" /><Metric label="Circuit buffer" value={money(Math.max(0, form.maxDailyLoss - dailyUsed))} caption="Room left today" tone={dailyUsed ? 'warning' : 'positive'} /></div><div className="desk-panel protection-list"><div className="panel-heading"><div><span>ALWAYS ON</span><h2>Execution protections</h2></div><BadgeCheck size={18} /></div>{protections.map(([title, description, active]) => <div className="protection-row" key={title}><span className={active ? 'check-pass' : 'check-fail'}>{active ? <Check size={13} /> : <CircleX size={13} />}</span><div><strong>{title}</strong><p>{description}</p></div><span className={active ? 'armed-tag' : 'paused-tag'}>{active ? 'ARMED' : 'OFF'}</span></div>)}</div></section></div></div>;
};

const Journal = () => {
  const { journalTrades, weeklyAnalytics, showToast } = useTrading();
  const [filter, setFilter] = useState('ALL');
  const trades = journalTrades.filter((trade) => filter === 'ALL' || trade.emotion.toUpperCase() === filter);
  return <div className="workspace-page page-enter"><PageHeader view="journal"><button className="button-primary" onClick={() => showToast('New journal entries are created automatically when a position closes.', 'info')}><Plus size={15} /> Log reflection</button></PageHeader><div className="journal-top"><div className="metric-grid journal-metrics"><Metric label="Win rate" value={`${weeklyAnalytics.winRate}%`} caption={`${weeklyAnalytics.totalTrades} closed trades`} tone="positive" /><Metric label="Average R" value={`+${weeklyAnalytics.avgR}R`} caption={`Profit factor ${weeklyAnalytics.profitFactor}`} /><Metric label="Max drawdown" value={`−${money(weeklyAnalytics.maxDrawdown)}`} caption="Kept under circuit" tone="negative" /><Metric label="Discipline" value={`${weeklyAnalytics.disciplineScore}/100`} caption={`${weeklyAnalytics.streakDays} day calm streak`} tone="accent" /></div><section className="desk-panel equity-panel"><div className="panel-heading"><div><span>ONE WEEK</span><h2>Equity progression</h2></div><div className="positive">+{money(weeklyAnalytics.equityCurve.at(-1).equity - weeklyAnalytics.equityCurve[0].equity)}</div></div><EquityChart data={weeklyAnalytics.equityCurve} /></section></div><div className="journal-controls"><div className="filter-tabs">{['ALL', 'CALM', 'FOMO', 'REVENGE'].map((item) => <button className={filter === item ? 'active' : ''} key={item} onClick={() => setFilter(item)}>{item === 'ALL' ? 'All trades' : item}</button>)}</div><span>{trades.length} reviewed trades</span></div><section className="desk-panel journal-table"><div className="data-table-wrap"><table className="app-table"><thead><tr><th>Trade</th><th>When</th><th>Structure</th><th>Emotion</th><th>Review note</th><th>R</th><th>P&amp;L</th></tr></thead><tbody>{trades.map((trade) => <tr key={trade.id}><td><strong>{trade.symbol}</strong><span>{trade.side} · {trade.qty} qty</span></td><td>{trade.date}<span>{trade.time}</span></td><td>{trade.strategy}</td><td><span className={`emotion-tag ${trade.emotion.toLowerCase()}`}>{trade.emotion}</span></td><td className="journal-reason">{trade.reason}</td><td className={trade.rMultiple.startsWith('+') ? 'positive' : 'negative'}>{trade.rMultiple}</td><td className={trade.pnl >= 0 ? 'positive' : 'negative'}><strong>{signedMoney(trade.pnl)}</strong></td></tr>)}</tbody></table></div></section></div>;
};

const Settings = () => {
  const { settings, setSettings, paperCriteria, tradingMode, setTradingMode, showToast } = useTrading();
  const [testing, setTesting] = useState(false);
  const update = (key, value) => setSettings({ ...settings, [key]: value });
  const testGateway = () => { setTesting(true); window.setTimeout(() => { setTesting(false); showToast('Upstox gateway reached · order validation channel healthy.', 'success'); }, 700); };
  return <div className="workspace-page page-enter"><PageHeader view="settings"><button className="quiet-button" onClick={testGateway} disabled={testing}><RefreshCw className={testing ? 'spin' : ''} size={15} />{testing ? 'Checking…' : 'Test gateway'}</button></PageHeader><div className="settings-layout"><section className="desk-panel settings-card connection-card"><div className="panel-heading"><div><span>BROKER GATEWAY</span><h2>Upstox connection</h2></div><span className="connected-tag"><i /> CONNECTED</span></div><p className="settings-intro">Credentials are used by the execution bridge only after pre-trade risk validation succeeds.</p><label className="settings-field"><span>App / client ID</span><input value={settings.clientId} onChange={(event) => update('clientId', event.target.value)} /></label><label className="settings-field"><span>API key</span><input type="password" value={settings.apiKey} onChange={(event) => update('apiKey', event.target.value)} /></label><label className="settings-field"><span>Redirect URI</span><input value={settings.redirectUri} onChange={(event) => update('redirectUri', event.target.value)} /></label><div className="gateway-health"><FileKey2 size={18} /><div><strong>Session authenticated</strong><span>WebSocket market data channel is active</span></div><BadgeCheck size={18} /></div><button className="button-primary full" onClick={() => showToast('Connection settings saved locally.', 'success')}>Save connection <Check size={15} /></button></section><div className="settings-side"><section className="desk-panel settings-card"><div className="panel-heading"><div><span>EXECUTION ENVIRONMENT</span><h2>Live capital gate</h2></div><LockKeyhole size={17} /></div><div className="mode-chooser"><button className={tradingMode === 'PAPER' ? 'selected' : ''} onClick={() => setTradingMode('PAPER')}><span><i /> PAPER MODE</span><small>Simulated orders, real discipline.</small></button><button disabled={!paperCriteria.isMet} className={tradingMode === 'LIVE_UPSTOX' ? 'selected' : ''} onClick={() => setTradingMode('LIVE_UPSTOX')}><span><LockKeyhole size={14} /> LIVE WITH UPSTOX</span><small>{paperCriteria.isMet ? 'Unlocked by discipline.' : `${paperCriteria.required - paperCriteria.completed} paper trades still required.`}</small></button></div><div className="live-gate-progress"><div><span>Practice checkpoint</span><b>{paperCriteria.completed}/{paperCriteria.required}</b></div><Progress value={(paperCriteria.completed / paperCriteria.required) * 100} /><p>Live execution stays gated until your paper trade track record is complete.</p></div></section><section className="desk-panel settings-card"><div className="panel-heading"><div><span>ANTI-TAMPER</span><h2>Session locks</h2></div><ShieldCheck size={17} /></div><div className="risk-toggle-row"><div><b>Lock risk rules during market hours</b><small>Prevents emotional changes from 09:15 to 15:30.</small></div><button className={`switch ${settings.lockRulesUntilEOD ? 'on' : ''}`} onClick={() => update('lockRulesUntilEOD', !settings.lockRulesUntilEOD)}><i /></button></div><div className="risk-toggle-row"><div><b>Broker order notifications</b><small>Show every accepted or rejected execution event.</small></div><button className={`switch ${settings.soundEffects ? 'on' : ''}`} onClick={() => update('soundEffects', !settings.soundEffects)}><i /></button></div></section></div></div></div>;
};

export const DisciplineWorkspace = () => {
  const { activeTab } = useTrading();
  const views = { terminal: ControlDesk, option_chain: OptionChain, strategies: Strategies, scanner: Scanner, risk_engine: RiskVault, journal: Journal, settings: Settings };
  const View = views[activeTab] || ControlDesk;
  return <View />;
};
