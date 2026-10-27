/**
 * Calcula uma data retroativa a partir de hoje (ou de uma data de referência) em formato YYYY-MM-DD.
 * @param {number} days Número de dias no passado
 * @param {Date} [referenceDate] Data de referência opcional
 * @returns {string} Data em formato ISO YYYY-MM-DD
 */
export function getPastDate(days, referenceDate = new Date()) {
  const d = new Date(referenceDate);
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

/**
 * Retorna a data atual no formato YYYY-MM-DD.
 * @returns {string}
 */
export function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Formata uma string de data YYYY-MM-DD para o padrão do idioma (ex: DD/MM/YYYY ou MM/DD/YYYY).
 * @param {string} dateStr Data em YYYY-MM-DD
 * @param {string} [locale='pt-BR'] Localidade
 * @returns {string}
 */
export function formatDateLocale(dateStr, locale = 'pt-BR') {
  if (!dateStr) return '';
  // Separar componentes para evitar distorção de fuso horário UTC
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) return dateStr;
  
  const d = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}

/**
 * Formata data de forma compacta para eixos de gráficos (ex: "27 Out" ou "Oct 27").
 * @param {string} dateStr Data em YYYY-MM-DD
 * @param {string} [locale='pt-BR']
 * @returns {string}
 */
export function formatChartDate(dateStr, locale = 'pt-BR') {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) return dateStr;

  const d = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
  }).format(d);
}

/**
 * Valida se uma string é uma data válida no formato YYYY-MM-DD.
 * @param {string} dateStr
 * @returns {boolean}
 */
export function isValidDate(dateStr) {
  if (typeof dateStr !== 'string') return false;
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1;
  const day = parseInt(match[3], 10);

  const d = new Date(year, month, day);
  return (
    d.getFullYear() === year &&
    d.getMonth() === month &&
    d.getDate() === day
  );
}
