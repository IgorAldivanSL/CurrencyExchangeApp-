# Investigação e Testes de Endpoints — API Frankfurter v2

Este documento documenta os testes de integração e validação realizados contra a **API pública Frankfurter v2** (`https://api.frankfurter.dev/v2`), cobrindo endpoints de moedas, cotações em tempo real, séries históricas, tratamento de erros e respostas em feriados/fins de semana.

---

## 1. Visão Geral da API Frankfurter v2

- **URL Base:** `https://api.frankfurter.dev/v2`
- **Autenticação:** Não exige chave de API (Open Source, sem cotas fixas, com rate limiting de segurança).
- **Fontes de dados:** Mais de 106 bancos centrais e fontes monetárias oficiais (ex: Banco Central Europeu - ECB, Banco Central do Brasil - BCB, etc.).
- **Moedas suportadas:** Mais de 228 moedas ativas com dados históricos retroativos.

---

## 2. Matriz de Endpoints Testados

| Método | Endpoint | Descrição | Status HTTP |
| :--- | :--- | :--- | :--- |
| `GET` | `/v2/currencies` | Lista todas as moedas disponíveis e seus metadados (código ISO, símbolo e nome). | `200 OK` |
| `GET` | `/v2/rate/{base}/{quote}` | Obtém a cotação pontual mais recente para um par específico. | `200 OK` |
| `GET` | `/v2/rates?base={base}&quotes={quotes}` | Obtém a taxa mais recente com base e destinos customizados. | `200 OK` |
| `GET` | `/v2/rates?base={base}&quotes={quote}&from={date}&to={date}` | Consulta a série temporal entre duas datas para o par escolhido. | `200 OK` |
| `GET` | `/v2/rates?base={base}&quotes={quote}&from={date}&group={group}` | Consulta série temporal histórica agrupada por `week` ou `month`. | `200 OK` |
| `GET` | `/v2/rate/INVALID/USD` | Teste de moeda inexistente ou inválida. | `422 Unprocessable Entity` |
| `GET` | `/v2/rate/{base}/{base}` | Conversão de moeda idêntica (ex: USD para USD). | `200 OK` (retorna `rate: 1.0`) |

---

## 3. Detalhamento dos Testes Executados

### 3.1. Listagem de Moedas
- **Requisição:** `GET https://api.frankfurter.dev/v2/currencies`
- **Exemplo de Resposta:**
```json
[
  {
    "iso_code": "USD",
    "iso_numeric": "840",
    "name": "United States Dollar",
    "symbol": "$",
    "start_date": "1999-01-04"
  },
  {
    "iso_code": "BRL",
    "iso_numeric": "986",
    "name": "Brazilian Real",
    "symbol": "R$",
    "start_date": "1999-01-04"
  },
  {
    "iso_code": "EUR",
    "iso_numeric": "978",
    "name": "Euro",
    "symbol": "€",
    "start_date": "1999-01-01"
  }
]
```
- **Validação:** A API retorna um array de objetos contendo `iso_code`, `name` e `symbol`. Perfeito para popular os seletores de moeda (`<select>`).

---

### 3.2. Cotação Pontual (Par de Moedas)
- **Requisição:** `GET https://api.frankfurter.dev/v2/rate/USD/BRL`
- **Exemplo de Resposta:**
```json
{
  "date": "2026-10-27",
  "base": "USD",
  "quote": "BRL",
  "rate": 5.9358
}
```
- **Comportamento Validado:**
  - `date`: Data oficial de fechamento da taxa pelo banco emissor.
  - `base`: Moeda de origem.
  - `quote`: Moeda de destino.
  - `rate`: Valor numérico da cotação com precisão decimal.

---

### 3.3. Histórico por Intervalo de Datas
- **Requisição:** `GET https://api.frankfurter.dev/v2/rates?base=USD&quotes=BRL&from=2026-10-01&to=2026-10-27`
- **Exemplo de Resposta:**
```json
[
  {
    "date": "2026-10-01",
    "base": "USD",
    "quote": "BRL",
    "rate": 5.1915
  },
  {
    "date": "2026-10-02",
    "base": "USD",
    "quote": "BRL",
    "rate": 5.2097
  },
  {
    "date": "2026-10-05",
    "base": "USD",
    "quote": "BRL",
    "rate": 5.1100
  }
]
```
- **Observações de Negócio:**
  - A API omite finais de semana (sábados e domingos) pois os mercados cambiais estão fechados.
  - O formato em array ordenado cronologicamente facilita o consumo direto tanto pelo componente de gráfico quanto pela tabela.

---

### 3.4. Histórico Agrupado (Grandes Períodos: 5 Anos e 10 Anos)
- **Requisição:** `GET https://api.frankfurter.dev/v2/rates?base=EUR&quotes=USD&from=2016-10-01&group=month`
- **Exemplo de Resposta:**
```json
[
  {
    "date": "2016-10-01",
    "base": "EUR",
    "quote": "USD",
    "rate": 1.0975
  },
  {
    "date": "2016-11-01",
    "base": "EUR",
    "quote": "USD",
    "rate": 1.0620
  }
]
```
- **Vantagem de Performance:** Permite carregar 10 anos de histórico em apenas 120 pontos de dados, garantindo resposta quase instantânea e renderização ultra rápida do gráfico sem perda de precisão da tendência histórica.

---

### 3.5. Tratamento de Erros e Casos de Borda
- **Moeda Desconhecida:**
  - Requisição: `GET https://api.frankfurter.dev/v2/rate/XYZ/USD`
  - Resposta: `HTTP 422 Unprocessable Entity`
  - Body: `{"status": 422, "message": "invalid currency: XYZ"}`
  - Tratamento no App: O serviço captura o status, lê o JSON de erro e exibe uma mensagem amigável ao usuário.

- **Moedas Iguais (Base == Quote):**
  - Requisição: `GET https://api.frankfurter.dev/v2/rate/USD/USD`
  - Resposta: `{"date": "2026-10-27", "base": "USD", "quote": "USD", "rate": 1.0}`
  - Tratamento no App: Suportado nativamente pela API e com fallback local para taxa 1.0 sem necessidade de requisição redundante.

- **Offline / Falha de Conexão:**
  - Tratamento no App: Bloco `try/catch` no serviço lança erro capturado pelo hook, exibindo o `ErrorBanner` com botão de nova tentativa.
