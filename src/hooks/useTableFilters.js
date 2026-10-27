import { useState, useMemo, useCallback } from 'react';

export function useTableFilters(records = []) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minRate, setMinRate] = useState('');
  const [maxRate, setMaxRate] = useState('');
  const [sortField, setSortField] = useState('date'); // 'date' | 'rate'
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' | 'desc'

  const clearFilters = useCallback(() => {
    setStartDate('');
    setEndDate('');
    setMinRate('');
    setMaxRate('');
  }, []);

  const handleSort = useCallback((field) => {
    setSortField((prevField) => {
      if (prevField === field) {
        setSortDirection((prevDir) => (prevDir === 'asc' ? 'desc' : 'asc'));
        return field;
      }
      setSortDirection('asc');
      return field;
    });
  }, []);

  const filteredRecords = useMemo(() => {
    if (!Array.isArray(records)) return [];

    let result = records.filter((item) => {
      // Filtro de data inicial
      if (startDate && item.date < startDate) {
        return false;
      }
      // Filtro de data final
      if (endDate && item.date > endDate) {
        return false;
      }
      // Filtro de taxa mínima
      if (minRate !== '' && !isNaN(Number(minRate))) {
        if (item.rate < Number(minRate)) return false;
      }
      // Filtro de taxa máxima
      if (maxRate !== '' && !isNaN(Number(maxRate))) {
        if (item.rate > Number(maxRate)) return false;
      }
      return true;
    });

    // Ordenação
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'date') {
        comparison = a.date.localeCompare(b.date);
      } else if (sortField === 'rate') {
        comparison = Number(a.rate) - Number(b.rate);
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [records, startDate, endDate, minRate, maxRate, sortField, sortDirection]);

  return {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    minRate,
    setMinRate,
    maxRate,
    setMaxRate,
    sortField,
    sortDirection,
    handleSort,
    clearFilters,
    filteredRecords,
    totalCount: records.length,
    filteredCount: filteredRecords.length,
    hasActiveFilters: Boolean(startDate || endDate || minRate !== '' || maxRate !== ''),
  };
}
