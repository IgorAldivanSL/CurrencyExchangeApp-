# HERMES — Currency Exchange App

> Single Page Application (SPA) para conversão de moedas, consulta de cotações em tempo real e análise de séries históricas oficiais utilizando a **API pública Frankfurter v2**.

Projeto desenvolvido com base no **Hermes Design Guide (Financial Clarity)**, priorizando precisão editorial, usabilidade fluida, alta performance e separação clara de responsabilidades com componentes funcionais em React e **CSS Modules**.

---

## 📸 Demonstração da Interface

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  [H] HERMES                                                   Idioma: [ PT | EN | ES ] │
│  Inteligência de Câmbio & Séries Históricas Oficiais                                  │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  CONVERSOR DE MOEDAS                                                                   │
│  Valor a converter: [ 1000        ]   Moeda Origem: [ USD ▼ ]                          │
│                                           [ ⇄ Inverter ]                               │
│                                       Moeda Destino: [ BRL ▼ ]                         │
│                                                                                        │
│  VALOR CONVERTIDO                                                                      │
│  R$ 5.935,80 BRL                      Taxa: 1 USD = 5,9358 BRL                         │
│                                       Data da cotação: 27/10/2026                      │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  EVOLUÇÃO HISTÓRICA DO PAR (USD/BRL)                                                   │
│  Períodos: [ 7 Dias ] [ 15 Dias ] [ 30 Dias ] [ 3M ] [ 6M ] [ 1A ] [ 5A ] [ 10A ]     │
│                                                                                        │
│  MÍNIMO: 5,1200   │   MÁXIMO: 5,9500   │   MÉDIA: 5,4310   │   VARIAÇÃO: +15,20%   │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │   5.9 ─                                                            ╭───╮         │  │
│  │   5.5 ─                                   ╭─────────╮             ╭╯   ╰─        │  │
│  │   5.2 ─         ╭────────╮       ╭────────╯         ╰─────────────╯              │  │
│  │   4.9 ──────────╯        ╰───────╯                                               │  │
│  │       01 Out           08 Out           15 Out           22 Out           27 Out │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  TABELA DE COTAÇÕES DETALHADA                                                          │
│  De: [ YYYY-MM-DD ]  Até: [ YYYY-MM-DD ]  Mín: [ 0.00 ]  Máx: [ 10.00 ]  [ Limpar ]    │
│  21 registro(s) encontrado(s) de um total de 21                    [ ↓ Exportar CSV ]  │
│                                                                                        │
│  DATA (▼)           ORIGEM          DESTINO         COTAÇÃO (▲)                        │
│  27/10/2026         USD             BRL             5,9358                             │
│  26/10/2026         USD             BRL             5,9210                             │
│  25/10/2026         USD             BRL             5,9180                             │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Funcionalidades

### 1. Conversor de Moedas
- **Seleção Dinâmica:** Lista completa de moedas oficiais sincronizada diretamente da Frankfurter API (`/v2/currencies`).
- **Inversão Rápida (Swap):** Permite inverter moeda de origem e destino com um clique, recalculando imediatamente a taxa e o histórico.
- **Validação Financeira:** Impede valores negativos, nulos ou strings inválidas com feedback instantâneo.
- **Tratamento de Mesma Moeda:** Paridade automática de `1.0000` quando origem e destino são iguais.
- **Precisão Editorial:** Exibição da taxa unitária oficial e da data de referência com até 4 casas decimais.

### 2. Gráfico de Evolução Histórica (Recharts)
- **8 Períodos Disponíveis:** `7 Dias`, `15 Dias`, `30 Dias`, `3 Meses`, `6 Meses`, `1 Ano`, `5 Anos` e `10 Anos`.
- **Otimização de Granularidade:** Agrupamento mensal automático (`group=month`) para 5 e 10 anos, gerando visualização fluida e carregamento instantâneo.
- **Métricas Analíticas:** Exibição instantânea de Cotação Mínima, Máxima, Média e Variação percentual do período selecionado.
- **Tooltip Personalizado:** Apresenta a data oficial e o valor com precisão ao passar o cursor pelos pontos.

