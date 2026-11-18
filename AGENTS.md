# Instruções para agentes

Este é o repositório de código do Emprest.AI Backend. Implemente ou altere
código de produto aqui quando a usuária pedir explicitamente. O repositório de
documentação e decisões fica na pasta irmã `../docs`.

## Documentos

- PRD: `docs/adr/prd.md`
- Stack fechada: tabela de decisões em `docs/adr/001-stack.md`
- Layout: `docs/adr/layout.md`
- `docs/adr/stacks.md` é rascunho até virar ADR. Não use como fonte de decisão.

## Stack fechada (ADR-001)

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

O ADR-001 marca como não decididos: build e dev server do front, roteamento no front, estado de servidor e de cliente no front, estilização e biblioteca de componentes, regras exatas de RLS e autorização por papel, CI/CD, observabilidade/logs, estratégia de backup e recuperação, modelo de empréstimos e qualquer item que não está na tabela acima. O modelo inicial Equipment/Profile foi decidido no ADR-005 da pasta irmã `../docs/adr/`.

Se um item estiver não decidido: pare e pergunte. Não escolha sozinho.

## Escopo e segurança

- Mantenha o código de produto neste repositório Backend; não altere o
  repositório de documentação por tarefas de implementação.
- Trate `../docs/adr/` como fonte de decisões aprovada. As cópias em
  `docs/adr/` não prevalecem sobre decisões mais recentes dessa fonte.
- Não grave, imprima, solicite ou versione valores reais de credenciais.
  `DATABASE_URL` local é configurada pela usuária em `.env.local`.
- Nunca execute migration, seed ou outra escrita contra produção. A usuária
  revisa e executa essas operações.

