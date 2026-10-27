import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchHistoricalRates } from '../services/frankfurter.js';
import { PERIODS } from '../constants/periods.js';
import { getPastDate } from '../utils/date.js';

export function useHistoricalRates(fromCurrency, toCurrency, periodId = '30d') {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadHistory = useCallback(async () => {
    if (!fromCurrency || !toCurrency) return;

    const periodConfig = PERIODS.find((p) => p.id === periodId) || PERIODS[2];
    const fromDate = getPastDate(periodConfig.days);

    setIsLoading(true);
    setError(null);

    try {
      const records = await fetchHistoricalRates(
        fromCurrency,
        toCurrency,
        fromDate,
        undefined,
        periodConfig.group
      );
      setData(records);
    } catch (err) {
      console.error('Erro ao carregar série histórica:', err);
      setError(err.message || 'Falha ao buscar série histórica.');
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [fromCurrency, toCurrency, periodId]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Estatísticas calculadas de forma memoizada
  const stats = useMemo(() => {
    if (!data || data.length === 0) {
      return { min: null, max: null, avg: null, changePercent: null };
    }

    const rates = data.map((d) => d.rate).filter((r) => !isNaN(r) && r > 0);
    if (rates.length === 0) {
      return { min: null, max: null, avg: null, changePercent: null };
    }

    const min = Math.min(...rates);
    const max = Math.max(...rates);
    const sum = rates.reduce((acc, curr) => acc + curr, 0);
    const avg = sum / rates.length;

    const firstRate = rates[0];
    const lastRate = rates[rates.length - 1];
    const changePercent = firstRate > 0 ? ((lastRate - firstRate) / firstRate) * 100 : 0;

    return { min, max, avg, changePercent };
  }, [data]);

  return {
    historicalData: data,
    isLoading,
    error,
    stats,
    refetch: loadHistory,
  };
}