### 3. Tabela de Dados & Filtros Combinados
- **Colunas:** Data, Moeda de Origem, Moeda de Destino e Cotação.
- **Filtro por Intervalo de Datas:** Campos De (data inicial) e Até (data final).
- **Filtro por Faixa de Cotação:** Campos de valor Mínimo e Máximo.
- **Combinação e Reset:** Filtros trabalham de forma sinérgica e contam com botão rápido de "Limpar Filtros".
- **Ordenação Bidirecional:** Clique nos cabeçalhos para ordenar por Data (recente/antiga) ou Cotação (maior/menor).
- **Contador de Registros:** Indica quantos registros estão visíveis frente ao total do período.

### 4. Exportação em CSV
- Exporta **exclusivamente os registros resultantes dos filtros ativos**.
- Inclui cabeçalho semântico e delimitador compatível com o Microsoft Excel (`UTF-8 com BOM`).
- Proteção automática contra exportação vazia.
- Nome padronizado: `cotacoes_[ORIGEM]_[DESTINO]_[DATA].csv`.

### 5. Internacionalização (i18n)
- Suporte completo a 3 idiomas: **Português (BR)**, **Inglês (EN)** e **Espanhol (ES)**.
- Formatação numérica e de datas adaptada ao locale selecionado, mantendo a padronização dos códigos ISO 4217 das moedas.

---

## 🛠️ Tecnologias Utilizadas

- **React 19** + **JSX** (Componentes funcionais com Hooks).
- **Vite** (Build tool e servidor de desenvolvimento ultra veloz).
- **CSS Modules** (`.module.css`) para escopo fechado e sem vazamento de estilos.
- **Recharts** (Biblioteca de visualização gráfica responsiva e componível).
- **Lucide React** (Ícones SVG limpos e padronizados).
- **Vitest** (Suíte moderna de testes unitários para funções JavaScript).
- **Frankfurter API v2** (Dados cambiais oficiais de bancos centrais abertos e sem chave).

---

## 📁 Estrutura do Projeto

```
CurrencyExchangeApp-/
├── docs/                               # Documentação técnica obrigatória
│   ├── REQUIREMENTS.md                 # Requisitos funcionais, regras de negócio e critérios
│   ├── COMPONENTS.md                   # Arquitetura, props, estados e lifting state up
│   ├── FIGMA.md                        # Wireframes, layout editorial e design guide
│   ├── API_TESTS.md                    # Investigação detalhada dos endpoints Frankfurter v2
│   ├── FUNCTION_TESTS.md               # Especificação dos testes das funções JavaScript
│   └── AI_USAGE.md                     # Registro detalhado do uso de IA no desenvolvimento
├── postman/
│   └── Frankfurter_API.postman_collection.json # Coleção Postman v2.1 exportada
├── src/
│   ├── assets/                         # Imagens e ativos estáticos
│   ├── components/
│   │   ├── Common/                     # Componentes de feedback (Loading, Error, Empty)
│   │   ├── CurrencyConverter/          # Card do conversor de moedas
│   │   ├── Header/                     # Topbar com logo Hermes e troca de idioma
│   │   ├── HistoricalChart/            # Seletor de período, métricas e Recharts
│   │   └── RatesTable/                 # Filtros, ordenação, tabela e exportador CSV
│   ├── constants/
│   │   ├── periods.js                  # Definição dos 8 intervalos temporais
│   │   └── translations.js             # Dicionário de tradução PT / EN / ES
│   ├── hooks/                          # Custom Hooks reutilizáveis
│   │   ├── useCurrencies.js            # Busca de moedas com cache e fallback
│   │   ├── useExchangeRate.js          # Busca da taxa atual pontual
│   │   ├── useHistoricalRates.js       # Busca de histórico e cálculo de métricas
│   │   └── useTableFilters.js          # Lógica combinada de filtros e ordenação
│   ├── services/
│   │   └── frankfurter.js              # Camada de comunicação com a API Frankfurter
│   ├── utils/
│   │   ├── __tests__/                  # Testes unitários com Vitest
│   │   │   ├── filters.test.js
│   │   │   └── utils.test.js
│   │   ├── csv.js                      # Geração e disparo de download do CSV
│   │   ├── date.js                     # Cálculos e formatação de datas
│   │   ├── formatters.js               # Formatações monetárias e cálculos
│   │   └── validation.js               # Validação e sanitização de dados
│   ├── App.jsx                         # Orquestrador da SPA
│   ├── App.module.css                  # Estilos do layout principal
│   ├── index.css                       # Design tokens Hermes e reset CSS
│   └── main.jsx                        # Ponto de entrada React 19
├── index.html                          # Template HTML com fonte Inter
├── package.json                        # Dependências e scripts npm
├── vite.config.js                      # Configuração do Vite e Vitest
└── README.md                           # Documento principal
```

