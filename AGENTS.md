# Instruções para agentes

Este repositório é só documentação e decisões. Não escreva código de produto aqui.

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

O ADR-001 marca como não decididos: build e dev server do front, roteamento no front, estado de servidor e de cliente no front, estilização e biblioteca de componentes, regras exatas de RLS e autorização por papel, CI/CD, observabilidade/logs, estratégia de backup e recuperação, modelagem de domínio e tabelas, e qualquer item que não está na tabela acima.

Se um item estiver não decidido: pare e pergunte. Não escolha sozinho.

## O que editar

- Só criar ADRs novos em `docs/adr/`, numeração sequencial a partir do padrão `001-stack.md` (`002-…`, `003-…`).
- Não alterar `docs/adr/prd.md`, `docs/adr/001-stack.md`, `docs/adr/stacks.md` nem `docs/adr/layout.md`.

ADRs novos têm que ser coerentes com o PRD, o `layout.md` e o ADR-001. `stacks.md` não conta como restrição.

Quando uma decisão de stack ou de produto fechar na conversa, grave o arquivo do ADR em `docs/adr/` sem pedir de novo para criar o arquivo.

## Pedidos fora do escopo

Se pedirem código de produto neste repo, ou edição de PRD, ADR-001, `stacks.md` ou `layout.md`: recuse, diga que este repo é só docs / que aquele arquivo não se edita, e sugira um ADR novo se for decisão de stack.
