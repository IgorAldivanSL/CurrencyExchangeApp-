import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { TRANSLATIONS } from '../../constants/translations.js';
import { validateAmount, sanitizeNumericInput } from '../../utils/validation.js';
import { calculateConvertedValue, formatCurrencyValue, formatRate } from '../../utils/formatters.js';
import { formatDateLocale } from '../../utils/date.js';
import { LoadingSpinner } from '../Common/LoadingSpinner.jsx';
import styles from './CurrencyConverter.module.css';

export function CurrencyConverter({
  fromCurrency,
  toCurrency,
  amount,
  currencies = [],
  exchangeRate,
  rateDate,
  isLoadingRate,
  rateError,
  language = 'pt',
  onFromChange,
  onToChange,
  onAmountChange,
  onSwapCurrencies,
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.pt;
  const [localAmount, setLocalAmount] = useState(String(amount ?? 1000));
  const [inputError, setInputError] = useState(null);

  // Sincroniza estado local caso prop externa mude
  useEffect(() => {
    if (amount !== undefined && amount !== null) {
      setLocalAmount(String(amount));
    }
  }, [amount]);

  const handleInputChange = (e) => {
    const rawVal = e.target.value;
    const sanitized = sanitizeNumericInput(rawVal);
    setLocalAmount(sanitized);

    const validation = validateAmount(sanitized);
    if (!validation.isValid) {
      setInputError(t[validation.errorMessageKey] || 'Valor inválido.');
    } else {
      setInputError(null);
      onAmountChange(validation.value);
    }
  };

  const isSameCurrency = fromCurrency === toCurrency;
  const convertedTotal = calculateConvertedValue(
    validateAmount(localAmount).isValid ? localAmount : 0,
    exchangeRate || (isSameCurrency ? 1 : 0)
  );

  return (
    <section className={styles.converterCard} aria-label={t.converterTitle}>
      <div className={styles.cardHeader}>
        <div>
          <h2 className={styles.cardTitle}>{t.converterTitle}</h2>
          <p className={styles.cardDescription}>{t.converterDescription}</p>
        </div>
      </div>

      <div className={styles.formGrid}>
        {/* Campo de Montante */}
        <div className={styles.fieldGroup}>
          <label htmlFor="amount-input" className={styles.label}>
            {t.amountLabel}
          </label>
          <div className={`${styles.inputWrapper} ${inputError ? styles.hasError : ''}`}>
            <input
              id="amount-input"
              type="text"
              inputMode="decimal"
              className={styles.input}
              value={localAmount}
              onChange={handleInputChange}
              placeholder="0.00"
            />
          </div>
          {inputError && <span className={styles.errorText}>{inputError}</span>}
        </div>

        {/* Seleção de Moeda de Origem */}
        <div className={styles.fieldGroup}>
          <label htmlFor="from-currency-select" className={styles.label}>
            {t.fromLabel}
          </label>
          <div className={styles.selectWrapper}>
            <select
              id="from-currency-select"
              className={styles.select}
              value={fromCurrency}
              onChange={(e) => onFromChange(e.target.value)}
            >
              {currencies.map((curr) => (
                <option key={curr.iso_code} value={curr.iso_code}>
                  {curr.iso_code} — {curr.name} ({curr.symbol || curr.iso_code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Botão de Inverter */}
        <div className={styles.swapWrapper}>
          <button
            type="button"
            className={styles.swapButton}
            onClick={onSwapCurrencies}
            title={t.swapButton}
            aria-label={t.swapButton}
          >
            <ArrowLeftRight size={18} />
          </button>
        </div>

        {/* Seleção de Moeda de Destino */}
        <div className={styles.fieldGroup}>
          <label htmlFor="to-currency-select" className={styles.label}>
            {t.toLabel}
          </label>
          <div className={styles.selectWrapper}>
            <select
              id="to-currency-select"
              className={styles.select}
              value={toCurrency}
              onChange={(e) => onToChange(e.target.value)}
            >
              {currencies.map((curr) => (
                <option key={curr.iso_code} value={curr.iso_code}>
                  {curr.iso_code} — {curr.name} ({curr.symbol || curr.iso_code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Alerta de mesma moeda */}
      {isSameCurrency && (
        <div className={styles.noticeBox}>
          <AlertTriangle size={16} />
          <span>{t.sameCurrencyNotice}</span>
        </div>
      )}

      {/* Painel de Resultado da Conversão */}
      <div className={styles.resultContainer}>
        {isLoadingRate ? (
          <LoadingSpinner message={t.loadingRate} size="small" />
        ) : rateError ? (
          <div className={styles.rateErrorMessage}>
            <span>{rateError}</span>
          </div>
        ) : (
          <div className={styles.resultFlex}>
            <div className={styles.valueBlock}>
              <span className={styles.resultLabel}>{t.convertedValueLabel}</span>
              <div className={styles.resultValue}>
                {formatCurrencyValue(convertedTotal, toCurrency, t.locale)}
              </div>
            </div>

            <div className={styles.metaBlock}>
              <div className={styles.metaItem}>
                <TrendingUp size={16} className={styles.metaIcon} />
                <span className={styles.metaLabel}>{t.rateBadge}</span>
                <strong className={styles.metaValue}>
                  1 {fromCurrency} = {formatRate(exchangeRate || 1, t.locale)} {toCurrency}
                </strong>
              </div>

              {rateDate && (
                <div className={styles.metaItem}>
                  <Clock size={16} className={styles.metaIcon} />
                  <span className={styles.metaLabel}>{t.effectiveDateBadge}</span>
                  <span className={styles.metaValue}>{formatDateLocale(rateDate, t.locale)}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