---

## ⚙️ Instalação e Execução

### Pré-requisitos
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### Passos de Instalação

1. Clone o repositório:
```bash
git clone https://github.com/IgorAldivanSL/CurrencyExchangeApp-.git
cd CurrencyExchangeApp-
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```
Acesse `http://localhost:3000` (ou a porta informada no terminal).

4. Para rodar a suíte de testes unitários:
```bash
npm test
```

5. Para gerar o build de produção:
```bash
npm run build
```

---

## 🧪 Coleção do Postman

A coleção com todas as requisições de teste da API Frankfurter v2 está disponível em:
👉 [`postman/Frankfurter_API.postman_collection.json`](postman/Frankfurter_API.postman_collection.json)

**Como importar no Postman:**
1. Abra o Postman.
2. Clique no botão **Import** (canto superior esquerdo).
3. Selecione o arquivo `postman/Frankfurter_API.postman_collection.json`.
4. Os testes estão prontos para execução com variáveis de ambiente configuradas.

---

## ✅ Checklist de Validação dos Requisitos

- [x] Conversão entre duas moedas
- [x] Inversão rápida das moedas (Swap)
- [x] Atualização automática dos dados ao alterar o par
- [x] Todos os 8 períodos históricos (7d, 15d, 30d, 3m, 6m, 1y, 5y, 10y)
- [x] Gráfico interativo com dados reais e métricas analíticas
- [x] Tabela de dados com colunas mínimas (data, origem, destino, cotação)
- [x] Filtros individuais e combinados de data e valor de cotação
- [x] Botão de limpeza rápida de filtros
- [x] Ordenação ascendente e descendente por data e por cotação
- [x] Exibição da quantidade de registros encontrados
- [x] Exportação de CSV com dados filtrados, cabeçalhos e download no browser
- [x] Bloqueio e feedback para exportação vazia
- [x] Validação de entradas inválidas e tratamento de mesma moeda
- [x] Tratamento de estados de Loading, Erro e Empty State
- [x] Responsividade para dispositivos móveis e desktops
- [x] Suporte multilíngue (Português, Inglês e Espanhol)
- [x] 100% de aprovação nos testes automatizados (20/20)
- [x] Histórico de commits incremental e semântico

---

## 🎨 Design Guide Hermes (Financial Clarity)

O projeto segue as diretrizes do guia Hermes:
- **Ink (`#172A24`):** Tipografia principal e elementos de alto contraste.
- **Forest (`#175F49`):** Ações primárias, botões e traços do gráfico.
- **Paper (`#FDFDF8`):** Fundo editorial confortável para leitura contínua.
- **Surface (`#F4F6F4`):** Superfície de cartões, formulários e tabela.
- **Line (`#DCE4DF`):** Bordas de 1px para delimitação precisa.
- **Accent (`#D2E2D7`):** Destaque sutil e foco ativo.

---

## 📄 Licença e Autoria
Desenvolvido por **Igor Aldivan** como parte da avaliação prática do módulo Front-End SPA.
Base de dados pública fornecida por [Frankfurter API](https://api.frankfurter.dev/v2).
