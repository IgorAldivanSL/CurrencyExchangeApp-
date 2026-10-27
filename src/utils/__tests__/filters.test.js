import { describe, it, expect } from 'vitest';

// Função de teste espelhando a lógica de useTableFilters
function applyFiltersAndSort(records, { startDate, endDate, minRate, maxRate, sortField, sortDirection }) {
  let result = records.filter((item) => {
    if (startDate && item.date < startDate) return false;
    if (endDate && item.date > endDate) return false;
    if (minRate !== '' && minRate !== undefined && !isNaN(Number(minRate))) {
      if (item.rate < Number(minRate)) return false;
    }
    if (maxRate !== '' && maxRate !== undefined && !isNaN(Number(maxRate))) {
      if (item.rate > Number(maxRate)) return false;
    }
    return true;
  });

  result.sort((a, b) => {
    let comp = 0;
    if (sortField === 'date') comp = a.date.localeCompare(b.date);
    else if (sortField === 'rate') comp = Number(a.rate) - Number(b.rate);
    return sortDirection === 'asc' ? comp : -comp;
  });

  return result;
}

describe('Lógica de Filtros e Ordenação da Tabela', () => {
  const sampleData = [
    { date: '2026-10-01', base: 'USD', quote: 'BRL', rate: 5.10 },
    { date: '2026-10-05', base: 'USD', quote: 'BRL', rate: 5.30 },
    { date: '2026-10-10', base: 'USD', quote: 'BRL', rate: 5.50 },
    { date: '2026-10-20', base: 'USD', quote: 'BRL', rate: 5.80 },
    { date: '2026-10-27', base: 'USD', quote: 'BRL', rate: 5.95 },
  ];

  it('deve filtrar registros por intervalo de datas', () => {
    const res = applyFiltersAndSort(sampleData, {
      startDate: '2026-10-05',
      endDate: '2026-10-20',
      sortField: 'date',
      sortDirection: 'asc'
    });
    expect(res.length).toBe(3);
    expect(res[0].date).toBe('2026-10-05');
    expect(res[2].date).toBe('2026-10-20');
  });

  it('deve filtrar por cotação mínima e máxima', () => {
    const res = applyFiltersAndSort(sampleData, {
      minRate: 5.25,
      maxRate: 5.85,
      sortField: 'rate',
      sortDirection: 'asc'
    });
    expect(res.length).toBe(3);
    expect(res.map((r) => r.rate)).toEqual([5.30, 5.50, 5.80]);
  });

  it('deve combinar filtros de data e cotação simultaneamente', () => {
    const res = applyFiltersAndSort(sampleData, {
      startDate: '2026-10-01',
      endDate: '2026-10-15',
      minRate: 5.20,
      maxRate: 5.60,
      sortField: 'date',
      sortDirection: 'asc'
    });
    expect(res.length).toBe(2);
    expect(res.map((r) => r.date)).toEqual(['2026-10-05', '2026-10-10']);
  });

  it('deve ordenar por cotação de forma descendente', () => {
    const res = applyFiltersAndSort(sampleData, {
      sortField: 'rate',
      sortDirection: 'desc'
    });
    expect(res[0].rate).toBe(5.95);
    expect(res[res.length - 1].rate).toBe(5.10);
  });

  it('deve retornar array vazio se nenhum registro atender aos critérios', () => {
    const res = applyFiltersAndSort(sampleData, {
      minRate: 10.00
    });
    expect(res.length).toBe(0);
  });
});
