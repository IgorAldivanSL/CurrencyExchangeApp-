import { useState, useEffect, useCallback } from 'react';
import { fetchCurrencies } from '../services/frankfurter.js';

// Fallback das principais moedas caso ocorra falha de rede temporária
const FALLBACK_CURRENCIES = [
  { iso_code: 'USD', name: 'United States Dollar', symbol: '$' },
  { iso_code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { iso_code: 'EUR', name: 'Euro', symbol: '€' },
  { iso_code: 'GBP', name: 'British Pound Sterling', symbol: '£' },
  { iso_code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { iso_code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$' },
  { iso_code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { iso_code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { iso_code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
];

export function useCurrencies() {
  const [currencies, setCurrencies] = useState(FALLBACK_CURRENCIES);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCurrencies = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchCurrencies();
      if (data && data.length > 0) {
        setCurrencies(data);
      }
    } catch (err) {
      console.warn('Utilizando moedas em fallback devido a erro:', err);
      setError(err.message || 'Falha ao sincronizar lista completa de moedas.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCurrencies();
  }, [loadCurrencies]);

  return { currencies, isLoading, error, refetch: loadCurrencies };
}
