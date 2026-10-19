# Migration

Fontes: `rules/checks.md`, `AGENTS.md`, `rules/restrictions.md`, `docs/adr/prd.md`, `docs/adr/001-stack.md`, `docs/adr/layout.md`.
Não use `docs/adr/stacks.md`.

Este repositório é só documentação. Não grave schema Prisma, SQL nem código de produto aqui. Modelagem de domínio e tabelas continua não decidida: pare e pergunte; não escolha sozinho.

---

## O que está fechado (ADR-001)

- Banco: Postgres no Supabase. Sem MySQL, MongoDB, nem servidor de banco próprio.
- Schema e acesso: Prisma. Sem TypeORM, Knex, Drizzle.
- Validação na borda da API: ZOD. Sem Joi, Yup.
- Testes: Jest. Sem Vitest. Segunda suíte em paralelo não entra.
- Mudança de schema: migration versionada junto com o código. Dono único: Prisma.
- Sem migration na mão e sem SQL solto: dois donos de schema no mesmo banco se sobrescrevem.
- Adicionar coluna exige o fluxo de migration + validação de schema. Não rodar um script solto.
- Autenticação: RLS no banco, não checagem espalhada na API. Autorização: Supabase. Regras exatas de RLS e de papel não estão decididas.
- Host, auth, autorização e banco no mesmo provedor (Supabase). Sair disso depois tem custo.
- Trocar de ORM depois tem custo: schema e migration ficam no Prisma.

---

## O que a v1 vai precisar persistir (domínio, não tabelas)

O PRD e o layout descrevem fatos de negócio. Isso não é modelagem de tabelas.

**Pessoa / sessão**

- Login. Cada pessoa vê só os próprios empréstimos.
- Papéis: Colaborador e Operações. Visão completa de empréstimos só em Operações.
- Operações cadastra equipamentos e registra devolução no balcão.

**Equipamento**

- Catálogo com situação.
- Tipos no problema do PRD: notebooks, monitores, cabos, câmeras. No cadastro do layout: Notebook, Monitor, Cabo, Câmera, Acessório.
- Cadastro: nome obrigatório; patrimônio (vazio cai para `TI-—` no layout); observações; situação inicial Disponível ou Em manutenção.
- Manutenção não aparece como disponível.

**Empréstimo**

- Solicitar item disponível; prazo padrão 14 dias (layout: devolver até = hoje + 14 dias).
- Devolver (pela pessoa ou no balcão) devolve o item a disponível.
- No máximo 3 itens por pessoa ao mesmo tempo.
- Item em atraso impede novo empréstimo.
- Operações vê todos os empréstimos em aberto.

**Fora da v1 (não migrar, não importar, não versionar como feature)**

- Reserva com data futura.
- Notificação por e-mail.
- Importação da planilha atual. O critério de sucesso do PRD é abandonar a planilha depois de duas semanas de uso, não carregá-la.

---

## O que um ADR de schema/migration precisa passar

Os mesmos checks de `rules/checks.md` que tocam banco:

- Coerente com PRD, layout e tabela do ADR-001.
- Não reabre as alternativas descartadas de ORM, banco, validação, testes e SQL solto.
- Não fecha sozinho: modelagem de tabelas, regras exatas de RLS, CI/CD, backup e recuperação.
- Se falar em mudança de schema: migration versionada no Prisma, com validação (ZOD na borda, Jest na suíte).
- RLS continua no banco.

Quando essa decisão fechar na conversa, grave um ADR novo em `docs/adr/` (`002-…` em diante). Não edite o ADR-001.

---

## Ainda não decidido (não inventar nesta pasta)

- Modelagem de domínio e tabelas
- Regras exatas de RLS e autorização por papel
- CI/CD (quando e como aplicar migration)
- Estratégia de backup e recuperação
- Qualquer comando, pasta ou ferramenta de migrate que não esteja na tabela do ADR-001
