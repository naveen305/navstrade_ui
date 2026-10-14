import React from 'react';
import { Inbox, AlertCircle, RefreshCw } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There are no active items to display under this view.',
  action,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        textAlign: 'center',
        height: '100%',
        color: 'var(--text-muted)',
      }}
    >
      <Icon size={24} style={{ marginBottom: '8px', opacity: 0.6 }} />
      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '3px' }}>
        {title}
      </div>
      <div style={{ fontSize: '11.5px', maxWidth: '320px', lineHeight: 1.4, marginBottom: action ? '12px' : 0 }}>
        {description}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export const LoadingState = ({ message = 'Synchronizing market data...' }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '28px',
        color: 'var(--text-secondary)',
        fontSize: '12px',
      }}
    >
      <RefreshCw size={14} style={{ animation: 'spin 1.5s linear infinite' }} />
      <span>{message}</span>
    </div>
  );
};

export const ErrorState = ({
  title = 'Data Feed Interrupted',
  message = 'Unable to establish live connection with Upstox API feed.',
  onRetry,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        textAlign: 'center',
        backgroundColor: 'var(--loss-bg)',
        border: '1px solid var(--loss-border)',
        borderRadius: 'var(--radius)',
        color: 'var(--loss)',
      }}
    >
      <AlertCircle size={20} style={{ marginBottom: '6px' }} />
      <div style={{ fontSize: '12.5px', fontWeight: 600, marginBottom: '2px' }}>{title}</div>
      <div style={{ fontSize: '11px', maxWidth: '300px', lineHeight: 1.35, marginBottom: '10px' }}>
        {message}
      </div>
      {onRetry && (
        <button className="btn btn-outline-danger btn-sm" onClick={onRetry}>
          Retry Connection
        </button>
      )}
    </div>
  );
};
