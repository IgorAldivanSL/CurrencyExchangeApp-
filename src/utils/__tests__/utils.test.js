import { describe, it, expect } from 'vitest';
import { getPastDate, isValidDate, formatDateLocale } from '../date.js';
import { calculateConvertedValue, formatRate, formatPercentage } from '../formatters.js';
import { validateAmount, sanitizeNumericInput } from '../validation.js';
import { generateCSVContent, getExportFilename } from '../csv.js';

describe('Validação de Datas (date.js)', () => {
  it('deve calcular uma data no passado corretamente', () => {
    const ref = new Date(2026, 9, 27); // 27 de Outubro de 2026
    const past7 = getPastDate(7, ref);
    expect(past7).toBe('2026-10-20');
  });

  it('deve validar datas no padrão ISO YYYY-MM-DD', () => {
    expect(isValidDate('2026-10-27')).toBe(true);
    expect(isValidDate('2026-02-28')).toBe(true);
    expect(isValidDate('invalido')).toBe(false);
    expect(isValidDate('2026-13-45')).toBe(false);
  });

  it('deve formatar data para localidade pt-BR', () => {
    const formatted = formatDateLocale('2026-10-27', 'pt-BR');
    expect(formatted).toBe('27/10/2026');
  });
});

describe('Formatadores e Cálculos Financeiros (formatters.js)', () => {
  it('deve calcular valor convertido multiplicando quantia pela taxa', () => {
    expect(calculateConvertedValue(100, 5.5)).toBe(550);
    expect(calculateConvertedValue(10, 1.118)).toBe(11.18);
  });

  it('deve retornar 0 para valores inválidos ou negativos', () => {
    expect(calculateConvertedValue(-50, 5.5)).toBe(0);
    expect(calculateConvertedValue('abc', 5.5)).toBe(0);
  });

  it('deve formatar taxa com até 4 casas decimais', () => {
    const rate = formatRate(5.9358, 'pt-BR');
    expect(rate).toContain('5,9358');
  });

  it('deve formatar variação percentual com sinal explícito', () => {
    expect(formatPercentage(2.45)).toBe('+2.45%');
    expect(formatPercentage(-1.12)).toBe('-1.12%');
    expect(formatPercentage(0)).toBe('0.00%');
  });
});

describe('Validação de Entradas (validation.js)', () => {
  it('deve aceitar montantes numéricos positivos válidos', () => {
    const result = validateAmount(150.5);
    expect(result.isValid).toBe(true);
    expect(result.value).toBe(150.5);
    expect(result.errorMessageKey).toBeNull();
  });

  it('deve aceitar string com vírgula e normalizar para número', () => {
    const result = validateAmount('250,75');
    expect(result.isValid).toBe(true);
    expect(result.value).toBe(250.75);
  });

  it('deve rejeitar valores zero ou negativos', () => {
    expect(validateAmount(0).isValid).toBe(false);
    expect(validateAmount(-10).isValid).toBe(false);
  });

  it('deve rejeitar texto não numérico e strings vazias', () => {
    expect(validateAmount('').isValid).toBe(false);
    expect(validateAmount('abc').isValid).toBe(false);
  });

  it('deve sanitizar caracteres não numéricos de entradas', () => {
    expect(sanitizeNumericInput('R$ 1.500,50')).toBe('1.500,50');
  });
});

describe('Geração de CSV (csv.js)', () => {
  it('deve gerar conteúdo CSV com cabeçalhos e aspas delimitadas', () => {
    const records = [
      { date: '2026-10-27', base: 'USD', quote: 'BRL', rate: 5.9358 },
      { date: '2026-10-26', base: 'USD', quote: 'BRL', rate: 5.9120 }
    ];
    const csv = generateCSVContent(records);
    expect(csv).toContain('Data;Moeda_Origem;Moeda_Destino;Cotacao');
    expect(csv).toContain('"2026-10-27";"USD";"BRL";"5.9358"');
  });

  it('deve retornar string vazia se o array de registros for vazio', () => {
    expect(generateCSVContent([])).toBe('');
  });

  it('deve gerar nome de arquivo padronizado e identificável', () => {
    const filename = getExportFilename('USD', 'BRL', '2026-10-27');
    expect(filename).toBe('cotacoes_USD_BRL_2026-10-27.csv');
  });
});
