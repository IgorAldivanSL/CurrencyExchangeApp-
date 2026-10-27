import React, { useState, useCallback } from 'react';
import { Header } from './components/Header/Header.jsx';
import { CurrencyConverter } from './components/CurrencyConverter/CurrencyConverter.jsx';
import { HistoricalChart } from './components/HistoricalChart/HistoricalChart.jsx';
import { RatesTable } from './components/RatesTable/RatesTable.jsx';
import { ErrorBanner } from './components/Common/ErrorBanner.jsx';
import { useCurrencies } from './hooks/useCurrencies.js';
import { useExchangeRate } from './hooks/useExchangeRate.js';
import { useHistoricalRates } from './hooks/useHistoricalRates.js';
import { DEFAULT_PERIOD } from './constants/periods.js';
import { TRANSLATIONS } from './constants/translations.js';
import styles from './App.module.css';

export function App() {
  const [language, setLanguage] = useState('pt');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('BRL');
  const [amount, setAmount] = useState(1000);
  const [selectedPeriod, setSelectedPeriod] = useState(DEFAULT_PERIOD);

  const t = TRANSLATIONS[language] || TRANSLATIONS.pt;

  // Custom Hooks
  const {
    currencies,
    isLoading: isLoadingCurrencies,
    error: currenciesError,
    refetch: refetchCurrencies,
  } = useCurrencies();

  const {
    rate,
    rateDate,
    isLoading: isLoadingRate,
    error: rateError,
    refetch: refetchRate,
  } = useExchangeRate(fromCurrency, toCurrency);

  const {
    historicalData,
    isLoading: isLoadingHistory,
    error: historyError,
    stats,
    refetch: refetchHistory,
  } = useHistoricalRates(fromCurrency, toCurrency, selectedPeriod);

  // Inversão rápida de moedas
  const handleSwap = useCallback(() => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }, [fromCurrency, toCurrency]);

  return (
    <div className={styles.appContainer}>
      <Header language={language} onLanguageChange={setLanguage} />

      <main className={styles.mainContent}>
        {/* Banner de erro global para lista de moedas se houver */}
        {currenciesError && (
          <ErrorBanner
            message={`Aviso: ${currenciesError}`}
            onRetry={refetchCurrencies}
            retryText={t.retry}
          />
        )}

        {/* 1. Conversor de Moedas */}
        <CurrencyConverter
          fromCurrency={fromCurrency}
          toCurrency={toCurrency}
          amount={amount}
          currencies={currencies}
          exchangeRate={rate}
          rateDate={rateDate}
          isLoadingRate={isLoadingRate || isLoadingCurrencies}
          rateError={rateError}
          language={language}
          onFromChange={setFromCurrency}
          onToChange={setToCurrency}
          onAmountChange={setAmount}
          onSwapCurrencies={handleSwap}
        />

        {/* 2. Gráfico de Evolução Histórica */}
        <HistoricalChart
          data={historicalData}
          fromCurrency={fromCurrency}
          toCurrency={toCurrency}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          isLoading={isLoadingHistory}
          error={historyError}
          stats={stats}
          onRetry={refetchHistory}
          language={language}
        />

        {/* 3. Tabela de Dados e Filtros */}
        <RatesTable
          data={historicalData}
          fromCurrency={fromCurrency}
          toCurrency={toCurrency}
          language={language}
          isLoading={isLoadingHistory}
        />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>{t.footerText}</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
