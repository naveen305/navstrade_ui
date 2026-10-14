import React from 'react';
import { TradingProvider, useTrading } from './context/TradingContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TerminalView } from './components/views/TerminalView';
import { OptionChainView } from './components/views/OptionChainView';
import { StrategyBuilderView } from './components/views/StrategyBuilderView';
import { RiskDisciplineView } from './components/views/RiskDisciplineView';
import { ScannerView } from './components/views/ScannerView';
import { OrderTicketModal } from './components/modals/OrderTicketModal';
import { PanicModal } from './components/modals/PanicModal';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import './App.css';

const MainAppContent = () => {
  const { activeTab, toastMessage } = useTrading();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'terminal':
        return <TerminalView />;
      case 'option_chain':
        return <OptionChainView />;
      case 'strategy_builder':
        return <StrategyBuilderView />;
      case 'risk_engine':
        return <RiskDisciplineView />;
      case 'scanner':
        return <ScannerView />;
      default:
        return <TerminalView />;
    }
  };

  return (
    <div className="terminal-app-layout">
      {/* 1. Global Institutional Header */}
      <Header />

      {/* 2. Workspace Body: Sidebar + Active View */}
      <div className="terminal-body-layout">
        <Sidebar />
        <main className="terminal-main-viewport">
          {renderActiveView()}
        </main>
      </div>

      {/* 3. Interactive Modals */}
      <OrderTicketModal />
      <PanicModal />

      {/* 4. Global Toast System */}
      {toastMessage && (
        <div className={`toast-notification toast-${toastMessage.type}`}>
          {toastMessage.type === 'success' && <CheckCircle2 size={16} className="text-profit" />}
          {toastMessage.type === 'danger' && <AlertTriangle size={16} className="text-loss" />}
          {toastMessage.type === 'info' && <Info size={16} className="text-cyan" />}
          <span>{toastMessage.message}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <TradingProvider>
      <MainAppContent />
    </TradingProvider>
  );
}
