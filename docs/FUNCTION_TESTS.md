# Testes das Funções JavaScript — Currency Exchange App

Este documento detalha os testes unitários e de integração das funções puras de JavaScript do projeto, cobrindo validações de entrada, formatações financeiras, cálculos de conversão, manipulação de datas, lógica de filtragem/ordenação e geração de CSV.

Os testes foram implementados com **Vitest** e podem ser executados com o comando:
```bash
npm test
```

---

## 1. Resumo da Execução dos Testes

- **Total de Suítes de Teste:** 2 arquivos (`utils.test.js`, `filters.test.js`)
- **Total de Testes:** 20 testes
- **Status:** 20 aprovados (100% de sucesso)
- **Tempo de Execução:** ~430ms

---

## 2. Detalhamento dos Testes por Módulo

### 2.1. Manipulação e Validação de Datas (`src/utils/date.js`)

| Caso de Teste | Entrada | Resultado Esperado | Status |
| :--- | :--- | :--- | :--- |
| Cálculo de data retroativa (7 dias) | `getPastDate(7, new Date(2026, 9, 27))` | `'2026-10-20'` | Aprovado |
| Validação de data ISO válida | `isValidDate('2026-10-27')` | `true` | Aprovado |
| Validação de ano bissexto | `isValidDate('2026-02-28')` | `true` | Aprovado |
| Rejeição de string arbitrária | `isValidDate('invalido')` | `false` | Aprovado |
| Rejeição de mês/dia inexistente | `isValidDate('2026-13-45')` | `false` | Aprovado |
| Formatação localizada (pt-BR) | `formatDateLocale('2026-10-27', 'pt-BR')` | `'27/10/2026'` | Aprovado |

---

### 2.2. Formatadores e Cálculos Financeiros (`src/utils/formatters.js`)

| Caso de Teste | Entrada | Resultado Esperado | Status |
| :--- | :--- | :--- | :--- |
| Conversão monetária básica | `calculateConvertedValue(100, 5.5)` | `550` | Aprovado |
| Conversão decimal com 4 casas | `calculateConvertedValue(10, 1.118)` | `11.18` | Aprovado |
| Proteção contra valor negativo | `calculateConvertedValue(-50, 5.5)` | `0` | Aprovado |
| Proteção contra entrada não numérica | `calculateConvertedValue('abc', 5.5)` | `0` | Aprovado |
| Formatação de cotação com 4 decimais | `formatRate(5.9358, 'pt-BR')` | `'5,9358'` | Aprovado |
| Formatação de variação positiva | `formatPercentage(2.45)` | `'+2.45%'` | Aprovado |
| Formatação de variação negativa | `formatPercentage(-1.12)` | `'-1.12%'` | Aprovado |
| Formatação de variação neutra | `formatPercentage(0)` | `'0.00%'` | Aprovado |

---

### 2.3. Validação e Sanitização de Entradas (`src/utils/validation.js`)

| Caso de Teste | Entrada | Resultado Esperado | Status |
| :--- | :--- | :--- | :--- |
| Aceitação de valor numérico válido | `validateAmount(150.5)` | `{ isValid: true, value: 150.5 }` | Aprovado |
| Normalização de separador decimal vírgula | `validateAmount('250,75')` | `{ isValid: true, value: 250.75 }` | Aprovado |
| Rejeição de valor zero | `validateAmount(0)` | `{ isValid: false }` | Aprovado |
| Rejeição de valor negativo | `validateAmount(-10)` | `{ isValid: false }` | Aprovado |
| Rejeição de string vazia | `validateAmount('')` | `{ isValid: false }` | Aprovado |
| Sanitização de máscara monetária | `sanitizeNumericInput('R$ 1.500,50')` | `'1.500,50'` | Aprovado |

---

### 2.4. Lógica de Filtros e Ordenação da Tabela (`src/hooks/useTableFilters.js`)

| Caso de Teste | Critérios Aplicados | Registros Esperados | Status |
| :--- | :--- | :--- | :--- |
| Filtro por intervalo de datas | `startDate: 2026-10-05, endDate: 2026-10-20` | 3 registros encontrados | Aprovado |
| Filtro por limites de cotação | `minRate: 5.25, maxRate: 5.85` | 3 registros dentro do intervalo | Aprovado |
| Combinação simultânea de filtros | Data + Taxa mínima + Taxa máxima | 2 registros correspondentes | Aprovado |
| Ordenação descendente por taxa | `sortField: 'rate', sortDirection: 'desc'` | 1º: 5.95 ... Último: 5.10 | Aprovado |
| Comportamento em ausência de dados | `minRate: 10.00` | 0 registros (ativa EmptyState) | Aprovado |

---

### 2.5. Exportação de Dados em CSV (`src/utils/csv.js`)

| Caso de Teste | Entrada | Resultado Esperado | Status |
| :--- | :--- | :--- | :--- |
| Geração de cabeçalhos e linhas CSV | 2 objetos de taxas | Cabeçalho `Data;Moeda_Origem;Moeda_Destino;Cotacao` com aspas | Aprovado |
| Proteção contra exportação vazia | `[]` (array vazio) | Retorna string vazia / `exportToCSV` retorna `false` | Aprovado |
| Padronização de nome de arquivo | `base='USD', quote='BRL', date='2026-10-27'` | `'cotacoes_USD_BRL_2026-10-27.csv'` | Aprovado |
