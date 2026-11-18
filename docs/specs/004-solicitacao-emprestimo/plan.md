# Plano — Solicitação imediata de empréstimo

## Aprovação

Rascunho. A implementação não começa antes da aprovação explícita deste plano.

## Restrições de decisão

- Stack, autenticação e propriedade das migrations: ADR-001.
- Equipment/Profile e propriedade de `auth.users`: ADR-005.
- Runtime Frontend e login existente: ADR-007.
- Fluxo imediato e regras de empréstimo: ADR-010.
- SQL versionado somente para RLS, separado das tabelas Prisma: ADR-011.
- Acesso do proprietário e leitura de Operações: ADR-012.
- Modelo mínimo, datas úteis e fuso: ADR-013.
- UUID e timestamps do empréstimo: ADR-016.
- Session Pooler compartilhado como conexão única do Prisma CLI e runtime:
  ADR-014.
- API Nest no mesmo projeto Vercel e acessada sob `/api`: ADR-015.
- O PRD continua exigindo devolução e tela de Operações na v1; ambos são
  adiados apenas deste recorte.

## Fases

1. **Desbloquear inspeção somente de leitura**
   - A conexão ao Session Pooler segue indisponível neste ambiente. A usuária
     autorizou continuar o desenvolvimento offline sem essa inspeção.
   - Usar somente schema, migrations e dados aprovados já presentes nos
     arquivos locais; não tratar esses dados como confirmação do banco remoto.
   - Manter pendentes a inspeção do schema/inventário remoto e qualquer ação
     que dependa de compatibilidade confirmada com o banco.

2. **Modelar e gerar a migration do domínio**
   - Adicionar o modelo de empréstimo ao Prisma conforme ADR-013.
   - Gerar e revisar o SQL de migration usando Prisma CLI.
   - Como não havia histórico local de migrations, gerar a migration inicial
     para os modelos de domínio públicos usando um baseline somente de
     `auth.users`; conferir que o SQL apenas referencia `auth.users` e não o
     cria nem altera.
   - O estado remoto continua desconhecido; não aplicar a migration.
   - Não aplicar a migration a nenhum banco sem confirmação explícita da
     usuária.

3. **Implementar RLS e operação atômica**
   - Criar policies/funções SQL versionadas em `supabase/migrations/`.
   - Restringir identidade, leitura própria, leitura operacional somente de
     empréstimos em aberto e criação concorrente.
   - Não criar ou alterar tabelas/enums/relacionamentos nesta trilha.
   - Antes de integrar o runtime, comprovar que as consultas rodam sob um papel
     sujeito a RLS e que claims/contexto são transacionais. Se a conexão
     privilegiada de `DATABASE_URL` não puder ser restringida com segurança,
     parar e solicitar nova decisão; nunca aceitar bypass de RLS.

4. **Implementar API Nest**
   - Usar a sessão autenticada encaminhada pelo Frontend.
   - Expor catálogo, criação imediata do empréstimo e consulta dos empréstimos
     em aberto do colaborador.
   - Calcular prazo e atraso no fuso e calendário fechados.
   - Publicar sob `/api` no mesmo projeto Vercel e validar a compatibilidade
     do runtime Nest, conforme ADR-015.

5. **Implementar interface do colaborador**
   - Substituir a fonte mock pelo catálogo real.
   - Exibir disponibilidade e impedir solicitações de itens indisponíveis.
   - Exibir confirmação, resultado da solicitação e aba Meus empréstimos.
   - Preservar login, design e fluxo de navegação existentes.

6. **Validar**
   - Cobrir regras de data, limite, atraso, disponibilidade e concorrência com
     Jest e testes de integração apropriados.
   - Confirmar que leitura e criação respeitam RLS e identidade.
   - Executar somente testes locais autorizados; nenhum teste pode escrever
     contra produção.

## Portões

- **G1 — Dados/imagens:** não integrar ativos não encontrados no sistema ou
  não aprovados individualmente. A inspeção do inventário remoto está adiada;
  código local pode prosseguir, mas não se declara o catálogo remoto validado.
- **G2 — Migration:** gerar e revisar o SQL; aguardar confirmação antes de
  aplicá-lo a qualquer banco.
- **G3 — RLS:** validar policies/funções no ambiente local antes de propor
  aplicação em produção e provar que o papel de runtime não pode ignorar RLS;
  produção permanece sob execução manual da usuária.
- **G4 — Código:** aguardar aprovação explícita deste plano antes de começar.
- **G5 — API:** validar que o projeto Vercel suporta o runtime Nest sob `/api`;
  parar e pedir nova decisão se isso exigir outro host, projeto ou prefixo.
