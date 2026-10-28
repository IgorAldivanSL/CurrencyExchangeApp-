# Registro do Uso de Inteligência Artificial — AI_USAGE.md

Este documento registra a utilização de Inteligência Artificial generativa no ciclo de desenvolvimento do **Currency Exchange App (Hermes)**, em conformidade com as diretrizes acadêmicas e critérios de avaliação do projeto.

---

## 1. Ferramenta e Contexto de Utilização
- **Modelo Utilizado:** Gemini (Google DeepMind) via ambiente assistente de pair programming.
- **Papel Desempenhado:** Desenvolvedor Full Stack Sênior Master em regime de pair programming.
- **Objetivo da Assistência:** Acelerar a estruturação inicial (scaffolding), geração de documentação técnica padronizada, suporte na arquitetura de componentes React funcionais com CSS Modules, estruturação da coleção Postman e elaboração de testes automatizados com Vitest.

---

## 2. Áreas de Aplicação da IA no Projeto

### 2.1. Planejamento e Especificação Técnica
- **Apoio da IA:** Análise aprofundada dos documentos do briefing e da API Frankfurter v2.
- **Resultado Gerado:** Elaboração dos documentos `REQUIREMENTS.md`, `COMPONENTS.md` e `FIGMA.md`, mapeando requisitos funcionais, não funcionais, regras de negócio e a paleta editorial Hermes (#172A24, #175F49, #FDFDF8, #F4F6F4, #DCE4DF, #D2E2D7).

### 2.2. Integração com a API Frankfurter v2
- **Apoio da IA:** Análise da sintaxe dos endpoints `/v2/currencies`, `/v2/rate/{base}/{quote}`, `/v2/rates?from=...` e estratégias de agregação para grandes períodos (`group=month`).
- **Resultado Gerado:** Implementação do módulo `src/services/frankfurter.js` com tratamento gracioso de erros HTTP (422, 404, 500) e exportação da coleção JSON para o Postman (`postman/Frankfurter_API.postman_collection.json`).

### 2.3. Arquitetura de Componentes e Custom Hooks
- **Apoio da IA:** Refatoração da lógica de estado em hooks desacoplados:
  - `useCurrencies`: carregamento com cache em memória e fallback de emergência.
  - `useExchangeRate`: cálculo dinâmico de taxa e paridade 1.0 para mesma moeda.
  - `useHistoricalRates`: construção de intervalos de datas (7d a 10 anos) e estatísticas memoizadas (mínimo, máximo, média e variação percentual).
  - `useTableFilters`: filtros combinados de data/taxa e ordenação bidirecional.

### 2.4. Testes Automatizados e Qualidade
- **Apoio da IA:** Configuração do Vitest e criação de 20 casos de testes cobrindo funções puras, cálculos de arredondamento financeiro, sanitização de inputs e geração de CSV compatível com Microsoft Excel (BOM UTF-8).

---

## 3. Revisão e Validação Humana
Todas as soluções sugeridas pela IA foram submetidas aos seguintes critérios de validação:
1. **Conformidade com o Escopo:** Não foram incluídas tecnologias fora do escopo (sem backend complexo, sem banco de dados desnecessário).
2. **Execução Real dos Comandos:** Cada etapa foi compilada via `npm run build` e testada via `npm test` diretamente no ambiente Linux.
3. **Padrão Hermes Design Guide:** Garantia estrita de respeito às regras visuais do briefing (ausência de gradientes ou glassmorphism, tipografia Inter, paleta de cores oficial e suporte multilíngue PT/EN/ES).
4. **Histórico Git Incremental:** Os commits foram realizados de forma atômica e semântica, refletindo a evolução real da solução.
