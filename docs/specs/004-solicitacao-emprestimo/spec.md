# Spec 004 — Solicitação imediata de empréstimo

## Status

Rascunho para revisão do plano. Nenhum código ou migration foi aplicado.

## Fontes

- [PRD](../../../../docs/adr/prd.md) e [layout](../../../../docs/adr/layout.md)
- [ADR-005 — modelo inicial de catálogo e perfil](../../../../docs/adr/005-initial-catalog-profile.md)
- [ADR-007 — runtime do Frontend e login](../../../../docs/adr/007-frontend-runtime-and-auth.md)
- [ADR-008 — solicitações de empréstimo](../../../../docs/adr/008-loan-requests.md), substituído para este fluxo pelos ADRs mais recentes
- [ADR-009 — Session Pooler para Prisma CLI](../../../../docs/adr/009-prisma-cli-session-pooler.md)
- [ADR-010 — empréstimo imediato](../../../../docs/adr/010-immediate-loans.md)
- [ADR-011 — versionamento de RLS](../../../../docs/adr/011-versioning-rls-policies.md)
- [ADR-012 — acesso a empréstimos por RLS](../../../../docs/adr/012-loan-access-rls.md)
- [ADR-013 — registro e prazo do empréstimo](../../../../docs/adr/013-loan-record-and-due-date.md)
- [ADR-014 — Session Pooler para CLI e runtime](../../../../docs/adr/014-session-pooler-runtime.md)
- [ADR-015 — API Nest no mesmo projeto Vercel](../../../../docs/adr/015-nest-api-on-vercel.md)
- [ADR-016 — identificador e timestamps do empréstimo](../../../../docs/adr/016-loan-id-and-timestamps.md)

## Objetivo

Permitir que um colaborador autenticado consulte equipamentos reais do
Supabase, solicite imediatamente um equipamento disponível e acompanhe seus
próprios empréstimos em aberto, sem alterar o login existente nem usar dados
fictícios.

## Decisões de produto confirmadas

- A solicitação cria o empréstimo imediatamente; não há estado Pendente,
  aprovação ou fila.
- Só equipamentos Disponíveis podem ser solicitados. Equipamentos Emprestados
  ou Em manutenção não podem ser solicitados.
- Criação do empréstimo e indisponibilização do equipamento são atômicas; para
  solicitações concorrentes, no máximo uma pode criar empréstimo para o item.
- O limite é de três empréstimos em aberto por pessoa. Empréstimos em atraso
  bloqueiam novas solicitações.
- O prazo é de 14 dias úteis, contando segunda a sexta-feira e sem descontar
  feriados, no fuso `America/Sao_Paulo`.
- O colaborador vê seus empréstimos em aberto e a data prevista de devolução.
- Devolução e interface de Operações estão fora deste recorte, mas continuam
  planejadas para a v1 do PRD. Operações pode ler todos os empréstimos em
  aberto, sem ações de escrita nesta entrega.
- Reserva futura, notificação por e-mail e renovação não fazem parte deste
  recorte.

## Registro do empréstimo

O modelo mínimo contém `id` (UUID), `auth_user_id`, `equipment_patrimony`,
`created_at` (`TIMESTAMPTZ`), `due_date` (`DATE`) e `returned_at`
(`TIMESTAMPTZ`). `returned_at` nulo representa empréstimo em aberto. Não
existe registro Pendente.

## Critérios de aceitação

### CA-01 — Catálogo real

O colaborador autenticado vê equipamentos consultados do sistema, com imagem,
nome, categoria e situação. O Frontend não mantém catálogo mock como fonte de
verdade.

### CA-02 — Imagens aprovadas e catálogo visualmente limpo

Cada foto corresponde ao equipamento real e só é exibida após aprovação
individual da usuária. A interface não exibe rodapé ou texto visual de
crédito. A própria imagem leva à página de origem Pixabay e tem rótulo acessível
de procedência, sem bloco de crédito visível, conforme o procedimento de
imagens do projeto.

### CA-03 — Disponibilidade

Só itens Disponíveis podem ser solicitados. Itens Emprestados ou Em manutenção
aparecem com sua situação e sem ação habilitada para solicitar.

### CA-04 — Criação imediata e prazo

Confirmar a solicitação cria o empréstimo aberto no Supabase, vinculado ao
usuário autenticado e ao patrimônio escolhido. A data prevista é calculada em
14 dias úteis no fuso e calendário definidos pelos ADRs. O modal de confirmação
mostra essa data calculada, não uma soma de 14 dias corridos.

### CA-05 — Limite e atraso

O sistema rejeita a solicitação se a pessoa tiver três empréstimos em aberto
ou algum empréstimo vencido, conforme a data civil de `America/Sao_Paulo`.
Na interface, o limite desabilita a solicitação com o rótulo "Limite de 3
itens"; o atraso mostra "Bloqueado por atraso" e o banner previsto no layout.

### CA-06 — Concorrência

Duas solicitações simultâneas para o mesmo equipamento disponível não podem
criar dois empréstimos. A validação deve ser atômica no banco, não somente na
interface.

### CA-07 — Meus empréstimos

O colaborador consulta somente os próprios empréstimos em aberto, com a data
prevista de devolução.

### CA-08 — RLS e identidade

Policies RLS permitem leitura do catálogo por usuários autenticados, leitura
dos empréstimos pelo proprietário e leitura de todos os empréstimos em aberto
por Operações. A criação usa a identidade autenticada; nenhum usuário pode
criar empréstimo em nome de outra pessoa nem atualizar diretamente a situação
do equipamento para contornar as regras.

### CA-09 — Persistência versionada

Tabelas e relações são versionadas por Prisma. Policies e funções RLS são
versionadas pelo Supabase CLI em `supabase/migrations/`. Nenhuma migration,
seed ou escrita é executada contra produção pelo agente.

### CA-10 — Login e design

O login atual continua funcionando. A interface preserva o design existente,
usa português brasileiro e não introduz rotas, bibliotecas ou decisões de
estilização não aprovadas.

## Fora deste recorte

- Registrar ou encerrar devoluções.
- Interface de Operações ou ações de Operações.
- Reserva com data futura.
- Notificações por e-mail.
- Renovação de empréstimo.

## Bloqueios de execução conhecidos

- A inspeção do Postgres via Prisma CLI ainda falha com P1001, mesmo com TCP
  acessível. Não foi possível confirmar o schema ou o inventário real.
- O estado do catálogo e a aprovação individual das imagens precisam ser
  verificados antes de integrar fotos ou declarar o catálogo concluído.
- A implantação conjunta Frontend/API sob `/api` foi fechada no ADR-015; a
  compatibilidade efetiva do build/runtime ainda precisa ser validada.
- O plano abaixo requer aprovação antes de iniciar tarefas de código.
