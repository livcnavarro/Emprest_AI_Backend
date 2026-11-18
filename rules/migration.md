# Prisma migrations

Fontes de decisão: `../docs/adr/001-stack.md`,
`../docs/adr/005-initial-catalog-profile.md` e
`../docs/adr/006-vercel-deploy-configuration.md`. Não use
`docs/adr/stacks.md`.

## Modelo e propriedade do schema

- O modelo inicial de `Equipment` e `Profile` está fechado pelo ADR-005.
- Prisma é o único dono das migrations de domínio; gere migrations pelo Prisma
  CLI. Não escreva nem edite SQL de migration manualmente.
- O schema `auth` e `auth.users` pertencem ao Supabase. Uma migration pode
  referenciar a PK existente `auth.users(id)`, mas não pode criar, alterar ou
  assumir propriedade de objetos Auth.
- Antes de aceitar uma migration gerada, confira que ela altera apenas os
  objetos de domínio em `public` e a FK para `auth.users(id)`. Se o fluxo Prisma
  não conseguir respeitar esse limite, pare e peça nova decisão; não contorne
  com SQL manual.
- Não modele nem crie empréstimos nesta carga inicial. O perfil Operações não
  define policies RLS; regras exatas de RLS e autorização continuam pendentes.

## Conexão e execução

- `DATABASE_URL` é uma conexão direta usada pelo Prisma CLI local nesta
  entrega. A usuária configura o valor real em `.env.local`; nunca solicite,
  leia, imprima ou versione esse valor.
- `.env.example` contém somente placeholders e `.env.local` deve permanecer
  ignorado pelo Git.
- Gere e valide a migration apenas no Supabase local após confirmação da
  usuária. Não execute migration, seed ou qualquer escrita contra produção.
- A usuária revisa e executa todas as operações de produção manualmente.
