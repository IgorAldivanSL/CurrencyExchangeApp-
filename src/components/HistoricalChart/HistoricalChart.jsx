import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { PERIODS } from '../../constants/periods.js';
import { TRANSLATIONS } from '../../constants/translations.js';
import { formatRate, formatPercentage } from '../../utils/formatters.js';
import { formatChartDate, formatDateLocale } from '../../utils/date.js';
import { LoadingSpinner } from '../Common/LoadingSpinner.jsx';
import { ErrorBanner } from '../Common/ErrorBanner.jsx';
import styles from './HistoricalChart.module.css';

// Custom Tooltip component for Recharts
function CustomTooltip({ active, payload, label, locale }) {
  if (active && payload && payload.length) {
    const rateVal = payload[0].value;
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipDate}>{formatDateLocale(label, locale)}</p>
        <p className={styles.tooltipRate}>
          <span className={styles.tooltipDot} />
          Taxa: <strong>{formatRate(rateVal, locale)}</strong>
        </p>
      </div>
    );
  }
  return null;
}

export function HistoricalChart({
  data = [],
  fromCurrency,
  toCurrency,
  selectedPeriod,
  onPeriodChange,
  isLoading,
  error,
  stats,
  onRetry,
  language = 'pt',
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.pt;

  // Determinar limites de escala Y com margem visual
  const minVal = stats?.min ?? 0;
  const maxVal = stats?.max ?? 1;
  const padding = (maxVal - minVal) * 0.08 || 0.01;
  const yDomain = [
    Number((minVal - padding).toFixed(4)),
    Number((maxVal + padding).toFixed(4)),
  ];

  return (
    <section className={styles.chartCard} aria-label={t.chartTitle}>
      <div className={styles.headerRow}>
        <div>
          <h3 className={styles.title}>{t.chartTitle}</h3>
          <p className={styles.subtitle}>
            {fromCurrency}/{toCurrency} — {t.chartSubtitle}
          </p>
        </div>

        {/* Seletor de Períodos: 7d, 15d, 30d, 3m, 6m, 1y, 5y, 10y */}
        <div className={styles.periodGroup} role="group" aria-label="Períodos do histórico">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`${styles.periodBtn} ${selectedPeriod === p.id ? styles.periodActive : ''}`}
              onClick={() => onPeriodChange(p.id)}
            >
              {t[p.labelKey] || p.id.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Cartões de Estatísticas Rápidas (Min, Max, Avg, Change) */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>{t.statMin}</span>
          <span className={styles.statValue}>
            {stats?.min !== null ? formatRate(stats.min, t.locale) : '-'}
          </span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>{t.statMax}</span>
          <span className={styles.statValue}>
            {stats?.max !== null ? formatRate(stats.max, t.locale) : '-'}
          </span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>{t.statAvg}</span>
          <span className={styles.statValue}>
            {stats?.avg !== null ? formatRate(stats.avg, t.locale) : '-'}
          </span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>{t.statChange}</span>
          <span
            className={`${styles.statValue} ${
              (stats?.changePercent || 0) >= 0 ? styles.positiveChange : styles.negativeChange
            }`}
          >
            {stats?.changePercent !== null ? formatPercentage(stats.changePercent) : '-'}
          </span>
        </div>
      </div>

      {/* Área do Gráfico */}
      <div className={styles.chartWrapper}>
        {isLoading ? (
          <div className={styles.stateCenter}>
            <LoadingSpinner message={t.loadingHistory} size="medium" />
          </div>
        ) : error ? (
          <div className={styles.stateCenter}>
            <ErrorBanner message={t.errorFetchingHistory} onRetry={onRetry} retryText={t.retry} />
          </div>
        ) : data.length === 0 ? (
          <div className={styles.stateCenter}>
            <p className={styles.noData}>{t.emptyTableTitle}</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data} margin={{ top: 12, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5ECE7" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(val) => formatChartDate(val, t.locale)}
                stroke="#5F736A"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: '#DCE4DF' }}
              />
              <YAxis
                domain={yDomain}
                tickFormatter={(val) => formatRate(val, t.locale)}
                stroke="#5F736A"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={65}
              />
              <Tooltip content={<CustomTooltip locale={t.locale} />} />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#175F49"
                strokeWidth={2.5}
                dot={data.length <= 15 ? { r: 3, fill: '#175F49' } : false}
                activeDot={{ r: 5, fill: '#175F49', stroke: '#ffffff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
