/**
 * Valida o valor monetário inserido pelo usuário.
 * Deve ser um número maior que zero.
 * @param {any} value
 * @returns {{ isValid: boolean, errorMessageKey: string | null, value: number }}
 */
export function validateAmount(value) {
  if (value === '' || value === null || value === undefined) {
    return {
      isValid: false,
      errorMessageKey: 'invalidAmountError',
      value: 0,
    };
  }

  const normalized = typeof value === 'string' ? value.replace(',', '.') : value;
  const num = Number(normalized);

  if (isNaN(num) || num <= 0) {
    return {
      isValid: false,
      errorMessageKey: 'invalidAmountError',
      value: 0,
    };
  }

  return {
    isValid: true,
    errorMessageKey: null,
    value: num,
  };
}

/**
 * Filtra strings de entrada para permitir apenas dígitos e um ponto/vírgula decimal.
 * @param {string} input
 * @returns {string}
 */
export function sanitizeNumericInput(input) {
  if (typeof input !== 'string') return String(input || '');
  return input.replace(/[^0-9.,]/g, '');
}
