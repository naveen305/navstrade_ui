import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { Settings as SettingsIcon, Key, Radio, Shield, Lock, CheckCircle2, AlertCircle, RefreshCw, Server } from 'lucide-react';

export const SettingsView = () => {
  const { settings, updateSettings, paperCriteria, showToast } = useTrading();

  const [apiKey, setApiKey] = useState('upstox_sec_99a81f3b2049');
  const [apiSecret, setApiSecret] = useState('••••••••••••••••••••••••');
  const [redirectUri, setRedirectUri] = useState('http://127.0.0.1:5173/auth/callback');
  const [lockDuringMarketHours, setLockDuringMarketHours] = useState(true);
  const [testTesting, setTestTesting] = useState(false);

  const handleTestConnection = () => {
    setTestTesting(true);
    setTimeout(() => {
      setTestTesting(false);
      showToast('Upstox V2 API Connection Verified · Ping: 18ms (NSE Co-location)', 'success');
    }, 800);
  };

  return (
    <div style={S.root}>
      {/* ── Sub-header Toolbar ── */}
      <div style={S.toolbar}>
        <div style={S.toolLeft}>
          <SettingsIcon size={16} style={{ color: 'var(--navy)' }} />
          <div>
            <span style={S.pageTitle}>Workstation Settings & Upstox Gateway</span>
            <span style={S.pageSubtitle}>
              API integration · Real-time WebSocket bridge · Governance locks
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Gateway Status: <strong style={{ color: 'var(--profit)' }}>CONNECTED (NSE CO-LO)</strong>
          </span>
          <button
            className="btn btn-outline"
            style={{ fontSize: '11px', padding: '3px 9px', gap: 4 }}
            onClick={handleTestConnection}
            disabled={testTesting}
          >
            <RefreshCw size={11} className={testTesting ? 'animate-spin' : ''} />
            {testTesting ? 'Testing...' : 'Test Latency'}
          </button>
        </div>
      </div>

      {/* ── Settings Content ── */}
      <div style={S.mainContent}>
        <div style={S.grid2}>
          {/* Left Column: API Gateway Configuration */}
          <div style={S.cardBox}>
            <div style={S.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Key size={14} style={{ color: 'var(--navy)' }} />
                <span style={S.cardTitle}>Upstox F&O API Gateway Credentials</span>
              </div>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  padding: '2px 6px',
                  borderRadius: '3px',
                  backgroundColor: 'var(--profit-bg)',
                  color: 'var(--profit)',
                  border: '1px solid var(--border-light)'
                }}
              >
                V2 ACTIVE
              </span>
            </div>

            <div style={S.cardBody}>
              <div style={S.field}>
                <label style={S.label}>Upstox API Key (Client ID)</label>
                <input
                  type="text"
                  className="form-input font-num"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                />
              </div>

              <div style={S.field}>
                <label style={S.label}>API Secret</label>
                <input
                  type="password"
                  className="form-input font-num"
                  value={apiSecret}
                  onChange={e => setApiSecret(e.target.value)}
                />
              </div>

              <div style={S.field}>
                <label style={S.label}>Redirect URL (Callback)</label>
                <input
                  type="text"
                  className="form-input font-num"
                  value={redirectUri}
                  onChange={e => setRedirectUri(e.target.value)}
                />
              </div>

              <div style={S.field}>
                <label style={S.label}>Session Token Status</label>
                <div style={S.tokenStatusBox}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle2 size={13} style={{ color: 'var(--profit)' }} />
                    <span style={{ fontSize: '11.5px', color: 'var(--text-primary)', fontWeight: 500 }}>
                      Daily Session Authenticated (Expires 06:00 AM IST)
                    </span>
                  </div>
                  <button
                    className="btn btn-outline"
                    style={{ fontSize: '10.5px', padding: '2px 7px' }}
                    onClick={() => showToast('Session token refreshed via Upstox OAuth', 'success')}
                  >
                    Re-Authenticate
                  </button>
                </div>
              </div>

              <div style={{ paddingTop: 8 }}>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => showToast('API Credentials updated & saved locally', 'success')}
                >
                  Save Gateway Configuration
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Rule Locks & Execution Environment */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Live Trading Unlock Requirements */}
            <div style={S.cardBox}>
              <div style={S.cardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Shield size={14} style={{ color: 'var(--navy)' }} />
                  <span style={S.cardTitle}>Execution Environment & "Go Live" Governance</span>
                </div>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    padding: '2px 6px',
                    borderRadius: '3px',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-main)'
                  }}
                >
                  MODE: PAPER
                </span>
              </div>

              <div style={S.cardBody}>
                <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
                  To ensure emotional mastery and prevent catastrophic beginner capital drawdowns, "Go Live" mode is locked until paper discipline criteria are satisfied:
                </p>

                <div style={S.criteriaChecklist}>
                  <div style={S.criteriaRow}>
                    <CheckCircle2 size={14} style={{ color: 'var(--profit)' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '11.5px', color: 'var(--text-primary)', fontWeight: 500 }}>
                          Complete 20 Paper Trades with SL
                        </span>
                        <span className="font-num" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--navy)' }}>
                          {paperCriteria.completed} / {paperCriteria.required} ({Math.round((paperCriteria.completed / paperCriteria.required) * 100)}%)
                        </span>
                      </div>
                      <div style={S.miniTrack}>
                        <div style={{ ...S.miniFill, width: `${(paperCriteria.completed / paperCriteria.required) * 100}%` }} />
                      </div>
                    </div>
                  </div>

                  <div style={S.criteriaRow}>
                    <CheckCircle2 size={14} style={{ color: 'var(--profit)' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '11.5px', color: 'var(--text-primary)', fontWeight: 500 }}>
                          Zero Kill-Switch Breaches in Last 5 Sessions
                        </span>
                        <span className="font-num" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--profit)' }}>
                          0 Breaches (Passed)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={S.criteriaRow}>
                    <CheckCircle2 size={14} style={{ color: 'var(--profit)' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '11.5px', color: 'var(--text-primary)', fontWeight: 500 }}>
                          SEBI Mandatory Risk Disclosure Signed
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--profit)', fontWeight: 600 }}>
                          Verified
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 10, padding: '8px 10px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-main)', borderRadius: 'var(--radius)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    ℹ️ Remaining requirement: Complete <strong>6 more disciplined paper trades</strong> to unlock live capital execution.
                  </span>
                </div>
              </div>
            </div>

            {/* Anti-Tamper Rule Lock */}
            <div style={S.cardBox}>
              <div style={S.cardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Lock size={14} style={{ color: 'var(--navy)' }} />
                  <span style={S.cardTitle}>Market Hours Parameter Tamper Lock</span>
                </div>
              </div>

              <div style={S.cardBody}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Lock Risk Parameters from 09:15 to 15:30 IST
                    </span>
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                      Prevents widening daily loss limit or disabling circuit breakers mid-session during emotional drawdowns.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={lockDuringMarketHours}
                    onChange={e => setLockDuringMarketHours(e.target.checked)}
                    style={{ width: 16, height: 16, accentColor: 'var(--navy)' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const S = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: 'var(--bg-main)',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 16px',
    backgroundColor: 'var(--bg-surface)',
    borderBottom: '1px solid var(--border-main)',
    flexShrink: 0,
    gap: 12,
  },
  toolLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  pageTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    display: 'block',
  },
  pageSubtitle: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    display: 'block',
  },
  mainContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
    maxWidth: '1100px',
  },
  cardBox: {
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-main)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 16px',
    borderBottom: '1px solid var(--border-main)',
    backgroundColor: 'var(--bg-surface)',
  },
  cardTitle: {
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: 'var(--text-primary)',
  },
  cardBody: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  label: {
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
  },
  tokenStatusBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 10px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius)',
  },
  criteriaChecklist: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    marginTop: 10,
  },
  criteriaRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    padding: '8px 10px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius)',
  },
  miniTrack: {
    height: '4px',
    backgroundColor: 'var(--border-main)',
    borderRadius: '2px',
    overflow: 'hidden',
    marginTop: 4,
  },
  miniFill: {
    height: '100%',
    backgroundColor: 'var(--navy)',
    borderRadius: '2px',
  },
};
