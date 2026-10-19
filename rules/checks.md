# Checks do projeto

Use este arquivo para conferir o trabalho antes de dar por pronto.
Fontes: `AGENTS.md`, `rules/restrictions.md`, `docs/adr/prd.md`, `docs/adr/001-stack.md`, `docs/adr/layout.md`.
Não use `docs/adr/stacks.md` como critério.

---

## 1. Este repositório (todo entrega)

- [ ] Não há código de produto neste repo.
- [ ] `docs/adr/prd.md`, `docs/adr/001-stack.md`, `docs/adr/stacks.md` e `docs/adr/layout.md` não foram alterados.
- [ ] Arquivo novo de decisão está em `docs/adr/`, com número seguinte ao último ADR (`002-…`, `003-…`).
- [ ] Nada que o ADR-001 marca como não decidido foi escolhido sem pergunta.
- [ ] Nada que só existe em `stacks.md` foi tratado como decisão fechada.
- [ ] Se a decisão de stack ou produto fechou na conversa, o arquivo do ADR foi gravado em `docs/adr/`.
- [ ] Pedido de código de produto ou de edição de arquivo congelado foi recusado (repo só docs / arquivo não se edita), com sugestão de ADR se for decisão de stack.

---

## 2. ADR novo

- [ ] É coerente com o PRD (`docs/adr/prd.md`).
- [ ] É coerente com o layout (`docs/adr/layout.md`).
- [ ] É coerente com a tabela de decisões do ADR-001.
- [ ] Não reabre alternativas descartadas no ADR-001 (Vercel, Railway, Fly.io; Vue, Angular, Svelte; JavaScript puro; Express, Fastify; TypeORM, Knex, Drizzle; Joi, Yup; Auth0, Clerk; MySQL, MongoDB; GraphQL, tRPC; código sem camadas; Vitest; migration na mão / SQL solto).
- [ ] Não coloca na v1: reserva com data futura, notificação por e-mail, importação da planilha.
- [ ] Não contradiz: host Supabase; front TypeScript + React; back TypeScript + Nest; ORM Prisma + ZOD; autenticação RLS; autorização Supabase; banco Postgres (Supabase); API REST + MVC; testes Jest + Migration.
- [ ] RLS continua no banco, não como checagem espalhada na API.
- [ ] Mudança de schema, se o ADR falar nisso, anda por migration versionada.

---

## 3. Produto v1 (PRD)

Conferir se o texto (ADR ou descrição) cobre só isto, e isto por inteiro:

- [ ] Login; cada pessoa vê os próprios empréstimos.
- [ ] Catálogo com a situação de cada equipamento.
- [ ] Solicitar empréstimo de item disponível.
- [ ] Devolver item que está com a pessoa.
- [ ] Tela de Operações com todos os empréstimos em aberto.
- [ ] Colaborador: catálogo, pedir, devolver.
- [ ] Operações: cadastrar equipamentos, ver quem está com o quê, registrar devolução no balcão.
- [ ] Máximo de 3 itens por pessoa ao mesmo tempo.
- [ ] Prazo padrão de 14 dias.
- [ ] Item em atraso impede novo empréstimo.
- [ ] Equipamento em manutenção não aparece como disponível.
- [ ] Equipamentos no problema do PRD: notebooks, monitores, cabos, câmeras.

---

## 4. Layout e interação (o que um ADR de UI/produto precisa respeitar)

- [ ] Marca EMPREST.AI; interface escura Nocturne; acento `#2fb8ac` como linha/brilho, não preenchimento de área grande.
- [ ] Tokens: fundo `#161826`, superfície `#232532`, texto `#e9e9ed`.
- [ ] Sem preto puro e sem branco puro.
- [ ] Texto secundário por transparência sobre `--color-text`, sem cinza novo.
- [ ] Botão primário: contorno 1px sobre transparente.
- [ ] Situação: disponível/em dia teal; emprestado/a vencer âmbar; atraso/erro vermelho; manutenção/inativo cinza.
- [ ] Tipografia só Raleway 400/500/600/700.
- [ ] Interface em pt-BR; datas `DD/MM/AAAA`; copy sem exclamações e sem emoji.
- [ ] Espaçamento por `gap` em flex/grid, não margem entre irmãos.
- [ ] Sem sombras empilhadas.
- [ ] Colaborador: abas Catálogo, Meus empréstimos.
- [ ] Operações: Catálogo, Operações, Equipamentos, Meus empréstimos.
- [ ] Login "Entrar" → Catálogo (Colaborador); "Entrar como Operações" → Operações; "Sair" → Login.
- [ ] Troca de tela na mesma janela; layout sem rotas aninhadas e sem modais empilhados (roteador de framework continua não decidido no ADR-001).
- [ ] Solicitar: modal com devolução = hoje + 14 dias; item emprestado; toast.
- [ ] Devolver (colaborador ou balcão): item disponível de novo; toast.
- [ ] 3 itens: solicitar desabilitado, rótulo "Limite de 3 itens".
- [ ] Atraso: "Bloqueado por atraso" e banner no catálogo.
- [ ] Manutenção: "Indisponível" desabilitado; nunca disponível.
- [ ] Cadastro: nome obrigatório; categorias Notebook, Monitor, Cabo, Câmera, Acessório; situação inicial Disponível ou Em manutenção.
- [ ] Visão completa de empréstimos só em Operações.
- [ ] Animação só `fadeUp` em cards, modal e toast; toast some em 2600ms; sem animação em KPI, tabela ou navegação; sem escala, sombra pulsante ou parallax.
- [ ] Ícones, se houver: Phosphor Icons.

---

## 5. Não decidido (falha o check se o artefato “fecha” isto sozinho)

- [ ] Build e dev server do front
- [ ] Roteamento no front (biblioteca)
- [ ] Estado de servidor e de cliente no front
- [ ] Estilização e biblioteca de componentes
- [ ] Regras exatas de RLS e autorização por papel
- [ ] CI/CD
- [ ] Observabilidade / logs
- [ ] Backup e recuperação
- [ ] Modelagem de domínio e tabelas
- [ ] Qualquer item fora da tabela do ADR-001

---

## 6. Fora da v1 (falha o check se entrar no escopo)

- [ ] Reserva com data futura
- [ ] Notificação por e-mail
- [ ] Importação da planilha atual
