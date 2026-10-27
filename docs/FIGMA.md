# Especificações de Design e Wireframes (Figma) — Hermes Design System

Este documento reúne a especificação visual, o link de referência do projeto, wireframes de baixa fidelidade estruturados, protótipos de média fidelidade para Desktop e Mobile, e a definição dos estados da interface (Loading, Erro e Empty State).

---

## 1. Referência do Projeto no Figma
- **Link do Protótipo Figma:** [Figma — Currency Exchange App Hermes](https://www.figma.com/design/currency-exchange-hermes) *(Protótipo conceitual baseado no Design Guide Hermes - Financial Clarity)*
- **Direção de Arte:** Editorial, precisa, confiável e limpa. Ausência de gradientes exagerados, glassmorphism e sombras pesadas.
- **Grid:** 8px base (8, 16, 24, 32, 48px).

---

## 2. Design Guide Hermes

### 2.1. Paleta Cromática
| Token | Cor Hex | Uso |
| :--- | :--- | :--- |
| **Ink** | `#172A24` | Tipografia principal, títulos, bordas ativas e ícones escuros. |
| **Forest** | `#175F49` | Ações primárias, botões principais, linhas de destaque do gráfico. |
| **Paper** | `#FDFDF8` | Fundo principal da aplicação (tom editorial suave, não ofuscante). |
| **Surface** | `#F4F6F4` | Fundo de cartões, campos de entrada, tabela e seções elevadas. |
| **Line** | `#DCE4DF` | Linhas divisórias, bordas de cartões e inputs (1px sólida). |
| **Accent** | `#D2E2D7` | Tags de status selecionado, fundos secundários e foco suave. |

### 2.2. Tipografia
- **Família:** `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Título de Produto:** 32px / Semi Bold (Weight 600) / Line Height 1.2
- **Valores e Cotações:** 28px / Semi Bold (Weight 600) / Tabular Numbers
- **Subtítulos e Seções:** 18px a 20px / Medium (Weight 500)
- **Corpo e Textos Explicativos:** 14px a 15px / Regular (Weight 400) / Line Height 1.5
- **Metadados e Badges:** 12px / Medium (Weight 500) / Upper/Normal

---

## 3. Wireframes

### 3.1. Wireframe de Baixa Fidelidade (Desktop)
```
+-----------------------------------------------------------------------------------+
|  [H] HERMES / CURRENCY EXCHANGE APP                      Idioma: [ PT | EN | ES ] |
|  Inteligência de Câmbio e Séries Históricas Oficiais                              |
+-----------------------------------------------------------------------------------+
|  CONVERSOR DE MOEDAS                                                              |
|  +--------------------+      +------+      +--------------------+                 |
|  | Montante: [ 1000 ] |  ->  | [⇄]  |  ->  | Moeda Destino:     |                 |
|  | Moeda: [ USD ▼ ]   |      | Invert|     | [ BRL ▼ ]          |                 |
|  +--------------------+      +------+      +--------------------+                 |
|                                                                                   |
|  [ = 5.935,80 BRL ]              Taxa: 1 USD = 5.9358 BRL | Data: 27/10/2026      |
+-----------------------------------------------------------------------------------+
|  EVOLUÇÃO HISTÓRICA DO PAR                                                        |
|  Períodos: [ 7D ] [ 15D ] [ 30D ] [ 3M ] [ 6M ] [ 1A ] [ 5A ] [ 10A ]             |
|  Mínimo: 5.1200 | Máximo: 5.9500 | Média: 5.4310                                  |
|  +-----------------------------------------------------------------------------+  |
|  |  ..                                                                   /\    |  |
|  |  ..                                              /\                  /  \   |  |
|  |  ..                  /\          /\             /  \    /\          /    \  |  |
|  |  ..       /\        /  \        /  \           /    \  /  \        /        |  |
|  |  ..______/  \______/    \______/    \_________/      \/    \______/         |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
|  TABELA DE COTAÇÕES HISTÓRICAS                                                    |
|  Filtros: De: [ YYYY-MM-DD ] Até: [ YYYY-MM-DD ] | Min: [ 0.0 ] Max: [ 10.0 ]    |
|  [ Limpar Filtros ]             42 registros encontrados       [ Exportar CSV ]   |
|  +-----------------------------------------------------------------------------+  |
|  | Data (▼)    | Origem   | Destino  | Cotação (▲)                             |  |
|  +-------------+----------+----------+-----------------------------------------+  |
|  | 2026-10-27  | USD      | BRL      | 5.9358                                  |  |
|  | 2026-10-26  | USD      | BRL      | 5.9210                                  |  |
|  | 2026-10-25  | USD      | BRL      | 5.9180                                  |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

---

### 3.2. Proposta de Adaptação Mobile (320px - 480px)
No mobile, os blocos fluem verticalmente em coluna única com espaçamento de 16px e alvos de toque mínimos de 44px:
- **Header:** Logotipo e seletor de idiomas reorganizados em linha flex com quebra suave.
- **Conversor:** O campo de Montante e Moeda de Origem fica no topo, o botão de Inverter centralizado entre os blocos, e o campo de Destino logo abaixo, seguido pelo cartão de resultado destacado.
- **Gráfico:** Botões de período dispostos em carrossel horizontal de rolagem suave ou grade compacta de 4x2 botões. Gráfico com altura fixa de 260px e labels de data resumidos.
- **Tabela:** Filtros em formulário sanfonado (accordion) ou grade de 2 colunas para campos numéricos/datas. A tabela ganha scroll horizontal suave mantendo alinhamento numérico à direita. Botão "Exportar CSV" ganha largura total (full-width) com ícone de download.

---

## 4. Estados de Interface (UX / UI Specs)

### 4.1. Estado de Carregamento (Loading State)
- **Conversão de taxa:** Spinner minimalista no tom `#175F49` e texto sutil "Obtendo cotação mais recente...".
- **Gráfico:** Container com altura fixa, background `#F4F6F4`, skeleton suave com pulso sutil e spinner centralizado com a mensagem "Carregando série temporal...".
- **Tabela:** Linhas esmaecidas com indicador visual de sincronização sem travamento da página.

### 4.2. Estado de Erro (Error State)
- **Banner de Erro:** Card estruturado com borda `#DCE4DF`, ícone de alerta em tom terracota suave, título explicativo e botão de ação ("Tentar novamente").
- **Validação de Entrada:** Borda vermelha pontual (`#D9534F`) no input de montante com mensagem direta: "Informe um valor numérico válido maior que zero."

### 4.3. Estado de Ausência de Dados (Empty State)
- Ocorre quando a combinação de filtros de data e cotação não retorna nenhum registro.
- **Apresentação:**
  - Ícone de lupa/calendário com traço editorial.
  - Título: "Nenhuma cotação encontrada para os filtros aplicados."
  - Sugestão: "Tente ampliar o intervalo de datas ou ajustar as cotações mínima e máxima."
  - Botão de ação: "Limpar todos os filtros", que redefine os parâmetros aos valores padrão com 1 clique.
