import React from 'react';
import { ShieldAlert, X } from 'lucide-react';
import { TradingProvider, useTrading } from './context/TradingContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DisciplineWorkspace } from './components/DisciplineWorkspace';
import { OrderTicketModal } from './components/modals/OrderTicketModal';
import { PanicModal } from './components/modals/PanicModal';
import './App.css';

const AppShell = () => {
  const { toastMessage, riskBanner, clearRiskBanner } = useTrading();

  return (
    <div className="app-root">
      <Header />
      {riskBanner && (
        <div className="risk-banner">
          <ShieldAlert size={16} />
          <span><strong>Capital protection active.</strong> {riskBanner.message}</span>
          <button onClick={clearRiskBanner} aria-label="Acknowledge risk message"><X size={16} /></button>
        </div>
      )}
      <div className="app-body">
        <Sidebar />
        <main className="main-content"><DisciplineWorkspace /></main>
      </div>
      <OrderTicketModal />
      <PanicModal />
      {toastMessage && <div className={`app-toast ${toastMessage.type || 'info'}`}>{toastMessage.message}</div>}
    </div>
  );
};

export default function App() {
  return <TradingProvider><AppShell /></TradingProvider>;
}
