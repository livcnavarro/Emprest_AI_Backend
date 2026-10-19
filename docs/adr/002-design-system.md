# ADR-002 — Design system

Fecha a linguagem visual da v1 do EMPREST.AI. Fonte: `docs/adr/layout.md` (arquivo congelado; este ADR extrai a decisão de design system). Front continua TypeScript + React (ADR-001).

## Decisões

| Item | Escolha |
| --- | --- |
| Linguagem visual | Nocturne: interface escura, densa; acento como linha e brilho, nunca preenchimento sólido de área grande |
| Marca | EMPREST.AI — `EMPREST` peso 700 + `.AI` no acento, `letter-spacing: 0.02em` (17px no login, 15px na barra) |
| Acento | `#2fb8ac` (teal), rampa 100→900 abaixo |
| Fundo / superfície / texto | `#161826` / `#232532` / `#e9e9ed` |
| Tipografia | Família única Raleway (Google Fonts, 400/500/600/700) em `--font-heading` e `--font-body` |
| Ícones | Phosphor Icons, quando houver ícone |
| Espaçamento | Escala Nocturne densidade 0.70×; flex/grid com `gap`; nunca margem entre irmãos |
| Raios | `--radius-sm` 4px · `--radius-md` 8px · `--radius-lg` 14px |
| Elevação | `--shadow-sm/md/lg` do Nocturne; nunca sombras empilhadas |
| Botão primário | Contorno 1px do acento sobre transparente |
| Vocabulário de componente | Classes do Nocturne (`.btn`, `.card`, `.nav`, `.dialog`, …) |
| Tokens | CSS custom properties `var(--*)`; override de `:root` (rampa teal + Raleway) sobre a folha do Nocturne |
| Motion | Só `fadeUp`; toast some em 2600ms |
| Copy | Português do Brasil; datas `DD/MM/AAAA`; tom direto, sem exclamações e sem emoji |

## Justificativa

- **Nocturne + marca** — o handoff de layout já reproduz essa base; o acento e a fonte é que passam a ser EMPREST.AI, o resto não se redesenha.
- **Acento como linha** — área grande pintada de teal vira marketing, não ferramenta operacional de TI.
- **Uma família e um acento** — segunda fonte ou segunda cor de marca vira outro sistema para manter.
- **Tokens em `var(--*)`** — o layout já lista os valores; implementação copia token, não paleta solta no componente.
- **Classes do Nocturne** — botão, card, campo, tabela e diálogo já têm nome; outro vocabulário diverge do handoff.
- **Phosphor** — é o que o layout cita; outro set de ícones muda peso e métrica da barra.
- **`fadeUp` só** — a interface é quieta; KPI, tabela e navegação não competem com o conteúdo.
- **pt-BR e data `DD/MM/AAAA`** — Operações e colaborador leem o mesmo formato da planilha que o PRD substitui.

## Alternativas descartadas

| Alternativa | Motivo do descarte |
| --- | --- |
| Tema claro | o handoff é ground escuro; segundo tema duplica tokens e contraste |
| Preto puro / branco puro | o layout proíbe; quebra o ground do Nocturne |
| Cinza nomeado para texto secundário | secundário é transparência sobre `--color-text` |
| Botão primário preenchido de acento | inundaria área; primário é contorno |
| Outra família (Inter, system-ui, serif) | Raleway já é heading e body |
| Outro set de ícones | Phosphor já está no layout |
| Sombra empilhada, escala no hover, parallax | o layout proíbe; a interface deixa de ser quieta |
| Animação em KPI, tabela ou navegação | só `fadeUp` em card, modal e toast |
| Copy com exclamação ou emoji | tom operacional do PRD |
| Paleta extra além de teal / âmbar / vermelho / cinza de situação | situação já tem quatro estados |

## Tokens

### Cor de base

| Token | Valor | Uso |
| --- | --- | --- |
| `--color-bg` | `#161826` | fundo de toda página |
| `--color-surface` | `#232532` | cards, tabela, modal, inputs |
| `--color-text` | `#e9e9ed` | texto principal |
| `--color-divider` | `color-mix(in srgb, #e9e9ed 16%, transparent)` | bordas e réguas |
| `--color-neutral-900` | `#292b31` | avatares neutros na tabela |

Rampa do acento:

```
100 #e6faf7 · 200 #c2f1eb · 300 #93e3da · 400 #5fcfc4
500 #2fb8ac (base) · 600 #26978e · 700 #1d746d · 800 #15534e · 900 #0f3733
```

Uso: 500 em bordas, linhas, ícones e números de destaque; 300 em texto de parágrafo sobre o fundo (contraste); 900 em preenchimento tintado (avatar, toast); 700 na borda desses preenchimentos.

Tints: `rgba(47,184,172,0.10)` chip ativo; `0.12` hover do primário e pill Disponível; `0.22` pressed.

### Situação

| Estado | Texto (`fg`) | Fundo (`bg`) | Borda (`bd`) |
| --- | --- | --- | --- |
| Disponível / Em dia | `#5fcfc4` | `rgba(47,184,172,0.12)` | `rgba(47,184,172,0.40)` |
| Emprestado / a vencer | `#c9a25f` | `rgba(201,162,95,0.12)` | `rgba(201,162,95,0.38)` |
| Em atraso / erro | `#e88b8b` | `rgba(200,90,90,0.14)` | `rgba(200,90,90,0.40)` |
| Em manutenção / inativo | `#9aa0ad` | `rgba(154,160,173,0.10)` | `rgba(154,160,173,0.30)` |

Banner de bloqueio por atraso: borda `#7a3b3b`, fundo `rgba(122,59,59,0.14)`, texto `#e88b8b`.

