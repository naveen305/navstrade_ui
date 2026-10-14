import React from 'react';
import { TradingProvider, useTrading } from './context/TradingContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TerminalView }        from './components/views/TerminalView';
import { OptionChainView }     from './components/views/OptionChainView';
import { StrategyBuilderView } from './components/views/StrategyBuilderView';
import { RiskDisciplineView }  from './components/views/RiskDisciplineView';
import { ScannerView }         from './components/views/ScannerView';
import { OrderTicketModal }    from './components/modals/OrderTicketModal';
import { PanicModal }          from './components/modals/PanicModal';
import './App.css';

const VIEWS = {
  terminal:         TerminalView,
  option_chain:     OptionChainView,
  strategy_builder: StrategyBuilderView,
  risk_engine:      RiskDisciplineView,
  scanner:          ScannerView,
};

const AppShell = () => {
  const { activeTab, toastMessage } = useTrading();
  const View = VIEWS[activeTab] || TerminalView;

  return (
    <div className="app-root">
      <Header />
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
