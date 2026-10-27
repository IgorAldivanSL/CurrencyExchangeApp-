import React from 'react';
import { SearchX } from 'lucide-react';
import styles from './EmptyState.module.css';

export function EmptyState({ title, description, actionButton }) {
  return (
    <div className={styles.container}>
      <div className={styles.iconCircle}>
        <SearchX size={28} />
      </div>
      {title && <h4 className={styles.title}>{title}</h4>}
      {description && <p className={styles.description}>{description}</p>}
      {actionButton && <div className={styles.action}>{actionButton}</div>}
    </div>
  );
}