Texto secundário (opacidade sobre `--color-text`): 72% apoio · 70% label · 62% corpo de diálogo · 55% subtítulo/metadado · 45% kicker/patrimônio/dica de KPI · 40% rodapé.

### Tipo

Títulos peso 600, `line-height` ≈ 1.12, `letter-spacing: -0.015em`, `text-wrap: pretty` em título longo. Corpo peso 400, `line-height` 1.55.

| Elemento | Tamanho |
| --- | --- |
| H1 do login | 44px |
| H1 de tela interna | 30px |
| Número de KPI | 30px |
| H2 "Entrar" | 26px |
| Título de modal | 20px |
| Título de painel/seção | 17px |
| Título de card | 16.5px |
| Nome de item em lista | 16px |
| Subtítulo / lead do login | 14–16px |
| Corpo, célula, input, botão | 13.5–14px |
| Nota, metadado, chip | 12–13px |
| Kicker / cabeçalho de tabela | 11–11.5px, `letter-spacing: 0.08–0.09em`, uppercase |
| Micro-rótulo | 11–12px |

### Espaço, raio, controle

Escala: `2.8 · 5.6 · 8.4 · 11.2 · 16.8 · 22.4px`.

- Padding interno das telas: `36px 40px 64px`.
- Larguras máximas: Catálogo 1240px · Meus empréstimos 1000px · Operações 1320px · Equipamentos 1160px.
- Login: `64px 56px` nas colunas.
- Barra: altura 60px, padding lateral 40px, `gap: 32px` marca–abas.
- Card: padding 18px, `gap: 12px`. Grade: `repeat(auto-fill, minmax(292px, 1fr))`, `gap: 16px`.
- Linha de empréstimo: `18px 20px`, `gap: 20px`.
- KPI: 4 colunas, `gap: 14px`, padding `16px 18px`.
- Tabela: cabeçalho `12px 18px`, célula `13px 18px`.
- Modal: 420px, padding 26px.
- Cadastro: grade 2 colunas, `gap: 14px`; coluna de regras 300px.

Alturas: input/select/botão 36px (login 40px) · avatar 28px (26px na tabela) · pill `3px 9px`, `border-radius: 999px` · traços do limite de 3 itens: 5px.

Marca: quadrado 22–26px, borda 1.5px do acento, raio 6–7px, quadradinho 8–9px (raio 2px) ao centro.

Régua de seção: `height: 1px; background: linear-gradient(90deg, transparent, var(--color-divider) 48px, var(--color-divider) calc(100% - 48px), transparent)`.

Foco: `outline: 2px solid var(--color-accent); outline-offset: 2px`. Desabilitado: `opacity: .45` + `cursor: not-allowed`. Hover tintado do acento; pressed um passo além.

### Componentes (vocabulário)

- `.btn` + `.btn-primary` · `.btn-secondary` · `.btn-ghost` · `.btn-block`
- `.tag` + `.tag-outline`
- `.card` (+ `.card-kicker`, `.card-title`) e `.elev-sm/md/lg`
- `.field` + `label` + `.input` (`select`, `textarea`)
- `.radio` + `.dot`
- `.nav` + `.nav-brand`
- `.table`
- `.dialog-backdrop` + `.dialog` (`-title`, `-body`, `-actions`)

Aba ativa: `border-bottom: 2px solid var(--color-accent)`, texto 100%. Inativa: linha transparente, texto 55%. Aba altura 60px, padding lateral 14px, sem raio.

Toast: fixo `left: 50%` / `translateX(-50%)`, `bottom: 28px`, padding `12px 20px`, `border-radius: 999px`, fundo `--color-accent-900`, borda `--color-accent-700`, texto `--color-accent-200`, 13.5px.

Backdrop do modal: `rgba(10,11,18,0.68)`.

### Motion

```css
@keyframes fadeUp { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: none } }
```

Cards `fadeUp .25s ease both`. Modal `fadeUp .18s ease both` (backdrop sem animação). Toast `fadeUp .2s ease both`, some em 2600ms.

## Telas da v1

O desenho de cada página, a navegação por papel, as interações (solicitar, devolver, limite, atraso, manutenção, busca, cadastro) e os dados de exemplo ficam em `docs/adr/layout.md` §§5–9. Este ADR não reabre esses fluxos: a UI usa os tokens e o vocabulário acima para reproduzi-los.

Altura mínima das telas: 820px. Largura de referência: 1360–1440px.

## Consequências

**Fica mais fácil**

- cor, tipo e densidade têm um lugar só; tela nova copia token, não inventa hex.
- situação do equipamento (PRD) mapeia para as quatro pills.
- React (ADR-001) consome a mesma linguagem; não precisa de outra biblioteca visual para a v1 parecer o handoff.

**Fica mais difícil**

- componente fora do vocabulário Nocturne tem que ser reduzido a `.btn` / `.card` / `.dialog` / `.table` ou não entra.
- contraste do teal 500 em texto de parágrafo não basta: parágrafo usa 300.

**Impede de fazer depois sem custo**

- tema claro, segunda fonte ou primário preenchido: os tokens e os botões já nascem no escuro, Raleway e contorno.
- set de ícones diferente do Phosphor.

## O que este ADR NÃO decide

- ferramenta de CSS (folha única, CSS Modules, utilitários, etc.)
- biblioteca React de componentes (wrappers, headless, gerador de UI)
- build e dev server do front (ADR-001)
- roteamento no front (ADR-001); o layout descreve troca de tela na mesma janela, sem rotas aninhadas — isso não escolhe a biblioteca
- estado de servidor e de cliente no front (ADR-001); estado em memória do protótipo permanece receita em `layout.md` §10
- regras exatas de RLS e papel no banco (ADR-001); o layout só descreve o que cada papel vê na UI
- qualquer item que não está na tabela de decisões deste ADR
