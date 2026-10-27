import { useState, useEffect, useCallback } from 'react';
import { fetchLatestRate } from '../services/frankfurter.js';

export function useExchangeRate(fromCurrency, toCurrency) {
  const [rate, setRate] = useState(null);
  const [rateDate, setRateDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadRate = useCallback(async () => {
    if (!fromCurrency || !toCurrency) return;

    // Regra de mesma moeda
    if (fromCurrency === toCurrency) {
      setRate(1.0);
      setRateDate(new Date().toISOString().slice(0, 10));
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchLatestRate(fromCurrency, toCurrency);
      setRate(data.rate);
      setRateDate(data.date);
    } catch (err) {
      console.error('Erro ao buscar taxa de câmbio:', err);
      setError(err.message || 'Falha ao buscar cotação.');
      setRate(null);
    } finally {
      setIsLoading(false);
    }
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    loadRate();
  }, [loadRate]);

  return {
    rate,
    rateDate,
    isLoading,
    error,
    refetch: loadRate,
  };
}
