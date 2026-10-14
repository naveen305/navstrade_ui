import React from 'react';
import { TradingProvider, useTrading } from './context/TradingContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TerminalView }        from './components/views/TerminalView';
import { OptionChainView }     from './components/views/OptionChainView';
import { StrategyBuilderView } from './components/views/StrategyBuilderView';
import { RiskDisciplineView }  from './components/views/RiskDisciplineView';
import { ScannerView }         from './components/views/ScannerView';
import { JournalView }         from './components/views/JournalView';
import { SettingsView }        from './components/views/SettingsView';
import { OrderTicketModal }    from './components/modals/OrderTicketModal';
import { PanicModal }          from './components/modals/PanicModal';
import { ShieldAlert, X }      from 'lucide-react';
import './App.css';

const VIEWS = {
  terminal:         TerminalView,
  option_chain:     OptionChainView,
  strategies:       StrategyBuilderView,
  strategy_builder: StrategyBuilderView,
  risk_engine:      RiskDisciplineView,
  scanner:          ScannerView,
  journal:          JournalView,
  settings:         SettingsView,
};

const AppShell = () => {
  const {
    activeTab,
    toastMessage,
    riskBanner,
    clearRiskBanner,
    toggleSidebar,
    toggleTheme
  } = useTrading();
  const View = VIEWS[activeTab] || TerminalView;

  // Global Keyboard Shortcuts (Ctrl/Cmd + B for Sidebar, Ctrl/Cmd + D for Theme)
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        toggleTheme();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar, toggleTheme]);

  return (
    <div className="app-root">
      <Header />

      {/* Calm Full-Width Risk Limit Banner (Strict User Requirement: Calm, no sirens, no flashing) */}
      {riskBanner && (
        <div className="calm-risk-banner">
          <div className="banner-content">
            <ShieldAlert size={15} style={{ color: 'var(--loss)', flexShrink: 0 }} />
            <span className="banner-text">
              <strong>Risk Guard Notice:</strong> {riskBanner.message}
            </span>
          </div>
          <button
            className="banner-close"
            onClick={clearRiskBanner}
            title="Acknowledge and reset simulation"
          >
            <X size={13} />
          </button>
        </div>
      )}

      <div className="app-body">
        <Sidebar />
        <main className="main-content">
          <View />
        </main>
      </div>

      <OrderTicketModal />
      <PanicModal />

      {toastMessage && (
        <div className="toast-wrap">
          <div className={`toast toast-${toastMessage.type}`}>
            {toastMessage.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <TradingProvider>
      <AppShell />
    </TradingProvider>
  );
}
