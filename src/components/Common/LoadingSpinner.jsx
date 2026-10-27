import React from 'react';
import styles from './LoadingSpinner.module.css';

export function LoadingSpinner({ message = 'Carregando...', size = 'medium' }) {
  return (
    <div className={`${styles.container} ${styles[size]}`}>
      <div className={styles.spinner} role="status" aria-label={message} />
      {message && <span className={styles.text}>{message}</span>}
    </div>
  );
}
