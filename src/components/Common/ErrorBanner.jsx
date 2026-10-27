import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import styles from './ErrorBanner.module.css';

export function ErrorBanner({ message, onRetry, retryText = 'Tentar novamente' }) {
  if (!message) return null;

  return (
    <div className={styles.banner} role="alert">
      <div className={styles.content}>
        <AlertCircle size={20} className={styles.icon} />
        <span className={styles.message}>{message}</span>
      </div>
      {onRetry && (
        <button type="button" className={styles.retryButton} onClick={onRetry}>
          <RefreshCw size={14} />
          {retryText}
        </button>
      )}
    </div>
  );
}
