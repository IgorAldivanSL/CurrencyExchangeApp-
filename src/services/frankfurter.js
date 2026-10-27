const BASE_URL = 'https://api.frankfurter.dev/v2';

/**
 * Busca a lista de todas as moedas suportadas pela API Frankfurter.
 * @returns {Promise<Array<{iso_code: string, name: string, symbol: string}>>}
 */
export async function fetchCurrencies() {
  try {
    const response = await fetch(`${BASE_URL}/currencies`, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Falha ao obter moedas: HTTP ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('Formato inesperado ao listar moedas.');
    }

    // Ordenar alfabeticamente por código ISO para melhor usabilidade
    return data.sort((a, b) => a.iso_code.localeCompare(b.iso_code));
  } catch (error) {
    console.error('Erro no serviço fetchCurrencies:', error);
    throw error;
  }
}

/**
 * Busca a cotação pontual mais recente entre duas moedas.
 * @param {string} base Moeda de origem (ex: 'USD')
 * @param {string} quote Moeda de destino (ex: 'BRL')
 * @returns {Promise<{date: string, base: string, quote: string, rate: number}>}
 */
export async function fetchLatestRate(base, quote) {
  if (!base || !quote) {
    throw new Error('Moeda de origem e destino são obrigatórias.');
  }

  const baseUpper = base.toUpperCase();
  const quoteUpper = quote.toUpperCase();

  // Regra de negócio: mesma moeda possui paridade 1.0000
  if (baseUpper === quoteUpper) {
    return {
      date: new Date().toISOString().slice(0, 10),
      base: baseUpper,
      quote: quoteUpper,
      rate: 1.0,
    };
  }

  try {
    const response = await fetch(`${BASE_URL}/rate/${baseUpper}/${quoteUpper}`, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const message = errorBody.message || `HTTP ${response.status}`;
      throw new Error(`Erro ao consultar cotação: ${message}`);
    }

    const data = await response.json();
    return {
      date: data.date,
      base: data.base,
      quote: data.quote,
      rate: Number(data.rate),
    };
  } catch (error) {
    console.error('Erro no serviço fetchLatestRate:', error);
    throw error;
  }
}

/**
 * Busca a série temporal de taxas de câmbio entre duas datas.
 * @param {string} base Moeda de origem
 * @param {string} quote Moeda de destino
 * @param {string} fromDate Data de início (YYYY-MM-DD)
 * @param {string} [toDate] Data de término (YYYY-MM-DD)
 * @param {'week' | 'month' | null} [group] Agrupamento opcional para períodos extensos
 * @returns {Promise<Array<{date: string, base: string, quote: string, rate: number}>>}
 */
export async function fetchHistoricalRates(base, quote, fromDate, toDate, group = null) {
  if (!base || !quote || !fromDate) {
    throw new Error('Parâmetros base, quote e fromDate são obrigatórios.');
  }

  const baseUpper = base.toUpperCase();
  const quoteUpper = quote.toUpperCase();

  // Caso especial: mesma moeda (gera série estável com taxa 1.0)
  if (baseUpper === quoteUpper) {
    const todayStr = new Date().toISOString().slice(0, 10);
    return [
      { date: fromDate, base: baseUpper, quote: quoteUpper, rate: 1.0 },
      { date: toDate || todayStr, base: baseUpper, quote: quoteUpper, rate: 1.0 },
    ];
  }

  const params = new URLSearchParams({
    base: baseUpper,
    quotes: quoteUpper,
    from: fromDate,
  });

  if (toDate) params.append('to', toDate);
  if (group) params.append('group', group);

  try {
    const response = await fetch(`${BASE_URL}/rates?${params.toString()}`, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const message = errorBody.message || `HTTP ${response.status}`;
      throw new Error(`Erro ao consultar histórico: ${message}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('A API não retornou uma lista válida de taxas.');
    }

    return data.map((item) => ({
      date: item.date,
      base: item.base || baseUpper,
      quote: item.quote || quoteUpper,
      rate: Number(item.rate),
    }));
  } catch (error) {
    console.error('Erro no serviço fetchHistoricalRates:', error);
    throw error;
  }
}
