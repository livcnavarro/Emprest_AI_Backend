# Tarefas — Solicitação imediata de empréstimo

Cada tarefa corresponde a um commit focado e cita os critérios de aceitação da
spec. Executar uma tarefa por vez e seguir `rules/checks.md`.

## Estado

- [ ] **T-01 — Inspecionar catálogo e schema em modo somente leitura**
  - CA: CA-01, CA-02, CA-08, CA-09
  - Confirmar conexão ao Session Pooler; listar schema, equipamentos, imagens
    disponíveis e policies sem imprimir credenciais.
  - Conferir a aprovação individual já registrada em
    `../../../../.github/skills/imagens-equipamentos/assets/approved-selection.json`;
    não substituir imagens existentes.
  - Não executar migration, seed nem escrita.
  - **Status:** inspeção remota adiada por orientação da usuária para permitir
    desenvolvimento offline. A conexão falhou com P1001 antes das consultas;
    schema e inventário remotos permanecem não verificados.

- [x] **T-02 — Modelar empréstimo e gerar migration Prisma**
  - CA: CA-04, CA-05, CA-07, CA-09
  - Implementar o modelo decidido nos ADRs 013 e 016 e gerar migration pelo
    Prisma CLI.
  - Migration inicial gerada offline para Equipment/Profile/Loan; revisão
    confirmou que apenas referencia `auth.users`, sem criar ou alterar objetos
    de `auth`.
  - Não aplicar a migration; o estado remoto não foi verificado e a aplicação
    continua aguardando confirmação explícita da usuária.

- [ ] **T-03 — Versionar policies e operação atômica de RLS**
  - CA: CA-03, CA-05, CA-06, CA-08, CA-09
  - Criar apenas policies/funções em `supabase/migrations/`, conforme ADR-011.
  - Garantir identidade autenticada, leituras autorizadas, limites, atraso e
    exclusão mútua para empréstimos concorrentes.

- [ ] **T-04 — Expor endpoints Nest do fluxo de empréstimo**
  - CA: CA-03, CA-04, CA-05, CA-06, CA-07, CA-08
  - Implementar catálogo, solicitação imediata e consulta dos próprios
    empréstimos abertos sob `/api`, com ZOD e testes Jest.
  - Progresso offline: cálculo de prazo está implementado e coberto por testes.

- [ ] **T-05 — Integrar catálogo e Meus empréstimos no Frontend**
  - CA: CA-01, CA-02, CA-03, CA-04, CA-07, CA-10
  - Remover mocks como fonte de verdade; integrar API, disponibilidade,
    solicitação e listagem sem alterar o login ou introduzir decisões de UI
    não aprovadas.

- [ ] **T-06 — Validar regras e RLS de ponta a ponta**
  - CA: CA-03, CA-04, CA-05, CA-06, CA-07, CA-08, CA-09, CA-10
  - Testar limites, atraso, calendário útil, concorrência, isolamento entre
    usuários e leitura de Operações em ambiente local.
  - Confirmar que nenhuma escrita atingiu produção.
