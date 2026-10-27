import React, { useState } from 'react';
import {
  Download,
  FilterX,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Calendar,
  Layers,
  CheckCircle,
} from 'lucide-react';
import { TRANSLATIONS } from '../../constants/translations.js';
import { useTableFilters } from '../../hooks/useTableFilters.js';
import { formatRate } from '../../utils/formatters.js';
import { formatDateLocale } from '../../utils/date.js';
import { exportToCSV, getExportFilename } from '../../utils/csv.js';
import { EmptyState } from '../Common/EmptyState.jsx';
import styles from './RatesTable.module.css';

export function RatesTable({
  data = [],
  fromCurrency,
  toCurrency,
  language = 'pt',
  isLoading = false,
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.pt;
  const [exportNotice, setExportNotice] = useState(false);

  const {
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
    totalCount,
    filteredCount,
    hasActiveFilters,
  } = useTableFilters(data);

  const handleExportCSV = () => {
    if (filteredRecords.length === 0) {
      alert(t.exportEmptyAlert);
      return;
    }

    const filename = getExportFilename(fromCurrency, toCurrency);
    const headers = [t.colDate, t.colFrom, t.colTo, t.colRate];
    const success = exportToCSV(filteredRecords, filename, headers);

    if (success) {
      setExportNotice(true);
      setTimeout(() => setExportNotice(false), 3000);
    }
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown size={14} className={styles.sortMuted} />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp size={14} className={styles.sortActive} />
    ) : (
      <ArrowDown size={14} className={styles.sortActive} />
    );
  };

  return (
    <section className={styles.tableCard} aria-label={t.tableTitle}>
      <div className={styles.cardHeader}>
        <div>
          <h3 className={styles.title}>{t.tableTitle}</h3>
          <p className={styles.subtitle}>{t.tableSubtitle}</p>
        </div>

        {/* Botão de Exportação CSV */}
        <div className={styles.actionGroup}>
          <button
            type="button"
            className={styles.exportBtn}
            onClick={handleExportCSV}
            disabled={filteredCount === 0 || isLoading}
            title={t.exportCsvButton}
          >
            <Download size={16} />
            {t.exportCsvButton}
          </button>
          {exportNotice && (
            <span className={styles.exportSuccess}>
              <CheckCircle size={14} /> CSV Baixado!
            </span>
          )}
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className={styles.filtersBar}>
        <div className={styles.filterFields}>
          <div className={styles.filterItem}>
            <label htmlFor="filter-start-date" className={styles.filterLabel}>
              <Calendar size={13} /> {t.filterStartDate}
            </label>
            <input
              id="filter-start-date"
              type="date"
              className={styles.filterInput}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className={styles.filterItem}>
            <label htmlFor="filter-end-date" className={styles.filterLabel}>
              <Calendar size={13} /> {t.filterEndDate}
            </label>
            <input
              id="filter-end-date"
              type="date"
              className={styles.filterInput}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className={styles.filterItem}>
            <label htmlFor="filter-min-rate" className={styles.filterLabel}>
              <Layers size={13} /> {t.filterMinRate}
            </label>
            <input
              id="filter-min-rate"
              type="number"
              step="any"
              placeholder="0.00"
              className={styles.filterInput}
              value={minRate}
              onChange={(e) => setMinRate(e.target.value)}
            />
          </div>

          <div className={styles.filterItem}>
            <label htmlFor="filter-max-rate" className={styles.filterLabel}>
              <Layers size={13} /> {t.filterMaxRate}
            </label>
            <input
              id="filter-max-rate"
              type="number"
              step="any"
              placeholder="0.00"
              className={styles.filterInput}
              value={maxRate}
              onChange={(e) => setMaxRate(e.target.value)}
            />
          </div>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={clearFilters}
            title={t.clearFilters}
          >
            <FilterX size={15} />
            {t.clearFilters}
          </button>
        )}
      </div>

      {/* Contador de Registros */}
      <div className={styles.statusRow}>
        <span className={styles.counterBadge}>
          <strong>{filteredCount}</strong> {t.recordsFound} {t.recordsTotal} <strong>{totalCount}</strong>
        </span>
      </div>

      {/* Tabela de Dados */}
      {filteredRecords.length === 0 ? (
        <EmptyState
          title={t.emptyTableTitle}
          description={t.emptyTableDescription}
          actionButton={
            hasActiveFilters ? (
              <button type="button" className={styles.clearBtn} onClick={clearFilters}>
                <FilterX size={14} /> {t.clearFilters}
              </button>
            ) : null
          }
        />
      ) : (
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col" onClick={() => handleSort('date')} className={styles.sortableHeader}>
                  <div className={styles.thContent}>
                    <span>{t.colDate}</span>
                    {renderSortIcon('date')}
                  </div>
                </th>
                <th scope="col">{t.colFrom}</th>
                <th scope="col">{t.colTo}</th>
                <th
                  scope="col"
                  onClick={() => handleSort('rate')}
                  className={`${styles.sortableHeader} ${styles.alignRight}`}
                >
                  <div className={`${styles.thContent} ${styles.contentRight}`}>
                    <span>{t.colRate}</span>
                    {renderSortIcon('rate')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((row, idx) => (
                <tr key={`${row.date}-${idx}`} className={styles.tableRow}>
                  <td className={styles.dateCell}>{formatDateLocale(row.date, t.locale)}</td>
                  <td>
                    <span className={styles.currencyBadge}>{row.base || fromCurrency}</span>
                  </td>
                  <td>
                    <span className={styles.currencyBadge}>{row.quote || toCurrency}</span>
                  </td>
                  <td className={`${styles.rateCell} ${styles.alignRight}`}>
                    {formatRate(row.rate, t.locale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
