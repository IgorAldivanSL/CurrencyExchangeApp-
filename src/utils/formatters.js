/**
 * Multiplica o montante pela taxa e arredonda para 2 casas decimais (ou 4 se a taxa for muito baixa).
 * @param {number|string} amount
 * @param {number|string} rate
 * @returns {number}
 */
export function calculateConvertedValue(amount, rate) {
  const numAmount = Number(amount);
  const numRate = Number(rate);
  if (isNaN(numAmount) || isNaN(numRate) || numAmount < 0) return 0;
  return Number((numAmount * numRate).toFixed(4));
}

/**
 * Formata um valor numérico com a moeda ou formato monetário adequado.
 * @param {number} value
 * @param {string} currencyCode Código ISO (ex: 'BRL', 'USD')
 * @param {string} [locale='pt-BR']
 * @returns {string}
 */
export function formatCurrencyValue(value, currencyCode = 'USD', locale = 'pt-BR') {
  const num = Number(value);
  if (isNaN(num)) return '0,00';

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(num);
  } catch {
    // Fallback caso o código ISO não seja suportado pela engine de formatação
    return `${num.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} ${currencyCode}`;
  }
}

/**
 * Formata a taxa cambial pura com até 4 casas decimais.
 * @param {number} rate
 * @param {string} [locale='pt-BR']
 * @returns {string}
 */
export function formatRate(rate, locale = 'pt-BR') {
  const num = Number(rate);
  if (isNaN(num)) return '-';
  return num.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
}

/**
 * Formata variação percentual com sinal positivo ou negativo (+X.XX% ou -X.XX%).
 * @param {number} percent
 * @returns {string}
 */
export function formatPercentage(percent) {
  if (isNaN(percent) || percent === null || percent === undefined) return '0.00%';
  const sign = percent > 0 ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
}
