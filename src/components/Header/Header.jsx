import React from 'react';
import { TRANSLATIONS } from '../../constants/translations.js';
import styles from './Header.module.css';

export function Header({ language = 'pt', onLanguageChange }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.pt;
  const languages = [
    { code: 'pt', label: 'PT' },
    { code: 'en', label: 'EN' },
    { code: 'es', label: 'ES' },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.brandGroup}>
          <div className={styles.logoBadge}>H</div>
          <div>
            <h1 className={styles.title}>{t.appTitle}</h1>
            <p className={styles.subtitle}>{t.appSubtitle}</p>
          </div>
        </div>

        <nav className={styles.langSelector} aria-label="Seleção de idioma">
          {languages.map((item) => (
            <button
              key={item.code}
              type="button"
              className={`${styles.langBtn} ${language === item.code ? styles.langActive : ''}`}
              onClick={() => onLanguageChange(item.code)}
              aria-pressed={language === item.code}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
