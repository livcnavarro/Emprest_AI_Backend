# Restrições do projeto

Fontes: `AGENTS.md`, `docs/adr/prd.md`, `docs/adr/001-stack.md`, `docs/adr/layout.md`.
`docs/adr/stacks.md` existe e é rascunho até virar ADR. Não use como fonte de decisão nem como restrição.

---

## 1. Este repositório

- Só documentação e decisões. Não escreva código de produto aqui.
- Só criar ADRs novos em `docs/adr/`, numeração sequencial (`002-…`, `003-…`) no padrão de `001-stack.md`.
- Não alterar: `docs/adr/prd.md`, `docs/adr/001-stack.md`, `docs/adr/stacks.md`, `docs/adr/layout.md`.
- ADRs novos têm que ser coerentes com o PRD, o `layout.md` e o ADR-001.
- Quando uma decisão de stack ou de produto fechar na conversa, grave o ADR em `docs/adr/` sem pedir de novo para criar o arquivo.
- Se pedirem código de produto neste repo, ou edição dos arquivos congelados: recuse, diga que este repo é só docs / que aquele arquivo não se edita, e sugira um ADR novo se for decisão de stack.
- Item marcado como não decidido: pare e pergunte. Não escolha sozinho.

---

## 2. Produto (PRD v1)

Controle interno de empréstimo de equipamentos (notebooks, monitores, cabos, câmeras). Hoje isso é planilha compartilhada.

**Papéis**

- Colaborador: vê o catálogo, pede um item emprestado, devolve.
- Operações: cadastra equipamentos, vê quem está com o quê, registra devolução no balcão.

**Primeira versão precisa ter**

1. Login. Cada pessoa vê os próprios empréstimos.
2. Catálogo de equipamentos com a situação de cada um.
3. Solicitar empréstimo de um item disponível.
4. Devolver um item que está comigo.
5. Tela de Operações com todos os empréstimos em aberto.

**Regras de Operações (obrigatórias)**

- No máximo 3 itens por pessoa ao mesmo tempo.
- Prazo padrão de devolução: 14 dias.
- Quem tem item em atraso não pode pegar outro emprestado.
- Equipamento em manutenção não aparece como disponível.

**Fora desta versão (não implementar, não incluir em ADR como escopo da v1)**

- Reserva com data futura.
- Notificação por e-mail.
- Importação da planilha atual.

Critério de sucesso do PRD: Operações abandona a planilha depois de duas semanas de uso.

---

## 3. Stack fechada (ADR-001)

Só a tabela abaixo está decidida.

| Item | Escolha |
| --- | --- |
| Host | Supabase |
| Front | TypeScript, React |
| Back | TypeScript, Nest |
| ORM | Prisma, ZOD |
| Autenticação | RLS |
| Autorização | Supabase |
| Banco | Postgres (Supabase) |
| API | REST, MVC |
| Testes | Jest, Migration |

**Não usar (alternativas descartadas no ADR-001)**

- Host: Vercel, Railway, Fly.io
- Front: Vue, Angular, Svelte, JavaScript puro
- Back: Express, Fastify, JavaScript puro
- ORM / validação: TypeORM, Knex, Drizzle, Joi, Yup
- Auth: Auth0, Clerk
- Banco: MySQL, MongoDB
- API: GraphQL, tRPC, código sem camadas
- Testes: Vitest; migration na mão / SQL solto

**Não decidir sozinho (ADR-001 lista como não decidido)**

- Build e dev server do front
- Roteamento no front
- Estado de servidor e de cliente no front
- Estilização e biblioteca de componentes
- Regras exatas de RLS e autorização por papel
- CI/CD
- Observabilidade / logs
- Estratégia de backup e recuperação
- Modelagem de domínio e tabelas
- Qualquer item fora da tabela de decisões

O ADR-001 afirma ainda: a regra de quem acessa o quê fica no banco (RLS), não espalhada na API; identidade e permissão ficam no Supabase; mudança de schema anda versionada com o código (migration).

---

## 4. Layout (respeitar em ADR novo; não editar o arquivo)

Marca **EMPREST.AI**. Base visual Nocturne: interface escura, densa; acento como linha e brilho, nunca preenchimento sólido de áreas grandes.

**Cor**

- Fundo `#161826`, superfície `#232532`, texto `#e9e9ed`.
- Acento `#2fb8ac`. Botão primário é contorno de 1px sobre transparente.
- Nunca preto puro nem branco puro.
- Texto secundário só por transparência sobre `--color-text`, nunca um cinza novo.
- Situações: disponível/em dia (teal), emprestado/a vencer (âmbar), atraso/erro (vermelho), manutenção/inativo (cinza).

**Tipo e idioma**

- Família única: Raleway (400/500/600/700).
- Interface em português do Brasil; datas `DD/MM/AAAA`; copy direta, sem exclamações e sem emoji.

**Espaço**

- Layout em flex/grid com `gap`; nunca margens por elemento para espaçar irmãos.
- Sem sombras empilhadas.

**Navegação (layout)**

- Colaborador: abas Catálogo, Meus empréstimos.
- Operações: Catálogo, Operações, Equipamentos, Meus empréstimos.
- "Entrar" → Catálogo (Colaborador). "Entrar como Operações" → Operações. "Sair" → Login.
- Troca de tela na mesma janela; o layout afirma que não há rotas aninhadas nem modais empilhados. (Roteamento de framework continua não decidido no ADR-001.)

**Interações da v1 (layout)**

- Solicitar: modal com devolução = hoje + 14 dias; item vira emprestado; toast.
- Devolver (colaborador ou Operações no balcão): item volta a disponível; toast.
- Com 3 itens: botão de solicitar desabilitado, rótulo "Limite de 3 itens".
- Com atraso: botões "Bloqueado por atraso" e banner no catálogo.
- Manutenção: nunca disponível; botão "Indisponível" desabilitado.
- Cadastro: nome obrigatório; categorias Notebook, Monitor, Cabo, Câmera, Acessório; situação inicial Disponível ou Em manutenção.
- Cada usuário vê somente os próprios empréstimos; visão completa só em Operações.

**Animação**

- Só `fadeUp` curto em cards, modal e toast. Toast some em 2600ms.
- Sem animação em KPI, tabela ou navegação. Sem escala, sombra pulsante ou parallax.

Ícones, quando houver: Phosphor Icons.

---

## 5. O que este arquivo não afirma

Nada que só aparece em `docs/adr/stacks.md` (por exemplo escolhas de build, roteador, estado, CSS, componentes, OpenAPI, número de repositórios). Isso permanece rascunho até um ADR novo.
