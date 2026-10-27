# Documento de Requisitos — Currency Exchange App (Hermes)

## 1. Contexto do Projeto
Uma empresa de tecnologia financeira identificou que analistas, operadores e usuários corporativos perdem tempo consultando diferentes fontes não padronizadas, realizando conversões manuais e copiando cotações para planilhas. 

O **Currency Exchange App** é uma Single Page Application (SPA) construída em **React + Vite** que consome a **API pública Frankfurter v2**, centralizando a consulta de cotações de mais de 228 moedas, conversão monetária em tempo real, visualização de tendências históricas por gráfico e análise tabular com filtros, ordenação e exportação de dados em CSV.

---

## 2. Público-Alvo
- **Analistas financeiros e contábeis:** Precisam verificar taxas diárias oficiais e exportar dados filtrados para conciliação.
- **Profissionais de comércio exterior e e-commerce:** Necessitam calcular conversões rápidas de importação/exportação e acompanhar tendências de curto a longo prazo.
- **Usuários gerais e viajantes:** Precisam converter quantias entre moedas de forma transparente, com taxas claras e data de referência.

---

## 3. Objetivo
Entregar uma ferramenta web fluida, robusta e confiável que:
1. Permita converter valores instantaneamente entre moedas mundiais com precisão financeira.
2. Apresente o histórico das cotações em períodos de 7 dias até 10 anos em gráfico interativo.
3. Permita explorar os dados em tabela detalhada com múltiplos filtros combinados e ordenação por data ou taxa.
4. Possibilite o download dos dados filtrados em formato CSV para integração externa.
5. Siga rigorosamente o Design Guide **Hermes (Financial Clarity)** com suporte a internacionalização (PT, EN, ES).

---

## 4. Escopo do Produto

### 4.1. Dentro do Escopo (MVP e Entrega Completa)
- **Seleção de moedas:** Lista dinâmica de moedas ativas obtida via API Frankfurter v2 (`/v2/currencies`), exibindo código ISO (ex: USD, EUR, BRL) e nome descritivo.
- **Conversão de valores:**
  - Moeda de origem e destino configuráveis.
  - Botão de inversão rápida de moedas (Swap).
  - Cálculo automático ou sob demanda com validação de entradas inválidas (valores nulos, negativos ou strings não numéricas).
  - Exibição clara do valor convertido, taxa unitária aplicada e data da cotação.
- **Análise Histórica e Gráfico:**
  - Intervalos selecionáveis: **7 dias, 15 dias, 30 dias, 3 meses, 6 meses, 1 ano, 5 anos, 10 anos**.
  - Gráfico de linha interativo (Recharts) com tooltip detalhado, indicando valores mínimos, máximos e média do período.
  - Atualização automática e reativa ao trocar o par ou o período.
- **Tabela de Dados:**
  - Exibição tabular de Data, Moeda de Origem, Moeda de Destino e Cotação.
  - Filtro por período específico (Data Inicial e Data Final).
  - Filtro por intervalo de cotação (Cotação Mínima e Cotação Máxima).
  - Combinação dinâmica de todos os filtros.
  - Botão de limpeza rápida de filtros.
  - Ordenação ascendente e descendente por data ou por cotação.
  - Contador de registros encontrados vs. total.
- **Exportação CSV:**
  - Geração e download de arquivo `.csv` no navegador sem dependência de backend.
  - Exportação fiel aos dados atualmente filtrados na tabela.
  - Inclusão de cabeçalhos semânticos (`Data,Moeda_Origem,Moeda_Destino,Cotacao`).
  - Bloqueio de exportação caso a tabela esteja vazia, com feedback ao usuário.
  - Nome do arquivo padronizado: `cotacoes_[ORIGEM]_[DESTINO]_[DATA].csv`.
- **Experiência e Design:**
  - Design editorial Hermes (Paleta: Ink `#172A24`, Forest `#175F49`, Paper `#FDFDF8`, Surface `#F4F6F4`, Line `#DCE4DF`, Accent `#D2E2D7`).
  - Tipografia Inter (títulos 32px, corpo 15px, cotações 28px).
  - Grid de 8px e responsividade integral (Desktop, Tablet e Mobile).
  - Suporte a 3 idiomas: Português (BR), English (EN) e Español (ES).
  - Estados claros de Carregamento (Loading), Erro de Conexão/API e Ausência de Dados (Empty State).

### 4.2. Fora do Escopo
- Autenticação e controle de sessões de usuário.
- Banco de dados próprio ou backend intermediário.
- Pagamentos, checkout ou ordens de compra/venda de moedas.
- Negociação intraday de alta frequência (trading em tempo real com websocket).

---

## 5. Requisitos Funcionais (RF)

