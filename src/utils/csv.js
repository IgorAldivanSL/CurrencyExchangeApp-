/**
 * Gera string CSV a partir de um array de objetos de taxas.
 * @param {Array<{date: string, base: string, quote: string, rate: number}>} records
 * @param {Array<string>} [headers]
 * @returns {string}
 */
export function generateCSVContent(records, headers = ['Data', 'Moeda_Origem', 'Moeda_Destino', 'Cotacao']) {
  if (!records || records.length === 0) return '';

  const headerLine = headers.join(';');
  const rows = records.map((r) => {
    const date = r.date || '';
    const base = r.base || '';
    const quote = r.quote || '';
    const rate = typeof r.rate === 'number' ? r.rate.toFixed(4) : String(r.rate);
    return `"${date}";"${base}";"${quote}";"${rate}"`;
  });

  return [headerLine, ...rows].join('\r\n');
}

/**
 * Cria um Blob com o conteúdo CSV e dispara o download direto no navegador.
 * @param {Array<{date: string, base: string, quote: string, rate: number}>} records
 * @param {string} filename Nome do arquivo a ser gerado
 * @param {Array<string>} [headers]
 * @returns {boolean} Retorna true se exportou com sucesso, false se a lista estiver vazia.
 */
export function exportToCSV(records, filename, headers) {
  if (!records || records.length === 0) {
    return false;
  }

  const csvContent = generateCSVContent(records, headers);
  // Adiciona BOM (\uFEFF) para compatibilidade perfeita com Excel no Windows/Mac
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return true;
}

/**
 * Gera nome de arquivo padronizado e identificável para exportação CSV.
 * @param {string} base Moeda de base
 * @param {string} quote Moeda de cotação
 * @param {string} [dateStr] Data opcional
 * @returns {string} Exemplo: 'cotacoes_USD_BRL_2026-10-27.csv'
 */
export function getExportFilename(base, quote, dateStr = new Date().toISOString().slice(0, 10)) {
  const cleanBase = (base || 'BASE').toUpperCase();
  const cleanQuote = (quote || 'QUOTE').toUpperCase();
  return `cotacoes_${cleanBase}_${cleanQuote}_${dateStr}.csv`;
}