| ID | Descrição | Prioridade |
| :--- | :--- | :--- |
| **RF01** | O sistema deve listar todas as moedas suportadas pela API Frankfurter na inicialização. | Alta |
| **RF02** | O usuário deve poder selecionar uma moeda de origem e uma moeda de destino. | Alta |
| **RF03** | O usuário deve informar um valor numérico para conversão. | Alta |
| **RF04** | O sistema deve calcular o valor convertido utilizando a taxa mais recente obtida da API. | Alta |
| **RF05** | O sistema deve exibir a taxa utilizada (ex: 1 EUR = 1.1180 USD) e a data oficial da cotação. | Alta |
| **RF06** | O usuário deve poder inverter instantaneamente a moeda de origem e a moeda de destino. | Média |
| **RF07** | O sistema deve validar os campos de entrada, bloqueando valores negativos, zerados ou caracteres não numéricos. | Alta |
| **RF08** | O sistema deve carregar e renderizar o gráfico histórico para o par selecionado nos períodos: 7D, 15D, 30D, 3M, 6M, 1A, 5A e 10A. | Alta |
| **RF09** | O gráfico deve ser atualizado automaticamente caso o par de moedas ou o período seja alterado. | Alta |
| **RF10** | O sistema deve apresentar os dados do período em formato de tabela com colunas: Data, Origem, Destino e Cotação. | Alta |
| **RF11** | O usuário deve poder filtrar a tabela por intervalo de datas (De / Até). | Alta |
| **RF12** | O usuário deve poder filtrar a tabela por valor mínimo e máximo de cotação. | Alta |
| **RF13** | O sistema deve permitir a combinação simultânea dos filtros de data e cotação. | Alta |
| **RF14** | O sistema deve permitir limpar todos os filtros aplicados com um clique. | Média |
| **RF15** | O usuário deve poder ordenar os registros da tabela por Data (mais recente / mais antiga) e por Cotação (maior / menor). | Alta |
| **RF16** | O sistema deve indicar a quantidade exata de registros encontrados após a filtragem. | Média |
| **RF17** | O sistema deve permitir exportar os dados atualmente filtrados da tabela para formato CSV. | Alta |
| **RF18** | O arquivo CSV gerado deve conter cabeçalho legível e nome com o padrão `cotacoes_[BASE]_[QUOTE]_[DATA].csv`. | Alta |
| **RF19** | O sistema deve desabilitar o botão de exportação e emitir alerta se não houver registros a exportar. | Média |
| **RF20** | O usuário deve poder alternar o idioma da interface entre Português (PT), Inglês (EN) e Espanhol (ES). | Média |

---

## 6. Requisitos Não Funcionais (RNF)

| ID | Descrição | Categoria |
| :--- | :--- | :--- |
| **RNF01** | A aplicação deve ser desenvolvida em React utilizando Vite e componentes funcionais com Hooks. | Tecnologia |
| **RNF02** | O isolamento e organização de estilos deve ser feito estritamente com **CSS Modules** (`.module.css`). | Estilização |
| **RNF03** | A aplicação deve ser totalmente responsiva, funcionando perfeitamente em telas móveis (>=320px) e desktops (>=1440px). | Usabilidade |
| **RNF04** | O tempo de renderização inicial do dashboard não deve exceder 2 segundos em conexões 4G padrão. | Performance |
| **RNF05** | Erros de rede ou indisponibilidade da API devem ser tratados graciosamente, com mensagens de erro compreensíveis e opção de nova tentativa. | Resiliência |
| **RNF06** | A aplicação deve ser uma SPA sem recarregamentos completos da página durante filtros, ordenações ou conversões. | Arquitetura |
| **RNF07** | O código fonte deve respeitar convenções de código limpo, componentização modular, responsabilidade única e imutabilidade de estado. | Manutenibilidade |

---

## 7. Regras de Negócio (RN)

- **RN01 (Moedas Idênticas):** Se o usuário selecionar a mesma moeda para origem e destino (ex: USD para USD), a taxa resultante é obrigatoriamente `1.0000`, a conversão resulta no mesmo montante e o gráfico exibe linha de taxa estável sem erro.
- **RN02 (Validação de Valor):** Apenas valores numéricos positivos maiores que zero são elegíveis para conversão. Valores inválidos exibem mensagem explicativa e impedem cálculo com taxa indefinida.
- **RN03 (Arredondamento e Precisão):** A taxa de câmbio é exibida com até 4 casas decimais para maior precisão financeira. O valor convertido final é exibido com 2 casas decimais (ou 4 para moedas de cotação fracionária sensível).
- **RN04 (Comportamento em Fins de Semana / Feriados):** A API Frankfurter publica cotações apenas em dias úteis. Caso o intervalo englobe finais de semana, a tabela e o gráfico exibem apenas as datas oficiais com cotação divulgada pelos bancos emissores.
- **RN05 (Exportação Condicional):** O download de CSV só é habilitado caso haja pelo menos 1 registro correspondente aos filtros atuais.
- **RN06 (Sincronização de Filtros):** Ao trocar de par de moedas ou alterar o período histórico, os filtros manuais de cotação/data são reajustados para refletir a nova realidade da série temporal.

---

## 8. Critérios de Aceite

1. **Conversão Instantânea:**
   - Dado que o usuário escolhe `EUR` e `USD` e digita `100`;
   - Quando a taxa é obtida da API (ex: `1.1180`);
   - Então o valor convertido exibe `111.80 USD`, acompanhado do badge da taxa e da data de referência.

2. **Inversão de Moedas:**
   - Dado que o par atual é `EUR -> USD`;
   - Quando o usuário clica no botão inverter;
   - Então a origem se torna `USD`, o destino `EUR`, o valor é recalculado imediatamente e o gráfico é recarregado para o novo par.

3. **Validação de Entrada:**
   - Dado que o usuário digite `-50` ou deixe o campo vazio;
   - Então o sistema deve destacar o campo com borda de aviso e exibir a mensagem correspondente sem disparar requisições inválidas.

4. **Série Histórica e Períodos:**
   - Dado que o usuário selecione `1 ano`;
   - Então a requisição busca os últimos 365 dias, popula o gráfico com a curva de evolução e lista as cotações na tabela.

5. **Filtros e Contagem:**
   - Dado que o usuário informe uma cotação mínima de `1.10` e máxima de `1.15`;
   - Quando a tabela filtra os registros;
   - Então apenas linhas dentro da faixa são exibidas e o contador mostra "Exibindo X de Y registros".

6. **Exportação CSV:**
   - Dado que a tabela possua registros filtrados;
   - Quando o usuário clica em "Exportar CSV";
   - Então o arquivo `.csv` é baixado imediatamente pelo navegador com o delimitador correto e nome identificável.
